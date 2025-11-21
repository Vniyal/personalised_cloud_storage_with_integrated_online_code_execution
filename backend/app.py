import os
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from starlette.responses import JSONResponse, Response
from typing import List, Dict, Any, Optional

# Supabase imports from your old file
from supabase import create_client
from werkzeug.utils import secure_filename # Used for sanitizing filenames

# New Security/Execution Imports (These files must be in the same directory)
from auth import authenticate_user, create_access_token, decode_access_token
from rate_limiter import RateLimiter
from executer import run_user_file, MAX_FILE_SIZE
from logger_db import fetch_recent, init_db

# --- CONFIGURATION ---
# Supabase settings (from your old app.py)
SUPABASE_URL = "https://jukispcmvqxpytjdutfx.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2lzcGNtdnF4cHl0amR1dGZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTg0MzIzOSwiZXhwIjoyMDc1NDE5MjM5fQ.hBdCfY_mh6ZlDS>

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
# FastAPI and Security Setup
app = FastAPI(title="Secure Code Execution & File Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later you can restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Load rate limit config from environment variables or use defaults
limiter = RateLimiter(max_calls=int(os.getenv("RATE_MAX", "5")), period_seconds=int(os.getenv("RATE_PERIOD", "60")))

# Initialize the SQLite database for logging on application startup
init_db()

# --- SECURITY DEPENDENCY ---

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Authenticates user via JWT token and retrieves user data."""
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        if not username:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token (no sub)")
        return {"username": username, "role": payload.get("role", "user")}
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# --- AUTH ROUTES ---

@app.post("/token", tags=["Authentication"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
"""Handles user login and returns a JWT access token."""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer"}

# --- CODE EXECUTION ROUTES ---

@app.post("/execute", tags=["Code Execution"])
async def execute(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Accepts a file, runs it in a secure sandbox, and returns the result."""
    # Basic filename checks
    if not file.filename.endswith((".py", ".c",".cpp",".java",".json")):
        raise HTTPException(status_code=400, detail="Only .py or .c files allowed")
        
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail=f"File too large. Max: {MAX_FILE_SIZE} bytes")

    # Rate limiting (uses the user's username)
    username = current_user["username"]
    if not limiter.allow(username):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again soon.")

    # Run sandbox via the executor module
    rc, out, err = run_user_file(username, file.filename, contents)

    status_str = "success" if rc == 0 else "error"
    return {
        "status": status_str,
        "exit_code": rc,
        "stdout": out,
        "stderr": err
    }

# --- LOGS ROUTE ---

@app.get("/logs", tags=["Admin"])
def get_logs(current_user: dict = Depends(get_current_user), limit: int = 50):
    """Fetches recent execution logs (Admin only)."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden. Admin role required.")
    
    rows = fetch_recent(limit=limit)
    # Map rows to dicts for clean JSON response
    keys = ["id", "username", "filename", "exit_code", "stdout", "stderr", "created_at"]
    return [dict(zip(keys, r)) for r in rows]

# --- SUPABASE FILE ROUTES (Integrated) ---

def get_user_id_from_username(username: str) -> Optional[int]:
    """Helper to fetch the numeric user ID from Supabase based on username."""
    try:
        # Assuming your 'users' table has an 'id' column that is an integer
        res = supabase.table("users").select("id").eq("username", username).limit(1).execute()
        return res.data[0]["id"] if res.data else None
    except Exception:
        # Log this exception in a real application
        return None

@app.post("/upload", tags=["File Storage"])
async def upload_file(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    """Uploads a file to Supabase storage for the authenticated user."""
    username = current_user["username"]
    user_id = get_user_id_from_username(username)
    
    if not user_id:
        raise HTTPException(status_code=404, detail="User not found in Supabase.")

    file_content = await file.read()
    if not file_content:
        raise HTTPException(status_code=400, detail="File content required.")

    # Sanitize filename (important for security)
    filename = secure_filename(file.filename)
    
    try:
        # Upload to Supabase Storage (bucket: 'user-files')
        supabase.storage.from_("user-files").upload(filename, file_content)

        # Store metadata in DB
 supabase.table("files").insert({
            "user_id": user_id,
            "filename": filename,
            "path": f"user-files/{filename}"
        }).execute()

        return JSONResponse(content={"message": "File uploaded successfully!"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@app.get("/download/{filename}", tags=["File Storage"])
async def download_file(filename: str, current_user: dict = Depends(get_current_user)):
    """Downloads a specific file from Supabase storage."""
    # Auth check ensures only logged-in users can download.
    try:
        data = supabase.storage.from_("user-files").download(filename)
        
        if not data:
            raise HTTPException(status_code=404, detail="File not found or unauthorized access.")
        
        # Simple content type; a real app might guess or store this in the DB
        content_type = 'application/octet-stream' 
        
        return Response(content=data, media_type=content_type)
        
    except Exception as e:
        if "The resource was not found" in str(e):
             raise HTTPException(status_code=404, detail="File not found.")
        raise HTTPException(status_code=500, detail=f"Download error: {str(e)}")


@app.get("/files", tags=["File Storage"], response_model=List[str])
async def list_files(current_user: dict = Depends(get_current_user)):
    """Lists files uploaded by the authenticated user."""
    username = current_user["username"]
    user_id = get_user_id_from_username(username)

    if not user_id:
        raise HTTPException(status_code=404, detail="User not found in Supabase.")
        
    try:
        # Select all files belonging to the user
        res = supabase.table("files").select("filename").eq("user_id", user_id).execute()
        
        if res.data:
            return [f["filename"] for f in res.data]
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing files: {str(e)}") 
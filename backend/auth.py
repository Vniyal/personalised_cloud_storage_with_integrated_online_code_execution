import os
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext

# --- Config ---
# JWT Secret should be stored securely and not be this default in production!
JWT_SECRET = os.getenv("EXEC_JWT_SECRET", "changeme_secret_for_demo")
JWT_ALGO = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Hashing context for passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Simple demo user store (Replace with a proper Supabase or other DB lookup in production)
# Note: These are pre-hashed passwords for simplicity in this file.
USERS = {
    # Credentials: admin/adminpass, alice/alicepass, bob/bobpass
    "admin": {"username": "admin", "hashed_password": pwd_context.hash("adminpass"), "role": "admin"},
    "alice": {"username": "alice", "hashed_password": pwd_context.hash("alicepass"), "role": "user"},
    "bob": {"username": "bob", "hashed_password": pwd_context.hash("bobpass"), "role": "user"},
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(username: str, password: str) -> Optional[dict]:
    """Checks credentials against the USERS store."""
    user_data = USERS.get(username)
    if not user_data:
        return None
    # Check stored hashed password
    if not verify_password(password, user_data["hashed_password"]):
        return None
    return {"username": user_data["username"], "role": user_data["role"]}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGO)
    return encoded_jwt

def decode_access_token(token: str) -> dict:
    """Decodes and validates a JWT access token."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
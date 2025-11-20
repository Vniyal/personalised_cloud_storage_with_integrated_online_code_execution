import os
import shutil
import tempfile
import subprocess
from typing import Tuple
from logger_db import insert_log # Dependency on logger_db

# --- Config ---
# These variables should match the image name and file path created in the 'sandbox' folder
SANDBOX_IMAGE = os.getenv("SANDBOX_IMAGE", "code-sandbox:latest")
SECCOMP_PROFILE = os.getenv("SECCOMP_PATH", "sandbox/seccomp.json")
TIMEOUT_SECONDS = int(os.getenv("EXEC_TIMEOUT", "15"))
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", str(256 * 1024)))  # 256 KB limit for user code

def run_user_file(username: str, filename: str, contents: bytes) -> Tuple[int, str, str]:
    """
    Saves file to a temporary directory, runs the secure sandbox Docker container,
    and captures execution results. Logs the attempt and cleans up the temp directory.
    
    The user file is mounted read-only to /tmp/input inside the container.
    """
    tmpdir = tempfile.mkdtemp(prefix="exec_")
    filepath = os.path.join(tmpdir, filename)
    
    rc = -1
    out = ""
    err = ""
    
    try:
        # Write the user's code to the temporary file path
        if len(contents) > MAX_FILE_SIZE:
            raise ValueError(f"File size ({len(contents)} bytes) exceeds limit ({MAX_FILE_SIZE} bytes).")

        with open(filepath, "wb") as f:
            f.write(contents)

        # The Docker command for secure execution:
        # --rm: remove container after exit
        # --network none: fully disable networking
        # --cap-drop ALL: remove all capabilities (root-like powers)
        # --security-opt seccomp: apply syscall filtering
        # --read-only: mount container filesystem read-only
        # -v {tmpdir}:/tmp/input:ro: mount the user's file into /tmp/input read-only
        # SANDBOX_IMAGE: the name of the hardened image
        cmd = [
            "docker", "run", "--rm",
            "--network", "none",
            "--cap-drop", "ALL",
            "--security-opt", "no-new-privileges",
            "--security-opt", f"seccomp={SECCOMP_PROFILE}",
            "--read-only",
            "-v", f"{tmpdir}:/tmp/input:ro",
            SANDBOX_IMAGE,
            filename # Pass the filename to the container's entrypoint script
        ]
        
        # Execute the Docker command
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=TIMEOUT_SECONDS, text=True)
        out = result.stdout.strip()
        err = result.stderr.strip()
        rc = result.returncode

    except subprocess.TimeoutExpired:
        rc = -1
        err = "Timeout"
    except Exception as e:
        rc = -2
        err = f"Execution setup error: {str(e)}"
    finally:
        # Log the result before cleanup
        insert_log(username=username, filename=filename, exit_code=rc, stdout=out, stderr=err)
        # Clean up the temp directory
        shutil.rmtree(tmpdir, ignore_errors=True)
        
    return rc, out, err
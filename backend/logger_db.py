import sqlite3
import threading
from typing import Optional, List, Tuple

DB_PATH = "exec_logs.db"
_lock = threading.Lock()

def init_db():
    """Initializes the SQLite database table for execution logs."""
    with _lock, sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS exec_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            filename TEXT,
            exit_code INTEGER,
            stdout TEXT,
            stderr TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        conn.commit()

def insert_log(username: str, filename: str, exit_code: int, stdout: str, stderr: str):
    """Inserts a new execution log entry."""
    with _lock, sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
        INSERT INTO exec_logs (username, filename, exit_code, stdout, stderr)
        VALUES (?, ?, ?, ?, ?)
        """, (username, filename, exit_code, stdout, stderr))
        conn.commit()

def fetch_recent(limit: int = 50) -> List[Tuple]:
    """Fetches the most recent execution logs."""
    with _lock, sqlite3.connect(DB_PATH) as conn:
        # Retrieve all columns ordered by creation time descending
        cursor = conn.execute("""
        SELECT id, username, filename, exit_code, stdout, stderr, created_at
        FROM exec_logs 
        ORDER BY created_at DESC 
        LIMIT ?
        """, (limit,))
        return cursor.fetchall()
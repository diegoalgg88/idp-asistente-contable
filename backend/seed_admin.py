"""
Seed script to create admin user
Run: .venv\Scripts\python.exe seed_admin.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app.db.database import init_db  # type: ignore

if __name__ == "__main__":
    init_db()

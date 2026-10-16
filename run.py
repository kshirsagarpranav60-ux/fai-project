import os
import sys
from pathlib import Path

# Ensure project root and backend are always in sys.path for cloud hosts (Render/Vercel/Docker)
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

backend_dir = ROOT_DIR / "backend"
if backend_dir.exists() and str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting SkillGap AI Backend on {host}:{port}...")
    uvicorn.run("backend.app.main:app", host=host, port=port)

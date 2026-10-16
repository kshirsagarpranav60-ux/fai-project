import os
import sys
from pathlib import Path

# Ensure project root and backend are always in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent

for p in [ROOT_DIR, CURRENT_DIR]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting SkillGap AI Backend on {host}:{port}...")
    uvicorn.run("backend.app.main:app", host=host, port=port)

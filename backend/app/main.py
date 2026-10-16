from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.connection import SessionLocal, engine, Base
from backend.app.database.seed import seed_database
from backend.app.api.endpoints import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database schemas are created
    Base.metadata.create_all(bind=engine)
    # Seed data if database is fresh
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="SkillGap AI – Backend API",
    description="Explainable Skill-Gap Analysis, Priority Scoring, and Learning Roadmap Engine for FAI",
    version="1.0.0",
    lifespan=lifespan
)

import os

cors_origins_raw = os.getenv("CORS_ORIGINS", "*")
if cors_origins_raw == "*" or not cors_origins_raw.strip():
    origins = ["*"]
    allow_credentials = False
else:
    origins = [orig.strip() for orig in cors_origins_raw.split(",") if orig.strip()]
    allow_credentials = True

# Enable CORS for frontend development and Vercel production deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "product": "SkillGap AI",
        "tagline": "Know where you stand. Know what to learn next.",
        "project": "Fundamentals of Artificial Intelligence (FAI)",
        "docs_url": "/docs",
        "status": "operational"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables (.env in backend or project root)
current_dir = Path(__file__).resolve().parent
env_candidates = [
    Path.cwd() / ".env",
    current_dir.parent.parent / ".env",          # backend/.env
    current_dir.parent.parent.parent / ".env",   # project root .env
]
for env_file in env_candidates:
    if env_file.is_file():
        load_dotenv(dotenv_path=env_file, override=False)

# PostgreSQL database connection URL (Prisma Accelerate / Pooled Postgres)
DEFAULT_DATABASE_URL = (
    "postgres://e31b27023ff310571efe5951e5d16ca5e574e7da59700384df0fea04cd3c1959:"
    "sk_kUwjleCGJyt9HhV5Ye9Tw@pooled.db.prisma.io:5432/postgres?sslmode=require"
)

DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL).strip()

# SQLAlchemy 1.4+ / 2.0+ requires 'postgresql://' instead of legacy 'postgres://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Ensure driver compatibility if standard postgresql:// scheme is used
if DATABASE_URL.startswith("postgresql://"):
    try:
        import psycopg  # psycopg v3
    except ImportError:
        try:
            import psycopg2  # psycopg v2 fallback
            DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
        except ImportError:
            pass

# Create SQLAlchemy engine with connection pool recycling and pre-ping for cloud-hosted pooled databases
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


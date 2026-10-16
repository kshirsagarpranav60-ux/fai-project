# SkillGap AI – AI Skill Gap Analyzer & Learning Roadmap
> **College Fundamentals of Artificial Intelligence (FAI) Project**  
> *"Know where you stand. Know what to learn next."*

SkillGap AI is a full-stack web application designed to analyze the gap between a student or professional's current competencies and the industry expectations for a target career path, then generate an explainable, personalized 4-phase learning roadmap.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+ (Tested on Python 3.14)
- **Node.js**: 20+ (Node.js and npm)

### 1. Backend Setup (FastAPI & PostgreSQL)
```bash
# Navigate to project root
cd "FAI PROJECT"

# Install backend dependencies (including PostgreSQL drivers & python-dotenv)
python -m pip install -r backend/requirements.txt

# Start the FastAPI backend server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend automatically connects to the PostgreSQL database (configured via `.env`), creates all required schemas, and seeds 16 O\*NET occupations, 40 granular skills, prerequisite DAGs, learning resources, and demo user Alex Chen on first startup.*

API Documentation is live at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)


### 2. Frontend Setup (React, Vite, TypeScript & Tailwind CSS)
```bash
# In a new terminal, navigate to the frontend directory
cd "FAI PROJECT/frontend"

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser and navigate to: **[http://127.0.0.1:5173](http://127.0.0.1:5173)**

---

## ⚡ 1-Click College Presentation Demo Mode
During a college viva or evaluation, you can skip manual data entry:
1. Click the green **"Try Demo"** button in the top navigation bar or landing hero.
2. The system instantly loads **Alex Chen** (Undergraduate, 3rd Year B.Tech in Artificial Intelligence & Data Science) targeting **Data Scientist**.
3. It immediately presents:
   - Overall Skill Alignment / Career Readiness Score
   - Category breakdowns (Technical, Data, AI/ML, Tools, Soft Skills)
   - 5 Interactive Recharts (Radar, Top Gaps, Category Bar, Priority Matrix, Progress Curve)
   - Top 5 Priority Skills drill-downs
   - Prerequisite DAG integrity warnings
   - 4-Phase Learning Roadmap with interactive checkboxes
   - Historical Before vs After comparison (+7% readiness gain)

---

## 🧠 System Architecture & FAI Principles

```
USER PROFILE ➔ TARGET CAREER ➔ REQUIRED SKILLS ➔ CURRENT SKILLS ➔ GAP ANALYSIS
      ➔ PRIORITY SCORING ➔ PERSONALIZED RECOMMENDATIONS ➔ LEARNING ROADMAP
      ➔ PROGRESS TRACKING ➔ REASSESSMENT
```

### Deterministic Core vs. Generative AI Layer
SkillGap AI adheres to strict academic explainability principles. **No LLM randomly invents user scores.**

| Component | Engine Type | Rationale |
| :--- | :--- | :--- |
| **Skill Normalization & Matching** | Deterministic Code | Exact matching against canonical taxonomy |
| **Gap Calculation & Alignment** | Deterministic Formulas | Verifiable, auditable mathematical formulas |
| **Priority Scoring (P)** | Deterministic Heuristic | Weighted by role importance & WEF future demand |
| **Dependency Checks** | Deterministic DAG Graph | Prevents advanced modules without basic foundations |
| **Resume & JD Text Parsing** | Hybrid (PyPDF + Regex/LLM) | Extracts phrases into structured competencies |
| **Natural Language Explanations** | AI Service Abstraction | Context-grounded advice based on structured engine data |
| **SkillGap AI Assistant** | AI Service / Local Fallback | Interactive pedagogical mentor |

---

## 📐 Scoring Algorithm & Mathematical Formulation

### 1. Skill Gap (G) & Gap Percentage (G%)
For each required skill $i$:
$$G_i = \max(R_i - C_i, 0)$$
$$G\%_i = \left(\frac{G_i}{R_i}\right) \times 100 \quad (\text{for } R_i > 0)$$
- $R_i$: Benchmark Required Proficiency (1–5)
- $C_i$: Learner's Assessed Proficiency (0–5)

### 2. Priority Scoring Index (P)
$$P_{\text{raw}} = G\%_i \times W_{\text{importance}, i} \times \left(1.0 + 0.3 \times W_{\text{future}, i}\right)$$
$$P = \text{clamp}\left(\frac{P_{\text{raw}}}{1.3}, 0, 100\right)$$
- $W_{\text{importance}}$: Role criticality weight (0.0–1.0)
- $W_{\text{future}}$: World Economic Forum future-demand weight (0.0–1.0)

**Priority Tiers:**
- $P \ge 70$: **Critical Priority** (Red)
- $45 \le P < 70$: **High Priority** (Orange)
- $25 \le P < 45$: **Medium Priority** (Yellow)
- $P < 25$: **Low Priority** (Blue/Green)

### 3. Overall Career Readiness / Skill Alignment Score
$$\text{Skill Alignment Score} = \left(\frac{\sum_{i} \left[\min\left(\frac{C_i}{R_i}, 1.0\right) \times W_{\text{importance}, i}\right]}{\sum_{i} W_{\text{importance}, i}}\right) \times 100$$

> **Mandatory Disclaimer:** This score measures alignment with the selected skill profile. It is not an employment prediction or guarantee of salary outcomes.

---

## 🗄️ Database Schema & Taxonomy Data Sources
The PostgreSQL database implements 15 relational tables via SQLAlchemy:
- `users`, `occupations`, `skills`, `skill_categories`, `occupation_skills`
- `user_skills`, `assessments`, `assessment_results`, `user_progress`
- `learning_resources`, `projects`, `skill_dependencies`
- `job_descriptions`, `job_description_skills`, `resume_extractions`

### Standard Data Grounding:
- **O\*NET (U.S. Department of Labor)**: Occupational codes (e.g., 15-2051.00 for Data Scientist), required proficiencies, and tools.
- **ESCO (European Commission)**: Skill categories and multilingual hierarchical taxonomy.
- **World Economic Forum (WEF) Future of Jobs**: Contextual future-demand weighting multipliers.
*(Note: SkillGap AI is an independent academic project and not officially affiliated with these organizations).*

---

## 🤖 Environment Variables & AI Fallback
SkillGap AI supports remote LLM integration via environment variables:

```bash
# Optional: Set in backend terminal or environment
export GEMINI_API_KEY="your-gemini-key"
# or
export OPENAI_API_KEY="your-openai-key"
```

**Zero Crash Guarantee:** If no API key is configured or network calls fail, the backend automatically and seamlessly switches to **Deterministic Local Fallback Mode**. The application functions with 100% feature completeness offline.

---

## 🌐 Production Deployment Guide (Render & Vercel)

This application is architected for cloud-native deployment:
- **Backend API**: Hosted on **[Render](https://render.com)** (FastAPI + Uvicorn)
- **Frontend App**: Hosted on **[Vercel](https://vercel.com)** (React + Vite SPA)
- **Database**: Cloud **PostgreSQL** (Prisma Accelerate / Pooled Postgres)

```
┌──────────────────────────┐         API Requests         ┌──────────────────────────┐
│   Vercel (Frontend)      │ ───────────────────────────> │    Render (Backend)      │
│  React + Vite SPA        │   (HTTPS + CORS Allowed)     │    FastAPI + Uvicorn     │
│  https://*.vercel.app    │                              │ https://*.onrender.com   │
└──────────────────────────┘                              └────────────┬─────────────┘
                                                                       │ SQLAlchemy
                                                                       ▼ (SSL Pooled)
                                                          ┌──────────────────────────┐
                                                          │   Cloud PostgreSQL DB    │
                                                          │  (Prisma / Neon / Supa)  │
                                                          └──────────────────────────┘
```

---

### Part 1: Deploy Backend on Render

#### Step 1: Create a Render Web Service
1. Push your repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **"New +"** -> **"Web Service"**.
3. Connect your GitHub repository.

#### Step 2: Configure Service Settings
| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Name** | `skillgap-ai-backend` | Or any unique name |
| **Region** | `Oregon (US West)` | Select region closest to your DB |
| **Branch** | `main` | Production branch |
| **Root Directory** | *(leave blank / repo root)* | Imports `backend.app.main:app` |
| **Runtime** | `Python 3` | Python 3.10+ |
| **Build Command** | `pip install -r requirements.txt` | Installs FastAPI, psycopg, SQLAlchemy |
| **Start Command** | `python run.py` | Automatically binds to dynamic Render `$PORT` and resolves package paths |
| **Instance Type** | `Free` | Compatible with free tier |

> **Pro Tip (1-Click Blueprint):** Render also supports [`render.yaml`](file:///render.yaml). You can alternatively click **"New +" -> "Blueprint"** in Render to configure this service in 1 click!

#### Step 3: Set Backend Environment Variables in Render
In the **Environment** tab of your Render Web Service, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgres://e31b27023ff310571efe5951e5d16ca5e574e7da59700384df0fea04cd3c1959:sk_kUwjleCGJyt9HhV5Ye9Tw@pooled.db.prisma.io:5432/postgres?sslmode=require` | Your PostgreSQL connection URL |
| `PYTHONPATH` | `.` | Ensures Python finds the backend package on Linux |
| `PYTHON_VERSION` | `3.11.9` | Python runtime version |
| `CORS_ORIGINS` | `*` *(or your Vercel URL once generated)* | Allowed cross-origin domains |

#### Step 4: Verify Backend Health
Once Render finishes deploying (Status: **Live**), visit:
- Health check: `https://<your-service>.onrender.com/api/health` -> `{"status":"ok","version":"1.0.0"}`
- Interactive Swagger Docs: `https://<your-service>.onrender.com/docs`

---

### Part 2: Deploy Frontend on Vercel

#### Step 1: Import Project into Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
2. Select your GitHub repository.

#### Step 2: Configure Build & Output Settings
- **Framework Preset**: `Vite` (auto-detected)
- **Root Directory**: Click **Edit** and select **`frontend`**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 3: Add Environment Variables in Vercel
In the **Environment Variables** section before deploying, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://<your-service>.onrender.com/api` | **Replace with your live Render backend URL + `/api`** |
| `VITE_APP_TITLE` | `SkillGap AI` | App title |

> [!IMPORTANT]
> Ensure `VITE_API_BASE_URL` does NOT end with a trailing slash.
> Correct: `https://skillgap-ai-backend.onrender.com/api`

#### Step 4: Deploy & Verify
1. Click **Deploy**. Vercel will install dependencies and compile the bundle in ~30 seconds.
2. The included [`frontend/vercel.json`](file:///frontend/vercel.json) handles Single Page Application route rewrites so direct navigation and refreshes never 404.
3. Open your live Vercel URL (e.g. `https://skillgap-ai.vercel.app`) and click **"Try Demo"** to confirm end-to-end cloud database integration!

---

### Part 3: Environment Variables Matrix

| Variable | Scope | Where to Set | Example Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Backend | `.env` / Render Env | `postgres://user:pass@host:5432/db?sslmode=require` |
| `PORT` | Backend | Render automatic | Render injects this dynamically |
| `CORS_ORIGINS` | Backend | `.env` / Render Env | `*` or `https://your-app.vercel.app` |
| `VITE_API_BASE_URL` | Frontend | `frontend/.env` / Vercel Env | Local: `/api`<br>Production: `https://<backend>.onrender.com/api` |
| `VITE_BACKEND_URL` | Frontend | `frontend/.env` (Local only) | `http://127.0.0.1:8000` |
| `GEMINI_API_KEY` | Backend | Optional (.env / Render) | *(Optional Google Gemini API Key)* |

---

## 📂 Project Structure
```
FAI PROJECT/
├── backend/
│   ├── .env.example      # Backend environment variables template
│   ├── requirements.txt  # Python dependencies (FastAPI, psycopg, SQLAlchemy, etc.)
│   └── app/
│       ├── api/          # FastAPI routers (assessments, careers, roadmap, resume, chat)
│       ├── database/     # PostgreSQL SQLAlchemy connection & seed script
│       ├── models/       # 15 SQLAlchemy database models
│       ├── schemas/      # Pydantic v2 schemas
│       ├── services/     # Engine, Roadmap generator, Resume & JD parsers
│       ├── ai/           # AI service abstraction with fallback
│       └── main.py       # FastAPI application entry point with CORS
├── frontend/
│   ├── .env.example      # Frontend environment variables template
│   ├── vercel.json       # Vercel SPA routing configuration
│   └── src/
│       ├── charts/       # 5 Recharts components (Radar, Bar, Scatter, Area)
│       ├── components/   # Navbar, Sidebar, SkillDetailModal, AIAssistantDrawer
│       ├── context/      # SkillGapContext state management
│       ├── pages/        # 16 full-featured pages (Landing, Wizard, Dashboard, etc.)
│       ├── services/     # Frontend API client with VITE_API_BASE_URL support
│       └── types/        # TypeScript interfaces
├── .env.example          # Root environment template
├── Procfile              # Render / Web process definition
├── render.yaml           # Render 1-Click Blueprint specification
├── vercel.json           # Root Vercel deployment fallback
├── requirements.txt      # Root Python dependencies
├── test_pipeline.py     # End-to-end automated pipeline test suite
└── README.md             # Complete documentation and deployment guide
```

---

## 📋 Implemented Features Checklist
- [x] Full-Stack Architecture (FastAPI + React 18 + TypeScript + Vite + Tailwind CSS)
- [x] Cloud PostgreSQL Database (Prisma Accelerate / pooled SSL connection)
- [x] SQLite completely removed and purged
- [x] Production Deployment Ready for Render (Backend) and Vercel (Frontend)
- [x] Deterministic mathematical skill-gap engine
- [x] 1-Click Presentation Demo Mode (Alex Chen -> Data Scientist)
- [x] Recharts: Radar chart, Horizontal Gap bar chart, Category alignment, Priority matrix, Progress time curve
- [x] Step-by-Step Assessment Wizard with progress percentage
- [x] Skill Detail modal (Why it matters, prerequisites, 5-step learning sequence, estimated hours)
- [x] Interactive Skill Dependency DAG with weak prerequisite warnings
- [x] 4-Phase Personalized Roadmap with weekly study hour calibration and task checkboxes
- [x] Career Matching ("Which Career Fits Me?") ranking all 16 careers
- [x] PDF Resume extraction with user confirmation checkboxes
- [x] Job Description Analyzer with match score %, matched ✓, partial ◐, missing ✗ skills
- [x] Longitudinal Progress Tracking and Reassessment Before vs After comparison (+7% gain)
- [x] SkillGap AI Assistant panel with quick prompt chips
- [x] FAI 9-Step Pipeline page, Scoring Algorithm page, Data Sources page
- [x] Admin Dashboard for CRUD on careers and skills
- [x] 1-Click Export Analysis Report (.txt download & printable view)
- [x] Local Heuristic AI fallback ensuring zero-crash offline execution


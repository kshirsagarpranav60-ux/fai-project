# SkillGap AI – AI Skill Gap Analyzer & Learning Roadmap
> **College Fundamentals of Artificial Intelligence (FAI) Project**  
> *"Know where you stand. Know what to learn next."*

SkillGap AI is a full-stack web application designed to analyze the gap between a student or professional's current competencies and the industry expectations for a target career path, then generate an explainable, personalized 4-phase learning roadmap.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10+ (Tested on Python 3.14)
- **Node.js**: 20+ (Node.js and npm)

### 1. Backend Setup (FastAPI & SQLite)
```bash
# Navigate to project root
cd "FAI PROJECT"

# Install backend dependencies
python -m pip install fastapi uvicorn pydantic sqlalchemy python-multipart pypdf httpx

# Start the FastAPI backend server
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
*The backend automatically creates the SQLite database (`skillgap.db`) and seeds 16 O\*NET occupations, 40 granular skills, prerequisite DAGs, learning resources, and demo user Alex Chen on first startup.*

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
The SQLite database implements 15 relational tables via SQLAlchemy:
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

## 📂 Project Structure
```
FAI PROJECT/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (assessments, careers, roadmap, resume, chat)
│   │   ├── database/     # SQLAlchemy connection and seed script
│   │   ├── models/       # 15 SQLAlchemy database models
│   │   ├── schemas/      # Pydantic v2 schemas
│   │   ├── services/     # Engine, Roadmap generator, Resume & JD parsers
│   │   ├── ai/           # AI service abstraction with fallback
│   │   └── main.py       # FastAPI application entry point
├── frontend/
│   ├── src/
│   │   ├── charts/       # 5 Recharts components (Radar, Bar, Scatter, Area)
│   │   ├── components/   # Navbar, Sidebar, SkillDetailModal, AIAssistantDrawer
│   │   ├── context/      # SkillGapContext state management
│   │   ├── pages/        # 16 full-featured pages (Landing, Wizard, Dashboard, etc.)
│   │   ├── services/     # Frontend API client
│   │   └── types/        # TypeScript interfaces
├── test_pipeline.py     # End-to-end automated pipeline test suite
└── README.md
```

---

## 📋 Implemented Features Checklist
- [x] Full-Stack Architecture (FastAPI + React 18 + TypeScript + Vite + Tailwind CSS)
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

# fai-project

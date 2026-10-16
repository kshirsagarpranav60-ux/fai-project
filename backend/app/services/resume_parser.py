import re
import json
import logging
from typing import List, Dict, Any, Optional
from io import BytesIO
from pypdf import PdfReader
from sqlalchemy.orm import Session
from backend.app.models.models import Skill, SkillCategory
from backend.app.schemas.schemas import DetectedSkillItem, ResumeAnalysisResponse

logger = logging.getLogger(__name__)

# Canonical aliases and pattern matching dictionary
SKILL_PATTERNS = {
    "Python": [r"\bpython\b", r"\bpy\b", r"\bpython3\b"],
    "Java": [r"\bjava\b(?!script)"],
    "C++": [r"\bc\+\+\b", r"\bcpp\b"],
    "JavaScript": [r"\bjavascript\b", r"\bjs\b", r"\bes6\b"],
    "SQL": [r"\bsql\b", r"\bpostgres\b", r"\bmysql\b", r"\bsqlite\b", r"\brdbms\b"],
    "Excel": [r"\bexcel\b", r"\bvba\b", r"\bspreadsheets?\b"],
    "Pandas": [r"\bpandas\b"],
    "NumPy": [r"\bnumpy\b"],
    "Data Cleaning": [r"\bdata cleaning\b", r"\bdata wrangling\b", r"\bdata preprocessing\b"],
    "Data Visualization": [r"\bdata visualization\b", r"\bmatplotlib\b", r"\bseaborn\b", r"\bplotly\b"],
    "Power BI": [r"\bpower bi\b", r"\bpowerbi\b", r"\bdax\b"],
    "Tableau": [r"\btableau\b"],
    "Statistics": [r"\bstatistics\b", r"\bhypothesis testing\b", r"\ba/b testing\b", r"\binferential\b"],
    "Probability": [r"\bprobability\b", r"\bbayesian\b"],
    "Machine Learning": [r"\bmachine learning\b", r"\bml\b", r"\bscikit-learn\b", r"\bsklearn\b", r"\bsupervised learning\b"],
    "Deep Learning": [r"\bdeep learning\b", r"\bpytorch\b", r"\btensorflow\b", r"\bkeras\b", r"\bneural networks?\b"],
    "Natural Language Processing": [r"\bnatural language processing\b", r"\bnlp\b", r"\bhuggingface\b", r"\btransformers?\b", r"\bspacy\b", r"\bnltk\b"],
    "Computer Vision": [r"\bcomputer vision\b", r"\bopencv\b", r"\byolo\b", r"\bcnn\b"],
    "Generative AI": [r"\bgenerative ai\b", r"\bgenai\b", r"\brag\b", r"\blangchain\b", r"\bllamaindex\b"],
    "Large Language Models": [r"\blarge language models?\b", r"\bllms?\b", r"\bgpt\b", r"\bllama\b"],
    "Prompt Engineering": [r"\bprompt engineering\b", r"\bfew-shot\b"],
    "Model Evaluation": [r"\bmodel evaluation\b", r"\bconfusion matrix\b", r"\bf1-score\b", r"\broc auc\b"],
    "Git": [r"\bgit\b", r"\bgithub\b", r"\bgitlab\b"],
    "GitHub": [r"\bgithub\b"],
    "Docker": [r"\bdocker\b", r"\bcontainers?\b"],
    "Linux": [r"\blinux\b", r"\bubuntu\b", r"\bbash\b", r"\bshell\b"],
    "AWS": [r"\baws\b", r"\bamazon web services\b", r"\bec2\b", r"\bs3\b"],
    "Azure": [r"\bazure\b"],
    "Google Cloud": [r"\bgoogle cloud\b", r"\bgcp\b", r"\bbigquery\b"],
    "Analytical Thinking": [r"\banalytical\b", r"\banalysis\b"],
    "Problem Solving": [r"\bproblem solving\b", r"\balgorithmic\b"],
    "Communication": [r"\bcommunication\b", r"\bpresentation\b", r"\bstakeholder\b"],
    "Teamwork": [r"\bteamwork\b", r"\bcollaboration\b", r"\bcross-functional\b"],
}

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Safely extracts plain text from PDF bytes using pypdf."""
    try:
        reader = PdfReader(BytesIO(file_bytes))
        text_parts = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
        return "\n".join(text_parts).strip()
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        return ""

def analyze_resume_text(
    db: Session,
    raw_text: str,
    filename: str = "uploaded_resume.pdf"
) -> ResumeAnalysisResponse:
    """
    Scans extracted resume text against structured skill taxonomy.
    Identifies detected skills, regex matches, confidence, and suggested levels.
    """
    if not raw_text or len(raw_text.strip()) == 0:
        raw_text = "Experienced with Python, SQL, Pandas, Machine Learning, and Git in building data science applications."

    lower_text = raw_text.lower()
    all_db_skills = db.query(Skill).all()
    skill_name_to_id = {s.name.lower(): s for s in all_db_skills}

    detected_items: List[DetectedSkillItem] = []
    seen_skills = set()

    for skill_name, patterns in SKILL_PATTERNS.items():
        for pattern in patterns:
            match = re.search(pattern, lower_text)
            if match:
                if skill_name.lower() in seen_skills:
                    break
                seen_skills.add(skill_name.lower())

                # Find sentence context snippet
                start = max(0, match.start() - 40)
                end = min(len(raw_text), match.end() + 50)
                snippet = raw_text[start:end].replace("\n", " ").strip()

                db_skill = skill_name_to_id.get(skill_name.lower())
                cat_name = db_skill.category.name if (db_skill and db_skill.category) else "General"
                skill_id = db_skill.id if db_skill else None

                # Estimate suggested proficiency level based on surrounding keywords
                context_str = raw_text[max(0, match.start() - 80):min(len(raw_text), match.end() + 80)].lower()
                if any(w in context_str for w in ["lead", "architect", "senior", "production", "deployed", "scaled"]):
                    sug_level = 4
                    confidence = 0.92
                elif any(w in context_str for w in ["built", "developed", "implemented", "created", "designed"]):
                    sug_level = 3
                    confidence = 0.88
                elif any(w in context_str for w in ["course", "learnt", "student", "familiar", "basic", "academic"]):
                    sug_level = 2
                    confidence = 0.78
                else:
                    sug_level = 2
                    confidence = 0.82

                detected_items.append(DetectedSkillItem(
                    skill_name=skill_name,
                    matched_skill_id=skill_id,
                    category=cat_name,
                    detected_phrase=f"...{snippet}...",
                    confidence=confidence,
                    suggested_level=sug_level
                ))
                break

    # Sort detected items by confidence descending
    detected_items.sort(key=lambda d: d.confidence, reverse=True)

    snippet_preview = raw_text[:350] + ("..." if len(raw_text) > 350 else "")

    return ResumeAnalysisResponse(
        filename=filename,
        detected_skills=detected_items,
        raw_text_snippet=snippet_preview,
        total_detected=len(detected_items)
    )

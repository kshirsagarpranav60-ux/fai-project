import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import Skill, UserSkill
from backend.app.schemas.schemas import JDAnalysisResponse, JDSkillAnalysis
from backend.app.services.resume_parser import SKILL_PATTERNS

def parse_and_match_job_description(
    db: Session,
    raw_text: str,
    user_skill_levels: Dict[int, int],
    job_title: str = "Senior AI / Data Analyst",
    company: str = "Tech Innovations Inc."
) -> JDAnalysisResponse:
    """
    Parses a posted job description, detects required vs preferred skills,
    compares them directly against the user's assessed proficiency,
    and returns Job Match Score, Matched, Partial, and Missing skills.
    """
    text_lower = raw_text.lower()

    # Detect skills present in the JD
    all_db_skills = db.query(Skill).all()
    skill_map = {s.name.lower(): s for s in all_db_skills}

    detected_in_jd = []
    
    # Heuristics for "Required" vs "Preferred / Nice to have"
    # Search if skill appears after keywords like 'nice to have', 'preferred', 'bonus', 'plus'
    preferred_split = re.split(r"(preferred|nice to have|plus|bonus|optional):", text_lower)
    preferred_section = preferred_split[2] if len(preferred_split) > 2 else ""

    for skill_name, patterns in SKILL_PATTERNS.items():
        found = False
        for p in patterns:
            if re.search(p, text_lower):
                found = True
                break
        if found:
            is_preferred = bool(preferred_section and any(re.search(p, preferred_section) for p in patterns))
            detected_in_jd.append({
                "skill_name": skill_name,
                "is_required": not is_preferred
            })

    # If no skills detected, fallback to sample tech requirements
    if not detected_in_jd:
        detected_in_jd = [
            {"skill_name": "Python", "is_required": True},
            {"skill_name": "SQL", "is_required": True},
            {"skill_name": "Machine Learning", "is_required": True},
            {"skill_name": "Statistics", "is_required": True},
            {"skill_name": "AWS", "is_required": False},
            {"skill_name": "Docker", "is_required": False},
            {"skill_name": "Git", "is_required": False},
        ]

    matched_list: List[str] = []
    partial_list: List[str] = []
    missing_list: List[str] = []
    skills_detail: List[JDSkillAnalysis] = []

    total_weight = 0.0
    earned_weight = 0.0

    for item in detected_in_jd:
        s_name = item["skill_name"]
        is_req = item["is_required"]
        weight = 1.0 if is_req else 0.5
        total_weight += weight

        db_skill = skill_map.get(s_name.lower())
        user_lvl = 0
        if db_skill and db_skill.id in user_skill_levels:
            user_lvl = user_skill_levels[db_skill.id]

        # Classification:
        # level >= 3 -> matched (100% credit)
        # level in [1, 2] -> partial (50% credit)
        # level == 0 -> missing (0% credit)
        if user_lvl >= 3:
            status = "matched"
            earned_weight += weight * 1.0
            matched_list.append(s_name)
        elif user_lvl in [1, 2]:
            status = "partial"
            earned_weight += weight * 0.5
            partial_list.append(s_name)
        else:
            status = "missing"
            missing_list.append(s_name)

        skills_detail.append(JDSkillAnalysis(
            skill_name=s_name,
            is_required=is_req,
            status=status,
            current_level=user_lvl,
            description="Meets job expectations" if status == "matched" else ("Needs moderate upskilling" if status == "partial" else "Crucial gap to acquire")
        ))

    match_score = round((earned_weight / total_weight) * 100.0, 1) if total_weight > 0 else 0.0

    # Top recommendations to improve
    top_recommendations = []
    # Missing required skills first, then missing preferred, then partial
    missing_req = [s["skill_name"] for s in detected_in_jd if s["is_required"] and s["skill_name"] in missing_list]
    for m in missing_req[:3]:
        top_recommendations.append(f"High Priority: Prioritize learning {m} (required by recruiter)")
    for p in partial_list[:2]:
        top_recommendations.append(f"Strengthen {p} from intermediate to advanced level to fully satisfy criteria")

    summary = (
        f"You match {len(matched_list)} requirements fully and {len(partial_list)} partially. "
        f"Addressing {', '.join(missing_list[:2]) if missing_list else 'advanced skills'} will maximize your interview readiness."
    )

    return JDAnalysisResponse(
        job_title=job_title,
        company=company,
        match_score=match_score,
        summary=summary,
        matched_skills=matched_list,
        partial_skills=partial_list,
        missing_skills=missing_list,
        skills_detail=skills_detail,
        top_recommendations=top_recommendations
    )

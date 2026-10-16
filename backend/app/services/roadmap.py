import math
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import Occupation, Skill, LearningResource, Project, UserProgress
from backend.app.schemas.schemas import RoadmapResponse, RoadmapPhase, RoadmapTask, SkillGapDetail

def generate_personalized_roadmap(
    db: Session,
    occupation: Occupation,
    skill_gaps: List[SkillGapDetail],
    weekly_hours: int = 10,
    user_id: Optional[int] = None
) -> RoadmapResponse:
    """
    Generates a personalized learning roadmap partitioned into sequential phases:
    1. Foundation (Core languages, basic data structures, math/stats)
    2. Data Engineering & Analysis (Data processing, SQL, visualization)
    3. Core Specialization / Machine Learning (Models, algorithms, domain tools)
    4. Production, Capstone & Portfolio (End-to-end system design & projects)
    
    Dynamically sizes weeks based on user's weekly available hours.
    """
    if weekly_hours <= 0:
        weekly_hours = 10

    # Categorize gaps that actually require learning (gap > 0)
    needed_gaps = [g for g in skill_gaps if g.gap > 0]
    
    # If user already mastered everything, include mastery tasks or review
    if not needed_gaps:
        needed_gaps = skill_gaps[:4]

    # Partition skills into 4 pedagogical phases
    phase1_skills = []
    phase2_skills = []
    phase3_skills = []
    phase4_skills = []

    foundation_categories = {"Programming"}
    data_categories = {"Data"}
    specialization_categories = {"AI / ML", "Cloud / DevOps"}
    tools_soft_categories = {"Tools", "Soft Skills"}

    for g in needed_gaps:
        cat = g.category
        if cat in foundation_categories or g.skill_name in ["Python", "Java", "C++", "JavaScript", "NumPy"]:
            phase1_skills.append(g)
        elif cat in data_categories or g.skill_name in ["SQL", "Pandas", "Statistics", "Data Cleaning", "Data Visualization", "Power BI", "Tableau"]:
            phase2_skills.append(g)
        elif cat in specialization_categories or g.skill_name in ["Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "Generative AI"]:
            phase3_skills.append(g)
        else:
            phase4_skills.append(g)

    # If any phase is empty, distribute gracefully
    if not phase1_skills and needed_gaps:
        phase1_skills.append(needed_gaps[0])
    if not phase3_skills and len(needed_gaps) > 1:
        phase3_skills.append(needed_gaps[1])

    # Get completed task ids if user exists
    completed_skills = set()
    if user_id:
        progress_items = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.completed_tasks_count > 0
        ).all()
        for p in progress_items:
            completed_skills.add(p.skill_id)

    # Fetch resources and projects to associate
    resources = db.query(LearningResource).all()
    resource_by_skill: Dict[int, LearningResource] = {r.skill_id: r for r in resources if r.skill_id}
    projects = db.query(Project).all()
    project_by_skill_name: Dict[str, Project] = {p.primary_skill.lower(): p for p in projects if p.primary_skill}

    def build_tasks_for_skills(skill_list: List[SkillGapDetail], phase_num: int) -> List[RoadmapTask]:
        tasks: List[RoadmapTask] = []
        for idx, g in enumerate(skill_list):
            res = resource_by_skill.get(g.skill_id)
            proj = project_by_skill_name.get(g.skill_name.lower())
            
            # Hours based on gap magnitude
            est_hrs = max(8, g.gap * 10)
            diff = "Beginner" if phase_num == 1 else ("Intermediate" if phase_num in [2, 3] else "Advanced")
            
            task_id = f"phase{phase_num}_task{idx+1}_{g.skill_id}"
            is_done = g.skill_id in completed_skills or g.current_level >= g.required_level

            tasks.append(RoadmapTask(
                id=task_id,
                skill_id=g.skill_id,
                skill_name=g.skill_name,
                title=f"Master {g.skill_name} Competencies (Level {g.current_level} → {g.required_level})",
                description=f"Focus on {g.why_it_matters} Complete sequence: {', '.join(g.recommended_sequence[:3])}.",
                estimated_hours=est_hrs,
                difficulty=diff,
                is_completed=is_done,
                recommended_resource_title=res.title if res else f"Official {g.skill_name} Documentation & Guides",
                recommended_resource_url=res.url if res else "https://developer.mozilla.org",
                recommended_project_title=proj.title if proj else f"{g.skill_name} Applied Portfolio Mini-Project"
            ))
        return tasks

    phase1_tasks = build_tasks_for_skills(phase1_skills, 1)
    phase2_tasks = build_tasks_for_skills(phase2_skills, 2)
    phase3_tasks = build_tasks_for_skills(phase3_skills, 3)
    phase4_tasks = build_tasks_for_skills(phase4_skills, 4)

    # Calculate hours per phase
    p1_hrs = sum(t.estimated_hours for t in phase1_tasks) or 15
    p2_hrs = sum(t.estimated_hours for t in phase2_tasks) or 20
    p3_hrs = sum(t.estimated_hours for t in phase3_tasks) or 25
    p4_hrs = sum(t.estimated_hours for t in phase4_tasks) or 20

    w1 = max(1, math.ceil(p1_hrs / weekly_hours))
    w2 = max(1, math.ceil(p2_hrs / weekly_hours))
    w3 = max(1, math.ceil(p3_hrs / weekly_hours))
    w4 = max(1, math.ceil(p4_hrs / weekly_hours))

    cum1 = w1
    cum2 = cum1 + w2
    cum3 = cum2 + w3
    cum4 = cum3 + w4

    phases = [
        RoadmapPhase(
            phase_number=1,
            phase_name="PHASE 1 — CORE FOUNDATIONS",
            week_range=f"Weeks 1–{cum1}",
            focus_summary="Syntactical fluency, core data structures, problem-solving, and base computational libraries.",
            tasks=phase1_tasks
        ),
        RoadmapPhase(
            phase_number=2,
            phase_name="PHASE 2 — DATA & ANALYTICAL WORKFLOWS",
            week_range=f"Weeks {cum1 + 1}–{cum2}",
            focus_summary="Relational queries, statistical distributions, data wrangling pipelines, and exploratory visualization.",
            tasks=phase2_tasks
        ),
        RoadmapPhase(
            phase_number=3,
            phase_name="PHASE 3 — SPECIALIZATION & ALGORITHMS",
            week_range=f"Weeks {cum2 + 1}–{cum3}",
            focus_summary="Domain-specific modeling, machine learning algorithms, model evaluation, and architectural rigor.",
            tasks=phase3_tasks
        ),
        RoadmapPhase(
            phase_number=4,
            phase_name="PHASE 4 — PRODUCTION & PORTFOLIO",
            week_range=f"Weeks {cum3 + 1}–{cum4}",
            focus_summary="Containerization, deployment, CI/CD, documentation, and end-to-end capstone showcase.",
            tasks=phase4_tasks
        )
    ]

    return RoadmapResponse(
        occupation_title=occupation.title,
        total_estimated_weeks=cum4,
        weekly_study_hours=weekly_hours,
        phases=phases
    )

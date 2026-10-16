import math
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.app.models.models import (
    Occupation, Skill, OccupationSkill, UserSkill, SkillDependency, SkillCategory
)
from backend.app.schemas.schemas import (
    SkillGapDetail, CategoryScore, DependencyAlert, RadarPoint,
    FullAssessmentResponse, CareerMatchItem
)

# Skill detail rationale templates
WHY_IT_MATTERS_MAP = {
    "Machine Learning": "Core competency for predictive modeling, pattern extraction, and algorithmic decision-making across modern AI systems.",
    "Python": "Primary lingua franca for data science, machine learning pipelines, automation, and backend AI service engineering.",
    "SQL": "Essential for relational data querying, aggregation, transformation, and database feature extraction.",
    "Statistics": "Provides theoretical rigor for hypothesis testing, probability estimation, A/B evaluation, and model validation.",
    "Pandas": "The foundational tabular data manipulation and cleaning framework in Python.",
    "NumPy": "Powers vectorized linear algebra operations and n-dimensional array computing.",
    "Deep Learning": "Required for high-dimensional representations in neural networks, computer vision, and NLP architectures.",
    "Natural Language Processing": "Enables understanding, parsing, tokenization, and generation of unstructured human text.",
    "Computer Vision": "Critical for visual representation learning, spatial feature analysis, and real-time image processing.",
    "Generative AI": "Fundamental for modern foundational LLM application building, prompt chaining, and generative synthesis.",
    "Large Language Models": "Essential for building agentic architectures, context-aware reasoning, and fine-tuning enterprise models.",
    "Prompt Engineering": "Key skill for steering and evaluating LLM outputs with structured schema adherence.",
    "Model Evaluation": "Ensures reliability, fairness, error analysis, and metric rigor (AUC, F1, MSE) before production deployment.",
    "Docker": "Industry standard for containerizing applications, ensuring reproducible training and deployment environments.",
    "Git": "Essential version control system for collaborative software engineering and CI/CD pipelines.",
    "Linux": "Underpins production servers, cloud compute nodes, and high-performance computing clusters.",
    "Data Cleaning": "Data quality directly determines model performance; 80% of real-world data science is data preparation.",
    "Data Visualization": "Crucial for exploratory data analysis and communicating insights to technical and non-technical stakeholders.",
    "Power BI": "Leading enterprise business intelligence tool for interactive executive dashboards.",
    "Tableau": "Widely utilized for rich interactive business analytics and exploratory visual dashboards.",
    "AWS": "Premier cloud infrastructure platform for scalable compute, storage, and serverless architectures.",
    "Azure": "Enterprise cloud platform deeply integrated with modern data and machine learning ecosystems.",
    "Google Cloud": "Top cloud choice for BigQuery, Vertex AI, and cutting-edge machine learning infrastructure.",
    "Analytical Thinking": "Deconstructs complex business and system problems into solvable quantitative hypotheses.",
    "Problem Solving": "Translates ambiguous challenges into robust engineering and algorithmic solutions.",
    "Communication": "Bridges the gap between technical algorithmic findings and executive business value.",
}

SEQUENCE_MAP = {
    "Machine Learning": ["Statistics & Probability", "Supervised Learning Fundamentals", "Regression & Classification", "Model Evaluation & Tuning", "Ensemble Methods"],
    "Python": ["Syntax & Control Flow", "Data Structures & Functions", "Object-Oriented Programming", "Package Management & Virtual Envs", "NumPy & Pandas Integration"],
    "SQL": ["Basic SELECT & Filtering", "Aggregations & GROUP BY", "Joins & Subqueries", "Window Functions & CTEs", "Query Performance & Indexing"],
    "Deep Learning": ["Linear Algebra & Calculus", "Perceptrons & Backpropagation", "CNNs & Computer Vision", "RNNs & Transformers", "PyTorch / TensorFlow Pipelines"],
    "Statistics": ["Descriptive Statistics", "Probability Distributions", "Hypothesis Testing & p-values", "Regression Analysis", "Bayesian Inference Concepts"],
    "Generative AI": ["LLM Fundamentals & Tokenization", "Prompt Engineering Techniques", "Embeddings & Vector Databases", "RAG Pipeline Architecture", "Agentic Frameworks & Tool Use"],
    "Docker": ["Container Fundamentals", "Dockerfile Directives", "Building & Running Images", "Docker Compose Multi-Container", "Volume & Network Management"],
}

def get_status_color(gap_percentage: float) -> str:
    """Returns status color based on gap percentage according to spec."""
    if gap_percentage <= 20:
        return "green"
    elif gap_percentage <= 40:
        return "yellow"
    elif gap_percentage <= 70:
        return "orange"
    else:
        return "red"

def get_priority_tier(priority_score: float) -> str:
    """Classifies priority score into clear human-understandable tiers."""
    if priority_score >= 70:
        return "Critical"
    elif priority_score >= 45:
        return "High"
    elif priority_score >= 25:
        return "Medium"
    else:
        return "Low"

def compute_skill_gap(required_level: int, current_level: int) -> Tuple[int, float]:
    """
    Core deterministic calculation:
    gap = max(required_level - current_level, 0)
    gap_percentage = (gap / required_level) * 100
    """
    gap = max(required_level - current_level, 0)
    if required_level > 0:
        gap_percentage = round((gap / float(required_level)) * 100.0, 1)
    else:
        gap_percentage = 0.0
    return gap, gap_percentage

def compute_priority_score(gap_percentage: float, importance_weight: float, future_demand_weight: float) -> float:
    """
    Transparent priority formula:
    priority_score = gap_percentage * importance_weight * future_demand_multiplier
    Normalized to 0–100.
    """
    # future_demand_weight is 0.0 - 1.0. We use multiplier range [1.0, 1.3] to prevent erasing gaps while rewarding high future demand.
    future_multiplier = 1.0 + (0.3 * future_demand_weight)
    raw_score = (gap_percentage * importance_weight * future_multiplier) / 1.3
    # Clamp strictly between 0 and 100
    return round(min(max(raw_score, 0.0), 100.0), 1)

def evaluate_occupation_gaps(
    db: Session,
    occupation: Occupation,
    user_skill_levels: Dict[int, int]
) -> Dict[str, Any]:
    """
    Evaluates skill gap, category scores, radar chart data, top priority gaps,
    and dependency prerequisite warnings for a given occupation.
    """
    occupation_skills = db.query(OccupationSkill).filter(
        OccupationSkill.occupation_id == occupation.id
    ).all()

    all_gaps: List[SkillGapDetail] = []
    category_buckets: Dict[str, Dict[str, Any]] = {}
    
    total_weighted_achievement = 0.0
    total_importance_weight = 0.0

    # Skill name to user level for dependency validation
    skill_level_by_name: Dict[str, int] = {}

    for occ_skill in occupation_skills:
        skill = occ_skill.skill
        cat_name = skill.category.name if skill.category else "General"
        
        req_level = occ_skill.required_level
        cur_level = user_skill_levels.get(skill.id, 0)
        skill_level_by_name[skill.name.lower()] = cur_level

        gap, gap_pct = compute_skill_gap(req_level, cur_level)
        p_score = compute_priority_score(gap_pct, occ_skill.importance_weight, skill.future_demand_weight)
        p_tier = get_priority_tier(p_score)
        s_color = get_status_color(gap_pct)

        # Weighted alignment calculation: min(cur_level / req_level, 1.0) * importance
        proficiency_ratio = min(float(cur_level) / float(req_level), 1.0) if req_level > 0 else 1.0
        total_weighted_achievement += (proficiency_ratio * occ_skill.importance_weight)
        total_importance_weight += occ_skill.importance_weight

        # Grouping for category score
        if cat_name not in category_buckets:
            category_buckets[cat_name] = {"sum_ratio": 0.0, "total_skills": 0, "satisfied": 0}
        category_buckets[cat_name]["sum_ratio"] += proficiency_ratio
        category_buckets[cat_name]["total_skills"] += 1
        if cur_level >= req_level:
            category_buckets[cat_name]["satisfied"] += 1

        # Fetch prerequisites
        prereqs = [dep.prerequisite.name for dep in skill.prerequisites]

        why = WHY_IT_MATTERS_MAP.get(
            skill.name,
            f"Key skill required for {occupation.title} workflows, driving analytical rigor and technical execution."
        )
        sequence = SEQUENCE_MAP.get(skill.name, [f"{skill.name} Fundamentals", f"Applied {skill.name}", f"Advanced {skill.name} Projects"])

        est_hours = 15 if gap == 1 else (25 if gap == 2 else (40 if gap >= 3 else 0))

        all_gaps.append(SkillGapDetail(
            skill_id=skill.id,
            skill_name=skill.name,
            category=cat_name,
            required_level=req_level,
            current_level=cur_level,
            gap=gap,
            gap_percentage=gap_pct,
            importance_weight=occ_skill.importance_weight,
            future_demand_weight=skill.future_demand_weight,
            priority_score=p_score,
            priority_tier=p_tier,
            status_color=s_color,
            why_it_matters=why,
            prerequisites=prereqs,
            recommended_sequence=sequence,
            estimated_learning_hours=est_hours
        ))

    # Overall Skill Alignment Score
    if total_importance_weight > 0:
        overall_alignment_score = round((total_weighted_achievement / total_importance_weight) * 100.0, 1)
    else:
        overall_alignment_score = 0.0

    # Status classification
    if overall_alignment_score >= 80:
        status = "Strong Alignment"
    elif overall_alignment_score >= 60:
        status = "Moderate Gap"
    elif overall_alignment_score >= 40:
        status = "Significant Gap"
    else:
        status = "High Priority Gap"

    # Category scores
    category_scores: List[CategoryScore] = []
    for cat_name, bdata in category_buckets.items():
        cat_pct = round((bdata["sum_ratio"] / bdata["total_skills"]) * 100.0, 1) if bdata["total_skills"] > 0 else 0.0
        category_scores.append(CategoryScore(
            category_name=cat_name,
            alignment_percentage=cat_pct,
            total_skills=bdata["total_skills"],
            satisfied_skills=bdata["satisfied"]
        ))
    category_scores.sort(key=lambda c: c.alignment_percentage, reverse=True)

    # Sort gaps by priority score descending
    sorted_gaps = sorted(all_gaps, key=lambda g: (g.priority_score, g.gap_percentage), reverse=True)
    top_gaps = [g for g in sorted_gaps if g.gap > 0][:5]

    # Radar chart points (top 6-8 core skills for clean visualization)
    radar_data: List[RadarPoint] = []
    core_skills_sample = sorted(all_gaps, key=lambda g: g.importance_weight, reverse=True)[:8]
    for g in core_skills_sample:
        radar_data.append(RadarPoint(
            subject=g.skill_name,
            user_level=float(g.current_level),
            required_level=float(g.required_level),
            full_mark=5
        ))

    # Dependency Alerts
    dependency_alerts: List[DependencyAlert] = []
    dependencies = db.query(SkillDependency).all()
    for dep in dependencies:
        target_name = dep.skill.name
        prereq_name = dep.prerequisite.name
        
        # Check if target skill is required in occupation
        target_gap_item = next((g for g in all_gaps if g.skill_id == dep.skill_id), None)
        if target_gap_item and target_gap_item.required_level > 0:
            prereq_user_level = user_skill_levels.get(dep.prerequisite_skill_id, 0)
            # If user has weak prerequisite (level < 2 or level < target requirement)
            if prereq_user_level < 2 and target_gap_item.gap > 0:
                dependency_alerts.append(DependencyAlert(
                    target_skill=target_name,
                    weak_prerequisite=prereq_name,
                    prerequisite_level=prereq_user_level,
                    target_required_level=target_gap_item.required_level,
                    message=f"You should strengthen {prereq_name} (currently {prereq_user_level}/5) before diving into advanced {target_name}."
                ))

    disclaimer = (
        "This score measures alignment with the selected skill profile. "
        "It is not a prediction of employment or salary."
    )

    return {
        "occupation_id": occupation.id,
        "occupation_title": occupation.title,
        "overall_alignment_score": overall_alignment_score,
        "status": status,
        "category_scores": category_scores,
        "top_gaps": top_gaps,
        "all_gaps": sorted_gaps,
        "radar_data": radar_data,
        "dependency_alerts": dependency_alerts[:4],
        "disclaimer": disclaimer
    }

def match_all_careers_for_user(
    db: Session,
    user_skill_levels: Dict[int, int]
) -> List[CareerMatchItem]:
    """
    Compares the user's current assessed skill profile against all occupations in database
    and produces explainable ranking.
    """
    occupations = db.query(Occupation).all()
    matches: List[CareerMatchItem] = []

    for occ in occupations:
        occ_eval = evaluate_occupation_gaps(db, occ, user_skill_levels)
        all_gaps: List[SkillGapDetail] = occ_eval["all_gaps"]
        
        matched_skills = [g.skill_name for g in all_gaps if g.gap == 0]
        missing_skills = [g.skill_name for g in all_gaps if g.gap > 0]

        top_match_preview = matched_skills[:4]
        top_missing_preview = [g.skill_name for g in occ_eval["top_gaps"]][:3]

        # Natural explainable rationale
        if occ_eval["overall_alignment_score"] >= 75:
            why = f"Exceptional fit! You already satisfy {len(matched_skills)} key requirements including {', '.join(top_match_preview[:2]) if top_match_preview else 'foundational skills'}."
        elif occ_eval["overall_alignment_score"] >= 55:
            why = f"Promising match. Strong overlap in {', '.join(top_match_preview[:2]) if top_match_preview else 'core competencies'}, with focus needed on {', '.join(top_missing_preview[:2]) if top_missing_preview else 'advanced tools'}."
        else:
            why = f"Entry-level readiness. Good foundation to build upon, but requires mastering {', '.join(top_missing_preview[:2]) if top_missing_preview else 'target skills'}."

        matches.append(CareerMatchItem(
            occupation_id=occ.id,
            title=occ.title,
            category=occ.category,
            alignment_score=occ_eval["overall_alignment_score"],
            matched_skills_count=len(matched_skills),
            missing_skills_count=len(missing_skills),
            why_it_fits=why,
            top_matching_skills=top_match_preview,
            top_missing_skills=top_missing_preview
        ))

    matches.sort(key=lambda m: m.alignment_score, reverse=True)
    return matches

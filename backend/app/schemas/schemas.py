from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# User Profile
class UserProfileBase(BaseModel):
    name: str = Field(..., example="Alex Chen")
    education_level: str = Field(..., example="Undergraduate")
    degree: Optional[str] = Field(None, example="B.Tech")
    branch: Optional[str] = Field(None, example="Artificial Intelligence & Data Science")
    year: Optional[str] = Field(None, example="3rd Year")
    experience_level: str = Field(..., example="Student")
    career_goal: Optional[str] = Field(None, example="Become a Data Scientist at a top AI firm")
    hours_per_week: int = Field(10, ge=1, le=80, example=10)
    learning_preference: str = Field("Hands-on Projects", example="Hands-on Projects")
    target_occupation_id: Optional[int] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Skills & Categories
class SkillBase(BaseModel):
    name: str
    category_id: int
    description: Optional[str] = None
    future_demand_weight: float = 0.5
    default_importance: float = 0.7

class SkillSchema(SkillBase):
    id: int
    category_name: Optional[str] = None

    class Config:
        from_attributes = True

class CategorySchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    icon: Optional[str] = "Folder"
    skills_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Occupations
class OccupationSkillItem(BaseModel):
    skill_id: int
    skill_name: str
    category_name: str
    required_level: int
    importance_weight: float
    future_demand_weight: float
    is_core: bool

class OccupationSummary(BaseModel):
    id: int
    title: str
    category: str
    description: str
    future_demand_weight: float
    onet_code: Optional[str] = None
    skills_count: int = 0

class OccupationDetail(OccupationSummary):
    esco_uri: Optional[str] = None
    skills: List[OccupationSkillItem] = []

# User Assessment Input
class SkillAssessmentItem(BaseModel):
    skill_id: int
    proficiency_level: int = Field(..., ge=0, le=5)

class AssessmentSubmission(BaseModel):
    user_id: Optional[int] = None
    occupation_id: int
    skill_ratings: List[SkillAssessmentItem]

# Calculation & Gap Result Schemas
class SkillGapDetail(BaseModel):
    skill_id: int
    skill_name: str
    category: str
    required_level: int
    current_level: int
    gap: int
    gap_percentage: float
    importance_weight: float
    future_demand_weight: float
    priority_score: float
    priority_tier: str  # Critical, High, Medium, Low
    status_color: str   # green, yellow, orange, red
    why_it_matters: str
    prerequisites: List[str] = []
    recommended_sequence: List[str] = []
    estimated_learning_hours: int = 20

class CategoryScore(BaseModel):
    category_name: str
    alignment_percentage: float
    total_skills: int
    satisfied_skills: int

class DependencyAlert(BaseModel):
    target_skill: str
    weak_prerequisite: str
    prerequisite_level: int
    target_required_level: int
    message: str

class RadarPoint(BaseModel):
    subject: str
    user_level: float
    required_level: float
    full_mark: int = 5

class FullAssessmentResponse(BaseModel):
    assessment_id: Optional[int] = None
    user_id: Optional[int] = None
    occupation_id: int
    occupation_title: str
    overall_alignment_score: float
    status: str
    category_scores: List[CategoryScore]
    top_gaps: List[SkillGapDetail]
    all_gaps: List[SkillGapDetail]
    radar_data: List[RadarPoint]
    dependency_alerts: List[DependencyAlert]
    disclaimer: str

# Career Match Engine ("Which Career Fits Me?")
class CareerMatchItem(BaseModel):
    occupation_id: int
    title: str
    category: str
    alignment_score: float
    matched_skills_count: int
    missing_skills_count: int
    why_it_fits: str
    top_matching_skills: List[str]
    top_missing_skills: List[str]

# Roadmap Schemas
class RoadmapTask(BaseModel):
    id: str
    skill_id: int
    skill_name: str
    title: str
    description: str
    estimated_hours: int
    difficulty: str  # Beginner, Intermediate, Advanced
    is_completed: bool = False
    recommended_resource_title: Optional[str] = None
    recommended_resource_url: Optional[str] = None
    recommended_project_title: Optional[str] = None

class RoadmapPhase(BaseModel):
    phase_number: int
    phase_name: str
    week_range: str
    focus_summary: str
    tasks: List[RoadmapTask]

class RoadmapResponse(BaseModel):
    occupation_title: str
    total_estimated_weeks: int
    weekly_study_hours: int
    phases: List[RoadmapPhase]

# Learning Resources & Projects
class LearningResourceSchema(BaseModel):
    id: int
    skill_id: Optional[int] = None
    skill_name: Optional[str] = None
    title: str
    provider: str
    resource_type: str
    difficulty: str
    duration: str
    url: str
    is_free: bool
    description: Optional[str] = None

class ProjectSchema(BaseModel):
    id: int
    title: str
    difficulty: str
    estimated_hours: int
    description: str
    tech_stack: str
    primary_skill: Optional[str] = None
    related_skills: Optional[str] = None

# Job Description Analyzer
class JDSkillAnalysis(BaseModel):
    skill_name: str
    is_required: bool
    status: str  # matched, partial, missing
    current_level: int
    description: Optional[str] = None

class JDAnalysisResponse(BaseModel):
    job_title: str
    company: str
    match_score: float
    summary: str
    matched_skills: List[str]
    partial_skills: List[str]
    missing_skills: List[str]
    skills_detail: List[JDSkillAnalysis]
    top_recommendations: List[str]

# Resume Analyzer
class DetectedSkillItem(BaseModel):
    skill_name: str
    matched_skill_id: Optional[int] = None
    category: str
    detected_phrase: str
    confidence: float
    suggested_level: int

class ResumeAnalysisResponse(BaseModel):
    filename: str
    detected_skills: List[DetectedSkillItem]
    raw_text_snippet: str
    total_detected: int

class ConfirmSkillsRequest(BaseModel):
    user_id: int
    skills: List[SkillAssessmentItem]

# Progress Tracking & Reassessment
class SkillProgressItem(BaseModel):
    skill_name: str
    category: str
    previous_level: int
    current_level: int
    delta: int

class ReassessmentComparison(BaseModel):
    previous_score: float
    current_score: float
    score_delta: float
    previous_date: Optional[str] = None
    current_date: str
    skills_progress: List[SkillProgressItem]
    hours_learned_total: float
    projects_completed_total: int
    message: str

# AI Assistant
class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str

class ChatRequest(BaseModel):
    user_id: Optional[int] = None
    occupation_id: Optional[int] = None
    query: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    answer: str
    suggested_actions: List[str] = []
    source: str = "local_heuristic"  # "gemini_api", "openai_api", or "local_heuristic"

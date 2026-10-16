from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from backend.app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    education_level = Column(String(50), nullable=False)
    degree = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    year = Column(String(20), nullable=True)
    experience_level = Column(String(50), nullable=False)
    career_goal = Column(String(100), nullable=True)
    hours_per_week = Column(Integer, default=10)
    learning_preference = Column(String(100), default="Hands-on Projects")
    target_occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    target_occupation = relationship("Occupation", back_populates="users")
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    job_descriptions = relationship("JobDescription", back_populates="user", cascade="all, delete-orphan")
    resume_extractions = relationship("ResumeExtraction", back_populates="user", cascade="all, delete-orphan")


class SkillCategory(Base):
    __tablename__ = "skill_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    icon = Column(String(50), default="Folder")

    skills = relationship("Skill", back_populates="category")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("skill_categories.id"), nullable=False)
    description = Column(Text, nullable=True)
    future_demand_weight = Column(Float, default=0.5)  # 0.0 to 1.0 (inspired by WEF Future of Jobs)
    default_importance = Column(Float, default=0.7)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("SkillCategory", back_populates="skills")
    occupation_skills = relationship("OccupationSkill", back_populates="skill")
    user_skills = relationship("UserSkill", back_populates="skill")
    learning_resources = relationship("LearningResource", back_populates="skill")
    
    # Dependencies where this skill is the target that requires prerequisites
    prerequisites = relationship(
        "SkillDependency",
        foreign_keys="SkillDependency.skill_id",
        back_populates="skill"
    )
    # Dependencies where this skill is a prerequisite for downstream skills
    downstream_skills = relationship(
        "SkillDependency",
        foreign_keys="SkillDependency.prerequisite_skill_id",
        back_populates="prerequisite"
    )


class SkillDependency(Base):
    __tablename__ = "skill_dependencies"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    prerequisite_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    strength = Column(String(20), default="required")  # "required" or "recommended"

    skill = relationship("Skill", foreign_keys=[skill_id], back_populates="prerequisites")
    prerequisite = relationship("Skill", foreign_keys=[prerequisite_skill_id], back_populates="downstream_skills")


class Occupation(Base):
    __tablename__ = "occupations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False)  # "Technology", "Business", etc.
    description = Column(Text, nullable=False)
    future_demand_weight = Column(Float, default=0.75)  # 0.0 - 1.0
    onet_code = Column(String(20), nullable=True)  # e.g., "15-2051.00"
    esco_uri = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="target_occupation")
    occupation_skills = relationship("OccupationSkill", back_populates="occupation", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="occupation")


class OccupationSkill(Base):
    __tablename__ = "occupation_skills"

    id = Column(Integer, primary_key=True, index=True)
    occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Integer, nullable=False)  # 1 to 5
    importance_weight = Column(Float, default=0.7)    # 0.0 to 1.0
    is_core = Column(Boolean, default=True)

    occupation = relationship("Occupation", back_populates="occupation_skills")
    skill = relationship("Skill", back_populates="occupation_skills")


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_level = Column(Integer, default=0)    # 0 to 5
    verified_by_resume = Column(Boolean, default=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    occupation_id = Column(Integer, ForeignKey("occupations.id"), nullable=False)
    overall_alignment_score = Column(Float, nullable=False)  # 0.0 to 100.0
    status = Column(String(50), default="Moderate Gap")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessments")
    occupation = relationship("Occupation", back_populates="assessments")
    results = relationship("AssessmentResult", back_populates="assessment", cascade="all, delete-orphan")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Integer, nullable=False)
    current_level = Column(Integer, nullable=False)
    gap = Column(Integer, nullable=False)
    gap_percentage = Column(Float, nullable=False)
    priority_score = Column(Float, nullable=False)

    assessment = relationship("Assessment", back_populates="results")
    skill = relationship("Skill")


class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    previous_level = Column(Integer, default=0)
    current_level = Column(Integer, default=0)
    hours_spent = Column(Float, default=0.0)
    completed_tasks_count = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="progress_records")
    skill = relationship("Skill")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    title = Column(String(200), nullable=False)
    provider = Column(String(100), nullable=False)
    resource_type = Column(String(50), nullable=False)  # Course, Documentation, Video, Tutorial, Practice, Project
    difficulty = Column(String(30), default="Intermediate")
    duration = Column(String(50), default="10 hours")
    url = Column(String(300), nullable=False)
    is_free = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="learning_resources")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    difficulty = Column(String(30), default="Intermediate")  # Beginner, Intermediate, Advanced
    estimated_hours = Column(Integer, default=20)
    description = Column(Text, nullable=False)
    tech_stack = Column(String(200), nullable=False)
    primary_skill = Column(String(100), nullable=True)
    related_skills = Column(Text, nullable=True)  # Comma-separated or JSON string


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(150), default="Analyzed Job")
    company = Column(String(100), default="Target Company")
    raw_text = Column(Text, nullable=False)
    match_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="job_descriptions")
    skills = relationship("JobDescriptionSkill", back_populates="job_description", cascade="all, delete-orphan")


class JobDescriptionSkill(Base):
    __tablename__ = "job_description_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"), nullable=False)
    skill_name = Column(String(100), nullable=False)
    is_required = Column(Boolean, default=True)
    matched_user_level = Column(Integer, default=0)
    status = Column(String(20), default="missing")  # "matched", "partial", "missing"

    job_description = relationship("JobDescription", back_populates="skills")


class ResumeExtraction(Base):
    __tablename__ = "resume_extractions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    filename = Column(String(200), nullable=False)
    extracted_text = Column(Text, nullable=False)
    extracted_skills_json = Column(Text, nullable=False)  # JSON string of detected skills with context
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resume_extractions")

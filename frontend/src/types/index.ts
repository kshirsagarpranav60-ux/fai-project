export interface UserProfile {
  id?: number;
  name: string;
  education_level: string;
  degree?: string;
  branch?: string;
  year?: string;
  experience_level: string;
  career_goal?: string;
  hours_per_week: number;
  learning_preference: string;
  target_occupation_id?: number;
}

export interface SkillCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  skills_count?: number;
}

export interface Skill {
  id: number;
  name: string;
  category_id: number;
  category_name?: string;
  description?: string;
  future_demand_weight: number;
  default_importance: number;
}

export interface SkillDependency {
  id: number;
  skill_id: number;
  skill_name: string;
  prerequisite_skill_id: number;
  prerequisite_name: string;
  strength: string;
}

export interface OccupationSkillItem {
  skill_id: number;
  skill_name: string;
  category_name: string;
  required_level: number;
  importance_weight: number;
  future_demand_weight: number;
  is_core: boolean;
}

export interface OccupationSummary {
  id: number;
  title: string;
  category: string;
  description: string;
  future_demand_weight: number;
  onet_code?: string;
  skills_count: number;
}

export interface OccupationDetail extends OccupationSummary {
  esco_uri?: string;
  skills: OccupationSkillItem[];
}

export interface SkillGapDetail {
  skill_id: number;
  skill_name: string;
  category: string;
  required_level: number;
  current_level: number;
  gap: number;
  gap_percentage: number;
  importance_weight: number;
  future_demand_weight: number;
  priority_score: number;
  priority_tier: 'Critical' | 'High' | 'Medium' | 'Low';
  status_color: 'green' | 'yellow' | 'orange' | 'red';
  why_it_matters: string;
  prerequisites: string[];
  recommended_sequence: string[];
  estimated_learning_hours: number;
}

export interface CategoryScore {
  category_name: string;
  alignment_percentage: number;
  total_skills: number;
  satisfied_skills: number;
}

export interface DependencyAlert {
  target_skill: string;
  weak_prerequisite: string;
  prerequisite_level: number;
  target_required_level: number;
  message: string;
}

export interface RadarPoint {
  subject: string;
  user_level: number;
  required_level: number;
  full_mark: number;
}

export interface FullAssessmentResponse {
  assessment_id?: number;
  user_id?: number;
  occupation_id: number;
  occupation_title: string;
  overall_alignment_score: number;
  status: string;
  category_scores: CategoryScore[];
  top_gaps: SkillGapDetail[];
  all_gaps: SkillGapDetail[];
  radar_data: RadarPoint[];
  dependency_alerts: DependencyAlert[];
  disclaimer: string;
}

export interface CareerMatchItem {
  occupation_id: number;
  title: string;
  category: string;
  alignment_score: number;
  matched_skills_count: number;
  missing_skills_count: number;
  why_it_fits: string;
  top_matching_skills: string[];
  top_missing_skills: string[];
}

export interface RoadmapTask {
  id: string;
  skill_id: number;
  skill_name: string;
  title: string;
  description: string;
  estimated_hours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  is_completed: boolean;
  recommended_resource_title?: string;
  recommended_resource_url?: string;
  recommended_project_title?: string;
}

export interface RoadmapPhase {
  phase_number: number;
  phase_name: string;
  week_range: string;
  focus_summary: string;
  tasks: RoadmapTask[];
}

export interface RoadmapResponse {
  occupation_title: string;
  total_estimated_weeks: number;
  weekly_study_hours: number;
  phases: RoadmapPhase[];
}

export interface LearningResource {
  id: number;
  skill_id?: number;
  skill_name?: string;
  title: string;
  provider: string;
  resource_type: string;
  difficulty: string;
  duration: string;
  url: string;
  is_free: boolean;
  description?: string;
}

export interface ProjectItem {
  id: number;
  title: string;
  difficulty: string;
  estimated_hours: number;
  description: string;
  tech_stack: string;
  primary_skill?: string;
  related_skills?: string;
}

export interface DetectedSkillItem {
  skill_name: string;
  matched_skill_id?: number;
  category: string;
  detected_phrase: string;
  confidence: number;
  suggested_level: number;
}

export interface ResumeAnalysisResponse {
  filename: string;
  detected_skills: DetectedSkillItem[];
  raw_text_snippet: string;
  total_detected: number;
}

export interface JDSkillAnalysis {
  skill_name: string;
  is_required: boolean;
  status: 'matched' | 'partial' | 'missing';
  current_level: number;
  description?: string;
}

export interface JDAnalysisResponse {
  job_title: string;
  company: string;
  match_score: number;
  summary: string;
  matched_skills: string[];
  partial_skills: string[];
  missing_skills: string[];
  skills_detail: JDSkillAnalysis[];
  top_recommendations: string[];
}

export interface SkillProgressItem {
  skill_name: string;
  category: string;
  previous_level: number;
  current_level: number;
  delta: number;
}

export interface ReassessmentComparison {
  previous_score: number;
  current_score: number;
  score_delta: number;
  previous_date?: string;
  current_date: string;
  skills_progress: SkillProgressItem[];
  hours_learned_total: number;
  projects_completed_total: number;
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggested_actions?: string[];
  source?: string;
}

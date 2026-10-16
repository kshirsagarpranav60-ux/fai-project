import {
  UserProfile, OccupationSummary, OccupationDetail, SkillCategory, Skill,
  SkillDependency, FullAssessmentResponse, CareerMatchItem, RoadmapResponse,
  LearningResource, ProjectItem, ResumeAnalysisResponse, JDAnalysisResponse,
  ReassessmentComparison, ChatMessage
} from '../types';

const API_BASE = '/api';

export const api = {
  // Occupations & Skills
  async getOccupations(category?: string): Promise<OccupationSummary[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/occupations${query}`);
    if (!res.ok) throw new Error('Failed to fetch occupations');
    return res.json();
  },

  async getOccupationDetail(id: number): Promise<OccupationDetail> {
    const res = await fetch(`${API_BASE}/occupations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch occupation detail');
    return res.json();
  },

  async getCategories(): Promise<SkillCategory[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getSkills(categoryId?: number): Promise<Skill[]> {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    const res = await fetch(`${API_BASE}/skills${query}`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  },

  async getSkillDependencies(): Promise<SkillDependency[]> {
    const res = await fetch(`${API_BASE}/skill-dependencies`);
    if (!res.ok) throw new Error('Failed to fetch dependencies');
    return res.json();
  },

  // User Profile
  async createOrUpdateUser(profile: UserProfile): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to save user profile');
    return res.json();
  },

  async getUserProfile(userId: number): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async getUserSkills(userId: number): Promise<any[]> {
    const res = await fetch(`${API_BASE}/users/${userId}/skills`);
    if (!res.ok) throw new Error('Failed to fetch user skills');
    return res.json();
  },

  // Assessment & Gap Evaluation
  async evaluateAssessment(payload: {
    user_id?: number;
    occupation_id: number;
    skill_ratings: { skill_id: number; proficiency_level: number }[];
  }): Promise<FullAssessmentResponse> {
    const res = await fetch(`${API_BASE}/assessments/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to evaluate assessment');
    return res.json();
  },

  async saveAssessment(payload: {
    user_id: number;
    occupation_id: number;
    skill_ratings: { skill_id: number; proficiency_level: number }[];
  }): Promise<FullAssessmentResponse> {
    const res = await fetch(`${API_BASE}/assessments/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to save assessment');
    return res.json();
  },

  // Career Matching ("Which Career Fits Me?")
  async matchCareers(ratings: { skill_id: number; proficiency_level: number }[]): Promise<CareerMatchItem[]> {
    const res = await fetch(`${API_BASE}/careers/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratings),
    });
    if (!res.ok) throw new Error('Failed to match careers');
    return res.json();
  },

  // Roadmap
  async generateRoadmap(payload: {
    user_id?: number;
    occupation_id: number;
    weekly_hours: number;
    skill_ratings: { skill_id: number; proficiency_level: number }[];
  }): Promise<RoadmapResponse> {
    const res = await fetch(`${API_BASE}/roadmap/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate roadmap');
    return res.json();
  },

  async toggleRoadmapTask(userId: number, skillId: number, completed: boolean): Promise<any> {
    const res = await fetch(`${API_BASE}/roadmap/task/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, skill_id: skillId, completed }),
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  // Resources & Projects
  async getResources(skillId?: number, difficulty?: string): Promise<LearningResource[]> {
    const params = new URLSearchParams();
    if (skillId) params.append('skill_id', skillId.toString());
    if (difficulty) params.append('difficulty', difficulty);
    const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  async getProjects(difficulty?: string): Promise<ProjectItem[]> {
    const query = difficulty ? `?difficulty=${encodeURIComponent(difficulty)}` : '';
    const res = await fetch(`${API_BASE}/projects${query}`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  // Resume Analyzer
  async uploadResume(formData: FormData): Promise<ResumeAnalysisResponse> {
    const res = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to analyze resume');
    return res.json();
  },

  async confirmResumeSkills(userId: number, skills: { skill_id: number; proficiency_level: number }[]): Promise<any> {
    const res = await fetch(`${API_BASE}/resume/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, skills }),
    });
    if (!res.ok) throw new Error('Failed to confirm resume skills');
    return res.json();
  },

  // Job Description Analyzer
  async analyzeJobDescription(payload: {
    user_id?: number;
    job_title: string;
    company: string;
    raw_text: string;
    current_skill_ratings: { skill_id: number; proficiency_level: number }[];
  }): Promise<JDAnalysisResponse> {
    const res = await fetch(`${API_BASE}/job/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to analyze job description');
    return res.json();
  },

  // Reassessment & Progress
  async getReassessment(userId: number): Promise<ReassessmentComparison> {
    const res = await fetch(`${API_BASE}/users/${userId}/reassessment`);
    if (!res.ok) throw new Error('Failed to fetch reassessment data');
    return res.json();
  },

  // AI Assistant Panel
  async chatWithAssistant(payload: {
    user_id?: number;
    occupation_id?: number;
    query: string;
    history?: ChatMessage[];
  }): Promise<{ answer: string; suggested_actions: string[]; source: string }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to fetch assistant response');
    return res.json();
  },

  // Demo Mode (1-Click Instant Data)
  async getDemoPackage(): Promise<any> {
    const res = await fetch(`${API_BASE}/demo`);
    if (!res.ok) throw new Error('Failed to load demo data');
    return res.json();
  },

  // Admin
  async adminCreateOccupation(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/occupations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async adminDeleteOccupation(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/occupations/${id}`, { method: 'DELETE' });
    return res.json();
  },

  async adminCreateSkill(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async adminDeleteSkill(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/skills/${id}`, { method: 'DELETE' });
    return res.json();
  },
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile, OccupationDetail, FullAssessmentResponse, ReassessmentComparison,
  RoadmapResponse, SkillGapDetail
} from '../types';
import { api } from '../services/api';

interface SkillGapContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  targetOccupation: OccupationDetail | null;
  setTargetOccupation: (occ: OccupationDetail | null) => void;
  skillRatings: Record<number, number>;
  setSkillRating: (skillId: number, level: number) => void;
  setBulkSkillRatings: (ratings: Record<number, number>) => void;
  assessmentResult: FullAssessmentResponse | null;
  setAssessmentResult: (res: FullAssessmentResponse | null) => void;
  reassessment: ReassessmentComparison | null;
  setReassessment: (res: ReassessmentComparison | null) => void;
  roadmap: RoadmapResponse | null;
  setRoadmap: (rm: RoadmapResponse | null) => void;
  currentView: string;
  navigate: (view: string) => void;
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  activeSkillDetail: SkillGapDetail | null;
  openSkillDetail: (skill: SkillGapDetail) => void;
  closeSkillDetail: () => void;
  loadDemoMode: () => Promise<void>;
  runAnalysis: () => Promise<void>;
  isLoading: boolean;
}

const SkillGapContext = createContext<SkillGapContextType | undefined>(undefined);

export const SkillGapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [targetOccupation, setTargetOccupation] = useState<OccupationDetail | null>(null);
  const [skillRatings, setSkillRatings] = useState<Record<number, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<FullAssessmentResponse | null>(null);
  const [reassessment, setReassessment] = useState<ReassessmentComparison | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [activeSkillDetail, setActiveSkillDetail] = useState<SkillGapDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setSkillRating = (skillId: number, level: number) => {
    setSkillRatings((prev) => ({ ...prev, [skillId]: level }));
  };

  const setBulkSkillRatings = (ratings: Record<number, number>) => {
    setSkillRatings((prev) => ({ ...prev, ...ratings }));
  };

  const navigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAssistant = () => {
    setIsAssistantOpen((prev) => !prev);
  };

  const openSkillDetail = (skill: SkillGapDetail) => {
    setActiveSkillDetail(skill);
  };

  const closeSkillDetail = () => {
    setActiveSkillDetail(null);
  };

  const loadDemoMode = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDemoPackage();
      setUser(data.user);
      setTargetOccupation(data.target_occupation);
      
      const ratingsMap: Record<number, number> = {};
      data.user_ratings.forEach((r: { skill_id: number; proficiency_level: number }) => {
        ratingsMap[r.skill_id] = r.proficiency_level;
      });
      setSkillRatings(ratingsMap);
      setAssessmentResult(data.assessment);
      setRoadmap(data.roadmap);
      setReassessment(data.reassessment);
      navigate('dashboard');
    } catch (err) {
      console.error('Failed to load demo mode:', err);
      // Fallback demo state if network fails
      navigate('dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysis = async () => {
    if (!targetOccupation) {
      navigate('career-select');
      return;
    }
    setIsLoading(true);
    try {
      const ratingsList = Object.entries(skillRatings).map(([k, v]) => ({
        skill_id: Number(k),
        proficiency_level: v,
      }));

      // Evaluate
      const res = await api.evaluateAssessment({
        user_id: user?.id,
        occupation_id: targetOccupation.id,
        skill_ratings: ratingsList,
      });
      setAssessmentResult(res);

      // Generate roadmap
      const rm = await api.generateRoadmap({
        user_id: user?.id,
        occupation_id: targetOccupation.id,
        weekly_hours: user?.hours_per_week || 10,
        skill_ratings: ratingsList,
      });
      setRoadmap(rm);

      // If user saved, also fetch reassessment
      if (user?.id) {
        try {
          const reassessData = await api.getReassessment(user.id);
          setReassessment(reassessData);
        } catch (e) {
          console.warn('Reassessment fetch skipped:', e);
        }
      }

      navigate('dashboard');
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SkillGapContext.Provider
      value={{
        user,
        setUser,
        targetOccupation,
        setTargetOccupation,
        skillRatings,
        setSkillRating,
        setBulkSkillRatings,
        assessmentResult,
        setAssessmentResult,
        reassessment,
        setReassessment,
        roadmap,
        setRoadmap,
        currentView,
        navigate,
        isAssistantOpen,
        toggleAssistant,
        activeSkillDetail,
        openSkillDetail,
        closeSkillDetail,
        loadDemoMode,
        runAnalysis,
        isLoading,
      }}
    >
      {children}
    </SkillGapContext.Provider>
  );
};

export const useSkillGap = () => {
  const context = useContext(SkillGapContext);
  if (!context) throw new Error('useSkillGap must be used within SkillGapProvider');
  return context;
};

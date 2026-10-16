import React, { useState, useEffect } from 'react';
import {
  CheckCircle, ArrowRight, ArrowLeft, Sliders, Sparkles,
  HelpCircle, FileUp, Play
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';

const LEVEL_LABELS = [
  { level: 0, label: 'No knowledge', desc: 'Never used or studied' },
  { level: 1, label: 'Beginner', desc: 'Familiar with concepts' },
  { level: 2, label: 'Basic', desc: 'Can write simple scripts' },
  { level: 3, label: 'Intermediate', desc: 'Can build working projects' },
  { level: 4, label: 'Advanced', desc: 'Production-ready fluency' },
  { level: 5, label: 'Expert', desc: 'Architectural mastery' },
];

export const SkillAssessmentPage: React.FC = () => {
  const {
    targetOccupation, skillRatings, setSkillRating, setBulkSkillRatings,
    runAnalysis, navigate, isLoading
  } = useSkillGap();

  // If no occupation selected, redirect back
  useEffect(() => {
    if (!targetOccupation) {
      navigate('career-select');
    }
  }, [targetOccupation]);

  if (!targetOccupation) return null;

  const skills = targetOccupation.skills;
  const totalSkills = skills.length;
  const ratedCount = skills.filter((s) => skillRatings[s.skill_id] !== undefined).length;
  const progressPercent = totalSkills > 0 ? Math.round((ratedCount / totalSkills) * 100) : 0;

  // Group skills by category
  const categoriesMap: Record<string, typeof skills> = {};
  skills.forEach((s) => {
    const cat = s.category_name || 'General';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(s);
  });

  const handleSetLevel = (skillId: number, level: number) => {
    setSkillRating(skillId, level);
  };

  const handlePrefillModerate = () => {
    const moderateMap: Record<number, number> = {};
    skills.forEach((s) => {
      // Set to level 2 or 3
      moderateMap[s.skill_id] = s.required_level > 3 ? 2 : 3;
    });
    setBulkSkillRatings(moderateMap);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-blue-400">Step 3 of 5</span>
          <span className="font-medium text-slate-300">
            Skill Assessment {progressPercent}% complete ({ratedCount}/{totalSkills} skills rated)
          </span>
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Title & Target Context */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">
            Self-Assessment Matrix
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            Assess Current Skills for {targetOccupation.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rate your honest proficiency on a 0–5 scale. SkillGap AI uses these ratings to calculate transparent priority scores.
          </p>
        </div>

        <button
          onClick={handlePrefillModerate}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          title="Fills realistic intermediate levels for quick testing"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Quick Prefill</span>
        </button>
      </div>

      {/* Grouped Skills by Category */}
      <div className="space-y-8">
        {Object.entries(categoriesMap).map(([categoryName, catSkills]) => (
          <div key={categoryName} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{categoryName} Skills</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Target requirements for {targetOccupation.title} in this category.
            </p>

            <div className="space-y-5">
              {catSkills.map((s) => {
                const currentVal = skillRatings[s.skill_id] !== undefined ? skillRatings[s.skill_id] : 0;
                return (
                  <div
                    key={s.skill_id}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white">{s.skill_name}</span>
                          {s.is_core && (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                              Core
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Target Required: <span className="text-blue-400 font-semibold">{s.required_level}/5</span> • Importance: {Math.round(s.importance_weight * 100)}%
                        </div>
                      </div>

                      {/* "I don't know this skill" Button */}
                      <button
                        onClick={() => handleSetLevel(s.skill_id, 0)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                          currentVal === 0
                            ? 'bg-slate-700 text-slate-200 border-slate-600'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        I don't know this skill
                      </button>
                    </div>

                    {/* Level Selectors (0 to 5) */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                      {LEVEL_LABELS.map((lvl) => {
                        const isSelected = currentVal === lvl.level;
                        return (
                          <button
                            key={lvl.level}
                            type="button"
                            onClick={() => handleSetLevel(s.skill_id, lvl.level)}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-500/20 shadow-md font-bold'
                                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div className="text-xs sm:text-sm font-semibold">{lvl.level}</div>
                            <div className="text-[10px] truncate opacity-90">{lvl.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation & Submission Bar */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate('career-select')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Change Career</span>
        </button>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Optional Resume Upload CTA */}
          <button
            onClick={() => navigate('resume-upload')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <FileUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Optional: Upload Resume</span>
          </button>

          {/* Primary CTA: Calculate Skill Gap */}
          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Run Skill Gap Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  TrendingUp, Clock, CheckCircle2, Award, ArrowUpRight,
  RefreshCw, Sparkles, BookOpen, ChevronRight, Sliders
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { ProgressTimeChart } from '../charts/ProgressTimeChart';

export const ProgressPage: React.FC = () => {
  const {
    user, assessmentResult, reassessment, setReassessment,
    targetOccupation, skillRatings, setSkillRating, runAnalysis, navigate
  } = useSkillGap();

  const [isReassessing, setIsReassessing] = useState(false);
  const [tempRatings, setTempRatings] = useState<Record<number, number>>({});

  const openReassessModal = () => {
    setTempRatings({ ...skillRatings });
    setIsReassessing(true);
  };

  const handleSaveReassessment = async () => {
    // Update local skillRatings
    Object.entries(tempRatings).forEach(([id, lvl]) => {
      setSkillRating(Number(id), lvl);
    });

    if (user?.id && targetOccupation) {
      try {
        const ratingsList = Object.entries(tempRatings).map(([k, v]) => ({
          skill_id: Number(k),
          proficiency_level: v,
        }));

        await api.saveAssessment({
          user_id: user.id,
          occupation_id: targetOccupation.id,
          skill_ratings: ratingsList,
        });

        const reassessData = await api.getReassessment(user.id);
        setReassessment(reassessData);
      } catch (err) {
        console.warn('Reassessment save failed:', err);
      }
    }

    await runAnalysis();
    setIsReassessing(false);
  };

  const beforeScore = reassessment?.previous_score || 64;
  const currentScore = reassessment?.current_score || assessmentResult?.overall_alignment_score || 71;
  const delta = Math.round((currentScore - beforeScore) * 10) / 10;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 text-xs font-semibold border border-emerald-900/60 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Longitudinal Growth Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Progress & Reassessment Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track individual skill improvements, hours invested, and compare your historical baseline against current readiness.
          </p>
        </div>

        <button
          onClick={openReassessModal}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-analyze My Skills</span>
        </button>
      </div>

      {/* 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Overall Alignment</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">{currentScore}%</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{delta}% from baseline</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Hours Learned</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {reassessment?.hours_learned_total || 42.5}
          </div>
          <div className="text-xs text-slate-500 mt-1">Self-study & modules</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Projects Built</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {reassessment?.projects_completed_total || 3}
          </div>
          <div className="text-xs text-slate-500 mt-1">Portfolio milestones</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Skills Improved</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {reassessment?.skills_progress.filter((p) => p.delta > 0).length || 4}
          </div>
          <div className="text-xs text-slate-500 mt-1">Verified level gains</div>
        </div>
      </div>

      {/* Before vs After Reassessment Comparison Box (Requirement 24) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Historical Reassessment Comparison</h3>
            <p className="text-xs text-slate-400">
              {reassessment?.previous_date || 'Baseline Assessment'} vs {reassessment?.current_date || 'Today'}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase">Previous Baseline</span>
              <div className="text-2xl font-bold text-slate-400">{beforeScore}%</div>
            </div>
            <div className="text-2xl text-slate-600 font-light">→</div>
            <div className="text-right">
              <span className="text-[10px] text-blue-400 uppercase font-semibold">Current Level</span>
              <div className="text-3xl font-extrabold text-blue-400">{currentScore}%</div>
            </div>
          </div>
        </div>

        {/* Individual Skill Progression List */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Individual Competency Growth Breakdown
          </h4>
          {reassessment?.skills_progress && reassessment.skills_progress.length > 0 ? (
            reassessment.skills_progress.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-white">{item.skill_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center space-x-5">
                  <span className="text-slate-400">
                    {item.previous_level}/5 → <span className="font-bold text-white">{item.current_level}/5</span>
                  </span>

                  {item.delta > 0 ? (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                      +{item.delta} Levels
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[11px]">Maintained</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 py-4 text-center">No progress records logged yet.</div>
          )}
        </div>
      </div>

      {/* Progress Over Time Visualization */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-2">Longitudinal Learning Curve</h3>
        <p className="text-xs text-slate-400 mb-4">Milestones across self-study and completed roadmap phases</p>
        <ProgressTimeChart
          baselineScore={beforeScore}
          currentScore={currentScore}
          baselineDate={reassessment?.previous_date || 'Baseline'}
          currentDate={reassessment?.current_date || 'Current'}
        />
      </div>

      {/* Reassessment Modal */}
      {isReassessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Re-analyze My Skills</h3>
                <p className="text-xs text-slate-400">Update any skill levels you have improved recently.</p>
              </div>
              <button
                onClick={() => setIsReassessing(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {targetOccupation?.skills.map((s) => {
                const currentVal = tempRatings[s.skill_id] !== undefined ? tempRatings[s.skill_id] : 0;
                return (
                  <div
                    key={s.skill_id}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{s.skill_name}</div>
                      <div className="text-[10px] text-slate-400">Target Required: {s.required_level}/5</div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[0, 1, 2, 3, 4, 5].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setTempRatings({ ...tempRatings, [s.skill_id]: lvl })}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                            currentVal === lvl
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <button
                onClick={() => setIsReassessing(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReassessment}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
              >
                Save & Recalculate Alignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

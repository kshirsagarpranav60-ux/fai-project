import React, { useState, useEffect } from 'react';
import {
  Compass, ArrowRight, CheckCircle2, XCircle, Sparkles,
  ShieldAlert, RefreshCw
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { CareerMatchItem } from '../types';

export const CareerMatchingPage: React.FC = () => {
  const { skillRatings, setTargetOccupation, navigate, runAnalysis } = useSkillGap();
  const [matches, setMatches] = useState<CareerMatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const ratingsList = Object.entries(skillRatings).map(([k, v]) => ({
        skill_id: Number(k),
        proficiency_level: v,
      }));
      const res = await api.matchCareers(ratingsList);
      setMatches(res);
    } catch (err) {
      console.error('Failed to match careers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [skillRatings]);

  const handleSelectRole = async (occId: number) => {
    try {
      const occ = await api.getOccupationDetail(occId);
      setTargetOccupation(occ);
      await runAnalysis();
    } catch (e) {
      console.error('Failed to select role:', e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold border border-blue-900/60 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Cross-Role Fit Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Which Career Fits Me?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Compares your assessed abilities against all 16 occupation profiles to identify immediate matches and explain why each role aligns.
          </p>
        </div>

        <button
          onClick={fetchMatches}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Matches</span>
        </button>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start space-x-2">
        <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          This ranking measures competency overlap with standardized occupation models. It is not an employment, psychological, or aptitude prediction.
        </span>
      </div>

      {/* Career Ranking List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Evaluating all careers...</div>
      ) : (
        <div className="space-y-4">
          {matches.map((item, idx) => (
            <div
              key={item.occupation_id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.why_it_fits}
                </p>

                {/* Overlap Highlights */}
                <div className="flex flex-wrap gap-4 text-xs pt-1">
                  {item.top_matching_skills.length > 0 && (
                    <div className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Strengths: {item.top_matching_skills.join(', ')}</span>
                    </div>
                  )}
                  {item.top_missing_skills.length > 0 && (
                    <div className="flex items-center space-x-1 text-amber-400 text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Key Gaps: {item.top_missing_skills.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Score & CTA */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Alignment</div>
                  <div className="text-2xl font-black text-blue-400">{item.alignment_score}%</div>
                </div>

                <button
                  onClick={() => handleSelectRole(item.occupation_id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02]"
                >
                  <span>Select Target</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

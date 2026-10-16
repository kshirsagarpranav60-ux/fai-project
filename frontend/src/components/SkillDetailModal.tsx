import React from 'react';
import { X, BookOpen, Clock, AlertCircle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

export const SkillDetailModal: React.FC = () => {
  const { activeSkillDetail, closeSkillDetail, navigate } = useSkillGap();

  if (!activeSkillDetail) return null;

  const skill = activeSkillDetail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl text-xs font-semibold uppercase tracking-wider ${
              skill.priority_tier === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              skill.priority_tier === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
              skill.priority_tier === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}>
              {skill.priority_tier} Priority
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{skill.skill_name}</h2>
          </div>
          <button
            onClick={closeSkillDetail}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase font-medium">Current Level</span>
              <div className="text-lg font-bold text-blue-400 mt-1">{skill.current_level} / 5</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase font-medium">Required Level</span>
              <div className="text-lg font-bold text-red-400 mt-1">{skill.required_level} / 5</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase font-medium">Skill Gap</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{skill.gap_percentage}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <span className="text-xs text-slate-400 uppercase font-medium">Est. Learning</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{skill.estimated_learning_hours} hrs</div>
            </div>
          </div>

          {/* Why This Matters */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-400" />
              <span>Why This Matters</span>
            </h4>
            <p className="text-sm bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/40 leading-relaxed text-slate-200">
              {skill.why_it_matters}
            </p>
          </div>

          {/* Prerequisites */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Foundational Prerequisites
            </h4>
            {skill.prerequisites && skill.prerequisites.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skill.prerequisites.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/50"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No formal prerequisites. Safe to start immediately.</p>
            )}
          </div>

          {/* Recommended Learning Sequence */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Recommended Learning Sequence
            </h4>
            <div className="space-y-2">
              {skill.recommended_sequence.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/30 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => {
              closeSkillDetail();
              navigate('resources');
            }}
            className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse {skill.skill_name} Learning Resources</span>
          </button>
          <button
            onClick={() => {
              closeSkillDetail();
              navigate('roadmap');
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-colors"
          >
            <span>View in Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

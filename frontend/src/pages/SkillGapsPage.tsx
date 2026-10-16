import React, { useState } from 'react';
import { Search, Filter, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

export const SkillGapsPage: React.FC = () => {
  const { assessmentResult, openSkillDetail, navigate } = useSkillGap();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  if (!assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Please complete an assessment or load demo mode first.
      </div>
    );
  }

  const allGaps = assessmentResult.all_gaps;

  const filteredGaps = allGaps.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.skill_name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['All', ...new Set(allGaps.map((g) => g.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-semibold text-blue-400 tracking-wider">
            Detailed Gap Analysis
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">
            Skill Gaps for {assessmentResult.occupation_title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every required competency evaluated with deterministic mathematical gaps and priority scores.
          </p>
        </div>

        <button
          onClick={() => navigate('dashboard')}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skill gaps..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gaps Table / Cards List */}
      <div className="space-y-3">
        {filteredGaps.map((skill) => (
          <div
            key={skill.skill_id}
            onClick={() => openSkillDetail(skill)}
            className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-center space-x-3.5">
              {/* Color-Coded Status Dot */}
              <div
                className={`w-3 h-3 rounded-full shrink-0 ${
                  skill.status_color === 'red'
                    ? 'bg-red-500 shadow-sm shadow-red-500/50'
                    : skill.status_color === 'orange'
                    ? 'bg-orange-500 shadow-sm shadow-orange-500/50'
                    : skill.status_color === 'yellow'
                    ? 'bg-yellow-500 shadow-sm shadow-yellow-500/50'
                    : 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                }`}
              />

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                    {skill.skill_name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {skill.category}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {skill.why_it_matters}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 self-end sm:self-auto shrink-0 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Levels</span>
                <span className="font-semibold text-white">
                  {skill.current_level}/5 → {skill.required_level}/5
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Gap</span>
                <span
                  className={`font-bold ${
                    skill.gap_percentage > 70
                      ? 'text-red-400'
                      : skill.gap_percentage > 40
                      ? 'text-orange-400'
                      : skill.gap_percentage > 20
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {skill.gap_percentage}%
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Priority</span>
                <span className="font-bold text-white">{skill.priority_score}/100</span>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider ${
                  skill.priority_tier === 'Critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : skill.priority_tier === 'High'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : skill.priority_tier === 'Medium'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {skill.priority_tier}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

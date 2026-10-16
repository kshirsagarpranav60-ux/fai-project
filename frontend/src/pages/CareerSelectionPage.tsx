import React, { useState, useEffect } from 'react';
import { Search, Compass, ArrowRight, ArrowLeft, Check, Sparkles, Filter } from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { OccupationSummary } from '../types';

export const CareerSelectionPage: React.FC = () => {
  const { targetOccupation, setTargetOccupation, navigate } = useSkillGap();
  const [occupations, setOccupations] = useState<OccupationSummary[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const data = await api.getOccupations();
        setOccupations(data);
      } catch (err) {
        console.error('Failed to fetch occupations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCareers();
  }, []);

  const filteredOccupations = occupations.filter((occ) => {
    const matchesSearch =
      occ.title.toLowerCase().includes(search.toLowerCase()) ||
      occ.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || occ.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleSelectOccupation = async (occ: OccupationSummary) => {
    try {
      const detail = await api.getOccupationDetail(occ.id);
      setTargetOccupation(detail);
      navigate('assess-skills');
    } catch (err) {
      console.error('Failed to load occupation detail:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-blue-400">Step 2 of 5</span>
          <span>Target Career Benchmark Selection</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-2/5 rounded-full transition-all duration-300" />
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-3 border border-blue-900/60">
          <Compass className="w-3.5 h-3.5" />
          <span>O*NET & ESCO Reference Benchmarks</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Choose Your Target Career</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Select the industry benchmark you want SkillGap AI to evaluate your current abilities against.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers (e.g., Data Scientist, AI Engineer)..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Technology', 'Business'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
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

      {/* Career Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading career profiles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOccupations.map((occ) => {
            const isSelected = targetOccupation?.id === occ.id;
            return (
              <div
                key={occ.id}
                onClick={() => handleSelectOccupation(occ)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-blue-400">
                      {occ.category}
                    </span>
                    {occ.onet_code && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        O*NET: {occ.onet_code}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center justify-between">
                    <span>{occ.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {occ.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{occ.skills_count} Required Skills</span>
                  <div className="flex items-center space-x-1 font-semibold text-emerald-400 text-[11px]">
                    <Sparkles className="w-3 h-3" />
                    <span>Demand: {Math.round(occ.future_demand_weight * 100)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between max-w-3xl mx-auto">
        <button
          onClick={() => navigate('profile')}
          className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Profile</span>
        </button>
        {targetOccupation && (
          <button
            onClick={() => navigate('assess-skills')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30"
          >
            <span>Proceed to Skill Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

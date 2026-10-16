import React, { useState, useEffect } from 'react';
import {
  BookOpen, ExternalLink, Search, Filter, CheckCircle, Video,
  FileText, Code, GraduationCap
} from 'lucide-react';
import { api } from '../services/api';
import { LearningResource } from '../types';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getResources();
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const types = ['All', 'Course', 'Documentation', 'Tutorial', 'Video', 'Practice'];

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.skill_name && r.skill_name.toLowerCase().includes(search.toLowerCase())) ||
      r.provider.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || r.resource_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Learning Database</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Learning Resources Hub</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Curated courses, interactive practices, and official documentation matching your target career skills.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by skill, title, or provider..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedType === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading resources...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-900/60">
                    {res.resource_type}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {res.is_free ? 'Free' : 'Paid'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 mt-1">{res.title}</h3>
                <div className="text-xs text-slate-400 mt-1 font-medium">{res.provider}</div>

                <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">{res.duration}</span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

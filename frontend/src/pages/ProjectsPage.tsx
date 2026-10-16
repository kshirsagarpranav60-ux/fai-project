import React, { useState, useEffect } from 'react';
import { FolderGit2, Clock, Code2, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { ProjectItem } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredProjects = projects.filter(
    (p) => selectedDifficulty === 'All' || p.difficulty === selectedDifficulty
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Hands-on Portfolio Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Recommended Projects</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Build practical proof-of-work projects mapped to missing skills to demonstrate competency to technical hiring managers.
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center space-x-2">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDifficulty(d)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              selectedDifficulty === d
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      p.difficulty === 'Beginner'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        : p.difficulty === 'Intermediate'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                    }`}
                  >
                    {p.difficulty}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{p.estimated_hours} hrs</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.description}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="text-xs">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                    Tech Stack
                  </span>
                  <div className="flex items-center space-x-1.5 text-slate-300 font-mono text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{p.tech_stack}</span>
                  </div>
                </div>

                {p.related_skills && (
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                      Skills Developed
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {p.related_skills.split(',').map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Database, Shield, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <Database className="w-3.5 h-3.5" />
          <span>Taxonomy Attribution</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Reference Data Sources</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          SkillGap AI's career database, required skill levels, and future weights are grounded in standardized global taxonomies.
        </p>
      </div>

      {/* Mandatory Non-Affiliation Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center space-x-2 font-bold text-slate-200">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Independent Academic Attribution Notice</span>
        </div>
        <p className="leading-relaxed">
          SkillGap AI is an independent academic Fundamentals of Artificial Intelligence (FAI) project. It is not officially affiliated with, sponsored by, or endorsed by the U.S. Department of Labor (O*NET), the European Commission (ESCO), or the World Economic Forum (WEF).
        </p>
      </div>

      {/* 3 Reference Sources Cards */}
      <div className="space-y-4">
        {/* Source 1: O*NET */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">1. O*NET OnLine (U.S. Department of Labor)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-mono">SOC Standard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Used as the primary taxonomy for standard occupational classification codes (e.g., Data Scientist 15-2051.00, Software Developer 15-1252.00), core technical tasks, tool lists, and baseline proficiency benchmarks.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Reference: National Center for O*NET Development (onetcenter.org)
          </div>
        </div>

        {/* Source 2: ESCO */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">2. ESCO (European Skills, Competences, Qualifications and Occupations)</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono">European Commission</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Used for cross-domain multilingual skill mapping, hierarchical categorizations (Programming, Data, AI, Soft Skills), and cognitive competence definitions.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Reference: Directorate-General for Employment, Social Affairs and Inclusion
          </div>
        </div>

        {/* Source 3: WEF Future of Jobs */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">3. World Economic Forum (WEF) Future of Jobs Report</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">Contextual Multipliers</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Utilized strictly as contextual weighting factors (<code className="text-emerald-400 font-mono">W_future</code> from 0.0 to 1.0) to model rising industry demand in Artificial Intelligence, Cloud Infrastructure, and Analytical Thinking over 2025–2030 projections.
          </p>
          <div className="mt-3 text-xs text-slate-500 font-mono">
            Reference: WEF Centre for the New Economy and Society
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  HelpCircle, Cpu, Database, Binary, GitCompare,
  Calculator, Sparkles, Milestone, TrendingUp, CheckCircle2
} from 'lucide-react';

export const FAIExplanationPage: React.FC = () => {
  const pipelineSteps = [
    {
      num: '01',
      title: 'Data Collection & Taxonomy Ingestion',
      icon: Database,
      desc: 'Ingests standardized occupation benchmarks and granular skill definitions from O*NET and ESCO taxonomies, augmented with World Economic Forum future-of-jobs projections.'
    },
    {
      num: '02',
      title: 'Multimodal Skill Extraction',
      icon: Cpu,
      desc: 'Parses PDF resume text via PyPDF and user inputs, extracting competency phrases and experience snippets using canonical alias dictionaries and regex detectors.'
    },
    {
      num: '03',
      title: 'Skill Normalization',
      icon: Binary,
      desc: 'Maps diverse synonyms (e.g., "sklearn", "scikit-learn", "supervised learning") into unified canonical taxonomy keys to eliminate semantic duplication.'
    },
    {
      num: '04',
      title: 'Target Benchmark Matching',
      icon: GitCompare,
      desc: 'Aligns normalized user proficiency levels (0–5 scale) against required role expectations defined by industry job models.'
    },
    {
      num: '05',
      title: 'Deterministic Gap Calculation',
      icon: Calculator,
      desc: 'Applies transparent mathematical formulas: Gap G = max(Required - Current, 0) and Gap % = (G / Required) * 100 without arbitrary black-box estimation.'
    },
    {
      num: '06',
      title: 'Heuristic Priority Scoring',
      icon: Sparkles,
      desc: 'Scales raw gaps by occupational importance weights and WEF future-demand multipliers, yielding normalized 0–100 priority rankings.'
    },
    {
      num: '07',
      title: 'Personalized Recommendation Synthesis',
      icon: CheckCircle2,
      desc: 'Identifies weak prerequisite dependencies in the DAG graph and associates curated courses, tutorials, and hands-on portfolio projects.'
    },
    {
      num: '08',
      title: 'Dynamic Roadmap Scheduling',
      icon: Milestone,
      desc: 'Partitions learning goals into 4 pedagogical phases (Foundation, Data, Specialization, Portfolio) custom-sized to the user\'s weekly available study hours.'
    },
    {
      num: '09',
      title: 'Longitudinal Progress & Reassessment Feedback',
      icon: TrendingUp,
      desc: 'Tracks before-and-after score changes (+7% deltas) upon skill verification, maintaining complete auditability across assessment lifecycles.'
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>College FAI Viva Presentation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">How SkillGap AI Works</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          An explainable, step-by-step artificial intelligence pipeline designed for academic rigor, transparent scoring, and verifiable recommendations.
        </p>
      </div>

      {/* 9-Step Visual Timeline Pipeline */}
      <div className="space-y-4">
        {pipelineSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex items-start space-x-4"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                {step.num}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

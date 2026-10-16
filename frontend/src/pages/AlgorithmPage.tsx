import React from 'react';
import { Calculator, ShieldAlert, CheckCircle2, Binary, Sparkles } from 'lucide-react';

export const AlgorithmPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <Calculator className="w-3.5 h-3.5" />
          <span>Mathematical Formulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Scoring Algorithm & Heuristics</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Deterministic mathematical modeling used by SkillGap AI to compute explainable alignment ratios and priority scores.
        </p>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Explainable Heuristic Model Disclaimer:</span> The formulas below calculate competence alignment with standardized occupation profiles. They are heuristic indices designed for student learning roadmaps, not a scientific or guarantee-backed prediction of employment or salary outcomes.
        </div>
      </div>

      {/* Formula 1: Gap Calculation */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">1</span>
          <span>Deterministic Skill Gap (G) & Gap Percentage (G%)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          For each skill in the target occupation, let <code className="text-blue-300 font-mono">R</code> be the benchmark required level (1–5) and <code className="text-blue-300 font-mono">C</code> be the learner's assessed level (0–5).
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-blue-300 space-y-2">
          <div>G = max(R - C, 0)</div>
          <div>G% = (G / R) × 100  (where R &gt; 0)</div>
        </div>
        <p className="text-xs text-slate-400">
          If user proficiency equals or exceeds the requirement (C ≥ R), the gap is zero. Division by zero is protected when R = 0.
        </p>
      </div>

      {/* Formula 2: Priority Score */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
          <span>Priority Scoring Index (P)</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Not all skill gaps carry equal urgency. Priority ranks skills based on gap magnitude, role criticality weight <code className="text-indigo-300 font-mono">W_imp</code> (0.0–1.0), and World Economic Forum future-demand weight <code className="text-indigo-300 font-mono">W_future</code> (0.0–1.0).
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 space-y-2">
          <div>Future Multiplier = 1.0 + (0.3 × W_future)</div>
          <div>P_raw = G% × W_imp × Future Multiplier</div>
          <div>P = clamp(P_raw / 1.3, 0, 100)</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-800/30 text-red-300 text-center">
            P ≥ 70: <span className="font-bold">Critical</span>
          </div>
          <div className="p-2.5 rounded-lg bg-orange-950/20 border border-orange-800/30 text-orange-300 text-center">
            45 ≤ P &lt; 70: <span className="font-bold">High</span>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-amber-300 text-center">
            25 ≤ P &lt; 45: <span className="font-bold">Medium</span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-800/30 text-blue-300 text-center">
            P &lt; 25: <span className="font-bold">Low</span>
          </div>
        </div>
      </div>

      {/* Formula 3: Overall Alignment Score */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
          <span>Career Readiness / Overall Skill Alignment Score</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The overall alignment score represents the weighted average of individual competency fulfillments across all occupation skills.
        </p>
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-300 space-y-2">
          <div>Skill Fulfillment_i = min(C_i / R_i, 1.0)</div>
          <div>Alignment Score = (∑ [Skill Fulfillment_i × W_imp,i] / ∑ W_imp,i) × 100</div>
        </div>
        <p className="text-xs text-slate-400">
          Result is bounded strictly between 0% and 100%, and status is categorized as Strong Alignment (≥80%), Moderate Gap (60–79%), Significant Gap (40–59%), or High Priority Gap (&lt;40%).
        </p>
      </div>
    </div>
  );
};

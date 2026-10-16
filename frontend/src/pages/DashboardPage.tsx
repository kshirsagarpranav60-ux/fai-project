import React from 'react';
import {
  Sparkles, AlertCircle, ArrowRight, BookOpen, Milestone,
  Bot, TrendingUp, CheckCircle2, ShieldAlert, Compass, Play
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { RadarSkillChart } from '../charts/RadarSkillChart';
import { TopGapsBarChart } from '../charts/TopGapsBarChart';
import { CategoryPerformanceChart } from '../charts/CategoryPerformanceChart';
import { SkillPriorityChart } from '../charts/SkillPriorityChart';
import { ProgressTimeChart } from '../charts/ProgressTimeChart';

export const DashboardPage: React.FC = () => {
  const {
    user, targetOccupation, assessmentResult, reassessment,
    navigate, openSkillDetail, toggleAssistant, loadDemoMode
  } = useSkillGap();

  // If no assessment yet, show prompt to load demo or run assessment
  if (!assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Analysis Run Yet</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
          Start your self-assessment wizard or launch the 1-click college demo to view complete results immediately.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('profile')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30"
          >
            Start Analysis Wizard
          </button>
          <button
            onClick={loadDemoMode}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Try 1-Click Demo</span>
          </button>
        </div>
      </div>
    );
  }

  const name = user?.name ? user.name.split(' ')[0] : 'Learner';
  const score = assessmentResult.overall_alignment_score;
  const status = assessmentResult.status;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP HEADER & HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/40 text-blue-300 text-xs font-semibold border border-blue-800/50 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Skill Alignment Analysis Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good morning, {name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Target Career: <span className="text-blue-400 font-semibold">{assessmentResult.occupation_title}</span> • Weekly Commitment: {user?.hours_per_week || 10} hours/week
            </p>
          </div>

          {/* Alignment Score Badge */}
          <div className="flex items-center space-x-5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Career Readiness Score
              </div>
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mt-0.5">
                {score}%
              </div>
              <div className="text-[11px] font-medium text-amber-400 mt-0.5">
                {status}
              </div>
            </div>

            <div className="h-12 w-px bg-slate-800" />

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('roadmap')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleAssistant}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium text-xs flex items-center space-x-1.5 border border-slate-700"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Advisor</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer (Requirement 1, 13) */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-400">
          <ShieldAlert className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>{assessmentResult.disclaimer}</span>
        </div>
      </div>

      {/* 2. CATEGORY BREAKDOWN CARDS */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Category Competency Scores
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {assessmentResult.category_scores.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-md hover:border-slate-700 transition-colors"
            >
              <div className="text-xs font-medium text-slate-400 truncate">
                {cat.category_name}
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {cat.alignment_percentage}%
              </div>
              {/* Mini Progress Bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    cat.alignment_percentage >= 75 ? 'bg-emerald-500' :
                    cat.alignment_percentage >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${cat.alignment_percentage}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-2">
                {cat.satisfied_skills} of {cat.total_skills} skills met
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PREREQUISITE DEPENDENCY ALERTS (Requirement 18) */}
      {assessmentResult.dependency_alerts && assessmentResult.dependency_alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Prerequisite Integrity Alerts (Dependency DAG Engine)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessmentResult.dependency_alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900/80 border border-amber-900/30 text-xs text-slate-200"
              >
                <div className="font-semibold text-amber-300">
                  Target: {alert.target_skill} (Weak Prerequisite: {alert.weak_prerequisite})
                </div>
                <div className="text-[11px] text-slate-400 mt-1">{alert.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISUALIZATIONS GRID (RECHARTS) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Interactive Analytical Visualizations
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Radar Chart (User vs Target Role) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">1. Radar Profile: User vs Target Role</h3>
              <span className="text-[10px] text-slate-400 font-mono">Multivariate 0–5 Scale</span>
            </div>
            <RadarSkillChart data={assessmentResult.radar_data} />
          </div>

          {/* Chart 2: Top Skill Gaps Horizontal Bar Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">2. Top Skill Gaps (Color-Coded Priority)</h3>
              <span className="text-[10px] text-slate-400 font-mono">0–100% Gap</span>
            </div>
            <TopGapsBarChart data={assessmentResult.top_gaps} />
          </div>

          {/* Chart 3: Category Performance Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">3. Category Alignment Distribution</h3>
              <span className="text-[10px] text-slate-400 font-mono">Grouped Aggregation</span>
            </div>
            <CategoryPerformanceChart data={assessmentResult.category_scores} />
          </div>

          {/* Chart 4: Skill Priority Distribution (Gap vs Importance) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">4. Priority Matrix (Gap % vs Role Importance)</h3>
              <span className="text-[10px] text-slate-400 font-mono">Heuristic Weighting</span>
            </div>
            <SkillPriorityChart data={assessmentResult.all_gaps} />
          </div>
        </div>

        {/* Chart 5: Historical Progress Over Time */}
        <div className="mt-6 p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">5. Progress Over Time & Reassessment Curve</h3>
              <p className="text-xs text-slate-400">Verifiable longitudinal progress tracking</p>
            </div>
            {reassessment && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                +{reassessment.score_delta}% Readiness Gain
              </span>
            )}
          </div>
          <ProgressTimeChart
            baselineScore={reassessment?.previous_score || 64}
            currentScore={reassessment?.current_score || score}
            baselineDate={reassessment?.previous_date || 'Baseline'}
            currentDate={reassessment?.current_date || 'Current'}
          />
        </div>
      </div>

      {/* 5. TOP 5 PRIORITY SKILL GAPS (Requirement 16) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Top 5 Priority Skills to Develop</h3>
            <p className="text-xs text-slate-400">
              Ranked mathematically by gap percentage, role importance, and future market demand. Click any skill for deep drill-down.
            </p>
          </div>
          <button
            onClick={() => navigate('skill-gaps')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            View All Gaps
          </button>
        </div>

        <div className="space-y-3">
          {assessmentResult.top_gaps.map((skill, idx) => (
            <div
              key={skill.skill_id}
              onClick={() => openSkillDetail(skill)}
              className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center space-x-3.5">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center space-x-2">
                    <span>{skill.skill_name}</span>
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                      {skill.category}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {skill.why_it_matters}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-200">
                    Gap: {skill.gap_percentage}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {skill.current_level}/5 → {skill.required_level}/5
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
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

      {/* 6. NEXT ACTION CALL TO ACTION */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-indigo-900/30 border border-blue-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">Recommended Next Action</h4>
          <p className="text-xs text-slate-300 mt-1">
            Begin Phase 1 foundational study tasks or inspect your custom Skill Dependency Graph.
          </p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('skill-graph')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
          >
            Inspect Skill Graph
          </button>
          <button
            onClick={() => navigate('roadmap')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
          >
            Open Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

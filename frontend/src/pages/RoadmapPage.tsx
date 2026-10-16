import React, { useState } from 'react';
import {
  Milestone, CheckSquare, Square, Clock, BookOpen, FolderGit2,
  ExternalLink, Sparkles, ArrowRight, ArrowLeft
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';

export const RoadmapPage: React.FC = () => {
  const { roadmap, setRoadmap, user, navigate } = useSkillGap();
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  if (!roadmap || !roadmap.phases || roadmap.phases.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Please complete an assessment or load demo mode to generate your personalized learning roadmap.
      </div>
    );
  }

  const handleToggleTask = async (phaseNum: number, taskIndex: number, skillId: number, currentCompleted: boolean) => {
    // Optimistic UI update
    const updatedPhases = [...roadmap.phases];
    updatedPhases[phaseNum - 1].tasks[taskIndex].is_completed = !currentCompleted;
    setRoadmap({ ...roadmap, phases: updatedPhases });

    if (user?.id) {
      try {
        await api.toggleRoadmapTask(user.id, skillId, !currentCompleted);
      } catch (err) {
        console.warn('Failed to persist task toggle:', err);
      }
    }
  };

  const totalTasks = roadmap.phases.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = roadmap.phases.reduce(
    (acc, p) => acc + p.tasks.filter((t) => t.is_completed).length,
    0
  );
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold border border-blue-900/60 mb-2">
            <Milestone className="w-3.5 h-3.5" />
            <span>Personalized Curriculum Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Learning Roadmap for {roadmap.occupation_title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Custom-sized around your <span className="text-blue-400 font-semibold">{roadmap.weekly_study_hours} hrs/week</span> commitment, covering {roadmap.total_estimated_weeks} weeks of structured milestones.
          </p>
        </div>

        {/* Progress Box */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0 text-right">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Roadmap Completion
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-0.5">{percentComplete}%</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {completedTasks} of {totalTasks} tasks completed
          </div>
        </div>
      </div>

      {/* Phase Navigation Tabs */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {roadmap.phases.map((phase, idx) => {
          const isSelected = activePhaseIndex === idx;
          const phaseCompleted = phase.tasks.filter((t) => t.is_completed).length;
          return (
            <button
              key={phase.phase_number}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-4 rounded-2xl border text-left shrink-0 w-64 transition-all ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>{phase.week_range}</span>
                <span className="text-blue-400 font-mono">
                  {phaseCompleted}/{phase.tasks.length}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1 line-clamp-1">{phase.phase_name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{phase.focus_summary}</p>
            </button>
          );
        })}
      </div>

      {/* Active Phase Tasks List */}
      {roadmap.phases[activePhaseIndex] && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {roadmap.phases[activePhaseIndex].week_range}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {roadmap.phases[activePhaseIndex].phase_name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {roadmap.phases[activePhaseIndex].focus_summary}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {roadmap.phases[activePhaseIndex].tasks.map((task, tIdx) => (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all ${
                  task.is_completed
                    ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
                    : 'bg-slate-800/50 border-slate-700/70 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    {/* Toggle Checkbox */}
                    <button
                      onClick={() =>
                        handleToggleTask(
                          roadmap.phases[activePhaseIndex].phase_number,
                          tIdx,
                          task.skill_id,
                          task.is_completed
                        )
                      }
                      className="mt-0.5 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {task.is_completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-sm font-bold ${
                            task.is_completed ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            task.difficulty === 'Beginner'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : task.difficulty === 'Intermediate'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-purple-500/15 text-purple-400'
                          }`}
                        >
                          {task.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Associated Resource & Project Recommendation */}
                      <div className="mt-4 flex flex-wrap gap-3 text-xs">
                        {task.recommended_resource_title && (
                          <a
                            href={task.recommended_resource_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-800/50 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                            <span className="font-medium truncate max-w-xs">
                              Resource: {task.recommended_resource_title}
                            </span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}

                        {task.recommended_project_title && (
                          <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                            <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="truncate max-w-xs">
                              Project: {task.recommended_project_title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hours Badge */}
                  <div className="flex items-center space-x-1 text-slate-400 text-xs shrink-0 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.estimated_hours} hrs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

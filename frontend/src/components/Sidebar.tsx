import React from 'react';
import {
  LayoutDashboard, PlayCircle, Compass, FileSearch, FileUp,
  BarChart3, GitFork, Milestone, BookOpen, FolderGit2,
  TrendingUp, Bot, Cog, HelpCircle, Calculator, Database, ShieldCheck
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

interface Props {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({ mobileOpen, onCloseMobile }) => {
  const { currentView, navigate, toggleAssistant } = useSkillGap();

  const navSections = [
    {
      title: 'Core Workflow',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Analyze Skills (Wizard)', icon: PlayCircle },
        { id: 'career-select', label: 'Career Explorer', icon: Compass },
        { id: 'career-match', label: 'Which Career Fits Me?', icon: GitFork },
      ],
    },
    {
      title: 'Gap Analysis & Visuals',
      items: [
        { id: 'skill-gaps', label: 'Skill Gap Details', icon: BarChart3 },
        { id: 'skill-graph', label: 'Dependency Graph', icon: GitFork },
        { id: 'roadmap', label: 'Learning Roadmap', icon: Milestone },
        { id: 'progress', label: 'Progress & Reassessment', icon: TrendingUp },
      ],
    },
    {
      title: 'AI Tools & Parsers',
      items: [
        { id: 'resume-upload', label: 'Resume Analyzer', icon: FileUp },
        { id: 'job-analyzer', label: 'Job Description Analyzer', icon: FileSearch },
        { id: 'ai-assistant', label: 'AI Assistant Panel', icon: Bot, action: toggleAssistant },
      ],
    },
    {
      title: 'Learning & Practice',
      items: [
        { id: 'resources', label: 'Resource Hub', icon: BookOpen },
        { id: 'projects', label: 'Recommended Projects', icon: FolderGit2 },
      ],
    },
    {
      title: 'FAI Academic Showcase',
      items: [
        { id: 'fai-works', label: 'How SkillGap AI Works', icon: HelpCircle },
        { id: 'algorithm', label: 'Scoring Algorithm', icon: Calculator },
        { id: 'data-sources', label: 'Data Sources (O*NET/WEF)', icon: Database },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 'admin', label: 'Admin Management', icon: ShieldCheck },
        { id: 'settings', label: 'Settings & Export', icon: Cog },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto flex flex-col`}
      >
        <div className="p-4 space-y-6 flex-1">
          {navSections.map((section, sIdx) => (
            <div key={sIdx}>
              <h3 className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          navigate(item.id);
                        }
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Viva Project Tag in Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/70 text-[11px] text-slate-500">
          <div className="font-semibold text-slate-400">Fundamentals of AI (FAI)</div>
          <div>Explainable Heuristic Pipeline</div>
        </div>
      </aside>
    </>
  );
};

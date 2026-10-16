import React from 'react';
import {
  Sparkles, Bot, Play, Compass, FileText, CheckCircle2,
  Menu, X, ShieldAlert, Cpu
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

interface Props {
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleMobileSidebar }) => {
  const {
    targetOccupation, assessmentResult, currentView, navigate,
    toggleAssistant, loadDemoMode, isLoading, user
  } = useSkillGap();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Brand & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div
              onClick={() => navigate('landing')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white flex items-center space-x-1">
                  <span>SkillGap</span>
                  <span className="text-blue-500">AI</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-400 font-medium -mt-1 tracking-wide">
                  Know where you stand. Know what to learn next.
                </span>
              </div>
            </div>
          </div>

          {/* Center Badges (When Assessment exists) */}
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            {targetOccupation && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Target:</span>
                <span className="font-semibold text-white">{targetOccupation.title}</span>
              </div>
            )}
            {assessmentResult && (
              <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300">
                <span className="text-blue-400 uppercase text-[10px] font-semibold">Readiness Score:</span>
                <span className="font-bold text-white text-sm">{assessmentResult.overall_alignment_score}%</span>
                <span className="text-[10px] text-slate-400">({assessmentResult.status})</span>
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Try Demo CTA */}
            <button
              onClick={loadDemoMode}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Instant prefill Alex Chen (B.Tech AI & Data Science -> Data Scientist)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Try Demo</span>
            </button>

            {/* AI Assistant Toggle Button */}
            <button
              onClick={toggleAssistant}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-medium transition-colors"
            >
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            {/* Quick Profile / Settings link */}
            <button
              onClick={() => navigate('profile')}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="User Profile"
            >
              <span className="text-xs font-semibold px-1">
                {user?.name ? user.name.split(' ')[0] : 'Profile'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

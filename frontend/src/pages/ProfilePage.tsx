import React, { useState } from 'react';
import { User, ArrowRight, BookOpen, Clock, Target, GraduationCap, Briefcase } from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, setUser, navigate, isLoading } = useSkillGap();

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Chen',
    education_level: user?.education_level || 'Undergraduate',
    degree: user?.degree || 'B.Tech',
    branch: user?.branch || 'Artificial Intelligence & Data Science',
    year: user?.year || '3rd Year',
    experience_level: user?.experience_level || 'Student',
    career_goal: user?.career_goal || 'Become a Data Scientist at an innovative AI product team',
    hours_per_week: user?.hours_per_week || 10,
    learning_preference: user?.learning_preference || 'Hands-on Projects',
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await api.createOrUpdateUser({
        name: formData.name,
        education_level: formData.education_level,
        degree: formData.degree,
        branch: formData.branch,
        year: formData.year,
        experience_level: formData.experience_level,
        career_goal: formData.career_goal,
        hours_per_week: Number(formData.hours_per_week),
        learning_preference: formData.learning_preference,
      });
      setUser(saved);
      navigate('career-select');
    } catch (err) {
      console.error('Failed to save profile:', err);
      // Still allow continuation
      setUser({ ...formData, hours_per_week: Number(formData.hours_per_week) });
      navigate('career-select');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-blue-400">Step 1 of 5</span>
          <span>User Profile Information</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-1/5 rounded-full transition-all duration-300" />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Your Profile & Learning Goals</h2>
            <p className="text-xs text-slate-400">
              Helps calibrate realistic weekly roadmap milestones and baseline readiness.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g., Alex Chen"
            />
          </div>

          {/* Education Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Education Level *
              </label>
              <select
                value={formData.education_level}
                onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Diploma">Diploma</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Working Professional">Working Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Degree Program
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., B.Tech / B.S. / BCA"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., AI & Data Science / CS"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Academic Year / Status
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Graduated">Graduated / Working</option>
              </select>
            </div>
          </div>

          {/* Experience & Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Experience Level *
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Student">Student</option>
                <option value="Junior">Junior</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Hours Available Per Week *
              </label>
              <select
                value={formData.hours_per_week}
                onChange={(e) => setFormData({ ...formData, hours_per_week: Number(e.target.value) })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value={3}>3 hours/week (Light)</option>
                <option value={5}>5 hours/week (Steady)</option>
                <option value={10}>10 hours/week (Recommended)</option>
                <option value={15}>15 hours/week (Accelerated)</option>
                <option value={20}>20+ hours/week (Intensive)</option>
              </select>
            </div>
          </div>

          {/* Learning Preference */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Preferred Learning Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Hands-on Projects',
                'Video Courses',
                'Interactive Coding',
                'Reading Docs & Theory'
              ].map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setFormData({ ...formData, learning_preference: style })}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    formData.learning_preference === style
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700/60 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Career Goal */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Career Goal / Target Ambition
            </label>
            <textarea
              rows={2}
              value={formData.career_goal}
              onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="e.g., Transition from student to junior data scientist or machine learning engineer"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('landing')}
              className="text-xs text-slate-400 hover:text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Continue to Career Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

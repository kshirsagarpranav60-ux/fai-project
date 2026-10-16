import React, { useState } from 'react';
import {
  FileSearch, CheckCircle2, AlertCircle, XCircle, ArrowRight, ArrowLeft,
  Sparkles, Target, Building2, Briefcase
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { JDAnalysisResponse } from '../types';

export const JobAnalyzerPage: React.FC = () => {
  const { user, skillRatings, navigate, runAnalysis } = useSkillGap();
  const [jobTitle, setJobTitle] = useState('Senior Machine Learning / Data Analyst');
  const [company, setCompany] = useState('Nexus AI Labs');
  const [rawText, setRawText] = useState(
    `Nexus AI Labs is seeking a passionate Machine Learning & Data Analyst.\n\n` +
    `Requirements:\n` +
    `• Strong proficiency in Python, SQL, and Machine Learning.\n` +
    `• Solid mathematical foundation in Statistics and Model Evaluation.\n` +
    `• Experience with Pandas and Data Cleaning workflows.\n\n` +
    `Preferred / Nice to have:\n` +
    `• Hands-on familiarity with Docker containers, Git version control, and AWS cloud compute.\n` +
    `• Experience presenting metrics in Power BI or Tableau.`
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<JDAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const ratingsList = Object.entries(skillRatings).map(([k, v]) => ({
        skill_id: Number(k),
        proficiency_level: v,
      }));

      const res = await api.analyzeJobDescription({
        user_id: user?.id,
        job_title: jobTitle,
        company: company,
        raw_text: rawText,
        current_skill_ratings: ratingsList,
      });
      setResult(res);
    } catch (err) {
      console.error('Job analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-blue-400">Step 5 of 5 (Optional)</span>
          <span>Target Job Description Match Analysis</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-full rounded-full transition-all duration-300" />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Analyze a Live Job Description</h2>
            <p className="text-xs text-slate-400">
              Paste any job post to immediately compare its requirements against your assessed profile.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Target Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Hiring Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Job Description Text
          </label>
          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
            placeholder="Paste raw requirements text here..."
          />
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !rawText.trim()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Calculating Job Match...' : 'Calculate Job Match Score'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>{result.company}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-0.5">{result.job_title}</h3>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase font-semibold">Job Match Score</div>
                <div className="text-3xl font-black text-blue-400">{result.match_score}%</div>
              </div>
            </div>
          </div>

          <p className="my-5 text-xs sm:text-sm text-slate-300 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40">
            {result.summary}
          </p>

          {/* Categorized Skills Breakdown (Matched, Partial, Missing) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Matched */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-800/30">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Matched Skills ({result.matched_skills.length})</span>
              </div>
              <div className="space-y-1.5">
                {result.matched_skills.length > 0 ? (
                  result.matched_skills.map((s, idx) => (
                    <div key={idx} className="text-xs text-emerald-200 flex items-center space-x-1.5">
                      <span>✓</span>
                      <span className="font-medium">{s}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None yet</span>
                )}
              </div>
            </div>

            {/* Partial */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase mb-3">
                <AlertCircle className="w-4 h-4" />
                <span>Partial Overlap ({result.partial_skills.length})</span>
              </div>
              <div className="space-y-1.5">
                {result.partial_skills.length > 0 ? (
                  result.partial_skills.map((s, idx) => (
                    <div key={idx} className="text-xs text-amber-200 flex items-center space-x-1.5">
                      <span>◐</span>
                      <span className="font-medium">{s}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None</span>
                )}
              </div>
            </div>

            {/* Missing */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30">
              <div className="flex items-center space-x-2 text-xs font-bold text-red-400 uppercase mb-3">
                <XCircle className="w-4 h-4" />
                <span>Missing Competencies ({result.missing_skills.length})</span>
              </div>
              <div className="space-y-1.5">
                {result.missing_skills.length > 0 ? (
                  result.missing_skills.map((s, idx) => (
                    <div key={idx} className="text-xs text-red-300 flex items-center space-x-1.5">
                      <span>✗</span>
                      <span className="font-medium">{s}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 italic">Zero missing skills!</span>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations to improve for this job */}
          {result.top_recommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Priority Action Plan For This Role
              </h4>
              <div className="space-y-2">
                {result.top_recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/40 text-xs text-slate-200 flex items-center space-x-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate('resume-upload')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resume Upload</span>
        </button>

        <button
          onClick={runAnalysis}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30"
        >
          <span>View Results Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

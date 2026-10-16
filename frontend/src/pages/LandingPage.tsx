import React from 'react';
import {
  ArrowRight, Sparkles, Compass, CheckCircle2, BarChart2,
  Cpu, GitFork, Target, Shield, BookOpen, Play, ChevronRight
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

export const LandingPage: React.FC = () => {
  const { navigate, loadDemoMode, isLoading } = useSkillGap();

  const careerHighlights = [
    { title: 'Data Scientist', category: 'Technology', onet: '15-2051.00', demand: '95%', skills: ['Machine Learning', 'Python', 'SQL', 'Statistics'] },
    { title: 'AI Engineer', category: 'Technology', onet: '15-1252.00', demand: '100%', skills: ['Generative AI', 'LLMs', 'Prompt Engineering', 'Python'] },
    { title: 'Data Analyst', category: 'Technology', onet: '15-2051.01', demand: '85%', skills: ['SQL', 'Power BI', 'Tableau', 'Data Cleaning'] },
    { title: 'Machine Learning Engineer', category: 'Technology', onet: '15-2051.02', demand: '98%', skills: ['Deep Learning', 'PyTorch', 'Docker', 'Model Evaluation'] },
    { title: 'Full Stack Developer', category: 'Technology', onet: '15-1252.02', demand: '92%', skills: ['JavaScript', 'Python', 'SQL', 'Docker'] },
    { title: 'Product Manager', category: 'Business', onet: '11-2021.00', demand: '88%', skills: ['Analytical Thinking', 'Communication', 'Leadership'] },
  ];

  const categoryHighlights = [
    { name: 'Programming', count: '5 Core Languages', desc: 'Python, Java, C++, JavaScript, SQL' },
    { name: 'Data Engineering & Analysis', count: '9 Competencies', desc: 'Pandas, NumPy, Statistics, SQL, Power BI, Tableau' },
    { name: 'AI / Machine Learning', count: '8 Specializations', desc: 'Supervised ML, Deep Learning, NLP, Generative AI, LLMs' },
    { name: 'Cloud & Modern Tools', count: '9 Platforms', desc: 'Docker, Git, Linux, AWS, Azure, Google Cloud' },
    { name: 'Executive Soft Skills', count: '9 Cognitive Abilities', desc: 'Analytical Thinking, Problem Solving, Strategic Communication' },
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-850">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Explainable AI Skill Gap Analysis Pipeline</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">College FAI Project</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Close the gap between <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">where you are</span> and where you want to be.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SkillGap AI compares your current abilities with the skills required for your target career and builds an explainable, prioritized learning roadmap.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('profile')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
            >
              <span>Analyze My Skill Gap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('career-select')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Explore Careers</span>
            </button>
            <button
              onClick={loadDemoMode}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-current" />
              <span>Try Demo (1-Click)</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div>
              <div className="text-2xl font-bold text-white">16+</div>
              <div className="text-xs text-slate-400 mt-0.5">O*NET-Mapped Careers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">35+</div>
              <div className="text-xs text-slate-400 mt-0.5">Categorized Skills</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Explainable Math Engine</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-400">4-Phase</div>
              <div className="text-xs text-slate-400 mt-0.5">Personalized Roadmaps</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (VISUAL PIPELINE) */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-850">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">System Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">How SkillGap AI Works</h3>
            <p className="text-sm text-slate-400 mt-2">
              A transparent, 9-stage engineering pipeline from user profile to verified skill reassessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-white">Profile & Occupation Target</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Define your academic stage, available weekly study hours, and select an industry occupation benchmark derived from O*NET and ESCO taxonomies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-white">Deterministic Gap Scoring</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Computes mathematical gaps, weighted alignment ratios, and priority indices scaled by importance and World Economic Forum future demand factors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-white">Roadmap & Reassessment</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Synthesizes a 4-phase pedagogical curriculum based on prerequisite DAG dependencies and tracks verifiable before-and-after progress deltas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES */}
      <section className="py-20 border-b border-slate-850">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-2">Comprehensive FAI Toolkit</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <BarChart2 className="w-7 h-7 text-blue-400 mb-3" />
              <h4 className="text-base font-bold text-white">Multivariate Visualizations</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Interactive Recharts Radar (User vs Role), Horizontal Gap Bar Charts, Category Alignments, and Milestone Progress Curves.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <GitFork className="w-7 h-7 text-indigo-400 mb-3" />
              <h4 className="text-base font-bold text-white">Skill Dependency Graph</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Prerequisite DAG checks ensure learners never dive into advanced architectures without mastering foundational statistical or coding fundamentals.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Target className="w-7 h-7 text-emerald-400 mb-3" />
              <h4 className="text-base font-bold text-white">Which Career Fits Me?</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Evaluates user skills across all 16 occupation profiles to identify immediate matches and explain why roles align with your strengths.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Cpu className="w-7 h-7 text-amber-400 mb-3" />
              <h4 className="text-base font-bold text-white">PDF Resume & JD Parsers</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Extracts skills from resumes via PDF text parsing with user verification, and parses live job postings to calculate immediate Job Match %.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Sparkles className="w-7 h-7 text-purple-400 mb-3" />
              <h4 className="text-base font-bold text-white">SkillGap AI Assistant</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Context-grounded AI advisor explaining skill importances, weekly hour budgets, and study roadmaps with zero hallucination.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Shield className="w-7 h-7 text-teal-400 mb-3" />
              <h4 className="text-base font-bold text-white">Full Local Fallback</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Zero hardcoded API keys required. Operates seamlessly with Google Gemini / OpenAI when keys exist, or robust deterministic heuristics when offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR CAREER PATHS */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-850">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Industry Benchmarks</h2>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Popular Career Paths</h3>
            </div>
            <button
              onClick={() => navigate('career-select')}
              className="mt-3 sm:mt-0 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
            >
              <span>View All 16 Careers</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {careerHighlights.map((career, idx) => (
              <div
                key={idx}
                onClick={() => navigate('career-select')}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-900/50">
                    {career.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">O*NET {career.onet}</span>
                </div>
                <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {career.title}
                </h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {career.skills.map((s, sIdx) => (
                    <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Market Demand Index</span>
                  <span className="font-bold text-emerald-400">{career.demand}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SKILL CATEGORIES */}
      <section className="py-20 border-b border-slate-850">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Taxonomy</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Structured Skill Database</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {categoryHighlights.map((cat, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                  <span className="text-[10px] font-semibold text-blue-400">{cat.count}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXAMPLE ANALYSIS CARD */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-850">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Example Output</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">What An Assessment Looks Like</h3>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-xs font-medium text-slate-400">Target Role:</span>
                <h4 className="text-xl font-bold text-white">Data Scientist</h4>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Skill Alignment Score</div>
                  <div className="text-2xl font-black text-blue-400">64%</div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Moderate Gap
                </span>
              </div>
            </div>

            {/* Category Score Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <div className="text-xs text-slate-400">Technical</div>
                <div className="text-base font-bold text-white mt-0.5">68%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <div className="text-xs text-slate-400">Data</div>
                <div className="text-base font-bold text-white mt-0.5">71%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <div className="text-xs text-slate-400">AI / ML</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">42%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <div className="text-xs text-slate-400">Tools</div>
                <div className="text-base font-bold text-white mt-0.5">55%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-center">
                <div className="text-xs text-slate-400">Soft Skills</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">76%</div>
              </div>
            </div>

            {/* Top Gaps Example */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Priority Skills</div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">1. Machine Learning</span>
                <span className="text-red-400 font-medium">Gap: 80%</span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold text-[10px]">Critical</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-white">2. Statistics</span>
                <span className="text-orange-400 font-medium">Gap: 50%</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold text-[10px]">High</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={loadDemoMode}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1"
              >
                <span>Explore Full Interactive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY SKILLGAP AI */}
      <section className="py-20 border-b border-slate-850">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Why SkillGap AI</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">Built For Explainability, Not Black-Box Guessing</h3>
          <p className="mt-4 text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Most modern AI tools spit out opaque scores with zero explanation. SkillGap AI combines deterministic mathematical modeling for scores with generative LLMs for pedagogical advice.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white">No Employment Guarantees</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                We clearly disclose scores as "Skill Alignment" rather than unsupportable predictions of employment or salaries.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Prerequisite Integrity</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Graph dependencies enforce logical sequencing so you never get stuck on complex architectures prematurely.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-indigo-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Viva & Presentation Ready</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Demonstrates every core AI principle: data collection, normalization, heuristic priority scoring, and LLM augmentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-white">SkillGap AI</span>
            <span>— College Fundamentals of AI (FAI) Project</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <button onClick={() => navigate('fai-works')} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => navigate('algorithm')} className="hover:text-white transition-colors">Scoring Algorithm</button>
            <button onClick={() => navigate('data-sources')} className="hover:text-white transition-colors">Data Sources</button>
            <button onClick={() => navigate('admin')} className="hover:text-white transition-colors">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

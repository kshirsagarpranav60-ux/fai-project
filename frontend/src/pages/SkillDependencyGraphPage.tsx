import React, { useState } from 'react';
import {
  GitFork, CheckCircle, AlertTriangle, ArrowRight, ShieldAlert,
  Info, Sparkles, HelpCircle
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';

interface NodeDef {
  id: string;
  name: string;
  category: string;
  prerequisites: string[];
  track: 'AI/ML' | 'Data' | 'DevOps' | 'Generative AI';
  description: string;
}

const GRAPH_NODES: NodeDef[] = [
  // Track 1: AI / ML Core Track
  { id: 'python', name: 'Python', category: 'Programming', prerequisites: [], track: 'AI/ML', description: 'Base programming language for modern numerical computing.' },
  { id: 'numpy', name: 'NumPy', category: 'Data', prerequisites: ['Python'], track: 'AI/ML', description: 'Vectorized arrays and linear algebra operations.' },
  { id: 'pandas', name: 'Pandas', category: 'Data', prerequisites: ['NumPy'], track: 'AI/ML', description: 'DataFrame operations and structured tabular data cleaning.' },
  { id: 'stats', name: 'Statistics', category: 'Data', prerequisites: [], track: 'AI/ML', description: 'Probability, hypothesis testing, and statistical distributions.' },
  { id: 'ml', name: 'Machine Learning', category: 'AI / ML', prerequisites: ['Python', 'Statistics', 'NumPy', 'Pandas'], track: 'AI/ML', description: 'Supervised algorithms, regression, decision trees, and validation.' },
  { id: 'dl', name: 'Deep Learning', category: 'AI / ML', prerequisites: ['Machine Learning'], track: 'AI/ML', description: 'Multi-layer neural nets, backprop, PyTorch, and optimization.' },

  // Track 2: Generative AI & NLP Track
  { id: 'nlp', name: 'Natural Language Processing', category: 'AI / ML', prerequisites: ['Deep Learning'], track: 'Generative AI', description: 'Text tokenization, embeddings, and attention architectures.' },
  { id: 'llm', name: 'Large Language Models', category: 'AI / ML', prerequisites: ['Natural Language Processing'], track: 'Generative AI', description: 'Transformer foundations, instruction fine-tuning, and inference.' },
  { id: 'genai', name: 'Generative AI', category: 'AI / ML', prerequisites: ['Large Language Models'], track: 'Generative AI', description: 'RAG pipelines, vector databases, and multi-agent synthesis.' },
  { id: 'prompt', name: 'Prompt Engineering', category: 'AI / ML', prerequisites: ['Generative AI'], track: 'Generative AI', description: 'Structured prompt chaining, few-shot tuning, and guardrails.' },

  // Track 3: Data Engineering & Analytics Track
  { id: 'sql', name: 'SQL', category: 'Programming', prerequisites: [], track: 'Data', description: 'Relational data querying, aggregation, and relational schemas.' },
  { id: 'dataclean', name: 'Data Cleaning', category: 'Data', prerequisites: ['SQL', 'Pandas'], track: 'Data', description: 'Outlier mitigation, imputation, and feature engineering.' },
  { id: 'dataviz', name: 'Data Visualization', category: 'Data', prerequisites: ['Pandas'], track: 'Data', description: 'Exploratory charting with Matplotlib, Seaborn, and storytelling.' },

  // Track 4: Cloud & Deployment Track
  { id: 'linux', name: 'Linux', category: 'Tools', prerequisites: [], track: 'DevOps', description: 'POSIX terminal commands, bash scripting, and process execution.' },
  { id: 'docker', name: 'Docker', category: 'Tools', prerequisites: ['Linux'], track: 'DevOps', description: 'Container packaging, Dockerfiles, and reproducible runtimes.' },
  { id: 'aws', name: 'AWS', category: 'Tools', prerequisites: ['Docker'], track: 'DevOps', description: 'Scalable cloud infrastructure, S3, EC2, and managed endpoints.' },
];

export const SkillDependencyGraphPage: React.FC = () => {
  const { skillRatings, openSkillDetail, assessmentResult, navigate } = useSkillGap();
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [activeNode, setActiveNode] = useState<NodeDef>(GRAPH_NODES[4]); // Machine Learning default

  // Helper to determine node status for current user
  const getNodeStatus = (node: NodeDef) => {
    // Find skill rating in user state (by matching name)
    const matchingSkill = assessmentResult?.all_gaps.find(
      (g) => g.skill_name.toLowerCase() === node.name.toLowerCase()
    );

    const userLvl = matchingSkill ? matchingSkill.current_level : 2;
    const reqLvl = matchingSkill ? matchingSkill.required_level : 3;

    // Check if any prerequisite is weak (< 2)
    const weakPrereqs: string[] = [];
    node.prerequisites.forEach((pName) => {
      const pSkill = assessmentResult?.all_gaps.find(
        (g) => g.skill_name.toLowerCase() === pName.toLowerCase()
      );
      const pLvl = pSkill ? pSkill.current_level : 2;
      if (pLvl < 2) {
        weakPrereqs.push(pName);
      }
    });

    return {
      userLvl,
      reqLvl,
      weakPrereqs,
      isWeakPrereqBlocked: weakPrereqs.length > 0 && userLvl < reqLvl,
      isMastered: userLvl >= reqLvl && reqLvl > 0,
    };
  };

  const tracks = ['All', 'AI/ML', 'Generative AI', 'Data', 'DevOps'];

  const filteredNodes = GRAPH_NODES.filter(
    (n) => selectedTrack === 'All' || n.track === selectedTrack
  );

  const activeStatus = getNodeStatus(activeNode);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
            <GitFork className="w-3.5 h-3.5" />
            <span>Interactive Prerequisite DAG Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Skill Dependency Graph</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Visualize foundational-to-advanced learning progressions. Prerequisite integrity checks flag when attempting complex modeling without necessary basics.
          </p>
        </div>

        {/* Track Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto self-start sm:self-auto">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                selectedTrack === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Standout Interactive Graph Visualization Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Pathways (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span>Dependency Pathways (Click any node to inspect)</span>
            <span className="text-xs text-slate-400 font-normal">Click node to inspect prerequisites</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredNodes.map((node) => {
              const status = getNodeStatus(node);
              const isSelected = activeNode.id === node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/20'
                      : status.isWeakPrereqBlocked
                      ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-700'
                      : status.isMastered
                      ? 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-700'
                      : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        {node.track}
                      </span>
                      {status.isWeakPrereqBlocked ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : status.isMastered ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] text-blue-400 font-medium">In Progress</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1">{node.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {node.description}
                    </p>
                  </div>

                  {/* Prerequisites Preview */}
                  <div className="mt-4 pt-2.5 border-t border-slate-700/40 text-[10px] text-slate-400">
                    {node.prerequisites.length > 0 ? (
                      <span className="truncate block">
                        Requires: <span className="text-slate-300 font-medium">{node.prerequisites.join(', ')}</span>
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">Foundational Root</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Drill-Down & Prerequisite Alert Card (1 Column) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <GitFork className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Inspected Node
                </span>
                <h3 className="text-lg font-bold text-white">{activeNode.name}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeNode.description}
            </p>

            {/* Prerequisite Alert if Weak */}
            {activeStatus.isWeakPrereqBlocked && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 mb-4 text-xs text-amber-200">
                <div className="flex items-center space-x-1.5 font-bold text-amber-400 mb-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Prerequisite Warning</span>
                </div>
                <div>
                  You should strengthen <span className="font-bold underline">{activeStatus.weakPrereqs.join(' and ')}</span> before attempting advanced {activeNode.name}.
                </div>
              </div>
            )}

            {/* Prerequisites Chain List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Direct Prerequisites
              </h4>
              {activeNode.prerequisites.length > 0 ? (
                activeNode.prerequisites.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{p}</span>
                    <span className="text-blue-400 font-medium text-[11px]">Required Foundation</span>
                  </div>
                ))
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-800/40 text-xs text-emerald-400 italic">
                  Root skill. No upstream prerequisites required.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => navigate('roadmap')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30"
            >
              <span>View In Learning Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

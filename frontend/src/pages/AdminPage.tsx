import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit2, Database, BookOpen, FolderGit2 } from 'lucide-react';
import { api } from '../services/api';
import { OccupationSummary, Skill, SkillCategory } from '../types';

export const AdminPage: React.FC = () => {
  const [occupations, setOccupations] = useState<OccupationSummary[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [activeTab, setActiveTab] = useState<'careers' | 'skills'>('careers');

  // Form states for creating new items
  const [newCareerTitle, setNewCareerTitle] = useState('');
  const [newCareerCategory, setNewCareerCategory] = useState('Technology');
  const [newCareerDesc, setNewCareerDesc] = useState('');

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCatId, setNewSkillCatId] = useState<number>(1);
  const [newSkillDesc, setNewSkillDesc] = useState('');

  const loadAll = async () => {
    try {
      const [occData, skillData, catData] = await Promise.all([
        api.getOccupations(),
        api.getSkills(),
        api.getCategories(),
      ]);
      setOccupations(occData);
      setSkills(skillData);
      setCategories(catData);
      if (catData.length > 0) setNewSkillCatId(catData[0].id);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCareerTitle.trim()) return;
    try {
      await api.adminCreateOccupation({
        title: newCareerTitle,
        category: newCareerCategory,
        description: newCareerDesc,
        future_demand_weight: 0.85,
        skills: [],
      });
      setNewCareerTitle('');
      setNewCareerDesc('');
      await loadAll();
    } catch (err) {
      console.error('Failed to create occupation:', err);
    }
  };

  const handleDeleteCareer = async (id: number) => {
    if (!window.confirm('Delete this occupation benchmark?')) return;
    try {
      await api.adminDeleteOccupation(id);
      await loadAll();
    } catch (err) {
      console.error('Failed to delete occupation:', err);
    }
  };

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    try {
      await api.adminCreateSkill({
        name: newSkillName,
        category_id: newSkillCatId,
        description: newSkillDesc,
        future_demand_weight: 0.8,
        default_importance: 0.75,
      });
      setNewSkillName('');
      setNewSkillDesc('');
      await loadAll();
    } catch (err) {
      console.error('Failed to create skill:', err);
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.adminDeleteSkill(id);
      await loadAll();
    } catch (err) {
      console.error('Failed to delete skill:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 text-xs font-semibold mb-2 border border-blue-900/60">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Database Administration & Taxonomy CRUD</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Management Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Manage occupations, skill definitions, category associations, and learning references directly in the database.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('careers')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'careers'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Careers ({occupations.length})
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Skills ({skills.length})
        </button>
      </div>

      {activeTab === 'careers' ? (
        <div className="space-y-6">
          {/* Create Occupation Form */}
          <form
            onSubmit={handleCreateCareer}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Add New Occupation Benchmark</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={newCareerTitle}
                onChange={(e) => setNewCareerTitle(e.target.value)}
                placeholder="Occupation Title (e.g., Quantum Computing Specialist)"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <select
                value={newCareerCategory}
                onChange={(e) => setNewCareerCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <textarea
              rows={2}
              value={newCareerDesc}
              onChange={(e) => setNewCareerDesc(e.target.value)}
              placeholder="Description of role and typical industry expectations..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Create Occupation
              </button>
            </div>
          </form>

          {/* Occupations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {occupations.map((occ) => (
              <div
                key={occ.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{occ.title}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {occ.category} • {occ.skills_count} skills
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteCareer(occ.id)}
                  className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete occupation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Create Skill Form */}
          <form
            onSubmit={handleCreateSkill}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-blue-400" />
              <span>Add New Skill to Taxonomy</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill Name (e.g., Kubernetes)"
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <select
                value={newSkillCatId}
                onChange={(e) => setNewSkillCatId(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              rows={2}
              value={newSkillDesc}
              onChange={(e) => setNewSkillDesc(e.target.value)}
              placeholder="Description of skill..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Create Skill
              </button>
            </div>
          </form>

          {/* Skills List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{s.name}</h4>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.category_name}</div>
                </div>
                <button
                  onClick={() => handleDeleteSkill(s.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete skill"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

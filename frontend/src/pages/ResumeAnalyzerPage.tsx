import React, { useState } from 'react';
import {
  FileUp, Upload, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft,
  Sparkles, FileText, Check, Shield
} from 'lucide-react';
import { useSkillGap } from '../context/SkillGapContext';
import { api } from '../services/api';
import { DetectedSkillItem } from '../types';

export const ResumeAnalyzerPage: React.FC = () => {
  const { user, setSkillRating, navigate, runAnalysis } = useSkillGap();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedSkills, setDetectedSkills] = useState<DetectedSkillItem[]>([]);
  const [selectedSkillNames, setSelectedSkillNames] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setConfirmed(false);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (rawText) {
        formData.append('raw_text', rawText);
      }
      if (user?.id) {
        formData.append('user_id', user.id.toString());
      }

      const res = await api.uploadResume(formData);
      setDetectedSkills(res.detected_skills);

      // Default select all detected skills
      const initialChecked: Record<string, boolean> = {};
      res.detected_skills.forEach((d) => {
        initialChecked[d.skill_name] = true;
      });
      setSelectedSkillNames(initialChecked);
    } catch (err) {
      console.error('Failed to parse resume:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggleSkill = (name: string) => {
    setSelectedSkillNames((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleConfirmAndApply = async () => {
    const toApply = detectedSkills.filter((d) => selectedSkillNames[d.skill_name]);
    
    // Update local context
    toApply.forEach((d) => {
      if (d.matched_skill_id) {
        setSkillRating(d.matched_skill_id, d.suggested_level);
      }
    });

    // If user saved in backend, confirm via API
    if (user?.id) {
      try {
        const payload = toApply
          .filter((d) => d.matched_skill_id !== null)
          .map((d) => ({
            skill_id: d.matched_skill_id!,
            proficiency_level: d.suggested_level,
          }));
        await api.confirmResumeSkills(user.id, payload);
      } catch (err) {
        console.warn('Backend confirmation failed:', err);
      }
    }

    setConfirmed(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-blue-400">Step 4 of 5 (Optional)</span>
          <span>Resume Text & Skill Extraction</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-4/5 rounded-full transition-all duration-300" />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">AI Resume Skill Extractor</h2>
            <p className="text-xs text-slate-400">
              Upload your PDF resume or paste text to automatically detect and normalize skills.
            </p>
          </div>
        </div>

        {/* Security & Explicit Confirmation Notice */}
        <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 mb-6 flex items-start space-x-2.5 text-xs text-blue-200">
          <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Privacy First:</span> Resumes are processed in memory and never permanently stored without consent. Detected skills require your explicit review before being added to your profile.
          </div>
        </div>

        {/* Upload Box & Text Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/70 rounded-2xl p-6 text-center transition-colors flex flex-col items-center justify-center bg-slate-950/40">
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-xs font-semibold text-white">Upload PDF Resume</span>
            <span className="text-[11px] text-slate-500 mt-1">Accepts standard .pdf resumes</span>

            <input
              type="file"
              id="resume-file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="resume-file"
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors border border-slate-700"
            >
              {selectedFile ? selectedFile.name : 'Choose File'}
            </label>
          </div>

          {/* Text Input Fallback */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Or Paste Resume Text (Fallback)
            </label>
            <textarea
              rows={5}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setSelectedFile(null);
              }}
              placeholder="e.g., Developed predictive ML models using Python, Pandas, Scikit-learn, and SQL. Containerized workflows in Docker..."
              className="w-full flex-1 bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Parse Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? 'Extracting Skills...' : 'Extract & Detect Skills'}</span>
          </button>
        </div>
      </div>

      {/* Detected Skills Preview with Checkbox Confirmation */}
      {detectedSkills.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-8 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Detected Skills ({detectedSkills.length})</span>
                <span className="text-xs font-normal text-slate-400">— Confirm before adding to profile</span>
              </h3>
            </div>
            <div className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Regex & Taxonomy Verified</span>
            </div>
          </div>

          <div className="space-y-3">
            {detectedSkills.map((item, idx) => {
              const isChecked = Boolean(selectedSkillNames[item.skill_name]);
              return (
                <div
                  key={idx}
                  onClick={() => handleToggleSkill(item.skill_name)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-blue-950/30 border-blue-500/60 text-white'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-70'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleSkill(item.skill_name)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-2">
                        <span>{item.skill_name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-normal">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 italic line-clamp-1">
                        Detected phrase: "{item.detected_phrase}"
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-blue-400">
                      Suggested Level: {item.suggested_level}/5
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Confidence: {Math.round(item.confidence * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirmation Action */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {Object.values(selectedSkillNames).filter(Boolean).length} skills selected
            </span>
            <button
              onClick={handleConfirmAndApply}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                confirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{confirmed ? 'Skills Added to Profile!' : 'Confirm & Add to Profile'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          onClick={() => navigate('assess-skills')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Assessment</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('job-analyzer')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
          >
            Optional: Analyze Job Description
          </button>
          <button
            onClick={runAnalysis}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-blue-600/30"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Plus, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: (job: any) => void;
}

export default function AddJobModal({ isOpen, onClose, onJobAdded }: AddJobModalProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState<'Kochi' | 'Bangalore'>('Kochi');
  const [experienceLevel, setExperienceLevel] = useState<'Entry Level' | 'Mid Level' | 'Senior Level'>('Entry Level');
  const [jobUrl, setJobUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: title.trim(),
          company_name: company.trim(),
          location,
          job_url: jobUrl.trim() || undefined,
          experience_level: experienceLevel,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onJobAdded(data);
        setTitle('');
        setCompany('');
        setJobUrl('');
        setExperienceLevel('Entry Level');
        onClose();
      } else {
        alert(data.error || 'Failed to submit vacancy.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error submitting job posting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <h3 className="font-display font-bold text-zinc-900 text-base">Add New AI/ML Vacancy</h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-1 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-650 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5 animate-fade-in">
              <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                Job Appointment Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Deep Learning Scientist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5 animate-fade-in">
              <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                Hiring Company / Lab
              </label>
              <input
                type="text"
                required
                placeholder="e.g. BrainTech India, Wipro Kochi"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
              />
            </div>

            {/* Target Area Location */}
            <div className="space-y-1.5">
              <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                Target Hub Location
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Kochi', 'Bangalore'].map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setLocation(loc as 'Kochi' | 'Bangalore')}
                    className={`py-2.5 rounded-xl text-center font-medium border text-xs transition-all ${
                      location === loc
                        ? 'bg-zinc-900 border-zinc-900 text-white'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Experience Level */}
            <div className="space-y-1.5">
              <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                Target Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'Entry Level', label: '🎓 Entry/Fresher' },
                  { value: 'Mid Level', label: '💻 Mid Level' },
                  { value: 'Senior Level', label: '🚀 Senior' }
                ].map((exp) => (
                  <button
                    type="button"
                    key={exp.value}
                    onClick={() => setExperienceLevel(exp.value as 'Entry Level' | 'Mid Level' | 'Senior Level')}
                    className={`py-2.5 rounded-xl text-center font-medium border text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      experienceLevel === exp.value
                        ? exp.value === 'Entry Level'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <span>{exp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Job posting URL */}
            <div className="space-y-1.5 animate-fade-in">
              <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block flex items-center justify-between">
                <span>Reference URL (Optional)</span>
                <span className="text-[10px] text-zinc-400 font-normal normal-case">LinkedIn / Company Portal</span>
              </label>
              <input
                type="url"
                placeholder="https://www.linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
              />
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-1/3 py-2.5 text-center font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2.5 bg-zinc-900 hover:bg-zinc-950 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-zinc-950/10 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'Posting...' : 'Create Job Node'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

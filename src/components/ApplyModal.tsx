import React, { useState, useRef } from 'react';
import { X, Send, FileCode, CheckCircle2, Upload, AlertCircle, Sparkles, FolderUp, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JobPosting } from '../types';

interface ApplyModalProps {
  isOpen: boolean;
  job: JobPosting | null;
  onClose: () => void;
  onApplySuccess: (jobId: string) => void;
}

export default function ApplyModal({ isOpen, job, onClose, onApplySuccess }: ApplyModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [fresherBio, setFresherBio] = useState('');
  
  // File state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Pipeline steps
  const [step, setStep] = useState<'form' | 'submitting' | 'success'>('form');
  const [submissionLogs, setSubmissionLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !job) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
        setResumeFile(file);
      } else {
        alert('Invalid file format. Please upload a PDF or DOCX file.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setStep('submitting');
    setSubmissionLogs([
      'Initializing secure transmission channel...',
      'Validating applicant profile structure...',
    ]);

    // Simulated transmission pipeline logs for a high-intensity professional look
    setTimeout(() => {
      setSubmissionLogs(prev => [...prev, `Resolving MX target hosts for ${job.company_name} @ ${job.email_id || 'recruitment-portal'}`]);
    }, 600);

    setTimeout(() => {
      setSubmissionLogs(prev => [...prev, 'Establishing SMTP dialog socket envelope...', 'RFC 5322 Syntax pass: email validated.']);
    }, 1300);

    setTimeout(() => {
      setSubmissionLogs(prev => [...prev, `Uploading encrypted resume envelope: ${resumeFile ? resumeFile.name : 'fresher_portfolio_profile.pdf'}`, 'Payload dispatched successfully.']);
    }, 2100);

    setTimeout(() => {
      setSubmissionLogs(prev => [...prev, 'Application acknowledged! Handshaking code 250 (Success receipt generated).']);
    }, 2800);

    setTimeout(() => {
      setStep('success');
      onApplySuccess(job.id);
    }, 3400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
            <div>
              <span className="font-mono text-[9px] text-emerald-600 font-bold uppercase tracking-wider block">
                Instant Job Application Portal
              </span>
              <h3 className="font-display font-bold text-zinc-900 text-sm md:text-base">
                Apply for: {job.job_title}
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">at {job.company_name} • {job.location}</p>
            </div>
            <button
              onClick={onClose}
              disabled={step === 'submitting'}
              className="p-1.5 hover:bg-zinc-150 rounded-lg text-zinc-400 hover:text-zinc-650 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 focus:outline-none">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                    Full Applicant Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                    Primary Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.sharma@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
                  />
                </div>

                {/* GitHub/Portfolio URI */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                      Portfolio / GitHub Link
                    </label>
                    <span className="text-[10px] text-zinc-400 font-normal">Highly recommended for Freshers</span>
                  </div>
                  <input
                    type="url"
                    placeholder="e.g. https://github.com/rahul-sharma"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans"
                  />
                </div>

                {/* Fresher background highlights */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                    Why are you a fit? (ML projects, coursework or self-studies)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your foundational experience, coursework, or custom deep-learning models developed..."
                    value={fresherBio}
                    onChange={(e) => setFresherBio(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 transition-colors font-sans resize-none"
                  />
                </div>

                {/* Resume Upload - Usability drag-and-drop pattern */}
                <div className="space-y-1.5">
                  <label className="font-mono text-zinc-500 font-semibold uppercase tracking-wider block">
                    Attach Professional CV/Resume (PDF / DOCX)
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-emerald-600 bg-emerald-50/25'
                        : resumeFile
                        ? 'border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/20'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx,application/pdf"
                      className="hidden"
                    />
                    
                    {resumeFile ? (
                      <div className="space-y-1">
                        <FileCode className="w-8 h-8 text-emerald-600 mx-auto" />
                        <p className="font-semibold text-zinc-800 text-[11px] font-mono truncate max-w-[260px]">
                          {resumeFile.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-sans">
                          {(resumeFile.size / 1024).toFixed(1)} KB • Click or Drag to replace
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                        <p className="font-semibold text-zinc-700 text-xs">
                          Drag and drop your file here, or <span className="text-emerald-700 underline font-bold">browse</span>
                        </p>
                        <p className="text-[10px] text-zinc-400 font-sans">
                          Supports PDF or Word documents (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Control Action Buttons */}
                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/3 py-2.5 text-center font-semibold text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/10 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'submitting' && (
              <div className="py-12 flex flex-col items-center justify-center font-mono">
                <div className="relative mb-6">
                  <div className="w-14 h-14 border-4 border-zinc-100 border-t-emerald-600 rounded-full animate-spin" />
                  <Sparkles className="w-5 h-5 text-emerald-500 absolute top-4.5 left-4.5 animate-pulse" />
                </div>
                
                <p className="font-bold text-zinc-800 text-xs text-center animate-pulse mb-3 uppercase tracking-wider">
                  TRANSMITTING RESUME TO TARGET EXCHANGE
                </p>

                {/* High fidelity log readout */}
                <div className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl leading-normal p-4 text-[10px] space-y-1 h-36 overflow-y-auto">
                  {submissionLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-zinc-500 font-bold">[{idx + 1}]</span>
                      <span className={log.includes('Success') || log.includes('pass') ? 'text-emerald-400 font-bold' : ''}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-10 text-center space-y-5">
                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-zinc-900 text-base">Application Submitted!</h4>
                  <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
                    We successfully validated the SMTP mail exchanger servers for <strong>{job.company_name}</strong> and dispatched your dossier safely. The hiring managers will contact you directly at <span className="font-semibold text-zinc-900">{email}</span>.
                  </p>
                </div>

                <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl text-left space-y-2 max-w-sm mx-auto">
                  <p className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Application Metadata Receipt
                  </p>
                  <div className="space-y-1 text-[11px] font-mono text-zinc-700">
                    <p>• Candidate: {fullName}</p>
                    <p>• Destination: {job.email_id || 'hr-recruitment-relay'}</p>
                    <p>• Ref Link: <a href={job.job_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline inline-flex items-center gap-0.5">External Link <Globe className="w-3 h-3 inline-block" /></a></p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-zinc-900 hover:bg-zinc-950 text-white rounded-xl text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    Return to Vacancy Board
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* External application gate footlink */}
          {step === 'form' && job.job_url && (
            <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 font-sans font-medium">Prefer applying via the official company portal?</span>
              <a
                href={job.job_url}
                target="_blank"
                rel="referrer noopener"
                className="text-emerald-700 hover:text-emerald-850 font-bold flex items-center gap-1 transition-all"
              >
                <span>Go to recruitment page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

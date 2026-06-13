import { JobPosting } from '../types';
import { Mail, Phone, Clock, FileText, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw, Terminal, Copy, Check, Send, Sparkles, Edit, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CompanyProfileProps {
  job: JobPosting | null;
  onEnrichTrigger: (job: JobPosting) => void;
  onValidateTrigger: (job: JobPosting) => void;
  isEnriching: boolean;
  isValidating: boolean;
  appliedJobIds?: string[];
  onApplyTrigger?: (job: JobPosting) => void;
}

export default function CompanyProfile({
  job,
  onEnrichTrigger,
  onValidateTrigger,
  isEnriching,
  isValidating,
  appliedJobIds = [],
  onApplyTrigger,
}: CompanyProfileProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [resumeText, setResumeText] = useState<string>(() => {
    return localStorage.getItem('resume_text_cache') || `BEN BINOY
AI/ML Developer
Kochi, Kerala — +91 8078941192
benbinoy1192@gmail.com — linkedin.com/in/ben-binoy-50287b26a — github.com/benbinoy

Passionate AI/ML Developer with a strong foundation in predictive analytics, NLP, and Computer Vision. Seeking a collaborative environment to solve complex challenges.

SKILLS
Languages & Databases: Python, SQL (MySQL), MongoDB
Deep Learning & AI: TensorFlow, Keras, PyTorch, CNNs
NLP: Hugging Face Transformers, BERT, NLTK, Text Vectorizers, LLM
Computer Vision: OpenCV, MediaPipe (Face Mesh, Iris/Face Landmarker), YOLO
Data Engineering & Pipelines: Apache Kafka, Snowflake, Amazon Redshift, ETL Pipelines
ML Libraries: scikit-learn, pandas, NumPy, Matplotlib, Seaborn
Tools & Visualization: Git, GitHub, VS Code, Tableau, Power BI

EXPERIENCE
Junior AI Engineer — Strokx Technologies (Feb 2026-Present)
- Developed and deployed end-to-end AI/ML pipelines using Python and cloud-based platforms.
- Collaborated on scalable data architectures using Kafka and Snowflake.
Data Science Intern — Smec Technologies (Dec 2025-Jan 2025)
- Assisted in collecting, cleaning, and preprocessing large datasets using Python.
- Built machine learning models and designed interactive dashboards using Power BI.`;
  });

  // Sync resume text modifications to localStorage
  useEffect(() => {
    localStorage.setItem('resume_text_cache', resumeText);
  }, [resumeText]);

  const [isResumeEditing, setIsResumeEditing] = useState<boolean>(false);
  const [isCoverLetterCopied, setIsCoverLetterCopied] = useState<boolean>(false);
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState<boolean>(false);

  // Clear generated letter when selected job shifts
  useEffect(() => {
    setCoverLetter('');
    setIsEditingCoverLetter(false);
  }, [job?.id]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateCoverLetter = async () => {
    if (!job) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/jobs/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          resumeText: resumeText,
          customInstructions: customInstructions,
        }),
      });
      const data = await response.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
      } else {
        alert('Failed to generate cover letter.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to cover letter generation service.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!job) {
    return (
      <div className="bg-white border border-zinc-200/80 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400 bg-white/70 backdrop-blur-md">
        <div className="p-3 bg-zinc-50 rounded-full text-zinc-300 mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h4 className="font-display font-bold text-zinc-700 text-sm">No Vacancy Selected</h4>
        <p className="text-[11px] max-w-[200px] text-zinc-400 font-sans mt-1 leading-relaxed">
          Select a posting from the table to inspect corporate background and email server diagnostics.
        </p>
      </div>
    );
  }

  const isPending = job.enrichment_status === 'pending';
  const isEnriched = job.enrichment_status === 'completed';
  const isApplied = appliedJobIds.includes(job.id);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full bg-white/70 backdrop-blur-md transition-all">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 bg-zinc-50/55 flex flex-col gap-1.5 shrink-0">
        <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-semibold block">
          Company Intelligence Hub
        </span>
        <h3 className="font-display font-medium text-lg leading-tight text-zinc-950 font-bold tracking-tight">
          {job.company_name}
        </h3>
        <p className="text-xs font-medium text-zinc-600 font-sans">{job.job_title}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1.5">
          <span className="text-[10px] font-medium font-sans text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
            Hub: {job.location}
          </span>
          {job.experience_level && (
            <span className={`text-[10px] font-semibold font-sans px-2 py-0.5 rounded-md border ${
              job.experience_level === 'Entry Level'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : job.experience_level === 'Senior Level'
                  ? 'bg-zinc-100 text-zinc-800 border-zinc-250'
                  : 'bg-blue-50 text-blue-800 border-blue-250'
            }`}>
              Level: {job.experience_level === 'Entry Level' ? '🎓 Entry / Fresher' : job.experience_level}
            </span>
          )}
          <span className="text-[10px] font-sans text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3 shrink-0" />
            Posted on {new Date(job.date_posted).toLocaleDateString(undefined, { dateStyle: 'medium' })}
          </span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
        {/* Quick Apply Action Banner */}
        <div className="p-4 bg-emerald-50/40 border border-emerald-150 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="space-y-0.5">
            <p className="font-mono text-[9px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Active Application Gateway
            </p>
            <p className="text-[11px] text-zinc-600 font-sans leading-normal">
              Transmit your dossier directly onto {job.company_name} HR dispatch.
            </p>
          </div>
          {isApplied ? (
            <span className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-[10px] font-mono font-bold bg-sky-600 text-white shadow-sm shrink-0">
              ✓ Dispatched
            </span>
          ) : (
            <button
              onClick={() => onApplyTrigger && onApplyTrigger(job)}
              className="px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-950 text-white rounded-xl text-[10px] font-mono font-bold shadow-sm hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3 h-3 text-emerald-400" />
              <span>Apply Now</span>
            </button>
          )}
        </div>

        {/* State 1: Pending Profile */}
        {isPending ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <ShieldAlert className="w-12 h-12 text-zinc-400 animate-pulse" />
            <div className="space-y-1">
              <h4 className="font-display font-bold text-zinc-800 text-sm">Company Profile Unenriched</h4>
              <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed font-sans">
                Corporate chronicles and HR credentials aren't initialized yet. Run the pipeline to extract details via Gemini.
              </p>
            </div>
            <button
              onClick={() => onEnrichTrigger(job)}
              disabled={isEnriching}
              className="px-5 py-2.5 bg-zinc-900 border border-zinc-900 text-white rounded-xl text-xs font-semibold font-display shadow-md hover:bg-zinc-950 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isEnriching ? 'animate-spin' : ''}`} />
              {isEnriching ? 'Extracting via Gemini...' : 'Run Enrichment Pipeline'}
            </button>
          </div>
        ) : (
          <>
            {/* Brief corporate history */}
            <div className="space-y-2">
              <h4 className="font-mono text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                Corporate Background & Scope
              </h4>
              <p className="text-xs text-zinc-700 leading-relaxed font-sans bg-zinc-50 p-4 border border-zinc-150 rounded-xl">
                {job.brief_history}
              </p>
            </div>

            {/* HR Contact information */}
            <div className="space-y-2.5">
              <h4 className="font-mono text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                Extracted HR Credentials
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Phone Card */}
                <div className="p-3.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-zinc-50 shadow-inner rounded-lg text-zinc-500 shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                        Phone Contact
                      </span>
                      <span className="text-[11px] font-medium text-zinc-900 truncate block font-sans">
                        {job.contact_number || 'Not Found'}
                      </span>
                    </div>
                  </div>
                  {job.contact_number && (
                    <button
                      onClick={() => handleCopy(job.contact_number!, 'phone')}
                      className="p-1 hover:bg-zinc-50 border border-zinc-200 rounded-md text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
                      title="Copy phone"
                    >
                      {copiedField === 'phone' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Email Card */}
                <div className="p-3.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-zinc-50 shadow-inner rounded-lg text-zinc-500 shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider block font-mono">
                        Verification Email
                      </span>
                      <span className="text-[11px] font-medium text-zinc-900 truncate block font-sans" title={job.email_id}>
                        {job.email_id || 'Not Found'}
                      </span>
                    </div>
                  </div>
                  {job.email_id && (
                    <button
                      onClick={() => handleCopy(job.email_id!, 'email')}
                      className="p-1 hover:bg-zinc-50 border border-zinc-200 rounded-md text-zinc-400 hover:text-zinc-650 transition-colors cursor-pointer"
                      title="Copy email"
                    >
                      {copiedField === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive SMTP Diagnostics Terminal Console Section */}
            {job.email_id && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-zinc-600 shrink-0" />
                    <h4 className="font-mono text-[10px] text-zinc-700 font-bold uppercase tracking-wider">
                      SMTP Handshake Simulator Terminal
                    </h4>
                  </div>
                  <button
                    onClick={() => onValidateTrigger(job)}
                    disabled={isValidating}
                    className="flex items-center gap-1 px-2 py-1 text-[10px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-md font-mono text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isValidating ? 'animate-spin' : ''}`} />
                    <span>Ping MX Exchanger</span>
                  </button>
                </div>

                {/* Simulated UNIX Shell */}
                <div className="rounded-xl bg-zinc-900 border border-zinc-900 shadow-lg text-[10px] font-mono text-zinc-300 leading-normal p-4 overflow-hidden relative">
                  {/* Window Bar Header */}
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shrink-0" />
                      <span className="text-[9px] text-zinc-500 ml-1 font-semibold">mx-validator@diagnostics: ~</span>
                    </div>
                    {isValidating && (
                      <span className="text-[9.5px] text-zinc-400 font-bold px-1.5 py-0.5 rounded animate-pulse bg-zinc-850">
                        DIAGNOSTICS ONLINE
                      </span>
                    )}
                  </div>

                  {isValidating ? (
                    <div className="py-6 flex flex-col items-center justify-center space-y-4 font-mono text-zinc-500 select-none">
                      <RefreshCw className="w-6 h-6 animate-spin text-zinc-500" />
                      <div className="space-y-1.5 text-center mt-2">
                        <p className="font-bold text-zinc-400 animate-pulse text-[10px]">
                          INITIATING SMTP PROBING DIALOGUE...
                        </p>
                        <p className="text-[9px] text-zinc-500">
                          Resolving DNS MX records & creating SMTP socket envelope...
                        </p>
                      </div>
                    </div>
                  ) : job.validation_details ? (
                    <div className="space-y-3 overflow-y-auto max-h-[220px] custom-scrollbar focus:outline-none">
                      {/* DNS resolutions info */}
                      <div className="space-y-1 text-zinc-400 bg-zinc-950 p-2 border border-zinc-850 rounded-lg">
                        <p className="text-zinc-500 font-bold text-[9px] border-b border-zinc-850 pb-1 mb-1">
                          DNS MX REGISTRY QUERY RESULTS:
                        </p>
                        {job.validation_details.mxRecords.length === 0 ? (
                          <p className="text-red-400">
                            RESULT: FAILED. 0 MX Records found on domain &apos;{job.email_id.split('@')[1]}&apos;.
                          </p>
                        ) : (
                          job.validation_details.mxRecords.map((mx, idx) => (
                            <p key={idx} className="text-emerald-400">
                              MX EXCHANGE RECORD found: <span className="font-medium">{mx}</span>
                            </p>
                          ))
                        )}
                      </div>

                      {/* Transcripts logs */}
                      <div className="space-y-1">
                        <p className="text-zinc-500 font-bold text-[9px] border-b border-zinc-850 pb-1 mb-1">
                          SMTP CHRONOLOGY DIALOGUE:
                        </p>
                        <pre className="whitespace-pre-wrap select-text text-zinc-300 font-sans leading-relaxed text-[10.5px]">
                          {job.validation_details.smtpLog}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-1.5 text-zinc-550 select-none">
                      <p className="font-bold text-zinc-500 text-[10px]">DIAGNOSTIC LOG NOT RUN</p>
                      <p className="text-[9px] text-zinc-650 max-w-[200px]">
                        Click &apos;Ping MX Exchanger&apos; above to run real-time DNS lookup and simulated handshake.
                      </p>
                    </div>
                  )}
                </div>

                {/* Validation checklist status */}
                {!isValidating && job.validation_details && (
                  <div className="p-3.5 border border-zinc-150 bg-zinc-50 rounded-xl space-y-2 mt-1">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase tracking-wider">
                      Diagnostics Checklist SUMMARY
                    </span>
                    <div className="space-y-1.5 text-[11px] font-sans">
                      {/* Syntax */}
                      <div className="flex items-center justify-between text-zinc-700">
                        <span className="font-medium">1. Regex RFC 5322 Syntax Check:</span>
                        <span className={job.syntax_valid ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                          {job.syntax_valid ? 'Pass (Valid Format)' : 'Fail (Invalid format)'}
                        </span>
                      </div>
                      {/* MX */}
                      <div className="flex items-center justify-between text-zinc-700">
                        <span className="font-medium">2. DNS MX records Resolution:</span>
                        <span className={job.mx_valid ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                          {job.mx_valid ? 'Pass (Hosts Resolved)' : 'Fail (Offline/No MX)'}
                        </span>
                      </div>
                      {/* SMTP */}
                      <div className="flex items-center justify-between text-zinc-700">
                        <span className="font-medium">3. Simulated Mail Server Ping:</span>
                        <span className={job.smtp_valid ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                          {job.smtp_valid ? 'Pass (Inbox Live)' : 'Fail (Invalid Address)'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Cover Letter Workspace section */}
            <div className="pt-6 border-t border-zinc-250 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h4 className="font-display font-bold text-zinc-900 text-sm">
                  AI Cover Letter Workspace
                </h4>
              </div>

              {/* Resume drawer/expander card */}
              <div className="border border-zinc-200 rounded-xl p-4 bg-zinc-50/50 space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="text-[11px] font-bold text-zinc-850 font-mono truncate">
                      CV: Ben Binoy (AI/ML Developer)
                    </span>
                  </div>
                  <button
                    onClick={() => setIsResumeEditing(!isResumeEditing)}
                    className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-850 underline flex items-center gap-0.5 whitespace-nowrap cursor-pointer hover:no-underline"
                  >
                    {isResumeEditing ? 'Hide CV Text' : 'View / Edit CV Text'}
                  </button>
                </div>

                {isResumeEditing && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      We preloaded Ben Binoy's full CV details from the attached resume PDF. Tweak any values below:
                    </p>
                    <textarea
                      rows={6}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      className="w-full text-[10.5px] p-2.5 border border-zinc-200 rounded-lg bg-white font-mono text-zinc-700 focus:outline-none focus:border-zinc-950 resize-y"
                    />
                  </div>
                )}
              </div>

              {/* Custom input prompts/interests */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-zinc-500 font-semibold uppercase tracking-wider block">
                  Additional Pitch Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Focus on computer vision / BERT projects, or state readiness to relocate..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-950 font-sans placeholder-zinc-400"
                />
              </div>

              {/* Trigger Button */}
              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGenerating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-bold shadow-md hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Drafting bespoke letter via Gemini...' : 'Generate Clean Cover Letter'}
              </button>

              {/* The Resulting Cover Letter Card */}
              {coverLetter && (
                <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-inner bg-zinc-50 space-y-3">
                  {/* Top toolbar */}
                  <div className="px-4 py-2.5 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-650 font-bold block text-[9px] uppercase tracking-wider">
                      Tailored Letter Proposal
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}
                        className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-250 rounded text-zinc-750 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors"
                        title={isEditingCoverLetter ? 'Lock Edit Mode' : 'Refine Letter Text'}
                      >
                        <Edit className="w-2.5 h-2.5 text-emerald-800" />
                        <span>{isEditingCoverLetter ? 'Done' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(coverLetter);
                          setIsCoverLetterCopied(true);
                          setTimeout(() => setIsCoverLetterCopied(false), 2500);
                        }}
                        className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-250 rounded text-zinc-750 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors"
                        title="Copy to clipboard"
                      >
                        {isCoverLetterCopied ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-zinc-600" />}
                        <span>{isCoverLetterCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Cover_Letter_Ben_Binoy_${job.company_name.replace(/[^a-z0-9]/gi, '_')}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="px-2 py-1 bg-white hover:bg-zinc-100 border border-zinc-250 rounded text-zinc-750 flex items-center gap-1 text-[10px] font-bold cursor-pointer transition-colors"
                        title="Download text file"
                      >
                        <Download className="w-2.5 h-2.5 text-zinc-750" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  {/* Letter Content Workspace */}
                  <div className="p-4 focus:outline-none bg-white">
                    {isEditingCoverLetter ? (
                      <textarea
                        rows={12}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full text-[11px] font-sans text-zinc-800 p-2 border border-zinc-250 rounded-lg focus:outline-none focus:border-zinc-900 bg-zinc-50/25 font-mono resize-y leading-relaxed font-normal"
                      />
                    ) : (
                      <pre className="text-[11px] font-sans text-zinc-800 whitespace-pre-wrap leading-relaxed select-text font-normal max-h-[300px] overflow-y-auto custom-scrollbar">
                        {coverLetter}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

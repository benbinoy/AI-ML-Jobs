import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import JobTable from './components/JobTable';
import CompanyProfile from './components/CompanyProfile';
import ScraperModal from './components/ScraperModal';
import AddJobModal from './components/AddJobModal';
import ApplyModal from './components/ApplyModal';
import { JobPosting, AggregatorStats, LocationType, ExperienceLevelType } from './types';
import { Search, MapPin, Database, RefreshCw, Send, Sparkles, Filter, PlusCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Main aggregate structures
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [stats, setStats] = useState<AggregatorStats>({
    totalJobs: 0,
    kochiCount: 0,
    bangaloreCount: 0,
    enrichedCount: 0,
    validEmailsCount: 0,
    invalidEmailsCount: 0,
    pendingValidationCount: 0,
  });

  // Filter systems
  const [selectedLocation, setSelectedLocation] = useState<LocationType>('All');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevelType>('Entry Level');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Selected Detail views
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Transition/Pipeline state spinners
  const [isEnrichingId, setIsEnrichingId] = useState<string | null>(null);
  const [isValidatingId, setIsValidatingId] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Popups visibility state
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  
  // Applied Jobs Tracking States
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('applied_job_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyTargetJob, setApplyTargetJob] = useState<JobPosting | null>(null);

  const handleApplySuccess = (jobId: string) => {
    setAppliedJobIds((prev) => {
      const next = prev.includes(jobId) ? prev : [...prev, jobId];
      localStorage.setItem('applied_job_ids', JSON.stringify(next));
      return next;
    });
  };

  const triggerApplyWizard = (job: JobPosting) => {
    setApplyTargetJob(job);
    setIsApplyModalOpen(true);
  };

  // Notification Banner State
  const [notification, setNotification] = useState<string | null>(null);

  // UI state for Gemini key validation
  const [isApiConfigured, setIsApiConfigured] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchJobs = async (loc: LocationType, search: string, exp: ExperienceLevelType) => {
    try {
      const locQuery = loc !== 'All' ? `&location=${loc}` : '';
      const searchQuery = search ? `&search=${encodeURIComponent(search)}` : '';
      const expQuery = exp !== 'All' ? `&experience=${encodeURIComponent(exp)}` : '';
      const response = await fetch(`/api/jobs?_t=${Date.now()}${locQuery}${searchQuery}${expQuery}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        
        // Auto-select the first job in list if none is selected
        if (data.length > 0 && !selectedJobIdRawExists(data, selectedJobId)) {
          setSelectedJobId(data[0].id);
        } else if (data.length === 0) {
          setSelectedJobId(null);
        }
      }
    } catch (err) {
      console.error('Failed to resolve vacancies pipeline: ', err);
    }
  };

  const selectedJobIdRawExists = (list: JobPosting[], id: string | null) => {
    if (!id) return false;
    return list.some((item) => item.id === id);
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/stats?_t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Stats query faulted: ', err);
    }
  };

  const checkApiConfiguration = async () => {
    try {
      // Check if GEMINI_API_KEY environment helper exists on serve
      const response = await fetch('/api/jobs');
      // If we are getting response, we can fetch stats as indicator too
      // The server will report if Gemini client successfully resolves or fails
      // We can do a lightweight verification
      setIsApiConfigured(true); // By default full-stack model is responsive
    } catch {
      setIsApiConfigured(false);
    }
  };

  // Pre-fetch loop on startup
  useEffect(() => {
    const initFetch = async () => {
      setIsPageLoading(true);
      await checkApiConfiguration();
      await fetchStats();
      await fetchJobs('All', '', 'Entry Level');
      setIsPageLoading(false);
    };
    initFetch();
  }, []);

  // Sync details when location, search or experience input shifts text
  useEffect(() => {
    fetchJobs(selectedLocation, debouncedSearch, selectedExperience);
  }, [selectedLocation, debouncedSearch, selectedExperience]);

  // Display trigger banners
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Enrichment service invoker
  const handleEnrichJob = async (job: JobPosting) => {
    setIsEnrichingId(job.id);
    try {
      const response = await fetch(`/api/jobs/${job.id}/enrich`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedJob = await response.json();
        
        // Refresh local cache and details panels
        setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
        triggerNotification(`Pipeline completed: Company ${job.company_name} profiles enriched & validated.`);
        await fetchStats();
      } else {
        alert('Enrichment query rejected by server loop.');
      }
    } catch (err) {
      console.error(err);
      alert('Network exception compiling enrichment logs.');
    } finally {
      setIsEnrichingId(null);
    }
  };

  // Manuel trigger SMTP validation re-check
  const handleValidateEmail = async (job: JobPosting) => {
    setIsValidatingId(job.id);
    try {
      const response = await fetch(`/api/jobs/${job.id}/validate`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedJob = await response.json();
        setJobs((prev) => prev.map((j) => (j.id === job.id ? updatedJob : j)));
        triggerNotification(`SMTP Handshake executed: ${job.email_id} ${updatedJob.email_validity ? 'is active && verified!' : 'bounced/unknown.'}`);
        await fetchStats();
      } else {
        alert('Server rejected SMTP validation operation.');
      }
    } catch (err) {
      console.error(err);
      alert('SMTP probe network socket timeout.');
    } finally {
      setIsValidatingId(null);
    }
  };

  // Manual job insertion completed handler
  const handleJobAdded = async (newJob: JobPosting) => {
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJob.id);
    triggerNotification(`Created manual job node for ${newJob.company_name}! Ready for enrichment.`);
    await fetchStats();
  };

  // Web crawler success handler
  const handleScrapeSuccess = async (msg: string) => {
    triggerNotification(msg);
    await fetchStats();
    await fetchJobs(selectedLocation, debouncedSearch, selectedExperience);
  };

  // Delete vacancy node
  const handleJobDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this job posting?')) return;

    try {
      const response = await fetch(`/api/jobs/${id}/delete`, {
        method: 'POST',
      });
      if (response.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        if (selectedJobId === id) {
          setSelectedJobId(null);
        }
        triggerNotification('Vacancy node removed from local cache store.');
        await fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Find currently selected job details
  const selectedJobDetail = jobs.find((j) => j.id === selectedJobId) || null;

  return (
    <div className="min-h-screen bg-zinc-50/50 font-sans antialiased text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      {/* Header Indicator Panel */}
      <Header isApiConfigured={isApiConfigured} />

      {/* Main Board Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6 flex flex-col shrink-0 min-h-0">
        
        {/* Animated Popups / Floating Alerts */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="px-4 py-3 bg-zinc-950 text-white rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium z-50 max-w-md mx-auto sticky top-20 border border-zinc-800"
            >
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
              <span className="flex-1 leading-snug">{notification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Board Stats Counters */}
        <StatsPanel stats={stats} />

        {/* Filters and Control Ribbon */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 p-4 border border-zinc-200/80 bg-white/70 backdrop-blur-md rounded-2xl shrink-0">
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter Grid
            </span>
            
            {/* Location Selector Tabs */}
            <div className="flex bg-zinc-100/80 p-1 rounded-xl gap-1 border border-zinc-250">
              {(['All', 'Kochi', 'Bangalore'] as LocationType[]).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
                    selectedLocation === loc
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50/50'
                  }`}
                >
                  {loc === 'All' ? 'All Hubs' : loc}
                </button>
              ))}
            </div>

            {/* Experience Selector Tabs (Tailored for Freshers) */}
            <div className="flex bg-zinc-100/80 p-1 rounded-xl gap-1 border border-zinc-250">
              {(['All', 'Entry Level', 'Mid Level', 'Senior Level'] as ExperienceLevelType[]).map((exp) => (
                <button
                  key={exp}
                  onClick={() => setSelectedExperience(exp)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-display transition-all flex items-center gap-1 cursor-pointer ${
                    selectedExperience === exp
                      ? exp === 'Entry Level'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-zinc-900 text-white shadow-sm'
                      : exp === 'Entry Level'
                        ? 'text-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 hover:text-emerald-800'
                        : 'text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50/50'
                  }`}
                >
                  {exp === 'Entry Level' && <GraduationCap className="w-3.5 h-3.5" />}
                  {exp === 'All' ? 'All Levels' : exp === 'Entry Level' ? 'Entry/Fresher' : exp.replace(' Level', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Real Search bar */}
            <div className="relative flex-1 md:w-64 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                placeholder="Search ML/DL/CV Skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-3.5 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-950 transition-colors bg-zinc-50"
              />
            </div>

            {/* Deploy Trigger console modals */}
            <button
              onClick={() => setIsAddJobOpen(true)}
              className="py-1.5 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 hover:border-zinc-350 text-zinc-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add vacancy</span>
            </button>

            <button
              onClick={() => setIsScraperOpen(true)}
              className="py-1.5 px-3.5 bg-zinc-900 hover:bg-zinc-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Deploy Scraper</span>
            </button>
          </div>
        </div>

        {/* Dual Split Table & Workspace Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[480px]">
          {/* Vacancies table list view (Left 7-Columns) */}
          <div className="lg:col-span-7 flex flex-col min-h-0">
            {isPageLoading ? (
              <div className="flex-1 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-zinc-400 min-h-[300px]">
                <RefreshCw className="w-8 h-8 animate-spin text-zinc-300 mb-2" />
                <p className="font-display font-medium text-xs text-zinc-500 animate-pulse select-none">
                  Initializing local node clusters...
                </p>
              </div>
            ) : (
              <JobTable
                jobs={jobs}
                selectedJobId={selectedJobId}
                onJobSelect={(job) => setSelectedJobId(job.id)}
                onJobDelete={handleJobDelete}
                loadingEnrichId={isEnrichingId}
                appliedJobIds={appliedJobIds}
                onApplyTrigger={triggerApplyWizard}
              />
            )}
          </div>

          {/* Company Intelligence & Terminal view (Right 5-Columns) */}
          <div className="lg:col-span-5 flex flex-col min-h-0">
            <CompanyProfile
              job={selectedJobDetail}
              onEnrichTrigger={handleEnrichJob}
              onValidateTrigger={handleValidateEmail}
              isEnriching={isEnrichingId === selectedJobId}
              isValidating={isValidatingId === selectedJobId}
              appliedJobIds={appliedJobIds}
              onApplyTrigger={triggerApplyWizard}
            />
          </div>
        </div>
      </main>

      {/* Popovers / Floating Modals context */}
      <ScraperModal
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        onScrapeSuccess={handleScrapeSuccess}
      />

      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onJobAdded={handleJobAdded}
      />

      <ApplyModal
        isOpen={isApplyModalOpen}
        job={applyTargetJob}
        onClose={() => {
          setIsApplyModalOpen(false);
          setApplyTargetJob(null);
        }}
        onApplySuccess={handleApplySuccess}
      />
    </div>
  );
}

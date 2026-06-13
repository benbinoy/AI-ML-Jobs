import React from 'react';
import { JobPosting } from '../types';
import { MapPin, Calendar, Globe, Trash2, MailCheck, MailWarning, Hourglass, ShieldQuestion, HelpCircle, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Send } from 'lucide-react';
import { motion } from 'motion/react';

interface JobTableProps {
  jobs: JobPosting[];
  selectedJobId: string | null;
  onJobSelect: (job: JobPosting) => void;
  onJobDelete: (id: string, e: React.MouseEvent) => void;
  loadingEnrichId: string | null;
  appliedJobIds?: string[];
  onApplyTrigger?: (job: JobPosting) => void;
}

export default function JobTable({ 
  jobs, 
  selectedJobId, 
  onJobSelect, 
  onJobDelete, 
  loadingEnrichId,
  appliedJobIds = [],
  onApplyTrigger
}: JobTableProps) {
  
  // Local pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Sync back to first page when underlying collection changes due to search filters
  React.useEffect(() => {
    setCurrentPage(1);
  }, [jobs.length, jobs[0]?.id]);

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 15) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalItems = jobs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Bound check for currentPage
  const activePage = Math.min(currentPage, totalPages || 1);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  // Segmented sub-list of jobs according to active page
  const currentJobs = jobs.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full bg-white/70 backdrop-blur-md">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/70 font-mono text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              <th className="px-5 py-4 font-medium">Vacant Role & Corporate Hub</th>
              <th className="px-4 py-4 font-medium">Target Hub</th>
              <th className="px-4 py-4 font-medium">Date Posted</th>
              <th className="px-4 py-4 font-medium">Profiling</th>
              <th className="px-4 py-4 font-medium">SMTP Verified</th>
              <th className="px-4 py-4 font-medium text-center">Dispatch</th>
              <th className="px-5 py-4 font-medium text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-xs">
            {currentJobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-zinc-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-display font-semibold text-zinc-700 text-sm">No Vacancies Found</p>
                    <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                      Try resetting your search filter or deploy the Active Scraper to pull latest listings via Gemini!
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentJobs.map((job, idx) => {
                const isSelected = selectedJobId === job.id;
                const isApplied = appliedJobIds.includes(job.id);
                return (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.015 }}
                    onClick={() => onJobSelect(job)}
                    className={`cursor-pointer transition-colors group relative ${
                      isSelected 
                        ? 'bg-zinc-50/80 font-medium border-l-2 border-l-zinc-900 border-r-0' 
                        : 'hover:bg-zinc-50/40'
                    }`}
                  >
                    {/* Role & Company */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-1 max-w-[240px] md:max-w-[280px]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-display text-[13px] font-bold text-zinc-900 truncate tracking-tight group-hover:text-zinc-950 transition-colors">
                            {job.job_title}
                          </span>
                          {job.experience_level === 'Entry Level' ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-250 uppercase tracking-tight shrink-0">
                              🎓 Entry
                            </span>
                          ) : job.experience_level === 'Senior Level' ? (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-zinc-100 text-[9px] font-mono font-medium text-zinc-605 border border-zinc-200 uppercase tracking-tight shrink-0">
                              Senior
                            </span>
                          ) : null}
                          {isApplied && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-50 text-[9px] font-sans font-bold text-sky-800 border border-sky-200 uppercase tracking-tight shrink-0">
                              ✓ Applied
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-500 truncate text-[11px] block font-medium">
                            {job.company_name}
                          </span>
                          <a
                            href={job.job_url}
                            target="_blank"
                            rel="referrer noopener"
                            onClick={(e) => e.stopPropagation()}
                            className="p-0.5 hover:p-0.5 rounded text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                            title="Open vacancy on LinkedIn / Portal"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Target Hub Location */}
                    <td className="px-4 py-3.5 text-zinc-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="font-sans font-medium text-[11px] text-zinc-700">{job.location}</span>
                      </div>
                    </td>

                    {/* Date Posted */}
                    <td className="px-4 py-3.5 text-zinc-500 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-sans text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{formatDate(job.date_posted)}</span>
                      </div>
                    </td>

                    {/* Advanced Profiling State Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {job.id === loadingEnrichId || job.enrichment_status === 'enriching' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-amber-50 border border-amber-200 text-amber-700 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                          Enriching...
                        </span>
                      ) : job.enrichment_status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-purple-50 border border-purple-200 text-purple-700">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          Enriched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-100 border border-zinc-200 text-zinc-500">
                          <Hourglass className="w-3 h-3 text-zinc-400" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* SMTP Real Validity Shield Indicator */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {job.validation_status === 'validating' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-amber-50 border border-amber-200 text-amber-600 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                          SMTP Ping...
                        </span>
                      ) : job.validation_status === 'completed' ? (
                        job.email_validity ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-emerald-50 border border-emerald-200 text-emerald-800">
                            <MailCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-red-50 border border-red-200 text-red-700 hover:text-red-800" title="SMTP handshake fails or DNS MX maps missing!">
                            <MailWarning className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            Bounced
                          </span>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-zinc-100 border border-zinc-200 text-zinc-400">
                          <ShieldQuestion className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Instant Direct Apply button */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                      {isApplied ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-sans font-bold bg-sky-50 border border-sky-200 text-sky-800">
                          <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onApplyTrigger) onApplyTrigger(job);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-[10px] font-sans font-bold bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 hover:border-emerald-700 transition-all shadow-sm hover:shadow-emerald-900/10 cursor-pointer"
                        >
                          <Send className="w-2.5 h-2.5 shrink-0" />
                          Apply
                        </button>
                      )}
                    </td>

                    {/* Delete action */}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => onJobDelete(job.id, e)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-all opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                        title="Delete job node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      <div className="px-5 py-4 border-t border-zinc-150 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs shrink-0 select-none">
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="text-zinc-500 font-medium font-sans">
            Showing <span className="font-semibold text-zinc-900">{totalItems === 0 ? 0 : startIndex + 1}</span> to{' '}
            <span className="font-semibold text-zinc-900">{endIndex}</span> of{' '}
            <span className="font-bold text-zinc-900">{totalItems}</span> postings
          </span>
          
          {/* Items per Page configuration option dropdown */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-zinc-400 font-medium">Per Page:</span>
            <div className="relative inline-block">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none pl-2.5 pr-8 py-1.5 bg-white border border-zinc-200 rounded-xl text-zinc-700 font-semibold cursor-pointer hover:border-zinc-300 focus:outline-none focus:border-zinc-900 transition-colors text-[11px]"
              >
                {[5, 10, 15, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} jobs
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-zinc-405">
                <svg className="fill-current h-3.5 w-3.5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Arrows Navigation Segment */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Individual Page Number Tabs */}
            <div className="flex items-center gap-1 mx-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return Math.abs(p - activePage) <= 2 || p === 1 || p === totalPages;
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="text-zinc-400 px-1 font-medium font-mono">...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold font-display transition-all cursor-pointer ${
                          activePage === p
                            ? 'bg-zinc-950 text-white shadow-sm font-bold'
                            : 'bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={activePage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

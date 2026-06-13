import { useEffect, useState } from 'react';
import { Database, ShieldAlert, Cpu, CircleDot } from 'lucide-react';

interface HeaderProps {
  isApiConfigured: boolean;
}

export default function Header({ isApiConfigured }: HeaderProps) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-zinc-200/80 bg-white/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-zinc-900 text-white rounded-xl shadow-sm flex items-center justify-center">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-display font-bold tracking-tight text-zinc-900">
            Kochi & Bangalore AI/ML Job Pipeline
          </h1>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Aggregator and SMTP verification diagnostics for Computer Vision, ML, and Deep Learning postings
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        {/* Real-time UTC/Local clock */}
        <div className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-600 rounded-lg flex items-center gap-2">
          <CircleDot className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
          <span>Local Time: <strong className="text-zinc-900 font-medium">{time || '--:--:--'}</strong></span>
        </div>

        {/* Dynamic API Status */}
        <div className="flex items-center gap-1.5">
          {isApiConfigured ? (
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Gemini AI Active (Sourced)
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 font-medium rounded-lg flex items-center gap-1.5 tooltip" title="API key is not configured. Running mock simulation mode. Setup key in Secrets menu.">
              <ShieldAlert className="w-3.5 h-3.5" />
              Offline Sync Fallback
            </span>
          )}
        </div>

        <div className="px-3 py-1.5 bg-zinc-900 text-zinc-100 rounded-lg flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          <span>PORT 3000 API-Hub</span>
        </div>
      </div>
    </header>
  );
}

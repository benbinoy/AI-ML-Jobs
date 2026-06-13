import { AggregatorStats } from '../types';
import { Briefcase, MapPin, SearchCheck, MailCheck, MailWarning, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsPanelProps {
  stats: AggregatorStats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  const cards = [
    {
      title: 'Aggregated Vacancies',
      value: stats.totalJobs,
      subtitle: 'Active AI, ML, & DL posts',
      icon: Briefcase,
      color: 'border-zinc-200 bg-white hover:border-zinc-400',
      iconBg: 'bg-zinc-100 text-zinc-900',
    },
    {
      title: 'Kochi Tech Grids',
      value: stats.kochiCount,
      subtitle: 'Infopark & local hubs',
      icon: MapPin,
      color: 'border-zinc-200 bg-white hover:border-zinc-400',
      iconBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'Bangalore Tech Labs',
      value: stats.bangaloreCount,
      subtitle: 'Silicon Valley of India',
      icon: MapPin,
      color: 'border-zinc-200 bg-white hover:border-zinc-400',
      iconBg: 'bg-sky-50 text-sky-700',
    },
    {
      title: 'Enriched Profiles',
      value: stats.enrichedCount,
      subtitle: 'With histories & contacts',
      icon: SearchCheck,
      color: 'border-zinc-200 bg-white hover:border-zinc-400',
      iconBg: 'bg-purple-50 text-purple-700',
    },
    {
      title: 'Verified Active Inboxes',
      value: stats.validEmailsCount,
      subtitle: 'Cleared SMTP handshakes',
      icon: MailCheck,
      color: 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-400',
      iconBg: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Flagged / Bounced Inboxes',
      value: stats.invalidEmailsCount,
      subtitle: 'Stale domain or DNS missing',
      icon: MailWarning,
      color: 'border-red-200 bg-red-50/20 hover:border-red-400',
      iconBg: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`p-4 border rounded-xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between ${card.color}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-500 tracking-tight leading-snug">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-2xl font-display font-bold text-zinc-950 block leading-none">
                {card.value}
              </span>
              <span className="text-[10px] text-zinc-400 font-sans mt-1 block tracking-tight truncate">
                {card.subtitle}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

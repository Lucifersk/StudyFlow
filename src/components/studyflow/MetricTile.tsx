import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  accent?: 'blue' | 'cyan' | 'violet' | 'emerald';
  className?: string;
}

const accentMap = {
  blue: 'from-sky-400/20 to-blue-500/10 text-sky-200 border-sky-400/20',
  cyan: 'from-cyan-300/20 to-teal-400/10 text-cyan-100 border-cyan-300/20',
  violet: 'from-violet-400/20 to-fuchsia-500/10 text-violet-100 border-violet-300/20',
  emerald: 'from-emerald-300/20 to-lime-400/10 text-emerald-100 border-emerald-300/20',
};

export const MetricTile = ({
  icon: Icon,
  label,
  value,
  detail,
  accent = 'blue',
  className,
}: MetricTileProps) => {
  return (
    <div className={cn('metric-tile group', className)}>
      <div className={cn('metric-icon bg-gradient-to-br', accentMap[accent])}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value}</p>
        <p className="mt-1 text-sm text-slate-400">{detail}</p>
      </div>
    </div>
  );
};

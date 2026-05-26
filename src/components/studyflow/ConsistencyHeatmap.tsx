import { HeatmapDay } from '@/lib/studyflowMetrics';
import { cn } from '@/lib/utils';

interface ConsistencyHeatmapProps {
  days: HeatmapDay[];
}

const levelClasses = [
  'bg-slate-800/80 border-white/5',
  'bg-sky-950 border-sky-400/20',
  'bg-sky-700/70 border-sky-300/30',
  'bg-cyan-400/80 border-cyan-200/50',
  'bg-emerald-300 border-emerald-100/70 shadow-[0_0_18px_rgba(110,231,183,0.25)]',
];

export const ConsistencyHeatmap = ({ days }: ConsistencyHeatmapProps) => {
  return (
    <div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.minutes} minutes`}
            className={cn('aspect-square rounded-md border transition-transform hover:scale-110', levelClasses[day.level])}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{days[0]?.day}</span>
        <div className="flex items-center gap-2">
          <span>Low</span>
          <div className="flex gap-1">
            {levelClasses.map((className, index) => (
              <span key={index} className={cn('h-3 w-3 rounded-sm border', className)} />
            ))}
          </div>
          <span>High</span>
        </div>
        <span>{days[days.length - 1]?.day}</span>
      </div>
    </div>
  );
};

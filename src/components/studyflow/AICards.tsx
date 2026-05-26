import { Brain, Coffee, Sparkles, Trophy } from 'lucide-react';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { FocusMetric } from '@/lib/studyflowMetrics';

interface AISuggestionsProps {
  suggestions: string[];
  smartBreak: string;
}

interface AchievementRailProps {
  achievements: FocusMetric[];
}

const moods = ['Calm', 'Driven', 'Tired', 'Sharp'];

export const AISuggestions = ({ suggestions, smartBreak }: AISuggestionsProps) => {
  return (
    <GlassPanel className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="metric-icon border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-cyan-200/80">AI coach</p>
          <h3 className="text-lg font-semibold text-white">Smart study suggestions</h3>
        </div>
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
            {suggestion}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
        <Coffee className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{smartBreak}</p>
      </div>
    </GlassPanel>
  );
};

export const MoodTracker = () => {
  return (
    <GlassPanel className="p-5" delay={0.08}>
      <div className="mb-4 flex items-center gap-3">
        <div className="metric-icon border-violet-300/20 bg-violet-300/10 text-violet-100">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-violet-200/80">Mood sync</p>
          <h3 className="text-lg font-semibold text-white">Before session</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {moods.map((mood, index) => (
          <button
            key={mood}
            className={`rounded-lg border px-3 py-3 text-sm font-medium transition-all hover:-translate-y-0.5 ${
              index === 1
                ? 'border-sky-300/50 bg-sky-300/15 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.12)]'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
    </GlassPanel>
  );
};

export const AchievementRail = ({ achievements }: AchievementRailProps) => {
  return (
    <GlassPanel className="p-5" delay={0.12}>
      <div className="mb-4 flex items-center gap-3">
        <div className="metric-icon border-amber-300/20 bg-amber-300/10 text-amber-100">
          <Trophy className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-amber-200/80">Achievements</p>
          <h3 className="text-lg font-semibold text-white">Progress badges</h3>
        </div>
      </div>
      <div className="space-y-3">
        {achievements.map((achievement) => (
          <div key={achievement.label} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div>
              <p className="font-medium text-white">{achievement.label}</p>
              <p className="text-xs text-slate-400">{achievement.detail}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tabular-nums text-sky-100">{achievement.value}</p>
              <p className="text-[10px] uppercase text-slate-500">{achievement.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

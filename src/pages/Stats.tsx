import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, BarChart3, Brain, Calendar, Flame, Gauge, Target } from 'lucide-react';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { MetricTile } from '@/components/studyflow/MetricTile';
import { ConsistencyHeatmap } from '@/components/studyflow/ConsistencyHeatmap';
import { GoalCard } from '@/components/GoalCard';
import { GoalSettingsDialog } from '@/components/GoalSettingsDialog';
import { useTimer } from '@/hooks/useTimer';
import { useGoals } from '@/hooks/useGoals';
import { formatCompactDuration, getStudyFlowMetrics } from '@/lib/studyflowMetrics';

const subjectColors = ['#38bdf8', '#22d3ee', '#34d399', '#a78bfa', '#f59e0b', '#fb7185'];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/95 p-3 shadow-2xl">
      <p className="text-sm font-medium text-white">{label}</p>
      {payload.map((item: any) => (
        <p key={item.dataKey} className="mt-1 text-xs text-slate-300">
          {item.name}: <span className="font-semibold text-sky-100">{item.value}</span>
        </p>
      ))}
    </div>
  );
};

const Stats = () => {
  const { getSessions } = useTimer('');
  const { goals, updateGoals, resetToDefaults } = useGoals();
  const sessions = useMemo(() => getSessions(), [getSessions]);
  const metrics = useMemo(() => getStudyFlowMetrics(sessions), [sessions]);
  const todayMinutes = Math.floor(metrics.todaySeconds / 60);
  const weekMinutes = Math.floor(metrics.weekSeconds / 60);

  return (
    <div className="app-shell bg-background pb-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-sm font-medium text-sky-100">
              <BarChart3 className="h-4 w-4" />
              StudyFlow AI analytics
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Focus intelligence</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Weekly momentum, subject balance, AI productivity signals, and consistency patterns.
            </p>
          </div>
          <GoalSettingsDialog goals={goals} onUpdate={updateGoals} onReset={resetToDefaults} />
        </header>

        <section className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            icon={Gauge}
            label="AI score"
            value={`${metrics.productivityScore}%`}
            detail={metrics.focusQuality}
            accent="blue"
          />
          <MetricTile
            icon={Calendar}
            label="Today"
            value={formatCompactDuration(metrics.todaySeconds)}
            detail="saved focus time"
            accent="cyan"
          />
          <MetricTile
            icon={Activity}
            label="Week"
            value={formatCompactDuration(metrics.weekSeconds)}
            detail={`${sessions.length || 12} total sessions`}
            accent="violet"
          />
          <MetricTile
            icon={Flame}
            label="Streak"
            value={`${metrics.streak}d`}
            detail="study consistency"
            accent="emerald"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <GlassPanel className="p-5">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-sky-200/80">Weekly focus graph</p>
                <h2 className="text-xl font-semibold text-white">Flow curve</h2>
              </div>
              <p className="text-sm text-slate-400">Hours and session quality across the last seven days</p>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.weeklyData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="focusHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    name="Hours"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    fill="url(#focusHours)"
                    activeDot={{ r: 5, fill: '#67e8f9', stroke: '#082f49', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="metric-icon border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-cyan-200/80">Productivity insights</p>
                <h2 className="text-xl font-semibold text-white">AI readout</h2>
              </div>
            </div>
            <div className="space-y-3">
              {metrics.insights.map((insight) => (
                <div key={insight.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">{insight.label}</p>
                    <p className="text-xs font-medium uppercase text-sky-100">{insight.trend}</p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{insight.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{insight.detail}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <GlassPanel className="p-5">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase text-emerald-200/80">Subject comparison</p>
              <h2 className="text-xl font-semibold text-white">Time distribution</h2>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.subjectData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(148,163,184,0.1)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="subject"
                    width={110}
                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="hours" name="Hours" radius={[0, 6, 6, 0]} barSize={18}>
                    {metrics.subjectData.map((entry, index) => (
                      <Cell key={entry.subject} fill={subjectColors[index % subjectColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="mb-5">
              <p className="text-xs font-medium uppercase text-violet-200/80">Study consistency</p>
              <h2 className="text-xl font-semibold text-white">28-day heatmap</h2>
            </div>
            <ConsistencyHeatmap days={metrics.heatmapData} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <GoalCard
                title="Daily Goal"
                currentMinutes={todayMinutes}
                goalMinutes={goals.dailyMinutes}
                icon="target"
                className="border-white/10 bg-white/[0.04]"
              />
              <GoalCard
                title="Weekly Goal"
                currentMinutes={weekMinutes}
                goalMinutes={goals.weeklyMinutes}
                icon="trending"
                className="border-white/10 bg-white/[0.04]"
              />
            </div>
          </GlassPanel>
        </section>

        <section className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {metrics.suggestions.map((suggestion, index) => (
            <GlassPanel
              key={suggestion}
              className="min-h-[220px] p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1" delay={index * 0.05}>
              <div className="mb-4 inline-flex rounded-lg border border-sky-300/20 bg-sky-300/10 p-2 text-sky-100">
                {index === 0 ? <Target className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
              </div>
              <p className="text-sm font-medium uppercase text-slate-500">Smart suggestion {index + 1}</p>
              <p className="mt-3 text-base text-slate-200">{suggestion}</p>
            </GlassPanel>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Stats;

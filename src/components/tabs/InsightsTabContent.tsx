import { useMemo, useState } from 'react';
import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { Brain, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimer } from '@/hooks/useTimer';
import { formatDuration } from '@/utils/statsCalculator';
import { getStudyFlowMetrics } from '@/lib/studyflowMetrics';

export const InsightsTabContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { getSessions } = useTimer('');
  const sessions = useMemo(() => getSessions(), [getSessions]);
  const metrics = useMemo(() => getStudyFlowMetrics(sessions), [sessions]);

  const getStudyTimeForDate = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      })
      .reduce((total, session) => total + session.duration, 0);
  };

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });
  const selectedDayTotal = getStudyTimeForDate(selectedDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(nextDate);
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="section-label">Calendar</p>
              <h3 className="text-lg font-semibold text-white">{format(currentDate, 'MMMM yyyy')}</h3>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="icon-button h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="icon-button h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={`${day}-${index}`} className="pb-1 text-center text-xs font-medium text-slate-500">
                {day}
              </div>
            ))}
            {calendarDays.map((day) => {
              const studyTime = getStudyTimeForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const minutes = Math.floor(studyTime / 60);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-lg border text-xs transition-all hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-sky-300/50 bg-sky-400/20 text-sky-50'
                      : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-sky-300/20'
                  } ${!isCurrentMonth ? 'opacity-35' : ''}`}
                >
                  <span className="block font-medium">{format(day, 'd')}</span>
                  {minutes > 0 && <span className="mt-0.5 block text-[9px] text-sky-100/80">{minutes}m</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="metric-icon border-sky-300/20 bg-sky-300/10 text-sky-100">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <p className="section-label">Daily readout</p>
              <h3 className="text-lg font-semibold text-white">{format(selectedDate, 'EEE, MMM dd')}</h3>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-950/45 p-5 text-center">
            <p className="text-4xl font-semibold tabular-nums text-white">{formatDuration(selectedDayTotal)}</p>
            <p className="mt-2 text-xs text-slate-500">Selected day focus time</p>
          </div>

          <div className="mt-4 space-y-3">
            {metrics.insights.map((insight) => (
              <div key={insight.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">{insight.label}</p>
                  <p className="text-xs font-medium uppercase text-sky-100">{insight.trend}</p>
                </div>
                <p className="mt-1 font-semibold text-white">{insight.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { Brain, ChevronLeft, ChevronRight, Clock3, LampDesk } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';
import { AISuggestions, MoodTracker } from '@/components/studyflow/AICards';
import { useTimer } from '@/hooks/useTimer';
import { formatDuration } from '@/utils/statsCalculator';
import { getStudyFlowMetrics } from '@/lib/studyflowMetrics';

const Insights = () => {
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

  const getMonthlyTotal = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    return sessions
      .filter((session) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      })
      .reduce((total, session) => total + session.duration, 0);
  };

  const hourlyBreakdown = useMemo(() => {
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const hourlyData: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourlyData[i] = 0;

    sessions
      .filter((session) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      })
      .forEach((session) => {
        const sessionStart = new Date(session.startTime);
        const sessionEnd = new Date(session.endTime || session.startTime);
        const startHour = sessionStart.getHours();
        const endHour = sessionEnd.getHours();

        if (startHour === endHour) {
          hourlyData[startHour] += session.duration;
        } else {
          const minutesPerHour = session.duration / 60 / (endHour - startHour + 1);
          for (let hour = startHour; hour <= endHour; hour++) {
            hourlyData[hour] += minutesPerHour * 60;
          }
        }
      });

    return hourlyData;
  }, [selectedDate, sessions]);

  const calendarDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const monthlyTotal = getMonthlyTotal();
  const selectedDayTotal = getStudyTimeForDate(selectedDate);
  const displayHours = [...Array(24)].map((_, i) => (i + 5) % 24);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content">
        <PageHeader
          icon={Brain}
          eyebrow="StudyFlow AI"
          title="Focus intelligence"
          description="Daily patterns, calendar consistency, and smart coaching signals for your next study move."
        />

        <Tabs defaultValue="day" className="mb-4">
          <TabsList className="grid h-auto w-full grid-cols-5 gap-1 rounded-lg border border-white/10 bg-slate-950/60 p-1">
            {['period', 'day', 'week', 'month', 'trend'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-md px-2 py-3 text-slate-400 data-[state=active]:bg-sky-400/15 data-[state=active]:text-sky-100"
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <GlassPanel className="p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="section-label">Calendar consistency</p>
                <h2 className="mt-1 text-xl font-semibold text-white">{format(currentDate, 'MMMM yyyy')}</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')} className="icon-button h-9 w-9">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')} className="icon-button h-9 w-9">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                  const studyTime = getStudyTimeForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  const minutes = Math.floor((studyTime % 3600) / 60);
                  const hours = Math.floor(studyTime / 3600);
                  const timeStr = hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}` : minutes > 0 ? `${minutes}m` : '';

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square rounded-lg border p-1 text-sm transition-all hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-sky-300/50 bg-sky-400/20 text-sky-50 shadow-[0_0_24px_rgba(56,189,248,0.16)]'
                          : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-sky-300/20 hover:bg-white/[0.06]'
                      } ${!isCurrentMonth ? 'opacity-35' : ''} ${isToday && !isSelected ? 'ring-1 ring-sky-300/40' : ''}`}
                    >
                      <span className="block font-medium">{format(day, 'd')}</span>
                      {timeStr && <span className="mt-1 block text-[10px] text-sky-100/80">{timeStr}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-white/10 pt-4 text-sm text-slate-400">
              {format(currentDate, 'MMM')} total: <span className="font-semibold text-white">{formatDuration(monthlyTotal)}</span>
            </div>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel className="p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="section-label">Daily analytics</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{format(selectedDate, 'EEE, MMM dd')}</h2>
                </div>
                <Clock3 className="h-5 w-5 text-sky-200" />
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_120px]">
                <div className="flex min-h-52 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035]">
                  <div className="relative flex h-44 w-44 items-center justify-center">
                    <LampDesk className="absolute h-32 w-32 text-sky-300/10" />
                    <div className="relative text-center">
                      <p className="text-4xl font-semibold tabular-nums text-white">{formatDuration(selectedDayTotal)}</p>
                      <p className="mt-2 text-xs text-slate-500">Total study time</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  {displayHours.map((hour) => {
                    const studyMinutes = Math.floor((hourlyBreakdown[hour] || 0) / 60);

                    return (
                      <div key={hour} className="grid h-6 grid-cols-[32px_minmax(0,1fr)] items-center gap-2">
                        <div className="text-right text-[10px] text-slate-500">{hour}</div>
                        <div className="h-full overflow-hidden rounded bg-white/[0.04]">
                          {studyMinutes > 0 && (
                            <div
                              className="h-full rounded bg-gradient-to-r from-sky-400 to-cyan-300"
                              style={{ width: `${Math.min((studyMinutes / 60) * 100, 100)}%` }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassPanel>

            <MoodTracker />
          </div>
        </section>

        <section className="mt-4">
          <AISuggestions suggestions={metrics.suggestions} smartBreak={metrics.smartBreak} />
        </section>
      </div>
    </div>
  );
};

export default Insights;

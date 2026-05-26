import { useState, useEffect, useRef, useMemo } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TimerDisplay } from '@/components/TimerDisplay';
import { TimerTabContent } from '@/components/tabs/TimerTabContent';
import { BooksTabContent } from '@/components/tabs/BooksTabContent';
import { InsightsTabContent } from '@/components/tabs/InsightsTabContent';
import { PlannerTabContent } from '@/components/tabs/PlannerTabContent';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { MetricTile } from '@/components/studyflow/MetricTile';
import { AchievementRail, AISuggestions, MoodTracker } from '@/components/studyflow/AICards';
import { useTimer } from '@/hooks/useTimer';
import { useSubjects } from '@/hooks/useSubjects';
import { formatCompactDuration, getStudyFlowMetrics } from '@/lib/studyflowMetrics';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Checkbox } from '@/components/ui/checkbox';
import { Activity, CalendarCheck, Flame, Gauge, Sparkles, Zap } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type TabValue = 'timer' | 'books' | 'insights' | 'planner';
type SwitchPreference = 'ask' | 'save' | 'discard';

const SWITCH_PREF_KEY = 'studypulse_switch_preference';

const Home = () => {
  const { subjects, addSubject, updateSubject, removeSubject } = useSubjects();
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabValue>('timer');
  const [pendingSwitchIndex, setPendingSwitchIndex] = useState<number | null>(null);
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);
  const [switchPreference, setSwitchPreference] = useState<SwitchPreference>(() => {
    const saved = localStorage.getItem(SWITCH_PREF_KEY);
    return (saved as SwitchPreference) || 'ask';
  });
  const currentSubject = subjects[activeSubjectIndex]?.name || 'Math';

  const {
    hours,
    minutes,
    seconds,
    isRunning,
    totalSeconds,
    start,
    pause,
    reset,
    getSessions
  } = useTimer(currentSubject);

  const prevTotalSeconds = useRef(totalSeconds);
  const sessions = useMemo(() => getSessions(), [getSessions, totalSeconds, isRunning]);
  const studyFlowMetrics = useMemo(() => getStudyFlowMetrics(sessions), [sessions]);
  const liveProductivityScore = Math.min(99, studyFlowMetrics.productivityScore + Math.floor(totalSeconds / 1200));
  const liveTodaySeconds = studyFlowMetrics.todaySeconds + totalSeconds;
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  const getSubjectTime = (subjectName: string) => {
    const sessions = getSessions();
    return sessions
      .filter(s => s.subject === subjectName)
      .reduce((total, s) => total + s.duration, 0);
  };

  useEffect(() => {
    if (totalSeconds > 0 && totalSeconds !== prevTotalSeconds.current) {
      const milestones = [900, 1800, 3600, 5400, 7200];

      if (milestones.includes(totalSeconds)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6C63FF', '#A993FF', '#A6E3E9', '#FFB6C1', '#FFE082']
        });

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        toast.success(`Amazing. You've studied for ${timeStr}.`);
      }
    }
    prevTotalSeconds.current = totalSeconds;
  }, [totalSeconds]);

  const handlePlayPause = (index: number) => {
    const clickedSubject = subjects[index].name;

    if (index === activeSubjectIndex) {
      if (isRunning) {
        pause();
        toast.info('Timer paused');
      } else {
        start();
        toast.success('Timer started. Stay focused.');
      }
    } else {
      // If timer is running, check preference or show dialog
      if (isRunning) {
        if (switchPreference === 'save') {
          // Auto-save and switch
          if (totalSeconds > 0) {
            reset();
            toast.success(`Saved ${currentSubject} session!`);
          }
          setActiveSubjectIndex(index);
          setTimeout(() => {
            start();
            toast.success(`Started ${clickedSubject} session.`);
          }, 100);
        } else if (switchPreference === 'discard') {
          // Auto-discard and switch
          reset();
          setActiveSubjectIndex(index);
          setTimeout(() => {
            start();
            toast.success(`Started ${clickedSubject} session.`);
          }, 100);
        } else {
          // Ask user
          setPendingSwitchIndex(index);
          setShowSwitchDialog(true);
        }
      } else {
        setActiveSubjectIndex(index);
        setTimeout(() => {
          start();
          toast.success(`Started ${clickedSubject} session.`);
        }, 100);
      }
    }
  };

  const confirmSwitchAndReset = () => {
    if (dontAskAgain) {
      setSwitchPreference('discard');
      localStorage.setItem(SWITCH_PREF_KEY, 'discard');
    }
    if (pendingSwitchIndex !== null) {
      const clickedSubject = subjects[pendingSwitchIndex].name;
      reset();
      setActiveSubjectIndex(pendingSwitchIndex);
      setTimeout(() => {
        start();
        toast.success(`Started ${clickedSubject} session.`);
      }, 100);
    }
    setShowSwitchDialog(false);
    setPendingSwitchIndex(null);
    setDontAskAgain(false);
  };

  const confirmSwitchAndSave = () => {
    if (dontAskAgain) {
      setSwitchPreference('save');
      localStorage.setItem(SWITCH_PREF_KEY, 'save');
    }
    if (pendingSwitchIndex !== null) {
      const clickedSubject = subjects[pendingSwitchIndex].name;
      // Save current session before switching
      if (totalSeconds > 0) {
        reset(); // This saves the session automatically before resetting
        toast.success(`Saved ${currentSubject} session!`);
      }
      setActiveSubjectIndex(pendingSwitchIndex);
      setTimeout(() => {
        start();
        toast.success(`Started ${clickedSubject} session.`);
      }, 100);
    }
    setShowSwitchDialog(false);
    setPendingSwitchIndex(null);
    setDontAskAgain(false);
  };

  const cancelSwitch = () => {
    setShowSwitchDialog(false);
    setPendingSwitchIndex(null);
    setDontAskAgain(false);
  };

  const currentDate = format(new Date(), 'EEEE, MMM d');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'timer':
        return (
          <TimerTabContent
            subjects={subjects}
            activeSubjectIndex={activeSubjectIndex}
            isRunning={isRunning}
            onPlayPause={handlePlayPause}
            onAddSubject={addSubject}
            onUpdateSubject={updateSubject}
            onRemoveSubject={(id) => {
              removeSubject(id);
              if (activeSubjectIndex >= subjects.length - 1) {
                setActiveSubjectIndex(0);
              }
            }}
            getSubjectTime={getSubjectTime}
          />
        );
      case 'books':
        return <BooksTabContent />;
      case 'insights':
        return <InsightsTabContent />;
      case 'planner':
        return <PlannerTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell bg-background pb-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-sm font-medium text-sky-100">
              <Sparkles className="h-4 w-4" />
              StudyFlow AI - Focus Smarter
            </div>
            <h1 className="text-balance text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              {greeting}, Sumit
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-400 sm:text-lg">
              Your focus cockpit is ready. Momentum, subject balance, and next-session intelligence are synced.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left md:text-right">
            <p className="text-sm text-slate-400">{currentDate}</p>
            <p className="mt-1 text-lg font-semibold text-white">{currentSubject}</p>
          </div>
        </header>

        <section className={`cinematic-stage ${isRunning ? 'cinematic-stage-active' : ''} p-5 sm:p-6 lg:p-8`}>
          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)] lg:items-center xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.05fr)_minmax(300px,0.75fr)]">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-5 flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-medium uppercase text-cyan-100">
                <Zap className="h-4 w-4" />
                Cinematic focus engine
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <TimerDisplay
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  isRunning={isRunning}
                  totalSeconds={totalSeconds}
                  size="lg"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-slate-300 shadow-[0_0_32px_rgba(56,189,248,0.08)]"
              >
                <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]' : 'bg-slate-500'}`} />
                {isRunning ? 'Deep focus active' : 'Ready for next sprint'}
              </motion.div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase text-cyan-200/80">Now studying</p>
                <h2 className="mt-2 text-4xl font-semibold text-white sm:text-5xl">{currentSubject}</h2>
                <p className="mt-4 max-w-xl text-slate-400">
                  A dark cinematic workspace tuned for one clean sprint, visible momentum, and calm high-signal controls.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                <div className="cinema-stat min-h-[190px] p-5 flex flex-col justify-between rounded-3xl border border-cyan-400/10 backdrop-blur-xl bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
                  <p className="text-xs font-medium uppercase text-slate-500">AI score</p>
                  <div className="mt-3 flex items-end gap-3">
                    <motion.span
                      key={liveProductivityScore}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl md:text-5xl font-semibold tabular-nums text-white leading-none"
                    >
                      {liveProductivityScore}
                    </motion.span>
                    <span className="mb-2 text-sm text-slate-500">/100</span>
                  </div>
                </div>
                <div className="cinema-stat min-h-[190px] p-5 flex flex-col justify-between rounded-3xl border border-cyan-400/10 backdrop-blur-xl bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
                  <p className="text-xs font-medium uppercase text-slate-500">Today</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-white">{formatCompactDuration(liveTodaySeconds)}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{studyFlowMetrics.focusQuality}</p>
                </div>
                <div className="cinema-stat min-h-[190px] p-5 flex flex-col justify-between rounded-3xl border border-cyan-400/10 backdrop-blur-xl bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20">
                  <p className="text-xs font-medium uppercase text-slate-500">Streak</p>
                  <p className="mt-3 text-3xl font-semibold tabular-nums text-white">{studyFlowMetrics.streak}d</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">current chain</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                <MetricTile icon={Gauge} label="Score" value={`${liveProductivityScore}%`} detail="adaptive focus index" accent="blue" />
                <MetricTile icon={Flame} label="Streak" value={`${studyFlowMetrics.streak}d`} detail="current flow chain" accent="emerald" />
                <MetricTile icon={CalendarCheck} label="Week" value={formatCompactDuration(studyFlowMetrics.weekSeconds)} detail="saved sessions" accent="cyan" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 xl:col-span-1 xl:grid-cols-1">
              <AISuggestions suggestions={studyFlowMetrics.suggestions} smartBreak={studyFlowMetrics.smartBreak} />
              <MoodTracker />
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <GlassPanel className="p-4 sm:p-5">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="space-y-5">
              <TabsList className="grid h-auto w-full grid-cols-4 gap-1 rounded-lg border border-white/10 bg-slate-950/60 p-1">
                {(['timer', 'books', 'insights', 'planner'] as TabValue[]).map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-md px-2 py-3 text-slate-400 data-[state=active]:bg-sky-400/15 data-[state=active]:text-sky-100 data-[state=active]:shadow-[0_0_24px_rgba(56,189,248,0.16)]"
                  >
                    {tab[0].toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="min-h-[420px]">
                {renderTabContent()}
              </div>
            </Tabs>
          </GlassPanel>

          <div className="space-y-4">
            <GlassPanel className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="metric-icon border-sky-300/20 bg-sky-300/10 text-sky-100">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-sky-200/80">Focus insights</p>
                  <h3 className="text-lg font-semibold text-white">Live intelligence</h3>
                </div>
              </div>
              <div className="space-y-3">
                {studyFlowMetrics.insights.map((insight) => (
                  <div key={insight.label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-400">{insight.label}</p>
                      <p className="text-xs font-medium uppercase text-cyan-200">{insight.trend}</p>
                    </div>
                    <p className="mt-2 text-xl font-semibold text-white">{insight.value}</p>
                    <p className="mt-1 text-sm text-slate-500">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
            <AchievementRail achievements={studyFlowMetrics.achievements} />
          </div>
        </section>
      </div>

      {/* Subject Switch Confirmation Dialog */}
      <AlertDialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch Subject?</AlertDialogTitle>
            <AlertDialogDescription>
              Your timer is currently running for {currentSubject}. What would you like to do with your current session?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="dontAskAgain"
              checked={dontAskAgain}
              onCheckedChange={(checked) => setDontAskAgain(checked === true)}
            />
            <label
              htmlFor="dontAskAgain"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Don't ask again (remember my choice)
            </label>
          </div>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={cancelSwitch}>Keep Studying</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSwitchAndReset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard & Switch
            </AlertDialogAction>
            <AlertDialogAction onClick={confirmSwitchAndSave}>
              Save & Switch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;

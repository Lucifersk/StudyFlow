import { useEffect, useState } from 'react';
import { Clock, Settings, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SubjectManager } from '@/components/SubjectManager';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';
import { SubjectColor, useSubjects } from '@/hooks/useSubjects';
import { useTimer } from '@/hooks/useTimer';
import { calculateSubjectStats, formatDuration } from '@/utils/statsCalculator';

const colorClasses: Record<SubjectColor, string> = {
  primary: 'from-primary to-primary-light',
  secondary: 'from-accent to-accent/70',
  pink: 'from-accent-pink to-accent-pink/70',
  yellow: 'from-accent-yellow to-accent-yellow/70',
  accent: 'from-accent to-accent/70',
  purple: 'from-subject-purple to-subject-purple/70',
  green: 'from-subject-green to-subject-green/70',
  orange: 'from-subject-orange to-subject-orange/70',
  red: 'from-subject-red to-subject-red/70',
  violet: 'from-subject-violet to-subject-violet/70',
  blue: 'from-subject-blue to-subject-blue/70',
  lightblue: 'from-subject-lightblue to-subject-lightblue/70',
};

const colorVars: Record<SubjectColor, string> = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  pink: 'hsl(var(--accent-pink))',
  yellow: 'hsl(var(--accent-yellow))',
  accent: 'hsl(var(--accent))',
  purple: 'hsl(var(--subject-purple))',
  green: 'hsl(var(--subject-green))',
  orange: 'hsl(var(--subject-orange))',
  red: 'hsl(var(--subject-red))',
  violet: 'hsl(var(--subject-violet))',
  blue: 'hsl(var(--subject-blue))',
  lightblue: 'hsl(var(--subject-lightblue))',
};

const Subjects = () => {
  const { subjects, addSubject, updateSubject, removeSubject } = useSubjects();
  const { getSessions } = useTimer('');
  const [subjectStats, setSubjectStats] = useState<Array<{ subject: string; totalSeconds: number }>>([]);
  const [totalMonthly, setTotalMonthly] = useState(0);

  useEffect(() => {
    const stats = calculateSubjectStats(getSessions());
    setSubjectStats(stats);
    setTotalMonthly(stats.reduce((sum, subject) => sum + subject.totalSeconds, 0));
  }, [getSessions]);

  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-5xl">
        <PageHeader
          icon={Settings}
          eyebrow="StudyFlow subjects"
          title="Subject system"
          description="A refined view of focus tracks, study time, and subject balance."
          actions={
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Manage
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh] overflow-y-auto border-white/10 bg-slate-950 text-white">
                <SheetHeader>
                  <SheetTitle>Manage Subjects</SheetTitle>
                  <SheetDescription>Add, edit, or remove your study subjects</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SubjectManager
                    subjects={subjects}
                    onAdd={addSubject}
                    onUpdate={(id, name, color) => updateSubject(id, { name, color })}
                    onRemove={removeSubject}
                  />
                </div>
              </SheetContent>
            </Sheet>
          }
        />

        <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <GlassPanel className="p-6">
            <p className="section-label">Total study time</p>
            <p className="mt-2 text-5xl font-semibold text-white">{formatDuration(totalMonthly)}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp className="h-4 w-4 text-emerald-200" />
              Across all subjects
            </p>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="grid gap-3 md:grid-cols-2">
              {subjects.map((subject) => {
                const stats = subjectStats.find((item) => item.subject === subject.name);
                const hours = stats ? Math.floor(stats.totalSeconds / 3600) : 0;
                const minutes = stats ? Math.floor((stats.totalSeconds % 3600) / 60) : 0;

                return (
                  <article key={subject.id} className="surface-card p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br ${colorClasses[subject.color]} text-2xl font-semibold text-white shadow-soft`}
                        style={{
                          background: colorVars[subject.color],
                        }}
                      >
                        {subject.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-white">{subject.name}</h3>
                        <p className="mt-2 flex items-center gap-1 text-sm text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          {stats ? (hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`) : 'No sessions yet'}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};

export default Subjects;

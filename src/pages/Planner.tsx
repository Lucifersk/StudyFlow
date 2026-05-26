import { useState } from 'react';
import { CalendarDays, Clock3, Eye, FileText, Plus, User } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';

const initialTasks = [
  { id: 1, title: 'Complete Math homework Ch.5', subject: 'Math', time: '2h', completed: false },
  { id: 2, title: 'Read English essay feedback', subject: 'English', time: '30m', completed: true },
  { id: 3, title: 'Chemistry lab report', subject: 'Chemistry', time: '1.5h', completed: false },
];

const Planner = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const hours = Array.from({ length: 24 }, (_, i) => (i + 5) % 24);
  const completedCount = tasks.filter((task) => task.completed).length;

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content">
        <PageHeader
          icon={CalendarDays}
          eyebrow="StudyFlow planner"
          title="Today’s focus map"
          description="A clean command center for tasks, schedule blocks, and lightweight study planning."
          actions={
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New task
            </Button>
          }
        />

        <section className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          <GlassPanel className="p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="section-label">Task queue</p>
                <h2 className="mt-1 text-xl font-semibold text-white">To-do stack</h2>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                {completedCount}/{tasks.length} done
              </div>
            </div>

            <ScrollArea className="h-[420px] pr-3 lg:h-[calc(100vh-300px)]">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    title={task.title}
                    subject={task.subject}
                    time={task.time}
                    completed={task.completed}
                    onToggle={() => toggleTask(task.id)}
                  />
                ))}
                {tasks.length === 0 && <div className="empty-state">No tasks scheduled.</div>}
              </div>
            </ScrollArea>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-label">Daily timeline</p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h2>
              </div>
              <div className="flex gap-2">
                {[Eye, FileText, CalendarDays, User].map((Icon, index) => (
                  <button key={index} className="icon-button flex h-10 w-10 items-center justify-center" type="button">
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            <ScrollArea className="h-[520px] lg:h-[calc(100vh-300px)]">
              <div className="space-y-1">
                {hours.map((hour, index) => {
                  const isPrime = hour >= 8 && hour <= 11;
                  const isEvening = hour >= 18 && hour <= 21;

                  return (
                    <div
                      key={hour}
                      className="grid grid-cols-[68px_minmax(0,1fr)] items-stretch rounded-lg border border-transparent transition-all hover:border-sky-300/20 hover:bg-white/[0.035]"
                    >
                      <div className="border-r border-white/10 px-3 py-4 text-sm font-medium tabular-nums text-slate-500">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="min-h-[62px] px-4 py-3">
                        {(isPrime || isEvening) && (
                          <div className="flex h-full items-center justify-between rounded-lg border border-sky-300/15 bg-sky-300/[0.06] px-3 text-sm">
                            <span className="font-medium text-sky-100">
                              {isPrime ? 'Deep work window' : 'Revision window'}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Clock3 className="h-3.5 w-3.5" />
                              {index % 2 === 0 ? '45m' : '25m'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};

export default Planner;

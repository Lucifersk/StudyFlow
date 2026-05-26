import { useState } from 'react';
import { Clock3, Plus } from 'lucide-react';
import { TaskCard } from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialTasks = [
  { id: 1, title: 'Complete Math homework Ch.5', subject: 'Math', time: '2h', completed: false },
  { id: 2, title: 'Read English essay feedback', subject: 'English', time: '30m', completed: true },
  { id: 3, title: 'Chemistry lab report', subject: 'Chemistry', time: '1.5h', completed: false },
];

export const PlannerTabContent = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const hours = Array.from({ length: 24 }, (_, i) => (i + 5) % 24);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label">Planner</p>
              <h3 className="text-lg font-semibold text-white">Tasks</h3>
            </div>
            <Button size="sm" className="h-9 px-3 text-xs">
              <Plus className="h-3.5 w-3.5" />
              Task
            </Button>
          </div>

          <ScrollArea className="h-[360px] pr-2 lg:h-[calc(100vh-430px)]">
            <div className="space-y-2">
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
            </div>
          </ScrollArea>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Timeline</h3>
            <Clock3 className="h-4 w-4 text-sky-200" />
          </div>
          <ScrollArea className="h-[360px] lg:h-[calc(100vh-430px)]">
            <div className="space-y-1">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-[54px_minmax(0,1fr)] rounded-lg transition-all hover:bg-white/[0.04]">
                  <div className="border-r border-white/10 py-3 text-xs font-medium tabular-nums text-slate-500">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  <div className="min-h-[48px] px-3 py-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

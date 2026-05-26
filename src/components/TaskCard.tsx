import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  title: string;
  subject?: string;
  time?: string;
  completed?: boolean;
  onToggle?: () => void;
}

export const TaskCard = ({ title, subject, time, completed, onToggle }: TaskCardProps) => {
  return (
    <div className="surface-card p-4">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={completed}
          onCheckedChange={onToggle}
          className="mt-1 data-[state=checked]:bg-gradient-primary data-[state=checked]:border-transparent"
        />
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-white ${completed ? 'line-through opacity-45' : ''}`}>
            {title}
          </h4>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            {subject && (
              <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-sky-100">
                {subject}
              </span>
            )}
            {time && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {time}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

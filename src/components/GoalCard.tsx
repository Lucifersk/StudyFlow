import { Target, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  title: string;
  currentMinutes: number;
  goalMinutes: number;
  icon?: 'target' | 'trending';
  className?: string;
}

export const GoalCard = ({ 
  title, 
  currentMinutes, 
  goalMinutes, 
  icon = 'target',
  className 
}: GoalCardProps) => {
  const progress = goalMinutes > 0 ? Math.min((currentMinutes / goalMinutes) * 100, 100) : 0;
  const isComplete = currentMinutes >= goalMinutes;
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const Icon = icon === 'target' ? Target : TrendingUp;

  return (
    <div className={cn(
      "rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-card transition-all duration-300",
      isComplete && "ring-2 ring-primary/20",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn(
            "w-4 h-4",
            isComplete ? "text-primary" : "text-muted-foreground"
          )} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {isComplete && (
          <span className="text-xs font-medium text-primary">Complete</span>
        )}
      </div>

      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatTime(currentMinutes)} / {formatTime(goalMinutes)}
          </span>
          <span className={cn(
            "font-semibold",
            isComplete ? "text-primary" : "text-foreground"
          )}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

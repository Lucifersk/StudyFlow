import { Play, Pause, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDuration } from '@/utils/statsCalculator';

interface SubjectListItemProps {
  name: string;
  color: string;
  timeSpent: number;
  isActive: boolean;
  isRunning: boolean;
  onPlayPause: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const colorMap: Record<string, string> = {
  orange: 'hsl(var(--subject-orange))',
  red: 'hsl(var(--subject-red))',
  purple: 'hsl(var(--subject-purple))',
  violet: 'hsl(var(--subject-violet))',
  blue: 'hsl(var(--subject-blue))',
  lightblue: 'hsl(var(--subject-lightblue))',
  green: 'hsl(var(--subject-green))',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  pink: 'hsl(var(--accent-pink))',
  yellow: 'hsl(var(--accent-yellow))',
  accent: 'hsl(var(--accent))',
};

export const SubjectListItem = ({
  name,
  color,
  timeSpent,
  isActive,
  isRunning,
  onPlayPause,
  onEdit,
  onDelete,
}: SubjectListItemProps) => {
  const bgColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${
        isActive
          ? 'border-sky-300/25 bg-sky-400/[0.08] shadow-[0_0_34px_rgba(56,189,248,0.12)]'
          : 'border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]'
      }`}
    >
      <Button
        onClick={onPlayPause}
        size="icon"
        className={`h-14 w-14 rounded-lg border border-white/10 shadow-soft transition-all hover:scale-105 ${
          isRunning && isActive ? 'shadow-[0_0_28px_rgba(56,189,248,0.35)]' : ''
        }`}
        style={{ backgroundColor: bgColor, border: 'none' }}
      >
        {isRunning && isActive ? (
          <Pause className="w-6 h-6 text-white" fill="white" />
        ) : (
          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-white">{name}</h3>
          {isActive && <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />}
        </div>
        <p className="mt-1 text-sm text-slate-400 tabular-nums">
          {formatDuration(timeSpent)}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-lg border-white/10 bg-slate-950/95">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

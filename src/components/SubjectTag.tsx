import { LucideIcon } from 'lucide-react';
import { SubjectColor } from '@/hooks/useSubjects';

interface SubjectTagProps {
  name: string;
  color: SubjectColor;
  icon?: LucideIcon;
  onClick?: () => void;
  active?: boolean;
}

export const SubjectTag = ({ name, color, icon: Icon, onClick, active }: SubjectTagProps) => {
  const colorClasses: Record<SubjectColor, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    secondary: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    pink: 'bg-accent-pink/20 text-accent-pink border-accent-pink/30 hover:bg-accent-pink/30',
    yellow: 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30 hover:bg-accent-yellow/30',
    accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    purple: 'bg-subject-purple/10 text-subject-purple border-subject-purple/20 hover:bg-subject-purple/20',
    green: 'bg-subject-green/10 text-subject-green border-subject-green/20 hover:bg-subject-green/20',
    orange: 'bg-subject-orange/10 text-subject-orange border-subject-orange/20 hover:bg-subject-orange/20',
    red: 'bg-subject-red/10 text-subject-red border-subject-red/20 hover:bg-subject-red/20',
    violet: 'bg-subject-violet/10 text-subject-violet border-subject-violet/20 hover:bg-subject-violet/20',
    blue: 'bg-subject-blue/10 text-subject-blue border-subject-blue/20 hover:bg-subject-blue/20',
    lightblue: 'bg-subject-lightblue/10 text-subject-lightblue border-subject-lightblue/20 hover:bg-subject-lightblue/20',
  };

  const activeClasses = active
    ? color === 'primary'
      ? 'bg-gradient-primary text-primary-foreground border-transparent'
      : 'ring-2 ring-offset-2 ring-current'
    : '';

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-lg border px-4 py-2
        text-sm font-medium transition-all hover:-translate-y-0.5
        ${colorClasses[color]} ${activeClasses}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{name}</span>
    </button>
  );
};

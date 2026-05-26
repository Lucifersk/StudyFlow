import type { ReactNode } from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  eyebrow = 'StudyFlow AI',
  title,
  description,
  icon: Icon = Sparkles,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <header className={cn('mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-sm font-medium text-sky-100">
          <Icon className="h-4 w-4" />
          {eyebrow}
        </div>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-base text-slate-400">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
};

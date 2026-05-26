import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const GlassPanel = ({ children, className, delay = 0 }: GlassPanelProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass-panel', className)}
    >
      {children}
    </motion.section>
  );
};

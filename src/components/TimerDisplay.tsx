import { motion } from 'framer-motion';
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface TimerDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  size?: 'sm' | 'md' | 'lg';
  isRunning?: boolean;
  totalSeconds?: number;
}

export const TimerDisplay = ({
  hours,
  minutes,
  seconds,
  size = 'lg',
  isRunning = false,
  totalSeconds = 0,
}: TimerDisplayProps) => {
  const formatTime = (num: number) => String(num).padStart(2, '0');

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-4xl md:text-5xl',
  };

  const shellSize = {
    sm: 'w-32 h-32',
    md: 'w-52 h-52',
    lg: 'w-[300px] h-[300px] md:w-[380px] md:h-[380px]',
  };

  const maxSeconds = 3600;
  const progressSeconds = totalSeconds % maxSeconds;
  const progress = (progressSeconds / maxSeconds) * 100;

  return (
    <motion.div
      animate={
        isRunning
          ? {
            scale: [1, 1.015, 1],
          }
          : {
            scale: 1,
          }
      }
      transition={{
        duration: 4,
        repeat: isRunning ? Infinity : 0,
        ease: 'easeInOut',
      }}
      className={`relative flex items-center justify-center ${shellSize[size]}`}
    >
      {/* Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${isRunning
          ? 'bg-cyan-400/20 opacity-100'
          : 'bg-slate-500/10 opacity-60'
          }`}
      />

      {/* Rotating Outer Ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-3 rounded-full border border-dashed border-cyan-300/10"
      />

      {/* Background Ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/10 bg-slate-950/40 shadow-[inset_0_0_50px_rgba(34,211,238,0.12)]" />

      <CircularProgressbarWithChildren
        value={progress}
        strokeWidth={3}
        styles={buildStyles({
          pathTransitionDuration: 0.8,
          pathColor: isRunning
            ? 'rgba(34,211,238,1)'
            : 'rgba(125,211,252,0.7)',
          trailColor: 'rgba(255,255,255,0.06)',
        })}
      >
        {/* Inner Circle */}
        <div className="relative flex h-[82%] w-[82%] flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_80px_rgba(34,211,238,0.15)] overflow-hidden">

          {/* Animated Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(34,211,238,0.06),transparent_60%)]" />

          {/* Status Badge */}
          <div className="relative mb-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-100">
            {isRunning ? 'Focus Running' : 'Focus Ready'}
          </div>

          {/* Timer */}
          <div
            className={`relative flex items-center justify-center whitespace-nowrap leading-none tracking-tight font-bold tabular-nums ${sizeClasses[size]}`}
          >
            <span className="text-white">
              {formatTime(hours)}
            </span>

            <span className="mx-1 text-slate-500">
              :
            </span>

            <span className="text-white">
              {formatTime(minutes)}
            </span>

            <span className="mx-1 text-slate-500">
              :
            </span>

            <span className="text-cyan-100">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative mt-3 h-2 w-36 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300"
              animate={{
                width: `${Math.max(progress, 3)}%`,
              }}
              transition={{
                duration: 0.6,
              }}
            />
          </div>

          {/* Footer Text */}
          <div className="relative mt-3 text-sm text-slate-300">
            {Math.round(progress)}% of focus session
          </div>

          {/* Bottom Status */}
          <div className="relative mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">
            {isRunning
              ? 'Deep focus in progress'
              : 'Ready for next sprint'}
          </div>
        </div>
      </CircularProgressbarWithChildren>
    </motion.div>
  );
};
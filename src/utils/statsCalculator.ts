import { TimerSession } from '@/hooks/useTimer';

export interface DailyStats {
  date: string;
  totalSeconds: number;
  sessions: number;
}

export interface SubjectStats {
  subject: string;
  totalSeconds: number;
  sessions: number;
  percentage: number;
}

export const calculateDailyStats = (sessions: TimerSession[], days: number = 7): DailyStats[] => {
  const stats: { [date: string]: DailyStats } = {};
  const today = new Date();
  
  // Initialize last N days
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    stats[dateStr] = { date: dateStr, totalSeconds: 0, sessions: 0 };
  }

  // Aggregate sessions
  sessions.forEach(session => {
    if (stats[session.date]) {
      stats[session.date].totalSeconds += session.duration;
      stats[session.date].sessions += 1;
    }
  });

  return Object.values(stats).reverse();
};

export const calculateSubjectStats = (sessions: TimerSession[]): SubjectStats[] => {
  const subjectMap: { [subject: string]: { totalSeconds: number; sessions: number } } = {};
  let totalTime = 0;

  sessions.forEach(session => {
    if (!subjectMap[session.subject]) {
      subjectMap[session.subject] = { totalSeconds: 0, sessions: 0 };
    }
    subjectMap[session.subject].totalSeconds += session.duration;
    subjectMap[session.subject].sessions += 1;
    totalTime += session.duration;
  });

  return Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    totalSeconds: data.totalSeconds,
    sessions: data.sessions,
    percentage: totalTime > 0 ? (data.totalSeconds / totalTime) * 100 : 0,
  }));
};

export const getTodayStats = (sessions: TimerSession[]): { totalSeconds: number; sessions: number } => {
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(s => s.date === today);
  
  return {
    totalSeconds: todaySessions.reduce((sum, s) => sum + s.duration, 0),
    sessions: todaySessions.length,
  };
};

export const getWeekStats = (sessions: TimerSession[]): { totalSeconds: number; sessions: number } => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const weekSessions = sessions.filter(s => s.date >= weekAgoStr);
  
  return {
    totalSeconds: weekSessions.reduce((sum, s) => sum + s.duration, 0),
    sessions: weekSessions.length,
  };
};

export const getStreak = (sessions: TimerSession[]): number => {
  if (sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let currentDate = new Date();

  // Check if user studied today or yesterday (streak can continue)
  if (dates[0] !== today && dates[0] !== getPreviousDate(today)) {
    return 0;
  }

  for (const date of dates) {
    const expectedDate = currentDate.toISOString().split('T')[0];
    if (date === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const getPreviousDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

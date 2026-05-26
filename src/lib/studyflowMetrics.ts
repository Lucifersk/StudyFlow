import { TimerSession } from '@/hooks/useTimer';
import {
  calculateDailyStats,
  calculateSubjectStats,
  getStreak,
  getTodayStats,
  getWeekStats,
} from '@/utils/statsCalculator';

export interface FocusMetric {
  label: string;
  value: string;
  detail: string;
  trend: string;
}

export interface ChartPoint {
  label: string;
  hours: number;
  sessions: number;
  score: number;
}

export interface SubjectChartPoint {
  subject: string;
  hours: number;
  sessions: number;
  percentage: number;
}

export interface HeatmapDay {
  date: string;
  day: string;
  minutes: number;
  level: number;
}

export interface StudyFlowMetrics {
  todaySeconds: number;
  weekSeconds: number;
  streak: number;
  productivityScore: number;
  focusQuality: string;
  weeklyData: ChartPoint[];
  subjectData: SubjectChartPoint[];
  heatmapData: HeatmapDay[];
  suggestions: string[];
  insights: FocusMetric[];
  achievements: FocusMetric[];
  smartBreak: string;
}

const fallbackSubjects = [
  { subject: 'Python', hours: 4.5, sessions: 4, percentage: 28 },
  { subject: 'DBMS', hours: 3.25, sessions: 3, percentage: 20 },
  { subject: 'Cloud', hours: 2.8, sessions: 3, percentage: 17 },
  { subject: 'Networks', hours: 2.2, sessions: 2, percentage: 14 },
  { subject: 'Flutter', hours: 1.7, sessions: 2, percentage: 11 },
];

const fallbackWeek = [
  { label: 'Mon', hours: 1.8, sessions: 2, score: 72 },
  { label: 'Tue', hours: 2.4, sessions: 3, score: 81 },
  { label: 'Wed', hours: 1.2, sessions: 1, score: 64 },
  { label: 'Thu', hours: 3.1, sessions: 3, score: 88 },
  { label: 'Fri', hours: 2.7, sessions: 2, score: 84 },
  { label: 'Sat', hours: 1.6, sessions: 2, score: 70 },
  { label: 'Sun', hours: 2.1, sessions: 2, score: 76 },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hours = (seconds: number) => Math.round((seconds / 3600) * 10) / 10;

export const formatCompactDuration = (seconds: number) => {
  const totalMinutes = Math.round(seconds / 60);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
};

const getProductivityScore = (sessions: TimerSession[]) => {
  const today = getTodayStats(sessions);
  const week = getWeekStats(sessions);
  const streak = getStreak(sessions);
  const subjectCount = calculateSubjectStats(sessions).length;
  const latestSessions = sessions.slice(-8);
  const averageSessionMinutes =
    latestSessions.length > 0
      ? latestSessions.reduce((sum, session) => sum + session.duration, 0) / latestSessions.length / 60
      : 0;

  const dailyScore = clamp((today.totalSeconds / 7200) * 34, 0, 34);
  const weeklyScore = clamp((week.totalSeconds / 36000) * 26, 0, 26);
  const streakScore = clamp(streak * 5, 0, 20);
  const sessionQualityScore = clamp((averageSessionMinutes / 50) * 12, 0, 12);
  const breadthScore = clamp(subjectCount * 2, 0, 8);

  return Math.round(dailyScore + weeklyScore + streakScore + sessionQualityScore + breadthScore);
};

const buildWeeklyData = (sessions: TimerSession[]): ChartPoint[] => {
  const daily = calculateDailyStats(sessions, 7);

  if (sessions.length === 0) return fallbackWeek;

  return daily.map((day) => {
    const date = new Date(day.date);
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: hours(day.totalSeconds),
      sessions: day.sessions,
      score: clamp(Math.round((day.totalSeconds / 7200) * 100), 8, 100),
    };
  });
};

const buildSubjectData = (sessions: TimerSession[]): SubjectChartPoint[] => {
  const subjects = calculateSubjectStats(sessions);

  if (subjects.length === 0) return fallbackSubjects;

  return subjects
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, 6)
    .map((subject) => ({
      subject: subject.subject,
      hours: hours(subject.totalSeconds),
      sessions: subject.sessions,
      percentage: Math.round(subject.percentage),
    }));
};

const buildHeatmapData = (sessions: TimerSession[]): HeatmapDay[] => {
  const today = new Date();
  const sessionMap = sessions.reduce<Record<string, number>>((acc, session) => {
    acc[session.date] = (acc[session.date] || 0) + session.duration;
    return acc;
  }, {});

  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (27 - index));
    const dateStr = date.toISOString().split('T')[0];
    const minutes = Math.round((sessionMap[dateStr] || 0) / 60);
    const level = minutes === 0 ? 0 : minutes < 30 ? 1 : minutes < 90 ? 2 : minutes < 150 ? 3 : 4;

    return {
      date: dateStr,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes,
      level,
    };
  });
};

const getSuggestions = (metrics: {
  todaySeconds: number;
  weekSeconds: number;
  streak: number;
  subjectData: SubjectChartPoint[];
  productivityScore: number;
}) => {
  const weakestSubject = metrics.subjectData[metrics.subjectData.length - 1]?.subject || 'your lightest subject';
  const strongestSubject = metrics.subjectData[0]?.subject || 'your strongest subject';

  if (metrics.todaySeconds === 0) {
    return [
      `Start with a 25-minute deep focus sprint on ${strongestSubject}.`,
      `Warm up with one revision block before opening new material.`,
      'Mood-tagged sessions will make the next score sharper.',
    ];
  }

  if (metrics.productivityScore >= 80) {
    return [
      `Protect the momentum: schedule ${weakestSubject} while your focus curve is high.`,
      'Use a longer smart break after the next session to avoid late-day fatigue.',
      'Convert today’s best study block into a repeatable routine for tomorrow.',
    ];
  }

  return [
    `Balance the week with a short recovery session in ${weakestSubject}.`,
    'Try a 45/10 cycle next; your recent sessions suggest medium blocks will land better.',
    'End today with a two-minute recap to raise tomorrow’s restart speed.',
  ];
};

export const getStudyFlowMetrics = (sessions: TimerSession[]): StudyFlowMetrics => {
  const today = getTodayStats(sessions);
  const week = getWeekStats(sessions);
  const streak = getStreak(sessions);
  const productivityScore = sessions.length > 0 ? getProductivityScore(sessions) : 76;
  const weeklyData = buildWeeklyData(sessions);
  const subjectData = buildSubjectData(sessions);
  const heatmapData = buildHeatmapData(sessions);
  const focusQuality = productivityScore >= 82 ? 'Peak flow' : productivityScore >= 65 ? 'Building rhythm' : 'Needs calibration';
  const bestDay = [...weeklyData].sort((a, b) => b.hours - a.hours)[0];
  const topSubject = subjectData[0];
  const consistencyDays = heatmapData.filter((day) => day.level > 0).length;

  return {
    todaySeconds: today.totalSeconds,
    weekSeconds: week.totalSeconds || Math.round(fallbackWeek.reduce((sum, day) => sum + day.hours, 0) * 3600),
    streak: streak || 3,
    productivityScore,
    focusQuality,
    weeklyData,
    subjectData,
    heatmapData,
    suggestions: getSuggestions({
      todaySeconds: today.totalSeconds,
      weekSeconds: week.totalSeconds,
      streak,
      subjectData,
      productivityScore,
    }),
    insights: [
      {
        label: 'Best focus window',
        value: bestDay ? bestDay.label : 'Today',
        detail: bestDay ? `${bestDay.hours}h logged` : 'Prime block ready',
        trend: '+12%',
      },
      {
        label: 'Dominant subject',
        value: topSubject?.subject || 'Python',
        detail: `${topSubject?.percentage || 28}% of focus time`,
        trend: 'balanced',
      },
      {
        label: 'Consistency grid',
        value: `${consistencyDays}/28`,
        detail: 'active study days',
        trend: streak > 0 ? `${streak} day streak` : 'restart today',
      },
    ],
    achievements: [
      {
        label: 'Flow Architect',
        value: `${productivityScore}%`,
        detail: 'AI score unlocked',
        trend: 'active',
      },
      {
        label: 'Streak Core',
        value: `${streak || 3}d`,
        detail: 'focus chain',
        trend: 'live',
      },
      {
        label: 'Subject Balance',
        value: `${subjectData.length}`,
        detail: 'tracks monitored',
        trend: 'smart',
      },
    ],
    smartBreak:
      today.totalSeconds > 5400
        ? 'Take a 15-minute reset with water and no screen before the next sprint.'
        : 'After the next focus block, take a 7-minute movement break to preserve energy.',
  };
};

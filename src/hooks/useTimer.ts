import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerSession {
  id: string;
  subject: string;
  startTime: number;
  endTime?: number;
  duration: number;
  date: string;
  laps: { time: number; duration: number }[];
}

export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
  totalSeconds: number;
}

const STORAGE_KEY = 'studypulse_timer';
const SESSIONS_KEY = 'studypulse_sessions';

export const useTimer = (currentSubject: string) => {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<{ time: number; duration: number }[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());

  // Load timer state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTotalSeconds(data.totalSeconds || 0);
        setIsRunning(data.isRunning || false);
        setLaps(data.laps || []);
        setSessionStartTime(data.sessionStartTime || null);
        lastTickRef.current = data.lastTick || Date.now();
        
        // If timer was running, adjust for time passed while app was closed
        if (data.isRunning && data.lastTick) {
          const timePassed = Math.floor((Date.now() - data.lastTick) / 1000);
          setTotalSeconds(prev => prev + timePassed);
        }
      } catch (e) {
        console.error('Failed to load timer state:', e);
      }
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    const data = {
      totalSeconds,
      isRunning,
      laps,
      sessionStartTime,
      lastTick: lastTickRef.current,
      subject: currentSubject,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [totalSeconds, isRunning, laps, sessionStartTime, currentSubject]);

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - lastTickRef.current) / 1000);
        if (elapsed >= 1) {
          setTotalSeconds(prev => prev + elapsed);
          lastTickRef.current = now;
        }
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      if (!sessionStartTime) {
        setSessionStartTime(Date.now());
      }
      lastTickRef.current = Date.now();
    }
  }, [isRunning, sessionStartTime]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    // Save session before resetting if there was any time tracked
    if (totalSeconds > 0 && sessionStartTime) {
      saveSession();
    }
    
    setIsRunning(false);
    setTotalSeconds(0);
    setLaps([]);
    setSessionStartTime(null);
    localStorage.removeItem(STORAGE_KEY);
  }, [totalSeconds, sessionStartTime, currentSubject, laps]);

  const addLap = useCallback(() => {
    const lapTime = Date.now();
    const lapDuration = laps.length > 0 
      ? totalSeconds - laps.reduce((sum, lap) => sum + lap.duration, 0)
      : totalSeconds;
    
    setLaps(prev => [...prev, { time: lapTime, duration: lapDuration }]);
  }, [totalSeconds, laps]);

  const saveSession = useCallback(() => {
    if (!sessionStartTime || totalSeconds === 0) return;

    const sessions = getSessions();
    const newSession: TimerSession = {
      id: `${Date.now()}-${Math.random()}`,
      subject: currentSubject,
      startTime: sessionStartTime,
      endTime: Date.now(),
      duration: totalSeconds,
      date: new Date().toISOString().split('T')[0],
      laps,
    };

    sessions.push(newSession);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }, [sessionStartTime, totalSeconds, currentSubject, laps]);

  const getSessions = useCallback((): TimerSession[] => {
    try {
      const saved = localStorage.getItem(SESSIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load sessions:', e);
      return [];
    }
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    isRunning,
    laps,
    start,
    pause,
    reset,
    addLap,
    getSessions,
  };
};

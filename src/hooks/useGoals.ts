import { useState, useEffect, useCallback } from 'react';

export interface StudyGoals {
  dailyMinutes: number;
  weeklyMinutes: number;
}

const GOALS_KEY = 'studypulse_goals';
const DEFAULT_GOALS: StudyGoals = {
  dailyMinutes: 120, // 2 hours
  weeklyMinutes: 840, // 14 hours (2 hours * 7 days)
};

export const useGoals = () => {
  const [goals, setGoals] = useState<StudyGoals>(DEFAULT_GOALS);

  useEffect(() => {
    const saved = localStorage.getItem(GOALS_KEY);
    if (saved) {
      try {
        const parsedGoals = JSON.parse(saved);
        setGoals(parsedGoals);
      } catch (e) {
        console.error('Failed to load goals:', e);
      }
    }
  }, []);

  const updateGoals = useCallback((newGoals: Partial<StudyGoals>) => {
    setGoals(prev => {
      const updated = { ...prev, ...newGoals };
      localStorage.setItem(GOALS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setGoals(DEFAULT_GOALS);
    localStorage.setItem(GOALS_KEY, JSON.stringify(DEFAULT_GOALS));
  }, []);

  return {
    goals,
    updateGoals,
    resetToDefaults,
  };
};

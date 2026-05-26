import { useState, useEffect, useCallback } from 'react';

export type SubjectColor = 'primary' | 'secondary' | 'pink' | 'yellow' | 'accent' | 'purple' | 'green' | 'orange' | 'red' | 'violet' | 'blue' | 'lightblue';

export interface Subject {
  id: string;
  name: string;
  color: SubjectColor;
}

const SUBJECTS_KEY = 'studypulse_subjects';

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Python', color: 'orange' },
  { id: '2', name: 'Computer Network', color: 'red' },
  { id: '3', name: 'Software Engineering', color: 'purple' },
  { id: '4', name: 'Cloud Computing', color: 'violet' },
  { id: '5', name: 'DBMS', color: 'blue' },
  { id: '6', name: 'Flutter', color: 'lightblue' },
];

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);

  useEffect(() => {
    const saved = localStorage.getItem(SUBJECTS_KEY);
    if (saved) {
      try {
        const parsedSubjects = JSON.parse(saved);
        if (parsedSubjects.length > 0) {
          setSubjects(parsedSubjects);
        }
      } catch (e) {
        console.error('Failed to load subjects:', e);
      }
    }
  }, []);

  const saveSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem(SUBJECTS_KEY, JSON.stringify(newSubjects));
  }, []);

  const addSubject = useCallback((name: string, color: SubjectColor) => {
    const newSubject: Subject = {
      id: `${Date.now()}-${Math.random()}`,
      name,
      color,
    };
    saveSubjects([...subjects, newSubject]);
    return newSubject;
  }, [subjects, saveSubjects]);

  const updateSubject = useCallback((id: string, updates: Partial<Omit<Subject, 'id'>>) => {
    const updatedSubjects = subjects.map(subject =>
      subject.id === id ? { ...subject, ...updates } : subject
    );
    saveSubjects(updatedSubjects);
  }, [subjects, saveSubjects]);

  const removeSubject = useCallback((id: string) => {
    const filteredSubjects = subjects.filter(subject => subject.id !== id);
    saveSubjects(filteredSubjects);
  }, [subjects, saveSubjects]);

  const getSubjectById = useCallback((id: string) => {
    return subjects.find(subject => subject.id === id);
  }, [subjects]);

  const getSubjectByName = useCallback((name: string) => {
    return subjects.find(subject => subject.name === name);
  }, [subjects]);

  return {
    subjects,
    addSubject,
    updateSubject,
    removeSubject,
    getSubjectById,
    getSubjectByName,
  };
};

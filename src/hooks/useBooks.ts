import { useState, useEffect } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverColor: string;
  status: 'reading' | 'completed' | 'planned';
  startDate?: string;
  endDate?: string;
}

export interface ReadingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: 'pages' | 'books' | 'minutes';
}

const STORAGE_KEY = 'studypulse_books';
const GOALS_STORAGE_KEY = 'studypulse_reading_goals';

const DEFAULT_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    totalPages: 464,
    currentPage: 127,
    coverColor: 'blue',
    status: 'reading',
    startDate: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    totalPages: 352,
    currentPage: 0,
    coverColor: 'purple',
    status: 'planned',
  },
];

const DEFAULT_GOALS: ReadingGoal[] = [
  { id: '1', type: 'daily', target: 50, current: 0, unit: 'pages' },
  { id: '2', type: 'weekly', target: 2, current: 0, unit: 'books' },
  { id: '3', type: 'monthly', target: 1200, current: 0, unit: 'minutes' },
];

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_BOOKS;
  });

  const [goals, setGoals] = useState<ReadingGoal[]>(() => {
    const stored = localStorage.getItem(GOALS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_GOALS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: Date.now().toString() };
    setBooks([...books, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const removeBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const updateGoal = (id: string, current: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, current } : goal
    ));
  };

  return {
    books,
    goals,
    addBook,
    updateBook,
    removeBook,
    updateGoal,
  };
};

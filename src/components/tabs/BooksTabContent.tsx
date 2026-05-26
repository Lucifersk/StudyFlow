import { BookOpen, Plus, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBooks } from '@/hooks/useBooks';
import { toast } from 'sonner';

const colorMap: Record<string, string> = {
  orange: 'hsl(var(--subject-orange))',
  red: 'hsl(var(--subject-red))',
  purple: 'hsl(var(--subject-purple))',
  violet: 'hsl(var(--subject-violet))',
  blue: 'hsl(var(--subject-blue))',
  lightblue: 'hsl(var(--subject-lightblue))',
  green: 'hsl(var(--subject-green))',
};

export const BooksTabContent = () => {
  const { books, goals } = useBooks();
  const currentReading = books.filter((book) => book.status === 'reading');
  const plannedBooks = books.filter((book) => book.status === 'planned');
  const completedBooks = books.filter((book) => book.status === 'completed');

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="section-label">Library</p>
          <h2 className="text-xl font-semibold text-white">Reading tracker</h2>
        </div>
        <Button size="sm" onClick={() => toast.info('Add book feature coming soon!')}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <ScrollArea className="h-[520px] pr-3 lg:h-[calc(100vh-370px)]">
        <div className="space-y-5">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-sky-200" />
              <h3 className="font-semibold text-white">Reading goals</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {goals.map((goal) => (
                <div key={goal.id} className="surface-card p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 font-medium capitalize text-white">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {goal.type}
                    </span>
                    <span className="text-sm text-slate-400">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </section>

          {currentReading.length > 0 && (
            <section>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-sky-200" />
                <h3 className="font-semibold text-white">Currently reading</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {currentReading.map((book) => (
                  <article key={book.id} className="surface-card p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-20 w-14 shrink-0 items-center justify-center rounded-lg shadow-soft"
                        style={{ backgroundColor: colorMap[book.coverColor] || colorMap.blue }}
                      >
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-semibold text-white">{book.title}</h4>
                        <p className="mb-3 text-sm text-slate-400">{book.author}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              Page {book.currentPage} of {book.totalPages}
                            </span>
                            <span className="font-medium text-sky-100">
                              {Math.round((book.currentPage / book.totalPages) * 100)}%
                            </span>
                          </div>
                          <Progress value={(book.currentPage / book.totalPages) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-3 font-semibold text-white">Planned next</h3>
            <div className="space-y-3">
              {plannedBooks.map((book) => (
                <article key={book.id} className="surface-card p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-14 w-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: colorMap[book.coverColor] || colorMap.purple }}
                    >
                      <BookOpen className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-medium text-white">{book.title}</h4>
                      <p className="truncate text-xs text-slate-500">
                        {book.author} · {book.totalPages} pages
                      </p>
                    </div>
                  </div>
                </article>
              ))}
              {plannedBooks.length === 0 && <div className="empty-state">No planned books yet.</div>}
            </div>
          </section>

          {completedBooks.length > 0 && (
            <section>
              <h3 className="mb-3 font-semibold text-white">Completed</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {completedBooks.map((book) => (
                  <article key={book.id} className="surface-card p-3">
                    <div
                      className="mb-2 flex h-20 items-center justify-center rounded-lg"
                      style={{ backgroundColor: colorMap[book.coverColor] || colorMap.green }}
                    >
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="truncate text-sm font-medium text-white">{book.title}</h4>
                    <p className="truncate text-xs text-slate-500">{book.author}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

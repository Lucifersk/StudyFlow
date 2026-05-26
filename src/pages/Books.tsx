import { BookOpen, Library, Plus, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';
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

const Books = () => {
  const { books, goals } = useBooks();
  const currentReading = books.filter((book) => book.status === 'reading');
  const plannedBooks = books.filter((book) => book.status === 'planned');
  const completedBooks = books.filter((book) => book.status === 'completed');

  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-6xl">
        <PageHeader
          icon={Library}
          eyebrow="StudyFlow library"
          title="Reading intelligence"
          description="Track books, progress, and reading goals inside the same premium study workspace."
          actions={
            <Button size="sm" onClick={() => toast.info('Add book feature coming soon!')}>
              <Plus className="h-4 w-4" />
              Add book
            </Button>
          }
        />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {currentReading.length > 0 && (
              <GlassPanel className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="section-label">Currently reading</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{currentReading.length} active books</h2>
                  </div>
                  <BookOpen className="h-5 w-5 text-sky-200" />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {currentReading.map((book) => (
                    <article key={book.id} className="surface-card p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-24 w-16 shrink-0 items-center justify-center rounded-lg shadow-soft"
                          style={{ backgroundColor: colorMap[book.coverColor] || colorMap.blue }}
                        >
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-white">{book.title}</h3>
                          <p className="mt-1 text-sm text-slate-400">{book.author}</p>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">
                                Page {book.currentPage} of {book.totalPages}
                              </span>
                              <span className="font-medium text-sky-100">
                                {Math.round((book.currentPage / book.totalPages) * 100)}%
                              </span>
                            </div>
                            <Progress value={(book.currentPage / book.totalPages) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </GlassPanel>
            )}

            <GlassPanel className="p-5">
              <div className="mb-5">
                <p className="section-label">Reading queue</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Planned next</h2>
              </div>
              <ScrollArea className="max-h-[480px] pr-3">
                <div className="space-y-3">
                  {plannedBooks.map((book) => (
                    <article key={book.id} className="surface-card p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: colorMap[book.coverColor] || colorMap.purple }}
                        >
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-medium text-white">{book.title}</h3>
                          <p className="text-sm text-slate-400">{book.author}</p>
                          <p className="mt-1 text-xs text-slate-500">{book.totalPages} pages</p>
                        </div>
                      </div>
                    </article>
                  ))}
                  {plannedBooks.length === 0 && <div className="empty-state">No planned books yet.</div>}
                </div>
              </ScrollArea>
            </GlassPanel>
          </div>

          <aside className="space-y-4">
            <GlassPanel className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="metric-icon border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="section-label">Goals</p>
                  <h2 className="text-lg font-semibold text-white">Reading targets</h2>
                </div>
              </div>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 font-medium capitalize text-white">
                        <TrendingUp className="h-4 w-4 text-sky-200" />
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
            </GlassPanel>

            <GlassPanel className="p-5">
              <p className="section-label">Completed</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{completedBooks.length} books archived</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {completedBooks.map((book) => (
                  <article key={book.id} className="surface-card p-3">
                    <div
                      className="mb-3 flex h-24 items-center justify-center rounded-lg"
                      style={{ backgroundColor: colorMap[book.coverColor] || colorMap.green }}
                    >
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="truncate text-sm font-medium text-white">{book.title}</h3>
                    <p className="truncate text-xs text-slate-500">{book.author}</p>
                  </article>
                ))}
                {completedBooks.length === 0 && <div className="empty-state col-span-2">Completed books will appear here.</div>}
              </div>
            </GlassPanel>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Books;

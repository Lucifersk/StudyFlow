import { Crown, TrendingUp } from 'lucide-react';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';

const weeklyRankings = [
  { rank: 1, name: 'Sarah Kim', hours: 52, avatar: '' },
  { rank: 2, name: 'Michael Chen', hours: 48, avatar: '' },
  { rank: 3, name: 'Emma Wilson', hours: 45, avatar: '' },
  { rank: 4, name: 'You', hours: 42, avatar: '', isCurrentUser: true },
  { rank: 5, name: 'David Park', hours: 39, avatar: '' },
  { rank: 6, name: 'Lisa Johnson', hours: 36, avatar: '' },
];

const monthlyRankings = [
  { rank: 1, name: 'Sarah Kim', hours: 198, avatar: '' },
  { rank: 2, name: 'You', hours: 185, avatar: '', isCurrentUser: true },
  { rank: 3, name: 'Michael Chen', hours: 182, avatar: '' },
  { rank: 4, name: 'Emma Wilson', hours: 175, avatar: '' },
  { rank: 5, name: 'David Park', hours: 168, avatar: '' },
];

const Ranking = () => {
  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-5xl">
        <PageHeader
          icon={Crown}
          eyebrow="StudyFlow ranking"
          title="Leaderboard"
          description="A premium competitive layer that rewards consistency, time, and weekly momentum."
        />

        <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <GlassPanel className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="section-label">Your rank this week</p>
                <p className="mt-2 text-6xl font-semibold text-white">#4</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-amber-300/20 bg-amber-300/10 text-amber-100">
                <Crown className="h-8 w-8" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
              <TrendingUp className="h-4 w-4" />
              Up 2 places from last week
            </div>
            <div className="mt-5 space-y-3">
              <div className="skeleton-line h-2 w-full" />
              <div className="skeleton-line h-2 w-3/4" />
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <Tabs defaultValue="weekly" className="space-y-4">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg border border-white/10 bg-slate-950/60 p-1">
                <TabsTrigger value="weekly" className="rounded-md py-3 data-[state=active]:bg-sky-400/15 data-[state=active]:text-sky-100">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="rounded-md py-3 data-[state=active]:bg-sky-400/15 data-[state=active]:text-sky-100">
                  Monthly
                </TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-3">
                {weeklyRankings.map((user) => (
                  <LeaderboardItem key={user.rank} {...user} />
                ))}
              </TabsContent>

              <TabsContent value="monthly" className="space-y-3">
                {monthlyRankings.map((user) => (
                  <LeaderboardItem key={user.rank} {...user} />
                ))}
              </TabsContent>
            </Tabs>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};

export default Ranking;

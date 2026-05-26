import { Clock, Globe, Lock, Plus, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';

const studyRooms = [
  {
    id: 1,
    name: 'AP Calculus Study Group',
    members: 8,
    maxMembers: 12,
    duration: '2h 15m',
    isPrivate: false,
    avatars: ['A', 'B', 'C'],
    subject: 'Mathematics',
  },
  {
    id: 2,
    name: 'Chemistry Final Prep',
    members: 5,
    maxMembers: 8,
    duration: '1h 45m',
    isPrivate: true,
    avatars: ['D', 'E'],
    subject: 'Chemistry',
  },
  {
    id: 3,
    name: 'SAT Practice Session',
    members: 15,
    maxMembers: 20,
    duration: '3h 30m',
    isPrivate: false,
    avatars: ['F', 'G', 'H'],
    subject: 'Test Prep',
  },
  {
    id: 4,
    name: 'Physics Problem Solving',
    members: 6,
    maxMembers: 10,
    duration: '1h 20m',
    isPrivate: false,
    avatars: ['I', 'J'],
    subject: 'Physics',
  },
];

const Group = () => {
  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-5xl">
        <PageHeader
          icon={Users}
          eyebrow="StudyFlow rooms"
          title="Collaborative focus"
          description="Join focused rooms with live study presence and clean accountability signals."
          actions={
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Create room
            </Button>
          }
        />

        <section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <GlassPanel className="p-5">
            <div className="metric-icon mb-4 border-sky-300/20 bg-sky-300/10 text-sky-100">
              <Users className="h-4 w-4" />
            </div>
            <p className="section-label">Room launcher</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">Start a private study room</h2>
            <p className="mt-3 text-sm text-slate-400">
              Invite classmates, set a subject, and keep everyone’s timer aligned.
            </p>
            <Button className="mt-5 w-full">Create room</Button>
          </GlassPanel>

          <GlassPanel className="p-5">
            <div className="mb-5">
              <p className="section-label">Active rooms</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{studyRooms.length} live rooms</h2>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {studyRooms.map((room) => (
                <article key={room.id} className="surface-card p-5">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="truncate font-semibold text-white">{room.name}</h3>
                        {room.isPrivate ? <Lock className="h-4 w-4 text-slate-500" /> : <Globe className="h-4 w-4 text-sky-200" />}
                      </div>
                      <p className="text-sm text-slate-400">{room.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {room.members}/{room.maxMembers}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {room.duration}
                      </span>
                    </div>

                    <div className="flex -space-x-2">
                      {room.avatars.map((avatar, index) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-slate-950">
                          <AvatarFallback className="bg-gradient-primary text-xs text-primary-foreground">{avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};

export default Group;

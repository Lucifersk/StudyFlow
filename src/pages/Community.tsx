import { Heart, MessageCircle, Share2, UsersRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';

const posts = [
  {
    id: 1,
    author: 'Sarah Kim',
    avatar: '',
    time: '2h ago',
    content: 'Completed a six-hour calculus sprint and finally made derivatives feel predictable.',
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: 'Michael Chen',
    avatar: '',
    time: '4h ago',
    content: 'My best focus block today was 45 minutes with a 10-minute reset. Much cleaner than forcing long sessions.',
    likes: 42,
    comments: 12,
  },
  {
    id: 3,
    author: 'Emma Wilson',
    avatar: '',
    time: '5h ago',
    content: 'Finals prep is better with a short recap after every session. The restart tomorrow gets easier.',
    likes: 38,
    comments: 18,
  },
  {
    id: 4,
    author: 'David Park',
    avatar: '',
    time: '8h ago',
    content: 'Reached a 30-day study streak today. Consistency is doing the heavy lifting.',
    likes: 56,
    comments: 9,
  },
];

const Community = () => {
  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-4xl">
        <PageHeader
          icon={UsersRound}
          eyebrow="StudyFlow social"
          title="Focus community"
          description="A cleaner social layer for accountability, progress updates, and study momentum."
        />

        <GlassPanel className="mb-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">Y</AvatarFallback>
            </Avatar>
            <Button variant="outline" className="h-12 flex-1 justify-start text-slate-400">
              Share today’s progress
            </Button>
          </div>
        </GlassPanel>

        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="surface-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white">{post.author}</h4>
                  <p className="text-sm text-slate-500">{post.time}</p>
                </div>
                <span className="rounded-md border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-xs font-medium text-sky-100">
                  Focus update
                </span>
              </div>

              <p className="mb-5 leading-relaxed text-slate-200">{post.content}</p>

              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <button className="icon-button flex items-center gap-2 px-3 py-2 text-sm">
                  <Heart className="h-4 w-4" />
                  {post.likes}
                </button>
                <button className="icon-button flex items-center gap-2 px-3 py-2 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
                </button>
                <button className="icon-button ml-auto flex items-center gap-2 px-3 py-2 text-sm">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;

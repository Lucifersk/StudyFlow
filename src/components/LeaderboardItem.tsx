import { Trophy, Medal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  avatar?: string;
  hours: number;
  isCurrentUser?: boolean;
}

export const LeaderboardItem = ({ rank, name, avatar, hours, isCurrentUser }: LeaderboardItemProps) => {
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-accent-yellow" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-accent-pink" />;
    return null;
  };

  return (
    <div className={`surface-card p-4 ${isCurrentUser ? 'border-sky-300/40 ring-2 ring-sky-300/15' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] font-bold text-white">
          {getRankIcon() || rank}
        </div>
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="truncate font-semibold text-white">{name}</h4>
          <p className="text-sm text-slate-400">{hours} hours</p>
        </div>
        {isCurrentUser && (
          <span className="rounded-md bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            You
          </span>
        )}
      </div>
    </div>
  );
};

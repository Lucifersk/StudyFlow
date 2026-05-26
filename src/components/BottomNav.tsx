import { BarChart3, Brain, Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';

const navItems = [
  { to: '/', icon: Clock, label: 'Focus' },
  { to: '/planner', icon: Calendar, label: 'Planner' },
  { to: '/stats', icon: BarChart3, label: 'Analytics' },
  { to: '/insights', icon: Brain, label: 'AI' },
  { to: '/community', icon: MessageSquare, label: 'Social' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto grid max-w-4xl grid-cols-6 gap-1 px-3 py-3 sm:px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className="flex min-w-0 flex-col items-center gap-1.5 rounded-lg p-2 text-slate-500 transition-all hover:bg-white/10 hover:text-slate-200"
            activeClassName="text-sky-100 bg-sky-400/15 shadow-[0_0_20px_rgba(56,189,248,0.12)]"
          >
            <item.icon className="h-5 w-5 stroke-[1.7]" />
            <span className="truncate text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

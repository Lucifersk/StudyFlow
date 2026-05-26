import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Camera, ChevronRight, HelpCircle, LogOut, Moon, Settings, Shield, UserRound, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GlassPanel } from '@/components/studyflow/GlassPanel';
import { PageHeader } from '@/components/studyflow/PageHeader';
import { useTimer } from '@/hooks/useTimer';
import { formatCompactDuration, getStudyFlowMetrics } from '@/lib/studyflowMetrics';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

const NOTIFICATIONS_KEY = 'studypulse-notifications-enabled';
const PROFILE_KEY = 'studypulse-profile';

interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
}

const settingsSections = [
  {
    title: 'Account',
    items: [
      { icon: Settings, label: 'Edit Profile', hasSwitch: false },
      { icon: Bell, label: 'Notifications', hasSwitch: true },
      { icon: Moon, label: 'Dark Mode', hasSwitch: true },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [{ icon: Shield, label: 'Privacy Settings', hasSwitch: false }],
  },
  {
    title: 'Support',
    items: [{ icon: HelpCircle, label: 'Help & Support', hasSwitch: false }],
  },
];

const Profile = () => {
  const { theme, setTheme } = useTheme();
  const { getSessions } = useTimer('');
  const isDarkMode = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const metrics = useMemo(() => getStudyFlowMetrics(getSessions()), [getSessions]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : { name: 'Your Name', email: 'youremail@example.com' };
  });
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatar, setEditAvatar] = useState<string | undefined>(profile.avatar);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  const handleToggle = (label: string, checked: boolean) => {
    if (label === 'Dark Mode') {
      setTheme(checked ? 'dark' : 'light');
    } else if (label === 'Notifications') {
      setNotificationsEnabled(checked);
    }
  };

  const handleSettingClick = (label: string) => {
    if (label === 'Edit Profile') {
      setEditName(profile.name);
      setEditEmail(profile.email);
      setEditAvatar(profile.avatar);
      setEditDialogOpen(true);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setEditAvatar(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newProfile = { name: editName.trim(), email: editEmail.trim(), avatar: editAvatar };
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
    setEditDialogOpen(false);
    toast.success('Profile updated');
  };

  return (
    <div className="app-shell bg-background">
      <div className="page-content max-w-5xl">
        <PageHeader
          icon={UserRound}
          eyebrow="StudyFlow identity"
          title="Profile command center"
          description="Personal settings, profile details, and focus identity in one polished workspace."
        />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
          <GlassPanel className="p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border-4 border-white/10 shadow-[0_0_40px_rgba(56,189,248,0.16)]">
                <AvatarImage src={profile.avatar || ''} />
                <AvatarFallback className="bg-gradient-primary text-4xl text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="section-label">Student profile</p>
                <h2 className="mt-1 truncate text-3xl font-semibold text-white">{profile.name}</h2>
                <p className="mt-2 truncate text-slate-400">{profile.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-md border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-sm text-sky-100">
                    AI score {metrics.productivityScore}%
                  </span>
                  <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-sm text-emerald-100">
                    {metrics.streak} day streak
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-white">{formatCompactDuration(metrics.weekSeconds)}</p>
                <p className="mt-1 text-sm text-slate-500">This week</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-white">{metrics.streak}</p>
                <p className="mt-1 text-sm text-slate-500">Streak</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-2xl font-semibold text-white">#{metrics.productivityScore > 80 ? 2 : 4}</p>
                <p className="mt-1 text-sm text-slate-500">Rank</p>
              </div>
            </div>
          </GlassPanel>

          <div className="space-y-4">
            {settingsSections.map((section) => (
              <GlassPanel key={section.title} className="p-4">
                <h3 className="section-label mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => !item.hasSwitch && handleSettingClick(item.label)}
                      className="surface-card flex w-full items-center justify-between p-4 text-left"
                    >
                      <span className="flex items-center gap-3">
                        <span className="metric-icon border-white/10 bg-white/[0.04] text-sky-100">
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-white">{item.label}</span>
                      </span>
                      {item.hasSwitch ? (
                        <Switch
                          checked={item.label === 'Dark Mode' ? isDarkMode : item.label === 'Notifications' ? notificationsEnabled : false}
                          onCheckedChange={(checked) => handleToggle(item.label, checked)}
                        />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-500" />
                      )}
                    </button>
                  ))}
                </div>
              </GlassPanel>
            ))}

            <button className="surface-card flex w-full items-center justify-center gap-3 p-4 font-medium text-red-300 hover:border-red-300/30 hover:bg-red-400/10">
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </section>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-white/10">
                  <AvatarImage src={editAvatar || ''} />
                  <AvatarFallback className="bg-muted text-2xl">{editName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                </button>
                {editAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-lg bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </div>
              <p className="text-xs text-slate-500">Upload max 2MB</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Enter your email" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

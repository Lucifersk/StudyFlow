import { useState, useEffect } from 'react';
import { Settings, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { StudyGoals } from '@/hooks/useGoals';

interface GoalSettingsDialogProps {
  goals: StudyGoals;
  onUpdate: (goals: Partial<StudyGoals>) => void;
  onReset: () => void;
}

export const GoalSettingsDialog = ({ goals, onUpdate, onReset }: GoalSettingsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [dailyHours, setDailyHours] = useState(0);
  const [dailyMinutes, setDailyMinutes] = useState(0);
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);

  useEffect(() => {
    if (open) {
      setDailyHours(Math.floor(goals.dailyMinutes / 60));
      setDailyMinutes(goals.dailyMinutes % 60);
      setWeeklyHours(Math.floor(goals.weeklyMinutes / 60));
      setWeeklyMinutes(goals.weeklyMinutes % 60);
    }
  }, [open, goals]);

  const handleSave = () => {
    const newDailyMinutes = dailyHours * 60 + dailyMinutes;
    const newWeeklyMinutes = weeklyHours * 60 + weeklyMinutes;

    if (newDailyMinutes <= 0 || newWeeklyMinutes <= 0) {
      toast.error('Goals must be greater than 0');
      return;
    }

    if (newDailyMinutes > 1440) {
      toast.error('Daily goal cannot exceed 24 hours');
      return;
    }

    if (newWeeklyMinutes > 10080) {
      toast.error('Weekly goal cannot exceed 168 hours');
      return;
    }

    onUpdate({
      dailyMinutes: newDailyMinutes,
      weeklyMinutes: newWeeklyMinutes,
    });

    toast.success('Goals updated');
    setOpen(false);
  };

  const handleReset = () => {
    onReset();
    toast.success('Goals reset to defaults');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-lg">
          <Settings className="w-4 h-4" />
          Set Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Study Goals
          </DialogTitle>
          <DialogDescription>
            Set your daily and weekly study time goals
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Daily Goal */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Daily Goal</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="daily-hours" className="text-sm text-muted-foreground">
                  Hours
                </Label>
                <Input
                  id="daily-hours"
                  type="number"
                  min="0"
                  max="24"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daily-minutes" className="text-sm text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="daily-minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Weekly Goal</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="weekly-hours" className="text-sm text-muted-foreground">
                  Hours
                </Label>
                <Input
                  id="weekly-hours"
                  type="number"
                  min="0"
                  max="168"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly-minutes" className="text-sm text-muted-foreground">
                  Minutes
                </Label>
                <Input
                  id="weekly-minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={weeklyMinutes}
                  onChange={(e) => setWeeklyMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Goals
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

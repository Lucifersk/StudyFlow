import { SubjectListItem } from '@/components/SubjectListItem';
import { SubjectManager } from '@/components/SubjectManager';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Edit, CheckSquare, Trophy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Subject, SubjectColor } from '@/hooks/useSubjects';

interface TimerTabContentProps {
  subjects: Subject[];
  activeSubjectIndex: number;
  isRunning: boolean;
  onPlayPause: (index: number) => void;
  onAddSubject: (name: string, color: SubjectColor) => void;
  onUpdateSubject: (id: string, updates: { name?: string; color?: SubjectColor }) => void;
  onRemoveSubject: (id: string) => void;
  getSubjectTime: (subjectName: string) => number;
}

export const TimerTabContent = ({
  subjects,
  activeSubjectIndex,
  isRunning,
  onPlayPause,
  onAddSubject,
  onUpdateSubject,
  onRemoveSubject,
  getSubjectTime,
}: TimerTabContentProps) => {
  const [isManageOpen, setIsManageOpen] = useState(false);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase text-sky-200/80">Focus tracks</p>
          <h2 className="text-xl font-semibold text-white">Choose your study stream</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="hidden rounded-lg border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10 sm:inline-flex"
          onClick={() => setIsManageOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Manage
        </Button>
      </div>

      <div className="mb-6 space-y-3">
        {subjects.map((subject, index) => (
          <SubjectListItem
            key={subject.id}
            name={subject.name}
            color={subject.color}
            timeSpent={getSubjectTime(subject.name)}
            isActive={activeSubjectIndex === index}
            isRunning={isRunning && activeSubjectIndex === index}
            onPlayPause={() => onPlayPause(index)}
            onEdit={() => setIsManageOpen(true)}
            onDelete={() => {
              if (subjects.length > 1) {
                onRemoveSubject(subject.id);
                toast.success('Subject removed');
              } else {
                toast.error('You must have at least one subject');
              }
            }}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
          onClick={() => setIsManageOpen(true)}
        >
          <Edit className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
          onClick={() => toast.info('To-Do feature coming soon!')}
        >
          <CheckSquare className="w-4 h-4" />
          To-Do
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-lg border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/10"
          onClick={() => toast.info('Challenge feature coming soon!')}
        >
          <Trophy className="w-4 h-4" />
          Challenge
        </Button>
      </div>

      <Sheet open={isManageOpen} onOpenChange={setIsManageOpen}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto border-white/10 bg-slate-950 text-white">
          <SheetHeader>
            <SheetTitle>Manage Subjects</SheetTitle>
            <SheetDescription>
              Add, edit, or remove your study subjects
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <SubjectManager
              subjects={subjects}
              onAdd={onAddSubject}
              onUpdate={(id, name, color) => onUpdateSubject(id, { name, color })}
              onRemove={onRemoveSubject}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

import { useState } from 'react';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Subject, SubjectColor } from '@/hooks/useSubjects';
import { SubjectTag } from './SubjectTag';

interface SubjectManagerProps {
  subjects: Subject[];
  onAdd: (name: string, color: SubjectColor) => void;
  onUpdate: (id: string, name: string, color: SubjectColor) => void;
  onRemove: (id: string) => void;
}

const AVAILABLE_COLORS: { value: SubjectColor; label: string }[] = [
  { value: 'orange', label: 'Orange' },
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'violet', label: 'Violet' },
  { value: 'blue', label: 'Blue' },
  { value: 'lightblue', label: 'Light Blue' },
  { value: 'green', label: 'Green' },
  { value: 'primary', label: 'Primary' },
];

const COLOR_VALUES: Record<SubjectColor, string> = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  pink: 'hsl(var(--accent-pink))',
  yellow: 'hsl(var(--accent-yellow))',
  accent: 'hsl(var(--accent))',
  purple: 'hsl(var(--subject-purple))',
  green: 'hsl(var(--subject-green))',
  orange: 'hsl(var(--subject-orange))',
  red: 'hsl(var(--subject-red))',
  violet: 'hsl(var(--subject-violet))',
  blue: 'hsl(var(--subject-blue))',
  lightblue: 'hsl(var(--subject-lightblue))',
};

export const SubjectManager = ({ subjects, onAdd, onUpdate, onRemove }: SubjectManagerProps) => {
  const [open, setOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState<SubjectColor>('primary');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setSubjectName(subject.name);
      setSelectedColor(subject.color);
    } else {
      setEditingSubject(null);
      setSubjectName('');
      setSelectedColor('primary');
    }
    setOpen(true);
  };

  const handleSave = () => {
    if (!subjectName.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    if (editingSubject) {
      onUpdate(editingSubject.id, subjectName.trim(), selectedColor);
      toast.success('Subject updated');
    } else {
      onAdd(subjectName.trim(), selectedColor);
      toast.success('Subject added');
    }

    setOpen(false);
    setEditingSubject(null);
    setSubjectName('');
    setSelectedColor('primary');
  };

  const handleDeleteClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      onRemove(subjectToDelete.id);
      toast.success('Subject removed');
      setDeleteDialogOpen(false);
      setSubjectToDelete(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg"
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </DialogTrigger>
        <DialogContent className="border-white/10 bg-slate-950 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </DialogTitle>
            <DialogDescription>
              {editingSubject ? 'Update subject details' : 'Create a new subject to track'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Physics, Art, Music"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="space-y-3">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {AVAILABLE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedColor === color.value
                        ? 'scale-105 border-sky-300 bg-sky-300/10'
                        : 'border-white/10 bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{
                          background: COLOR_VALUES[color.value],
                        }}
                      />
                      <span className="text-xs text-slate-400">{color.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <SubjectTag name={subjectName || 'Preview'} color={selectedColor} active />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              {editingSubject ? 'Update' : 'Add'} Subject
            </Button>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subject List with Edit/Delete */}
      {subjects.length > 0 && (
        <div className="mt-4 space-y-2">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="surface-card flex items-center justify-between p-3"
            >
              <SubjectTag name={subject.name} color={subject.color} />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenDialog(subject)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(subject)}
                  disabled={subjects.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-white/10 bg-slate-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subjectToDelete?.name}"? This action cannot be
              undone. Past study sessions will remain in your history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

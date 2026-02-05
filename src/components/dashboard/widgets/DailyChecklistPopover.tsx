import { useState } from "react";
import { format, getDay } from "date-fns";
import { Check, PenLine } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCreateNote } from "@/hooks/useNotes";
import { toast } from "sonner";
import {
  STANDARD_TASKS,
  TASK_TO_DOMAIN,
  formattedIdToLabel,
  getTaskIcon,
  TaskDefinition
} from "@/lib/constants";
import { TaskJournalDialog } from "./TaskJournalDialog";

interface DailyChecklistPopoverProps {
  date: Date;
  children: React.ReactNode;
  completedTasks: Record<string, string[]>; // dateKey -> taskIds[]
  allTasks?: Record<string, string[]>; // dateKey -> taskIds[] (including pending)
  onToggleTask: (dateKey: string, taskId: string) => void;
}

export function DailyChecklistPopover({
  date,
  children,
  completedTasks,
  allTasks,
  onToggleTask,
}: DailyChecklistPopoverProps) {
  const [open, setOpen] = useState(false);
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDefinition | null>(null);
  const navigate = useNavigate();
  const createNote = useCreateNote();
  const dateKey = format(date, "yyyy-MM-dd");
  const dayOfWeek = getDay(date);
  const completedForDate = completedTasks[dateKey] || [];
  const allTasksForDate = allTasks?.[dateKey] || [];

  // Filter tasks that apply to this day
  const standardTasksForDay = STANDARD_TASKS.filter((task) => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek) {
      return task.daysOfWeek.includes(dayOfWeek);
    }
    return false;
  });

  // Identify custom tasks (Tasks in all tasks list but not in standard list)
  const customTasksForDay: TaskDefinition[] = allTasksForDate
    .filter(id => !STANDARD_TASKS.some(t => t.id === id))
    .map(id => ({
      id,
      label: formattedIdToLabel(id),
      icon: getTaskIcon(id),
      frequency: "daily"
    }));

  const allTasks = [...standardTasksForDay, ...customTasksForDay];

  const allCompleted =
    allTasks.length > 0 && allTasks.every((t) => completedForDate.includes(t.id));

  const handleTaskClick = (task: TaskDefinition) => {
    const isCompleted = completedForDate.includes(task.id);

    if (allCompleted) {
      // Read-only mode: navigate to notes
      navigate("/notes");
    } else if (!isCompleted) {
      // Completing a task → show journal dialog
      setSelectedTask(task);
      setJournalDialogOpen(true);
    } else {
      // Uncompleting a task → direct toggle
      onToggleTask(dateKey, task.id);
    }
  };

  const handleCompleteTask = () => {
    if (selectedTask) {
      onToggleTask(dateKey, selectedTask.id);
      setSelectedTask(null);
    }
  };

  const handleCompleteWithJournal = async (reflection: string) => {
    if (!selectedTask) return;

    // Complete the task
    onToggleTask(dateKey, selectedTask.id);

    // Create journal entry (use 'general' as default domain for custom tasks)
    const domain = TASK_TO_DOMAIN[selectedTask.id] || "general";
    if (reflection.trim()) {
      try {
        await createNote.mutateAsync({
          title: `${format(date, "MMM d")} - ${selectedTask.label}`,
          domain,
          note_type: "journal",
          content: {
            type: "doc",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: reflection }],
              },
            ],
          },
        });
        toast.success("Task completed with journal entry!");
      } catch {
        toast.error("Failed to create journal entry");
      }
    }

    setSelectedTask(null);
  };

  const handleQuickJournal = async (task: TaskDefinition) => {
    const domain = TASK_TO_DOMAIN[task.id];
    if (!domain) return;

    try {
      const note = await createNote.mutateAsync({
        title: `${format(date, "MMM d")} - ${task.label}`,
        domain,
        note_type: "journal",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: `Journal entry for ${task.label} on ${format(date, "EEEE, MMMM d, yyyy")}`,
                },
              ],
            },
          ],
        },
      });

      toast.success("Journal entry created");
      setOpen(false);
      navigate("/notes", { state: { domain, noteId: note.id } });
    } catch {
      toast.error("Failed to create journal entry");
    }
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="w-64 p-0 bg-card/95 backdrop-blur-md border-border/50"
          align="start"
          sideOffset={8}
        >
          <div className="p-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">{format(date, "EEEE, MMM d")}</h4>
              {allCompleted && allTasks.length > 0 && (
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Complete
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Daily checklist</p>
          </div>

          <div className="p-2 space-y-1">
            <AnimatePresence>
              {allTasks.map((task, index) => {
                const isCompleted = completedForDate.includes(task.id);
                const Icon = task.icon;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-1"
                  >
                    <button
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "flex-1 flex items-center gap-3 p-2.5 rounded-lg transition-all text-left",
                        isCompleted ? "bg-emerald-500/10 text-emerald-600" : "hover:bg-muted",
                        allCompleted && "cursor-pointer"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {isCompleted && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isCompleted ? "text-emerald-500" : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm flex-1",
                          isCompleted && "line-through opacity-70"
                        )}
                      >
                        {task.label}
                      </span>
                      {task.frequency === "weekly" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          5x/wk
                        </span>
                      )}
                    </button>

                    {/* Quick Journal button */}
                    {isCompleted && TASK_TO_DOMAIN[task.id] && (
                      <button
                        onClick={() => handleQuickJournal(task)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        title="Add journal entry"
                      >
                        <PenLine className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {allTasks.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tasks scheduled
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Journal Dialog */}
      <TaskJournalDialog
        open={journalDialogOpen}
        onOpenChange={setJournalDialogOpen}
        taskLabel={selectedTask?.label || ""}
        date={date}
        onComplete={handleCompleteTask}
        onCompleteWithJournal={handleCompleteWithJournal}
      />
    </>
  );
}

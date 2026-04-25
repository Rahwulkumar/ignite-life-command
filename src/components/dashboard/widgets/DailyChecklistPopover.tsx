import { useState } from "react";
import { format, getDay } from "date-fns";
import { Check, PenLine, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCreateNote } from "@/hooks/useNotes";
import { useAddPendingTask } from "@/hooks/useChecklistEntries";
import { toast } from "sonner";
import {
  STANDARD_TASKS,
  TASK_TO_DOMAIN,
  formattedIdToLabel,
  getTaskIcon,
  TaskDefinition,
} from "@/lib/constants";
import { TaskJournalDialog } from "./TaskJournalDialog";
import { MetricsData } from "@/types/domain";

interface DailyChecklistPopoverProps {
  date: Date;
  children: React.ReactNode;
  completedTasks: Record<string, string[]>;
  allTasks?: Record<string, string[]>;
  onToggleTask: (
    dateKey: string,
    taskId: string,
    metricsData?: MetricsData,
  ) => void;
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
  const [showAddSection, setShowAddSection] = useState(false);
  const [customTask, setCustomTask] = useState("");

  const navigate = useNavigate();
  const createNote = useCreateNote();
  const addPendingTask = useAddPendingTask();

  const dateKey = format(date, "yyyy-MM-dd");
  const dayOfWeek = getDay(date);
  const completedForDate = completedTasks[dateKey] || [];
  const allTasksForDate = allTasks?.[dateKey] || [];
  const standardTasksById = new Map(STANDARD_TASKS.map((task) => [task.id, task]));

  // Filter tasks that apply to this day
  const standardTasksForDay = STANDARD_TASKS.filter((task) => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek) {
      return task.daysOfWeek.includes(dayOfWeek);
    }
    return false;
  });
  const standardTaskIdsForDay = new Set(standardTasksForDay.map((task) => task.id));

  // Standard tasks can also be added manually on off-days, for example gym on a weekend.
  const manuallyAddedStandardTasks = allTasksForDate
    .filter((id) => !standardTaskIdsForDay.has(id))
    .map((id) => standardTasksById.get(id))
    .filter((task): task is TaskDefinition => Boolean(task));

  // Identify custom tasks
  const customTasksForDay: TaskDefinition[] = allTasksForDate
    .filter((id) => !standardTasksById.has(id))
    .map((id) => ({
      id,
      label: formattedIdToLabel(id),
      icon: getTaskIcon(id),
      frequency: "daily",
    }));

  const tasksForDay = [
    ...standardTasksForDay,
    ...manuallyAddedStandardTasks,
    ...customTasksForDay,
  ];

  const allCompleted =
    tasksForDay.length > 0 &&
    tasksForDay.every((t) => completedForDate.includes(t.id));

  // Tasks available to add (not already in the day's list)
  const availableToAdd = STANDARD_TASKS.filter(
    (task) => !tasksForDay.some((t) => t.id === task.id),
  );

  const handleTaskClick = (task: TaskDefinition) => {
    const isCompleted = completedForDate.includes(task.id);

    if (isCompleted) {
      // Already completed → un-complete it
      onToggleTask(dateKey, task.id);
    } else {
      // Not completed → open journal dialog to complete
      setSelectedTask(task);
      setJournalDialogOpen(true);
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

    onToggleTask(dateKey, selectedTask.id);

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

  const handleQuickAdd = (taskId: string) => {
    addPendingTask.mutate({
      taskId,
      entryDate: dateKey,
    });
    setShowAddSection(false);
  };

  const handleCustomAdd = () => {
    if (customTask.trim()) {
      const taskId = `custom_${customTask.toLowerCase().replace(/\s+/g, "_")}`;
      addPendingTask.mutate({
        taskId,
        entryDate: dateKey,
      });
      setCustomTask("");
      setShowAddSection(false);
    }
  };

  return (
    <>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setShowAddSection(false);
        }}
      >
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          className="w-64 p-0 bg-card/95 backdrop-blur-md border-border/50"
          align="start"
          sideOffset={8}
        >
          {/* Header */}
          <div className="p-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {format(date, "EEEE, MMM d")}
              </h4>
              {allCompleted && tasksForDay.length > 0 && (
                <span className="text-xs text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Complete
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily checklist
            </p>
          </div>

          {/* Task List - Hidden scrollbar */}
          <div className="p-2 space-y-1 max-h-[280px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <AnimatePresence>
              {tasksForDay.map((task, index) => {
                const isCompleted = completedForDate.includes(task.id);
                const Icon = task.icon;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-1"
                  >
                    <button
                      onClick={() => handleTaskClick(task)}
                      className={cn(
                        "flex-1 flex items-center gap-3 p-2.5 rounded-lg transition-all text-left",
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "hover:bg-muted",
                        allCompleted && "cursor-pointer",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          isCompleted
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-muted-foreground/40",
                        )}
                      >
                        {isCompleted && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isCompleted
                            ? "text-emerald-500"
                            : "text-muted-foreground",
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm flex-1",
                          isCompleted && "line-through opacity-70",
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

            {tasksForDay.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No tasks scheduled
              </div>
            )}
          </div>

          {/* Add Task Section */}
          <div className="p-2 pt-0 border-t border-border/30">
            {!showAddSection ? (
              <button
                onClick={() => setShowAddSection(true)}
                className="w-full flex items-center justify-center gap-2 p-2 mt-1 rounded-lg hover:bg-muted transition-colors text-sm text-muted-foreground"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 mt-2"
              >
                {/* Available tasks to add */}
                <div className="max-h-[120px] overflow-y-auto space-y-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {availableToAdd.slice(0, 4).map((task) => {
                    const Icon = task.icon;
                    return (
                      <button
                        key={task.id}
                        onClick={() => handleQuickAdd(task.id)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <div className="w-4 h-4 rounded border border-muted-foreground/40 flex items-center justify-center">
                          <Plus className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs flex-1">{task.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom task input */}
                <div className="flex gap-1.5">
                  <Input
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    placeholder="Custom task..."
                    className="h-8 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCustomAdd();
                    }}
                  />
                  <button
                    onClick={handleCustomAdd}
                    disabled={!customTask.trim()}
                    className={cn(
                      "px-2 rounded-md transition-colors",
                      customTask.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed",
                    )}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
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

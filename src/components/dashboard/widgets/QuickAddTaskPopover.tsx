import { useState } from "react";
import { format } from "date-fns";
import { Plus, BookOpen, TrendingUp, Dumbbell, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface QuickAddTaskPopoverProps {
  date: Date;
  children: React.ReactNode;
  onToggleTask: (dateKey: string, taskId: string) => void;
}

// Pre-defined quick tasks
const quickTasks = [
  { id: "prayer", label: "Prayer", icon: BookOpen },
  { id: "bible", label: "Bible Reading", icon: BookOpen },
  { id: "trading", label: "Trading/Charts", icon: TrendingUp },
  { id: "gym", label: "GYM", icon: Dumbbell },
];

export function QuickAddTaskPopover({
  date,
  children,
  onToggleTask,
}: QuickAddTaskPopoverProps) {
  const [open, setOpen] = useState(false);
  const [customTask, setCustomTask] = useState("");
  const dateKey = format(date, "yyyy-MM-dd");

  const handleQuickAdd = (taskId: string) => {
    onToggleTask(dateKey, taskId);
    setOpen(false);
  };

  const handleCustomAdd = () => {
    if (customTask.trim()) {
      // For now, add as a custom task with sanitized ID
      const taskId = `custom_${customTask.toLowerCase().replace(/\s+/g, '_')}`;
      onToggleTask(dateKey, taskId);
      setCustomTask("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-56 p-0 bg-card/95 backdrop-blur-md border-border/50"
        align="end"
        sideOffset={8}
      >
        <div className="p-3 border-b border-border/30">
          <h4 className="text-sm font-medium">Quick Add Task</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(date, "EEEE, MMM d")}
          </p>
        </div>

        <div className="p-2 space-y-1">
          <AnimatePresence>
            {quickTasks.map((task, index) => {
              const Icon = task.icon;
              return (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleQuickAdd(task.id)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="w-5 h-5 rounded border-2 border-muted-foreground/40 flex items-center justify-center">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm flex-1">{task.label}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Custom task input */}
        <div className="p-2 pt-0 border-t border-border/30 mt-1">
          <div className="flex gap-1.5 mt-2">
            <Input
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Custom task..."
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCustomAdd();
                }
              }}
            />
            <button
              onClick={handleCustomAdd}
              disabled={!customTask.trim()}
              className={cn(
                "px-2 rounded-md transition-colors",
                customTask.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

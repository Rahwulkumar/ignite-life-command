import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Timer,
  Play,
  Pause,
  Square,
  StickyNote,
  Check,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  icon: React.ElementType;
  label: string;
  completed: boolean;
  notes?: string;
  timerSeconds?: number;
}

interface HabitDetailModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    habitId: string,
    updates: { notes?: string; timerSeconds?: number; completed?: boolean },
  ) => void;
}

export function HabitDetailModal({
  habit,
  isOpen,
  onClose,
  onSave,
}: HabitDetailModalProps) {
  const [notes, setNotes] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  // Reset state when habit changes
  useEffect(() => {
    if (habit) {
      setNotes(habit.notes || "");
      setTimerSeconds(habit.timerSeconds || 0);
      setTimerActive(false);
      setShowTimer(habit.timerSeconds ? habit.timerSeconds > 0 : false);
    }
  }, [habit]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    setShowTimer(true);
    setTimerActive(true);
  };

  const handlePauseTimer = () => {
    setTimerActive(false);
  };

  const handleResumeTimer = () => {
    setTimerActive(true);
  };

  const handleStopTimer = () => {
    setTimerActive(false);
  };

  const handleSave = () => {
    if (habit) {
      onSave(habit.id, {
        notes,
        timerSeconds: showTimer ? timerSeconds : undefined,
      });
    }
    onClose();
  };

  const handleMarkComplete = () => {
    if (habit) {
      onSave(habit.id, {
        notes,
        timerSeconds: showTimer ? timerSeconds : undefined,
        completed: !habit.completed,
      });
    }
    onClose();
  };

  if (!habit) return null;

  const HabitIcon = habit.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                habit.completed
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {habit.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <HabitIcon className="w-5 h-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-medium">
                {habit.label}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {habit.completed ? "Completed" : "In progress"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Timer Section */}
          {!showTimer ? (
            <button
              onClick={handleStartTimer}
              className="w-full flex items-center gap-3 p-4 rounded-lg border border-dashed border-border hover:border-foreground/30 hover:bg-muted/50 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                <Timer className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Start Timer</p>
                <p className="text-xs text-muted-foreground">
                  Track time spent on this habit
                </p>
              </div>
            </button>
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Timer</span>
                </div>
                {timerActive && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-emerald-500"
                  />
                )}
              </div>

              <div className="text-center mb-4">
                <motion.span
                  key={timerSeconds}
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  className="text-4xl font-light tabular-nums"
                >
                  {formatTime(timerSeconds)}
                </motion.span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {timerActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePauseTimer}
                    className="gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResumeTimer}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    {timerSeconds > 0 ? "Resume" : "Start"}
                  </Button>
                )}
                {timerSeconds > 0 && !timerActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStopTimer}
                    className="gap-2 text-muted-foreground"
                  >
                    <Square className="w-4 h-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Notes</span>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this habit..."
              className="min-h-[100px] resize-none bg-muted/30 border-border focus:border-foreground/30"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 border-t border-border bg-muted/20">
          <Button
            variant="outline"
            onClick={handleMarkComplete}
            className={cn(
              "flex-1 gap-2",
              habit.completed &&
                "bg-foreground text-background hover:bg-foreground/90 hover:text-background",
            )}
          >
            <Check className="w-4 h-4" />
            {habit.completed ? "Mark Incomplete" : "Mark Complete"}
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

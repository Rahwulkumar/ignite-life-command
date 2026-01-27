import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Habit {
  id: string;
  icon: React.ElementType;
  label: string;
  completed: boolean;
  streak?: number;
}

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
}

export function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      className="rounded-lg border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Daily Habits</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount} of {habits.length} completed
          </p>
        </div>
        <motion.span 
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "text-sm font-semibold tabular-nums px-2 py-0.5 rounded",
            percentage === 100 ? "bg-finance/10 text-finance" : "text-muted-foreground"
          )}
        >
          {percentage}%
        </motion.span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted mb-5 overflow-hidden">
        <motion.div 
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {habits.map((habit, i) => (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2.5 rounded-md transition-colors",
              habit.completed 
                ? "bg-foreground text-background" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {habit.completed ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <habit.icon className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-[10px] font-medium leading-none truncate w-full text-center">
              {habit.label.split(" ")[0]}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

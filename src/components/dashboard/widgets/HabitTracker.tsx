import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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
  delay?: number;
}

export function HabitTracker({ habits, onToggle, delay = 0 }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">Daily Habits</h3>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-trading" />
            {completedCount}/{habits.length}
          </div>
        </div>
        
        {/* Progress ring */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="4"
            />
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 126" }}
              animate={{ strokeDasharray: `${(percentage / 100) * 126} 126` }}
              transition={{ delay: delay + 0.3, duration: 0.8 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Habit Grid */}
      <div className="grid grid-cols-5 gap-3">
        {habits.map((habit, i) => (
          <motion.button
            key={habit.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1 + i * 0.05, duration: 0.3 }}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "relative flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all duration-200",
              "hover:bg-muted/50 group",
              habit.completed 
                ? "bg-foreground/[0.03]" 
                : "bg-transparent"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
              habit.completed 
                ? "bg-foreground text-background shadow-lg shadow-foreground/20" 
                : "bg-muted text-muted-foreground group-hover:bg-muted/80"
            )}>
              {habit.completed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              ) : (
                <habit.icon className="w-5 h-5" />
              )}
            </div>
            <span className={cn(
              "text-[11px] text-center leading-tight font-medium",
              habit.completed ? "text-foreground" : "text-muted-foreground"
            )}>
              {habit.label.split(" ").slice(0, 2).join(" ")}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

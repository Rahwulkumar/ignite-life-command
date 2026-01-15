import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  icon: React.ElementType;
  label: string;
  completed: boolean;
}

interface HabitGridProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  delay?: number;
}

export function HabitGrid({ habits, onToggle, delay = 0 }: HabitGridProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {habits.map((habit, i) => (
        <motion.button
          key={habit.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + i * 0.05, duration: 0.3 }}
          onClick={() => onToggle(habit.id)}
          className={cn(
            "relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
            "hover:bg-muted/50 group",
            habit.completed 
              ? "bg-foreground/5" 
              : "bg-transparent"
          )}
        >
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center transition-all",
            habit.completed 
              ? "bg-foreground text-background" 
              : "bg-muted text-muted-foreground group-hover:bg-muted/80"
          )}>
            {habit.completed ? (
              <Check className="w-5 h-5" />
            ) : (
              <habit.icon className="w-5 h-5" />
            )}
          </div>
          <span className={cn(
            "text-[11px] text-center leading-tight max-w-full",
            habit.completed ? "text-foreground" : "text-muted-foreground"
          )}>
            {habit.label.split(" ").slice(0, 2).join(" ")}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

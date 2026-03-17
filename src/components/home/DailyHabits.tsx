import { Check, Droplets, Dumbbell, BookOpen, Moon, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  icon: React.ElementType;
  label: string;
  completed: boolean;
  notes?: string;
  timerSeconds?: number;
}

interface DailyHabitsProps {
  date: Date;
  habits: Habit[];
  onToggle: (id: string) => void;
  compact?: boolean;
}

export function DailyHabits({ date, habits, onToggle, compact = false }: DailyHabitsProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-1.5">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg transition-all text-left",
              "hover:bg-muted/50",
              habit.completed && "opacity-60"
            )}
          >
            <div className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
              habit.completed 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {habit.completed ? (
                <Check className="w-3 h-3" />
              ) : (
                <habit.icon className="w-3 h-3" />
              )}
            </div>
            <span className={cn(
              "text-xs truncate",
              habit.completed && "line-through text-muted-foreground"
            )}>
              {habit.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-lg transition-all",
              "hover:bg-muted/50",
              habit.completed && "opacity-60"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
              habit.completed 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {habit.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <habit.icon className="w-4 h-4" />
              )}
            </div>
            <span className={cn(
              "text-sm",
              habit.completed && "line-through text-muted-foreground"
            )}>
              {habit.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

const defaultHabits: Habit[] = [
  { id: "water", icon: Droplets, label: "Drink 8 glasses of water", completed: false },
  { id: "gym", icon: Dumbbell, label: "Workout or movement", completed: false },
  { id: "devotion", icon: BookOpen, label: "Morning devotion", completed: false },
  { id: "sleep", icon: Moon, label: "8 hours of sleep", completed: false },
  { id: "nutrition", icon: Apple, label: "Eat healthy meals", completed: false },
];

import { Check, Target } from "lucide-react";
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

export function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;
  const percentage = Math.round((completedCount / habits.length) * 100);

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Target className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">Daily Habits</h3>
            <p className="text-xs text-muted-foreground">{completedCount}/{habits.length} completed</p>
          </div>
        </div>
        
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 125.6} 125.6`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
            {percentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg transition-colors",
              habit.completed 
                ? "bg-foreground/5 border border-foreground/10" 
                : "bg-muted/50 hover:bg-muted border border-transparent"
            )}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                habit.completed 
                  ? "bg-foreground text-background" 
                  : "bg-muted text-muted-foreground"
              )}
            >
              {habit.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <habit.icon className="w-5 h-5" />
              )}
            </div>
            <span className={cn(
              "text-[10px] text-center leading-tight font-medium",
              habit.completed ? "text-foreground" : "text-muted-foreground"
            )}>
              {habit.label.split(" ").slice(0, 2).join(" ")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

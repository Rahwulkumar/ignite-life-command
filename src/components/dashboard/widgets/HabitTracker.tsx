import { Check } from "lucide-react";
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
}

export function HabitTracker({ habits, onToggle }: HabitTrackerProps) {
  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium">Daily Habits</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completedCount} of {habits.length} completed
          </p>
        </div>
        <span className="text-sm font-medium tabular-nums">
          {Math.round((completedCount / habits.length) * 100)}%
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-muted mb-5">
        <div 
          className="h-full rounded-full bg-foreground transition-all duration-300"
          style={{ width: `${(completedCount / habits.length) * 100}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => onToggle(habit.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-2.5 rounded-md transition-colors",
              habit.completed 
                ? "bg-foreground text-background" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {habit.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <habit.icon className="w-4 h-4" />
              )}
            </div>
            <span className="text-[10px] font-medium leading-none truncate w-full text-center">
              {habit.label.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Check, Plus, Target, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

const initialGoals: Goal[] = [
  { id: "1", text: "Complete 5 LeetCode problems", completed: false },
  { id: "2", text: "Watch 3 system design videos", completed: true },
  { id: "3", text: "Read 2 chapters of DDIA", completed: false },
];

export function WeeklyGoals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? (completedCount / goals.length) * 100 : 0;

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals([...goals, { id: Date.now().toString(), text: newGoal.trim(), completed: false }]);
    setNewGoal("");
    setIsAdding(false);
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-tech" />
          <span className="text-sm font-medium">Weekly Goals</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{goals.length} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-tech rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Goals list */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="flex items-center gap-3 group"
          >
            <button
              onClick={() => toggleGoal(goal.id)}
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                goal.completed
                  ? "bg-tech border-tech"
                  : "border-muted-foreground/30 hover:border-tech"
              )}
            >
              {goal.completed && <Check className="w-3 h-3 text-background" />}
            </button>
            <span
              className={cn(
                "text-sm flex-1 transition-colors",
                goal.completed && "text-muted-foreground line-through"
              )}
            >
              {goal.text}
            </span>
            <button
              onClick={() => removeGoal(goal.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {isAdding ? (
          <div className="flex items-center gap-2">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder="Enter goal..."
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={addGoal} className="h-8">
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewGoal("");
              }}
              className="h-8"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full py-1"
          >
            <Plus className="w-4 h-4" />
            Add goal
          </button>
        )}
      </div>
    </div>
  );
}

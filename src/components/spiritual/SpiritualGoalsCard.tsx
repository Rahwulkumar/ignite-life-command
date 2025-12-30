import { Target, Plus, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Goal {
  id: string;
  title: string;
  progress: number;
  isCompleted: boolean;
  category: string;
}

interface SpiritualGoalsCardProps {
  goals: Goal[];
  onAddGoal?: () => void;
}

export const SpiritualGoalsCard = ({ goals, onAddGoal }: SpiritualGoalsCardProps) => {
  const activeGoals = goals.filter((g) => !g.isCompleted).slice(0, 4);
  const completedCount = goals.filter((g) => g.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-6"
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-spiritual/10">
              <Target className="w-5 h-5 text-spiritual" />
            </div>
            <div>
              <h3 className="font-medium">Spiritual Goals</h3>
              <p className="text-sm text-muted-foreground">{completedCount} completed</p>
            </div>
          </div>
          <button
            onClick={onAddGoal}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3">
          {activeGoals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Set your first spiritual goal
            </p>
          ) : (
            activeGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors"
              >
                <div className="relative w-8 h-8 flex-shrink-0">
                  <svg className="w-8 h-8 -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${goal.progress * 0.88} 88`}
                      className="text-spiritual transition-all"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] tabular-nums">
                    {goal.progress}%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{goal.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{goal.category}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

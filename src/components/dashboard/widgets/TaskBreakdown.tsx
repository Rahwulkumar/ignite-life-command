import { motion } from "framer-motion";
import { BookOpen, Dumbbell } from "lucide-react";

interface TaskStat {
  completed: number;
  total: number;
  percentage: number;
}

interface TaskBreakdownProps {
  breakdown: {
    prayer: TaskStat;
    bible: TaskStat;
    gym: TaskStat;
  };
}

export function TaskBreakdown({ breakdown }: TaskBreakdownProps) {
  const tasks = [
    {
      id: "prayer",
      label: "Prayer",
      icon: BookOpen,
      ...breakdown.prayer,
      color: "bg-purple-500",
    },
    {
      id: "bible",
      label: "Bible Reading",
      icon: BookOpen,
      ...breakdown.bible,
      color: "bg-blue-500",
    },
    {
      id: "gym",
      label: "GYM",
      icon: Dumbbell,
      ...breakdown.gym,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground">Task Breakdown</h4>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <task.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{task.label}</span>
              </div>
              <span className="text-muted-foreground">
                {task.completed}/{task.total} ({task.percentage}%)
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(task.percentage, 100)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${task.color} rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

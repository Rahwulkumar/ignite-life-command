import { motion } from "framer-motion";
import { Flame, TrendingUp, Calendar, Target } from "lucide-react";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  thisWeekCompletion: number;
  thisMonthCompletion: number;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  thisWeekCompletion,
  thisMonthCompletion,
}: StreakDisplayProps) {
  const stats = [
    {
      icon: Flame,
      label: "Current Streak",
      value: currentStreak,
      suffix: "days",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: TrendingUp,
      label: "Longest Streak",
      value: longestStreak,
      suffix: "days",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Calendar,
      label: "This Week",
      value: thisWeekCompletion,
      suffix: "%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Target,
      label: "This Month",
      value: thisMonthCompletion,
      suffix: "%",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 rounded-lg ${stat.bgColor}`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            <span className="text-[10px] text-muted-foreground truncate">{stat.label}</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] text-muted-foreground">{stat.suffix}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

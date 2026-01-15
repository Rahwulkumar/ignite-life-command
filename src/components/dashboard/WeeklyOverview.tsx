import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DayData {
  day: string;
  value: number;
  isToday: boolean;
}

interface WeeklyOverviewProps {
  data: DayData[];
  maxValue: number;
  label: string;
  compact?: boolean;
}

export function WeeklyOverview({ data, maxValue, label, compact = false }: WeeklyOverviewProps) {
  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-[10px] text-muted-foreground">Last 7 days</p>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-12">
          {data.map((day, i) => {
            const height = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 8)}%` }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className={cn(
                    "w-full rounded-sm min-h-[3px]",
                    day.isToday ? "bg-foreground" : "bg-muted-foreground/30"
                  )}
                />
                <span
                  className={cn(
                    "text-[9px]",
                    day.isToday ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Last 7 days</p>
      </div>
      <div className="flex items-end justify-between gap-2 h-20">
        {data.map((day, i) => {
          const height = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={cn(
                  "w-full rounded-sm min-h-[4px]",
                  day.isToday ? "bg-foreground" : "bg-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  "text-[10px]",
                  day.isToday ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WeekBarChartProps {
  data: { day: string; value: number; isToday: boolean }[];
  maxValue: number;
  label: string;
  delay?: number;
}

export function WeekBarChart({ data, maxValue, label, delay = 0 }: WeekBarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">This week</p>
      </div>
      
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((day, i) => {
          const height = maxValue > 0 ? (day.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 8)}%` }}
                transition={{ delay: delay + 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "w-full max-w-[32px] rounded-lg transition-colors",
                  day.isToday 
                    ? "bg-foreground" 
                    : "bg-muted-foreground/20 hover:bg-muted-foreground/30"
                )}
              />
              <span className={cn(
                "text-xs",
                day.isToday ? "text-foreground font-semibold" : "text-muted-foreground"
              )}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

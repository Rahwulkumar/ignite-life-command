import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DayData {
  day: string;
  value: number;
  isToday: boolean;
}

interface ActivityChartProps {
  data: DayData[];
  maxValue: number;
  title: string;
  delay?: number;
}

export function ActivityChart({ data, maxValue, title, delay = 0 }: ActivityChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl bg-card border border-border/50 p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">This week</span>
      </div>
      
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((day, i) => {
          const height = (day.value / maxValue) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: delay + 0.2 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                className={cn(
                  "w-full rounded-lg min-h-[8px]",
                  day.isToday 
                    ? "bg-gradient-to-t from-foreground to-foreground/70" 
                    : "bg-muted hover:bg-muted/80 transition-colors"
                )}
              />
              <span className={cn(
                "text-[11px] font-medium",
                day.isToday ? "text-foreground" : "text-muted-foreground"
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

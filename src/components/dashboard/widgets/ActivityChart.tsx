import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DayData {
  day: string;
  value: number;
  isToday: boolean;
}

interface ActivityChartProps {
  data: DayData[];
  maxValue: number;
  title: string;
}

export function ActivityChart({ data, maxValue, title }: ActivityChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground">Total: {total}</span>
      </div>
      
      <div className="flex items-end justify-between gap-1.5 h-16">
        {data.map((day, i) => {
          const height = (day.value / maxValue) * 100;
          
          return (
            <motion.div 
              key={i} 
              className="flex-1 flex flex-col items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <div className="w-full h-12 flex items-end">
                <motion.div
                  className={cn(
                    "w-full rounded-sm",
                    day.isToday ? "bg-tech" : "bg-muted"
                  )}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 8)}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                />
              </div>
              <span className={cn(
                "text-[10px]",
                day.isToday ? "font-medium text-tech" : "text-muted-foreground"
              )}>
                {day.day}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BarChart3, TrendingUp } from "lucide-react";

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
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);
  const avgValue = (totalValue / data.length).toFixed(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50 p-6"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '100% 20px'
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-foreground/70" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">This week</p>
          </div>
        </div>
        
        <motion.div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          <TrendingUp className="w-3.5 h-3.5 text-finance" />
          <span className="text-xs font-medium">Avg: {avgValue}</span>
        </motion.div>
      </div>
      
      {/* Chart */}
      <div className="relative z-10 flex items-end justify-between gap-3 h-28">
        {data.map((day, i) => {
          const height = (day.value / maxValue) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              {/* Value label */}
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.3 + i * 0.05 }}
                className={cn(
                  "text-xs font-semibold",
                  day.isToday ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {day.value}
              </motion.span>
              
              {/* Bar */}
              <div className="relative w-full h-20">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: delay + 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "absolute bottom-0 left-0 right-0 rounded-lg overflow-hidden",
                    day.isToday ? "shadow-lg" : ""
                  )}
                  style={{ minHeight: '8px' }}
                >
                  {/* Bar gradient */}
                  <div 
                    className={cn(
                      "absolute inset-0",
                      day.isToday 
                        ? "bg-gradient-to-t from-foreground via-foreground/90 to-foreground/70" 
                        : "bg-gradient-to-t from-muted to-muted/60"
                    )}
                  />
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  
                  {/* Hover effect */}
                  <div 
                    className={cn(
                      "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300",
                      day.isToday 
                        ? "bg-gradient-to-t from-foreground to-foreground/80" 
                        : "bg-gradient-to-t from-muted-foreground/40 to-muted-foreground/20"
                    )}
                  />
                </motion.div>
              </div>
              
              {/* Day label */}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.4 + i * 0.05 }}
                className={cn(
                  "text-[11px] font-semibold",
                  day.isToday 
                    ? "text-foreground px-2 py-0.5 rounded-full bg-foreground/10" 
                    : "text-muted-foreground"
                )}
              >
                {day.day}
              </motion.span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

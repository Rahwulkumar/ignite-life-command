import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

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

export function ActivityChart({ data, maxValue, title }: ActivityChartProps) {
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);
  const avgValue = (totalValue / data.length).toFixed(1);
  
  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-xs text-muted-foreground">Avg: {avgValue}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between gap-2 h-24">
        {data.map((day, i) => {
          const height = (day.value / maxValue) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className={cn(
                "text-xs font-medium",
                day.isToday ? "text-foreground" : "text-muted-foreground"
              )}>
                {day.value}
              </span>
              
              <div className="w-full h-16 flex items-end">
                <div
                  className={cn(
                    "w-full rounded-md transition-all",
                    day.isToday ? "bg-foreground" : "bg-muted"
                  )}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              </div>
              
              <span className={cn(
                "text-[10px] font-medium",
                day.isToday 
                  ? "text-foreground bg-foreground/10 px-1.5 py-0.5 rounded" 
                  : "text-muted-foreground"
              )}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

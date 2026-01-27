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
}

export function ActivityChart({ data, maxValue, title }: ActivityChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground">Total: {total}</span>
      </div>
      
      <div className="flex items-end justify-between gap-1.5 h-16">
        {data.map((day, i) => {
          const height = (day.value / maxValue) * 100;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-full h-12 flex items-end">
                <div
                  className={cn(
                    "w-full rounded-sm transition-all",
                    day.isToday ? "bg-foreground" : "bg-muted"
                  )}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              </div>
              <span className={cn(
                "text-[10px]",
                day.isToday ? "font-medium text-foreground" : "text-muted-foreground"
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

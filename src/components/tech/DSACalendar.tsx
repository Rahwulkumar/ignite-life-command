import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DSACalendarProps {
  completedDates: string[];
}

export function DSACalendar({ completedDates }: DSACalendarProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const result: { date: Date; completed: boolean }[][] = [];
    
    // Generate last 12 weeks (84 days)
    for (let week = 11; week >= 0; week--) {
      const weekDays: { date: Date; completed: boolean }[] = [];
      for (let day = 6; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));
        weekDays.push({
          date,
          completed: completedDates.includes(date.toISOString().split("T")[0]),
        });
      }
      result.push(weekDays);
    }
    
    return result;
  }, [completedDates]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, weekIndex) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        labels.push({
          label: week[0].date.toLocaleDateString("en-US", { month: "short" }),
          index: weekIndex,
        });
        lastMonth = month;
      }
    });
    
    return labels;
  }, [weeks]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Activity (12 weeks)</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-muted" />
            <div className="w-2.5 h-2.5 rounded-sm bg-tech/30" />
            <div className="w-2.5 h-2.5 rounded-sm bg-tech/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-tech" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-1 ml-6 text-[10px] text-muted-foreground">
          {monthLabels.map((label, i) => (
            <span
              key={i}
              className="absolute"
              style={{ left: `${24 + label.index * 14}px` }}
            >
              {label.label}
            </span>
          ))}
        </div>

        <div className="flex gap-1 mt-4">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 text-[10px] text-muted-foreground pr-1">
            <span className="h-2.5" />
            <span className="h-2.5">Mon</span>
            <span className="h-2.5" />
            <span className="h-2.5">Wed</span>
            <span className="h-2.5" />
            <span className="h-2.5">Fri</span>
            <span className="h-2.5" />
          </div>

          {/* Calendar grid */}
          <div className="flex gap-0.5">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const isFuture = day.date > new Date();
                  
                  return (
                    <div
                      key={dayIndex}
                      title={`${day.date.toLocaleDateString()} - ${day.completed ? "Completed" : "No activity"}`}
                      className={cn(
                        "w-2.5 h-2.5 rounded-sm transition-colors",
                        isFuture
                          ? "bg-transparent"
                          : day.completed
                          ? "bg-tech"
                          : "bg-muted",
                        isToday && "ring-1 ring-foreground ring-offset-1 ring-offset-background"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

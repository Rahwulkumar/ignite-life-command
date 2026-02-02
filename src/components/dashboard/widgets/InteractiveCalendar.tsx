import { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyChecklistPopover } from "./DailyChecklistPopover";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";

interface InteractiveCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedTasks: Record<string, string[]>;
  onToggleTask: (dateKey: string, taskId: string) => void;
}

const defaultDailyTaskCount = 3; // prayer + bible + trading
const getExpectedTaskCount = (date: Date) => {
  const dayOfWeek = getDay(date);
  // Mon-Fri have GYM as well
  if ([1, 2, 3, 4, 5].includes(dayOfWeek)) {
    return defaultDailyTaskCount + 1;
  }
  return defaultDailyTaskCount;
};

export function InteractiveCalendar({
  selectedDate,
  onSelectDate,
  completedTasks,
  onToggleTask,
}: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const getCompletionStatus = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const completed = completedTasks[dateKey] || [];
    const expected = getExpectedTaskCount(date);
    if (completed.length === 0) return "none";
    if (completed.length >= expected) return "complete";
    return "partial";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium">{format(currentMonth, "MMM yyyy")}</h3>
        <div className="flex gap-0.5">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0.5 flex-1">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const status = getCompletionStatus(day);

          return (
            <DailyChecklistPopover
              key={i}
              date={day}
              completedTasks={completedTasks}
              onToggleTask={onToggleTask}
            >
              <button
                onClick={() => onSelectDate(day)}
                className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded text-xs transition-all relative",
                  !isCurrentMonth && "text-muted-foreground/30",
                  isCurrentMonth && !isSelected && "hover:bg-muted",
                  isSelected && "bg-foreground text-background",
                  isToday && !isSelected && "ring-1 ring-foreground/30"
                )}
              >
                <span>{format(day, "d")}</span>
                
                {/* Completion indicator */}
                {isCurrentMonth && status !== "none" && (
                  <div className="absolute bottom-0.5 flex items-center justify-center">
                    {status === "complete" ? (
                      <Check className={cn(
                        "w-2 h-2",
                        isSelected ? "text-background" : "text-emerald-500"
                      )} />
                    ) : (
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        isSelected ? "bg-background/60" : "bg-amber-500"
                      )} />
                    )}
                  </div>
                )}
              </button>
            </DailyChecklistPopover>
          );
        })}
      </div>
    </div>
  );
}

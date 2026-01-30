import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, BarChart3, StickyNote } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DailyChecklistPopover } from "./DailyChecklistPopover";
import { AnalyticsPanel } from "./AnalyticsPanel";
import { Button } from "@/components/ui/button";
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

const defaultDailyTaskCount = 2; // prayer + bible
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
  const [showAnalytics, setShowAnalytics] = useState(false);

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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
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
                  "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative group",
                  !isCurrentMonth && "text-muted-foreground/30",
                  isCurrentMonth && !isSelected && "hover:bg-muted",
                  isSelected && "bg-foreground text-background",
                  isToday && !isSelected && "ring-1 ring-foreground/30"
                )}
              >
                <span>{format(day, "d")}</span>
                
                {/* Completion indicator */}
                {isCurrentMonth && status !== "none" && (
                  <div className="absolute bottom-1 flex items-center justify-center">
                    {status === "complete" ? (
                      <Check className={cn(
                        "w-3 h-3",
                        isSelected ? "text-background" : "text-emerald-500"
                      )} />
                    ) : (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
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

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1.5 text-muted-foreground"
          onClick={() => setShowAnalytics(!showAnalytics)}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Analytics
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1.5 text-muted-foreground"
          asChild
        >
          <Link to="/notes">
            <StickyNote className="w-3.5 h-3.5" />
            Notes
          </Link>
        </Button>
      </div>

      {/* Analytics Panel */}
      <AnalyticsPanel isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </div>
  );
}

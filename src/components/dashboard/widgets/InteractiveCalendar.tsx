import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, BookOpen, TrendingUp, Dumbbell, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DailyChecklistPopover } from "./DailyChecklistPopover";
import { QuickAddTaskPopover } from "./QuickAddTaskPopover";
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

// Task definitions for the footer
const dailyTasks = [
  { id: "prayer", label: "Prayer", icon: BookOpen },
  { id: "bible", label: "Bible", icon: BookOpen },
  { id: "trading", label: "Charts", icon: TrendingUp },
];

const weekdayTasks = [
  { id: "gym", label: "GYM", icon: Dumbbell },
];

const getExpectedTaskCount = (date: Date) => {
  const dayOfWeek = getDay(date);
  // Mon-Fri have GYM as well
  if ([1, 2, 3, 4, 5].includes(dayOfWeek)) {
    return 4; // 3 daily + 1 gym
  }
  return 3; // 3 daily
};

const getTasksForDay = (date: Date) => {
  const dayOfWeek = getDay(date);
  if ([1, 2, 3, 4, 5].includes(dayOfWeek)) {
    return [...dailyTasks, ...weekdayTasks];
  }
  return dailyTasks;
};

export function InteractiveCalendar({
  selectedDate,
  onSelectDate,
  completedTasks,
  onToggleTask,
}: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const todayKey = format(today, "yyyy-MM-dd");
  const todayCompleted = completedTasks[todayKey] || [];
  const todayTasks = getTasksForDay(today);
  const remainingTasks = todayTasks.filter((t) => !todayCompleted.includes(t.id));

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
    <div className="flex flex-col">
      {/* Ultra-compact header */}
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[11px] font-medium">{format(currentMonth, "MMM yyyy")}</h3>
        <div className="flex">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-0.5 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-0.5 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-px mb-0.5">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-[9px] text-muted-foreground font-medium py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid - Ultra compact */}
      <div className="grid grid-cols-7 gap-px mb-2">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, today);
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
                  "w-5 h-5 flex items-center justify-center rounded text-[10px] transition-all relative",
                  !isCurrentMonth && "text-muted-foreground/30",
                  isCurrentMonth && !isSelected && "hover:bg-muted",
                  isSelected && "bg-foreground text-background",
                  isToday && !isSelected && "ring-1 ring-foreground/30"
                )}
              >
                <span>{format(day, "d")}</span>

                {/* Completion indicator */}
                {isCurrentMonth && status !== "none" && (
                  <div className="absolute -bottom-0.5 flex items-center justify-center">
                    {status === "complete" ? (
                      <Check
                        className={cn(
                          "w-2 h-2",
                          isSelected ? "text-background" : "text-emerald-500"
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "w-1 h-1 rounded-full",
                          isSelected ? "bg-background/60" : "bg-amber-500"
                        )}
                      />
                    )}
                  </div>
                )}
              </button>
            </DailyChecklistPopover>
          );
        })}
      </div>

      {/* Today's Progress Footer */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">Today</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium">
              {todayCompleted.length}/{todayTasks.length}
            </span>
            <QuickAddTaskPopover date={today} onToggleTask={onToggleTask}>
              <button className="p-0.5 rounded hover:bg-muted transition-colors" title="Add task">
                <Plus className="w-3 h-3 text-muted-foreground" />
              </button>
            </QuickAddTaskPopover>
          </div>
        </div>

        {remainingTasks.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {remainingTasks.map((task) => {
              const Icon = task.icon;
              return (
                <DailyChecklistPopover
                  key={task.id}
                  date={today}
                  completedTasks={completedTasks}
                  onToggleTask={onToggleTask}
                >
                  <button className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded bg-muted/50 hover:bg-muted transition-colors">
                    <Icon className="w-2.5 h-2.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{task.label}</span>
                  </button>
                </DailyChecklistPopover>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-emerald-500">
            <Check className="w-3 h-3" />
            <span>All done!</span>
          </div>
        )}
      </div>
    </div>
  );
}

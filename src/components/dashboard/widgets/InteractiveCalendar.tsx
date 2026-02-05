import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Plus } from "lucide-react";
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
import {
  STANDARD_TASKS,
  formattedIdToLabel,
  getTaskIcon,
  TaskDefinition
} from "@/lib/constants";

interface InteractiveCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedTasks: Record<string, string[]>;
  allTasks?: Record<string, string[]>;
  onToggleTask: (dateKey: string, taskId: string) => void;
}

const getExpectedTaskCount = (date: Date) => {
  const dayOfWeek = getDay(date);
  // Calculate total standard tasks applicable for this day
  const applicableStandard = STANDARD_TASKS.filter(task => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek) {
      return task.daysOfWeek.includes(dayOfWeek);
    }
    return false;
  });

  return applicableStandard.length;
};

export function InteractiveCalendar({
  selectedDate,
  onSelectDate,
  completedTasks,
  onToggleTask,
}: InteractiveCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const dayOfWeek = getDay(today);
  const todayKey = format(today, "yyyy-MM-dd");
  const todayCompleted = completedTasks[todayKey] || [];

  // Standard tasks for today
  const standardTodayTasks = STANDARD_TASKS.filter(task => {
    if (task.frequency === "daily") return true;
    if (task.frequency === "weekly" && task.daysOfWeek) {
      return task.daysOfWeek.includes(dayOfWeek);
    }
    return false;
  });

  // Custom tasks for today
  const customTodayTasks: TaskDefinition[] = todayCompleted
    .filter(id => !STANDARD_TASKS.some(t => t.id === id))
    .map(id => ({
      id,
      label: formattedIdToLabel(id),
      icon: getTaskIcon(id),
      frequency: "daily"
    }));

  const allTodayTasks = [...standardTodayTasks, ...customTodayTasks];
  const remainingTasks = allTodayTasks.filter((t) => !todayCompleted.includes(t.id));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const getCompletionStatus = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const completed = completedTasks[dateKey] || [];

    // Also include custom tasks in the expected count for past days if they were completed
    const customCount = completed.filter(id => !STANDARD_TASKS.some(t => t.id === id)).length;
    const expected = getExpectedTaskCount(date) + customCount;

    if (completed.length === 0) return "none";
    if (completed.length >= expected) return "complete";
    return "partial";
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{format(currentMonth, "MMM yyyy")}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((d, i) => (
          <div key={i} className="text-center text-[11px] text-muted-foreground font-medium py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 mb-3">
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
              allTasks={allTasks}
              onToggleTask={onToggleTask}
            >
              <button
                onClick={() => onSelectDate(day)}
                className={cn(
                  "w-7 h-7 flex items-center justify-center rounded text-xs transition-all relative",
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
      <div className="pt-3 border-t border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Today</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">
              {todayCompleted.length}/{allTodayTasks.length}
            </span>
            <QuickAddTaskPopover date={today} onToggleTask={onToggleTask}>
              <button className="p-1 rounded hover:bg-muted transition-colors" title="Add task">
                <Plus className="w-4 h-4 text-muted-foreground" />
              </button>
            </QuickAddTaskPopover>
          </div>
        </div>

        {remainingTasks.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {remainingTasks.map((task) => {
              const Icon = task.icon;
              return (
                <DailyChecklistPopover
                  key={task.id}
                  date={today}
                  completedTasks={completedTasks}
                  allTasks={allTasks}
                  onToggleTask={onToggleTask}
                >
                  <button className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-muted/50 hover:bg-muted transition-colors">
                    <Icon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{task.label}</span>
                  </button>
                </DailyChecklistPopover>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500">
            <Check className="w-4 h-4" />
            <span>All done!</span>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
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
} from "date-fns";

interface MiniCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedDates?: Date[];
  compact?: boolean;
}

export function MiniCalendar({ selectedDate, onSelectDate, completedDates = [], compact = false }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  
  const isCompleted = (date: Date) => 
    completedDates.some(d => isSameDay(d, date));

  if (compact) {
    return (
      <div className="h-full flex flex-col">
        {/* Compact Header */}
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
            <div key={i} className="text-center text-[9px] text-muted-foreground font-medium">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid - Compact */}
        <div className="grid grid-cols-7 gap-0.5 flex-1">
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());
            const hasCompleted = isCompleted(day);

            return (
              <button
                key={i}
                onClick={() => onSelectDate(day)}
                className={cn(
                  "aspect-square flex items-center justify-center rounded text-[10px] transition-colors relative",
                  !isCurrentMonth && "text-muted-foreground/40",
                  isCurrentMonth && !isSelected && "hover:bg-muted",
                  isSelected && "bg-foreground text-background",
                  isToday && !isSelected && "ring-1 ring-foreground/30"
                )}
              >
                {format(day, "d")}
                {hasCompleted && !isSelected && (
                  <span className="absolute bottom-0.5 w-0.5 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
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
      
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground py-1">
            {day}
          </div>
        ))}
        
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());
          const hasCompleted = isCompleted(day);
          
          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-full transition-all relative",
                !isCurrentMonth && "text-muted-foreground/30",
                isCurrentMonth && "hover:bg-muted",
                isSelected && "bg-foreground text-background",
                isToday && !isSelected && "ring-1 ring-foreground/20"
              )}
            >
              {format(day, "d")}
              {hasCompleted && !isSelected && (
                <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

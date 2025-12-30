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
}

export function MiniCalendar({ selectedDate, onSelectDate, completedDates = [] }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  
  const isCompleted = (date: Date) => 
    completedDates.some(d => isSameDay(d, date));
  
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

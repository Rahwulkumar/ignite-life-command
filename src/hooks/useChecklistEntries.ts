import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface ChecklistEntry {
  id: string;
  user_id: string;
  task_id: string;
  entry_date: string;
  is_completed: boolean;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch entries for a date range
export function useChecklistEntries(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: ["checklist-entries", format(startDate, "yyyy-MM-dd"), format(endDate, "yyyy-MM-dd")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_checklist_entries")
        .select("*")
        .gte("entry_date", format(startDate, "yyyy-MM-dd"))
        .lte("entry_date", format(endDate, "yyyy-MM-dd"))
        .order("entry_date", { ascending: false });

      if (error) throw error;
      return data as ChecklistEntry[];
    },
  });
}

// Fetch all entries for analytics (last 3 months by default)
export function useChecklistAnalytics(monthsBack = 3) {
  const endDate = new Date();
  const startDate = subMonths(startOfMonth(endDate), monthsBack - 1);

  return useQuery({
    queryKey: ["checklist-analytics", monthsBack],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("daily_checklist_entries")
        .select("*")
        .gte("entry_date", format(startDate, "yyyy-MM-dd"))
        .lte("entry_date", format(endDate, "yyyy-MM-dd"))
        .eq("is_completed", true)
        .order("entry_date", { ascending: true });

      if (error) throw error;
      return data as ChecklistEntry[];
    },
  });
}

// Toggle task completion
export function useToggleChecklistEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      entryDate,
      isCompleted,
    }: {
      taskId: string;
      entryDate: string;
      isCompleted: boolean;
    }) => {
      if (isCompleted) {
        // Upsert the entry
        const { data, error } = await supabase
          .from("daily_checklist_entries")
          .upsert(
            {
              task_id: taskId,
              entry_date: entryDate,
              is_completed: true,
            },
            {
              onConflict: "user_id,task_id,entry_date",
            }
          )
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Delete the entry or mark as not completed
        const { error } = await supabase
          .from("daily_checklist_entries")
          .delete()
          .eq("task_id", taskId)
          .eq("entry_date", entryDate);

        if (error) throw error;
        return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-analytics"] });
    },
  });
}

// Calculate analytics from entries
export function calculateAnalytics(entries: ChecklistEntry[]) {
  if (!entries || entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      thisWeekCompletion: 0,
      thisMonthCompletion: 0,
      taskBreakdown: {
        prayer: { completed: 0, total: 0, percentage: 0 },
        bible: { completed: 0, total: 0, percentage: 0 },
        trading: { completed: 0, total: 0, percentage: 0 },
        gym: { completed: 0, total: 0, percentage: 0 },
      },
      weeklyData: [],
    };
  }

  // Group by date
  const byDate = entries.reduce((acc, entry) => {
    if (!acc[entry.entry_date]) {
      acc[entry.entry_date] = [];
    }
    acc[entry.entry_date].push(entry.task_id);
    return acc;
  }, {} as Record<string, string[]>);

  // Calculate streaks
  const dates = Object.keys(byDate).sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = format(new Date(), "yyyy-MM-dd");

  // Simple streak calculation
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const tasksCompleted = byDate[date].length;
    
    if (tasksCompleted > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
      
      if (i === 0 && date === today) {
        currentStreak = tempStreak;
      }
    } else {
      if (currentStreak === 0 && i === 0) {
        currentStreak = tempStreak;
      }
      tempStreak = 0;
    }
  }

  if (currentStreak === 0) {
    currentStreak = tempStreak;
  }

  // Task breakdown
  const taskCounts = { prayer: 0, bible: 0, gym: 0, trading: 0 };
  entries.forEach((entry) => {
    if (entry.task_id in taskCounts) {
      taskCounts[entry.task_id as keyof typeof taskCounts]++;
    }
  });

  // Calculate totals (rough estimate based on date range)
  const totalDays = dates.length || 1;
  const weekDays = Math.ceil(totalDays * (5 / 7)); // Approximate weekdays for gym

  const taskBreakdown = {
    prayer: {
      completed: taskCounts.prayer,
      total: totalDays,
      percentage: Math.round((taskCounts.prayer / totalDays) * 100),
    },
    bible: {
      completed: taskCounts.bible,
      total: totalDays,
      percentage: Math.round((taskCounts.bible / totalDays) * 100),
    },
    trading: {
      completed: taskCounts.trading,
      total: totalDays,
      percentage: Math.round((taskCounts.trading / totalDays) * 100),
    },
    gym: {
      completed: taskCounts.gym,
      total: weekDays,
      percentage: weekDays > 0 ? Math.round((taskCounts.gym / weekDays) * 100) : 0,
    },
  };

  // This week completion (3 daily tasks * 7 days + 1 gym * 5 weekdays = 26 max)
  const thisWeekEntries = entries.filter((e) => {
    const entryDate = new Date(e.entry_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });
  const thisWeekCompletion = thisWeekEntries.length > 0 
    ? Math.round((thisWeekEntries.length / 26) * 100)
    : 0;

  // This month completion (3 daily tasks per day + gym on weekdays)
  const thisMonthStart = startOfMonth(new Date());
  const thisMonthEntries = entries.filter((e) => new Date(e.entry_date) >= thisMonthStart);
  const daysInMonth = new Date().getDate();
  const weekdaysInMonth = Math.ceil(daysInMonth * (5 / 7));
  const maxMonthTasks = (daysInMonth * 3) + weekdaysInMonth; // 3 daily + gym on weekdays
  const thisMonthCompletion = thisMonthEntries.length > 0
    ? Math.round((thisMonthEntries.length / maxMonthTasks) * 100)
    : 0;

  return {
    currentStreak,
    longestStreak,
    thisWeekCompletion: Math.min(thisWeekCompletion, 100),
    thisMonthCompletion: Math.min(thisMonthCompletion, 100),
    taskBreakdown,
    weeklyData: [],
  };
}

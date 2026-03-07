import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format, startOfMonth, subMonths } from "date-fns";
import { MetricsData } from "@/types/domain";

export interface ChecklistEntry {
  id: string;
  user_id: string;
  task_id: string;
  entry_date: string;
  is_completed: boolean;
  duration_seconds: number | null;
  notes: string | null;
  metrics_data: MetricsData;
  created_at: string;
  updated_at: string;
}

// Fetch entries for a date range
export function useChecklistEntries(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: [
      "checklist-entries",
      format(startDate, "yyyy-MM-dd"),
      format(endDate, "yyyy-MM-dd"),
    ],
    queryFn: () =>
      api.get<ChecklistEntry[]>(
        `/api/checklist-entries?start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}`
      ),
    staleTime: 0,
  });
}

// Fetch all entries for analytics (last 3 months by default)
export function useChecklistAnalytics(monthsBack = 3) {
  const endDate = new Date();
  const startDate = subMonths(startOfMonth(endDate), monthsBack - 1);

  return useQuery({
    queryKey: ["checklist-analytics", monthsBack],
    queryFn: () =>
      api.get<ChecklistEntry[]>(
        `/api/checklist-entries?start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}`
      ),
    staleTime: 0,
  });
}

// Toggle task completion with optimistic updates
export function useToggleChecklistEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      entryDate,
      isCompleted,
      metricsData,
    }: {
      taskId: string;
      entryDate: string;
      isCompleted: boolean;
      metricsData?: MetricsData;
    }) =>
      api.post<ChecklistEntry>("/api/checklist-entries", {
        taskId,
        entryDate,
        isCompleted,
        metricsData: metricsData ?? {},
      }),
    // Optimistic update for instant UI feedback
    onMutate: async ({ taskId, entryDate, isCompleted, metricsData }) => {
      await queryClient.cancelQueries({ queryKey: ["checklist-entries"] });
      await queryClient.cancelQueries({ queryKey: ["checklist-analytics"] });

      const previousEntries = queryClient.getQueriesData({
        queryKey: ["checklist-entries"],
      });
      const previousAnalytics = queryClient.getQueriesData({
        queryKey: ["checklist-analytics"],
      });

      queryClient.setQueriesData(
        { queryKey: ["checklist-entries"] },
        (old: ChecklistEntry[] | undefined) => {
          if (!old) return old;
          const existingIndex = old.findIndex(
            (e) => e.task_id === taskId && e.entry_date === entryDate
          );
          if (existingIndex >= 0) {
            const updated = [...old];
            updated[existingIndex] = {
              ...updated[existingIndex],
              is_completed: isCompleted,
              updated_at: new Date().toISOString(),
            };
            return updated;
          }
          const newEntry: ChecklistEntry = {
            id: `temp-${Date.now()}`,
            user_id: "",
            task_id: taskId,
            entry_date: entryDate,
            is_completed: isCompleted,
            duration_seconds: null,
            notes: null,
            metrics_data: metricsData || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return [...old, newEntry];
        }
      );

      return { previousEntries, previousAnalytics };
    },
    onError: (_err, _variables, context) => {
      context?.previousEntries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.previousAnalytics?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-analytics"] });
    },
  });
}

// Save metrics data alongside toggle
export function useSaveChecklistMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      entryDate,
      metricsData,
      isCompleted,
    }: {
      taskId: string;
      entryDate: string;
      metricsData: MetricsData;
      isCompleted: boolean;
    }) =>
      api.post<ChecklistEntry>("/api/checklist-entries", {
        taskId,
        entryDate,
        isCompleted,
        metricsData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
    },
  });
}

/**
 * Add a task to a specific date's checklist as pending (not yet completed).
 * Used by DailyChecklistPopover "Add Task" panel.
 */
export function useAddPendingTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      entryDate,
    }: {
      taskId: string;
      entryDate: string;
    }) =>
      api.post<ChecklistEntry>("/api/checklist-entries", {
        taskId,
        entryDate,
        isCompleted: false,
        metricsData: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-analytics"] });
    },
  });
}

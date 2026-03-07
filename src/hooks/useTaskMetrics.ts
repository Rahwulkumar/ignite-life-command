import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface TaskMetric {
  id: string;
  user_id: string;
  task_id: string;
  label: string;
  field_type: "number" | "text" | "rating" | "boolean" | "duration";
  unit: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

// Fetch all metrics for a specific task
export function useTaskMetrics(taskId: string) {
  return useQuery({
    queryKey: ["task-metrics", taskId],
    queryFn: () =>
      api.get<TaskMetric[]>(`/api/task-metrics?taskId=${taskId}`),
    enabled: !!taskId,
  });
}

// Add a new metric to a task
export function useAddTaskMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (metric: {
      task_id: string;
      label: string;
      field_type: TaskMetric["field_type"];
      unit?: string;
      order_index?: number;
    }) =>
      api.post<TaskMetric>("/api/task-metrics", {
        taskId: metric.task_id,
        label: metric.label,
        fieldType: metric.field_type,
        unit: metric.unit,
        orderIndex: metric.order_index,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-metrics", data.task_id],
      });
    },
  });
}

// Update an existing metric
export function useUpdateTaskMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<TaskMetric, "id" | "user_id" | "created_at" | "updated_at">>;
    }) =>
      api.patch<TaskMetric>(`/api/task-metrics/${id}`, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-metrics", data.task_id],
      });
    },
  });
}

// Delete a metric
export function useDeleteTaskMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, taskId }: { id: string; taskId: string }) =>
      api.delete<{ success: boolean }>(`/api/task-metrics/${id}`).then(
        (r) => ({ ...r, taskId })
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-metrics", (data as { taskId: string }).taskId],
      });
    },
  });
}

// Reorder metrics
export function useReorderTaskMetrics() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      metrics,
    }: {
      taskId: string;
      metrics: Array<{ id: string; order_index: number }>;
    }) => {
      await Promise.all(
        metrics.map(({ id, order_index }) =>
          api.patch(`/api/task-metrics/${id}`, { orderIndex: order_index })
        )
      );
      return { taskId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["task-metrics", data.taskId],
      });
    },
  });
}

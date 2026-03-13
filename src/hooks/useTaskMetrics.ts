import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  normalizeTaskMetric,
  type ApiTaskMetric,
  type TaskMetricFieldType,
  type TaskMetricRecord,
} from "@/lib/api-normalizers";

export type TaskMetric = TaskMetricRecord;

// Fetch all metrics for a specific task
export function useTaskMetrics(taskId: string) {
  return useQuery({
    queryKey: ["task-metrics", taskId],
    queryFn: () =>
      api
        .get<ApiTaskMetric[]>(`/api/task-metrics?taskId=${taskId}`)
        .then((metrics) => metrics.map(normalizeTaskMetric)),
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
      field_type: TaskMetricFieldType;
      unit?: string;
      order_index?: number;
    }) =>
      api
        .post<ApiTaskMetric>("/api/task-metrics", {
          taskId: metric.task_id,
          label: metric.label,
          fieldType: metric.field_type,
          unit: metric.unit,
          orderIndex: metric.order_index,
        })
        .then(normalizeTaskMetric),
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
      api
        .patch<ApiTaskMetric>(`/api/task-metrics/${id}`, {
          ...(updates.task_id !== undefined && { taskId: updates.task_id }),
          ...(updates.label !== undefined && { label: updates.label }),
          ...(updates.field_type !== undefined && {
            fieldType: updates.field_type,
          }),
          ...(updates.unit !== undefined && { unit: updates.unit }),
          ...(updates.order_index !== undefined && {
            orderIndex: updates.order_index,
          }),
        })
        .then(normalizeTaskMetric),
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

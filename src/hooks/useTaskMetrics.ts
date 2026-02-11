import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        queryFn: async () => {
            const { data, error } = await supabase
                .from("custom_task_metrics")
                .select("*")
                .eq("task_id", taskId)
                .order("order_index", { ascending: true });

            if (error) throw error;
            return data as TaskMetric[];
        },
        enabled: !!taskId,
    });
}

// Add a new metric to a task
export function useAddTaskMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (metric: {
            task_id: string;
            label: string;
            field_type: TaskMetric["field_type"];
            unit?: string;
            order_index?: number;
        }) => {
            const { data, error } = await supabase
                .from("custom_task_metrics")
                .insert([metric])
                .select()
                .single();

            if (error) throw error;
            return data as TaskMetric;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["task-metrics", data.task_id] });
        },
    });
}

// Update an existing metric
export function useUpdateTaskMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            updates,
        }: {
            id: string;
            updates: Partial<Omit<TaskMetric, "id" | "user_id" | "created_at" | "updated_at">>;
        }) => {
            const { data, error } = await supabase
                .from("custom_task_metrics")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data as TaskMetric;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["task-metrics", data.task_id] });
        },
    });
}

// Delete a metric
export function useDeleteTaskMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
            const { error } = await supabase
                .from("custom_task_metrics")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return { id, taskId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["task-metrics", data.taskId] });
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
            // Update all metrics with their new order
            const promises = metrics.map(({ id, order_index }) =>
                supabase
                    .from("custom_task_metrics")
                    .update({ order_index })
                    .eq("id", id)
            );

            const results = await Promise.all(promises);
            const errors = results.filter((r) => r.error);

            if (errors.length > 0) {
                throw errors[0].error;
            }

            return { taskId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["task-metrics", data.taskId] });
        },
    });
}

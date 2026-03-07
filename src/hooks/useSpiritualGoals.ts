import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Drizzle returns camelCase column names matching the schema definition
export interface SpiritualGoal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  progress: number;
  isCompleted: boolean;
  category: string;
  createdAt: string;
}

export function useSpiritualGoals() {
  return useQuery({
    queryKey: ["spiritual-goals"],
    queryFn: () => api.get<SpiritualGoal[]>("/api/spiritual-goals"),
  });
}

export function useAddSpiritualGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      category,
      targetDate,
    }: {
      title: string;
      category: string;
      targetDate?: Date;
    }) =>
      api.post<SpiritualGoal>("/api/spiritual-goals", {
        title,
        category,
        targetDate: targetDate?.toISOString().split("T")[0],
        progress: 0,
        isCompleted: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-goals"] });
    },
  });
}

export function useUpdateGoalProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      progress,
      isCompleted,
    }: {
      id: string;
      progress: number;
      isCompleted: boolean;
    }) =>
      api.patch<SpiritualGoal>(`/api/spiritual-goals/${id}`, {
        progress,
        isCompleted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-goals"] });
    },
  });
}

export function useDeleteSpiritualGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/spiritual-goals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-goals"] });
    },
  });
}

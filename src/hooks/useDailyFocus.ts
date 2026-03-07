import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DailyFocus {
  id: string;
  user_id: string;
  date: string;
  reference: string;
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useDailyFocus() {
  return useQuery({
    queryKey: ["daily-focus"],
    queryFn: () => {
      const today = new Date().toLocaleDateString("en-CA");
      return api.get<DailyFocus | null>(`/api/daily-focus?date=${today}`);
    },
  });
}

export function useSetDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reference, content }: { reference: string; content: string }) =>
      api.post<DailyFocus>("/api/daily-focus", { reference, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
    },
  });
}

export function useCompleteDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      api.patch<DailyFocus>(`/api/daily-focus/${id}`, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
    },
  });
}

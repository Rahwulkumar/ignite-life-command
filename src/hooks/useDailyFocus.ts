import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  normalizeDailyFocus,
  type ApiDailyFocus,
  type DailyFocusRecord,
} from "@/lib/api-normalizers";

type DailyFocus = DailyFocusRecord;

export function useDailyFocus() {
  return useQuery({
    queryKey: ["daily-focus"],
    queryFn: () => {
      const today = new Date().toLocaleDateString("en-CA");
      return api
        .get<ApiDailyFocus | null>(`/api/daily-focus?date=${today}`)
        .then((focus) => (focus ? normalizeDailyFocus(focus) : null));
    },
  });
}

export function useSetDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reference, content }: { reference: string; content: string }) =>
      api
        .post<ApiDailyFocus>("/api/daily-focus", { reference, content })
        .then(normalizeDailyFocus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
    },
  });
}

export function useCompleteDailyFocus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      api
        .patch<ApiDailyFocus>(`/api/daily-focus/${id}`, { completed })
        .then(normalizeDailyFocus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
    },
  });
}

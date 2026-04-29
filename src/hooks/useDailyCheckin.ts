import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface DailyCheckinTaskDescriptor {
  taskId: string;
  label: string;
  domain: string;
  state: "pending" | "needs_details";
}

export interface DailyCheckinState {
  due: boolean;
  sessionId: string | null;
  sessionDate: string;
  timezone: string;
  status: string | null;
  promptText: string | null;
  pendingTasks: DailyCheckinTaskDescriptor[];
  answeredAt: string | null;
  channels: string[];
}

interface DailyCheckinResponsePayload {
  session: DailyCheckinState;
  capture: {
    replyText: string;
    parsedIntent: Record<string, unknown>;
  };
}

export function useDailyCheckin() {
  return useQuery({
    queryKey: ["daily-checkin", "today"],
    queryFn: () => api.get<DailyCheckinState>("/api/daily-checkin/today"),
    staleTime: 60_000,
  });
}

export function useSubmitDailyCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      api.post<DailyCheckinResponsePayload>("/api/daily-checkin/respond", { text }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-checkin", "today"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-entries"] });
      queryClient.invalidateQueries({ queryKey: ["checklist-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

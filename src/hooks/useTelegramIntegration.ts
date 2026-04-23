import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type TelegramConnectionStatus =
  | "unconfigured"
  | "not-linked"
  | "pending"
  | "linked";

export interface TelegramConnectionState {
  configured: boolean;
  voiceTranscriptionEnabled: boolean;
  geminiIntentEnabled: boolean;
  status: TelegramConnectionStatus;
  botUsername: string | null;
  botUrl: string | null;
  deepLinkUrl: string | null;
  linkCode: string | null;
  linkCodeExpiresAt: string | null;
  telegramUsername: string | null;
  telegramChatId: string | null;
  linkedAt: string | null;
}

const QUERY_KEY = ["telegram-connection"];

export function useTelegramConnection() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      api.get<TelegramConnectionState>("/api/integrations/telegram/connection"),
    refetchInterval: (query) =>
      query.state.data?.status === "pending" ? 5000 : false,
  });
}

export function useGenerateTelegramLinkCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<TelegramConnectionState>("/api/integrations/telegram/link-code", {}),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}

export function useDisconnectTelegram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete<TelegramConnectionState>("/api/integrations/telegram/connection"),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
}

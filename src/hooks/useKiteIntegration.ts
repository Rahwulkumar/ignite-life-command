import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface KiteConnectionState {
  configured: boolean;
  status: "unconfigured" | "not-linked" | "connected" | "expired" | "error";
  provider: "kite";
  providerUserId: string | null;
  accountLabel: string | null;
  lastSyncedAt: string | null;
  connectedAt: string | null;
  tokenExpiresAt: string | null;
  lastError: string | null;
}

interface KiteConnectUrlResponse {
  loginUrl: string;
}

interface KiteSyncResponse extends KiteConnectionState {
  sync: {
    holdingsCount: number;
    tradesCount: number;
    portfolioValue: number;
  };
}

export function useKiteConnection() {
  return useQuery({
    queryKey: ["kite-connection"],
    queryFn: () =>
      api.get<KiteConnectionState>("/api/integrations/kite/connection"),
  });
}

export function useGetKiteConnectUrl() {
  return useMutation({
    mutationFn: () =>
      api.get<KiteConnectUrlResponse>("/api/integrations/kite/connect-url"),
  });
}

export function useSyncKiteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<KiteSyncResponse>("/api/integrations/kite/sync", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kite-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

export function useDisconnectKiteConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete<KiteConnectionState>("/api/integrations/kite/connection"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kite-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

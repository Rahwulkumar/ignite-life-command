import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface GrowwConnectionState {
  configured: boolean;
  status: "unconfigured" | "not-linked" | "connected" | "expired" | "error";
  provider: "groww";
  providerUserId: string | null;
  accountLabel: string | null;
  lastSyncedAt: string | null;
  connectedAt: string | null;
  tokenExpiresAt: string | null;
  lastError: string | null;
  authMode: "access_token" | "api_key" | null;
}

interface GrowwSyncResponse extends GrowwConnectionState {
  sync: {
    holdingsCount: number;
    tradesCount: number;
    portfolioValue: number;
  };
}

export function useGrowwConnection() {
  return useQuery({
    queryKey: ["groww-connection"],
    queryFn: () =>
      api.get<GrowwConnectionState>("/api/integrations/groww/connection"),
  });
}

export function useConnectGrowwConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<GrowwSyncResponse>("/api/integrations/groww/connect", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groww-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

export function useSyncGrowwConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<GrowwSyncResponse>("/api/integrations/groww/sync", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groww-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

export function useDisconnectGrowwConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete<GrowwConnectionState>("/api/integrations/groww/connection"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groww-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}


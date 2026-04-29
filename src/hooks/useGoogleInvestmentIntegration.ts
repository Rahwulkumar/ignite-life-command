import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface GoogleInvestmentConnectionState {
  configured: boolean;
  status: "unconfigured" | "not-linked" | "connected" | "expired" | "error";
  provider: "google-investments";
  email: string | null;
  scope: string | null;
  lastSyncedAt: string | null;
  connectedAt: string | null;
  tokenExpiresAt: string | null;
  lastError: string | null;
  metadata: Record<string, unknown>;
}

interface GoogleInvestmentConnectUrlResponse {
  loginUrl: string;
}

export interface GoogleInvestmentSyncResult {
  messagesMatched: number;
  messagesProcessed: number;
  transactionsExtracted: number;
  attachmentOnlyMessages: number;
  holdingsUpdated: number;
  navRowsUpdated: number;
  navError: string | null;
}

interface GoogleInvestmentSyncResponse extends GoogleInvestmentConnectionState {
  sync: GoogleInvestmentSyncResult;
}

export function useGoogleInvestmentConnection() {
  return useQuery({
    queryKey: ["google-investment-connection"],
    queryFn: () =>
      api.get<GoogleInvestmentConnectionState>(
        "/api/integrations/google-investments/connection",
      ),
  });
}

export function useGetGoogleInvestmentConnectUrl() {
  return useMutation({
    mutationFn: () =>
      api.get<GoogleInvestmentConnectUrlResponse>(
        "/api/integrations/google-investments/connect-url",
      ),
  });
}

export function useSyncGoogleInvestments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.post<GoogleInvestmentSyncResponse>(
        "/api/integrations/google-investments/sync",
        {},
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-investment-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

export function useDisconnectGoogleInvestments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      api.delete<GoogleInvestmentConnectionState>(
        "/api/integrations/google-investments/connection",
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["google-investment-connection"] });
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

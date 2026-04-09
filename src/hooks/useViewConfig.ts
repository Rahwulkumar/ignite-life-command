import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ApiViewConfig<TValue> {
  id: string;
  userId: string;
  viewKey: string;
  schemaVersion: number;
  layout: TValue;
  createdAt: string;
  updatedAt: string;
}

interface UseViewConfigOptions<TValue> {
  viewKey: string;
  defaultValue: TValue;
  normalize: (value: TValue | null | undefined) => TValue;
  schemaVersion?: number;
  enabled?: boolean;
}

function getViewConfigPath(viewKey: string) {
  return `/api/view-configs/${encodeURIComponent(viewKey)}`;
}

export function useViewConfig<TValue>({
  viewKey,
  defaultValue,
  normalize,
  schemaVersion = 1,
  enabled = true,
}: UseViewConfigOptions<TValue>) {
  const queryClient = useQueryClient();
  const queryKey = ["view-config", viewKey];

  const query = useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      const config = await api.get<ApiViewConfig<TValue> | null>(
        getViewConfigPath(viewKey),
      );
      return normalize(config?.layout);
    },
    staleTime: 0,
  });

  const save = useMutation({
    mutationFn: async (value: TValue) =>
      api.put<ApiViewConfig<TValue>>(getViewConfigPath(viewKey), {
        schemaVersion,
        layout: value,
      }),
    onSuccess: (config) => {
      queryClient.setQueryData(queryKey, normalize(config.layout));
    },
  });

  const reset = useMutation({
    mutationFn: async () =>
      api.delete<{ success: boolean }>(getViewConfigPath(viewKey)),
    onSuccess: () => {
      queryClient.setQueryData(queryKey, defaultValue);
    },
  });

  return {
    value: query.data ?? defaultValue,
    isLoading: query.isLoading,
    isSaving: save.isPending,
    isResetting: reset.isPending,
    saveValue: save.mutateAsync,
    resetValue: reset.mutateAsync,
  };
}

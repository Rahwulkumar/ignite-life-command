import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  normalizeScriptureVerse,
  type ApiScriptureVerse,
  type ScriptureVerseRecord,
} from "@/lib/api-normalizers";

export type ScriptureVerse = ScriptureVerseRecord;

export function useScriptureVerses() {
  return useQuery({
    queryKey: ["scripture-memory"],
    queryFn: () =>
      api
        .get<ApiScriptureVerse[]>("/api/scripture-verses")
        .then((verses) => verses.map(normalizeScriptureVerse)),
  });
}

export function useAddVerse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reference, text }: { reference: string; text: string }) =>
      api
        .post<ApiScriptureVerse>("/api/scripture-verses", {
          reference,
          verseText: text,
          masteryLevel: 0,
        })
        .then(normalizeScriptureVerse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripture-memory"] });
    },
  });
}

export function useUpdateVerseProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      masteryLevel,
    }: {
      id: string;
      masteryLevel: number;
      correct: boolean;
    }) =>
      api
        .patch<ApiScriptureVerse>(`/api/scripture-verses/${id}`, {
          masteryLevel,
        })
        .then(normalizeScriptureVerse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripture-memory"] });
    },
  });
}

export function useDeleteVerse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/scripture-verses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scripture-memory"] });
    },
  });
}

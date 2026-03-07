import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface ScriptureVerse {
  id: string;
  user_id: string;
  reference: string;
  verse_text: string;
  mastery_level: number;
  created_at: string;
  updated_at: string;
}

export function useScriptureVerses() {
  return useQuery({
    queryKey: ["scripture-memory"],
    queryFn: () => api.get<ScriptureVerse[]>("/api/scripture-verses"),
  });
}

export function useAddVerse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reference, text }: { reference: string; text: string }) =>
      api.post<ScriptureVerse>("/api/scripture-verses", {
        reference,
        verseText: text,
        masteryLevel: 0,
      }),
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
      api.patch<ScriptureVerse>(`/api/scripture-verses/${id}`, { masteryLevel }),
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  normalizeNote,
  type ApiNoteRecord,
  type NoteRecord,
} from "@/lib/api-normalizers";

// Journal entries are stored in office_notes with domain='spiritual', noteType='journal'
export type JournalEntry = NoteRecord;

export function useSpiritualJournal() {
  return useQuery({
    queryKey: ["spiritual-journal"],
    queryFn: () =>
      api
        .get<ApiNoteRecord[]>("/api/notes?domain=spiritual&noteType=journal")
        .then((entries) => entries.map(normalizeNote)),
  });
}

export function useAddJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      api
        .post<ApiNoteRecord>("/api/notes", {
          title,
          content: { body: content },
          domain: "spiritual",
          noteType: "journal",
        })
        .then(normalizeNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-journal"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-journal"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Journal entries are stored in office_notes with domain='spiritual', noteType='journal'
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: unknown;
  icon: string | null;
  domain: string | null;
  note_type: string | null;
  is_pinned: boolean | null;
  created_at: string;
  updated_at: string;
}

export function useSpiritualJournal() {
  return useQuery({
    queryKey: ["spiritual-journal"],
    queryFn: () =>
      api.get<JournalEntry[]>("/api/notes?domain=spiritual&noteType=journal"),
  });
}

export function useAddJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      api.post<JournalEntry>("/api/notes", {
        title,
        content: { body: content },
        domain: "spiritual",
        noteType: "journal",
      }),
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

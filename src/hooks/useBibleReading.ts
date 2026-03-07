import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Drizzle returns camelCase column names matching the schema definition
export interface BibleReadingPlan {
  id: string;
  userId: string;
  name: string;
  totalChapters: number | null;
  completedChapters: number | null;
  currentBook: string;
  currentChapter: number | null;
  currentVerse: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export function useBibleReadingPlan() {
  return useQuery({
    queryKey: ["bible-reading-plan"],
    queryFn: () => api.get<BibleReadingPlan | null>("/api/bible-reading-plans"),
  });
}

export function useUpdateBibleProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      currentBook,
      currentChapter,
      currentVerse,
    }: {
      id: string;
      currentBook: string;
      currentChapter: number;
      currentVerse: number;
    }) =>
      api.patch<BibleReadingPlan>(`/api/bible-reading-plans/${id}`, {
        currentBook,
        currentChapter,
        currentVerse,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bible-reading-plan"] });
    },
  });
}

export function useCreateBiblePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookName,
      chapter = 1,
      verse = 1,
    }: {
      bookName: string;
      chapter?: number;
      verse?: number;
    }) =>
      api.post<BibleReadingPlan>("/api/bible-reading-plans", {
        name: `Reading ${bookName}`,
        currentBook: bookName,
        currentChapter: chapter,
        currentVerse: verse,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bible-reading-plan"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type BibleReadingPlan = Database["public"]["Tables"]["bible_reading_plans"]["Row"];

export function useBibleReadingPlan() {
    return useQuery({
        queryKey: ["bible-reading-plan"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("bible_reading_plans")
                .select("*")
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows found"
            return data as BibleReadingPlan | null;
        },
    });
}

export function useUpdateBibleProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            currentBook,
            currentChapter,
            currentVerse,
        }: {
            id: string;
            currentBook: string;
            currentChapter: number;
            currentVerse: number;
        }) => {
            const { data, error } = await supabase
                .from("bible_reading_plans")
                .update({
                    current_book: currentBook,
                    current_chapter: currentChapter,
                    current_verse: currentVerse,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bible-reading-plan"] });
        },
    });
}

export function useCreateBiblePlan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookName,
            chapter = 1,
            verse = 1,
        }: {
            bookName: string;
            chapter?: number;
            verse?: number;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase
                .from("bible_reading_plans")
                .insert({
                    name: `Reading ${bookName}`,
                    current_book: bookName,
                    current_chapter: chapter,
                    current_verse: verse,
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bible-reading-plan"] });
        },
    });
}

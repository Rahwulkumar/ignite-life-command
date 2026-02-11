import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Reusing office_notes table with domain='spiritual' and note_type='journal'
type JournalEntry = Database["public"]["Tables"]["office_notes"]["Row"];

export function useSpiritualJournal() {
    return useQuery({
        queryKey: ["spiritual-journal"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("office_notes")
                .select("*")
                .eq("domain", "spiritual")
                .eq("note_type", "journal")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as JournalEntry[];
        },
    });
}

export function useAddJournalEntry() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ title, content }: { title: string; content: string }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            // Content is JSONB, so we wrap the string content
            const contentJson = { body: content };

            const { data, error } = await supabase
                .from("office_notes")
                .insert({
                    title,
                    content: contentJson,
                    domain: "spiritual",
                    note_type: "journal",
                    user_id: user.id,
                    is_pinned: false,
                    is_template: false,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-journal"] });
        },
    });
}

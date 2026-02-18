import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type DailyFocus = Database["public"]["Tables"]["daily_focus"]["Row"];

export function useDailyFocus() {
    return useQuery({
        queryKey: ["daily-focus"],
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from("daily_focus")
                .select("*")
                .eq("date", today)
                .maybeSingle();

            if (error && error.code !== "PGRST116") throw error;
            return data as DailyFocus | null;
        },
    });
}

export function useSetDailyFocus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reference, content }: { reference: string; content: string }) => {
            console.log("Attempting to set Daily Focus:", { reference, content });
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("Auth Error:", authError);
                throw new Error("User not authenticated");
            }
            console.log("User authenticated:", user.id);

            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from("daily_focus")
                .upsert({
                    user_id: user.id,
                    date: today,
                    reference,
                    content,
                    completed: false
                })
                .select()
                .single();

            if (error) {
                console.error("Supabase Write Error:", error);
                console.log("Error Code:", error.code);
                console.log("Error Message:", error.message);
                console.log("Error Details:", error.details);
                throw error;
            }

            console.log("Write Successful:", data);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
        },
        onError: (err) => {
            console.error("Mutation Failed:", err);
        }
    });
}

export function useCompleteDailyFocus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
            const { data, error } = await supabase
                .from("daily_focus")
                .update({ completed })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["daily-focus"] });
        },
    });
}

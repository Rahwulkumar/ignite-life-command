import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type SpiritualGoal = Database["public"]["Tables"]["spiritual_goals"]["Row"];

export function useSpiritualGoals() {
    return useQuery({
        queryKey: ["spiritual-goals"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("spiritual_goals")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data as SpiritualGoal[];
        },
    });
}

export function useAddSpiritualGoal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ title, category, targetDate }: { title: string; category: string; targetDate?: Date }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase
                .from("spiritual_goals")
                .insert({
                    title,
                    category,
                    target_date: targetDate?.toISOString(),
                    progress: 0,
                    is_completed: false,
                    user_id: user.id,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-goals"] });
        },
    });
}

export function useUpdateGoalProgress() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, progress, isCompleted }: { id: string; progress: number; isCompleted: boolean }) => {
            const { data, error } = await supabase
                .from("spiritual_goals")
                .update({
                    progress,
                    is_completed: isCompleted,
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-goals"] });
        },
    });
}

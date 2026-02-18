import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SpiritualCharacter {
    id: string;
    name: string;
    description: string | null;
    role: string | null;
    testament: string | null;
    notion_folder_id: string | null;
    created_at: string;
    user_id: string;
}

export interface CreateCharacterInput {
    name: string;
    description?: string | null;
    role?: string | null;
    testament?: string | null;
}

// Fetch all spiritual characters (stored in office_notes with markers)
export function useSpiritualCharacters() {
    return useQuery({
        queryKey: ["spiritual-characters"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("office_notes")
                .select("*")
                .eq("domain", "spiritual")
                .eq("note_type", "character")
                .not("content", "is", null);

            if (error) throw error;

            // Filter for character entries and map to our interface
            const characters = (data || [])
                .filter((note: any) => {
                    const content = note.content as any;
                    return content?.type === "character";
                })
                .map((note: any) => {
                    const content = note.content as any;
                    return {
                        id: note.id,
                        name: note.title,
                        description: content.description || null,
                        role: content.role || null,
                        testament: content.testament || null,
                        notion_folder_id: note.parent_id,
                        created_at: note.created_at,
                        user_id: note.user_id
                    } as SpiritualCharacter;
                });

            return characters;
        },
    });
}

// Fetch a single spiritual character (from office_notes)
export function useSpiritualCharacter(id: string | undefined) {
    return useQuery({
        queryKey: ["spiritual-character", id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from("office_notes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) throw error;
            if (!data) return null;

            const content = data.content as any;
            return {
                id: data.id,
                name: data.title,
                description: content?.description || null,
                role: content?.role || null,
                testament: content?.testament || null,
                notion_folder_id: data.parent_id,
                created_at: data.created_at,
                user_id: data.user_id
            } as SpiritualCharacter;
        },
        enabled: !!id,
    });
}

// Create a new spiritual character (stored in office_notes)
export function useCreateCharacter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newCharacter: CreateCharacterInput) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase
                .from("office_notes")
                .insert({
                    title: newCharacter.name,
                    domain: "spiritual",
                    note_type: "character",
                    content: {
                        type: "character",
                        description: newCharacter.description || null,
                        role: newCharacter.role || null,
                        testament: newCharacter.testament || null
                    },
                    user_id: user.id
                })
                .select()
                .single();

            if (error) throw error;

            // Map back to SpiritualCharacter interface
            const content = data.content as any;
            return {
                id: data.id,
                name: data.title,
                description: content.description || null,
                role: content.role || null,
                testament: content.testament || null,
                notion_folder_id: data.parent_id,
                created_at: data.created_at,
                user_id: data.user_id
            } as SpiritualCharacter;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
        },
    });
}

// Delete a spiritual character
export function useDeleteCharacter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (characterId: string) => {
            const { error } = await supabase
                .from("office_notes")
                .delete()
                .eq("id", characterId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
}

// Ensure a folder exists for the character in office_notes
export function useEnsureCharacterFolder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (character: SpiritualCharacter) => {
            if (character.notion_folder_id) return character.notion_folder_id;

            // 1. Check/Create "Character Studies" root folder (Using standard table access as office_notes is fine)
            const { data: rootFolder } = await supabase
                .from("office_notes")
                .select("id")
                .eq("title", "Character Studies")
                .eq("domain", "spiritual")
                .is("parent_id", null)
                .maybeSingle();

            let rootId = rootFolder?.id;

            if (!rootId) {
                const { data: newRoot, error: createRootError } = await supabase
                    .from("office_notes")
                    .insert({
                        title: "Character Studies",
                        domain: "spiritual",
                        note_type: "hub",
                        icon: "📚",
                    })
                    .select("id")
                    .single();

                if (createRootError) throw createRootError;
                rootId = newRoot.id;
            }

            // 2. Create Character Folder under Root
            const { data: charFolder, error: charFolderError } = await supabase
                .from("office_notes")
                .insert({
                    title: character.name,
                    domain: "spiritual",
                    parent_id: rootId,
                    note_type: "hub",
                    icon: "👤",
                })
                .select("id")
                .single();

            if (charFolderError) throw charFolderError;

            // 3. Link folder by updating parent_id
            const { error: updateError } = await supabase
                .from("office_notes")
                .update({ parent_id: charFolder.id })
                .eq("id", character.id);

            if (updateError) throw updateError;

            return charFolder.id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: Json | null;
  parent_id: string | null;
  icon: string | null;
  cover_image: string | null;
  is_pinned: boolean | null;
  is_template: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// Fetch all notes
export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("office_notes")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
  });
}

// Fetch a single note
export function useNote(noteId: string | null) {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: async () => {
      if (!noteId) return null;
      const { data, error } = await supabase
        .from("office_notes")
        .select("*")
        .eq("id", noteId)
        .single();

      if (error) throw error;
      return data as Note;
    },
    enabled: !!noteId,
  });
}

// Search notes
export function useSearchNotes(searchQuery: string) {
  return useQuery({
    queryKey: ["notes-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const { data, error } = await supabase
        .from("office_notes")
        .select("*")
        .ilike("title", `%${searchQuery}%`)
        .order("updated_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Note[];
    },
    enabled: searchQuery.length > 0,
  });
}

// Create note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title = "Untitled",
      parent_id = null,
      icon = "📝",
      is_template = false,
      content = null,
    }: {
      title?: string;
      parent_id?: string | null;
      icon?: string;
      is_template?: boolean;
      content?: Json | null;
    }) => {
      const { data, error } = await supabase
        .from("office_notes")
        .insert({
          title,
          parent_id,
          icon,
          is_template,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Update note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      title?: string;
      content?: Json | null;
      icon?: string;
      cover_image?: string | null;
      is_pinned?: boolean;
      parent_id?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("office_notes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Note;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", data.id] });
    },
  });
}

// Delete note
export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase
        .from("office_notes")
        .delete()
        .eq("id", noteId);

      if (error) throw error;
      return noteId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Build tree structure from flat notes
export function buildNoteTree(notes: Note[]): (Note & { children: Note[] })[] {
  const noteMap = new Map<string, Note & { children: Note[] }>();
  const rootNotes: (Note & { children: Note[] })[] = [];

  // First pass: create map with children array
  notes.forEach((note) => {
    noteMap.set(note.id, { ...note, children: [] });
  });

  // Second pass: build tree
  notes.forEach((note) => {
    const noteWithChildren = noteMap.get(note.id)!;
    if (note.parent_id && noteMap.has(note.parent_id)) {
      noteMap.get(note.parent_id)!.children.push(noteWithChildren);
    } else {
      rootNotes.push(noteWithChildren);
    }
  });

  return rootNotes;
}

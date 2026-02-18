import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { DOMAINS, type DomainId } from "@/lib/domains";

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
  domain: DomainId | null;
  note_type: 'hub' | 'page' | 'journal' | 'folder' | null;
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

// Fetch notes by domain
export function useNotesByDomain(domain: DomainId | null) {
  return useQuery({
    queryKey: ["notes", "domain", domain],
    queryFn: async () => {
      if (!domain) return [];

      const { data, error } = await supabase
        .from("office_notes")
        .select("*")
        .eq("domain", domain)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Note[];
    },
    enabled: !!domain,
  });
}

// Fetch journal entries by domain
export function useJournalEntries(domain?: DomainId) {
  return useQuery({
    queryKey: ["notes", "journal", domain],
    queryFn: async () => {
      let query = supabase
        .from("office_notes")
        .select("*")
        .eq("note_type", "journal")
        .order("created_at", { ascending: false });

      if (domain) {
        query = query.eq("domain", domain);
      }

      const { data, error } = await query;
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

// Search notes (optionally filtered by domain)
export function useSearchNotes(searchQuery: string, domain?: DomainId | null) {
  return useQuery({
    queryKey: ["notes-search", searchQuery, domain],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      let query = supabase
        .from("office_notes")
        .select("*")
        .ilike("title", `%${searchQuery}%`);

      if (domain) {
        query = query.eq("domain", domain);
      }

      const { data, error } = await query
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
      icon = null,
      is_template = false,
      content = null,
      domain = null,
      note_type = 'page',
    }: {
      title?: string;
      parent_id?: string | null;
      icon?: string | null;
      is_template?: boolean;
      content?: Json | null;
      domain?: DomainId | null;
      note_type?: 'hub' | 'page' | 'journal' | 'folder';
    }) => {
      const { data, error } = await supabase
        .from("office_notes")
        .insert({
          title,
          parent_id,
          icon,
          is_template,
          content,
          domain,
          note_type,
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
      domain?: DomainId | null;
      note_type?: 'hub' | 'page' | 'journal' | 'folder';
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

// Initialize domain hubs
export function useInitializeHubs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (existingNotes: Note[]) => {
      const existingHubs = existingNotes.filter(n => n.note_type === 'hub');
      const existingDomains = new Set(existingHubs.map(h => h.domain));

      const hubsToCreate = DOMAINS.filter(d => !existingDomains.has(d.id));

      if (hubsToCreate.length === 0) return [];

      const createdHubs = await Promise.all(
        hubsToCreate.map(domain =>
          supabase
            .from("office_notes")
            .insert({
              title: `${domain.label} Hub`,
              icon: null,
              domain: domain.id,
              note_type: 'hub',
            })
            .select()
            .single()
        )
      );

      return createdHubs.map(r => r.data as Note);
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

// Get notes grouped by domain
export function groupNotesByDomain(notes: Note[]) {
  const grouped: Record<DomainId, { hub: Note | null; pages: Note[]; journal: Note[] }> = {
    spiritual: { hub: null, pages: [], journal: [] },
    trading: { hub: null, pages: [], journal: [] },
    tech: { hub: null, pages: [], journal: [] },
    finance: { hub: null, pages: [], journal: [] },
    music: { hub: null, pages: [], journal: [] },
    projects: { hub: null, pages: [], journal: [] },
    content: { hub: null, pages: [], journal: [] },
    general: { hub: null, pages: [], journal: [] },
  };

  notes.forEach(note => {
    if (!note.domain) return;

    const domain = note.domain as DomainId;
    if (!grouped[domain]) return;

    if (note.note_type === 'hub') {
      grouped[domain].hub = note;
    } else if (note.note_type === 'journal') {
      grouped[domain].journal.push(note);
    } else {
      grouped[domain].pages.push(note);
    }
  });

  return grouped;
}

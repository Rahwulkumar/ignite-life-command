import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Json } from "@/lib/types";
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
  note_type: "hub" | "page" | "journal" | "folder" | null;
  created_at: string | null;
  updated_at: string | null;
}

// Fetch all notes
export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: () => api.get<Note[]>("/api/notes"),
  });
}

// Fetch notes by domain
export function useNotesByDomain(domain: DomainId | null) {
  return useQuery({
    queryKey: ["notes", "domain", domain],
    queryFn: () =>
      api.get<Note[]>(`/api/notes?domain=${domain}`),
    enabled: !!domain,
  });
}

// Fetch journal entries
export function useJournalEntries(domain?: DomainId) {
  return useQuery({
    queryKey: ["notes", "journal", domain],
    queryFn: () => {
      const params = new URLSearchParams({ noteType: "journal" });
      if (domain) params.append("domain", domain);
      return api.get<Note[]>(`/api/notes?${params.toString()}`);
    },
  });
}

// Fetch a single note
export function useNote(noteId: string | null) {
  return useQuery({
    queryKey: ["note", noteId],
    queryFn: () => api.get<Note>(`/api/notes/${noteId}`),
    enabled: !!noteId,
  });
}

// Search notes
export function useSearchNotes(searchQuery: string, domain?: DomainId | null) {
  return useQuery({
    queryKey: ["notes-search", searchQuery, domain],
    queryFn: () => {
      const params = new URLSearchParams({ search: searchQuery });
      if (domain) params.append("domain", domain);
      return api.get<Note[]>(`/api/notes?${params.toString()}`);
    },
    enabled: searchQuery.length > 0,
  });
}

// Create note
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title = "Untitled",
      parent_id = null,
      icon = null,
      is_template = false,
      content = null,
      domain = null,
      note_type = "page",
    }: {
      title?: string;
      parent_id?: string | null;
      icon?: string | null;
      is_template?: boolean;
      content?: Json | null;
      domain?: DomainId | null;
      note_type?: "hub" | "page" | "journal" | "folder";
    }) =>
      api.post<Note>("/api/notes", {
        title,
        parentId: parent_id,
        icon,
        isTemplate: is_template,
        content,
        domain,
        noteType: note_type,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Update note
export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
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
      note_type?: "hub" | "page" | "journal" | "folder";
    }) =>
      api.patch<Note>(`/api/notes/${id}`, {
        title: updates.title,
        content: updates.content,
        icon: updates.icon,
        coverImage: updates.cover_image,
        isPinned: updates.is_pinned,
        parentId: updates.parent_id,
        domain: updates.domain,
        noteType: updates.note_type,
      }),
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
    mutationFn: (noteId: string) =>
      api.delete<{ success: boolean }>(`/api/notes/${noteId}`),
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
      const existingHubs = existingNotes.filter((n) => n.note_type === "hub");
      const existingDomains = new Set(existingHubs.map((h) => h.domain));

      const hubsToCreate = DOMAINS.filter((d) => !existingDomains.has(d.id));
      if (hubsToCreate.length === 0) return [];

      return Promise.all(
        hubsToCreate.map((domain) =>
          api.post<Note>("/api/notes", {
            title: `${domain.label} Hub`,
            icon: null,
            domain: domain.id,
            noteType: "hub",
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

// Build tree structure from flat notes
export function buildNoteTree(
  notes: Note[]
): (Note & { children: Note[] })[] {
  const noteMap = new Map<string, Note & { children: Note[] }>();
  const rootNotes: (Note & { children: Note[] })[] = [];

  notes.forEach((note) => {
    noteMap.set(note.id, { ...note, children: [] });
  });

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
  const grouped: Record<
    DomainId,
    { hub: Note | null; pages: Note[]; journal: Note[] }
  > = {
    spiritual: { hub: null, pages: [], journal: [] },
    trading: { hub: null, pages: [], journal: [] },
    tech: { hub: null, pages: [], journal: [] },
    finance: { hub: null, pages: [], journal: [] },
    music: { hub: null, pages: [], journal: [] },
    projects: { hub: null, pages: [], journal: [] },
    content: { hub: null, pages: [], journal: [] },
    general: { hub: null, pages: [], journal: [] },
  };

  notes.forEach((note) => {
    if (!note.domain) return;
    const domain = note.domain as DomainId;
    if (!grouped[domain]) return;
    if (note.note_type === "hub") {
      grouped[domain].hub = note;
    } else if (note.note_type === "journal") {
      grouped[domain].journal.push(note);
    } else {
      grouped[domain].pages.push(note);
    }
  });

  return grouped;
}

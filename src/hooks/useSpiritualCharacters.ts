import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface SpiritualCharacter {
  id: string;
  name: string;
  description: string | null;
  role: string | null;
  testament: string | null;
  notion_folder_id: string | null;
  created_at: string | null;
  user_id: string;
}

export interface CreateCharacterInput {
  name: string;
  description?: string | null;
  role?: string | null;
  testament?: string | null;
}

interface CharacterNote {
  id: string;
  user_id: string;
  title: string;
  content: {
    type: string;
    description?: string;
    role?: string;
    testament?: string;
  } | null;
  parent_id: string | null;
  domain: string | null;
  note_type: string | null;
  created_at: string | null;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function noteToCharacter(note: CharacterNote): SpiritualCharacter {
  return {
    id: note.id,
    name: note.title,
    description: note.content?.description ?? null,
    role: note.content?.role ?? null,
    testament: note.content?.testament ?? null,
    notion_folder_id: note.parent_id,
    created_at: note.created_at,
    user_id: note.user_id,
  };
}

// ── Hooks ────────────────────────────────────────────────────────────────────

/** Fetch all characters (notes with domain=spiritual, noteType=character) */
export function useSpiritualCharacters() {
  return useQuery({
    queryKey: ["spiritual-characters"],
    queryFn: async () => {
      const notes = await api.get<CharacterNote[]>(
        "/api/notes?domain=spiritual&noteType=character"
      );
      return notes
        .filter((note) => note.content?.type === "character")
        .map(noteToCharacter);
    },
  });
}

/** Fetch a single character by ID */
export function useSpiritualCharacter(id: string | undefined) {
  return useQuery({
    queryKey: ["spiritual-character", id],
    queryFn: async () => {
      const note = await api.get<CharacterNote>(`/api/notes/${id}`);
      return noteToCharacter(note);
    },
    enabled: !!id,
  });
}

/** Create a new character (stored as a note with noteType=character) */
export function useCreateSpiritualCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCharacterInput) =>
      api.post<CharacterNote>("/api/notes", {
        title: input.name,
        content: {
          type: "character",
          description: input.description,
          role: input.role,
          testament: input.testament,
        },
        domain: "spiritual",
        noteType: "character",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
    },
  });
}

/** Alias used by AddCharacterDialog */
export const useCreateCharacter = useCreateSpiritualCharacter;

/** Delete a character (deletes the underlying note) */
export function useDeleteSpiritualCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.delete<{ success: boolean }>(`/api/notes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
    },
  });
}

/** Alias used by CharacterCard */
export const useDeleteCharacter = useDeleteSpiritualCharacter;

/** Update a character's metadata */
export function useUpdateSpiritualCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateCharacterInput>;
    }) =>
      api.patch<CharacterNote>(`/api/notes/${id}`, {
        title: updates.name,
        content: {
          type: "character",
          ...(updates.description !== undefined && {
            description: updates.description,
          }),
          ...(updates.role !== undefined && { role: updates.role }),
          ...(updates.testament !== undefined && {
            testament: updates.testament,
          }),
        },
      }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
      queryClient.invalidateQueries({ queryKey: ["spiritual-character", id] });
    },
  });
}

/**
 * Ensures a "root folder" note exists for the character's workspace,
 * and returns its ID. Stores the folder ID as `parent_id` on the character note.
 * Used by CharacterWorkspacePage.
 */
export function useEnsureCharacterFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: SpiritualCharacter): Promise<string> => {
      // If already has a folder, return it
      if (character.notion_folder_id) return character.notion_folder_id;

      // Create the workspace root folder note
      const folder = await api.post<CharacterNote>("/api/notes", {
        title: `${character.name} — Workspace`,
        domain: "spiritual",
        noteType: "folder",
        content: { type: "character-workspace", characterId: character.id },
      });

      // Store folder ID on the character note itself via parent_id
      await api.patch(`/api/notes/${character.id}`, {
        parentId: folder.id,
      });

      return folder.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
    },
  });
}

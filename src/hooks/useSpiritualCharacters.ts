import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  normalizeNote,
  type ApiNoteRecord,
  type NoteRecord,
} from "@/lib/api-normalizers";
import type { Json } from "@/lib/types";

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

interface CharacterContent {
  type?: string;
  description?: string;
  role?: string;
  testament?: string;
  characterId?: string;
}

type CharacterNote = NoteRecord;

function getCharacterContent(content: Json | null): CharacterContent | null {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    return null;
  }

  return content as CharacterContent;
}

function noteToCharacter(note: CharacterNote): SpiritualCharacter {
  const content = getCharacterContent(note.content);

  return {
    id: note.id,
    name: note.title,
    description: content?.description ?? null,
    role: content?.role ?? null,
    testament: content?.testament ?? null,
    notion_folder_id: note.parent_id,
    created_at: note.created_at,
    user_id: note.user_id,
  };
}

/** Fetch all characters (notes with domain=spiritual, noteType=character) */
export function useSpiritualCharacters() {
  return useQuery({
    queryKey: ["spiritual-characters"],
    queryFn: async () => {
      const notes = await api.get<ApiNoteRecord[]>(
        "/api/notes?domain=spiritual&noteType=character",
      );

      return notes
        .map(normalizeNote)
        .filter((note) => getCharacterContent(note.content)?.type === "character")
        .map(noteToCharacter);
    },
  });
}

/** Fetch a single character by ID */
export function useSpiritualCharacter(id: string | undefined) {
  return useQuery({
    queryKey: ["spiritual-character", id],
    queryFn: async () => {
      const note = await api
        .get<ApiNoteRecord>(`/api/notes/${id}`)
        .then(normalizeNote);
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
      api
        .post<ApiNoteRecord>("/api/notes", {
          title: input.name,
          content: {
            type: "character",
            description: input.description,
            role: input.role,
            testament: input.testament,
          },
          domain: "spiritual",
          noteType: "character",
        })
        .then(normalizeNote),
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
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<CreateCharacterInput>;
    }) => {
      const existingNote = await api
        .get<ApiNoteRecord>(`/api/notes/${id}`)
        .then(normalizeNote);
      const existingContent = getCharacterContent(existingNote.content) ?? {
        type: "character",
      };

      return api
        .patch<ApiNoteRecord>(`/api/notes/${id}`, {
          ...(updates.name !== undefined && { title: updates.name }),
          content: {
            ...existingContent,
            type: "character",
            ...(updates.description !== undefined && {
              description: updates.description,
            }),
            ...(updates.role !== undefined && { role: updates.role }),
            ...(updates.testament !== undefined && {
              testament: updates.testament,
            }),
          },
        })
        .then(normalizeNote);
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
      queryClient.invalidateQueries({ queryKey: ["spiritual-character", id] });
    },
  });
}

/**
 * Ensures a root folder note exists for the character workspace
 * and returns its ID. The folder ID is stored as parent_id on the character note.
 */
export function useEnsureCharacterFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: SpiritualCharacter): Promise<string> => {
      if (character.notion_folder_id) return character.notion_folder_id;

      const folder = await api
        .post<ApiNoteRecord>("/api/notes", {
          title: `${character.name} - Workspace`,
          domain: "spiritual",
          noteType: "folder",
          content: { type: "character-workspace", characterId: character.id },
        })
        .then(normalizeNote);

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

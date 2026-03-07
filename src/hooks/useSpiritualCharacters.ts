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

// Characters are stored in office_notes with domain='spiritual', noteType='character'
export function useSpiritualCharacters() {
  return useQuery({
    queryKey: ["spiritual-characters"],
    queryFn: async () => {
      const notes = await api.get<CharacterNote[]>(
        "/api/notes?domain=spiritual&noteType=character"
      );
      return notes
        .filter((note) => note.content?.type === "character")
        .map((note) => ({
          id: note.id,
          name: note.title,
          description: note.content?.description ?? null,
          role: note.content?.role ?? null,
          testament: note.content?.testament ?? null,
          notion_folder_id: note.parent_id,
          created_at: note.created_at,
          user_id: note.user_id,
        })) as SpiritualCharacter[];
    },
  });
}

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spiritual-characters"] });
    },
  });
}

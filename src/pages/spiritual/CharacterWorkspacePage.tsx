import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { CharacterSidebar } from "@/components/spiritual/workspace/CharacterSidebar";
import { CharacterHeader } from "@/components/spiritual/workspace/CharacterHeader";
import { NoteEditor } from "@/components/notes/NoteEditor";
import {
  useSpiritualCharacter,
  useEnsureCharacterFolder,
} from "@/hooks/useSpiritualCharacters";
import { useNote, useUpdateNote } from "@/hooks/useNotes";
import { useDebouncedNoteSave } from "@/hooks/useDebouncedNoteSave";
import type { Json } from "@/lib/types";
import { Loader2, User } from "lucide-react";

export default function CharacterWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const { data: character, isLoading: charLoading } = useSpiritualCharacter(id);
  const ensureFolder = useEnsureCharacterFolder();
  const updateNote = useUpdateNote();

  const [rootFolderId, setRootFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const { data: selectedNote } = useNote(selectedNoteId);
  const saveNote = useCallback(
    (noteId: string, content: Json) =>
      updateNote.mutateAsync({ id: noteId, content }),
    [updateNote],
  );
  const { savingNoteId, scheduleSave, flushPendingSave } =
    useDebouncedNoteSave(saveNote);
  const isSaving = selectedNoteId !== null && savingNoteId === selectedNoteId;

  // Ensure folder exists and set root ID
  useEffect(() => {
    if (character && !rootFolderId) {
      if (character.notion_folder_id) {
        setRootFolderId(character.notion_folder_id);
      } else {
        ensureFolder.mutateAsync(character).then((folderId) => {
          setRootFolderId(folderId);
        });
      }
    }
  }, [character, rootFolderId, ensureFolder]);

  useEffect(() => {
    return () => {
      flushPendingSave();
    };
  }, [flushPendingSave, selectedNoteId]);

  const handleContentChange = (content: Json) => {
    if (selectedNoteId) {
      scheduleSave(selectedNoteId, content);
    }
  };

  const handleTitleChange = (title: string) => {
    if (selectedNoteId) {
      updateNote.mutate({ id: selectedNoteId, title });
    }
  };

  const handleIconChange = (icon: string) => {
    if (selectedNoteId) {
      updateNote.mutate({ id: selectedNoteId, icon });
    }
  };

  if (charLoading || !character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <CharacterHeader character={character} />

        <div className="flex flex-1 overflow-hidden">
          {rootFolderId ? (
            <CharacterSidebar
              character={character}
              rootFolderId={rootFolderId}
              selectedNoteId={selectedNoteId}
              onSelectNote={setSelectedNoteId}
            />
          ) : (
            <div className="w-64 border-r border-border/50 bg-card/30 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 bg-background overflow-hidden relative">
            {selectedNote ? (
              <NoteEditor
                key={selectedNote.id}
                note={selectedNote}
                onContentChange={handleContentChange}
                onTitleChange={handleTitleChange}
                onIconChange={handleIconChange}
                isSaving={isSaving}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center animate-in fade-in duration-500">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <User className="h-10 w-10 text-primary opacity-50" />
                </div>
                <h3 className="font-serif text-2xl mb-2 text-foreground">
                  Welcome to the workspace
                </h3>
                <p className="max-w-md">
                  Select a note from the sidebar to begin writing, or create a
                  new one to capture your thoughts on {character.name}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

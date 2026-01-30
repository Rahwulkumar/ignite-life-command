import { useState, useCallback, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNotes, useNote, useCreateNote, useUpdateNote, buildNoteTree, type Note } from "@/hooks/useNotes";
import { debounce } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

export default function NotesPage() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { data: notes = [], isLoading: notesLoading } = useNotes();
  const { data: selectedNote } = useNote(selectedNoteId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  const noteTree = buildNoteTree(notes.filter(n => !n.is_template)) as NoteWithChildren[];
  const templates = notes.filter(n => n.is_template);
  const pinnedNotes = notes.filter(n => n.is_pinned && !n.is_template);

  // Auto-select first note if none selected
  useEffect(() => {
    if (!selectedNoteId && notes.length > 0 && !notesLoading) {
      const nonTemplate = notes.find(n => !n.is_template);
      if (nonTemplate) {
        setSelectedNoteId(nonTemplate.id);
      }
    }
  }, [notes, selectedNoteId, notesLoading]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (id: string, content: Json) => {
      setIsSaving(true);
      await updateNote.mutateAsync({ id, content });
      setIsSaving(false);
    }, 500),
    [updateNote]
  );

  const handleContentChange = (content: Json) => {
    if (selectedNoteId) {
      debouncedSave(selectedNoteId, content);
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

  const handleCreateNote = async (parentId?: string) => {
    const note = await createNote.mutateAsync({
      title: "Untitled",
      parent_id: parentId || null,
    });
    setSelectedNoteId(note.id);
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    const template = notes.find(n => n.id === templateId);
    if (template) {
      const note = await createNote.mutateAsync({
        title: template.title.replace(" Template", ""),
        content: template.content,
        icon: template.icon || "📝",
      });
      setSelectedNoteId(note.id);
    }
  };

  const handleTogglePin = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote.mutate({ id: noteId, is_pinned: !note.is_pinned });
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <NotesSidebar
            notes={noteTree}
            templates={templates}
            pinnedNotes={pinnedNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={setSelectedNoteId}
            onCreateNote={handleCreateNote}
            onCreateFromTemplate={handleCreateFromTemplate}
            onTogglePin={handleTogglePin}
            isLoading={notesLoading}
          />

          {/* Editor Area */}
          <div className="flex-1 min-w-0">
            {selectedNote ? (
              <NoteEditor
                note={selectedNote}
                onContentChange={handleContentChange}
                onTitleChange={handleTitleChange}
                onIconChange={handleIconChange}
                isSaving={isSaving}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg mb-2">No note selected</p>
                  <p className="text-sm">Select a note from the sidebar or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

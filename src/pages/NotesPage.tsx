import { useState, useCallback, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { NotesSidebar } from "@/components/notes/NotesSidebar";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { HubView } from "@/components/notes/HubView";
import { 
  useNotes, 
  useNote, 
  useCreateNote, 
  useUpdateNote, 
  useInitializeHubs,
  buildNoteTree, 
  groupNotesByDomain,
  type Note 
} from "@/hooks/useNotes";
import { debounce } from "@/lib/utils";
import { DOMAINS, type DomainId } from "@/lib/domains";
import type { Json } from "@/integrations/supabase/types";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

export default function NotesPage() {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<DomainId | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'hub' | 'editor'>('hub');

  const { data: notes = [], isLoading: notesLoading } = useNotes();
  const { data: selectedNote } = useNote(selectedNoteId);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const initializeHubs = useInitializeHubs();

  const groupedNotes = groupNotesByDomain(notes);
  const pinnedNotes = notes.filter(n => n.is_pinned && !n.is_template);

  // Initialize hubs on first load
  useEffect(() => {
    if (!notesLoading && notes.length >= 0) {
      const hubs = notes.filter(n => n.note_type === 'hub');
      if (hubs.length < DOMAINS.length) {
        initializeHubs.mutate(notes);
      }
    }
  }, [notesLoading, notes.length]);

  // Auto-select first hub if nothing selected
  useEffect(() => {
    if (!selectedNoteId && !activeDomain && notes.length > 0 && !notesLoading) {
      // Default to spiritual hub
      const spiritualHub = notes.find(n => n.domain === 'spiritual' && n.note_type === 'hub');
      if (spiritualHub) {
        setActiveDomain('spiritual');
        setViewMode('hub');
      }
    }
  }, [notes, selectedNoteId, activeDomain, notesLoading]);

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

  const handleSelectNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNoteId(noteId);
      setActiveDomain(note.domain);
      
      // If it's a hub, show hub view; otherwise show editor
      if (note.note_type === 'hub') {
        setViewMode('hub');
      } else {
        setViewMode('editor');
      }
    }
  };

  const handleSelectHub = (domainId: DomainId) => {
    setActiveDomain(domainId);
    setViewMode('hub');
    
    const hub = notes.find(n => n.domain === domainId && n.note_type === 'hub');
    if (hub) {
      setSelectedNoteId(hub.id);
    } else {
      setSelectedNoteId(null);
    }
  };

  const handleCreateNote = async (domainId: DomainId) => {
    const domain = DOMAINS.find(d => d.id === domainId);
    const note = await createNote.mutateAsync({
      title: "Untitled",
      domain: domainId,
      note_type: 'page',
      icon: domain?.icon || '📝',
    });
    setSelectedNoteId(note.id);
    setActiveDomain(domainId);
    setViewMode('editor');
  };

  const handleTogglePin = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote.mutate({ id: noteId, is_pinned: !note.is_pinned });
    }
  };

  // Get current domain data
  const currentDomainData = activeDomain ? groupedNotes[activeDomain] : null;
  const currentPages = currentDomainData?.pages || [];
  const currentJournal = currentDomainData?.journal || [];
  const pageTree = buildNoteTree(
    currentPages.filter(p => !p.is_template && p.note_type === 'page')
  ) as NoteWithChildren[];

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <NotesSidebar
            notes={notes}
            pinnedNotes={pinnedNotes}
            selectedNoteId={selectedNoteId}
            activeDomain={activeDomain}
            onSelectNote={handleSelectNote}
            onSelectHub={handleSelectHub}
            onCreateNote={handleCreateNote}
            onTogglePin={handleTogglePin}
            isLoading={notesLoading}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {viewMode === 'hub' && activeDomain ? (
              <HubView
                domain={activeDomain}
                pages={pageTree}
                journalEntries={currentJournal}
                onSelectNote={handleSelectNote}
                onCreatePage={() => handleCreateNote(activeDomain)}
                selectedNoteId={selectedNoteId}
              />
            ) : selectedNote && viewMode === 'editor' ? (
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
                  <p className="text-lg mb-2">Select a domain to get started</p>
                  <p className="text-sm">Choose a domain from the sidebar to view your notes</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}

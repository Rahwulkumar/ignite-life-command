import { useState, useEffect } from "react";
import { Plus, FileText, ChevronRight, Star, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotionEditor } from "./NotionEditor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Note {
  id: string;
  title: string;
  content: any;
  icon: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export function NotesPanel() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("office_notes")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      setNotes(data || []);
      if (data && data.length > 0 && !selectedNoteId) {
        setSelectedNoteId(data[0].id);
      }
    }
    setIsLoading(false);
  }

  async function createNote() {
    const { data, error } = await supabase
      .from("office_notes")
      .insert({ title: "Untitled", content: {}, icon: "📝" })
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
    } else if (data) {
      setNotes([data, ...notes]);
      setSelectedNoteId(data.id);
    }
  }

  async function updateNote(id: string, updates: Partial<Note>) {
    const { error } = await supabase
      .from("office_notes")
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Error updating note:", error);
    } else {
      setNotes(notes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    }
  }

  async function deleteNote(id: string) {
    const { error } = await supabase
      .from("office_notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting note:", error);
    } else {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      if (selectedNoteId === id) {
        setSelectedNoteId(updatedNotes[0]?.id || null);
      }
    }
  }

  async function togglePin(id: string, isPinned: boolean) {
    await updateNote(id, { is_pinned: !isPinned });
    fetchNotes();
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div className="flex h-full">
      {/* Sidebar - Note List */}
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            onClick={createNote}
          >
            <Plus className="w-4 h-4" />
            New Page
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                className={cn(
                  "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                  selectedNoteId === note.id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                onClick={() => setSelectedNoteId(note.id)}
              >
                <span className="text-sm">{note.icon}</span>
                <span className="flex-1 text-sm truncate">{note.title}</span>
                {note.is_pinned && (
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => togglePin(note.id, note.is_pinned)}>
                      <Star className="w-4 h-4 mr-2" />
                      {note.is_pinned ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {notes.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notes yet</p>
                <p className="text-xs">Click "New Page" to create one</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedNote ? (
          <NotionEditor
            note={selectedNote}
            onUpdate={(updates) => updateNote(selectedNote.id, updates)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Plus, 
  Inbox, 
  CheckSquare, 
  Calendar,
  ChevronRight,
  Pin,
  FileText,
  MoreHorizontal,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  icon: string;
  is_pinned: boolean;
}

interface WorkspaceSidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  activeView: 'notes' | 'tasks' | 'daily-log';
  onChangeView: (view: 'notes' | 'tasks' | 'daily-log') => void;
}

export function WorkspaceSidebar({
  notes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onTogglePin,
  activeView,
  onChangeView,
}: WorkspaceSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPages, setExpandedPages] = useState(true);

  const pinnedNotes = notes.filter((n) => n.is_pinned);
  const unpinnedNotes = notes.filter((n) => !n.is_pinned);

  const filteredNotes = searchQuery
    ? notes.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="w-60 h-full bg-muted/30 border-r border-border flex flex-col">
      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-background/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 pb-4">
          {/* Quick Links */}
          <div className="space-y-0.5 mb-4">
            <SidebarItem
              icon={<CheckSquare className="w-4 h-4" />}
              label="Tasks"
              active={activeView === 'tasks'}
              onClick={() => onChangeView('tasks')}
            />
            <SidebarItem
              icon={<Calendar className="w-4 h-4" />}
              label="Daily Log"
              active={activeView === 'daily-log'}
              onClick={() => onChangeView('daily-log')}
            />
          </div>

          {/* Search Results */}
          {filteredNotes ? (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground px-2 mb-2">
                Search results
              </p>
              {filteredNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isSelected={selectedNoteId === note.id}
                  onSelect={() => {
                    onSelectNote(note.id);
                    onChangeView('notes');
                  }}
                  onDelete={() => onDeleteNote(note.id)}
                  onTogglePin={() => onTogglePin(note.id)}
                />
              ))}
              {filteredNotes.length === 0 && (
                <p className="text-xs text-muted-foreground px-2">
                  No results found
                </p>
              )}
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedNotes.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground px-2 mb-1 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </p>
                  <div className="space-y-0.5">
                    {pinnedNotes.map((note) => (
                      <NoteItem
                        key={note.id}
                        note={note}
                        isSelected={selectedNoteId === note.id && activeView === 'notes'}
                        onSelect={() => {
                          onSelectNote(note.id);
                          onChangeView('notes');
                        }}
                        onDelete={() => onDeleteNote(note.id)}
                        onTogglePin={() => onTogglePin(note.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Pages Section */}
              <div>
                <button
                  onClick={() => setExpandedPages(!expandedPages)}
                  className="w-full flex items-center gap-1 text-xs font-medium text-muted-foreground px-2 mb-1 hover:text-foreground transition-colors"
                >
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 transition-transform",
                      expandedPages && "rotate-90"
                    )}
                  />
                  Pages
                </button>
                {expandedPages && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-0.5"
                  >
                    {unpinnedNotes.map((note) => (
                      <NoteItem
                        key={note.id}
                        note={note}
                        isSelected={selectedNoteId === note.id && activeView === 'notes'}
                        onSelect={() => {
                          onSelectNote(note.id);
                          onChangeView('notes');
                        }}
                        onDelete={() => onDeleteNote(note.id)}
                        onTogglePin={() => onTogglePin(note.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* New Page Button */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={onCreateNote}
        >
          <Plus className="w-4 h-4" />
          New Page
        </Button>
      </div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function NoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  onTogglePin,
}: {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-1 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      onClick={onSelect}
    >
      <span className="text-base">{note.icon}</span>
      <span className="flex-1 truncate">{note.title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-background rounded transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onTogglePin}>
            <Pin className="w-4 h-4 mr-2" />
            {note.is_pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Pin, 
  FileText,
  Folder,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSearchNotes, type Note } from "@/hooks/useNotes";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

interface NotesSidebarProps {
  notes: NoteWithChildren[];
  templates: Note[];
  pinnedNotes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: (parentId?: string) => void;
  onCreateFromTemplate: (templateId: string) => void;
  onTogglePin: (noteId: string) => void;
  isLoading: boolean;
}

export function NotesSidebar({
  notes,
  templates,
  pinnedNotes,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onCreateFromTemplate,
  onTogglePin,
  isLoading,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { data: searchResults = [] } = useSearchNotes(searchQuery);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderNoteItem = (note: NoteWithChildren, depth = 0) => {
    const isSelected = note.id === selectedNoteId;
    const isExpanded = expandedFolders.has(note.id);
    const hasChildren = note.children.length > 0;

    return (
      <div key={note.id}>
        <div
          className={cn(
            "group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
            isSelected ? "bg-muted" : "hover:bg-muted/50"
          )}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(note.id);
              }}
              className="p-0.5 hover:bg-muted-foreground/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <span className="text-base">{note.icon || "📝"}</span>
          
          <button
            onClick={() => onSelectNote(note.id)}
            className="flex-1 text-left text-sm truncate"
          >
            {note.title}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onCreateNote(note.id)}>
                <Plus className="w-4 h-4 mr-2" />
                Add sub-page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePin(note.id)}>
                <Pin className="w-4 h-4 mr-2" />
                {note.is_pinned ? "Unpin" : "Pin to top"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {note.children.map((child) => renderNoteItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 border-r border-border/50 bg-card/50 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="pl-8 h-8 bg-muted/50"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div>
              <p className="px-2 text-xs font-medium text-muted-foreground mb-1">
                Search Results
              </p>
              {searchResults.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note.id);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-muted/50",
                    note.id === selectedNoteId && "bg-muted"
                  )}
                >
                  <span>{note.icon || "📝"}</span>
                  <span className="text-sm truncate">{note.title}</span>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
            <>
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </p>
                  {pinnedNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => onSelectNote(note.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-muted/50",
                        note.id === selectedNoteId && "bg-muted"
                      )}
                    >
                      <span>{note.icon || "📝"}</span>
                      <span className="text-sm truncate">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* All Pages */}
              <div>
                <div className="flex items-center justify-between px-2 mb-1">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Pages
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onCreateNote()}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {isLoading ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : notes.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No notes yet
                  </div>
                ) : (
                  notes.map((note) => renderNoteItem(note))
                )}
              </div>

              {/* Templates */}
              {templates.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Folder className="w-3 h-3" />
                    Templates
                  </p>
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => onCreateFromTemplate(template.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-muted/50"
                    >
                      <span>{template.icon || "📋"}</span>
                      <span className="text-sm truncate">{template.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* New Page Button */}
      <div className="p-2 border-t border-border/30">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={() => onCreateNote()}
        >
          <Plus className="w-4 h-4" />
          New Page
        </Button>
      </div>
    </div>
  );
}

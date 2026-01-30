import { useState, useEffect } from "react";
import { Search, Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSearchNotes, groupNotesByDomain, buildNoteTree, type Note } from "@/hooks/useNotes";
import { DOMAINS, type DomainId } from "@/lib/domains";
import { DomainSection } from "./DomainSection";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

interface NotesSidebarProps {
  notes: Note[];
  pinnedNotes: Note[];
  selectedNoteId: string | null;
  activeDomain: DomainId | null;
  onSelectNote: (id: string) => void;
  onSelectHub: (domainId: DomainId) => void;
  onCreateNote: (domainId: DomainId) => void;
  onTogglePin: (noteId: string) => void;
  isLoading: boolean;
}

export function NotesSidebar({
  notes,
  pinnedNotes,
  selectedNoteId,
  activeDomain,
  onSelectNote,
  onSelectHub,
  onCreateNote,
  onTogglePin,
  isLoading,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults = [] } = useSearchNotes(searchQuery);

  // Group notes by domain
  const groupedNotes = groupNotesByDomain(notes);

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
        <div className="p-2 space-y-3">
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

              {/* Domain Sections */}
              {isLoading ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <div className="space-y-1">
                  {DOMAINS.map((domain) => {
                    const domainData = groupedNotes[domain.id];
                    const pages = domainData?.pages || [];
                    const journalCount = domainData?.journal?.length || 0;
                    const hubId = domainData?.hub?.id || null;
                    
                    // Build tree for pages only (not templates, not journal)
                    const pageTree = buildNoteTree(
                      pages.filter(p => !p.is_template && p.note_type === 'page')
                    ) as NoteWithChildren[];

                    return (
                      <DomainSection
                        key={domain.id}
                        domain={domain}
                        pages={pageTree}
                        journalCount={journalCount}
                        selectedNoteId={selectedNoteId}
                        hubId={hubId}
                        onSelectNote={onSelectNote}
                        onSelectHub={onSelectHub}
                        onCreatePage={onCreateNote}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

import { useState } from "react";
import { Search, Pin, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSearchNotes, groupNotesByDomain, buildNoteTree, type Note } from "@/hooks/useNotes";
import { DOMAINS, type DomainId, getDomainById } from "@/lib/domains";
import { DomainIcon } from "@/components/shared/DomainIcon";
import { DomainSection } from "./DomainSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onDeleteNote?: (noteId: string) => void;
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
  onDeleteNote,
  isLoading,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // Search is now scoped to active domain
  const { data: searchResults = [] } = useSearchNotes(searchQuery, activeDomain);

  // Group notes by domain
  const groupedNotes = groupNotesByDomain(notes);

  // Get active domain config and data
  const activeDomainConfig = activeDomain ? getDomainById(activeDomain) : null;
  const activeDomainData = activeDomain ? groupedNotes[activeDomain] : null;

  // Filter pinned notes to only show those from active domain
  const domainPinnedNotes = pinnedNotes.filter(note => note.domain === activeDomain);

  // Build tree for active domain pages only
  const activeDomainPages = activeDomainData?.pages || [];
  const activeDomainJournalCount = activeDomainData?.journal?.length || 0;
  const activeDomainHubId = activeDomainData?.hub?.id || null;

  const pageTree = buildNoteTree(
    activeDomainPages.filter(p => !p.is_template && p.note_type === 'page')
  ) as NoteWithChildren[];

  return (
    <div className="w-64 md:w-56 lg:w-64 border-r border-border/50 bg-card/50 flex flex-col h-full">
      {/* Domain Selector Tabs */}
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center gap-1 p-2 border-b border-border/30 overflow-x-auto">
          {DOMAINS.map((domain) => (
            <Tooltip key={domain.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectHub(domain.id)}
                  className={cn(
                    "p-2 rounded-md flex-shrink-0 transition-colors",
                    activeDomain === domain.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <DomainIcon domainId={domain.id} className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {domain.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      {/* Search - scoped to active domain */}
      <div className="p-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search in ${activeDomainConfig?.label || 'notes'}...`}
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
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm truncate">{note.title}</span>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
            <>
              {/* Pinned Notes - only from active domain */}
              {domainPinnedNotes.length > 0 && (
                <div>
                  <p className="px-2 text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </p>
                  {domainPinnedNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => onSelectNote(note.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-muted/50",
                        note.id === selectedNoteId && "bg-muted"
                      )}
                    >
                      <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm truncate">{note.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Active Domain Content Only */}
              {isLoading ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : activeDomainConfig ? (
                <DomainSection
                  domain={activeDomainConfig}
                  pages={pageTree}
                  journalCount={activeDomainJournalCount}
                  selectedNoteId={selectedNoteId}
                  hubId={activeDomainHubId}
                  onSelectNote={onSelectNote}
                  onSelectHub={onSelectHub}
                  onCreatePage={onCreateNote}
                  onDeleteNote={onDeleteNote}
                />
              ) : (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Select a domain to view notes
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

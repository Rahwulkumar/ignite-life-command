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

const NOTE_DOMAIN_TONES: Record<
  DomainId,
  { text: string; bg: string; border: string; hover: string }
> = {
  spiritual: {
    text: "text-spiritual",
    bg: "bg-spiritual/10",
    border: "border-spiritual/30",
    hover: "hover:bg-spiritual/10",
  },
  trading: {
    text: "text-trading",
    bg: "bg-trading/10",
    border: "border-trading/30",
    hover: "hover:bg-trading/10",
  },
  tech: {
    text: "text-tech",
    bg: "bg-tech/10",
    border: "border-tech/30",
    hover: "hover:bg-tech/10",
  },
  finance: {
    text: "text-finance",
    bg: "bg-finance/10",
    border: "border-finance/30",
    hover: "hover:bg-finance/10",
  },
  music: {
    text: "text-music",
    bg: "bg-music/10",
    border: "border-music/30",
    hover: "hover:bg-music/10",
  },
  projects: {
    text: "text-work",
    bg: "bg-work/10",
    border: "border-work/30",
    hover: "hover:bg-work/10",
  },
  content: {
    text: "text-content",
    bg: "bg-content/10",
    border: "border-content/30",
    hover: "hover:bg-content/10",
  },
  general: {
    text: "text-muted-foreground",
    bg: "bg-muted/60",
    border: "border-border",
    hover: "hover:bg-muted/60",
  },
};

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
  const activeTone = activeDomain ? NOTE_DOMAIN_TONES[activeDomain] : null;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-border/50 bg-background/80 md:w-72 lg:w-80 xl:w-[21rem]">
      {/* Domain Selector Tabs */}
      <TooltipProvider delayDuration={300}>
        <div className="border-b border-border/30 p-3">
          <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border/40 bg-card/55 p-1.5 backdrop-blur-sm">
          {DOMAINS.map((domain) => (
            <Tooltip key={domain.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onSelectHub(domain.id)}
                  className={cn(
                    "flex min-w-0 items-center gap-2 rounded-lg border border-transparent px-2.5 py-2 text-left text-xs font-medium transition-colors",
                    activeDomain === domain.id
                      ? [
                          NOTE_DOMAIN_TONES[domain.id].bg,
                          NOTE_DOMAIN_TONES[domain.id].border,
                          NOTE_DOMAIN_TONES[domain.id].text,
                        ]
                      : [
                          "text-muted-foreground hover:border-border/50 hover:bg-background/65 hover:text-foreground",
                          NOTE_DOMAIN_TONES[domain.id].hover,
                        ]
                  )}
                >
                  <DomainIcon domainId={domain.id} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{domain.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {domain.label}
              </TooltipContent>
            </Tooltip>
          ))}
          </div>
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
            className="h-9 rounded-lg border-border/50 bg-card/55 pl-8"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-3">
          {/* Search Results */}
          {searchQuery && searchResults.length > 0 && (
            <div>
              <p className="mb-1.5 px-2 text-xs font-medium text-muted-foreground">
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
                    "flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:bg-card/70",
                    note.id === selectedNoteId &&
                      (activeTone
                        ? [activeTone.bg, activeTone.border, activeTone.text]
                        : "bg-muted"),
                  )}
                >
                  <FileText
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      note.id === selectedNoteId && activeTone
                        ? activeTone.text
                        : "text-muted-foreground",
                    )}
                  />
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
                  <p className="mb-1.5 flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
                    <Pin className="w-3 h-3" />
                    Pinned
                  </p>
                  {domainPinnedNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => onSelectNote(note.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 text-left transition-colors hover:bg-card/70",
                        note.id === selectedNoteId &&
                          (activeTone
                            ? [activeTone.bg, activeTone.border, activeTone.text]
                            : "bg-muted"),
                      )}
                    >
                      <FileText
                        className={cn(
                          "h-3.5 w-3.5 shrink-0",
                          note.id === selectedNoteId && activeTone
                            ? activeTone.text
                            : "text-muted-foreground",
                        )}
                      />
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
                  tone={NOTE_DOMAIN_TONES[activeDomainConfig.id]}
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
    </aside>
  );
}

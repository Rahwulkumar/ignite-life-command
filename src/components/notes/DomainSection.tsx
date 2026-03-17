import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, BookOpen, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Domain, DomainId } from "@/lib/domains";
import { DomainIcon } from "@/components/shared/DomainIcon";
import type { Note } from "@/hooks/useNotes";

import { SidebarFileTree } from "@/components/notes/SidebarFileTree";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

interface DomainSectionProps {
  domain: Domain;
  pages: NoteWithChildren[];
  journalCount: number;
  selectedNoteId: string | null;
  hubId: string | null;
  onSelectNote: (id: string) => void;
  onSelectHub: (domainId: DomainId) => void;
  onCreatePage: (domainId: DomainId) => void;
  onDeleteNote?: (noteId: string) => void;
}

export function DomainSection({
  domain,
  pages,
  journalCount,
  selectedNoteId,
  hubId,
  onSelectNote,
  onSelectHub,
  onCreatePage,
  onDeleteNote,
}: DomainSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // State for expanded folders separate from SidebarFileTree
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className="group">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <DomainIcon domainId={domain.id} className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex-1 text-left">
              {domain.label}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onCreatePage(domain.id);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="ml-2 mt-0.5 space-y-0.5">
            {/* Hub link */}
            {hubId && (
              <button
                onClick={() => onSelectHub(domain.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors text-muted-foreground hover:text-foreground",
                  selectedNoteId === hubId && "bg-muted text-foreground"
                )}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="truncate flex-1">{domain.label} Hub</span>
              </button>
            )}

            {/* Pages - Using shared SidebarFileTree */}
            <SidebarFileTree
              data={pages}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedNoteId={selectedNoteId}
              onSelectNote={onSelectNote}
              onDeleteNote={onDeleteNote}
              // Main sidebar doesn't support inline creation yet, keeping parity
              onCreateItem={undefined}
            />

            {/* Journal indicator */}
            {journalCount > 0 && (
              <button
                onClick={() => onSelectHub(domain.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate flex-1">Journal</span>
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {journalCount}
                </span>
              </button>
            )}

            {pages.length === 0 && journalCount === 0 && (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                No pages yet
              </p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

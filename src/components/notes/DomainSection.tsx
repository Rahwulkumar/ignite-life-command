import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Domain, DomainId } from "@/lib/domains";
import type { Note } from "@/hooks/useNotes";

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
}: DomainSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderNoteItem = (note: NoteWithChildren, depth = 0) => {
    const isSelected = note.id === selectedNoteId;

    return (
      <div key={note.id}>
        <button
          onClick={() => onSelectNote(note.id)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors",
            isSelected ? "bg-muted" : "hover:bg-muted/50"
          )}
          style={{ paddingLeft: `${8 + depth * 12}px` }}
        >
          <span className="text-sm">{note.icon || "📝"}</span>
          <span className="truncate flex-1">{note.title}</span>
        </button>
        {note.children.length > 0 && (
          <div>
            {note.children.map((child) => renderNoteItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
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
            <span className="text-base">{domain.icon}</span>
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
                <span className="text-sm">🏠</span>
                <span className="truncate flex-1">{domain.label} Hub</span>
              </button>
            )}

            {/* Pages */}
            {pages.map((page) => renderNoteItem(page))}

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

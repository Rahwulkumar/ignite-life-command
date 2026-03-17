import { Link } from "react-router-dom";
import { Layers, ChevronRight } from "lucide-react";
import { useNotes, groupNotesByDomain } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DOMAINS } from "@/lib/domains";
import { DomainIcon } from "@/components/shared/DomainIcon";

export function NotesWidget() {
  const { data: notes = [], isLoading } = useNotes();
  
  // Group notes by domain to get counts
  const groupedNotes = groupNotesByDomain(notes);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Workspaces</h3>
        </div>
        <Link 
          to="/notes" 
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Domain Workspaces List */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-muted/30 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {DOMAINS.map(domain => {
              const data = groupedNotes[domain.id];
              const pageCount = data?.pages?.length || 0;
              const journalCount = data?.journal?.length || 0;
              const totalCount = pageCount + journalCount;

              return (
                <Link
                  key={domain.id}
                  to="/notes"
                  state={{ domain: domain.id }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <DomainIcon 
                    domainId={domain.id} 
                    className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" 
                  />
                  <span className="flex-1 text-sm text-foreground/90 group-hover:text-foreground">
                    {domain.label}
                  </span>
                  {totalCount > 0 && (
                    <span className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                      {totalCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

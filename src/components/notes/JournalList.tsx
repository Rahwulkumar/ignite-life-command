import { format } from "date-fns";
import { FileText, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { extractTiptapPreviewText } from "@/lib/tiptapUtils";
import type { Note } from "@/hooks/useNotes";

interface JournalListProps {
  entries: Note[];
  onSelectEntry: (id: string) => void;
  selectedId?: string | null;
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function JournalList({
  entries,
  onSelectEntry,
  selectedId,
  maxItems,
  showViewAll = false,
  onViewAll,
  className,
}: JournalListProps) {
  const displayEntries = maxItems ? entries.slice(0, maxItems) : entries;

  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No journal entries yet</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <ScrollArea className="flex-1">
        <div className="space-y-1">
          {displayEntries.map((entry) => {
            const date = entry.created_at ? new Date(entry.created_at) : new Date();
            const isSelected = entry.id === selectedId;
            const previewText = extractTiptapPreviewText(entry.content, 60);

            return (
              <button
                key={entry.id}
                onClick={() => onSelectEntry(entry.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  isSelected
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex-shrink-0 text-xs text-muted-foreground font-medium min-w-[60px]">
                  {format(date, "MMM d")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.title || "Untitled"}
                  </p>
                  {previewText && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {previewText}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {showViewAll && entries.length > (maxItems || 0) && onViewAll && (
        <button
          onClick={onViewAll}
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-2 py-2 transition-colors"
        >
          View all {entries.length} entries
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

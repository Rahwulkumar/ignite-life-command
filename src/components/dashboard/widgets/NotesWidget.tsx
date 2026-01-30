import { Link } from "react-router-dom";
import { FileText, Plus, ChevronRight } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { ScrollArea } from "@/components/ui/scroll-area";

export function NotesWidget() {
  const { data: notes = [], isLoading } = useNotes();
  
  // Get the 5 most recent non-template notes
  const recentNotes = notes
    .filter(n => !n.is_template)
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Recent Notes</h3>
        </div>
        <Link 
          to="/notes" 
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1 px-4 pb-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-muted/30 rounded-md animate-pulse" />
            ))}
          </div>
        ) : recentNotes.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-2">No notes yet</p>
            <Link 
              to="/notes"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus className="w-3 h-3" />
              Create your first note
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {recentNotes.map(note => (
              <Link
                key={note.id}
                to="/notes"
                className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted/50 transition-colors group"
              >
                <span className="text-base">{note.icon || "📝"}</span>
                <span className="text-sm truncate flex-1 text-foreground/90 group-hover:text-foreground">
                  {note.title}
                </span>
                {note.is_pinned && (
                  <span className="text-xs text-muted-foreground">📌</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Quick Add */}
      {recentNotes.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30">
          <Link
            to="/notes"
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
          >
            <Plus className="w-3 h-3" />
            New note
          </Link>
        </div>
      )}
    </div>
  );
}

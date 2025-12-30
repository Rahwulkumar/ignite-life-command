import { FileText, Plus, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface SermonNote {
  id: string;
  title: string;
  speaker?: string;
  date: string;
  keyTakeaways?: string[];
}

interface SermonNotesCardProps {
  notes: SermonNote[];
  onAddNote?: () => void;
}

export const SermonNotesCard = ({ notes, onAddNote }: SermonNotesCardProps) => {
  const recentNotes = notes.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-6"
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-spiritual/10">
              <FileText className="w-5 h-5 text-spiritual" />
            </div>
            <div>
              <h3 className="font-medium">Sermon Notes</h3>
              <p className="text-sm text-muted-foreground">{notes.length} saved</p>
            </div>
          </div>
          <button
            onClick={onAddNote}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-2">
          {recentNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Take notes from your next sermon
            </p>
          ) : (
            recentNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-spiritual transition-colors">
                    {note.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    {note.speaker && <span>{note.speaker}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(note.date), "MMM d")}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

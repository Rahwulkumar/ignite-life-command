import { PenLine, Plus, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export interface JournalEntry {
  id: string;
  date: string;
  characterName?: string;
  attributesOfGod?: string[];
  excerpt?: string;
}

interface SpiritualJournalCardProps {
  recentEntries: JournalEntry[];
  onNewEntry: () => void;
  onViewEntry: (id: string) => void;
}

export const SpiritualJournalCard = ({
  recentEntries,
  onNewEntry,
  onViewEntry,
}: SpiritualJournalCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PenLine className="w-4 h-4 text-muted-foreground" />
          <p className="font-medium">Journal</p>
        </div>
        <button
          onClick={onNewEntry}
          className="flex items-center gap-1 text-sm hover:underline"
        >
          <Plus className="w-3 h-3" />
          New
        </button>
      </div>

      <div className="space-y-2">
        {recentEntries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onViewEntry(entry.id)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {entry.characterName && (
                  <span className="text-xs">· {entry.characterName}</span>
                )}
              </div>
              <p className="text-sm truncate">{entry.excerpt}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </button>
        ))}
      </div>

      <button className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
        View all entries
      </button>
    </motion.div>
  );
};

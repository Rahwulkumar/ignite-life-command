import { PenLine, Sparkles, Heart, BookMarked, Plus, ChevronRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface JournalEntry {
  id: string;
  date: string;
  characterName?: string;
  characterInsights?: string;
  attributesOfGod?: string[];
  personalReflection?: string;
  scriptureMeditation?: string;
  prayerPoints?: string[];
}

interface SpiritualJournalCardProps {
  recentEntries: JournalEntry[];
  onNewEntry: () => void;
  onViewEntry: (id: string) => void;
}

const mockRecentEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2024-12-30",
    characterName: "David",
    attributesOfGod: ["Faithful", "Protector", "Shepherd"],
    personalReflection: "Today I learned about David's trust in God even when facing Goliath...",
  },
  {
    id: "2",
    date: "2024-12-29",
    characterName: "David",
    attributesOfGod: ["Merciful", "Forgiving"],
    personalReflection: "Reflecting on how God forgave David after his sin with Bathsheba...",
  },
];

export const SpiritualJournalCard = ({
  recentEntries = mockRecentEntries,
  onNewEntry,
  onViewEntry,
}: SpiritualJournalCardProps) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-spiritual/10">
            <PenLine className="w-5 h-5 text-spiritual" />
          </div>
          <div>
            <h3 className="font-medium">Spiritual Journal</h3>
            <p className="text-sm text-muted-foreground">Your faith journey documented</p>
          </div>
        </div>
        <button
          onClick={onNewEntry}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-spiritual/10 text-spiritual hover:bg-spiritual/20 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {/* Quick Entry Categories */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors text-center group">
          <Sparkles className="w-4 h-4 mx-auto mb-1 text-amber-500" />
          <span className="text-xs">Character Insights</span>
        </button>
        <button className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors text-center group">
          <Heart className="w-4 h-4 mx-auto mb-1 text-rose-500" />
          <span className="text-xs">Attributes of God</span>
        </button>
        <button className="p-3 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors text-center group">
          <BookMarked className="w-4 h-4 mx-auto mb-1 text-spiritual" />
          <span className="text-xs">Scripture Notes</span>
        </button>
      </div>

      {/* Recent Entries */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">Recent Entries</p>
        
        {recentEntries.map((entry) => (
          <motion.div
            key={entry.id}
            layout
            className="rounded-lg bg-muted/20 border border-border/30 overflow-hidden"
          >
            <button
              onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(entry.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{entry.characterName} Study</p>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedEntry === entry.id ? "rotate-90" : ""
                }`}
              />
            </button>

            {expandedEntry === entry.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3 pb-3 space-y-3"
              >
                {entry.attributesOfGod && entry.attributesOfGod.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Attributes of God</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.attributesOfGod.map((attr, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-spiritual/10 text-spiritual text-xs"
                        >
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.personalReflection && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Reflection</p>
                    <p className="text-sm text-foreground/80 line-clamp-2">
                      {entry.personalReflection}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => onViewEntry(entry.id)}
                  className="text-xs text-spiritual hover:underline"
                >
                  View full entry →
                </button>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* View All */}
      <button className="w-full mt-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        View all journal entries
      </button>
    </motion.div>
  );
};

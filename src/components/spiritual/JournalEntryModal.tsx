import { X, Sparkles, Heart, BookMarked, PenLine, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName?: string;
  onSave: (entry: JournalEntryData) => void;
}

interface JournalEntryData {
  characterInsights: string;
  attributesOfGod: string[];
  scriptureMeditation: string;
  personalReflection: string;
  prayerPoints: string[];
}

const commonAttributes = [
  "Faithful", "Merciful", "Loving", "Just", "Holy", "Sovereign", 
  "Gracious", "Patient", "Forgiving", "Protector", "Provider", "Healer"
];

export const JournalEntryModal = ({
  isOpen,
  onClose,
  characterName = "David",
  onSave,
}: JournalEntryModalProps) => {
  const [entry, setEntry] = useState<JournalEntryData>({
    characterInsights: "",
    attributesOfGod: [],
    scriptureMeditation: "",
    personalReflection: "",
    prayerPoints: [],
  });
  const [newPrayerPoint, setNewPrayerPoint] = useState("");
  const [activeTab, setActiveTab] = useState<"character" | "attributes" | "scripture" | "reflection">("character");

  const toggleAttribute = (attr: string) => {
    setEntry((prev) => ({
      ...prev,
      attributesOfGod: prev.attributesOfGod.includes(attr)
        ? prev.attributesOfGod.filter((a) => a !== attr)
        : [...prev.attributesOfGod, attr],
    }));
  };

  const addPrayerPoint = () => {
    if (newPrayerPoint.trim()) {
      setEntry((prev) => ({
        ...prev,
        prayerPoints: [...prev.prayerPoints, newPrayerPoint.trim()],
      }));
      setNewPrayerPoint("");
    }
  };

  const handleSave = () => {
    onSave(entry);
    onClose();
  };

  const tabs = [
    { id: "character", label: "Character", icon: Sparkles },
    { id: "attributes", label: "Attributes", icon: Heart },
    { id: "scripture", label: "Scripture", icon: BookMarked },
    { id: "reflection", label: "Reflection", icon: PenLine },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PenLine className="w-5 h-5 text-spiritual" />
            Journal Entry - {characterName} Study
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence mode="wait">
            {activeTab === "character" && (
              <motion.div
                key="character"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    What did you learn about {characterName} today?
                  </label>
                  <textarea
                    value={entry.characterInsights}
                    onChange={(e) => setEntry({ ...entry, characterInsights: e.target.value })}
                    placeholder={`Write your insights about ${characterName}'s character, decisions, and faith journey...`}
                    className="w-full h-40 p-3 rounded-lg bg-muted/30 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-spiritual/30 focus:border-spiritual/50"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "attributes" && (
              <motion.div
                key="attributes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Which attributes of God did you see in today's reading?
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonAttributes.map((attr) => (
                      <button
                        key={attr}
                        onClick={() => toggleAttribute(attr)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          entry.attributesOfGod.includes(attr)
                            ? "bg-spiritual text-white"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {attr}
                      </button>
                    ))}
                  </div>
                  {entry.attributesOfGod.length > 0 && (
                    <div className="p-3 rounded-lg bg-spiritual/5 border border-spiritual/20">
                      <p className="text-sm text-muted-foreground mb-2">Selected attributes:</p>
                      <div className="flex flex-wrap gap-1">
                        {entry.attributesOfGod.map((attr) => (
                          <span key={attr} className="px-2 py-0.5 rounded-full bg-spiritual/10 text-spiritual text-xs">
                            {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "scripture" && (
              <motion.div
                key="scripture"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Scripture meditation & notes
                  </label>
                  <textarea
                    value={entry.scriptureMeditation}
                    onChange={(e) => setEntry({ ...entry, scriptureMeditation: e.target.value })}
                    placeholder="Write down key verses, cross-references, and what stood out to you..."
                    className="w-full h-40 p-3 rounded-lg bg-muted/30 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-spiritual/30 focus:border-spiritual/50"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "reflection" && (
              <motion.div
                key="reflection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Personal reflection & application
                  </label>
                  <textarea
                    value={entry.personalReflection}
                    onChange={(e) => setEntry({ ...entry, personalReflection: e.target.value })}
                    placeholder="How does this apply to your life? What is God teaching you?"
                    className="w-full h-32 p-3 rounded-lg bg-muted/30 border border-border/50 resize-none focus:outline-none focus:ring-2 focus:ring-spiritual/30 focus:border-spiritual/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Prayer points</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newPrayerPoint}
                      onChange={(e) => setNewPrayerPoint(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPrayerPoint()}
                      placeholder="Add a prayer point..."
                      className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 focus:outline-none focus:ring-2 focus:ring-spiritual/30"
                    />
                    <button
                      onClick={addPrayerPoint}
                      className="px-4 py-2 rounded-lg bg-spiritual/10 text-spiritual hover:bg-spiritual/20 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {entry.prayerPoints.length > 0 && (
                    <ul className="space-y-2">
                      {entry.prayerPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-spiritual">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-spiritual text-white hover:bg-spiritual/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Entry
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

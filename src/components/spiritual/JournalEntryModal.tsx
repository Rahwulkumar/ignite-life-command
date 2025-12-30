import { X, Save } from "lucide-react";
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

const attributes = [
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
  const [tab, setTab] = useState<"insights" | "attributes" | "reflection">("insights");

  const toggleAttribute = (attr: string) => {
    setEntry((prev) => ({
      ...prev,
      attributesOfGod: prev.attributesOfGod.includes(attr)
        ? prev.attributesOfGod.filter((a) => a !== attr)
        : [...prev.attributesOfGod, attr],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Journal Entry</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-4">
          {[
            { id: "insights", label: "Insights" },
            { id: "attributes", label: "Attributes" },
            { id: "reflection", label: "Reflection" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`flex-1 px-3 py-1.5 rounded text-sm transition-colors ${
                tab === t.id ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="min-h-[200px]">
          {tab === "insights" && (
            <textarea
              value={entry.characterInsights}
              onChange={(e) => setEntry({ ...entry, characterInsights: e.target.value })}
              placeholder={`What did you learn about ${characterName}?`}
              className="w-full h-48 p-3 rounded-lg bg-muted/50 border border-border resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          )}

          {tab === "attributes" && (
            <div className="flex flex-wrap gap-2">
              {attributes.map((attr) => (
                <button
                  key={attr}
                  onClick={() => toggleAttribute(attr)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    entry.attributesOfGod.includes(attr)
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  {attr}
                </button>
              ))}
            </div>
          )}

          {tab === "reflection" && (
            <textarea
              value={entry.personalReflection}
              onChange={(e) => setEntry({ ...entry, personalReflection: e.target.value })}
              placeholder="Personal reflection and application..."
              className="w-full h-48 p-3 rounded-lg bg-muted/50 border border-border resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(entry); onClose(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Brain, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Verse {
  id: string;
  reference: string;
  verseText: string;
  masteryLevel: number;
}

interface ScriptureMemoryCardProps {
  verses: Verse[];
  onReviewComplete?: (id: string, correct: boolean) => void;
}

export const ScriptureMemoryCard = ({ verses, onReviewComplete }: ScriptureMemoryCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVerse, setShowVerse] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentVerse = verses[currentIndex];
  const dueForReview = verses.slice(0, 3);

  if (!currentVerse) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-spiritual/10">
            <Brain className="w-5 h-5 text-spiritual" />
          </div>
          <div>
            <h3 className="font-medium">Scripture Memory</h3>
            <p className="text-sm text-muted-foreground">No verses to review</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Add verses to start memorizing</p>
      </motion.div>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowVerse(!showVerse);
  };

  const handleResponse = (correct: boolean) => {
    onReviewComplete?.(currentVerse.id, correct);
    setIsFlipped(false);
    setShowVerse(false);
    if (currentIndex < verses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-6"
    >
      {/* Ambient glow */}
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-spiritual/10 rounded-full blur-3xl animate-breathe" style={{ animationDelay: "1s" }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-spiritual/10">
              <Brain className="w-5 h-5 text-spiritual" />
            </div>
            <div>
              <h3 className="font-medium">Scripture Memory</h3>
              <p className="text-sm text-muted-foreground">{dueForReview.length} verses due</p>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div
          onClick={handleFlip}
          className="relative min-h-[140px] p-6 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 border border-border/30 cursor-pointer transition-all hover:border-spiritual/30"
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <p className="text-xs text-muted-foreground mb-2">What verse is this?</p>
                <p className="text-xl font-medium text-spiritual">{currentVerse.reference}</p>
                <p className="text-xs text-muted-foreground mt-4">Tap to reveal</p>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm leading-relaxed text-foreground/90">{currentVerse.verseText}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mastery indicator */}
          <div className="absolute bottom-2 right-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-1.5 h-1.5 rounded-full ${
                  level <= currentVerse.masteryLevel ? "bg-spiritual" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Response buttons */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-3 mt-4"
            >
              <button
                onClick={() => handleResponse(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">Needs Work</span>
              </button>
              <button
                onClick={() => handleResponse(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-finance/10 text-finance hover:bg-finance/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span className="text-sm">Got It</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

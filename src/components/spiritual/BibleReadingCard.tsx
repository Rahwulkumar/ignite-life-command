import { BookOpen, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";

interface BibleReadingCardProps {
  currentBook: string;
  currentChapter: number;
  completedChapters: number;
  totalChapters: number;
  onMarkComplete?: () => void;
}

export const BibleReadingCard = ({
  currentBook,
  currentChapter,
  completedChapters,
  totalChapters,
  onMarkComplete,
}: BibleReadingCardProps) => {
  const progress = (completedChapters / totalChapters) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-6"
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-spiritual/10 rounded-full blur-3xl animate-breathe" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-spiritual/10">
              <BookOpen className="w-5 h-5 text-spiritual" />
            </div>
            <div>
              <h3 className="font-medium">Bible Reading Plan</h3>
              <p className="text-sm text-muted-foreground">1 Year Journey</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedChapters}/{totalChapters} chapters
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-spiritual to-spiritual/60 rounded-full"
          />
        </div>

        {/* Current reading */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Today's Reading</p>
            <p className="font-medium">{currentBook} {currentChapter}</p>
          </div>
          <button
            onClick={onMarkComplete}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-spiritual/10 text-spiritual hover:bg-spiritual/20 transition-colors text-sm"
          >
            <Check className="w-4 h-4" />
            Mark Complete
          </button>
        </div>

        {/* Quick navigation */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
          <span className="text-xs text-muted-foreground">Continue where you left off</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

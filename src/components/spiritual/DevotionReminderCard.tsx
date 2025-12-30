import { Sun, Moon, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface DevotionReminderCardProps {
  timeOfDay: "morning" | "evening";
  todayScripture?: string;
  bibleStory?: string;
  onStartDevotion: () => void;
  onDismiss: () => void;
}

export const DevotionReminderCard = ({
  timeOfDay,
  todayScripture = "Romans 8:28-39",
  bibleStory = "David & Goliath",
  onStartDevotion,
  onDismiss,
}: DevotionReminderCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  const isMorning = timeOfDay === "morning";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative bg-card border border-border rounded-xl p-5"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-muted">
              {isMorning ? (
                <Sun className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium mb-1">
                {isMorning ? "Morning" : "Evening"} Devotion
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {todayScripture} · {bibleStory}
              </p>

              <button
                onClick={onStartDevotion}
                className="text-sm font-medium hover:underline"
              >
                Begin →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

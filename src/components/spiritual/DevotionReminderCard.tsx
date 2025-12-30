import { Sun, Moon, BookOpen, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface DevotionReminderCardProps {
  timeOfDay: "morning" | "evening";
  onStartDevotion: () => void;
  onDismiss: () => void;
}

export const DevotionReminderCard = ({
  timeOfDay,
  onStartDevotion,
  onDismiss,
}: DevotionReminderCardProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const isMorning = timeOfDay === "morning";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-spiritual/10 via-card to-card border border-spiritual/20 p-6"
        >
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-spiritual/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-spiritual/10 rounded-full blur-2xl" />

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${isMorning ? "bg-amber-500/10" : "bg-indigo-500/10"}`}>
                {isMorning ? (
                  <Sun className="w-6 h-6 text-amber-500" />
                ) : (
                  <Moon className="w-6 h-6 text-indigo-400" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  {isMorning ? "Good Morning" : "Good Evening"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isMorning
                    ? "Start your day with Scripture and a Bible story"
                    : "End your day reflecting on God's Word"}
                </p>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                    <BookOpen className="w-4 h-4 text-spiritual" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Scripture Reading</p>
                      <p className="text-xs text-muted-foreground">Romans 8:28-39</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                    <div className="w-4 h-4 rounded bg-spiritual/20 flex items-center justify-center">
                      <span className="text-[10px] text-spiritual font-bold">✦</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Bible Story</p>
                      <p className="text-xs text-muted-foreground">David & Goliath</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onStartDevotion}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-spiritual text-white hover:bg-spiritual/90 transition-colors font-medium"
                >
                  Begin {isMorning ? "Morning" : "Evening"} Devotion
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

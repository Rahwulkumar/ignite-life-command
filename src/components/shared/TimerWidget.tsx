import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimeTracker, Domain } from "@/hooks/useTimeTracker";
import { TimerStartSheet } from "./TimerStartSheet";
import { cn } from "@/lib/utils";

const domainColors: Record<Domain, string> = {
  spiritual: "bg-spiritual",
  tech: "bg-tech",
  trading: "bg-trading",
  finance: "bg-finance",
  music: "bg-music",
  office: "bg-primary",
  content: "bg-content",
  projects: "bg-projects",
};

const domainLabels: Record<Domain, string> = {
  spiritual: "Spiritual",
  tech: "Tech",
  trading: "Trading",
  finance: "Finance",
  music: "Music",
  office: "Office",
  content: "Content",
  projects: "Projects",
};

export function TimerWidget() {
  const { activeTimer, stopTimer, getElapsedTime } = useTimeTracker();
  const [elapsed, setElapsed] = useState(0);
  const [showStartSheet, setShowStartSheet] = useState(false);

  useEffect(() => {
    if (!activeTimer) {
      setElapsed(0);
      return;
    }

    setElapsed(getElapsedTime());
    const interval = setInterval(() => {
      setElapsed(getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer, getElapsedTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = async () => {
    await stopTimer();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {activeTimer ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-2"
          >
            <div 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium",
                domainColors[activeTimer.domain]
              )}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-2 h-2 rounded-full bg-white/80"
              />
              <span className="max-w-[100px] truncate">{activeTimer.activity}</span>
              <span className="font-mono">{formatTime(elapsed)}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleStopTimer}
            >
              <Square className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowStartSheet(true)}
            >
              <Play className="w-3.5 h-3.5" />
              Start Timer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <TimerStartSheet 
        open={showStartSheet} 
        onOpenChange={setShowStartSheet}
      />
    </>
  );
}

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { InteractiveCalendar } from "@/components/dashboard/widgets/InteractiveCalendar";
import { AnalyticsPanel } from "@/components/dashboard/widgets/AnalyticsPanel";
import { useChecklistEntries, useToggleChecklistEntry } from "@/hooks/useChecklistEntries";
import { startOfMonth, endOfMonth } from "date-fns";

interface ZenLayoutProps {
  timeOfDay: "morning" | "evening";
}

const inkBrush: Variants = {
  hidden: { opacity: 0, x: -20, filter: "blur(2px)" },
  show: { 
    opacity: 1, 
    x: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1]
    } 
  },
};

const zenStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

// Zen card with paper texture feel
const ZenCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative bg-card/80 backdrop-blur-sm rounded-xl border border-border/40 overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent" />
    <div className="absolute inset-0 opacity-[0.015]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
    }} />
    <div className="relative">{children}</div>
  </div>
);

export function ZenLayout({ timeOfDay }: ZenLayoutProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Fetch checklist entries from the database
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());
  const { data: entries = [] } = useChecklistEntries(startDate, endDate);
  const toggleEntry = useToggleChecklistEntry();

  // Convert entries to the completedTasks format
  const completedTasks = entries.reduce((acc, entry) => {
    if (entry.is_completed) {
      if (!acc[entry.entry_date]) {
        acc[entry.entry_date] = [];
      }
      acc[entry.entry_date].push(entry.task_id);
    }
    return acc;
  }, {} as Record<string, string[]>);

  const handleToggleTask = (dateKey: string, taskId: string) => {
    const isCurrentlyCompleted = completedTasks[dateKey]?.includes(taskId) || false;
    toggleEntry.mutate({
      taskId,
      entryDate: dateKey,
      isCompleted: !isCurrentlyCompleted,
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={zenStagger}
      className="relative space-y-6"
    >
      {/* Top Row: Calendar + Devotion side by side */}
      <motion.div variants={zenStagger} className="grid grid-cols-12 gap-4">
        {/* Interactive Calendar */}
        <motion.div variants={inkBrush} className="col-span-5">
          <ZenCard className="h-full">
            <div className="p-4">
              <InteractiveCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                completedTasks={completedTasks}
                onToggleTask={handleToggleTask}
              />
            </div>
          </ZenCard>
        </motion.div>

        {/* Devotion Banner */}
        <motion.div variants={inkBrush} className="col-span-7">
          <ZenCard className="h-full">
            <DevotionBanner
              characterName="David"
              dayNumber={7}
              todayScripture="1 Samuel 17"
              timeOfDay={timeOfDay}
            />
          </ZenCard>
        </motion.div>
      </motion.div>

      {/* Analytics Panel - Full Width */}
      <motion.div variants={inkBrush}>
        <ZenCard>
          <AnalyticsPanel />
        </ZenCard>
      </motion.div>
    </motion.div>
  );
}

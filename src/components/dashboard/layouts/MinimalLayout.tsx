import { motion, Variants } from "framer-motion";
import { MetricCard } from "@/components/dashboard/widgets/MetricCard";
import { GoalProgress } from "@/components/dashboard/widgets/GoalProgress";
import { HabitTracker } from "@/components/dashboard/widgets/HabitTracker";
import { ActivityChart } from "@/components/dashboard/widgets/ActivityChart";
import { InsightCard } from "@/components/dashboard/widgets/InsightCard";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { QuickAccessGrid } from "@/components/dashboard/widgets/QuickAccessGrid";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  CheckCircle2,
  Target,
  Lightbulb,
  GraduationCap
} from "lucide-react";

interface MinimalLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const }
  },
};

const fadeStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const gentleRise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] as const
    } 
  },
};

export function MinimalLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: MinimalLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      variants={fadeStagger}
      className="space-y-12"
    >
      {/* Minimal header line */}
      <motion.div variants={fadeIn} className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <span className="text-xs text-muted-foreground font-light tracking-[0.2em] uppercase">Today</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      </motion.div>

      {/* Single focus area - habits */}
      <motion.div variants={gentleRise} className="max-w-2xl mx-auto">
        <HabitTracker habits={habits} onToggle={onToggleHabit} />
      </motion.div>

      {/* Centered devotion */}
      <motion.div variants={gentleRise} className="max-w-xl mx-auto">
        <DevotionBanner
          characterName="David"
          dayNumber={7}
          todayScripture="1 Samuel 17"
          timeOfDay={timeOfDay}
        />
      </motion.div>

      {/* Divider */}
      <motion.div variants={fadeIn} className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      </motion.div>

      {/* Metrics in a clean line */}
      <motion.div variants={gentleRise} className="grid grid-cols-4 gap-8 max-w-3xl mx-auto">
        <MetricCard
          icon={CheckCircle2}
          label="Tasks"
          value={28}
          change={{ value: 12, positive: true }}
          index={0}
        />
        <MetricCard
          icon={Target}
          label="Goals"
          value="4/5"
          index={1}
        />
        <MetricCard
          icon={BookOpen}
          label="Study"
          value="14.5h"
          change={{ value: 8, positive: true }}
          index={2}
        />
        <MetricCard
          icon={GraduationCap}
          label="Skills"
          value={12}
          index={3}
        />
      </motion.div>

      {/* Goals - generous spacing */}
      <motion.div variants={gentleRise} className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
        <GoalProgress
          icon={BookOpen}
          title="Devotional"
          current={45}
          target={60}
          unit="days streak"
          href="/spiritual"
          index={0}
        />
        <GoalProgress
          icon={Dumbbell}
          title="Fitness"
          current={4}
          target={6}
          unit="workouts / week"
          index={1}
        />
        <GoalProgress
          icon={Code2}
          title="Coding"
          current={12}
          target={20}
          unit="problems solved"
          href="/tech"
          index={2}
        />
      </motion.div>

      {/* Activity and insight side by side */}
      <motion.div variants={gentleRise} className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        <ActivityChart
          data={weeklyData}
          maxValue={6}
          title="This Week"
        />
        <InsightCard
          icon={Lightbulb}
          title="Great momentum"
          description="Consistency is building. Keep going."
          action={{ label: "View insights", href: "/spiritual" }}
        />
      </motion.div>

      {/* Quick access - full width at bottom */}
      <motion.div variants={gentleRise}>
        <QuickAccessGrid items={quickAccessItems} />
      </motion.div>

      {/* Bottom breathing space */}
      <motion.div variants={fadeIn} className="h-8" />
    </motion.div>
  );
}

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
  GraduationCap,
  Sparkles
} from "lucide-react";

interface MagazineLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const, 
      stiffness: 100, 
      damping: 15 
    } 
  },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 80, 
      damping: 12 
    } 
  },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring" as const, 
      stiffness: 80, 
      damping: 12 
    } 
  },
};

export function MagazineLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: MagazineLayoutProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: 20 }}
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Editorial header section */}
      <motion.div variants={slideUp} className="text-center mb-8">
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 mb-4"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-foreground/60" />
          <span className="text-xs font-medium text-foreground/60 uppercase tracking-wider">Daily Overview</span>
        </motion.div>
      </motion.div>

      {/* Feature story - full width devotion */}
      <motion.div variants={slideUp}>
        <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/5 to-transparent p-1">
          <div className="rounded-xl overflow-hidden">
            <DevotionBanner
              characterName="David"
              dayNumber={7}
              todayScripture="1 Samuel 17"
              timeOfDay={timeOfDay}
              className="border-0 bg-card/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Two-column magazine spread */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left column */}
        <motion.div variants={slideFromLeft} className="space-y-4">
          <div className="p-4 rounded-xl border border-foreground/10 bg-card/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Progress Metrics</h3>
            <div className="space-y-3">
              <MetricCard
                icon={CheckCircle2}
                label="Tasks Completed"
                value={28}
                change={{ value: 12, positive: true }}
                index={0}
              />
              <MetricCard
                icon={Target}
                label="Goals On Track"
                value="4/5"
                index={1}
              />
            </div>
          </div>
          
          <HabitTracker habits={habits} onToggle={onToggleHabit} />
        </motion.div>

        {/* Right column */}
        <motion.div variants={slideFromRight} className="space-y-4">
          <div className="p-4 rounded-xl border border-foreground/10 bg-card/50">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Growth Areas</h3>
            <div className="space-y-3">
              <MetricCard
                icon={BookOpen}
                label="Study Hours"
                value="14.5h"
                change={{ value: 8, positive: true }}
                index={2}
              />
              <MetricCard
                icon={GraduationCap}
                label="Skills Growing"
                value={12}
                index={3}
              />
            </div>
          </div>
          
          <ActivityChart
            data={weeklyData}
            maxValue={6}
            title="Weekly Activity"
          />
        </motion.div>
      </div>

      {/* Goals strip */}
      <motion.div variants={slideUp}>
        <div className="p-4 rounded-xl border border-foreground/10 bg-card/50">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Active Goals</h3>
          <div className="grid grid-cols-3 gap-4">
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
          </div>
        </div>
      </motion.div>

      {/* Quick access with insight */}
      <motion.div variants={slideUp} className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <QuickAccessGrid items={quickAccessItems} />
        </div>
        <InsightCard
          icon={Lightbulb}
          title="Great momentum"
          description="You've been consistent this week!"
          action={{ label: "View insights", href: "/spiritual" }}
        />
      </motion.div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
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

interface BentoLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

export function BentoLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: BentoLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Dynamic asymmetric bento grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Large habit tracker - spans 7 cols */}
        <div className="col-span-7">
          <HabitTracker habits={habits} onToggle={onToggleHabit} />
        </div>
        
        {/* Devotion - spans 5 cols, taller */}
        <div className="col-span-5 row-span-2">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
            className="h-full"
          />
        </div>
        
        {/* Metrics row - 3 cards in remaining 7 cols */}
        <div className="col-span-7 grid grid-cols-3 gap-3">
          <MetricCard
            icon={CheckCircle2}
            label="Tasks Done"
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
            icon={GraduationCap}
            label="Skills"
            value={12}
            index={2}
          />
        </div>
      </div>

      {/* Second row - goals and activity */}
      <div className="grid grid-cols-12 gap-4">
        {/* Goals - 3 cards spanning 8 cols */}
        <div className="col-span-8 grid grid-cols-3 gap-3">
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
        
        {/* Activity chart - 4 cols */}
        <div className="col-span-4">
          <ActivityChart
            data={weeklyData}
            maxValue={6}
            title="Weekly Activity"
          />
        </div>
      </div>

      {/* Third row - quick access and insight */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9">
          <QuickAccessGrid items={quickAccessItems} />
        </div>
        <div className="col-span-3">
          <InsightCard
            icon={Lightbulb}
            title="Great momentum"
            description="You've been consistent this week!"
            action={{ label: "View insights", href: "/spiritual" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

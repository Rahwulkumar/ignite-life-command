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

interface HeroLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

export function HeroLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: HeroLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Hero section - Devotion as the main focus */}
      <div className="grid grid-cols-12 gap-4">
        {/* Large devotion hero - 8 cols */}
        <div className="col-span-8">
          <DevotionBanner
            characterName="David"
            dayNumber={7}
            todayScripture="1 Samuel 17"
            timeOfDay={timeOfDay}
            className="min-h-[200px]"
          />
        </div>
        
        {/* Side metrics stack - 4 cols */}
        <div className="col-span-4 grid grid-rows-2 gap-3">
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

      {/* Satellite cards around habits */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left column - activity */}
        <div className="col-span-3">
          <ActivityChart
            data={weeklyData}
            maxValue={6}
            title="This Week"
          />
        </div>
        
        {/* Center - habits (hero of this section) */}
        <div className="col-span-6">
          <HabitTracker habits={habits} onToggle={onToggleHabit} />
        </div>
        
        {/* Right column - insight */}
        <div className="col-span-3 space-y-3">
          <MetricCard
            icon={GraduationCap}
            label="Skills Growing"
            value={12}
            index={2}
          />
          <InsightCard
            icon={Lightbulb}
            title="Keep it up!"
            description="Consistency is key."
            action={{ label: "View", href: "/spiritual" }}
          />
        </div>
      </div>

      {/* Bottom row - goals and quick access */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 grid grid-cols-1 gap-3">
          <GoalProgress
            icon={BookOpen}
            title="Devotional"
            current={45}
            target={60}
            unit="days streak"
            href="/spiritual"
            index={0}
          />
        </div>
        <div className="col-span-4">
          <GoalProgress
            icon={Dumbbell}
            title="Fitness"
            current={4}
            target={6}
            unit="workouts / week"
            index={1}
          />
        </div>
        <div className="col-span-4">
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

      <QuickAccessGrid items={quickAccessItems} />
    </motion.div>
  );
}

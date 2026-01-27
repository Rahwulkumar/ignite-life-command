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

interface RowsLayoutProps {
  habits: any[];
  onToggleHabit: (id: string) => void;
  weeklyData: any[];
  quickAccessItems: any[];
  timeOfDay: "morning" | "evening";
}

export function RowsLayout({ habits, onToggleHabit, weeklyData, quickAccessItems, timeOfDay }: RowsLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {/* Row 1: Metrics - 4 equal columns */}
      <div className="grid grid-cols-4 gap-2">
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

      {/* Row 2: Devotion and Habits - 2 equal columns */}
      <div className="grid grid-cols-2 gap-2">
        <DevotionBanner
          characterName="David"
          dayNumber={7}
          todayScripture="1 Samuel 17"
          timeOfDay={timeOfDay}
        />
        <HabitTracker habits={habits} onToggle={onToggleHabit} />
      </div>

      {/* Row 3: Goals - 3 equal columns */}
      <div className="grid grid-cols-3 gap-2">
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

      {/* Row 4: Activity and Insight - 2 columns (wider left) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2">
          <ActivityChart
            data={weeklyData}
            maxValue={6}
            title="Weekly Activity"
          />
        </div>
        <InsightCard
          icon={Lightbulb}
          title="Great momentum"
          description="You've been consistent this week. Keep up the devotional streak!"
          action={{ label: "View insights", href: "/spiritual" }}
        />
      </div>

      {/* Row 5: Quick Access */}
      <QuickAccessGrid items={quickAccessItems} />
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { MetricCard } from "@/components/dashboard/widgets/MetricCard";
import { GoalProgress } from "@/components/dashboard/widgets/GoalProgress";
import { QuickAccessGrid } from "@/components/dashboard/widgets/QuickAccessGrid";
import { HabitTracker } from "@/components/dashboard/widgets/HabitTracker";
import { ActivityChart } from "@/components/dashboard/widgets/ActivityChart";
import { InsightCard } from "@/components/dashboard/widgets/InsightCard";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { defaultHabits } from "@/components/home/DailyHabits";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  TrendingUp, 
  Music,
  Wallet,
  CheckCircle2,
  Target,
  Lightbulb,
  GraduationCap
} from "lucide-react";

const weeklyData = [
  { day: "M", value: 3, isToday: false },
  { day: "T", value: 5, isToday: false },
  { day: "W", value: 4, isToday: false },
  { day: "T", value: 6, isToday: false },
  { day: "F", value: 4, isToday: false },
  { day: "S", value: 2, isToday: false },
  { day: "S", value: 5, isToday: true },
];

const quickAccessItems = [
  {
    icon: Wallet,
    title: "Finance",
    subtitle: "Budget & expenses",
    href: "/finance",
    color: "finance",
    metric: { label: "Spent this month", value: "$2,340" }
  },
  {
    icon: TrendingUp,
    title: "Investments",
    subtitle: "Portfolio tracking",
    href: "/investments",
    color: "trading",
    metric: { label: "Total return", value: "+12.4%" }
  },
  {
    icon: Music,
    title: "Music",
    subtitle: "Practice & learn",
    href: "/music",
    color: "music",
    metric: { label: "Hours this week", value: "8.5" }
  },
  {
    icon: Code2,
    title: "Tech",
    subtitle: "Skills & certs",
    href: "/tech",
    color: "tech",
    metric: { label: "Skills tracked", value: "24" }
  },
];

const Index = () => {
  const [habits, setHabits] = useState(defaultHabits);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const hour = currentTime.getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen px-6 py-6 max-w-7xl mx-auto space-y-5">
          <HeroHeader currentTime={currentTime} />

          {/* Metrics Row */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard
              icon={CheckCircle2}
              label="Tasks Completed"
              value={28}
              change={{ value: 12, positive: true }}
              color="finance"
            />
            <MetricCard
              icon={Target}
              label="Goals On Track"
              value="4/5"
              color="tech"
            />
            <MetricCard
              icon={BookOpen}
              label="Study Hours"
              value="14.5h"
              change={{ value: 8, positive: true }}
              color="spiritual"
            />
            <MetricCard
              icon={GraduationCap}
              label="Skills Growing"
              value={12}
              color="music"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-5">
            {/* Left Column - 8 cols */}
            <div className="col-span-8 space-y-5">
              <HabitTracker
                habits={habits}
                onToggle={toggleHabit}
              />

              <div className="grid grid-cols-3 gap-3">
                <GoalProgress
                  icon={BookOpen}
                  title="Devotional"
                  current={45}
                  target={60}
                  unit="days streak"
                  color="spiritual"
                  href="/spiritual"
                />
                <GoalProgress
                  icon={Dumbbell}
                  title="Fitness"
                  current={4}
                  target={6}
                  unit="workouts / week"
                  color="finance"
                />
                <GoalProgress
                  icon={Code2}
                  title="Coding"
                  current={12}
                  target={20}
                  unit="problems solved"
                  color="tech"
                  href="/tech"
                />
              </div>

              <QuickAccessGrid items={quickAccessItems} />
            </div>

            {/* Right Column - 4 cols */}
            <div className="col-span-4 space-y-5">
              <DevotionBanner
                characterName="David"
                dayNumber={7}
                todayScripture="1 Samuel 17"
                timeOfDay={timeOfDay}
              />

              <ActivityChart
                data={weeklyData}
                maxValue={6}
                title="Weekly Activity"
              />

              <InsightCard
                icon={Lightbulb}
                title="Great momentum!"
                description="You've been consistent this week. Keep up the devotional streak!"
                action={{ label: "View insights", href: "/spiritual" }}
                color="trading"
              />
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

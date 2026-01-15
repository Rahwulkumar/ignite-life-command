import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GlowWidget, StatWidget, ProgressWidget } from "@/components/dashboard/widgets/GlowWidget";
import { DomainLinkCard } from "@/components/dashboard/widgets/DomainLinkCard";
import { HabitGrid } from "@/components/dashboard/widgets/HabitGrid";
import { DevotionBanner } from "@/components/dashboard/widgets/DevotionBanner";
import { WeekBarChart } from "@/components/dashboard/widgets/WeekBarChart";
import { defaultHabits } from "@/components/home/DailyHabits";
import { format } from "date-fns";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  Flame, 
  TrendingUp, 
  Music,
  Wallet,
  CheckCircle2,
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const weeklyData = [
  { day: "M", value: 3, isToday: false },
  { day: "T", value: 5, isToday: false },
  { day: "W", value: 4, isToday: false },
  { day: "T", value: 6, isToday: false },
  { day: "F", value: 4, isToday: false },
  { day: "S", value: 2, isToday: false },
  { day: "S", value: 5, isToday: true },
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

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const hour = currentTime.getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";
  const completedHabits = habits.filter((h) => h.completed).length;

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen px-6 py-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-start justify-between">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-semibold tracking-tight mb-1">
                  {greeting()}
                </h1>
                <p className="text-muted-foreground">
                  {format(currentTime, "EEEE, MMMM d, yyyy")}
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                {/* Streak Badge */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border/50">
                  <div className="relative">
                    <Flame className="w-5 h-5 text-trading" />
                    <div className="absolute inset-0 animate-ping">
                      <Flame className="w-5 h-5 text-trading opacity-30" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">7 Day Streak</span>
                </div>
              </motion.div>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatWidget
              icon={CheckCircle2}
              label="Tasks Completed"
              value={28}
              subtext="This month"
              color="finance"
              trend={{ value: 12, positive: true }}
              delay={0.1}
            />
            <StatWidget
              icon={Target}
              label="Goals Progress"
              value="78%"
              subtext="4 of 5 on track"
              color="tech"
              delay={0.15}
            />
            <StatWidget
              icon={Zap}
              label="Productivity Score"
              value={92}
              subtext="Excellent"
              color="trading"
              trend={{ value: 5, positive: true }}
              delay={0.2}
            />
            <StatWidget
              icon={BookOpen}
              label="Study Hours"
              value="14.5"
              subtext="This week"
              color="spiritual"
              delay={0.25}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - 8 cols */}
            <div className="col-span-8 space-y-6">
              {/* Daily Habits Widget */}
              <GlowWidget delay={0.3} className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">Daily Habits</h2>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium">
                      <Zap className="w-3 h-3" />
                      {completedHabits}/{habits.length}
                    </div>
                  </div>
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(completedHabits / habits.length) * 100}%` }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full bg-foreground rounded-full"
                    />
                  </div>
                </div>
                <HabitGrid 
                  habits={habits} 
                  onToggle={toggleHabit}
                  delay={0.4}
                />
              </GlowWidget>

              {/* Domain Progress Cards */}
              <div className="grid grid-cols-3 gap-4">
                <ProgressWidget
                  icon={BookOpen}
                  title="Spiritual"
                  current={45}
                  total={60}
                  unit="days devotion"
                  color="spiritual"
                  delay={0.35}
                />
                <ProgressWidget
                  icon={Dumbbell}
                  title="Fitness"
                  current={4}
                  total={6}
                  unit="workouts/week"
                  color="finance"
                  delay={0.4}
                />
                <ProgressWidget
                  icon={Code2}
                  title="Tech Skills"
                  current={12}
                  total={20}
                  unit="problems solved"
                  color="tech"
                  delay={0.45}
                />
              </div>

              {/* Quick Access Domains */}
              <div className="grid grid-cols-3 gap-4">
                <DomainLinkCard
                  icon={Wallet}
                  title="Finance"
                  description="Track expenses & budgets"
                  href="/finance"
                  color="finance"
                  stats={[
                    { label: "Spent", value: "$2,340" },
                    { label: "Budget", value: "68%" }
                  ]}
                  delay={0.5}
                />
                <DomainLinkCard
                  icon={TrendingUp}
                  title="Investments"
                  description="Portfolio & mutual funds"
                  href="/investments"
                  color="trading"
                  stats={[
                    { label: "Total", value: "$45.2K" },
                    { label: "Return", value: "+12%" }
                  ]}
                  delay={0.55}
                />
                <DomainLinkCard
                  icon={Music}
                  title="Music"
                  description="Practice & repertoire"
                  href="/music"
                  color="music"
                  stats={[
                    { label: "Hours", value: "8.5" },
                    { label: "Pieces", value: "12" }
                  ]}
                  delay={0.6}
                />
              </div>
            </div>

            {/* Right Column - 4 cols */}
            <div className="col-span-4 space-y-6">
              {/* Devotion Banner */}
              <DevotionBanner
                characterName="David"
                dayNumber={7}
                todayScripture="1 Samuel 17"
                timeOfDay={timeOfDay}
                delay={0.3}
              />

              {/* Weekly Activity Chart */}
              <GlowWidget delay={0.4} className="p-5">
                <WeekBarChart
                  data={weeklyData}
                  maxValue={6}
                  label="Weekly Activity"
                  delay={0.45}
                />
              </GlowWidget>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="p-4 rounded-2xl bg-card border border-border/50 text-center"
                >
                  <p className="text-2xl font-semibold">156</p>
                  <p className="text-xs text-muted-foreground mt-1">Total Tasks</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="p-4 rounded-2xl bg-card border border-border/50 text-center"
                >
                  <p className="text-2xl font-semibold">94%</p>
                  <p className="text-xs text-muted-foreground mt-1">Consistency</p>
                </motion.div>
              </div>

              {/* Tech Domain Card */}
              <DomainLinkCard
                icon={Code2}
                title="Tech & Learning"
                description="Skills, certs & research"
                href="/tech"
                color="tech"
                stats={[
                  { label: "Skills", value: "24" },
                  { label: "Certs", value: "3" }
                ]}
                delay={0.65}
              />
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

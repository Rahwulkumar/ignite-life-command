import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { MiniCalendar } from "@/components/home/MiniCalendar";
import { DailyHabits, defaultHabits } from "@/components/home/DailyHabits";
import { DevotionWidget } from "@/components/home/DevotionWidget";
import { DomainProgressRing } from "@/components/dashboard/DomainProgressRing";
import { WeeklyOverview } from "@/components/dashboard/WeeklyOverview";
import { FocusCard } from "@/components/dashboard/FocusCard";
import { format } from "date-fns";
import { 
  BookOpen, 
  Dumbbell, 
  Code2, 
  Flame, 
  TrendingUp, 
  Music,
  Target,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const domainProgress = [
  { icon: BookOpen, label: "Spiritual", value: 45, total: 60, unit: "days", color: "spiritual" },
  { icon: Dumbbell, label: "Fitness", value: 4, total: 6, unit: "workouts", color: "finance" },
  { icon: Code2, label: "Tech", value: 12, total: 20, unit: "problems", color: "tech" },
];

const weeklyData = [
  { day: "M", value: 3, isToday: false },
  { day: "T", value: 5, isToday: false },
  { day: "W", value: 4, isToday: false },
  { day: "T", value: 6, isToday: false },
  { day: "F", value: 4, isToday: false },
  { day: "S", value: 2, isToday: false },
  { day: "S", value: 5, isToday: true },
];

const focusItems = [
  { icon: Code2, title: "DSA Practice", subtitle: "3 problems remaining", href: "/tech", color: "tech" },
  { icon: TrendingUp, title: "Market Analysis", subtitle: "Review watchlist", href: "/trading", color: "trading" },
  { icon: Music, title: "Piano Practice", subtitle: "30 min session", href: "/music", color: "music" },
];

const Index = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [habits, setHabits] = useState(defaultHabits);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const completedDates = [
    new Date(2024, 11, 25),
    new Date(2024, 11, 26),
    new Date(2024, 11, 28),
  ];

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
  const habitProgress = Math.round((completedHabits / habits.length) * 100);

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Header */}
          <header className="px-8 pt-10 pb-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start justify-between">
                <div>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground mb-1"
                  >
                    {format(currentTime, "EEEE, MMMM d")}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-3xl font-semibold tracking-tight"
                  >
                    {greeting()}
                  </motion.h1>
                </div>
                
                {/* Streak Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50"
                >
                  <Flame className="w-4 h-4 text-trading" />
                  <span className="text-sm font-medium">7 day streak</span>
                </motion.div>
              </div>
            </div>
          </header>

          {/* Domain Progress Section */}
          <section className="px-8 py-6">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-border/50 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    <h2 className="font-medium">Progress This Month</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(currentTime, "MMMM yyyy")}
                  </p>
                </div>
                <div className="flex justify-around">
                  {domainProgress.map((domain, i) => (
                    <DomainProgressRing
                      key={domain.label}
                      {...domain}
                      delay={0.2 + i * 0.1}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Main Grid */}
          <section className="px-8 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Habits & Focus */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Today's Habits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-card border border-border/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h2 className="font-medium">Today's Habits</h2>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-xs">
                          <Zap className="w-3 h-3" />
                          {completedHabits}/{habits.length}
                        </div>
                      </div>
                      {/* Mini Progress Bar */}
                      <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${habitProgress}%` }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="h-full bg-foreground rounded-full"
                        />
                      </div>
                    </div>
                    <DailyHabits
                      date={selectedDate}
                      habits={habits}
                      onToggle={toggleHabit}
                    />
                  </motion.div>

                  {/* Focus Today */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card border border-border/50 rounded-2xl p-6"
                  >
                    <h2 className="font-medium mb-4">Focus Today</h2>
                    <div className="space-y-3">
                      {focusItems.map((item, i) => (
                        <FocusCard key={item.title} {...item} delay={0.35 + i * 0.05} />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Devotion Widget */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <DevotionWidget
                      characterName="David"
                      dayNumber={7}
                      todayScripture="1 Samuel 17"
                      timeOfDay={timeOfDay}
                    />
                  </motion.div>

                  {/* Calendar */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border/50 rounded-2xl p-6"
                  >
                    <MiniCalendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      completedDates={completedDates}
                    />
                  </motion.div>

                  {/* Weekly Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-card border border-border/50 rounded-2xl p-6"
                  >
                    <WeeklyOverview
                      data={weeklyData}
                      maxValue={6}
                      label="Habits Completed"
                    />
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-semibold">28</p>
                      <p className="text-xs text-muted-foreground">Tasks Done</p>
                    </div>
                    <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-semibold">92%</p>
                      <p className="text-xs text-muted-foreground">Consistency</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

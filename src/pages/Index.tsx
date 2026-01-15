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
  { icon: TrendingUp, title: "Market Analysis", subtitle: "Review watchlist", href: "/investments", color: "trading" },
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
        <div className="h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
          {/* Compact Header */}
          <header className="px-6 pt-4 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-semibold tracking-tight"
                  >
                    {greeting()}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-xs text-muted-foreground"
                  >
                    {format(currentTime, "EEEE, MMMM d")}
                  </motion.p>
                </div>
              </div>
              
              {/* Streak Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs"
              >
                <Flame className="w-3.5 h-3.5 text-trading" />
                <span className="font-medium">7 day streak</span>
              </motion.div>
            </div>
          </header>

          {/* Main Content Grid - Fills remaining space */}
          <div className="flex-1 px-6 pb-4 overflow-hidden">
            <div className="h-full grid grid-cols-12 gap-3">
              {/* Left Column */}
              <div className="col-span-7 flex flex-col gap-3 overflow-hidden">
                {/* Progress Rings - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-border/50 rounded-xl p-4 flex-shrink-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-muted-foreground" />
                      <h2 className="text-sm font-medium">Monthly Progress</h2>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {format(currentTime, "MMMM yyyy")}
                    </p>
                  </div>
                  <div className="flex justify-around">
                    {domainProgress.map((domain, i) => (
                      <DomainProgressRing
                        key={domain.label}
                        {...domain}
                        delay={0.15 + i * 0.05}
                        compact
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Today's Habits - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-card border border-border/50 rounded-xl p-4 flex-1 min-h-0 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-medium">Today's Habits</h2>
                      <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                        <Zap className="w-2.5 h-2.5" />
                        {completedHabits}/{habits.length}
                      </div>
                    </div>
                    <div className="w-16 h-1 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${habitProgress}%` }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="h-full bg-foreground rounded-full"
                      />
                    </div>
                  </div>
                  <DailyHabits
                    date={selectedDate}
                    habits={habits}
                    onToggle={toggleHabit}
                    compact
                  />
                </motion.div>

                {/* Focus Today - Horizontal */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border/50 rounded-xl p-4 flex-shrink-0"
                >
                  <h2 className="text-sm font-medium mb-3">Focus Today</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {focusItems.map((item, i) => (
                      <FocusCard key={item.title} {...item} delay={0.25 + i * 0.03} compact />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="col-span-5 flex flex-col gap-3 overflow-hidden">
                {/* Devotion Widget */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex-shrink-0"
                >
                  <DevotionWidget
                    characterName="David"
                    dayNumber={7}
                    todayScripture="1 Samuel 17"
                    timeOfDay={timeOfDay}
                    compact
                  />
                </motion.div>

                {/* Calendar - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card border border-border/50 rounded-xl p-3 flex-1 min-h-0"
                >
                  <MiniCalendar
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    completedDates={completedDates}
                    compact
                  />
                </motion.div>

                {/* Weekly Overview + Quick Stats Combined */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-card border border-border/50 rounded-xl p-3 flex-shrink-0"
                >
                  <WeeklyOverview
                    data={weeklyData}
                    maxValue={6}
                    label="Habits Completed"
                    compact
                  />
                </motion.div>

                {/* Quick Stats - Inline */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 gap-2 flex-shrink-0"
                >
                  <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold">28</p>
                    <p className="text-[10px] text-muted-foreground">Tasks Done</p>
                  </div>
                  <div className="bg-card border border-border/50 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold">92%</p>
                    <p className="text-[10px] text-muted-foreground">Consistency</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

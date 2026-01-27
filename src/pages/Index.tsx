import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { DomainNavigation } from "@/components/dashboard/DomainNavigation";
import { ZenLayout } from "@/components/dashboard/layouts/ZenLayout";
import { defaultHabits } from "@/components/home/DailyHabits";
import { 
  Code2, 
  TrendingUp, 
  Music,
  Wallet,
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
    metric: { label: "Spent this month", value: "$2,340" }
  },
  {
    icon: TrendingUp,
    title: "Investments",
    subtitle: "Portfolio tracking",
    href: "/investments",
    metric: { label: "Total return", value: "+12.4%" }
  },
  {
    icon: Music,
    title: "Music",
    subtitle: "Practice & learn",
    href: "/music",
    metric: { label: "Hours this week", value: "8.5" }
  },
  {
    icon: Code2,
    title: "Tech",
    subtitle: "Skills & certs",
    href: "/tech",
    metric: { label: "Skills tracked", value: "24" }
  },
];

const Index = () => {
  const [habits, setHabits] = useState(defaultHabits);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
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
        <div className="min-h-screen px-6 py-4 max-w-6xl mx-auto">
          <HeroHeader currentTime={currentTime} />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 -mt-24"
          >
            {/* Domain navigation */}
            <div className="flex justify-end mb-4">
              <DomainNavigation />
            </div>

            {/* Dashboard content */}
            <ZenLayout
              habits={habits}
              onToggleHabit={toggleHabit}
              weeklyData={weeklyData}
              quickAccessItems={quickAccessItems}
              timeOfDay={timeOfDay}
            />
          </motion.div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

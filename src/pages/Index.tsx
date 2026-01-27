import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { ZenLayout } from "@/components/dashboard/layouts/ZenLayout";
import { defaultHabits } from "@/components/home/DailyHabits";
import { 
  BookOpen, 
  Bookmark, 
  Briefcase,
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
    icon: BookOpen,
    title: "Spiritual",
    subtitle: "Faith & devotion",
    href: "/spiritual",
    metric: { label: "Day streak", value: "45" }
  },
  {
    icon: Bookmark,
    title: "Content",
    subtitle: "Curated media",
    href: "/content",
    metric: { label: "Items saved", value: "128" }
  },
  {
    icon: Briefcase,
    title: "Projects",
    subtitle: "Active work",
    href: "/projects",
    metric: { label: "In progress", value: "3" }
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

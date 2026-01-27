import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { LayoutSwitcher, LayoutStyle } from "@/components/dashboard/layouts/LayoutSwitcher";
import { BentoLayout } from "@/components/dashboard/layouts/BentoLayout";
import { HeroLayout } from "@/components/dashboard/layouts/HeroLayout";
import { RowsLayout } from "@/components/dashboard/layouts/RowsLayout";
import { MagazineLayout } from "@/components/dashboard/layouts/MagazineLayout";
import { MinimalLayout } from "@/components/dashboard/layouts/MinimalLayout";
import { SakuraLayout } from "@/components/dashboard/layouts/SakuraLayout";
import { NeonLayout } from "@/components/dashboard/layouts/NeonLayout";
import { GhibliLayout } from "@/components/dashboard/layouts/GhibliLayout";
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
  const [currentLayout, setCurrentLayout] = useState<LayoutStyle>("bento");

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

  const layoutProps = {
    habits,
    onToggleHabit: toggleHabit,
    weeklyData,
    quickAccessItems,
    timeOfDay,
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen px-6 py-4 max-w-6xl mx-auto">
          <HeroHeader currentTime={currentTime} />

          {/* Content blends from header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 -mt-24"
          >
            {/* Layout switcher */}
            <div className="flex justify-end mb-4">
              <LayoutSwitcher 
                currentLayout={currentLayout} 
                onLayoutChange={setCurrentLayout} 
              />
            </div>

            {/* Dynamic layout content */}
            <AnimatePresence mode="wait">
              {currentLayout === "bento" && (
                <BentoLayout key="bento" {...layoutProps} />
              )}
              {currentLayout === "hero" && (
                <HeroLayout key="hero" {...layoutProps} />
              )}
              {currentLayout === "rows" && (
                <RowsLayout key="rows" {...layoutProps} />
              )}
              {currentLayout === "magazine" && (
                <MagazineLayout key="magazine" {...layoutProps} />
              )}
              {currentLayout === "minimal" && (
                <MinimalLayout key="minimal" {...layoutProps} />
              )}
              {currentLayout === "sakura" && (
                <SakuraLayout key="sakura" {...layoutProps} />
              )}
              {currentLayout === "neon" && (
                <NeonLayout key="neon" {...layoutProps} />
              )}
              {currentLayout === "ghibli" && (
                <GhibliLayout key="ghibli" {...layoutProps} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { DomainNavigation } from "@/components/dashboard/DomainNavigation";
import { ZenLayout } from "@/components/dashboard/layouts/ZenLayout";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hour = currentTime.getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  return (
    <MainLayout>
      <PageTransition>
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-2 sm:pt-4 pb-4">
          <HeroHeader currentTime={currentTime} />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 -mt-16 sm:-mt-20 lg:-mt-24"
          >
            {/* Domain navigation */}
            <div className="flex justify-end mb-3 sm:mb-4">
              <DomainNavigation />
            </div>

            {/* Dashboard content */}
            <ZenLayout timeOfDay={timeOfDay} />
          </motion.div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

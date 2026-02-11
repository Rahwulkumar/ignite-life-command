import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { DomainNavigation } from "@/components/dashboard/DomainNavigation";
import { ZenLayout } from "@/components/dashboard/layouts/ZenLayout";

// Import new mock data structure
// In future this will be a Supabase hook
import { mockData } from "@/lib/mockData";
import { Activity, AgentInsight, Streak } from "@/types/domain";

// Transform mock data to match new interfaces if needed
// This is a temporary bridge until we standardized mockData.ts structure
const dashboardActivities: Activity[] = [
  { type: "tech", title: "DSA Study Session", description: "Completed binary search problems", time: "2h ago" },
  { type: "finance", title: "Expense Logged", description: "Groceries - ₦15,000", time: "4h ago" },
  { type: "spiritual", title: "Bible Study", description: "Read Proverbs 3:5-6", time: "6h ago" },
  { type: "trading", title: "Position Opened", description: "Bought 10 shares of AAPL", time: "1d ago" },
  { type: "music", title: "Practice Session", description: "45 min guitar - chord transitions", time: "1d ago" },
];

const dashboardInsights: AgentInsight[] = [
  { agentName: "Nova", domain: "tech", insight: "You've been studying arrays for 3 days but haven't touched trees. Are you avoiding them because they're harder?", action: "challenge" },
  { agentName: "Marcus", domain: "finance", insight: "Dining out spending increased 40% this week. That's ₦24,000 diverted from your emergency fund.", action: "observation" },
  { agentName: "Atlas", domain: "trading", insight: "Pattern detected: You sell on red days. Is this strategy or emotion?", action: "challenge" },
];

const dashboardStreaks: Streak[] = [
  { id: "1", title: "DSA Study", count: 12, domain: "tech" },
  { id: "2", title: "Bible Time", count: 45, domain: "spiritual" },
  { id: "3", title: "Guitar Practice", count: 3, domain: "music" },
  { id: "4", title: "Trading Journal", count: 8, domain: "trading" },
];

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

            {/* Dashboard content - passing data down */}
            <ZenLayout
              timeOfDay={timeOfDay}
              activities={dashboardActivities}
              insights={dashboardInsights}
              streaks={dashboardStreaks}
            />
          </motion.div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

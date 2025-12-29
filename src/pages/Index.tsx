import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AgentInsights } from "@/components/dashboard/AgentInsights";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { DailyLessons } from "@/components/dashboard/DailyLessons";
import {
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
} from "lucide-react";

const domains = [
  {
    icon: Wallet,
    title: "Finance",
    description: "Track expenses, income, and budgets with AI coaching",
    stats: [
      { label: "This Month", value: "₦450K" },
      { label: "Saved", value: "₦120K" },
    ],
    color: "finance" as const,
    progress: 67,
    trend: "up" as const,
  },
  {
    icon: TrendingUp,
    title: "Trading",
    description: "Monitor positions and pattern analysis",
    stats: [
      { label: "Open", value: "4" },
      { label: "Weekly", value: "+12.5%" },
    ],
    color: "trading" as const,
    progress: 82,
    trend: "up" as const,
  },
  {
    icon: Code2,
    title: "Tech & Learning",
    description: "DSA, development, AI engineering",
    stats: [
      { label: "Hours", value: "24h" },
      { label: "Solved", value: "47" },
    ],
    color: "tech" as const,
    progress: 45,
  },
  {
    icon: BookOpen,
    title: "Spiritual",
    description: "Prayer and Bible study tracking",
    stats: [
      { label: "Weekly", value: "5.2h" },
      { label: "Streak", value: "45d" },
    ],
    color: "spiritual" as const,
    progress: 90,
  },
  {
    icon: Music,
    title: "Music",
    description: "Practice sessions and progress",
    stats: [
      { label: "Weekly", value: "3.5h" },
      { label: "Focus", value: "Guitar" },
    ],
    color: "music" as const,
    progress: 28,
  },
  {
    icon: Bookmark,
    title: "Content",
    description: "Saved reels, videos, and notes",
    stats: [
      { label: "Saved", value: "128" },
      { label: "Folders", value: "12" },
    ],
    color: "content" as const,
  },
  {
    icon: Briefcase,
    title: "Projects",
    description: "Work and professional development",
    stats: [
      { label: "Active", value: "3" },
      { label: "Done", value: "12" },
    ],
    color: "work" as const,
    progress: 55,
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
        <WelcomeHeader />

        <div className="grid grid-cols-12 gap-5">
          {/* Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-5">
            {/* Primary Domain Cards - Bento Grid */}
            <div className="grid grid-cols-2 gap-5">
              {domains.slice(0, 4).map((domain, index) => (
                <DomainCard key={domain.title} {...domain} delay={index * 80} />
              ))}
            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-3 gap-5">
              {domains.slice(4).map((domain, index) => (
                <DomainCard key={domain.title} {...domain} delay={(index + 4) * 80} />
              ))}
            </div>

            {/* Agent Insights */}
            <AgentInsights />
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-5">
            <QuickActions />
            <DailyLessons />
            <StreakTracker />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

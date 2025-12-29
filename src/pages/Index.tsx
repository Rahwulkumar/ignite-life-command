import { MainLayout } from "@/components/layout/MainLayout";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { DomainCard } from "@/components/dashboard/DomainCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AgentInsights } from "@/components/dashboard/AgentInsights";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { StreakTracker } from "@/components/dashboard/StreakTracker";
import { ChatInterface } from "@/components/chat/ChatInterface";
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
    description: "Track expenses, income, and budgets",
    stats: [
      { label: "This Month", value: "₦450,000" },
      { label: "Saved", value: "₦120,000" },
    ],
    color: "finance" as const,
    progress: 67,
  },
  {
    icon: TrendingUp,
    title: "Trading",
    description: "Monitor positions and patterns",
    stats: [
      { label: "Open Positions", value: "4" },
      { label: "This Week", value: "+12.5%" },
    ],
    color: "trading" as const,
    progress: 82,
  },
  {
    icon: Code2,
    title: "Tech & Learning",
    description: "DSA, development, AI engineering",
    stats: [
      { label: "Study Hours", value: "24h" },
      { label: "Problems Solved", value: "47" },
    ],
    color: "tech" as const,
    progress: 45,
  },
  {
    icon: BookOpen,
    title: "Spiritual",
    description: "Prayer and Bible study",
    stats: [
      { label: "This Week", value: "5.2h" },
      { label: "Streak", value: "45 days" },
    ],
    color: "spiritual" as const,
    progress: 90,
  },
  {
    icon: Music,
    title: "Music",
    description: "Practice sessions and progress",
    stats: [
      { label: "This Week", value: "3.5h" },
      { label: "Skills", value: "Guitar" },
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
      { label: "Completed", value: "12" },
    ],
    color: "work" as const,
    progress: 55,
  },
];

const Index = () => {
  return (
    <MainLayout>
      <div className="p-8">
        <WelcomeHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Domain Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {domains.slice(0, 4).map((domain, index) => (
                <DomainCard
                  key={domain.title}
                  {...domain}
                  delay={index * 100}
                />
              ))}
            </div>

            {/* Secondary Row */}
            <div className="grid grid-cols-3 gap-4">
              {domains.slice(4).map((domain, index) => (
                <DomainCard
                  key={domain.title}
                  {...domain}
                  delay={(index + 4) * 100}
                />
              ))}
            </div>

            {/* AI Chat Interface */}
            <ChatInterface />
          </div>

          {/* Right Column - Sidebar Content */}
          <div className="col-span-4 space-y-6">
            <QuickActions />
            <AgentInsights />
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

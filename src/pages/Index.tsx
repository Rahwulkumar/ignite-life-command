import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const domains = [
  {
    icon: Wallet,
    title: "Finance",
    path: "/finance",
    color: "finance",
    value: "₦450K",
    label: "This month",
    change: "+12%",
  },
  {
    icon: TrendingUp,
    title: "Trading",
    path: "/trading",
    color: "trading",
    value: "4",
    label: "Open positions",
    change: "+8.5%",
  },
  {
    icon: Code2,
    title: "Tech",
    path: "/tech",
    color: "tech",
    value: "47",
    label: "Problems solved",
    change: "+5 this week",
  },
  {
    icon: BookOpen,
    title: "Spiritual",
    path: "/spiritual",
    color: "spiritual",
    value: "45",
    label: "Day streak",
    change: "5.2h weekly",
  },
  {
    icon: Music,
    title: "Music",
    path: "/music",
    color: "music",
    value: "3.5h",
    label: "Weekly practice",
    change: "Guitar focus",
  },
  {
    icon: Bookmark,
    title: "Content",
    path: "/content",
    color: "content",
    value: "128",
    label: "Saved items",
    change: "12 folders",
  },
  {
    icon: Briefcase,
    title: "Projects",
    path: "/projects",
    color: "work",
    value: "3",
    label: "Active projects",
    change: "12 completed",
  },
];

const colorMap: Record<string, string> = {
  finance: "text-finance border-finance/20 hover:border-finance/40",
  trading: "text-trading border-trading/20 hover:border-trading/40",
  tech: "text-tech border-tech/20 hover:border-tech/40",
  spiritual: "text-spiritual border-spiritual/20 hover:border-spiritual/40",
  music: "text-music border-music/20 hover:border-music/40",
  content: "text-content border-content/20 hover:border-content/40",
  work: "text-work border-work/20 hover:border-work/40",
};

const bgMap: Record<string, string> = {
  finance: "bg-finance/5",
  trading: "bg-trading/5",
  tech: "bg-tech/5",
  spiritual: "bg-spiritual/5",
  music: "bg-music/5",
  content: "bg-content/5",
  work: "bg-work/5",
};

const Index = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <p className="text-muted-foreground text-sm mb-1">{greeting}</p>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        </header>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 mb-10 p-4 bg-card/50 rounded-xl border border-border/50">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-trading" />
            <span className="font-mono text-lg font-medium">45</span>
            <span className="text-muted-foreground text-sm">day streak</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">5</span> agents active
          </div>
        </div>

        {/* Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <Link
              key={domain.path}
              to={domain.path}
              className={cn(
                "group p-6 rounded-xl border transition-all duration-200",
                "bg-card hover:bg-card-elevated",
                colorMap[domain.color]
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-2.5 rounded-lg", bgMap[domain.color])}>
                  <domain.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-foreground font-medium mb-1">{domain.title}</h3>
              
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-medium text-foreground">{domain.value}</span>
                <span className="text-sm text-muted-foreground">{domain.label}</span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">{domain.change}</p>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
  MessageSquare,
  Settings,
} from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Wallet, label: "Finance", path: "/finance", color: "finance" },
  { icon: TrendingUp, label: "Trading", path: "/trading", color: "trading" },
  { icon: Code2, label: "Tech", path: "/tech", color: "tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual", color: "spiritual" },
  { icon: Music, label: "Music", path: "/music", color: "music" },
  { icon: Bookmark, label: "Content", path: "/content", color: "content" },
  { icon: Briefcase, label: "Projects", path: "/projects", color: "work" },
];

const colorStyles: Record<string, string> = {
  finance: "text-finance",
  trading: "text-trading",
  tech: "text-tech",
  spiritual: "text-spiritual",
  music: "text-music",
  content: "text-content",
  work: "text-work",
};

const bgStyles: Record<string, string> = {
  finance: "bg-finance/10",
  trading: "bg-trading/10",
  tech: "bg-tech/10",
  spiritual: "bg-spiritual/10",
  music: "bg-music/10",
  content: "bg-content/10",
  work: "bg-work/10",
};

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-16 bg-sidebar flex flex-col items-center py-6 border-r border-border/50">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center">
          <span className="text-background font-bold text-sm">N</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const color = item.color;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative",
                isActive && color
                  ? cn(bgStyles[color], colorStyles[color])
                  : isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div className="absolute left-14 px-2 py-1 bg-card border border-border rounded-md text-xs font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-1">
        <Link
          to="/chat"
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
            location.pathname === "/chat"
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
          title="AI Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </Link>
        <Link
          to="/settings"
          className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}

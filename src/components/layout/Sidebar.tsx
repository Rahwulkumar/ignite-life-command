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
} from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/" },
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
  { icon: Code2, label: "Tech", path: "/tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual" },
  { icon: Music, label: "Music", path: "/music" },
  { icon: Bookmark, label: "Content", path: "/content" },
  { icon: Briefcase, label: "Projects", path: "/projects" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-16 bg-background flex flex-col items-center py-8 border-r border-border">
      {/* Logo */}
      <div className="mb-10">
        <div className="w-8 h-8 rounded bg-foreground flex items-center justify-center">
          <span className="text-background font-medium text-sm">N</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "w-10 h-10 rounded flex items-center justify-center transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={item.label}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </Link>
          );
        })}
      </nav>

      {/* Chat */}
      <Link
        to="/chat"
        className={cn(
          "w-10 h-10 rounded flex items-center justify-center transition-colors",
          location.pathname === "/chat"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
        title="AI Chat"
      >
        <MessageSquare className="w-[18px] h-[18px]" strokeWidth={1.5} />
      </Link>
    </aside>
  );
}

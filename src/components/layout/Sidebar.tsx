import { useState } from "react";
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
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/", color: "text-primary" },
  { icon: Wallet, label: "Finance", path: "/finance", color: "text-finance" },
  { icon: TrendingUp, label: "Trading", path: "/trading", color: "text-trading" },
  { icon: Code2, label: "Tech & Learning", path: "/tech", color: "text-tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual", color: "text-spiritual" },
  { icon: Music, label: "Music", path: "/music", color: "text-music" },
  { icon: Bookmark, label: "Content", path: "/content", color: "text-content" },
  { icon: Briefcase, label: "Projects", path: "/projects", color: "text-work" },
];

const agents = [
  { name: "Marcus", role: "Finance Coach", color: "bg-finance", initial: "M" },
  { name: "Atlas", role: "Trading Mentor", color: "bg-trading", initial: "A" },
  { name: "Nova", role: "Tech Coach", color: "bg-tech", initial: "N" },
  { name: "Sage", role: "Spiritual Guide", color: "bg-spiritual", initial: "S" },
  { name: "Aria", role: "Music Instructor", color: "bg-music", initial: "A" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-semibold text-lg">Nexus</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
            collapsed && "mx-auto"
          )}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? item.color : "group-hover:" + item.color
                )}
              />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* AI Agents Section */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-sidebar-border">
          <p className="px-3 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            AI Coaches
          </p>
          <div className="space-y-1">
            {agents.map((agent) => (
              <button
                key={agent.name}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors group"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-background",
                    agent.color
                  )}
                >
                  {agent.initial}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {agent.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <Link
          to="/chat"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <MessageSquare className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Chat with AI</span>}
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors mt-1",
            collapsed && "justify-center"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium text-sm">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}

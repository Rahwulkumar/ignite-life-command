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
  Menu,
  X,
  Zap,
} from "lucide-react";

const navigationItems = [
  { icon: LayoutDashboard, label: "Command", path: "/", color: "primary" },
  { icon: Wallet, label: "Finance", path: "/finance", color: "finance" },
  { icon: TrendingUp, label: "Trading", path: "/trading", color: "trading" },
  { icon: Code2, label: "Tech", path: "/tech", color: "tech" },
  { icon: BookOpen, label: "Spirit", path: "/spiritual", color: "spiritual" },
  { icon: Music, label: "Music", path: "/music", color: "music" },
  { icon: Bookmark, label: "Content", path: "/content", color: "content" },
  { icon: Briefcase, label: "Work", path: "/projects", color: "work" },
];

const agents = [
  { name: "Marcus", role: "Finance", color: "finance" },
  { name: "Atlas", role: "Trading", color: "trading" },
  { name: "Nova", role: "Tech", color: "tech" },
  { name: "Sage", role: "Spirit", color: "spiritual" },
  { name: "Aria", role: "Music", color: "music" },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  finance: "bg-finance text-primary-foreground",
  trading: "bg-trading text-primary-foreground",
  tech: "bg-tech text-primary-foreground",
  spiritual: "bg-spiritual text-primary-foreground",
  music: "bg-music text-primary-foreground",
  content: "bg-content text-primary-foreground",
  work: "bg-work text-primary-foreground",
};

const borderColorMap: Record<string, string> = {
  primary: "border-l-primary",
  finance: "border-l-finance",
  trading: "border-l-trading",
  tech: "border-l-tech",
  spiritual: "border-l-spiritual",
  music: "border-l-music",
  content: "border-l-content",
  work: "border-l-work",
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen bg-sidebar/95 backdrop-blur-xl transition-all duration-500 flex flex-col",
        "border-r border-border/30",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-border/30">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -inset-1 bg-primary/20 rounded-lg blur-md -z-10" />
            </div>
            <div>
              <span className="font-display text-2xl italic text-foreground">Nexus</span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-300",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <Menu className="w-4 h-4 text-foreground" />
          ) : (
            <X className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group relative",
                  isActive
                    ? cn("bg-muted border-l-2", borderColorMap[item.color])
                    : "hover:bg-muted/50 border-l-2 border-l-transparent"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive
                      ? `text-${item.color}`
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                  style={isActive ? { color: `hsl(var(--${item.color}))` } : {}}
                />
                {!collapsed && (
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* AI Agents */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-border/30">
          <p className="px-3 mb-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.2em]">
            Active Agents
          </p>
          <div className="flex items-center gap-1 px-3">
            {agents.map((agent, idx) => (
              <div
                key={agent.name}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10",
                  colorMap[agent.color]
                )}
                style={{ marginLeft: idx > 0 ? "-6px" : "0" }}
                title={`${agent.name} - ${agent.role}`}
              >
                {agent.name[0]}
              </div>
            ))}
            <span className="ml-3 text-xs text-muted-foreground">5 online</span>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-border/30 space-y-2">
        <Link
          to="/chat"
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-300 group",
            "bg-primary/10 hover:bg-primary/20 border border-primary/20",
            collapsed && "justify-center"
          )}
        >
          <MessageSquare className="w-5 h-5 text-primary" />
          {!collapsed && <span className="text-sm font-medium text-primary">Chat</span>}
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all",
            collapsed && "justify-center"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </aside>
  );
}

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
  Settings,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
  { icon: Code2, label: "Tech", path: "/tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual" },
  { icon: Music, label: "Music", path: "/music" },
  { icon: Bookmark, label: "Content", path: "/content" },
  { icon: Briefcase, label: "Projects", path: "/projects" },
  { icon: StickyNote, label: "Notes", path: "/notes" },
  { icon: Settings, label: "Settings", path: "/settings", showLabelOnMobile: true },
];

export function TopNavigation() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/60 via-background/30 to-transparent backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <Link to="/" className="font-semibold text-foreground text-sm sm:text-base">
            LifeOs
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item, i) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/" ||
                    location.pathname.startsWith("/domains/")
                  : location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={item.path}
                    title={item.label}
                    aria-label={item.label}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-md text-xs font-medium transition-colors min-w-[2.5rem] justify-center sm:min-w-0 sm:justify-start",
                      isActive
                        ? "bg-foreground/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className={item.showLabelOnMobile ? "inline" : "hidden md:inline"}>
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

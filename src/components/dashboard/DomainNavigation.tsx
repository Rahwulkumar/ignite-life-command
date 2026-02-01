import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
  { icon: Code2, label: "Tech", path: "/tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual" },
  { icon: Music, label: "Music", path: "/music" },
  { icon: Bookmark, label: "Content", path: "/content" },
  { icon: Briefcase, label: "Projects", path: "/projects" },
];

export function DomainNavigation() {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-lg bg-muted/50 border border-border overflow-x-auto scrollbar-hide">
      {domains.map((domain, i) => (
        <motion.div
          key={domain.path}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link
            to={domain.path}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors whitespace-nowrap"
          >
            <domain.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{domain.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

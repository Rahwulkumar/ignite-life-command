import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bookmark,
  Briefcase,
  Code2,
  Music,
  Plus,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useCustomDomains } from "@/hooks/useCustomDomains";
import { getCustomDomainIconComponent } from "@/components/shared/custom-domain-icons";

const builtInDomains = [
  { icon: Wallet, label: "Finance", path: "/finance" },
  { icon: TrendingUp, label: "Investments", path: "/investments" },
  { icon: Code2, label: "Tech", path: "/tech" },
  { icon: BookOpen, label: "Spiritual", path: "/spiritual" },
  { icon: Music, label: "Music", path: "/music" },
  { icon: Bookmark, label: "Content", path: "/content" },
  { icon: Briefcase, label: "Projects", path: "/projects" },
  { icon: Settings, label: "Settings", path: "/settings", showLabelOnMobile: true },
];

interface DomainNavigationProps {
  onCreateDomain?: () => void;
}

export function DomainNavigation({ onCreateDomain }: DomainNavigationProps) {
  const { data: customDomains = [] } = useCustomDomains();

  const domains = [
    ...builtInDomains,
    ...customDomains.map((domain) => ({
      icon: getCustomDomainIconComponent(domain.iconKey),
      label: domain.name,
      path: `/domains/${domain.slug}`,
      showLabelOnMobile: false,
    })),
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto rounded-lg border border-border bg-muted/50 p-1 scrollbar-hide">
      {domains.map((domain, i) => (
        <motion.div
          key={domain.path}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link
            to={domain.path}
            title={domain.label}
            aria-label={domain.label}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground sm:gap-2 sm:px-3"
          >
            <domain.icon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className={domain.showLabelOnMobile ? "inline" : "hidden sm:inline"}>
              {domain.label}
            </span>
          </Link>
        </motion.div>
      ))}

      {onCreateDomain && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: domains.length * 0.03 }}
          onClick={onCreateDomain}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground sm:gap-2 sm:px-3"
        >
          <Plus className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">New Domain</span>
        </motion.button>
      )}
    </div>
  );
}

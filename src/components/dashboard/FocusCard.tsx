import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FocusCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  delay?: number;
}

export function FocusCard({
  icon: Icon,
  title,
  subtitle,
  href,
  color,
  delay = 0,
}: FocusCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        to={href}
        className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-all hover:bg-card/80"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            `bg-${color}/10`
          )}
        >
          <Icon className={cn("w-5 h-5", `text-${color}`)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}

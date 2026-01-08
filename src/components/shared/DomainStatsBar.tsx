import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  color?: string;
}

interface DomainStatsBarProps {
  stats: StatItem[];
}

export function DomainStatsBar({ stats }: DomainStatsBarProps) {
  return (
    <div className="px-8 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
              className="p-4 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn("w-4 h-4", stat.color || "text-muted-foreground")} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground ml-1">{stat.suffix}</span>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

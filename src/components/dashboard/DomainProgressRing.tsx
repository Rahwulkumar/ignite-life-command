import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DomainProgressRingProps {
  icon: LucideIcon;
  label: string;
  value: number;
  total: number;
  unit: string;
  color: string;
  delay?: number;
}

export function DomainProgressRing({
  icon: Icon,
  label,
  value,
  total,
  unit,
  color,
  delay = 0,
}: DomainProgressRingProps) {
  const percentage = Math.min((value / total) * 100, 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative">
        <svg width="88" height="88" viewBox="0 0 88 88">
          {/* Background circle */}
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <motion.circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke={`hsl(var(--${color}))`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            transform="rotate(-90 44 44)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={cn("w-5 h-5", `text-${color}`)} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold">
          {value}<span className="text-muted-foreground text-sm">/{total}</span>
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

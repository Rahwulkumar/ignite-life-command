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
  compact?: boolean;
}

export function DomainProgressRing({
  icon: Icon,
  label,
  value,
  total,
  unit,
  color,
  delay = 0,
  compact = false,
}: DomainProgressRingProps) {
  const percentage = Math.min((value / total) * 100, 100);
  const size = compact ? 56 : 88;
  const radius = compact ? 22 : 36;
  const strokeWidth = compact ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={cn("flex flex-col items-center", compact ? "gap-1.5" : "gap-3")}
    >
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`hsl(var(--${color}))`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={cn(compact ? "w-4 h-4" : "w-5 h-5", `text-${color}`)} />
        </div>
      </div>
      <div className="text-center">
        <p className={cn("font-semibold", compact ? "text-sm" : "text-lg")}>
          {value}<span className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-sm")}>/{total}</span>
        </p>
        <p className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>{label}</p>
      </div>
    </motion.div>
  );
}

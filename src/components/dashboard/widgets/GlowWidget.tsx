import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlowWidgetProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  delay?: number;
}

export function GlowWidget({ children, glowColor = "foreground", className, delay = 0 }: GlowWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative group rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50",
        "hover:border-border transition-all duration-300",
        "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
        "hover:before:opacity-100",
        className
      )}
      style={{
        boxShadow: `0 0 0 1px hsl(var(--border) / 0.5)`,
      }}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface StatWidgetProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
  trend?: { value: number; positive: boolean };
  delay?: number;
}

export function StatWidget({ icon: Icon, label, value, subtext, color, trend, delay = 0 }: StatWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-5 group hover:border-border/80 transition-all"
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
        style={{ background: `radial-gradient(circle at top right, hsl(var(--${color})), transparent 70%)` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div 
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-muted to-muted/50"
            )}
          >
            <Icon className={cn("w-5 h-5", `text-${color}`)} />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.positive ? "bg-finance/10 text-finance" : "bg-destructive/10 text-destructive"
            )}>
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {subtext && (
          <p className="text-xs text-muted-foreground/70 mt-0.5">{subtext}</p>
        )}
      </div>
    </motion.div>
  );
}

interface ProgressWidgetProps {
  icon: LucideIcon;
  title: string;
  current: number;
  total: number;
  unit: string;
  color: string;
  delay?: number;
}

export function ProgressWidget({ icon: Icon, title, current, total, unit, color, delay = 0 }: ProgressWidgetProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 group hover:border-border transition-all"
    >
      {/* Ambient glow */}
      <div 
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.08] blur-3xl group-hover:opacity-[0.12] transition-opacity"
        style={{ background: `hsl(var(--${color}))` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `hsl(var(--${color}) / 0.15)` }}
          >
            <Icon className={cn("w-4 h-4", `text-${color}`)} />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
        
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-3xl font-semibold">{current}</span>
            <span className="text-muted-foreground text-lg">/{total}</span>
          </div>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `hsl(var(--${color}))` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GoalProgressProps {
  icon: LucideIcon;
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  href?: string;
  delay?: number;
}

export function GoalProgress({ 
  icon: Icon, 
  title, 
  current, 
  target, 
  unit, 
  color, 
  href,
  delay = 0 
}: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const Content = () => (
    <>
      {/* Subtle ambient glow */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ background: `hsl(var(--${color}))` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `hsl(var(--${color}) / 0.12)` }}
            >
              <Icon className="w-5 h-5" style={{ color: `hsl(var(--${color}))` }} />
            </div>
            <span className="font-medium">{title}</span>
          </div>
          {href && (
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
        
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{current}</span>
            <span className="text-muted-foreground">/ {target}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
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
    </>
  );

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
      >
        <Link
          to={href}
          className="group block relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-all duration-300"
        >
          <Content />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5"
    >
      <Content />
    </motion.div>
  );
}

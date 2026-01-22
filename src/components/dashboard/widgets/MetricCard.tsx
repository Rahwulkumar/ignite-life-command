import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  color: string;
  delay?: number;
}

export function MetricCard({ icon: Icon, label, value, change, color, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border/50 p-6 hover:border-border/80 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
    >
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ 
          background: `radial-gradient(ellipse at top right, hsl(var(--${color}) / 0.15), transparent 60%)` 
        }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <motion.div
          animate={{ y: [-20, 20], x: [-10, 10] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-4 right-8 w-1 h-1 rounded-full"
          style={{ background: `hsl(var(--${color}) / 0.4)` }}
        />
        <motion.div
          animate={{ y: [20, -20], x: [10, -10] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute bottom-8 right-4 w-1.5 h-1.5 rounded-full"
          style={{ background: `hsl(var(--${color}) / 0.3)` }}
        />
      </div>
      
      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color}) / 0.3), transparent)` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <motion.div 
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {/* Icon background with gradient */}
            <div 
              className="absolute inset-0"
              style={{ background: `linear-gradient(135deg, hsl(var(--${color}) / 0.2), hsl(var(--${color}) / 0.05))` }}
            />
            {/* Inner glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: `inset 0 0 20px hsl(var(--${color}) / 0.3)` }}
            />
            <Icon className="w-6 h-6 relative z-10" style={{ color: `hsl(var(--${color}))` }} />
          </motion.div>
          
          {change && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.4, duration: 0.3 }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm",
                change.positive 
                  ? "bg-finance/15 text-finance border border-finance/20" 
                  : "bg-destructive/15 text-destructive border border-destructive/20"
              )}
            >
              {change.positive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {change.positive ? "+" : ""}{change.value}%
            </motion.div>
          )}
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text"
        >
          {value}
        </motion.p>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          {label}
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        </p>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { LucideIcon, ChevronRight, Sparkles } from "lucide-react";
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
  const isComplete = percentage >= 100;
  
  const Content = () => (
    <>
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `radial-gradient(ellipse at bottom right, hsl(var(--${color}) / 0.12), transparent 70%)` 
        }}
      />
      
      {/* Completion celebration */}
      {isComplete && (
        <motion.div
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, hsl(var(--${color}) / 0.1), transparent)` }}
        />
      )}
      
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left"
        style={{ background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color}) / 0.3), transparent)` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div 
              className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, hsl(var(--${color}) / 0.2), hsl(var(--${color}) / 0.05))` }}
              />
              <Icon className="w-5 h-5 relative z-10" style={{ color: `hsl(var(--${color}))` }} />
            </motion.div>
            <span className="font-semibold">{title}</span>
          </div>
          
          {href && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          )}
          
          {isComplete && (
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5" style={{ color: `hsl(var(--${color}))` }} />
            </motion.div>
          )}
        </div>
        
        <div className="mb-4">
          <div className="flex items-baseline gap-1.5">
            <motion.span 
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {current}
            </motion.span>
            <span className="text-muted-foreground text-lg">/ {target}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">{unit}</p>
        </div>
        
        {/* Enhanced progress bar */}
        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color}) / 0.7))` }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
        
        {/* Percentage label */}
        <motion.div 
          className="flex justify-end mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          <span 
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ 
              background: `hsl(var(--${color}) / 0.1)`,
              color: `hsl(var(--${color}))`
            }}
          >
            {Math.round(percentage)}%
          </span>
        </motion.div>
      </div>
    </>
  );

  const containerClasses = "group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/10 border border-border/50 p-5 hover:border-border/80 hover:shadow-lg hover:shadow-black/5 transition-all duration-300";

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -3 }}
      >
        <Link to={href} className={containerClasses}>
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
      whileHover={{ y: -3 }}
      className={containerClasses}
    >
      <Content />
    </motion.div>
  );
}

import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface GoalProgressProps {
  icon: LucideIcon;
  title: string;
  current: number;
  target: number;
  unit: string;
  href?: string;
  index?: number;
}

export function GoalProgress({ 
  icon: Icon, 
  title, 
  current, 
  target, 
  unit, 
  href,
  index = 0
}: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const content = (
    <>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-md flex items-center justify-center bg-muted">
          <Icon className="w-3.5 h-3.5 text-foreground" />
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-lg font-semibold tabular-nums">{current}</span>
        <span className="text-sm text-muted-foreground">/ {target}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{unit}</p>
      
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-foreground/70"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
        />
      </div>
    </>
  );

  const Wrapper = href ? motion(Link) : motion.div;
  
  return (
    <Wrapper
      to={href as string}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="block rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors"
    >
      {content}
    </Wrapper>
  );
}

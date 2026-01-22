import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  color: string;
  delay?: number;
}

export function InsightCard({ icon: Icon, title, description, action, color, delay = 0 }: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-5"
      style={{ 
        background: `linear-gradient(135deg, hsl(var(--${color}) / 0.12), hsl(var(--${color}) / 0.04))`,
        border: `1px solid hsl(var(--${color}) / 0.2)`
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
        style={{ background: `hsl(var(--${color}))` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `hsl(var(--${color}) / 0.2)` }}
          >
            <Icon className="w-5 h-5" style={{ color: `hsl(var(--${color}))` }} />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
            
            {action && (
              <Link 
                to={action.href}
                className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
                style={{ color: `hsl(var(--${color}))` }}
              >
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

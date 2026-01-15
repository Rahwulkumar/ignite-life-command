import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DomainLinkCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  color: string;
  stats?: { label: string; value: string | number }[];
  delay?: number;
}

export function DomainLinkCard({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  color, 
  stats,
  delay = 0 
}: DomainLinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link
        to={href}
        className="group block relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-all duration-300"
      >
        {/* Gradient accent line at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(90deg, hsl(var(--${color})), hsl(var(--${color}) / 0.3))` }}
        />
        
        {/* Ambient glow */}
        <div 
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-500"
          style={{ background: `hsl(var(--${color}))` }}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: `hsl(var(--${color}) / 0.12)` }}
            >
              <Icon className={cn("w-5 h-5", `text-${color}`)} />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          
          <h3 className="font-semibold text-base mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          {stats && stats.length > 0 && (
            <div className="flex gap-4 pt-3 border-t border-border/50">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-lg font-semibold">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

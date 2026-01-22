import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickAccessItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  metric?: { label: string; value: string | number };
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
  delay?: number;
}

export function QuickAccessGrid({ items, delay = 0 }: QuickAccessGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + i * 0.08, duration: 0.4 }}
        >
          <Link
            to={item.href}
            className="group relative block overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-all duration-300 h-full"
          >
            {/* Gradient accent */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, hsl(var(--${item.color})), transparent)` }}
            />
            
            {/* Hover glow */}
            <div 
              className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500"
              style={{ background: `hsl(var(--${item.color}))` }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(var(--${item.color}) / 0.12)` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: `hsl(var(--${item.color}))` }} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{item.subtitle}</p>
              
              {item.metric && (
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xl font-bold">{item.metric.value}</p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.metric.label}</p>
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

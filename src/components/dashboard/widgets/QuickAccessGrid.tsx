import { motion } from "framer-motion";
import { LucideIcon, ArrowUpRight, Sparkles } from "lucide-react";
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
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: delay + i * 0.08, duration: 0.4, type: "spring" }}
          whileHover={{ y: -4, scale: 1.01 }}
        >
          <Link
            to={item.href}
            className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-muted/20 border border-border/50 p-6 hover:border-border/80 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 h-full"
          >
            {/* Animated gradient accent */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + i * 0.08 + 0.2, duration: 0.5 }}
              style={{ 
                background: `linear-gradient(90deg, hsl(var(--${item.color})), hsl(var(--${item.color}) / 0.3), transparent)`,
                transformOrigin: 'left'
              }}
            />
            
            {/* Hover glow */}
            <motion.div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500"
              style={{ background: `hsl(var(--${item.color}))` }}
            />
            
            {/* Background pattern */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--${item.color})) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-5">
                <motion.div 
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Icon background layers */}
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, hsl(var(--${item.color}) / 0.2), hsl(var(--${item.color}) / 0.05))` }}
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `inset 0 0 20px hsl(var(--${item.color}) / 0.2)` }}
                  />
                  <item.icon className="w-6 h-6 relative z-10" style={{ color: `hsl(var(--${item.color}))` }} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileHover={{ scale: 1.2 }}
                  className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: `hsl(var(--${item.color}) / 0.1)` }}
                  >
                    <ArrowUpRight className="w-4 h-4" style={{ color: `hsl(var(--${item.color}))` }} />
                  </div>
                </motion.div>
              </div>
              
              <h3 className="font-semibold text-lg mb-1 group-hover:text-foreground transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.subtitle}</p>
              
              {item.metric && (
                <motion.div 
                  className="pt-4 border-t border-border/50"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: delay + i * 0.08 + 0.3 }}
                >
                  <p 
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: `hsl(var(--${item.color}))` }}
                  >
                    {item.metric.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">
                    {item.metric.label}
                  </p>
                </motion.div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

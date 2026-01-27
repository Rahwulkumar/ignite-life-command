import { LucideIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface QuickAccessItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  color?: string;
  metric?: { label: string; value: string | number };
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 + i * 0.05, ease: "easeOut" }}
          whileHover={{ y: -3 }}
        >
          <Link
            to={item.href}
            className="group block rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ background: `hsl(var(--${item.color || 'muted-foreground'}) / 0.1)` }}
              >
                <item.icon 
                  className="w-4 h-4" 
                  style={{ color: `hsl(var(--${item.color || 'muted-foreground'}))` }} 
                />
              </div>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="font-medium text-sm">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
            
            {item.metric && (
              <div className="mt-3 pt-3 border-t border-border">
                <p 
                  className="text-lg font-semibold tabular-nums"
                  style={{ color: `hsl(var(--${item.color || 'foreground'}))` }}
                >
                  {item.metric.value}
                </p>
                <p className="text-xs text-muted-foreground">{item.metric.label}</p>
              </div>
            )}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

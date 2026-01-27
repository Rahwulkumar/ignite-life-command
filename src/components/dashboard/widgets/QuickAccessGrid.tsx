import { LucideIcon, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className="group rounded-xl bg-card border border-border p-5 hover:border-border/80 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `hsl(var(--${item.color}) / 0.1)` }}
            >
              <item.icon className="w-5 h-5" style={{ color: `hsl(var(--${item.color}))` }} />
            </div>
            
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `hsl(var(--${item.color}) / 0.1)` }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" style={{ color: `hsl(var(--${item.color}))` }} />
            </div>
          </div>
          
          <h3 className="font-medium mb-0.5">{item.title}</h3>
          <p className="text-sm text-muted-foreground mb-3">{item.subtitle}</p>
          
          {item.metric && (
            <div className="pt-3 border-t border-border">
              <p 
                className="text-xl font-semibold"
                style={{ color: `hsl(var(--${item.color}))` }}
              >
                {item.metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.metric.label}</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

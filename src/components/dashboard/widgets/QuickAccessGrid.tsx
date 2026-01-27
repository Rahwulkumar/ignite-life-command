import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAccessItem {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string;
  metric?: { label: string; value: string | number };
}

interface QuickAccessGridProps {
  items: QuickAccessItem[];
}

export function QuickAccessGrid({ items }: QuickAccessGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className="group rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <item.icon className="w-4 h-4 text-muted-foreground" />
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <h3 className="font-medium text-sm">{item.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
          
          {item.metric && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-lg font-semibold tabular-nums">{item.metric.value}</p>
              <p className="text-xs text-muted-foreground">{item.metric.label}</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}

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

export function InsightCard({ icon: Icon, title, description, action, color }: InsightCardProps) {
  return (
    <div 
      className="rounded-xl p-5 border"
      style={{ 
        background: `hsl(var(--${color}) / 0.05)`,
        borderColor: `hsl(var(--${color}) / 0.15)`
      }}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `hsl(var(--${color}) / 0.1)` }}
        >
          <Icon className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {description}
          </p>
          
          {action && (
            <Link 
              to={action.href}
              className="inline-flex items-center gap-1.5 text-sm font-medium hover:gap-2 transition-all"
              style={{ color: `hsl(var(--${color}))` }}
            >
              {action.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

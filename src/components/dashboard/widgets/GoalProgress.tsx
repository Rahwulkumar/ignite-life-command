import { LucideIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  href 
}: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const Content = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: `hsl(var(--${color}) / 0.1)` }}
          >
            <Icon className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        {href && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
      
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold">{current}</span>
          <span className="text-muted-foreground">/ {target}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{unit}</p>
      </div>
      
      <div className="mt-auto">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${percentage}%`,
              background: `hsl(var(--${color}))`
            }}
          />
        </div>
        <p 
          className="text-xs font-medium mt-2"
          style={{ color: `hsl(var(--${color}))` }}
        >
          {Math.round(percentage)}%
        </p>
      </div>
    </div>
  );

  const containerClasses = "block rounded-xl bg-card border border-border p-4 hover:border-border/80 transition-colors h-full";

  if (href) {
    return (
      <Link to={href} className={containerClasses}>
        <Content />
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      <Content />
    </div>
  );
}

import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface GoalProgressProps {
  icon: LucideIcon;
  title: string;
  current: number;
  target: number;
  unit: string;
  href?: string;
}

export function GoalProgress({ 
  icon: Icon, 
  title, 
  current, 
  target, 
  unit, 
  href 
}: GoalProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  const content = (
    <>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-lg font-semibold tabular-nums">{current}</span>
        <span className="text-sm text-muted-foreground">/ {target}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{unit}</p>
      
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </>
  );

  const className = "block rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors";

  if (href) {
    return <Link to={href} className={className}>{content}</Link>;
  }

  return <div className={className}>{content}</div>;
}

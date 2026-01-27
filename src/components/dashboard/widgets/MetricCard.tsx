import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  color: string;
  delay?: number;
}

export function MetricCard({ icon: Icon, label, value, change, color }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-5 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `hsl(var(--${color}) / 0.1)` }}
        >
          <Icon className="w-5 h-5" style={{ color: `hsl(var(--${color}))` }} />
        </div>
        
        {change && (
          <div 
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
              change.positive 
                ? "bg-finance/10 text-finance" 
                : "bg-destructive/10 text-destructive"
            )}
          >
            {change.positive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {change.positive ? "+" : ""}{change.value}%
          </div>
        )}
      </div>
      
      <p className="text-2xl font-semibold mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

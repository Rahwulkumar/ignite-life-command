import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
}

export function MetricCard({ icon: Icon, label, value, change }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {change && (
          <span className={`flex items-center gap-1 text-xs ${change.positive ? "text-foreground" : "text-muted-foreground"}`}>
            {change.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change.positive ? "+" : ""}{change.value}%
          </span>
        )}
      </div>
      <p className="text-xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

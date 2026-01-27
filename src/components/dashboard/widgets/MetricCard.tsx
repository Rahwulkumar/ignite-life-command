import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  index?: number;
}

export function MetricCard({ icon: Icon, label, value, change, index = 0 }: MetricCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-muted">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-medium ${change.positive ? "text-emerald-400" : "text-rose-400"}`}>
            {change.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change.positive ? "+" : ""}{change.value}%
          </span>
        )}
      </div>
      <p className="text-xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

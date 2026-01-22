import { motion } from "framer-motion";
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

export function MetricCard({ icon: Icon, label, value, change, color, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-all duration-300"
    >
      {/* Gradient background on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ 
          background: `radial-gradient(circle at top right, hsl(var(--${color}) / 0.08), transparent 70%)` 
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `hsl(var(--${color}) / 0.12)` }}
          >
            <Icon className="w-6 h-6" style={{ color: `hsl(var(--${color}))` }} />
          </div>
          
          {change && (
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
              change.positive 
                ? "bg-finance/10 text-finance" 
                : "bg-destructive/10 text-destructive"
            )}>
              {change.positive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change.positive ? "+" : ""}{change.value}%
            </div>
          )}
        </div>
        
        <p className="text-3xl font-bold tracking-tight mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

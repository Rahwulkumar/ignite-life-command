import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Investment {
  id: number;
  name: string;
  type: string;
  invested: number;
  current: number;
  change: number;
}

interface InvestmentTrackerProps {
  investments: Investment[];
}

export function InvestmentTracker({ investments }: InvestmentTrackerProps) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrent = investments.reduce((sum, inv) => sum + inv.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalPercentage = totalInvested > 0 ? ((totalGain / totalInvested) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Investments</h2>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-finance" />
          <span className="text-sm font-medium text-finance">+{totalPercentage}%</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
          <p className="text-lg font-medium tabular-nums">₦{totalInvested.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-finance/10 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
          <p className="text-lg font-medium tabular-nums text-finance">₦{totalCurrent.toLocaleString()}</p>
        </div>
      </div>

      {/* Investment List */}
      <div className="space-y-0">
        {investments.length > 0 ? (
          investments.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between py-4 border-b border-border/50"
            >
              <div>
                <p className="font-medium">{inv.name}</p>
                <p className="text-sm text-muted-foreground">{inv.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium tabular-nums">₦{inv.current.toLocaleString()}</p>
                <p className={cn(
                  "text-sm tabular-nums flex items-center gap-1 justify-end",
                  inv.change > 0 ? "text-finance" : "text-destructive"
                )}>
                  {inv.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {inv.change > 0 ? "+" : ""}{inv.change}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No investments tracked
          </div>
        )}
      </div>
    </div>
  );
}

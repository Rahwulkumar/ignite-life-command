import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface Investment {
  id: number;
  name: string;
  type: string;
  invested: number;
  current: number;
  change: number;
}

const mockInvestments: Investment[] = [
  { id: 1, name: "Emergency Fund", type: "Savings", invested: 500000, current: 520000, change: 4.0 },
  { id: 2, name: "Stock Portfolio", type: "Equity", invested: 300000, current: 342000, change: 14.0 },
  { id: 3, name: "Mutual Fund", type: "Fund", invested: 200000, current: 218000, change: 9.0 },
  { id: 4, name: "Treasury Bills", type: "Fixed Income", invested: 150000, current: 157500, change: 5.0 },
];

export function InvestmentTracker() {
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.invested, 0);
  const totalCurrent = mockInvestments.reduce((sum, inv) => sum + inv.current, 0);
  const totalGain = totalCurrent - totalInvested;
  const totalPercentage = ((totalGain / totalInvested) * 100).toFixed(1);

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
        {mockInvestments.map((inv) => (
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
        ))}
      </div>
    </div>
  );
}

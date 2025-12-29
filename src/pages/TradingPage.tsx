import { MainLayout } from "@/components/layout/MainLayout";
import { TrendingUp, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const positions = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", shares: 10, avgPrice: 185.50, currentPrice: 192.30, change: 3.67 },
  { id: 2, symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, avgPrice: 140.20, currentPrice: 145.80, change: 3.99 },
  { id: 3, symbol: "MSFT", name: "Microsoft Corp.", shares: 8, avgPrice: 375.00, currentPrice: 368.50, change: -1.73 },
  { id: 4, symbol: "NVDA", name: "NVIDIA Corp.", shares: 3, avgPrice: 480.00, currentPrice: 495.20, change: 3.17 },
];

const stats = [
  { label: "Portfolio Value", value: "$12,450", change: "+8.5%" },
  { label: "Open Positions", value: "4", change: "" },
  { label: "Today's P&L", value: "+$320", change: "+2.6%" },
];

const TradingPage = () => {
  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-trading/10">
              <TrendingUp className="w-6 h-6 text-trading" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Trading</h1>
              <p className="text-sm text-muted-foreground">Monitor positions and patterns</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Trade
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-medium">{stat.value}</span>
                {stat.change && (
                  <span className={cn(
                    "text-xs font-medium",
                    stat.change.startsWith("+") ? "text-finance" : "text-destructive"
                  )}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Positions */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">Open Positions</h2>
          </div>
          <div className="divide-y divide-border/50">
            {positions.map((pos) => (
              <div key={pos.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <span className="font-mono text-xs font-medium">{pos.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{pos.symbol}</p>
                    <p className="text-xs text-muted-foreground">{pos.shares} shares @ ${pos.avgPrice}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">${pos.currentPrice}</p>
                  <p className={cn(
                    "text-xs font-medium flex items-center gap-1 justify-end",
                    pos.change > 0 ? "text-finance" : "text-destructive"
                  )}>
                    {pos.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(pos.change)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TradingPage;

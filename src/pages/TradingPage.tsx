import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
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
  { label: "Portfolio", value: "$12,450" },
  { label: "Positions", value: "4" },
  { label: "Today", value: "+$320" },
];

const TradingPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Trading</h1>
              </div>
              <p className="text-muted-foreground">Monitor positions and patterns</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Log Trade
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Positions</h2>
            <div className="space-y-0">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className="flex items-center justify-between py-4 border-b border-border/50"
                >
                  <div>
                    <p className="font-medium">{pos.symbol}</p>
                    <p className="text-sm text-muted-foreground">{pos.shares} shares</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-medium tabular-nums">${pos.currentPrice}</p>
                      <p className={cn(
                        "text-sm tabular-nums flex items-center gap-1 justify-end",
                        pos.change > 0 ? "text-finance" : "text-destructive"
                      )}>
                        {pos.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(pos.change)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TradingPage;

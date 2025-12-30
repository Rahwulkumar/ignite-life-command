import { useState } from "react";
import { TrendingUp, TrendingDown, Building2, Landmark, BarChart3, Coins, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentDetailSheet } from "./InvestmentDetailSheet";
import { PortfolioChart } from "./PortfolioChart";

interface Holding {
  id: string;
  name: string;
  symbol: string;
  type: "stock" | "mutual_fund" | "etf" | "bond" | "crypto";
  units: number;
  avgCost: number;
  currentPrice: number;
  returns: number;
  returnsPercent: number;
}

const mockHoldings: Holding[] = [
  { id: "1", name: "Apple Inc.", symbol: "AAPL", type: "stock", units: 15, avgCost: 145.50, currentPrice: 193.42, returns: 718.80, returnsPercent: 32.9 },
  { id: "2", name: "Microsoft Corp.", symbol: "MSFT", type: "stock", units: 8, avgCost: 310.25, currentPrice: 378.91, returns: 549.28, returnsPercent: 22.1 },
  { id: "3", name: "NVIDIA Corp.", symbol: "NVDA", type: "stock", units: 5, avgCost: 420.00, currentPrice: 495.22, returns: 376.10, returnsPercent: 17.9 },
  { id: "4", name: "Vanguard 500 Index", symbol: "VFIAX", type: "mutual_fund", units: 25, avgCost: 410.50, currentPrice: 458.30, returns: 1195.00, returnsPercent: 11.6 },
  { id: "5", name: "Fidelity Growth Fund", symbol: "FDGRX", type: "mutual_fund", units: 40, avgCost: 145.20, currentPrice: 168.45, returns: 930.00, returnsPercent: 16.0 },
  { id: "6", name: "T. Rowe Price Blue Chip", symbol: "TRBCX", type: "mutual_fund", units: 30, avgCost: 138.00, currentPrice: 151.20, returns: 396.00, returnsPercent: 9.6 },
  { id: "7", name: "SPDR S&P 500 ETF", symbol: "SPY", type: "etf", units: 10, avgCost: 420.00, currentPrice: 475.50, returns: 555.00, returnsPercent: 13.2 },
  { id: "8", name: "Invesco QQQ Trust", symbol: "QQQ", type: "etf", units: 8, avgCost: 350.00, currentPrice: 405.80, returns: 446.40, returnsPercent: 15.9 },
  { id: "9", name: "Vanguard Total Bond", symbol: "BND", type: "etf", units: 50, avgCost: 72.50, currentPrice: 71.20, returns: -65.00, returnsPercent: -1.8 },
  { id: "10", name: "US Treasury 10Y", symbol: "T-10Y", type: "bond", units: 20, avgCost: 950.00, currentPrice: 942.50, returns: -150.00, returnsPercent: -0.8 },
  { id: "11", name: "Bitcoin", symbol: "BTC", type: "crypto", units: 0.15, avgCost: 42000.00, currentPrice: 43250.00, returns: 187.50, returnsPercent: 3.0 },
  { id: "12", name: "Ethereum", symbol: "ETH", type: "crypto", units: 2.5, avgCost: 2200.00, currentPrice: 2350.00, returns: 375.00, returnsPercent: 6.8 },
];

function HoldingRow({ holding, onClick }: { holding: Holding; onClick: () => void }) {
  const isPositive = holding.returns >= 0;
  const totalValue = holding.units * holding.currentPrice;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 border-b border-border/50 group hover:bg-muted/30 -mx-4 px-4 transition-colors text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium">{holding.symbol}</p>
          <span className="text-xs text-muted-foreground hidden sm:inline">{holding.name}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {holding.units.toLocaleString(undefined, { maximumFractionDigits: 4 })} units @ ${holding.avgCost.toLocaleString()}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className={cn("text-xs tabular-nums flex items-center gap-1 justify-end", isPositive ? "text-finance" : "text-destructive")}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? "+" : ""}{holding.returnsPercent}%
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function HoldingsSummary({ holdings }: { holdings: Holding[] }) {
  const totalValue = holdings.reduce((sum, h) => sum + h.units * h.currentPrice, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.units * h.avgCost, 0);
  const totalReturns = totalValue - totalCost;
  const totalPercent = ((totalReturns / totalCost) * 100);
  const isPositive = totalReturns >= 0;

  return (
    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Current Value</p>
        <p className="text-lg font-medium tabular-nums">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Invested</p>
        <p className="text-lg font-medium tabular-nums">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">Total Returns</p>
        <p className={cn("text-lg font-medium tabular-nums", isPositive ? "text-finance" : "text-destructive")}>
          {isPositive ? "+" : ""}${totalReturns.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-xs ml-1">({isPositive ? "+" : ""}{totalPercent.toFixed(1)}%)</span>
        </p>
      </div>
    </div>
  );
}

export function InvestmentHoldings() {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);
  
  const stocks = mockHoldings.filter(h => h.type === "stock");
  const mutualFunds = mockHoldings.filter(h => h.type === "mutual_fund");
  const etfs = mockHoldings.filter(h => h.type === "etf");
  const crypto = mockHoldings.filter(h => h.type === "crypto");

  const renderHoldings = (holdings: Holding[]) => (
    <div className="space-y-0">
      {holdings.map(holding => (
        <HoldingRow key={holding.id} holding={holding} onClick={() => setSelectedHolding(holding)} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Portfolio Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <PortfolioChart />
      </div>

      {/* Summary */}
      <HoldingsSummary holdings={mockHoldings} />

      {/* Holdings List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs">All ({mockHoldings.length})</TabsTrigger>
          <TabsTrigger value="stocks" className="text-xs">Stocks ({stocks.length})</TabsTrigger>
          <TabsTrigger value="mutual_funds" className="text-xs">Mutual Funds ({mutualFunds.length})</TabsTrigger>
          <TabsTrigger value="etfs" className="text-xs">ETFs ({etfs.length})</TabsTrigger>
          <TabsTrigger value="crypto" className="text-xs">Crypto ({crypto.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">{renderHoldings(mockHoldings)}</TabsContent>
        <TabsContent value="stocks" className="mt-0">{renderHoldings(stocks)}</TabsContent>
        <TabsContent value="mutual_funds" className="mt-0">{renderHoldings(mutualFunds)}</TabsContent>
        <TabsContent value="etfs" className="mt-0">{renderHoldings(etfs)}</TabsContent>
        <TabsContent value="crypto" className="mt-0">{renderHoldings(crypto)}</TabsContent>
      </Tabs>

      {/* Detail Sheet */}
      <InvestmentDetailSheet 
        holding={selectedHolding} 
        isOpen={!!selectedHolding} 
        onClose={() => setSelectedHolding(null)} 
      />
    </div>
  );
}

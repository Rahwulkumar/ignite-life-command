import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentDetailSheet } from "./InvestmentDetailSheet";
import { PortfolioChart } from "./PortfolioChart";
import { Holding, PortfolioDataPoint } from "@/types/domain";

interface InvestmentHoldingsProps {
  holdings: Holding[];
  portfolioData: PortfolioDataPoint[];
}

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

export function InvestmentHoldings({ holdings, portfolioData }: InvestmentHoldingsProps) {
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null);

  const stocks = holdings.filter(h => h.type === "stock");
  const mutualFunds = holdings.filter(h => h.type === "mutual_fund");
  const etfs = holdings.filter(h => h.type === "etf");
  const crypto = holdings.filter(h => h.type === "crypto");

  const renderHoldings = (holdingsList: Holding[]) => (
    <div className="space-y-0">
      {holdingsList.map(holding => (
        <HoldingRow key={holding.id} holding={holding} onClick={() => setSelectedHolding(holding)} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Portfolio Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <PortfolioChart data={portfolioData} />
      </div>

      {/* Summary */}
      <HoldingsSummary holdings={holdings} />

      {/* Holdings List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs">All ({holdings.length})</TabsTrigger>
          <TabsTrigger value="stocks" className="text-xs">Stocks ({stocks.length})</TabsTrigger>
          <TabsTrigger value="mutual_funds" className="text-xs">Mutual Funds ({mutualFunds.length})</TabsTrigger>
          <TabsTrigger value="etfs" className="text-xs">ETFs ({etfs.length})</TabsTrigger>
          <TabsTrigger value="crypto" className="text-xs">Crypto ({crypto.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">{renderHoldings(holdings)}</TabsContent>
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

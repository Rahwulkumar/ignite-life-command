import { useState } from "react";
import { ArrowUp, ArrowDown, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Trade {
  id: number;
  symbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
  notes: string;
  pnl?: number;
}

const mockTrades: Trade[] = [
  { id: 1, symbol: "AAPL", type: "buy", quantity: 10, price: 185.50, date: "Dec 28", notes: "Support level bounce", pnl: 68 },
  { id: 2, symbol: "NVDA", type: "buy", quantity: 3, price: 480.00, date: "Dec 26", notes: "AI momentum play", pnl: 45 },
  { id: 3, symbol: "TSLA", type: "sell", quantity: 5, price: 252.30, date: "Dec 24", notes: "Taking profits at resistance", pnl: 120 },
  { id: 4, symbol: "MSFT", type: "buy", quantity: 8, price: 375.00, date: "Dec 22", notes: "Cloud growth thesis", pnl: -52 },
  { id: 5, symbol: "META", type: "sell", quantity: 4, price: 345.80, date: "Dec 20", notes: "Rebalancing portfolio", pnl: 85 },
];

export function TradeJournal() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Trade Journal</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-3 h-3" />
          Log Trade
        </Button>
      </div>

      {/* Trade List */}
      <div className="space-y-0">
        {mockTrades.map((trade) => (
          <div
            key={trade.id}
            className="py-4 border-b border-border/50 hover:bg-muted/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  trade.type === "buy" ? "bg-finance/10" : "bg-destructive/10"
                )}>
                  {trade.type === "buy" ? (
                    <ArrowUp className="w-4 h-4 text-finance" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{trade.symbol}</p>
                  <p className="text-xs text-muted-foreground">
                    {trade.type === "buy" ? "Bought" : "Sold"} {trade.quantity} @ ${trade.price}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {trade.pnl !== undefined && (
                  <p className={cn(
                    "font-medium tabular-nums",
                    trade.pnl > 0 ? "text-finance" : "text-destructive"
                  )}>
                    {trade.pnl > 0 ? "+" : ""}${trade.pnl}
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" />
                  {trade.date}
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground ml-11 italic">"{trade.notes}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

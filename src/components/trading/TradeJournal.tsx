import { useState } from "react";
import { ArrowUp, ArrowDown, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trade } from "@/types/domain";

interface TradeJournalProps {
  trades: Trade[];
  onLogTrade?: () => void;
}

export function TradeJournal({ trades, onLogTrade }: TradeJournalProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Trade Journal</h2>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => { setShowForm(!showForm); onLogTrade?.(); }}>
          <Plus className="w-3 h-3" />
          Log Trade
        </Button>
      </div>

      {/* Trade List */}
      <div className="space-y-0">
        {trades.length > 0 ? (
          trades.map((trade) => (
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
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No trades recorded
          </div>
        )}
      </div>
    </div>
  );
}

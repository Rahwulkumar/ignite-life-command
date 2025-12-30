import { ArrowUp, ArrowDown, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WatchItem {
  id: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  notes: string;
}

const mockWatchlist: WatchItem[] = [
  { id: 1, symbol: "AMZN", name: "Amazon", price: 153.42, change: 2.1, notes: "Watching for breakout" },
  { id: 2, symbol: "AMD", name: "AMD Inc.", price: 147.80, change: -1.5, notes: "Support at $145" },
  { id: 3, symbol: "COIN", name: "Coinbase", price: 178.30, change: 5.8, notes: "Crypto momentum" },
  { id: 4, symbol: "PLTR", name: "Palantir", price: 18.45, change: -0.8, notes: "AI government plays" },
];

export function WatchlistCard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Watchlist</h2>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      <div className="space-y-0">
        {mockWatchlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-3 border-b border-border/50 group"
          >
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-trading opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
              <div>
                <p className="font-medium">{item.symbol}</p>
                <p className="text-xs text-muted-foreground">{item.notes}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium tabular-nums">${item.price}</p>
              <p className={cn(
                "text-xs tabular-nums flex items-center gap-1 justify-end",
                item.change > 0 ? "text-finance" : "text-destructive"
              )}>
                {item.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(item.change)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

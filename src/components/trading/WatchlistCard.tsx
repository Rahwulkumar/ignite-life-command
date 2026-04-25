import { ArrowUp, ArrowDown, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WatchlistItem } from "@/types/domain";
import { formatSensitiveInvestmentCurrency } from "@/lib/investment-format";

interface WatchlistCardProps {
  items: WatchlistItem[];
  onAddClick?: () => void;
  hideValues?: boolean;
}

export function WatchlistCard({
  items,
  onAddClick,
  hideValues = false,
}: WatchlistCardProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Watchlist</h2>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={onAddClick}>
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      <div className="space-y-0">
        {items.length > 0 ? (
          items.map((item) => (
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
                <p className="font-medium tabular-nums">
                  {formatSensitiveInvestmentCurrency(item.price, hideValues)}
                </p>
                <p className={cn(
                  "text-xs tabular-nums flex items-center gap-1 justify-end",
                  item.change > 0 ? "text-finance" : "text-destructive"
                )}>
                  {item.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(item.change)}%
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No items in watchlist
          </div>
        )}
      </div>
    </div>
  );
}

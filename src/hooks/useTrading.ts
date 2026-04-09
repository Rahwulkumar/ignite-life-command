import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
  Holding,
  PortfolioDataPoint,
  Trade,
  WatchlistItem,
} from "@/types/domain";

interface TradingWatchlistApi {
  id: string;
  symbol: string;
  name: string;
  price: string | number;
  change: string | number;
  notes: string | null;
}

interface TradingTradeApi {
  id: string;
  symbol: string;
  type: Trade["type"];
  quantity: string | number;
  price: string | number;
  dateLabel: string;
  notes: string;
  pnl: string | number | null;
}

interface TradingHoldingApi {
  id: string;
  name: string;
  symbol: string;
  type: Holding["type"];
  units: string | number;
  avgCost: string | number;
  currentPrice: string | number;
  returns: string | number;
  returnsPercent: string | number;
}

interface TradingPortfolioPointApi {
  id: string;
  dateLabel: string;
  value: number;
}

interface TradingResponse {
  watchlist: TradingWatchlistApi[];
  trades: TradingTradeApi[];
  holdings: TradingHoldingApi[];
  portfolioData: TradingPortfolioPointApi[];
}

export interface TradingOverview {
  watchlist: WatchlistItem[];
  trades: Trade[];
  holdings: Holding[];
  portfolioData: PortfolioDataPoint[];
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") {
    return value;
  }

  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeTradingOverview(data: TradingResponse): TradingOverview {
  return {
    watchlist: data.watchlist.map((item) => ({
      id: item.id,
      symbol: item.symbol,
      name: item.name,
      price: toNumber(item.price),
      change: toNumber(item.change),
      notes: item.notes ?? undefined,
    })),
    trades: data.trades.map((trade) => ({
      id: trade.id,
      symbol: trade.symbol,
      type: trade.type,
      quantity: toNumber(trade.quantity),
      price: toNumber(trade.price),
      date: trade.dateLabel,
      notes: trade.notes,
      pnl: trade.pnl == null ? undefined : toNumber(trade.pnl),
    })),
    holdings: data.holdings.map((holding) => ({
      id: holding.id,
      name: holding.name,
      symbol: holding.symbol,
      type: holding.type,
      units: toNumber(holding.units),
      avgCost: toNumber(holding.avgCost),
      currentPrice: toNumber(holding.currentPrice),
      returns: toNumber(holding.returns),
      returnsPercent: toNumber(holding.returnsPercent),
    })),
    portfolioData: data.portfolioData.map((point) => ({
      date: point.dateLabel,
      value: point.value,
    })),
  };
}

export function useTradingOverview() {
  return useQuery({
    queryKey: ["trading"],
    queryFn: async () => {
      const response = await api.get<TradingResponse>("/api/trading");
      return normalizeTradingOverview(response);
    },
  });
}

export function useCreateWatchlistItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      symbol,
      name,
      price,
      change,
      notes,
    }: {
      symbol: string;
      name: string;
      price: number;
      change?: number;
      notes?: string;
    }) =>
      api.post<TradingWatchlistApi>("/api/trading/watchlist", {
        symbol,
        name,
        price,
        change,
        notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

export function useCreateTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      symbol,
      type,
      quantity,
      price,
      dateLabel,
      notes,
      pnl,
    }: {
      symbol: string;
      type: Trade["type"];
      quantity: number;
      price: number;
      dateLabel?: string;
      notes?: string;
      pnl?: number;
    }) =>
      api.post<TradingTradeApi>("/api/trading/trades", {
        symbol,
        type,
        quantity,
        price,
        dateLabel,
        notes,
        pnl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trading"] });
    },
  });
}

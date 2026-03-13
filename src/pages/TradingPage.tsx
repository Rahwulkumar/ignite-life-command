import { TrendingUp, DollarSign, BarChart3, Percent } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { PortfolioChart } from "@/components/trading/PortfolioChart";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { WatchlistCard } from "@/components/trading/WatchlistCard";
import { InvestmentHoldings } from "@/components/trading/InvestmentHoldings";
import { NovaChat } from "@/components/trading/NovaChat";
import { WatchlistItem, Trade, Holding, PortfolioDataPoint } from "@/types/domain";

const stats = [
  { icon: DollarSign, label: "Portfolio", value: "$24,850", color: "text-trading" },
  { icon: BarChart3, label: "Invested", value: "$20,325", color: "text-muted-foreground" },
  { icon: TrendingUp, label: "Returns", value: "+$4,525", color: "text-finance" },
  { icon: Percent, label: "ROI", value: "+22.3%", color: "text-finance" },
];

// Mock data until portfolio persistence is wired to the API.
const mockWatchlist: WatchlistItem[] = [
  { id: 1, symbol: "AMZN", name: "Amazon", price: 153.42, change: 2.1, notes: "Watching for breakout" },
  { id: 2, symbol: "AMD", name: "AMD Inc.", price: 147.80, change: -1.5, notes: "Support at $145" },
  { id: 3, symbol: "COIN", name: "Coinbase", price: 178.30, change: 5.8, notes: "Crypto momentum" },
  { id: 4, symbol: "PLTR", name: "Palantir", price: 18.45, change: -0.8, notes: "AI government plays" },
];

const mockTrades: Trade[] = [
  { id: 1, symbol: "AAPL", type: "buy", quantity: 10, price: 185.50, date: "Dec 28", notes: "Support level bounce", pnl: 68 },
  { id: 2, symbol: "NVDA", type: "buy", quantity: 3, price: 480.00, date: "Dec 26", notes: "AI momentum play", pnl: 45 },
  { id: 3, symbol: "TSLA", type: "sell", quantity: 5, price: 252.30, date: "Dec 24", notes: "Taking profits at resistance", pnl: 120 },
  { id: 4, symbol: "MSFT", type: "buy", quantity: 8, price: 375.00, date: "Dec 22", notes: "Cloud growth thesis", pnl: -52 },
  { id: 5, symbol: "META", type: "sell", quantity: 4, price: 345.80, date: "Dec 20", notes: "Rebalancing portfolio", pnl: 85 },
];

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

const mockPortfolioData: PortfolioDataPoint[] = [
  { date: "Dec 1", value: 10000 },
  { date: "Dec 5", value: 10250 },
  { date: "Dec 10", value: 10100 },
  { date: "Dec 15", value: 10800 },
  { date: "Dec 20", value: 11200 },
  { date: "Dec 25", value: 11050 },
  { date: "Dec 30", value: 12450 },
];

const TradingPage = () => {
  return (
    <DomainPageTemplate
      domain={{
        icon: TrendingUp,
        title: "Investments",
        subtitle: "Portfolio, mutual funds, and investment journal",
        color: "trading",
      }}
      stats={stats}
      tabs={[
        { value: "investments", label: "Investments", component: <InvestmentHoldings holdings={mockHoldings} portfolioData={mockPortfolioData} /> },
        { value: "portfolio", label: "Performance", component: <PortfolioChart data={mockPortfolioData} /> },
        { value: "journal", label: "Journal", component: <TradeJournal trades={mockTrades} /> },
        { value: "watchlist", label: "Watchlist", component: <WatchlistCard items={mockWatchlist} /> },
      ]}
      aiCoach={{
        name: "Nova",
        role: "Investment Mentor",
        component: <NovaChat />,
      }}
    />
  );
};

export default TradingPage;

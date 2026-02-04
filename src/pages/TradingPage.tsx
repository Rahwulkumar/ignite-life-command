import { TrendingUp, DollarSign, BarChart3, Percent } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { PortfolioChart } from "@/components/trading/PortfolioChart";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { WatchlistCard } from "@/components/trading/WatchlistCard";
import { InvestmentHoldings } from "@/components/trading/InvestmentHoldings";
import { NovaChat } from "@/components/trading/NovaChat";

const stats = [
  { icon: DollarSign, label: "Portfolio", value: "$24,850", color: "text-trading" },
  { icon: BarChart3, label: "Invested", value: "$20,325", color: "text-muted-foreground" },
  { icon: TrendingUp, label: "Returns", value: "+$4,525", color: "text-finance" },
  { icon: Percent, label: "ROI", value: "+22.3%", color: "text-finance" },
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
        { value: "investments", label: "Investments", component: <InvestmentHoldings /> },
        { value: "portfolio", label: "Performance", component: <PortfolioChart /> },
        { value: "journal", label: "Journal", component: <TradeJournal /> },
        { value: "watchlist", label: "Watchlist", component: <WatchlistCard /> },
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

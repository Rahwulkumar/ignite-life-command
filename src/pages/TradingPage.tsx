import { TrendingUp, DollarSign, BarChart3, Percent, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { PortfolioChart } from "@/components/trading/PortfolioChart";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { WatchlistCard } from "@/components/trading/WatchlistCard";
import { InvestmentHoldings } from "@/components/trading/InvestmentHoldings";
import { NovaChat } from "@/components/trading/NovaChat";
import { useTradingOverview } from "@/hooks/useTrading";
import { useSensitiveValueVisibility } from "@/hooks/useSensitiveValueVisibility";
import { formatSensitiveCompactInvestmentCurrency } from "@/lib/investment-format";
import { Switch } from "@/components/ui/switch";

const TradingPage = () => {
  const { data, isLoading, error } = useTradingOverview();
  const { isHidden, setIsHidden } = useSensitiveValueVisibility();

  const watchlist = data?.watchlist ?? [];
  const trades = data?.trades ?? [];
  const holdings = data?.holdings ?? [];
  const portfolioData =
    data?.portfolioData && data.portfolioData.length > 0
      ? data.portfolioData
      : holdings.length > 0
        ? [
            {
              date: "Today",
              value: Math.round(
                holdings.reduce((sum, holding) => sum + holding.units * holding.currentPrice, 0),
              ),
            },
          ]
        : [];

  const portfolioValue = holdings.reduce(
    (sum, holding) => sum + holding.units * holding.currentPrice,
    0,
  );
  const investedValue = holdings.reduce(
    (sum, holding) => sum + holding.units * holding.avgCost,
    0,
  );
  const returnsValue = portfolioValue - investedValue;
  const roi = investedValue > 0 ? (returnsValue / investedValue) * 100 : 0;

  const stats = [
    {
      icon: DollarSign,
      label: "Portfolio",
      value: formatSensitiveCompactInvestmentCurrency(portfolioValue, isHidden),
      color: "text-trading",
    },
    {
      icon: BarChart3,
      label: "Invested",
      value: formatSensitiveCompactInvestmentCurrency(investedValue, isHidden),
      color: "text-muted-foreground",
    },
    {
      icon: TrendingUp,
      label: "Returns",
      value: isHidden
        ? formatSensitiveCompactInvestmentCurrency(Math.abs(returnsValue), true)
        : `${returnsValue >= 0 ? "+" : "-"}${formatSensitiveCompactInvestmentCurrency(
            Math.abs(returnsValue),
            false,
          )}`,
      color: returnsValue >= 0 ? "text-finance" : "text-destructive",
    },
    {
      icon: Percent,
      label: "ROI",
      value: `${roi >= 0 ? "+" : ""}${roi.toFixed(1)}%`,
      color: roi >= 0 ? "text-finance" : "text-destructive",
    },
  ];

  return (
    <DomainPageTemplate
      domain={{
        icon: TrendingUp,
        title: "Investments",
        subtitle: "Portfolio, mutual funds, and investment journal",
        color: "trading",
        notesDomain: "trading",
      }}
      stats={stats}
      tabs={[
        {
          value: "investments",
          label: "Investments",
          component: isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading investment data...</div>
          ) : (
            <InvestmentHoldings
              holdings={holdings}
              portfolioData={portfolioData}
              hideValues={isHidden}
            />
          ),
        },
        {
          value: "portfolio",
          label: "Performance",
          component: isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading investment data...</div>
          ) : (
            <PortfolioChart data={portfolioData} hideValues={isHidden} />
          ),
        },
        {
          value: "journal",
          label: "Journal",
          component: isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading trade data...</div>
          ) : (
            <TradeJournal trades={trades} hideValues={isHidden} />
          ),
        },
        {
          value: "watchlist",
          label: "Watchlist",
          component: isLoading ? (
            <div className="py-10 text-sm text-muted-foreground">Loading watchlist...</div>
          ) : (
            <WatchlistCard items={watchlist} hideValues={isHidden} />
          ),
        },
      ]}
      aiCoach={{
        name: "Nova",
        role: "Investment Mentor",
        component: <NovaChat />,
      }}
    >
      <div className="mb-4 flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-border/50 bg-background/60 p-2">
            {isHidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Portfolio privacy</p>
            <p className="text-xs text-muted-foreground">
              Hide currency values across holdings, trades, charts, and watchlists.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {isHidden ? "Hidden" : "Visible"}
          </span>
          <Switch
            checked={isHidden}
            onCheckedChange={setIsHidden}
            aria-label="Hide investment values"
          />
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {error instanceof Error ? error.message : "Could not load investment data."}
            </span>
          </div>
        </div>
      ) : null}
    </DomainPageTemplate>
  );
};

export default TradingPage;

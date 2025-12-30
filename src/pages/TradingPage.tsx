import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { TrendingUp, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioChart } from "@/components/trading/PortfolioChart";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { WatchlistCard } from "@/components/trading/WatchlistCard";
import { NovaChat } from "@/components/trading/NovaChat";

const stats = [
  { label: "Portfolio", value: "$12,450" },
  { label: "Positions", value: "4" },
  { label: "Today", value: "+$320" },
];

const TradingPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Trading</h1>
            </div>
            <p className="text-muted-foreground">Monitor positions, patterns, and journal trades</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="portfolio" className="space-y-6">
            <TabsList>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="nova" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Nova
              </TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio">
              <PortfolioChart />
            </TabsContent>
            <TabsContent value="journal">
              <TradeJournal />
            </TabsContent>
            <TabsContent value="watchlist">
              <WatchlistCard />
            </TabsContent>
            <TabsContent value="nova">
              <NovaChat />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TradingPage;

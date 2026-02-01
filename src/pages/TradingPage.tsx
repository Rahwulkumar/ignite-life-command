import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { TrendingUp, MessageSquare, DollarSign, BarChart3, Percent, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioChart } from "@/components/trading/PortfolioChart";
import { TradeJournal } from "@/components/trading/TradeJournal";
import { WatchlistCard } from "@/components/trading/WatchlistCard";
import { InvestmentHoldings } from "@/components/trading/InvestmentHoldings";
import { NovaChat } from "@/components/trading/NovaChat";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const stats = [
  { icon: DollarSign, label: "Portfolio", value: "$24,850", color: "text-trading" },
  { icon: BarChart3, label: "Invested", value: "$20,325", color: "text-muted-foreground" },
  { icon: TrendingUp, label: "Returns", value: "+$4,525", color: "text-finance" },
  { icon: Percent, label: "ROI", value: "+22.3%", color: "text-finance" },
];

const TradingPage = () => {
  const [showNova, setShowNova] = useState(false);

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
              icon={TrendingUp}
              title="Investments"
              subtitle="Portfolio, mutual funds, and investment journal"
              domainColor="trading"
              action={{
                icon: MessageSquare,
                label: "Ask Nova",
                onClick: () => setShowNova(true),
              }}
            />

            <DomainStatsBar stats={stats} />

            <div className="px-8 pb-8">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="investments" className="space-y-6">
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="investments">Investments</TabsTrigger>
                    <TabsTrigger value="portfolio">Performance</TabsTrigger>
                    <TabsTrigger value="journal">Journal</TabsTrigger>
                    <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                    <TabsTrigger value="notes" asChild>
                      <Link to="/notes" state={{ domain: 'trading' }} className="flex items-center gap-1.5">
                        <StickyNote className="w-3.5 h-3.5" />
                        Notes
                      </Link>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="investments">
                    <InvestmentHoldings />
                  </TabsContent>
                  <TabsContent value="portfolio">
                    <PortfolioChart />
                  </TabsContent>
                  <TabsContent value="journal">
                    <TradeJournal />
                  </TabsContent>
                  <TabsContent value="watchlist">
                    <WatchlistCard />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <Sheet open={showNova} onOpenChange={setShowNova}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Nova" role="Investment Mentor" domainColor="trading">
                <NovaChat />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TradingPage;

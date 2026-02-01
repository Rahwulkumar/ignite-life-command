import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Wallet, MessageSquare, TrendingDown, PiggyBank, CreditCard, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTracker } from "@/components/finance/ExpenseTracker";
import { BudgetOverview } from "@/components/finance/BudgetOverview";
import { InvestmentTracker } from "@/components/finance/InvestmentTracker";
import { MarcusChat } from "@/components/finance/MarcusChat";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const stats = [
  { icon: Wallet, label: "Balance", value: "₦1.25M", color: "text-finance" },
  { icon: TrendingDown, label: "Spending", value: "₦450K", suffix: "this month", color: "text-destructive" },
  { icon: PiggyBank, label: "Savings", value: "₦120K", suffix: "goal", color: "text-finance" },
  { icon: CreditCard, label: "Transactions", value: "48", suffix: "this month", color: "text-muted-foreground" },
];

const FinancePage = () => {
  const [showMarcus, setShowMarcus] = useState(false);

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
              icon={Wallet}
              title="Finance"
              subtitle="Track expenses, budgets, and investments"
              domainColor="finance"
              action={{
                icon: MessageSquare,
                label: "Ask Marcus",
                onClick: () => setShowMarcus(true),
              }}
            />

            <DomainStatsBar stats={stats} />

            <div className="px-8 pb-8">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="transactions" className="space-y-6">
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="budgets">Budgets</TabsTrigger>
                    <TabsTrigger value="investments">Investments</TabsTrigger>
                    <TabsTrigger value="notes" asChild>
                      <Link to="/notes" state={{ domain: 'finance' }} className="flex items-center gap-1.5">
                        <StickyNote className="w-3.5 h-3.5" />
                        Notes
                      </Link>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="transactions">
                    <ExpenseTracker />
                  </TabsContent>
                  <TabsContent value="budgets">
                    <BudgetOverview />
                  </TabsContent>
                  <TabsContent value="investments">
                    <InvestmentTracker />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <Sheet open={showMarcus} onOpenChange={setShowMarcus}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Marcus" role="Finance Coach" domainColor="finance">
                <MarcusChat />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default FinancePage;

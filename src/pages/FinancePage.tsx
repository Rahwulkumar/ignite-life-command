import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Wallet, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseTracker } from "@/components/finance/ExpenseTracker";
import { BudgetOverview } from "@/components/finance/BudgetOverview";
import { InvestmentTracker } from "@/components/finance/InvestmentTracker";
import { MarcusChat } from "@/components/finance/MarcusChat";

const stats = [
  { label: "Balance", value: "₦1,250,000" },
  { label: "Spending", value: "₦450,000" },
  { label: "Savings", value: "₦120,000" },
];

const FinancePage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Finance</h1>
            </div>
            <p className="text-muted-foreground">Track expenses, budgets, and investments</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="marcus" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Marcus
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
            <TabsContent value="marcus">
              <MarcusChat />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default FinancePage;

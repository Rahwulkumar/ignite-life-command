import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Wallet, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, description: "Grocery Shopping", amount: -15000, date: "Today", category: "Food" },
  { id: 2, description: "Freelance Payment", amount: 150000, date: "Yesterday", category: "Income" },
  { id: 3, description: "Netflix Subscription", amount: -4500, date: "Dec 27", category: "Entertainment" },
  { id: 4, description: "Electricity Bill", amount: -8200, date: "Dec 26", category: "Utilities" },
  { id: 5, description: "Side Project Payment", amount: 75000, date: "Dec 25", category: "Income" },
];

const stats = [
  { label: "Balance", value: "₦1,250,000" },
  { label: "Spending", value: "₦450,000" },
  { label: "Savings", value: "₦120,000" },
];

const FinancePage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Finance</h1>
              </div>
              <p className="text-muted-foreground">Track expenses and income</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Transactions</h2>
            <div className="space-y-0">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-4 border-b border-border/50"
                >
                  <div className="flex items-center gap-4">
                    {tx.amount > 0 ? (
                      <TrendingUp className="w-4 h-4 text-finance" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "tabular-nums font-medium",
                    tx.amount > 0 ? "text-finance" : "text-foreground"
                  )}>
                    {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default FinancePage;

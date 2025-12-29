import { MainLayout } from "@/components/layout/MainLayout";
import { Wallet, Plus, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
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
  { label: "Total Balance", value: "₦1,250,000", change: "+12.5%" },
  { label: "Monthly Spending", value: "₦450,000", change: "-8%" },
  { label: "Monthly Savings", value: "₦120,000", change: "+25%" },
];

const FinancePage = () => {
  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-finance/10">
              <Wallet className="w-6 h-6 text-finance" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
              <p className="text-sm text-muted-foreground">Track expenses and income</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-medium">{stat.value}</span>
                <span className={cn(
                  "text-xs font-medium",
                  stat.change.startsWith("+") ? "text-finance" : "text-destructive"
                )}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h2 className="font-medium">Recent Transactions</h2>
            <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    tx.amount > 0 ? "bg-finance/10" : "bg-muted"
                  )}>
                    {tx.amount > 0 ? (
                      <TrendingUp className="w-4 h-4 text-finance" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <span className={cn(
                  "font-mono font-medium",
                  tx.amount > 0 ? "text-finance" : "text-foreground"
                )}>
                  {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FinancePage;

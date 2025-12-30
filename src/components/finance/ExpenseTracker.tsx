import { useState } from "react";
import { TrendingUp, TrendingDown, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, description: "Grocery Shopping", amount: -15000, date: "Today", category: "Food" },
  { id: 2, description: "Freelance Payment", amount: 150000, date: "Yesterday", category: "Income" },
  { id: 3, description: "Netflix Subscription", amount: -4500, date: "Dec 27", category: "Entertainment" },
  { id: 4, description: "Electricity Bill", amount: -8200, date: "Dec 26", category: "Utilities" },
  { id: 5, description: "Side Project Payment", amount: 75000, date: "Dec 25", category: "Income" },
  { id: 6, description: "Restaurant Dinner", amount: -12000, date: "Dec 24", category: "Food" },
  { id: 7, description: "Uber Rides", amount: -5500, date: "Dec 23", category: "Transport" },
];

const categories = ["All", "Income", "Food", "Entertainment", "Utilities", "Transport"];

export function ExpenseTracker() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredTransactions = selectedCategory === "All" 
    ? mockTransactions 
    : mockTransactions.filter(tx => tx.category === selectedCategory);

  const totalIncome = mockTransactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = mockTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Filter className="w-3 h-3" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-3 h-3" />
            Add
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              selectedCategory === cat
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Summary Bar */}
      <div className="flex items-center gap-6 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-finance" />
          <span className="text-sm text-muted-foreground">Income:</span>
          <span className="text-sm font-medium text-finance">₦{totalIncome.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-destructive" />
          <span className="text-sm text-muted-foreground">Expenses:</span>
          <span className="text-sm font-medium">₦{totalExpenses.toLocaleString()}</span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-0">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between py-4 border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {tx.amount > 0 ? (
                <div className="w-8 h-8 rounded-full bg-finance/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-finance" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-muted-foreground">{tx.category} · {tx.date}</p>
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
  );
}

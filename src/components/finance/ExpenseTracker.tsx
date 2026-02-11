import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface ExpenseTrackerProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
}

const categories = ["All", "Income", "Food", "Entertainment", "Utilities", "Transport"];

export function ExpenseTracker({ transactions, onAddTransaction }: ExpenseTrackerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTransactions = selectedCategory === "All"
    ? transactions
    : transactions.filter(tx => tx.category === selectedCategory);

  const totalIncome = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Transactions</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Filter className="w-3 h-3" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={onAddTransaction}>
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
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
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
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No transactions found
          </div>
        )}
      </div>
    </motion.div>
  );
}

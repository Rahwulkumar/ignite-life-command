import { cn } from "@/lib/utils";

export interface Budget {
  id: number;
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

interface BudgetOverviewProps {
  budgets: Budget[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Monthly Budgets</h2>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            ₦{totalSpent.toLocaleString()} / ₦{totalAllocated.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.allocated) * 100);
            const isOverBudget = percentage > 90;

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{budget.category}</span>
                  <span className={cn(
                    "tabular-nums",
                    isOverBudget ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {percentage}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOverBudget ? "bg-destructive" : budget.color
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₦{budget.spent.toLocaleString()}</span>
                  <span>₦{budget.allocated.toLocaleString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No budgets configured
          </div>
        )}
      </div>
    </div>
  );
}

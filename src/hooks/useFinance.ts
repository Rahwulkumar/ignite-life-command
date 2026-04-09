import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Budget } from "@/components/finance/BudgetOverview";
import type { Transaction } from "@/components/finance/ExpenseTracker";
import type { Investment } from "@/components/finance/InvestmentTracker";

interface FinanceTransactionApi {
  id: string;
  description: string;
  amount: number;
  category: string;
  dateLabel: string;
}

interface FinanceBudgetApi {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

interface FinanceInvestmentApi {
  id: string;
  name: string;
  type: string;
  invested: number;
  current: number;
  change: string | number;
}

interface FinanceResponse {
  transactions: FinanceTransactionApi[];
  budgets: FinanceBudgetApi[];
  investments: FinanceInvestmentApi[];
}

export interface FinanceOverview {
  transactions: Transaction[];
  budgets: Budget[];
  investments: Investment[];
}

function normalizeFinanceOverview(data: FinanceResponse): FinanceOverview {
  return {
    transactions: data.transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      date: transaction.dateLabel,
    })),
    budgets: data.budgets.map((budget) => ({
      id: budget.id,
      category: budget.category,
      allocated: budget.allocated,
      spent: budget.spent,
      color: budget.color,
    })),
    investments: data.investments.map((investment) => ({
      id: investment.id,
      name: investment.name,
      type: investment.type,
      invested: investment.invested,
      current: investment.current,
      change:
        typeof investment.change === "number"
          ? investment.change
          : Number.parseFloat(investment.change),
    })),
  };
}

export function useFinanceOverview() {
  return useQuery({
    queryKey: ["finance"],
    queryFn: async () => {
      const response = await api.get<FinanceResponse>("/api/finance");
      return normalizeFinanceOverview(response);
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      description,
      amount,
      category,
      dateLabel,
    }: {
      description: string;
      amount: number;
      category: string;
      dateLabel?: string;
    }) =>
      api.post<FinanceTransactionApi>("/api/finance/transactions", {
        description,
        amount,
        category,
        dateLabel,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      category,
      allocated,
      spent,
      color,
    }: {
      category: string;
      allocated: number;
      spent?: number;
      color?: string;
    }) =>
      api.post<FinanceBudgetApi>("/api/finance/budgets", {
        category,
        allocated,
        spent,
        color,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      type,
      invested,
      current,
      change,
    }: {
      name: string;
      type: string;
      invested: number;
      current: number;
      change?: number;
    }) =>
      api.post<FinanceInvestmentApi>("/api/finance/investments", {
        name,
        type,
        invested,
        current,
        change,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["finance"] });
    },
  });
}

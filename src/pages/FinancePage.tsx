import { Wallet, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ExpenseTracker, Transaction } from "@/components/finance/ExpenseTracker";
import { BudgetOverview, Budget } from "@/components/finance/BudgetOverview";
import { InvestmentTracker, Investment } from "@/components/finance/InvestmentTracker";
import { MarcusChat } from "@/components/finance/MarcusChat";

// Mock data for Finance domain
const mockTransactions: Transaction[] = [
  { id: 1, description: "Grocery Shopping", amount: -15000, date: "Today", category: "Food" },
  { id: 2, description: "Freelance Payment", amount: 150000, date: "Yesterday", category: "Income" },
  { id: 3, description: "Netflix Subscription", amount: -4500, date: "Dec 27", category: "Entertainment" },
  { id: 4, description: "Electricity Bill", amount: -8200, date: "Dec 26", category: "Utilities" },
  { id: 5, description: "Side Project Payment", amount: 75000, date: "Dec 25", category: "Income" },
  { id: 6, description: "Restaurant Dinner", amount: -12000, date: "Dec 24", category: "Food" },
  { id: 7, description: "Uber Rides", amount: -5500, date: "Dec 23", category: "Transport" },
];

const mockBudgets: Budget[] = [
  { id: 1, category: "Food & Groceries", allocated: 100000, spent: 67000, color: "bg-finance" },
  { id: 2, category: "Transportation", allocated: 50000, spent: 32000, color: "bg-trading" },
  { id: 3, category: "Entertainment", allocated: 30000, spent: 28500, color: "bg-tech" },
  { id: 4, category: "Utilities", allocated: 40000, spent: 38200, color: "bg-spiritual" },
  { id: 5, category: "Shopping", allocated: 60000, spent: 15000, color: "bg-music" },
];

const mockInvestments: Investment[] = [
  { id: 1, name: "Emergency Fund", type: "Savings", invested: 500000, current: 520000, change: 4.0 },
  { id: 2, name: "Stock Portfolio", type: "Equity", invested: 300000, current: 342000, change: 14.0 },
  { id: 3, name: "Mutual Fund", type: "Fund", invested: 200000, current: 218000, change: 9.0 },
  { id: 4, name: "Treasury Bills", type: "Fixed Income", invested: 150000, current: 157500, change: 5.0 },
];

const stats = [
  { icon: Wallet, label: "Balance", value: "₦1.25M", color: "text-finance" },
  { icon: TrendingDown, label: "Spending", value: "₦450K", suffix: "this month", color: "text-destructive" },
  { icon: PiggyBank, label: "Savings", value: "₦120K", suffix: "goal", color: "text-finance" },
  { icon: CreditCard, label: "Transactions", value: "48", suffix: "this month", color: "text-muted-foreground" },
];

const FinancePage = () => {
  return (
    <DomainPageTemplate
      domain={{
        icon: Wallet,
        title: "Finance",
        subtitle: "Track expenses, budgets, and investments",
        color: "finance",
        notesDomain: "finance",
      }}
      stats={stats}
      tabs={[
        { value: "transactions", label: "Transactions", component: <ExpenseTracker transactions={mockTransactions} /> },
        { value: "budgets", label: "Budgets", component: <BudgetOverview budgets={mockBudgets} /> },
        { value: "investments", label: "Investments", component: <InvestmentTracker investments={mockInvestments} /> },
      ]}
      aiCoach={{
        name: "Marcus",
        role: "Finance Coach",
        component: <MarcusChat />,
      }}
    />
  );
};

export default FinancePage;

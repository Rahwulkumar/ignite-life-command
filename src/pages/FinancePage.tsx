import { Wallet, TrendingDown, PiggyBank, CreditCard } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ExpenseTracker } from "@/components/finance/ExpenseTracker";
import { BudgetOverview } from "@/components/finance/BudgetOverview";
import { InvestmentTracker } from "@/components/finance/InvestmentTracker";
import { MarcusChat } from "@/components/finance/MarcusChat";

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
      }}
      stats={stats}
      tabs={[
        { value: "transactions", label: "Transactions", component: <ExpenseTracker /> },
        { value: "budgets", label: "Budgets", component: <BudgetOverview /> },
        { value: "investments", label: "Investments", component: <InvestmentTracker /> },
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

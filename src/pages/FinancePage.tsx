import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { Wallet, Plus, TrendingUp, TrendingDown, ArrowRight, DollarSign, PiggyBank, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const transactions = [
  { id: 1, description: "Grocery Shopping", amount: -15000, date: "Today", category: "Food", icon: "🛒" },
  { id: 2, description: "Freelance Payment", amount: 150000, date: "Yesterday", category: "Income", icon: "💰" },
  { id: 3, description: "Netflix Subscription", amount: -4500, date: "Dec 27", category: "Entertainment", icon: "🎬" },
  { id: 4, description: "Electricity Bill", amount: -8200, date: "Dec 26", category: "Utilities", icon: "⚡" },
  { id: 5, description: "Side Project Payment", amount: 75000, date: "Dec 25", category: "Income", icon: "💻" },
];

const stats = [
  { label: "Total Balance", value: "₦1.25M", change: "+12.5%", icon: Wallet, progress: 85 },
  { label: "Monthly Spending", value: "₦450K", change: "-8%", icon: CreditCard, progress: 45 },
  { label: "Monthly Savings", value: "₦120K", change: "+25%", icon: PiggyBank, progress: 60 },
];

const FinancePage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="finance" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="trading" size="sm" className="bottom-40 left-10 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-finance/20 to-finance/5 border border-finance/20">
                  <Wallet className="w-7 h-7 text-finance" />
                </div>
                <div className="absolute -inset-2 bg-finance/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-finance animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Finance</h1>
                <p className="text-sm text-muted-foreground">Track expenses and income</p>
              </div>
            </div>
            <Button className="gap-2 bg-finance hover:bg-finance/90 text-background">
              <Plus className="w-4 h-4" />
              Add Transaction
            </Button>
          </header>

          {/* Stats with visual progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:border-finance/30 transition-all duration-300"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 gradient-finance opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-3xl font-semibold">{stat.value}</span>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        stat.change.startsWith("+") ? "bg-finance/10 text-finance" : "bg-destructive/10 text-destructive"
                      )}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  
                  <ProgressRing 
                    progress={stat.progress} 
                    size={50} 
                    strokeWidth={4} 
                    color="finance"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-finance/50 to-transparent" />
            
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-finance" />
                Recent Transactions
              </h2>
              <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {transactions.map((tx) => (
                <div key={tx.id} className="group flex items-center justify-between p-5 hover:bg-card-elevated/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                      tx.amount > 0 
                        ? "bg-gradient-to-br from-finance/20 to-finance/5" 
                        : "bg-gradient-to-br from-muted to-muted/50"
                    )}>
                      {tx.icon}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px]",
                          tx.amount > 0 ? "bg-finance/10 text-finance" : "bg-muted text-muted-foreground"
                        )}>
                          {tx.category}
                        </span>
                        {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tx.amount > 0 ? (
                      <TrendingUp className="w-4 h-4 text-finance" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "font-mono text-lg font-medium",
                      tx.amount > 0 ? "text-finance" : "text-foreground"
                    )}>
                      {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
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

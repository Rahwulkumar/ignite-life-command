import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { TrendingUp, Plus, ArrowUp, ArrowDown, Activity, BarChart3, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const positions = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", shares: 10, avgPrice: 185.50, currentPrice: 192.30, change: 3.67, logo: "🍎" },
  { id: 2, symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, avgPrice: 140.20, currentPrice: 145.80, change: 3.99, logo: "🔍" },
  { id: 3, symbol: "MSFT", name: "Microsoft Corp.", shares: 8, avgPrice: 375.00, currentPrice: 368.50, change: -1.73, logo: "🪟" },
  { id: 4, symbol: "NVDA", name: "NVIDIA Corp.", shares: 3, avgPrice: 480.00, currentPrice: 495.20, change: 3.17, logo: "🎮" },
];

const stats = [
  { label: "Portfolio Value", value: "$12,450", change: "+8.5%", icon: BarChart3, progress: 75 },
  { label: "Open Positions", value: "4", change: "", icon: Target, progress: 40 },
  { label: "Today's P&L", value: "+$320", change: "+2.6%", icon: Activity, progress: 62 },
];

const TradingPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="trading" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="finance" size="md" className="bottom-20 -left-20 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-trading/20 to-trading/5 border border-trading/20">
                  <TrendingUp className="w-7 h-7 text-trading" />
                </div>
                <div className="absolute -inset-2 bg-trading/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-trading animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Trading</h1>
                <p className="text-sm text-muted-foreground">Monitor positions and patterns</p>
              </div>
            </div>
            <Button className="gap-2 bg-trading hover:bg-trading/90 text-background">
              <Plus className="w-4 h-4" />
              Log Trade
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:border-trading/30 transition-all duration-300"
              >
                <div className="absolute inset-0 gradient-trading opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-3xl font-semibold">{stat.value}</span>
                      {stat.change && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-finance/10 text-finance">
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <ProgressRing 
                    progress={stat.progress} 
                    size={50} 
                    strokeWidth={4} 
                    color="trading"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Positions */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-trading/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-trading" />
                Open Positions
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {positions.map((pos) => (
                <div key={pos.id} className="group flex items-center justify-between p-5 hover:bg-card-elevated/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-trading/10 to-transparent flex items-center justify-center text-2xl">
                      {pos.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-lg">{pos.symbol}</span>
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          pos.change > 0 ? "bg-finance/10 text-finance" : "bg-destructive/10 text-destructive"
                        )}>
                          {pos.change > 0 ? "+" : ""}{pos.change}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{pos.shares} shares @ ${pos.avgPrice}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-mono text-xl font-semibold">${pos.currentPrice}</p>
                      <p className={cn(
                        "text-xs font-medium flex items-center gap-1 justify-end",
                        pos.change > 0 ? "text-finance" : "text-destructive"
                      )}>
                        {pos.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        ${Math.abs((pos.currentPrice - pos.avgPrice) * pos.shares).toFixed(2)}
                      </p>
                    </div>
                    {/* Mini chart placeholder */}
                    <div className="w-16 h-8 flex items-end gap-0.5">
                      {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 rounded-full transition-all",
                            pos.change > 0 ? "bg-finance/60" : "bg-destructive/60"
                          )}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
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

export default TradingPage;

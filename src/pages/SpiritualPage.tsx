import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { BookOpen, Plus, Flame, CheckCircle2, Sparkles, Heart, Sun, Moon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const entries = [
  { id: 1, date: "Today", duration: "45 min", notes: "Morning devotion - Psalm 23", type: "devotion", emoji: "🌅" },
  { id: 2, date: "Yesterday", duration: "30 min", notes: "Prayer and meditation", type: "prayer", emoji: "🙏" },
  { id: 3, date: "Dec 27", duration: "1 hr", notes: "Bible study - Romans 8", type: "study", emoji: "📖" },
  { id: 4, date: "Dec 26", duration: "25 min", notes: "Evening prayer", type: "prayer", emoji: "🌙" },
];

const stats = [
  { label: "Current Streak", value: "45", unit: "days", icon: Flame, progress: 90 },
  { label: "Weekly Hours", value: "5.2", unit: "hours", icon: Heart, progress: 65 },
  { label: "This Month", value: "22", unit: "sessions", icon: Star, progress: 73 },
];

const typeConfig: Record<string, { bg: string; icon: React.ElementType }> = {
  devotion: { bg: "from-spiritual/20 to-spiritual/5", icon: Sun },
  prayer: { bg: "from-spiritual/15 to-transparent", icon: Heart },
  study: { bg: "from-tech/15 to-transparent", icon: BookOpen },
};

const SpiritualPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="spiritual" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="music" size="sm" className="bottom-40 left-10 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-spiritual/20 to-spiritual/5 border border-spiritual/20">
                  <BookOpen className="w-7 h-7 text-spiritual" />
                </div>
                <div className="absolute -inset-2 bg-spiritual/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-spiritual animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Spiritual</h1>
                <p className="text-sm text-muted-foreground">Prayer and Bible study tracking</p>
              </div>
            </div>
            <Button className="gap-2 bg-spiritual hover:bg-spiritual/90 text-background">
              <Plus className="w-4 h-4" />
              Log Session
            </Button>
          </header>

          {/* Stats with visual emphasis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={cn(
                  "group relative p-6 rounded-2xl border border-border/50 overflow-hidden transition-all duration-300",
                  index === 0 
                    ? "bg-gradient-to-br from-spiritual/10 to-card/80 border-spiritual/30" 
                    : "bg-card/80 backdrop-blur-sm hover:border-spiritual/30"
                )}
              >
                <div className="absolute inset-0 gradient-spiritual opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className={cn("w-4 h-4", index === 0 && "text-trading")} />
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-semibold">{stat.value}</span>
                      <span className="text-sm text-muted-foreground">{stat.unit}</span>
                    </div>
                  </div>
                  
                  <ProgressRing 
                    progress={stat.progress} 
                    size={50} 
                    strokeWidth={4} 
                    color={index === 0 ? "trading" : "spiritual"}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Journal Entries */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-spiritual/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-spiritual" />
                Recent Sessions
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {entries.map((entry) => {
                const TypeIcon = typeConfig[entry.type]?.icon || CheckCircle2;
                return (
                  <div key={entry.id} className="group flex items-center justify-between p-5 hover:bg-card-elevated/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl",
                        typeConfig[entry.type]?.bg || "from-spiritual/20 to-transparent"
                      )}>
                        {entry.emoji}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {entry.notes}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <TypeIcon className="w-3 h-3 text-spiritual" />
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                          <span className="text-muted-foreground/50">•</span>
                          {entry.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground font-mono px-3 py-1.5 rounded-lg bg-muted/50">
                        {entry.duration}
                      </span>
                      <CheckCircle2 className="w-5 h-5 text-spiritual" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SpiritualPage;

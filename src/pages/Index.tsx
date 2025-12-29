import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
  ArrowUpRight,
  Flame,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const domains = [
  {
    icon: Wallet,
    title: "Finance",
    path: "/finance",
    color: "finance" as const,
    value: "₦450K",
    label: "This month",
    change: "+12%",
    progress: 72,
  },
  {
    icon: TrendingUp,
    title: "Trading",
    path: "/trading",
    color: "trading" as const,
    value: "4",
    label: "Open positions",
    change: "+8.5%",
    progress: 65,
  },
  {
    icon: Code2,
    title: "Tech",
    path: "/tech",
    color: "tech" as const,
    value: "47",
    label: "Problems solved",
    change: "+5 this week",
    progress: 85,
  },
  {
    icon: BookOpen,
    title: "Spiritual",
    path: "/spiritual",
    color: "spiritual" as const,
    value: "45",
    label: "Day streak",
    change: "5.2h weekly",
    progress: 90,
  },
  {
    icon: Music,
    title: "Music",
    path: "/music",
    color: "music" as const,
    value: "3.5h",
    label: "Weekly practice",
    change: "Guitar focus",
    progress: 45,
  },
  {
    icon: Bookmark,
    title: "Content",
    path: "/content",
    color: "content" as const,
    value: "128",
    label: "Saved items",
    change: "12 folders",
    progress: 78,
  },
  {
    icon: Briefcase,
    title: "Projects",
    path: "/projects",
    color: "work" as const,
    value: "3",
    label: "Active projects",
    change: "12 completed",
    progress: 55,
  },
];

const colorMap: Record<string, string> = {
  finance: "text-finance border-finance/20 hover:border-finance/50",
  trading: "text-trading border-trading/20 hover:border-trading/50",
  tech: "text-tech border-tech/20 hover:border-tech/50",
  spiritual: "text-spiritual border-spiritual/20 hover:border-spiritual/50",
  music: "text-music border-music/20 hover:border-music/50",
  content: "text-content border-content/20 hover:border-content/50",
  work: "text-work border-work/20 hover:border-work/50",
};

const glowMap: Record<string, string> = {
  finance: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--finance)/0.4)]",
  trading: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--trading)/0.4)]",
  tech: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--tech)/0.4)]",
  spiritual: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--spiritual)/0.4)]",
  music: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--music)/0.4)]",
  content: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--content)/0.4)]",
  work: "group-hover:shadow-[0_0_60px_-15px_hsl(var(--work)/0.4)]",
};

const Index = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="tech" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="spiritual" size="md" className="top-1/3 -left-32 opacity-20" />
          <GradientOrb color="trading" size="sm" className="bottom-20 right-1/4 opacity-25" />
          <GridPattern />

          {/* Header with visual accent */}
          <header className="relative mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-4 h-4 text-trading animate-pulse" />
              <p className="text-muted-foreground text-sm">{greeting}</p>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              Overview
            </h1>
          </header>

          {/* Enhanced Quick Stats */}
          <div className="relative mb-10 p-5 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            {/* Decorative gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-trading/50 to-transparent" />
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-2 rounded-lg bg-trading/10">
                    <Flame className="w-5 h-5 text-trading" />
                  </div>
                  <div className="absolute -inset-1 bg-trading/20 rounded-lg blur-lg -z-10" />
                </div>
                <div>
                  <span className="font-mono text-2xl font-semibold">45</span>
                  <span className="text-muted-foreground text-sm ml-2">day streak</span>
                </div>
              </div>
              
              <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent" />
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-tech/10">
                  <Zap className="w-5 h-5 text-tech" />
                </div>
                <div className="text-sm">
                  <span className="text-foreground font-medium">5</span>
                  <span className="text-muted-foreground ml-1">agents active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {domains.map((domain) => (
              <Link
                key={domain.path}
                to={domain.path}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300",
                  "bg-card/80 backdrop-blur-sm hover:bg-card-elevated",
                  colorMap[domain.color],
                  glowMap[domain.color]
                )}
              >
                {/* Gradient overlay on hover */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    `gradient-${domain.color}`
                  )} 
                />

                <div className="relative flex items-start justify-between mb-5">
                  <div className="relative">
                    <div className={cn(
                      "p-3 rounded-xl",
                      `bg-${domain.color}/10`
                    )}>
                      <domain.icon className="w-5 h-5" />
                    </div>
                    {/* Icon glow effect */}
                    <div 
                      className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity"
                      style={{ background: `hsl(var(--${domain.color}))` }}
                    />
                  </div>
                  
                  {/* Progress ring */}
                  <ProgressRing 
                    progress={domain.progress} 
                    size={44} 
                    strokeWidth={3} 
                    color={domain.color}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-foreground font-medium">{domain.title}</h3>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-mono text-3xl font-semibold text-foreground">{domain.value}</span>
                    <span className="text-sm text-muted-foreground">{domain.label}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      `bg-${domain.color}`
                    )} />
                    {domain.change}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;

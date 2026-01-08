import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainPageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  domainColor: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
}

const colorConfig = {
  finance: {
    gradient: "from-finance/20 via-background to-background",
    orb: "bg-finance/10",
    iconGradient: "from-finance to-finance/50",
    shadow: "shadow-finance/20",
    text: "text-finance",
  },
  trading: {
    gradient: "from-trading/20 via-background to-background",
    orb: "bg-trading/10",
    iconGradient: "from-trading to-trading/50",
    shadow: "shadow-trading/20",
    text: "text-trading",
  },
  tech: {
    gradient: "from-tech/20 via-background to-background",
    orb: "bg-tech/10",
    iconGradient: "from-tech to-tech/50",
    shadow: "shadow-tech/20",
    text: "text-tech",
  },
  spiritual: {
    gradient: "from-spiritual/20 via-background to-background",
    orb: "bg-spiritual/10",
    iconGradient: "from-spiritual to-spiritual/50",
    shadow: "shadow-spiritual/20",
    text: "text-spiritual",
  },
  music: {
    gradient: "from-music/20 via-background to-background",
    orb: "bg-music/10",
    iconGradient: "from-music to-music/50",
    shadow: "shadow-music/20",
    text: "text-music",
  },
  content: {
    gradient: "from-content/20 via-background to-background",
    orb: "bg-content/10",
    iconGradient: "from-content to-content/50",
    shadow: "shadow-content/20",
    text: "text-content",
  },
  work: {
    gradient: "from-work/20 via-background to-background",
    orb: "bg-work/10",
    iconGradient: "from-work to-work/50",
    shadow: "shadow-work/20",
    text: "text-work",
  },
};

export function DomainPageHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  domainColor, 
  action 
}: DomainPageHeaderProps) {
  const config = colorConfig[domainColor];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", config.gradient)} />
      <div className={cn("absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2", config.orb)} />
      
      <div className="relative px-8 pt-10 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  config.iconGradient,
                  config.shadow
                )}
              >
                <Icon className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
            </div>

            {action && (
              <button 
                onClick={action.onClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <action.icon className={cn("w-4 h-4", config.text)} />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

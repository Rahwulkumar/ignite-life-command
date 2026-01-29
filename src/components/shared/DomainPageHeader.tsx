import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import header videos
import videoFinance from "@/assets/video-finance.mp4";
import videoTrading from "@/assets/video-trading.mp4";
import videoTech from "@/assets/video-tech.mp4";
import videoSpiritual from "@/assets/video-spiritual.mp4";
import videoMusic from "@/assets/video-music.mp4";
import videoContent from "@/assets/video-content.mp4";
import videoProjects from "@/assets/video-projects.mp4";

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
    headerVideo: videoFinance,
  },
  trading: {
    gradient: "from-trading/20 via-background to-background",
    orb: "bg-trading/10",
    iconGradient: "from-trading to-trading/50",
    shadow: "shadow-trading/20",
    text: "text-trading",
    headerVideo: videoTrading,
  },
  tech: {
    gradient: "from-tech/20 via-background to-background",
    orb: "bg-tech/10",
    iconGradient: "from-tech to-tech/50",
    shadow: "shadow-tech/20",
    text: "text-tech",
    headerVideo: videoTech,
  },
  spiritual: {
    gradient: "from-spiritual/20 via-background to-background",
    orb: "bg-spiritual/10",
    iconGradient: "from-spiritual to-spiritual/50",
    shadow: "shadow-spiritual/20",
    text: "text-spiritual",
    headerVideo: videoSpiritual,
  },
  music: {
    gradient: "from-music/20 via-background to-background",
    orb: "bg-music/10",
    iconGradient: "from-music to-music/50",
    shadow: "shadow-music/20",
    text: "text-music",
    headerVideo: videoMusic,
  },
  content: {
    gradient: "from-content/20 via-background to-background",
    orb: "bg-content/10",
    iconGradient: "from-content to-content/50",
    shadow: "shadow-content/20",
    text: "text-content",
    headerVideo: videoContent,
  },
  work: {
    gradient: "from-work/20 via-background to-background",
    orb: "bg-work/10",
    iconGradient: "from-work to-work/50",
    shadow: "shadow-work/20",
    text: "text-work",
    headerVideo: videoProjects,
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
    <div className="relative overflow-hidden pt-14">
      {/* Animated background video */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="h-full w-full"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-center"
          >
            <source src={config.headerVideo} type="video/mp4" />
          </video>
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background z-10" />
      </div>
      
      {/* Decorative orb */}
      <div className={cn("absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10", config.orb)} />
      
      <div className="relative px-8 pt-10 pb-8 z-20">
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
                <motion.h1 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground"
                >
                  {subtitle}
                </motion.p>
              </div>
            </div>

            {action && (
              <motion.button 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={action.onClick}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-background/70 backdrop-blur-sm border border-foreground/10 hover:bg-background/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <action.icon className={cn("w-4 h-4", config.text)} />
                <span className="text-sm font-medium">{action.label}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

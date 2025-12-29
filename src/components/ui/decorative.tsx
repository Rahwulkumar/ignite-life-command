import { cn } from "@/lib/utils";

interface GradientOrbProps {
  color: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  className?: string;
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  finance: "from-finance/30 via-finance/10",
  trading: "from-trading/30 via-trading/10",
  tech: "from-tech/30 via-tech/10",
  spiritual: "from-spiritual/30 via-spiritual/10",
  music: "from-music/30 via-music/10",
  content: "from-content/30 via-content/10",
  work: "from-work/30 via-work/10",
};

const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
};

export const GradientOrb = ({ color, className, size = "md" }: GradientOrbProps) => (
  <div
    className={cn(
      "absolute rounded-full bg-gradient-to-br to-transparent blur-3xl opacity-60 pointer-events-none",
      colorClasses[color],
      sizeClasses[size],
      className
    )}
  />
);

interface GridPatternProps {
  className?: string;
}

export const GridPattern = ({ className }: GridPatternProps) => (
  <div
    className={cn(
      "absolute inset-0 pointer-events-none opacity-[0.02]",
      className
    )}
    style={{
      backgroundImage: `
        linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
        linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
      `,
      backgroundSize: "60px 60px",
    }}
  />
);

interface FloatingShapeProps {
  className?: string;
  variant?: "circle" | "square" | "ring";
  color?: string;
}

export const FloatingShape = ({ className, variant = "circle", color = "border" }: FloatingShapeProps) => {
  const shapes = {
    circle: "rounded-full",
    square: "rounded-lg rotate-45",
    ring: "rounded-full border-2 bg-transparent",
  };

  return (
    <div
      className={cn(
        "absolute w-8 h-8 opacity-20 pointer-events-none",
        shapes[variant],
        variant !== "ring" && "bg-current",
        className
      )}
      style={{ color: `hsl(var(--${color}))` }}
    />
  );
};

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export const ProgressRing = ({ 
  progress, 
  size = 60, 
  strokeWidth = 4, 
  color = "primary",
  className 
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className={cn("transform -rotate-90", className)}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`hsl(var(--${color}))`}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-500 ease-out"
      />
    </svg>
  );
};

interface GlowCardProps {
  children: React.ReactNode;
  color?: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
  className?: string;
}

const glowColors = {
  finance: "hover:shadow-[0_0_40px_-10px_hsl(var(--finance)/0.5)]",
  trading: "hover:shadow-[0_0_40px_-10px_hsl(var(--trading)/0.5)]",
  tech: "hover:shadow-[0_0_40px_-10px_hsl(var(--tech)/0.5)]",
  spiritual: "hover:shadow-[0_0_40px_-10px_hsl(var(--spiritual)/0.5)]",
  music: "hover:shadow-[0_0_40px_-10px_hsl(var(--music)/0.5)]",
  content: "hover:shadow-[0_0_40px_-10px_hsl(var(--content)/0.5)]",
  work: "hover:shadow-[0_0_40px_-10px_hsl(var(--work)/0.5)]",
};

export const GlowCard = ({ children, color = "tech", className }: GlowCardProps) => (
  <div
    className={cn(
      "relative transition-all duration-300",
      glowColors[color],
      className
    )}
  >
    {children}
  </div>
);

interface StatDisplayProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export const StatDisplay = ({ value, label, icon, trend, trendUp, color }: StatDisplayProps) => (
  <div className="relative overflow-hidden p-5 bg-card rounded-xl border border-border/50 group hover:border-border transition-colors">
    {/* Subtle gradient background */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: color ? `radial-gradient(ellipse at top right, hsl(var(--${color}) / 0.08), transparent 60%)` : undefined
      }}
    />
    
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-2xl font-medium">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-medium",
            trendUp ? "text-finance" : "text-destructive"
          )}>
            {trend}
          </span>
        )}
      </div>
    </div>
  </div>
);

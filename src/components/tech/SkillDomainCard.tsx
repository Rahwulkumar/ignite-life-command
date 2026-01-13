import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  lastUpdated?: string;
}

interface SkillDomainCardProps {
  domain: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    skills: Skill[];
  };
  onSelect: () => void;
}

const proficiencyLevels = {
  beginner: { label: "Beginner", value: 25, color: "from-muted-foreground to-muted" },
  intermediate: { label: "Intermediate", value: 50, color: "from-tech/60 to-tech" },
  advanced: { label: "Advanced", value: 75, color: "from-tech to-finance" },
  expert: { label: "Expert", value: 100, color: "from-finance to-trading" },
};

export function SkillDomainCard({ domain, onSelect }: SkillDomainCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const avgProficiency = domain.skills.length > 0
    ? domain.skills.reduce((acc, s) => acc + proficiencyLevels[s.proficiency].value, 0) / domain.skills.length
    : 0;

  const circumference = 2 * Math.PI * 38;
  const strokeDashoffset = circumference - (avgProficiency / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className={cn(
        "relative group cursor-pointer",
        "rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm",
        "p-6 transition-all duration-300",
        "hover:border-tech/30 hover:shadow-lg hover:shadow-tech/5"
      )}
    >
      {/* Ambient glow on hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
        "bg-gradient-to-br from-tech/5 via-transparent to-transparent",
        isHovered && "opacity-100"
      )} />

      <div className="relative z-10">
        {/* Header with icon and progress ring */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br from-tech/20 to-tech/5",
            "border border-tech/20 text-tech"
          )}>
            {domain.icon}
          </div>

          {/* Progress Ring */}
          <div className="relative w-20 h-20 -mt-1 -mr-1">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
              {/* Background ring */}
              <circle
                cx="42"
                cy="42"
                r="38"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress ring */}
              <motion.circle
                cx="42"
                cy="42"
                r="38"
                stroke="url(#techGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
              <defs>
                <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--tech))" />
                  <stop offset="100%" stopColor="hsl(var(--finance))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold tabular-nums">{Math.round(avgProficiency)}%</span>
            </div>
          </div>
        </div>

        {/* Domain name */}
        <h3 className="text-lg font-semibold mb-1">{domain.name}</h3>
        
        {/* Skill count */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{domain.skills.length} skills tracked</span>
        </div>

        {/* Skill preview pills */}
        {domain.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {domain.skills.slice(0, 3).map((skill) => (
              <span
                key={skill.id}
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  "bg-muted/50 text-muted-foreground",
                  "border border-border/50"
                )}
              >
                {skill.name}
              </span>
            ))}
            {domain.skills.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{domain.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Explore button */}
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          "text-tech/70 group-hover:text-tech transition-colors"
        )}>
          <span>Explore</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

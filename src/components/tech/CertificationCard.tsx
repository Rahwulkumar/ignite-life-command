import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Award, Calendar, ExternalLink, Clock, CheckCircle2, 
  BookOpen, MoreHorizontal, Trash2, Edit2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Certification {
  id: string;
  name: string;
  provider: string;
  status: "preparing" | "earned" | "expired";
  targetDate?: string;
  earnedDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  progress?: number;
  studyNotes?: string;
}

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (cert: Certification) => void;
  onDelete?: (id: string) => void;
  variant?: "compact" | "featured";
}

const providerColors: Record<string, { bg: string; border: string; text: string }> = {
  AWS: { bg: "from-[#FF9900]/10 to-[#FF9900]/5", border: "border-[#FF9900]/30", text: "text-[#FF9900]" },
  Google: { bg: "from-[#4285F4]/10 to-[#4285F4]/5", border: "border-[#4285F4]/30", text: "text-[#4285F4]" },
  Azure: { bg: "from-[#0078D4]/10 to-[#0078D4]/5", border: "border-[#0078D4]/30", text: "text-[#0078D4]" },
  CompTIA: { bg: "from-[#C8202F]/10 to-[#C8202F]/5", border: "border-[#C8202F]/30", text: "text-[#C8202F]" },
  Meta: { bg: "from-[#0668E1]/10 to-[#0668E1]/5", border: "border-[#0668E1]/30", text: "text-[#0668E1]" },
  Cisco: { bg: "from-[#049FD9]/10 to-[#049FD9]/5", border: "border-[#049FD9]/30", text: "text-[#049FD9]" },
  default: { bg: "from-tech/10 to-tech/5", border: "border-tech/30", text: "text-tech" },
};

export function CertificationCard({ 
  certification, 
  onEdit, 
  onDelete, 
  variant = "compact" 
}: CertificationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = providerColors[certification.provider] || providerColors.default;
  const circumference = 2 * Math.PI * 32;
  const progress = certification.progress || 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getDaysRemaining = () => {
    if (!certification.targetDate) return null;
    const target = new Date(certification.targetDate);
    const now = new Date();
    const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  if (variant === "featured" && certification.status === "preparing") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br", colors.bg,
          "border", colors.border,
          "p-6"
        )}
      >
        {/* Ambient background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className={cn("text-xs font-medium uppercase tracking-wider", colors.text)}>
                {certification.provider}
              </span>
              <h3 className="text-xl font-semibold mt-1">{certification.name}</h3>
            </div>

            {/* Progress Ring */}
            <div className="relative w-20 h-20">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                <circle
                  cx="36"
                  cy="36"
                  r="32"
                  stroke="hsl(var(--muted))"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="36"
                  cy="36"
                  r="32"
                  stroke="currentColor"
                  className={colors.text}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ strokeDasharray: circumference }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold tabular-nums">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mb-6">
            {daysRemaining !== null && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <span className="font-semibold">{daysRemaining}</span>
                  <span className="text-muted-foreground"> days left</span>
                </span>
              </div>
            )}
            {certification.targetDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date(certification.targetDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button size="sm" variant="secondary" className="gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Study Notes
            </Button>
            <Button size="sm" variant="ghost" className="gap-2">
              <Edit2 className="w-3.5 h-3.5" />
              Update Progress
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Compact variant for earned or list view
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative group rounded-xl border border-border/50 bg-card/80",
        "p-4 transition-all duration-200",
        "hover:border-border hover:shadow-md"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Icon/Badge */}
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
          "bg-gradient-to-br", colors.bg,
          "border", colors.border
        )}>
          {certification.status === "earned" ? (
            <Award className={cn("w-5 h-5", colors.text)} />
          ) : (
            <BookOpen className={cn("w-5 h-5", colors.text)} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{certification.name}</h4>
            {certification.status === "earned" && (
              <CheckCircle2 className="w-4 h-4 text-finance shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={colors.text}>{certification.provider}</span>
            <span>•</span>
            {certification.status === "earned" && certification.earnedDate && (
              <span>Earned {new Date(certification.earnedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            )}
            {certification.status === "preparing" && certification.targetDate && (
              <span>Target: {new Date(certification.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>

        {/* Progress or link */}
        {certification.status === "preparing" && certification.progress !== undefined && (
          <div className="text-right shrink-0">
            <span className="text-sm font-semibold tabular-nums">{certification.progress}%</span>
            <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${certification.progress}%` }}
                transition={{ duration: 0.5 }}
                className={cn("h-full rounded-full bg-gradient-to-r", colors.bg.replace('/10', '').replace('/5', ''))}
                style={{ background: `linear-gradient(to right, hsl(var(--tech)), hsl(var(--finance)))` }}
              />
            </div>
          </div>
        )}

        {certification.status === "earned" && certification.credentialUrl && (
          <a
            href={certification.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        )}

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isHovered && "opacity-100"
              )}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(certification)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete?.(certification.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

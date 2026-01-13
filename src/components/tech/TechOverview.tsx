import { motion } from "framer-motion";
import { 
  Sparkles, Award, Lightbulb, TrendingUp, 
  ChevronRight, BookOpen, Clock 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SkillRadarChart } from "./SkillRadarChart";
import { CertificationCard, Certification } from "./CertificationCard";
import { ResearchEntryCard, ResearchEntry } from "./ResearchEntryCard";
import { Button } from "@/components/ui/button";

interface TechOverviewProps {
  skillData: { domain: string; value: number }[];
  activeCertifications: Certification[];
  recentResearch: ResearchEntry[];
  onNavigate: (tab: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function TechOverview({ 
  skillData, 
  activeCertifications, 
  recentResearch,
  onNavigate 
}: TechOverviewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Top row - Skill snapshot & Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <motion.div
          variants={itemVariants}
          className={cn(
            "relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm",
            "p-6 overflow-hidden"
          )}
        >
          {/* Ambient glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-tech/5 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-tech" />
                  Skill Overview
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your expertise across tech domains
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate("skills")}
                className="gap-1 text-tech hover:text-tech"
              >
                All Skills <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center">
              <SkillRadarChart data={skillData} size={260} />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Bento Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          {/* Total Skills */}
          <div className={cn(
            "rounded-xl border border-border/50 bg-card/80 p-5",
            "flex flex-col justify-between"
          )}>
            <div className="w-10 h-10 rounded-lg bg-tech/10 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-tech" />
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">
                {skillData.reduce((acc, d) => acc + Math.round(d.value / 20), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Skills Tracked</p>
            </div>
          </div>

          {/* Certifications */}
          <div className={cn(
            "rounded-xl border border-border/50 bg-card/80 p-5",
            "flex flex-col justify-between"
          )}>
            <div className="w-10 h-10 rounded-lg bg-finance/10 flex items-center justify-center mb-4">
              <Award className="w-5 h-5 text-finance" />
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">
                {activeCertifications.filter(c => c.status === "earned").length}
              </p>
              <p className="text-sm text-muted-foreground">Certifications Earned</p>
            </div>
          </div>

          {/* Research Topics */}
          <div className={cn(
            "rounded-xl border border-border/50 bg-card/80 p-5",
            "flex flex-col justify-between"
          )}>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Lightbulb className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">{recentResearch.length}</p>
              <p className="text-sm text-muted-foreground">Research Topics</p>
            </div>
          </div>

          {/* Growth */}
          <div className={cn(
            "rounded-xl border border-border/50 bg-card/80 p-5",
            "flex flex-col justify-between"
          )}>
            <div className="w-10 h-10 rounded-lg bg-trading/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5 text-trading" />
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">+12%</p>
              <p className="text-sm text-muted-foreground">Skill Growth</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Certifications */}
      {activeCertifications.filter(c => c.status === "preparing").length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-4 h-4 text-finance" />
              Active Certifications
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate("certifications")}
              className="gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCertifications
              .filter(c => c.status === "preparing")
              .slice(0, 2)
              .map((cert) => (
                <CertificationCard 
                  key={cert.id} 
                  certification={cert} 
                  variant="featured" 
                />
              ))}
          </div>
        </motion.div>
      )}

      {/* Recent Research */}
      {recentResearch.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-purple-400" />
              Recent Research
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onNavigate("research")}
              className="gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentResearch.slice(0, 2).map((entry) => (
              <ResearchEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state - Quick actions */}
      {skillData.length === 0 && activeCertifications.length === 0 && recentResearch.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-tech/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-tech" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Start Your Tech Journey</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Track your skills, prepare for certifications, and document your tech research all in one place.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => onNavigate("skills")} className="gap-2">
              <BookOpen className="w-4 h-4" />
              Add Skills
            </Button>
            <Button variant="outline" onClick={() => onNavigate("certifications")} className="gap-2">
              <Award className="w-4 h-4" />
              Add Certification
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

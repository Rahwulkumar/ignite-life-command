import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, ChevronDown, ChevronUp, Link2, 
  MoreHorizontal, Edit2, Trash2, ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ResearchEntry {
  id: string;
  title: string;
  domain: string;
  date: string;
  insights: string;
  links?: { title: string; url: string }[];
  tags?: string[];
}

interface ResearchEntryCardProps {
  entry: ResearchEntry;
  onEdit?: (entry: ResearchEntry) => void;
  onDelete?: (id: string) => void;
}

const domainColors: Record<string, { bg: string; border: string; text: string }> = {
  "AI/ML": { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  "Blockchain": { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  "Cloud": { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  "Security": { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400" },
  "IoT": { bg: "bg-green-500/10", border: "border-green-500/30", text: "text-green-400" },
  "DevOps": { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  "Mobile": { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  "Web3": { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
  default: { bg: "bg-tech/10", border: "border-tech/30", text: "text-tech" },
};

export function ResearchEntryCard({ entry, onEdit, onDelete }: ResearchEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const colors = domainColors[entry.domain] || domainColors.default;
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const previewText = entry.insights.length > 150 
    ? entry.insights.slice(0, 150) + "..." 
    : entry.insights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative group rounded-xl border border-border/50 bg-card/80",
        "overflow-hidden transition-all duration-200",
        "hover:border-border hover:shadow-md"
      )}
    >
      {/* Domain color accent bar */}
      <div className={cn("h-1 w-full", colors.bg.replace('/10', '/30'))} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium",
                colors.bg, colors.text
              )}>
                {entry.domain}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h4 className="text-lg font-semibold">{entry.title}</h4>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-2",
                  isHovered && "opacity-100"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(entry)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(entry.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Insights preview/full */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isExpanded ? entry.insights : previewText}
          </p>
          {entry.insights.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs text-tech hover:text-tech/80 mt-2 transition-colors"
            >
              {isExpanded ? (
                <>Show less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Show more <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {entry.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-xs bg-muted/50 text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {entry.links && entry.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
            {entry.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs",
                  "bg-muted/50 text-muted-foreground hover:text-foreground",
                  "hover:bg-muted transition-colors"
                )}
              >
                <Link2 className="w-3 h-3" />
                {link.title}
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

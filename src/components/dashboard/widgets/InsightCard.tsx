import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function InsightCard({ icon: Icon, title, description, action }: InsightCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="rounded-lg border border-border bg-card p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 bg-muted">
          <Icon className="w-4 h-4 text-foreground" />
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
          {action && (
            <Link 
              to={action.href}
              className="inline-flex items-center gap-1 text-xs font-medium mt-3 transition-colors text-foreground hover:text-foreground/70"
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

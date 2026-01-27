import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function InsightCard({ icon: Icon, title, description, action }: InsightCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
          {action && (
            <Link 
              to={action.href}
              className="inline-flex items-center gap-1 text-xs font-medium mt-3 hover:underline"
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

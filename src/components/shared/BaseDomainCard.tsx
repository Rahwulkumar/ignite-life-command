import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DomainId, DOMAIN_COLORS } from "@/lib/domain-colors";

interface BaseDomainCardProps {
    /** Domain color theme */
    domainColor: DomainId;
    /** Card icon element */
    icon: ReactNode;
    /** Card title */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Card content */
    children: ReactNode;
    /** Optional footer content */
    footer?: ReactNode;
    /** Optional action button in header */
    headerAction?: ReactNode;
    /** Animation delay in seconds */
    animationDelay?: number;
    /** Additional className */
    className?: string;
}

export function BaseDomainCard({
    domainColor,
    icon,
    title,
    subtitle,
    children,
    footer,
    headerAction,
    animationDelay = 0,
    className,
}: BaseDomainCardProps) {
    const colors = DOMAIN_COLORS[domainColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className={cn(
                "rounded-xl border border-border/50 bg-card overflow-hidden",
                className
            )}
        >
            {/* Header */}
            <div className={cn("px-4 py-3 border-b border-border/50", colors.bgSubtle)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", colors.bgSubtle, "border", colors.border)}>
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{title}</h3>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {headerAction}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="px-4 py-3 border-t border-border/50 bg-muted/20">
                    {footer}
                </div>
            )}
        </motion.div>
    );
}

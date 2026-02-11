/**
 * Centralized domain color configuration
 * Single source of truth for all domain-specific styling
 */

export type DomainId =
    | "finance"
    | "trading"
    | "tech"
    | "spiritual"
    | "music"
    | "content"
    | "work"
    | "general";

export interface DomainColorConfig {
    /** Text color class */
    text: string;
    /** Solid background class */
    bg: string;
    /** Subtle background (10% opacity) */
    bgSubtle: string;
    /** Border color class */
    border: string;
    /** Hover state class */
    hover: string;
    /** Gradient for icons/accents */
    gradient: string;
    /** Glow/shadow effect */
    shadow: string;
}

export const DOMAIN_COLORS: Record<DomainId, DomainColorConfig> = {
    finance: {
        text: "text-finance",
        bg: "bg-finance",
        bgSubtle: "bg-finance/10",
        border: "border-finance/30",
        hover: "hover:bg-finance/20",
        gradient: "from-finance to-finance/50",
        shadow: "shadow-finance/20",
    },
    trading: {
        text: "text-trading",
        bg: "bg-trading",
        bgSubtle: "bg-trading/10",
        border: "border-trading/30",
        hover: "hover:bg-trading/20",
        gradient: "from-trading to-trading/50",
        shadow: "shadow-trading/20",
    },
    tech: {
        text: "text-tech",
        bg: "bg-tech",
        bgSubtle: "bg-tech/10",
        border: "border-tech/30",
        hover: "hover:bg-tech/20",
        gradient: "from-tech to-tech/50",
        shadow: "shadow-tech/20",
    },
    spiritual: {
        text: "text-spiritual",
        bg: "bg-spiritual",
        bgSubtle: "bg-spiritual/10",
        border: "border-spiritual/30",
        hover: "hover:bg-spiritual/20",
        gradient: "from-spiritual to-spiritual/50",
        shadow: "shadow-spiritual/20",
    },
    music: {
        text: "text-music",
        bg: "bg-music",
        bgSubtle: "bg-music/10",
        border: "border-music/30",
        hover: "hover:bg-music/20",
        gradient: "from-music to-music/50",
        shadow: "shadow-music/20",
    },
    content: {
        text: "text-content",
        bg: "bg-content",
        bgSubtle: "bg-content/10",
        border: "border-content/30",
        hover: "hover:bg-content/20",
        gradient: "from-content to-content/50",
        shadow: "shadow-content/20",
    },
    work: {
        text: "text-work",
        bg: "bg-work",
        bgSubtle: "bg-work/10",
        border: "border-work/30",
        hover: "hover:bg-work/20",
        gradient: "from-work to-work/50",
        shadow: "shadow-work/20",
    },
    general: {
        text: "text-muted-foreground",
        bg: "bg-muted",
        bgSubtle: "bg-muted/10",
        border: "border-border",
        hover: "hover:bg-muted/20",
        gradient: "from-muted to-muted/50",
        shadow: "shadow-muted/20",
    },
};

/**
 * Get domain color configuration by ID
 */
export function getDomainColors(domainId: DomainId): DomainColorConfig {
    return DOMAIN_COLORS[domainId];
}

/**
 * Get button variant classes for a domain
 */
export function getDomainButtonClasses(domainId: DomainId): string {
    const colors = DOMAIN_COLORS[domainId];
    return `${colors.bgSubtle} ${colors.text} border ${colors.border} ${colors.hover} hover:border-${domainId}/50`;
}

/**
 * Shared domain types for the application.
 * Centralizes duplicate interface definitions found across components.
 */

// ============================================================================
// DASHBOARD & ACTIVITY
// ============================================================================

export type DomainType = "finance" | "tech" | "spiritual" | "music" | "trading" | "content" | "work";

export interface Activity {
    type: DomainType;
    title: string;
    description: string;
    time: string;
}

export interface AgentInsight {
    agentName: string;
    domain: DomainType;
    insight: string;
    action?: string;
}

export interface Streak {
    id: string;
    title: string;
    count: number;
    domain: DomainType;
    icon?: string; // Icon name if needed
}

// ============================================================================
// TRADING
// ============================================================================

export interface WatchlistItem {
    id: number;
    symbol: string;
    name: string;
    price: number;
    change: number;
    notes?: string;
}

export interface Trade {
    id: number;
    symbol: string;
    type: "buy" | "sell";
    quantity: number;
    price: number;
    date: string;
    notes: string;
    pnl?: number;
}

export interface Holding {
    id: string;
    name: string;
    symbol: string;
    type: "stock" | "mutual_fund" | "etf" | "bond" | "crypto";
    units: number;
    avgCost: number;
    currentPrice: number;
    returns: number;
    returnsPercent: number;
}

export interface PortfolioDataPoint {
    date: string;
    value: number;
}

export interface TradeEntry {
    id: number;
    pair: string;
    type: "Long" | "Short";
    entry: number;
    exit: number;
    pnl: number;
    notes: string;
    date: string;
    status: "Win" | "Loss";
}

export interface InvestmentHolding {
    id: string;
    name: string;
    symbol: string;
    type: "stock" | "etf" | "crypto";
    units: number;
    avgCost: number;
    currentPrice: number;
    returns: number;
    returnsPercent: number;
}

// ============================================================================
// METRICS & TRACKING
// ============================================================================

/**
 * Represents a single metric value.
 * Can be: number (e.g., weight), string (e.g., notes), boolean (e.g., yes/no), or null.
 */
export type MetricValue = string | number | boolean | null;

/**
 * A record of metric values keyed by metric ID.
 * Used throughout the dashboard for tracking task completion data.
 */
export type MetricsData = Record<string, MetricValue>;

/**
 * Payload for completing a task with metrics.
 */
export interface TaskCompletionPayload {
    taskId: string;
    date: Date;
    notes: string;
    metricsData: MetricsData;
}


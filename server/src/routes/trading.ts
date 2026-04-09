import { Hono } from "hono";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  tradingHoldings,
  tradingPortfolioData,
  tradingTrades,
  tradingWatchlist,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import { getUserId } from "../utils/user-context.js";

const tradingRoute = new Hono();

tradingRoute.use("*", requireAuth);

const seedWatchlist = [
  { symbol: "AMZN", name: "Amazon", price: "153.42", change: "2.1", notes: "Watching for breakout" },
  { symbol: "AMD", name: "AMD Inc.", price: "147.80", change: "-1.5", notes: "Support at $145" },
  { symbol: "COIN", name: "Coinbase", price: "178.30", change: "5.8", notes: "Crypto momentum" },
  { symbol: "PLTR", name: "Palantir", price: "18.45", change: "-0.8", notes: "AI government plays" },
];

const seedTrades = [
  { symbol: "AAPL", type: "buy", quantity: "10", price: "185.50", dateLabel: "Dec 28", notes: "Support level bounce", pnl: "68" },
  { symbol: "NVDA", type: "buy", quantity: "3", price: "480.00", dateLabel: "Dec 26", notes: "AI momentum play", pnl: "45" },
  { symbol: "TSLA", type: "sell", quantity: "5", price: "252.30", dateLabel: "Dec 24", notes: "Taking profits at resistance", pnl: "120" },
  { symbol: "MSFT", type: "buy", quantity: "8", price: "375.00", dateLabel: "Dec 22", notes: "Cloud growth thesis", pnl: "-52" },
  { symbol: "META", type: "sell", quantity: "4", price: "345.80", dateLabel: "Dec 20", notes: "Rebalancing portfolio", pnl: "85" },
];

const seedHoldings = [
  { name: "Apple Inc.", symbol: "AAPL", type: "stock", units: "15", avgCost: "145.50", currentPrice: "193.42", returns: "718.80", returnsPercent: "32.90" },
  { name: "Microsoft Corp.", symbol: "MSFT", type: "stock", units: "8", avgCost: "310.25", currentPrice: "378.91", returns: "549.28", returnsPercent: "22.10" },
  { name: "NVIDIA Corp.", symbol: "NVDA", type: "stock", units: "5", avgCost: "420.00", currentPrice: "495.22", returns: "376.10", returnsPercent: "17.90" },
  { name: "Vanguard 500 Index", symbol: "VFIAX", type: "mutual_fund", units: "25", avgCost: "410.50", currentPrice: "458.30", returns: "1195.00", returnsPercent: "11.60" },
  { name: "Fidelity Growth Fund", symbol: "FDGRX", type: "mutual_fund", units: "40", avgCost: "145.20", currentPrice: "168.45", returns: "930.00", returnsPercent: "16.00" },
  { name: "T. Rowe Price Blue Chip", symbol: "TRBCX", type: "mutual_fund", units: "30", avgCost: "138.00", currentPrice: "151.20", returns: "396.00", returnsPercent: "9.60" },
  { name: "SPDR S&P 500 ETF", symbol: "SPY", type: "etf", units: "10", avgCost: "420.00", currentPrice: "475.50", returns: "555.00", returnsPercent: "13.20" },
  { name: "Invesco QQQ Trust", symbol: "QQQ", type: "etf", units: "8", avgCost: "350.00", currentPrice: "405.80", returns: "446.40", returnsPercent: "15.90" },
  { name: "Vanguard Total Bond", symbol: "BND", type: "etf", units: "50", avgCost: "72.50", currentPrice: "71.20", returns: "-65.00", returnsPercent: "-1.80" },
  { name: "US Treasury 10Y", symbol: "T-10Y", type: "bond", units: "20", avgCost: "950.00", currentPrice: "942.50", returns: "-150.00", returnsPercent: "-0.80" },
  { name: "Bitcoin", symbol: "BTC", type: "crypto", units: "0.15", avgCost: "42000.00", currentPrice: "43250.00", returns: "187.50", returnsPercent: "3.00" },
  { name: "Ethereum", symbol: "ETH", type: "crypto", units: "2.5", avgCost: "2200.00", currentPrice: "2350.00", returns: "375.00", returnsPercent: "6.80" },
];

const seedPortfolio = [
  { dateLabel: "Dec 1", value: 10000, orderIndex: 0 },
  { dateLabel: "Dec 5", value: 10250, orderIndex: 1 },
  { dateLabel: "Dec 10", value: 10100, orderIndex: 2 },
  { dateLabel: "Dec 15", value: 10800, orderIndex: 3 },
  { dateLabel: "Dec 20", value: 11200, orderIndex: 4 },
  { dateLabel: "Dec 25", value: 11050, orderIndex: 5 },
  { dateLabel: "Dec 30", value: 12450, orderIndex: 6 },
];

async function ensureTradingSeedData(userId: string) {
  const [existingWatchlist, existingTrades, existingHoldings, existingPortfolio] =
    await Promise.all([
      db
        .select({ id: tradingWatchlist.id })
        .from(tradingWatchlist)
        .where(eq(tradingWatchlist.userId, userId))
        .limit(1),
      db
        .select({ id: tradingTrades.id })
        .from(tradingTrades)
        .where(eq(tradingTrades.userId, userId))
        .limit(1),
      db
        .select({ id: tradingHoldings.id })
        .from(tradingHoldings)
        .where(eq(tradingHoldings.userId, userId))
        .limit(1),
      db
        .select({ id: tradingPortfolioData.id })
        .from(tradingPortfolioData)
        .where(eq(tradingPortfolioData.userId, userId))
        .limit(1),
    ]);

  const writes: Promise<unknown>[] = [];

  if (existingWatchlist.length === 0) {
    writes.push(
      db.insert(tradingWatchlist).values(
        seedWatchlist.map((item) => ({
          userId,
          ...item,
        })),
      ),
    );
  }

  if (existingTrades.length === 0) {
    writes.push(
      db.insert(tradingTrades).values(
        seedTrades.map((trade) => ({
          userId,
          ...trade,
        })),
      ),
    );
  }

  if (existingHoldings.length === 0) {
    writes.push(
      db.insert(tradingHoldings).values(
        seedHoldings.map((holding) => ({
          userId,
          ...holding,
        })),
      ),
    );
  }

  if (existingPortfolio.length === 0) {
    writes.push(
      db.insert(tradingPortfolioData).values(
        seedPortfolio.map((point) => ({
          userId,
          ...point,
        })),
      ),
    );
  }

  if (writes.length > 0) {
    await Promise.all(writes);
  }
}

tradingRoute.get("/trading", async (c) => {
  const userId = getUserId(c);
  await ensureTradingSeedData(userId);

  const [watchlist, trades, holdings, portfolioData] = await Promise.all([
    db
      .select()
      .from(tradingWatchlist)
      .where(eq(tradingWatchlist.userId, userId))
      .orderBy(desc(tradingWatchlist.createdAt)),
    db
      .select()
      .from(tradingTrades)
      .where(eq(tradingTrades.userId, userId))
      .orderBy(desc(tradingTrades.createdAt)),
    db
      .select()
      .from(tradingHoldings)
      .where(eq(tradingHoldings.userId, userId))
      .orderBy(asc(tradingHoldings.createdAt)),
    db
      .select()
      .from(tradingPortfolioData)
      .where(eq(tradingPortfolioData.userId, userId))
      .orderBy(asc(tradingPortfolioData.orderIndex)),
  ]);

  return c.json({ watchlist, trades, holdings, portfolioData });
});

tradingRoute.post("/trading/watchlist", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    symbol: string;
    name: string;
    price: number;
    change?: number;
    notes?: string;
  }>();

  const symbol = body.symbol?.trim().toUpperCase();
  const name = body.name?.trim();

  if (!symbol) {
    return c.json({ error: "Symbol is required" }, 400);
  }

  if (!name) {
    return c.json({ error: "Name is required" }, 400);
  }

  if (!Number.isFinite(body.price) || body.price <= 0) {
    return c.json({ error: "Price must be greater than zero" }, 400);
  }

  const [item] = await db
    .insert(tradingWatchlist)
    .values({
      userId,
      symbol,
      name,
      price: String(body.price),
      change: String(body.change ?? 0),
      notes: body.notes?.trim() || null,
    })
    .returning();

  return c.json(item, 201);
});

tradingRoute.post("/trading/trades", async (c) => {
  const userId = getUserId(c);
  const body = await c.req.json<{
    symbol: string;
    type: string;
    quantity: number;
    price: number;
    dateLabel?: string;
    notes?: string;
    pnl?: number;
  }>();

  const symbol = body.symbol?.trim().toUpperCase();
  const type = body.type?.trim();

  if (!symbol) {
    return c.json({ error: "Symbol is required" }, 400);
  }

  if (type !== "buy" && type !== "sell") {
    return c.json({ error: "Trade type must be buy or sell" }, 400);
  }

  if (!Number.isFinite(body.quantity) || body.quantity <= 0) {
    return c.json({ error: "Quantity must be greater than zero" }, 400);
  }

  if (!Number.isFinite(body.price) || body.price <= 0) {
    return c.json({ error: "Price must be greater than zero" }, 400);
  }

  const [trade] = await db
    .insert(tradingTrades)
    .values({
      userId,
      symbol,
      type,
      quantity: String(body.quantity),
      price: String(body.price),
      dateLabel: body.dateLabel?.trim() || "Today",
      notes: body.notes?.trim() || "Logged trade",
      pnl: body.pnl === undefined || Number.isNaN(body.pnl) ? null : String(body.pnl),
    })
    .returning();

  return c.json(trade, 201);
});

export default tradingRoute;

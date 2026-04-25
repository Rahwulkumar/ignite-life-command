import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  tradingBrokerConnections,
  tradingBrokerHoldings,
  tradingBrokerSnapshots,
  tradingBrokerTrades,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import {
  fetchGrowwHoldings,
  fetchGrowwOrders,
  fetchGrowwProfile,
  fetchGrowwQuote,
  getGrowwAccessToken,
  getGrowwConfig,
  GrowwApiError,
  type GrowwHolding,
  type GrowwOrder,
  type GrowwProfile,
  type GrowwTokenData,
} from "../services/groww.js";
import { decryptSecret, encryptSecret } from "../utils/encryption.js";
import { getUserId } from "../utils/user-context.js";

const growwRoute = new Hono();

type GrowwConnectionRow = typeof tradingBrokerConnections.$inferSelect;

function formatTradeDateLabel(value?: string): string {
  if (!value) {
    return "Today";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getSnapshotDateLabel(): string {
  return new Date().toISOString().slice(0, 10);
}

function roundToInteger(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function inferHoldingType(symbol: string): "stock" | "etf" {
  const upper = symbol.toUpperCase();

  if (
    upper.includes("ETF") ||
    upper.includes("BEES") ||
    upper.includes("GOLD") ||
    upper.includes("SILVER")
  ) {
    return "etf";
  }

  return "stock";
}

function isRetryableQuoteError(error: unknown): boolean {
  return (
    error instanceof GrowwApiError &&
    (error.code === "GA001" || error.code === "GA004")
  );
}

async function resolveCurrentPrice(accessToken: string, symbol: string) {
  try {
    const quote = await fetchGrowwQuote(accessToken, symbol, "NSE");
    return {
      exchange: "NSE",
      price: quote.last_price ?? quote.close ?? 0,
    };
  } catch (error) {
    if (!isRetryableQuoteError(error)) {
      throw error;
    }
  }

  try {
    const quote = await fetchGrowwQuote(accessToken, symbol, "BSE");
    return {
      exchange: "BSE",
      price: quote.last_price ?? quote.close ?? 0,
    };
  } catch (error) {
    if (!isRetryableQuoteError(error)) {
      throw error;
    }
  }

  return {
    exchange: null,
    price: 0,
  };
}

function mapGrowwHoldingToInsert(
  userId: string,
  connectionId: string,
  holding: GrowwHolding,
  currentPrice: number,
  exchange: string | null,
) {
  const avgCost = holding.average_price ?? 0;
  const quantity = holding.quantity ?? 0;
  const effectiveCurrentPrice = currentPrice > 0 ? currentPrice : avgCost;
  const totalCost = avgCost * quantity;
  const currentValue = effectiveCurrentPrice * quantity;
  const returns = currentValue - totalCost;
  const returnsPercent = totalCost > 0 ? (returns / totalCost) * 100 : 0;

  return {
    userId,
    connectionId,
    provider: "groww",
    externalId: holding.isin || `${exchange ?? "NA"}:${holding.trading_symbol}`,
    name: holding.trading_symbol,
    symbol: holding.trading_symbol,
    type: inferHoldingType(holding.trading_symbol),
    units: String(quantity),
    avgCost: String(avgCost),
    currentPrice: String(effectiveCurrentPrice),
    returns: String(returns),
    returnsPercent: String(returnsPercent),
    metadata: {
      ...holding,
      exchange,
    },
  };
}

function mapGrowwOrderToInsert(
  userId: string,
  connectionId: string,
  order: GrowwOrder,
) {
  const quantity = order.filled_quantity > 0 ? order.filled_quantity : order.quantity;
  const effectivePrice =
    order.average_fill_price && order.average_fill_price > 0
      ? order.average_fill_price
      : order.price;

  return {
    userId,
    connectionId,
    provider: "groww",
    externalId: `${order.segment ?? "CASH"}:${order.groww_order_id}`,
    symbol: order.trading_symbol,
    type: order.transaction_type === "SELL" ? "sell" : "buy",
    quantity: String(quantity),
    price: String(effectivePrice ?? 0),
    dateLabel: formatTradeDateLabel(order.trade_date ?? order.created_at),
    notes: `Synced from Groww${order.segment ? ` (${order.segment})` : ""}`,
    pnl: null,
    metadata: order,
  };
}

function serializeConnectionState(connection: GrowwConnectionRow | null) {
  const config = getGrowwConfig();
  const metadata =
    connection?.metadata && typeof connection.metadata === "object"
      ? (connection.metadata as Record<string, unknown>)
      : null;
  const authMode =
    (typeof metadata?.authMode === "string" ? metadata.authMode : null) ?? config.authMode;

  return {
    configured: config.configured,
    status: !config.configured
      ? "unconfigured"
      : !connection
        ? "not-linked"
        : connection.status,
    provider: "groww" as const,
    providerUserId: connection?.providerUserId ?? null,
    accountLabel: connection?.providerAccountLabel ?? null,
    lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
    connectedAt: connection?.createdAt?.toISOString() ?? null,
    tokenExpiresAt: connection?.tokenExpiresAt?.toISOString() ?? null,
    lastError: connection?.lastError ?? null,
    authMode: authMode === "unconfigured" ? null : authMode,
  };
}

async function getGrowwConnectionForUser(userId: string) {
  const [connection] = await db
    .select()
    .from(tradingBrokerConnections)
    .where(
      and(
        eq(tradingBrokerConnections.userId, userId),
        eq(tradingBrokerConnections.provider, "groww"),
      ),
    )
    .limit(1);

  return connection ?? null;
}

async function upsertGrowwConnection(
  userId: string,
  tokenData: GrowwTokenData,
  profile: GrowwProfile,
) {
  const existing = await getGrowwConnectionForUser(userId);
  const values = {
    status: "connected",
    providerUserId: profile.ucc || profile.vendor_user_id,
    providerAccountLabel: `Groww${profile.ucc ? ` (${profile.ucc})` : ""}`,
    encryptedAccessToken: encryptSecret(tokenData.accessToken),
    publicToken: tokenData.tokenRefId,
    tokenExpiresAt: tokenData.tokenExpiresAt,
    lastError: null,
    metadata: {
      authMode: tokenData.authMode,
      vendorUserId: profile.vendor_user_id,
      activeSegments: profile.active_segments,
      nseEnabled: profile.nse_enabled,
      bseEnabled: profile.bse_enabled,
      ddpiEnabled: profile.ddpi_enabled,
    },
    updatedAt: new Date(),
  };

  if (existing) {
    const [connection] = await db
      .update(tradingBrokerConnections)
      .set(values)
      .where(eq(tradingBrokerConnections.id, existing.id))
      .returning();

    return connection;
  }

  const [connection] = await db
    .insert(tradingBrokerConnections)
    .values({
      userId,
      provider: "groww",
      ...values,
    })
    .returning();

  return connection;
}

async function markConnectionFailure(
  connectionId: string,
  message: string,
  status: "expired" | "error" = "error",
) {
  await db
    .update(tradingBrokerConnections)
    .set({
      status,
      lastError: message,
      updatedAt: new Date(),
    })
    .where(eq(tradingBrokerConnections.id, connectionId));
}

async function getConnectionAccessToken(connection: GrowwConnectionRow | null) {
  try {
    return await getGrowwAccessToken();
  } catch (error) {
    if (connection?.encryptedAccessToken) {
      return {
        accessToken: decryptSecret(connection.encryptedAccessToken),
        tokenRefId: connection.publicToken ?? null,
        tokenExpiresAt: connection.tokenExpiresAt ?? null,
        authMode: "access_token" as const,
      };
    }

    throw error;
  }
}

async function syncGrowwConnection(
  connection: GrowwConnectionRow,
  accessToken: string,
) {
  const holdings = await fetchGrowwHoldings(accessToken);
  const orders = [
    ...(await fetchGrowwOrders(accessToken, "CASH")),
    ...(await fetchGrowwOrders(accessToken, "FNO")),
  ].filter((order) => order.filled_quantity > 0);

  const holdingRows: Array<ReturnType<typeof mapGrowwHoldingToInsert>> = [];

  for (const holding of holdings) {
    const currentPrice = await resolveCurrentPrice(accessToken, holding.trading_symbol);

    holdingRows.push(
      mapGrowwHoldingToInsert(
        connection.userId,
        connection.id,
        holding,
        currentPrice.price,
        currentPrice.exchange,
      ),
    );
  }

  const tradeRows = orders.map((order) =>
    mapGrowwOrderToInsert(connection.userId, connection.id, order),
  );

  const totalValue = holdingRows.reduce((sum, holding) => {
    const units = Number.parseFloat(String(holding.units));
    const currentPrice = Number.parseFloat(String(holding.currentPrice));
    return sum + units * currentPrice;
  }, 0);

  await db.transaction(async (tx) => {
    await tx
      .delete(tradingBrokerHoldings)
      .where(eq(tradingBrokerHoldings.connectionId, connection.id));

    await tx
      .delete(tradingBrokerTrades)
      .where(eq(tradingBrokerTrades.connectionId, connection.id));

    if (holdingRows.length > 0) {
      await tx.insert(tradingBrokerHoldings).values(holdingRows);
    }

    if (tradeRows.length > 0) {
      await tx.insert(tradingBrokerTrades).values(tradeRows);
    }

    await tx
      .insert(tradingBrokerSnapshots)
      .values({
        userId: connection.userId,
        connectionId: connection.id,
        provider: "groww",
        snapshotDate: getSnapshotDateLabel(),
        value: roundToInteger(totalValue),
      })
      .onConflictDoUpdate({
        target: [
          tradingBrokerSnapshots.connectionId,
          tradingBrokerSnapshots.snapshotDate,
        ],
        set: {
          value: roundToInteger(totalValue),
          updatedAt: new Date(),
        },
      });

    await tx
      .update(tradingBrokerConnections)
      .set({
        status: "connected",
        lastSyncedAt: new Date(),
        lastError: null,
        updatedAt: new Date(),
      })
      .where(eq(tradingBrokerConnections.id, connection.id));
  });

  return {
    holdingsCount: holdingRows.length,
    tradesCount: tradeRows.length,
    portfolioValue: roundToInteger(totalValue),
  };
}

growwRoute.get("/integrations/groww/connection", requireAuth, async (c) => {
  const userId = getUserId(c);
  const connection = await getGrowwConnectionForUser(userId);
  return c.json(serializeConnectionState(connection));
});

growwRoute.post("/integrations/groww/connect", requireAuth, async (c) => {
  const config = getGrowwConfig();

  if (!config.configured) {
    return c.json({ error: "Groww integration is not configured on the server." }, 503);
  }

  const userId = getUserId(c);

  try {
    const tokenData = await getGrowwAccessToken();
    const profile = await fetchGrowwProfile(tokenData.accessToken);
    const connection = await upsertGrowwConnection(userId, tokenData, profile);
    const result = await syncGrowwConnection(connection, tokenData.accessToken);

    return c.json({
      ...serializeConnectionState({
        ...connection,
        status: "connected",
        lastSyncedAt: new Date(),
        lastError: null,
      }),
      sync: result,
    });
  } catch (error) {
    const existingConnection = await getGrowwConnectionForUser(userId);
    const message =
      error instanceof Error ? error.message : "Groww connection failed.";

    if (existingConnection) {
      await markConnectionFailure(existingConnection.id, message);
    }

    const status =
      error instanceof GrowwApiError && (error.status === 401 || error.code === "GA005")
        ? 401
        : 500;

    return c.json({ error: message }, status);
  }
});

growwRoute.post("/integrations/groww/sync", requireAuth, async (c) => {
  const userId = getUserId(c);
  const existingConnection = await getGrowwConnectionForUser(userId);

  if (!existingConnection && !getGrowwConfig().configured) {
    return c.json({ error: "Configure Groww credentials before running a sync." }, 503);
  }

  if (!existingConnection && getGrowwConfig().configured) {
    return c.json({ error: "Connect Groww before running a sync." }, 404);
  }

  const connection = existingConnection as GrowwConnectionRow;

  try {
    const tokenData = await getConnectionAccessToken(connection);
    const storedToken = connection.encryptedAccessToken
      ? decryptSecret(connection.encryptedAccessToken)
      : null;

    if (tokenData.accessToken && tokenData.accessToken !== storedToken) {
      const profile = await fetchGrowwProfile(tokenData.accessToken);
      await upsertGrowwConnection(userId, tokenData, profile);
    }

    const result = await syncGrowwConnection(connection, tokenData.accessToken);
    const refreshedConnection = await getGrowwConnectionForUser(userId);

    return c.json({
      ...serializeConnectionState(refreshedConnection),
      sync: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Groww sync failed.";
    const status =
      error instanceof GrowwApiError && (error.status === 401 || error.code === "GA005")
        ? "expired"
        : "error";

    await markConnectionFailure(connection.id, message, status);

    return c.json({ error: message }, status === "expired" ? 401 : 500);
  }
});

growwRoute.delete("/integrations/groww/connection", requireAuth, async (c) => {
  const userId = getUserId(c);
  const connection = await getGrowwConnectionForUser(userId);

  if (connection) {
    await db
      .delete(tradingBrokerConnections)
      .where(eq(tradingBrokerConnections.id, connection.id));
  }

  return c.json({
    ...serializeConnectionState(null),
    status: getGrowwConfig().configured ? "not-linked" : "unconfigured",
  });
});

export default growwRoute;

import { createHmac } from "node:crypto";
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
  createKiteLoginUrl,
  exchangeKiteRequestToken,
  fetchKitePortfolio,
  fetchKiteProfile,
  getKiteConfig,
  KiteApiError,
  type KiteHolding,
  type KiteMutualFundHolding,
  type KiteSessionData,
  type KiteTrade,
} from "../services/kite.js";
import { decryptSecret, encryptSecret } from "../utils/encryption.js";
import { getUserId } from "../utils/user-context.js";

const kiteRoute = new Hono();

type KiteConnectionRow = typeof tradingBrokerConnections.$inferSelect;

interface SignedStatePayload {
  userId: string;
  returnTo: string;
  expiresAt: number;
}

function getFrontendBaseUrl(): string {
  return process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
}

function getStateSigningSecret(): string {
  const secret =
    process.env.INTEGRATION_ENCRYPTION_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "Set INTEGRATION_ENCRYPTION_SECRET or BETTER_AUTH_SECRET before using Kite integration.",
    );
  }

  return secret;
}

function signStatePayload(encodedPayload: string): string {
  return createHmac("sha256", getStateSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
}

function encodeSignedState(payload: SignedStatePayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signStatePayload(encodedPayload)}`;
}

function decodeSignedState(token: string): SignedStatePayload {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    throw new Error("Missing integration state.");
  }

  if (signStatePayload(encodedPayload) !== signature) {
    throw new Error("Invalid integration state signature.");
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as SignedStatePayload;

  if (!payload.userId || !payload.returnTo || !payload.expiresAt) {
    throw new Error("Malformed integration state.");
  }

  if (payload.expiresAt < Date.now()) {
    throw new Error("Integration state expired. Start the connection again.");
  }

  return payload;
}

function buildFrontendRedirect(
  returnTo = "/settings",
  params?: Record<string, string>,
): string {
  const url = new URL(returnTo, getFrontendBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

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

function mapKiteHoldingToInsert(
  userId: string,
  connectionId: string,
  holding: KiteHolding,
) {
  const totalCost = holding.average_price * holding.quantity;
  const returnsPercent = totalCost > 0 ? (holding.pnl / totalCost) * 100 : 0;

  return {
    userId,
    connectionId,
    provider: "kite",
    externalId: `equity:${holding.exchange}:${holding.tradingsymbol}`,
    name: holding.tradingsymbol,
    symbol: holding.tradingsymbol,
    type: "stock",
    units: String(holding.quantity),
    avgCost: String(holding.average_price ?? 0),
    currentPrice: String(holding.last_price ?? 0),
    returns: String(holding.pnl ?? 0),
    returnsPercent: String(returnsPercent),
    metadata: holding,
  };
}

function mapKiteMutualFundHoldingToInsert(
  userId: string,
  connectionId: string,
  holding: KiteMutualFundHolding,
) {
  const totalCost = holding.average_price * holding.quantity;
  const returnsPercent = totalCost > 0 ? (holding.pnl / totalCost) * 100 : 0;

  return {
    userId,
    connectionId,
    provider: "kite",
    externalId: `mf:${holding.tradingsymbol}:${holding.folio ?? "folio"}`,
    name: holding.fund,
    symbol: holding.tradingsymbol,
    type: "mutual_fund",
    units: String(holding.quantity),
    avgCost: String(holding.average_price ?? 0),
    currentPrice: String(holding.last_price ?? 0),
    returns: String(holding.pnl ?? 0),
    returnsPercent: String(returnsPercent),
    metadata: holding,
  };
}

function mapKiteTradeToInsert(
  userId: string,
  connectionId: string,
  trade: KiteTrade,
) {
  return {
    userId,
    connectionId,
    provider: "kite",
    externalId: trade.trade_id,
    symbol: trade.tradingsymbol,
    type: trade.transaction_type === "SELL" ? "sell" : "buy",
    quantity: String(trade.quantity),
    price: String(trade.average_price ?? 0),
    dateLabel: formatTradeDateLabel(trade.fill_timestamp),
    notes: `Synced from Kite${trade.product ? ` (${trade.product})` : ""}`,
    pnl: null,
    metadata: trade,
  };
}

function serializeConnectionState(connection: KiteConnectionRow | null) {
  const config = getKiteConfig();
  const status = !config.configured
    ? "unconfigured"
    : !connection
      ? "not-linked"
      : connection.status;

  return {
    configured: config.configured,
    status,
    provider: "kite",
    providerUserId: connection?.providerUserId ?? null,
    accountLabel: connection?.providerAccountLabel ?? null,
    lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
    connectedAt: connection?.createdAt?.toISOString() ?? null,
    tokenExpiresAt: connection?.tokenExpiresAt?.toISOString() ?? null,
    lastError: connection?.lastError ?? null,
  };
}

async function getKiteConnectionForUser(userId: string) {
  const [connection] = await db
    .select()
    .from(tradingBrokerConnections)
    .where(
      and(
        eq(tradingBrokerConnections.userId, userId),
        eq(tradingBrokerConnections.provider, "kite"),
      ),
    )
    .limit(1);

  return connection ?? null;
}

async function upsertKiteConnection(
  userId: string,
  sessionData: KiteSessionData,
  profile: Awaited<ReturnType<typeof fetchKiteProfile>>,
) {
  const existing = await getKiteConnectionForUser(userId);
  const values = {
    status: "connected",
    providerUserId: profile.user_id,
    providerAccountLabel: `${profile.user_name} (${profile.user_id})`,
    encryptedAccessToken: encryptSecret(sessionData.access_token),
    publicToken: sessionData.public_token ?? null,
    lastError: null,
    metadata: {
      email: profile.email,
      userName: profile.user_name,
      userShortname: profile.user_shortname,
      loginTime: sessionData.login_time ?? null,
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
      provider: "kite",
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

async function syncKiteConnection(connection: KiteConnectionRow) {
  if (!connection.encryptedAccessToken) {
    throw new Error("Kite access token is missing. Reconnect the account.");
  }

  const accessToken = decryptSecret(connection.encryptedAccessToken);
  const portfolio = await fetchKitePortfolio(accessToken);

  const holdingRows = [
    ...portfolio.holdings.map((holding) =>
      mapKiteHoldingToInsert(connection.userId, connection.id, holding),
    ),
    ...portfolio.mutualFundHoldings.map((holding) =>
      mapKiteMutualFundHoldingToInsert(connection.userId, connection.id, holding),
    ),
  ];

  const tradeRows = portfolio.trades.map((trade) =>
    mapKiteTradeToInsert(connection.userId, connection.id, trade),
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
        provider: "kite",
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

kiteRoute.get("/integrations/kite/connection", requireAuth, async (c) => {
  const userId = getUserId(c);
  const connection = await getKiteConnectionForUser(userId);
  return c.json(serializeConnectionState(connection));
});

kiteRoute.get("/integrations/kite/connect-url", requireAuth, async (c) => {
  const config = getKiteConfig();

  if (!config.configured) {
    return c.json({ error: "Kite integration is not configured on the server." }, 503);
  }

  const userId = getUserId(c);
  const stateToken = encodeSignedState({
    userId,
    returnTo: "/settings",
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  return c.json({
    loginUrl: createKiteLoginUrl(stateToken),
  });
});

kiteRoute.get("/integrations/kite/callback", async (c) => {
  const requestToken = c.req.query("request_token");
  const stateToken = c.req.query("state");

  let state: SignedStatePayload;

  try {
    if (!stateToken) {
      throw new Error("Missing integration state.");
    }

    state = decodeSignedState(stateToken);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not validate the Kite callback state.";
    return c.redirect(
      buildFrontendRedirect("/settings", {
        kite_status: "error",
        kite_message: message,
      }),
    );
  }

  if (!requestToken) {
    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        kite_status: "error",
        kite_message: "Kite did not return a request token.",
      }),
    );
  }

  try {
    const sessionData = await exchangeKiteRequestToken(requestToken);
    const profile = await fetchKiteProfile(sessionData.access_token);
    const connection = await upsertKiteConnection(state.userId, sessionData, profile);
    await syncKiteConnection(connection);

    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        kite_status: "connected",
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Kite connection failed during setup.";

    const existingConnection = await getKiteConnectionForUser(state.userId);
    if (existingConnection) {
      await markConnectionFailure(existingConnection.id, message);
    }

    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        kite_status: "error",
        kite_message: message,
      }),
    );
  }
});

kiteRoute.post("/integrations/kite/sync", requireAuth, async (c) => {
  const userId = getUserId(c);
  const connection = await getKiteConnectionForUser(userId);

  if (!connection) {
    return c.json({ error: "Connect Kite before running a sync." }, 404);
  }

  try {
    const result = await syncKiteConnection(connection);
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
    const message = error instanceof Error ? error.message : "Kite sync failed.";
    const status =
      error instanceof KiteApiError &&
      (error.status === 401 ||
        error.status === 403 ||
        error.errorType === "TokenException")
        ? "expired"
        : "error";

    await markConnectionFailure(connection.id, message, status);

    return c.json({ error: message }, status === "expired" ? 401 : 500);
  }
});

kiteRoute.delete("/integrations/kite/connection", requireAuth, async (c) => {
  const userId = getUserId(c);
  const connection = await getKiteConnectionForUser(userId);

  if (connection) {
    await db
      .delete(tradingBrokerConnections)
      .where(eq(tradingBrokerConnections.id, connection.id));
  }

  return c.json({
    ...serializeConnectionState(null),
    status: getKiteConfig().configured ? "not-linked" : "unconfigured",
  });
});

export default kiteRoute;

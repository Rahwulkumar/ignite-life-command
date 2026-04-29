import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  googleIntegrationConnections,
  investmentEmailMessages,
  investmentEmailTransactions,
  tradingBrokerConnections,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import {
  createGoogleInvestmentsLoginUrl,
  decodeGoogleSignedState,
  encodeGoogleSignedState,
  exchangeGoogleCode,
  fetchGoogleUserInfo,
  getGoogleOAuthConfig,
} from "../services/google-oauth.js";
import {
  getGoogleInvestmentConnectionForUser,
  markGoogleInvestmentConnectionFailure,
  serializeGoogleInvestmentConnection,
  syncInvestmentEmailsForUser,
} from "../services/investment-email.js";
import { encryptSecret } from "../utils/encryption.js";
import { getUserId } from "../utils/user-context.js";

const googleInvestmentsRoute = new Hono();

function getFrontendBaseUrl(): string {
  return process.env.FRONTEND_URL?.trim() || "http://localhost:5173";
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

async function upsertGoogleInvestmentConnection(
  userId: string,
  token: Awaited<ReturnType<typeof exchangeGoogleCode>>,
  profile: Awaited<ReturnType<typeof fetchGoogleUserInfo>>,
) {
  const existing = await getGoogleInvestmentConnectionForUser(userId);
  const tokenExpiresAt = token.expires_in
    ? new Date(Date.now() + token.expires_in * 1000)
    : null;
  const values = {
    status: "connected",
    email: profile.email ?? existing?.email ?? null,
    encryptedAccessToken: encryptSecret(token.access_token),
    encryptedRefreshToken: token.refresh_token
      ? encryptSecret(token.refresh_token)
      : existing?.encryptedRefreshToken ?? null,
    tokenExpiresAt,
    scope: token.scope ?? existing?.scope ?? null,
    lastError: null,
    metadata: {
      googleSubject: profile.sub ?? null,
      name: profile.name ?? null,
      picture: profile.picture ?? null,
    },
    updatedAt: new Date(),
  };

  if (existing) {
    const [connection] = await db
      .update(googleIntegrationConnections)
      .set(values)
      .where(eq(googleIntegrationConnections.id, existing.id))
      .returning();

    return connection;
  }

  const [connection] = await db
    .insert(googleIntegrationConnections)
    .values({
      userId,
      provider: "google-investments",
      ...values,
    })
    .returning();

  return connection;
}

googleInvestmentsRoute.get(
  "/integrations/google-investments/connection",
  requireAuth,
  async (c) => {
    const userId = getUserId(c);
    const connection = await getGoogleInvestmentConnectionForUser(userId);
    return c.json(serializeGoogleInvestmentConnection(connection));
  },
);

googleInvestmentsRoute.get(
  "/integrations/google-investments/connect-url",
  requireAuth,
  async (c) => {
    const config = getGoogleOAuthConfig();

    if (!config.configured) {
      return c.json({ error: "Google Gmail integration is not configured on the server." }, 503);
    }

    const userId = getUserId(c);
    const stateToken = encodeGoogleSignedState({
      userId,
      returnTo: "/settings",
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return c.json({
      loginUrl: createGoogleInvestmentsLoginUrl(stateToken),
    });
  },
);

googleInvestmentsRoute.get("/integrations/google-investments/callback", async (c) => {
  const code = c.req.query("code");
  const stateToken = c.req.query("state");

  let state: ReturnType<typeof decodeGoogleSignedState>;

  try {
    if (!stateToken) {
      throw new Error("Missing Google integration state.");
    }

    state = decodeGoogleSignedState(stateToken);
  } catch (error) {
    return c.redirect(
      buildFrontendRedirect("/settings", {
        google_status: "error",
        google_message:
          error instanceof Error ? error.message : "Could not validate Google callback.",
      }),
    );
  }

  if (!code) {
    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        google_status: "error",
        google_message: "Google did not return an authorization code.",
      }),
    );
  }

  try {
    const token = await exchangeGoogleCode(code);
    const profile = await fetchGoogleUserInfo(token.access_token);
    const connection = await upsertGoogleInvestmentConnection(state.userId, token, profile);
    const sync = await syncInvestmentEmailsForUser(state.userId);

    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        google_status: "connected",
        google_message: `${sync.transactionsExtracted} investment transactions extracted.`,
      }),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Google investment connection failed.";
    const existingConnection = await getGoogleInvestmentConnectionForUser(state.userId);

    if (existingConnection) {
      await markGoogleInvestmentConnectionFailure(existingConnection.id, message);
    }

    return c.redirect(
      buildFrontendRedirect(state.returnTo, {
        google_status: "error",
        google_message: message,
      }),
    );
  }
});

googleInvestmentsRoute.post(
  "/integrations/google-investments/sync",
  requireAuth,
  async (c) => {
    const userId = getUserId(c);
    const connection = await getGoogleInvestmentConnectionForUser(userId);

    if (!connection) {
      return c.json({ error: "Connect Gmail before syncing investment emails." }, 404);
    }

    try {
      const sync = await syncInvestmentEmailsForUser(userId);
      const refreshedConnection = await getGoogleInvestmentConnectionForUser(userId);

      return c.json({
        ...serializeGoogleInvestmentConnection(refreshedConnection),
        sync,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Investment email sync failed.";
      await markGoogleInvestmentConnectionFailure(connection.id, message);
      return c.json({ error: message }, 500);
    }
  },
);

googleInvestmentsRoute.delete(
  "/integrations/google-investments/connection",
  requireAuth,
  async (c) => {
    const userId = getUserId(c);
    const connection = await getGoogleInvestmentConnectionForUser(userId);

    await db.transaction(async (tx) => {
      await tx
        .delete(investmentEmailTransactions)
        .where(eq(investmentEmailTransactions.userId, userId));
      await tx
        .delete(investmentEmailMessages)
        .where(eq(investmentEmailMessages.userId, userId));
      await tx
        .delete(tradingBrokerConnections)
        .where(
          and(
            eq(tradingBrokerConnections.userId, userId),
            eq(tradingBrokerConnections.provider, "investment_email"),
          ),
        );

      if (connection) {
        await tx
          .delete(googleIntegrationConnections)
          .where(eq(googleIntegrationConnections.id, connection.id));
      }
    });

    return c.json({
      ...serializeGoogleInvestmentConnection(null),
      status: getGoogleOAuthConfig().configured ? "not-linked" : "unconfigured",
    });
  },
);

export default googleInvestmentsRoute;

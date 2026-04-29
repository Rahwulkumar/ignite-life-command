import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  googleIntegrationConnections,
  investmentEmailMessages,
  investmentEmailTransactions,
  mutualFundNavs,
  tradingBrokerConnections,
  tradingBrokerHoldings,
  tradingBrokerSnapshots,
} from "../db/schema.js";
import { fetchLatestAmfiNavs, type AmfiNavRecord } from "./amfi.js";
import {
  extractAttachmentMetadata,
  extractMessageText,
  fetchGmailMessage,
  getDefaultInvestmentGmailQueries,
  getHeader,
  listGmailMessages,
  type GmailAttachmentMeta,
  type GmailMessage,
} from "./gmail.js";
import { refreshGoogleAccessToken } from "./google-oauth.js";
import { decryptSecret, encryptSecret } from "../utils/encryption.js";

type GoogleConnectionRow = typeof googleIntegrationConnections.$inferSelect;
type NavRow = typeof mutualFundNavs.$inferSelect;
type InvestmentEmailTransactionRow = typeof investmentEmailTransactions.$inferSelect;

interface ExtractedInvestmentTransaction {
  source: string;
  externalId: string;
  schemeName: string;
  isin: string | null;
  folio: string | null;
  transactionType: string;
  amount: number | null;
  units: number | null;
  nav: number | null;
  transactionDate: string | null;
  confidence: number;
  raw: Record<string, unknown>;
}

export interface InvestmentEmailSyncResult {
  messagesMatched: number;
  messagesProcessed: number;
  transactionsExtracted: number;
  attachmentOnlyMessages: number;
  holdingsUpdated: number;
  navRowsUpdated: number;
  navError: string | null;
}

const EMAIL_PROVIDER = "investment_email";
const MAX_DEFAULT_MESSAGES = 150;

function getSnapshotDateLabel(): string {
  return new Date().toISOString().slice(0, 10);
}

function roundToInteger(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/direct plan|regular plan|growth|idcw|dividend|option|plan/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseCurrency(text: string): number | null {
  const labelled = text.match(
    /(?:amount|investment|order value|sip amount|purchase amount|redemption amount)[^\d]*(?:rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i,
  );
  const fallback = text.match(/(?:rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/i);
  return parseNumber(labelled?.[1] ?? fallback?.[1]);
}

function parseUnits(text: string): number | null {
  const labelled = text.match(
    /(?:units(?: allotted| purchased| redeemed)?|unit balance)[^\d]*([\d,]+(?:\.\d+)?)/i,
  );
  const fallback = text.match(/([\d,]+(?:\.\d+)?)\s+units/i);
  return parseNumber(labelled?.[1] ?? fallback?.[1]);
}

function parseNav(text: string): number | null {
  const match = text.match(/(?:nav|price)[^\d]*(?:rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)/i);
  return parseNumber(match?.[1]);
}

function parseIsin(text: string): string | null {
  const match = text.match(/\bIN[A-Z0-9]{10}\b/i);
  return match?.[0]?.toUpperCase() ?? null;
}

function parseFolio(text: string): string | null {
  const match = text.match(/folio(?:\s*(?:no|number|#))?\s*[:\-]?\s*([A-Z0-9/-]{4,32})/i);
  return match?.[1] ?? null;
}

function parseTransactionDate(text: string, fallback: Date | null): string | null {
  const datePatterns = [
    /\b(\d{1,2}[-/]\d{1,2}[-/]\d{4})\b/,
    /\b(\d{1,2}[-\s][A-Za-z]{3}[-\s]\d{4})\b/,
    /\b([A-Za-z]{3}\s+\d{1,2},\s+\d{4})\b/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;

    const parsed = new Date(match[1].replace(/-/g, " "));
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return fallback ? fallback.toISOString().slice(0, 10) : null;
}

function inferTransactionType(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes("switch out")) return "switch_out";
  if (lower.includes("switch in")) return "switch_in";
  if (lower.includes("redeem") || lower.includes("redemption") || lower.includes("sell")) {
    return "redeem";
  }
  if (lower.includes("sip")) return "sip";
  if (lower.includes("purchase") || lower.includes("buy") || lower.includes("allotted")) {
    return "purchase";
  }

  return "investment_activity";
}

function inferSource(fromAddress: string | null, subject: string | null, text: string): string {
  const haystack = `${fromAddress ?? ""} ${subject ?? ""} ${text.slice(0, 500)}`.toLowerCase();

  if (haystack.includes("groww")) return "groww_email";
  if (haystack.includes("camsonline") || haystack.includes("cams")) return "cams_cas";
  if (haystack.includes("kfintech") || haystack.includes("karvy")) return "kfintech_cas";
  if (haystack.includes("mfcentral")) return "mfcentral_cas";
  if (haystack.includes("cdsl")) return "cdsl_cas";
  if (haystack.includes("nsdl")) return "nsdl_cas";

  return "investment_email";
}

function classifyMessage(
  fromAddress: string | null,
  subject: string | null,
  text: string,
  attachments: GmailAttachmentMeta[],
) {
  const source = inferSource(fromAddress, subject, text);
  const haystack = `${fromAddress ?? ""} ${subject ?? ""} ${text.slice(0, 1000)}`.toLowerCase();
  const hasPdf = attachments.some((attachment) =>
    attachment.filename.toLowerCase().endsWith(".pdf"),
  );

  if (
    hasPdf &&
    (haystack.includes("cas") ||
      haystack.includes("consolidated account statement") ||
      haystack.includes("account statement"))
  ) {
    return { classification: source, status: "attachment_queued" };
  }

  if (
    haystack.includes("mutual fund") ||
    haystack.includes("sip") ||
    haystack.includes("folio") ||
    haystack.includes("nav") ||
    source !== "investment_email"
  ) {
    return { classification: source, status: "parsed" };
  }

  return { classification: "unknown", status: "ignored" };
}

function stripSchemeNoise(value: string): string {
  return value
    .replace(/\s+(?:for|on|has|is|was|successfully|successful).*$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseSchemeName(subject: string | null, text: string): string | null {
  const candidates = [
    text.match(
      /(?:scheme|fund)(?:\s*name)?\s*[:\-]\s*([A-Za-z0-9][A-Za-z0-9 .&'()/-]{8,140})/i,
    )?.[1],
    subject?.match(/\b(?:in|for)\s+([A-Za-z0-9][A-Za-z0-9 .&'()/-]{8,140}(?:Fund|ETF|Plan|Growth)[A-Za-z0-9 .&'()/-]*)/i)?.[1],
    text.match(/\b([A-Za-z][A-Za-z0-9 .&'()/-]{8,140}(?:Fund|ETF|Plan|Growth)[A-Za-z0-9 .&'()/-]*)/i)?.[1],
  ].filter((value): value is string => Boolean(value?.trim()));

  return candidates.length > 0 ? stripSchemeNoise(candidates[0]) : null;
}

function buildExternalId(messageId: string, transaction: Omit<ExtractedInvestmentTransaction, "externalId">) {
  return [
    transaction.source,
    messageId,
    transaction.isin ?? normalizeName(transaction.schemeName),
    transaction.folio ?? "folio",
    transaction.transactionDate ?? "date",
    transaction.transactionType,
    transaction.amount ?? "amount",
    transaction.units ?? "units",
  ].join(":");
}

function extractTransactionFromMessage(
  message: GmailMessage,
  fromAddress: string | null,
  subject: string | null,
  text: string,
  receivedAt: Date | null,
  attachments: GmailAttachmentMeta[],
): ExtractedInvestmentTransaction | null {
  const source = inferSource(fromAddress, subject, text);
  const schemeName = parseSchemeName(subject, text);
  const isin = parseIsin(text);
  const amount = parseCurrency(text);
  const units = parseUnits(text);
  const nav = parseNav(text);
  const transactionType = inferTransactionType(`${subject ?? ""} ${text}`);
  const folio = parseFolio(text);
  const transactionDate = parseTransactionDate(text, receivedAt);
  const confidence =
    (schemeName || isin ? 35 : 0) +
    (amount ? 20 : 0) +
    (units ? 20 : 0) +
    (nav ? 10 : 0) +
    (folio ? 10 : 0) +
    (source !== "investment_email" ? 5 : 0);

  if ((!schemeName && !isin) || (!amount && !units && !nav)) {
    return null;
  }

  const base = {
    source,
    schemeName: schemeName ?? isin ?? "Unknown mutual fund",
    isin,
    folio,
    transactionType,
    amount,
    units,
    nav,
    transactionDate,
    confidence: Math.min(confidence, 100),
    raw: {
      subject,
      fromAddress,
      snippet: message.snippet ?? null,
      attachments,
    },
  };

  return {
    ...base,
    externalId: buildExternalId(message.id, base),
  };
}

function getReceivedAt(message: GmailMessage, dateHeader: string | null): Date | null {
  if (message.internalDate) {
    const parsed = new Date(Number(message.internalDate));
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (dateHeader) {
    const parsed = new Date(dateHeader);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

export function serializeGoogleInvestmentConnection(connection: GoogleConnectionRow | null) {
  const configured = Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );

  return {
    configured,
    status: !configured ? "unconfigured" : !connection ? "not-linked" : connection.status,
    provider: "google-investments" as const,
    email: connection?.email ?? null,
    scope: connection?.scope ?? null,
    lastSyncedAt: connection?.lastSyncedAt?.toISOString() ?? null,
    connectedAt: connection?.createdAt?.toISOString() ?? null,
    tokenExpiresAt: connection?.tokenExpiresAt?.toISOString() ?? null,
    lastError: connection?.lastError ?? null,
    metadata: connection?.metadata ?? {},
  };
}

export async function getGoogleInvestmentConnectionForUser(userId: string) {
  const [connection] = await db
    .select()
    .from(googleIntegrationConnections)
    .where(
      and(
        eq(googleIntegrationConnections.userId, userId),
        eq(googleIntegrationConnections.provider, "google-investments"),
      ),
    )
    .limit(1);

  return connection ?? null;
}

export async function getValidGoogleAccessToken(connection: GoogleConnectionRow) {
  if (
    connection.encryptedAccessToken &&
    connection.tokenExpiresAt &&
    connection.tokenExpiresAt.getTime() > Date.now() + 120_000
  ) {
    return decryptSecret(connection.encryptedAccessToken);
  }

  if (!connection.encryptedRefreshToken) {
    throw new Error("Google refresh token is missing. Reconnect Gmail.");
  }

  const token = await refreshGoogleAccessToken(decryptSecret(connection.encryptedRefreshToken));
  const tokenExpiresAt = token.expires_in
    ? new Date(Date.now() + token.expires_in * 1000)
    : null;

  await db
    .update(googleIntegrationConnections)
    .set({
      encryptedAccessToken: encryptSecret(token.access_token),
      tokenExpiresAt,
      scope: token.scope ?? connection.scope,
      status: "connected",
      lastError: null,
      updatedAt: new Date(),
    })
    .where(eq(googleIntegrationConnections.id, connection.id));

  return token.access_token;
}

async function upsertAmfiNavRows(rows: AmfiNavRecord[]) {
  const deduped = [...new Map(rows.map((row) => [row.schemeCode, row])).values()];
  const chunkSize = 500;

  for (let index = 0; index < deduped.length; index += chunkSize) {
    const chunk = deduped.slice(index, index + chunkSize);

    await db
      .insert(mutualFundNavs)
      .values(
        chunk.map((row) => ({
          schemeCode: row.schemeCode,
          schemeName: row.schemeName,
          isinGrowth: row.isinGrowth,
          isinDividend: row.isinDividend,
          nav: String(row.nav),
          navDate: row.navDate,
          source: "amfi",
          updatedAt: new Date(),
        })),
      )
      .onConflictDoUpdate({
        target: mutualFundNavs.schemeCode,
        set: {
          schemeName: sql`excluded.scheme_name`,
          isinGrowth: sql`excluded.isin_growth`,
          isinDividend: sql`excluded.isin_dividend`,
          nav: sql`excluded.nav`,
          navDate: sql`excluded.nav_date`,
          source: "amfi",
          updatedAt: new Date(),
        },
      });
  }
}

export async function syncLatestAmfiNavs() {
  if (process.env.AMFI_NAV_SYNC_ENABLED?.trim() === "false") {
    return 0;
  }

  const rows = await fetchLatestAmfiNavs();
  await upsertAmfiNavRows(rows);
  return rows.length;
}

async function getOrCreateEmailBrokerConnection(userId: string) {
  const [existing] = await db
    .select()
    .from(tradingBrokerConnections)
    .where(
      and(
        eq(tradingBrokerConnections.userId, userId),
        eq(tradingBrokerConnections.provider, EMAIL_PROVIDER),
      ),
    )
    .limit(1);

  if (existing) {
    const [connection] = await db
      .update(tradingBrokerConnections)
      .set({
        status: "connected",
        providerAccountLabel: "Investment emails and CAS",
        lastError: null,
        updatedAt: new Date(),
      })
      .where(eq(tradingBrokerConnections.id, existing.id))
      .returning();

    return connection;
  }

  const [connection] = await db
    .insert(tradingBrokerConnections)
    .values({
      userId,
      provider: EMAIL_PROVIDER,
      status: "connected",
      providerAccountLabel: "Investment emails and CAS",
      metadata: {
        source: "gmail",
        description: "Holdings reconstructed from Groww/CAS/RTA investment emails.",
      },
    })
    .returning();

  return connection;
}

function findLatestNav(
  navRows: NavRow[],
  transaction: InvestmentEmailTransactionRow,
): NavRow | null {
  const isin = transaction.isin?.toUpperCase();

  if (isin) {
    const byIsin = navRows.find(
      (row) =>
        row.isinGrowth?.toUpperCase() === isin ||
        row.isinDividend?.toUpperCase() === isin,
    );

    if (byIsin) return byIsin;
  }

  const normalizedScheme = normalizeName(transaction.schemeName);
  if (!normalizedScheme) return null;

  return (
    navRows.find((row) => normalizeName(row.schemeName) === normalizedScheme) ??
    navRows.find((row) => {
      const normalizedNavName = normalizeName(row.schemeName);
      return (
        normalizedNavName.includes(normalizedScheme) ||
        normalizedScheme.includes(normalizedNavName)
      );
    }) ??
    null
  );
}

function getSignedUnits(transaction: InvestmentEmailTransactionRow): number {
  const units = toNumber(transaction.units);
  const type = transaction.transactionType.toLowerCase();

  if (type === "redeem" || type === "sell" || type === "switch_out") {
    return -Math.abs(units);
  }

  return Math.abs(units);
}

async function rebuildEmailDerivedHoldings(userId: string) {
  const [transactions, navRows] = await Promise.all([
    db
      .select()
      .from(investmentEmailTransactions)
      .where(eq(investmentEmailTransactions.userId, userId))
      .orderBy(asc(investmentEmailTransactions.transactionDate)),
    db.select().from(mutualFundNavs),
  ]);

  const holdings = new Map<
    string,
    {
      schemeName: string;
      isin: string | null;
      folio: string | null;
      units: number;
      invested: number;
      currentPrice: number;
      sources: string[];
    }
  >();

  for (const transaction of transactions) {
    const signedUnits = getSignedUnits(transaction);
    const amount = toNumber(transaction.amount);
    const nav = toNumber(transaction.nav);

    if (!signedUnits) continue;

    const key = [
      transaction.isin ?? normalizeName(transaction.schemeName),
      transaction.folio ?? "folio",
    ].join(":");
    const existing =
      holdings.get(key) ??
      {
        schemeName: transaction.schemeName,
        isin: transaction.isin,
        folio: transaction.folio,
        units: 0,
        invested: 0,
        currentPrice: 0,
        sources: [],
      };

    const averageBefore = existing.units > 0 ? existing.invested / existing.units : nav;
    existing.units += signedUnits;

    if (signedUnits > 0) {
      existing.invested += amount > 0 ? amount : signedUnits * nav;
    } else {
      existing.invested = Math.max(0, existing.invested - Math.abs(signedUnits) * averageBefore);
    }

    const latestNav = findLatestNav(navRows, transaction);
    existing.currentPrice = latestNav ? toNumber(latestNav.nav) : nav || averageBefore || 0;
    existing.sources.push(transaction.source);
    holdings.set(key, existing);
  }

  const connection = await getOrCreateEmailBrokerConnection(userId);
  const holdingRows = [...holdings.values()]
    .filter((holding) => holding.units > 0)
    .map((holding) => {
      const avgCost = holding.units > 0 ? holding.invested / holding.units : 0;
      const currentValue = holding.units * holding.currentPrice;
      const returns = currentValue - holding.invested;
      const returnsPercent = holding.invested > 0 ? (returns / holding.invested) * 100 : 0;
      const externalId = [
        "mf",
        holding.isin ?? normalizeName(holding.schemeName),
        holding.folio ?? "folio",
      ].join(":");

      return {
        userId,
        connectionId: connection.id,
        provider: EMAIL_PROVIDER,
        externalId,
        name: holding.schemeName,
        symbol: holding.isin ?? holding.schemeName,
        type: "mutual_fund",
        units: String(holding.units),
        avgCost: String(avgCost),
        currentPrice: String(holding.currentPrice || avgCost),
        returns: String(returns),
        returnsPercent: String(returnsPercent),
        metadata: {
          folio: holding.folio,
          isin: holding.isin,
          sources: [...new Set(holding.sources)],
          source: "gmail_investment_emails",
        },
      };
    });

  const totalValue = holdingRows.reduce(
    (sum, holding) => sum + toNumber(holding.units) * toNumber(holding.currentPrice),
    0,
  );

  await db.transaction(async (tx) => {
    await tx
      .delete(tradingBrokerHoldings)
      .where(eq(tradingBrokerHoldings.connectionId, connection.id));

    if (holdingRows.length > 0) {
      await tx.insert(tradingBrokerHoldings).values(holdingRows);
    }

    await tx
      .insert(tradingBrokerSnapshots)
      .values({
        userId,
        connectionId: connection.id,
        provider: EMAIL_PROVIDER,
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

  return holdingRows.length;
}

async function upsertMessageAndTransaction(
  userId: string,
  connection: GoogleConnectionRow,
  message: GmailMessage,
  transaction: ExtractedInvestmentTransaction | null,
  options: {
    fromAddress: string | null;
    subject: string | null;
    snippet: string | null;
    receivedAt: Date | null;
    classification: string;
    status: string;
    extracted: Record<string, unknown>;
  },
) {
  const [messageRow] = await db
    .insert(investmentEmailMessages)
    .values({
      userId,
      connectionId: connection.id,
      provider: "gmail",
      messageId: message.id,
      threadId: message.threadId ?? null,
      fromAddress: options.fromAddress,
      subject: options.subject,
      snippet: options.snippet,
      receivedAt: options.receivedAt,
      classification: options.classification,
      status: options.status,
      extracted: options.extracted,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [investmentEmailMessages.userId, investmentEmailMessages.messageId],
      set: {
        connectionId: connection.id,
        threadId: message.threadId ?? null,
        fromAddress: options.fromAddress,
        subject: options.subject,
        snippet: options.snippet,
        receivedAt: options.receivedAt,
        classification: options.classification,
        status: options.status,
        extracted: options.extracted,
        error: null,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (!transaction) {
    return { transactionInserted: false };
  }

  await db
    .insert(investmentEmailTransactions)
    .values({
      userId,
      emailMessageId: messageRow.id,
      source: transaction.source,
      externalId: transaction.externalId,
      schemeName: transaction.schemeName,
      isin: transaction.isin,
      folio: transaction.folio,
      transactionType: transaction.transactionType,
      amount: transaction.amount == null ? null : String(transaction.amount),
      units: transaction.units == null ? null : String(transaction.units),
      nav: transaction.nav == null ? null : String(transaction.nav),
      transactionDate: transaction.transactionDate,
      confidence: String(transaction.confidence),
      raw: transaction.raw,
      updatedAt: new Date(),
    })
    .onConflictDoNothing();

  return { transactionInserted: true };
}

async function collectCandidateMessageIds(accessToken: string) {
  const maxMessages = Number.parseInt(
    process.env.GMAIL_INVESTMENT_MAX_MESSAGES?.trim() || String(MAX_DEFAULT_MESSAGES),
    10,
  );
  const messages = new Map<string, { id: string; threadId?: string }>();

  for (const query of getDefaultInvestmentGmailQueries()) {
    const matches = await listGmailMessages(accessToken, query, maxMessages);

    for (const match of matches) {
      messages.set(match.id, match);
    }
  }

  return [...messages.values()];
}

export async function syncInvestmentEmailsForUser(userId: string): Promise<InvestmentEmailSyncResult> {
  const connection = await getGoogleInvestmentConnectionForUser(userId);

  if (!connection) {
    throw new Error("Connect Gmail before syncing investment emails.");
  }

  const accessToken = await getValidGoogleAccessToken(connection);
  const candidateMessages = await collectCandidateMessageIds(accessToken);

  let navRowsUpdated = 0;
  let navError: string | null = null;

  try {
    navRowsUpdated = await syncLatestAmfiNavs();
  } catch (error) {
    navError = error instanceof Error ? error.message : "AMFI NAV sync failed.";
  }

  let messagesProcessed = 0;
  let transactionsExtracted = 0;
  let attachmentOnlyMessages = 0;

  for (const candidate of candidateMessages) {
    try {
      const message = await fetchGmailMessage(accessToken, candidate.id);
      const fromAddress = getHeader(message, "From");
      const subject = getHeader(message, "Subject");
      const dateHeader = getHeader(message, "Date");
      const receivedAt = getReceivedAt(message, dateHeader);
      const text = extractMessageText(message);
      const attachments = extractAttachmentMetadata(message);
      const { classification, status } = classifyMessage(
        fromAddress,
        subject,
        text,
        attachments,
      );
      const transaction =
        status === "ignored"
          ? null
          : extractTransactionFromMessage(
              message,
              fromAddress,
              subject,
              text,
              receivedAt,
              attachments,
            );

      const finalStatus = transaction
        ? "transaction_extracted"
        : status === "attachment_queued"
          ? "attachment_queued"
          : status === "ignored"
            ? "ignored"
            : "no_transaction_found";

      if (finalStatus === "attachment_queued") {
        attachmentOnlyMessages += 1;
      }

      const result = await upsertMessageAndTransaction(userId, connection, message, transaction, {
        fromAddress,
        subject,
        snippet: message.snippet ?? null,
        receivedAt,
        classification,
        status: finalStatus,
        extracted: {
          textPreview: text.slice(0, 1000),
          attachments,
          transaction,
        },
      });

      if (result.transactionInserted) {
        transactionsExtracted += 1;
      }

      messagesProcessed += 1;
    } catch (error) {
      await db
        .insert(investmentEmailMessages)
        .values({
          userId,
          connectionId: connection.id,
          provider: "gmail",
          messageId: candidate.id,
          threadId: candidate.threadId ?? null,
          classification: "unknown",
          status: "error",
          error: error instanceof Error ? error.message : "Message processing failed.",
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [investmentEmailMessages.userId, investmentEmailMessages.messageId],
          set: {
            status: "error",
            error: error instanceof Error ? error.message : "Message processing failed.",
            updatedAt: new Date(),
          },
        });
    }
  }

  const holdingsUpdated = await rebuildEmailDerivedHoldings(userId);

  await db
    .update(googleIntegrationConnections)
    .set({
      status: "connected",
      lastSyncedAt: new Date(),
      lastError: navError,
      updatedAt: new Date(),
      metadata: {
        lastResult: {
          messagesMatched: candidateMessages.length,
          messagesProcessed,
          transactionsExtracted,
          attachmentOnlyMessages,
          holdingsUpdated,
          navRowsUpdated,
          navError,
        },
      },
    })
    .where(eq(googleIntegrationConnections.id, connection.id));

  return {
    messagesMatched: candidateMessages.length,
    messagesProcessed,
    transactionsExtracted,
    attachmentOnlyMessages,
    holdingsUpdated,
    navRowsUpdated,
    navError,
  };
}

export async function markGoogleInvestmentConnectionFailure(
  connectionId: string,
  message: string,
  status: "expired" | "error" = "error",
) {
  await db
    .update(googleIntegrationConnections)
    .set({
      status,
      lastError: message,
      updatedAt: new Date(),
    })
    .where(eq(googleIntegrationConnections.id, connectionId));
}

export async function runDueInvestmentEmailSyncs() {
  if (process.env.INVESTMENT_EMAIL_AUTO_SYNC_ENABLED?.trim() === "false") {
    return;
  }

  const intervalHours = Number.parseInt(
    process.env.INVESTMENT_EMAIL_AUTO_SYNC_INTERVAL_HOURS?.trim() || "6",
    10,
  );
  const minLastSync = Date.now() - Math.max(1, intervalHours) * 60 * 60 * 1000;
  const connections = await db
    .select()
    .from(googleIntegrationConnections)
    .where(eq(googleIntegrationConnections.provider, "google-investments"));

  for (const connection of connections) {
    if (connection.status !== "connected") continue;
    if (connection.lastSyncedAt && connection.lastSyncedAt.getTime() > minLastSync) continue;

    try {
      await syncInvestmentEmailsForUser(connection.userId);
    } catch (error) {
      await markGoogleInvestmentConnectionFailure(
        connection.id,
        error instanceof Error ? error.message : "Investment email auto-sync failed.",
      );
    }
  }
}

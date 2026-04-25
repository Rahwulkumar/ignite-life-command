import { createHash } from "node:crypto";

const KITE_API_BASE_URL = "https://api.kite.trade";
const KITE_LOGIN_BASE_URL = "https://kite.zerodha.com/connect/login";

interface KiteEnvelope<T> {
  status: string;
  data: T;
  error_type?: string;
  message?: string;
}

export interface KiteSessionData {
  user_id: string;
  user_name: string;
  user_shortname: string;
  email: string;
  api_key: string;
  access_token: string;
  public_token?: string;
  login_time?: string;
}

export interface KiteProfile {
  user_id: string;
  user_name: string;
  user_shortname: string;
  email: string;
}

export interface KiteHolding {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
}

export interface KiteMutualFundHolding {
  folio: string | null;
  fund: string;
  tradingsymbol: string;
  average_price: number;
  last_price: number;
  pnl: number;
  quantity: number;
}

export interface KiteTrade {
  trade_id: string;
  tradingsymbol: string;
  transaction_type: "BUY" | "SELL";
  quantity: number;
  average_price: number;
  fill_timestamp?: string;
  exchange?: string;
  product?: string;
}

export class KiteApiError extends Error {
  status: number;
  errorType?: string;

  constructor(message: string, status: number, errorType?: string) {
    super(message);
    this.name = "KiteApiError";
    this.status = status;
    this.errorType = errorType;
  }
}

export function getKiteConfig() {
  const apiKey = process.env.KITE_API_KEY?.trim() ?? "";
  const apiSecret = process.env.KITE_API_SECRET?.trim() ?? "";
  const redirectUri = process.env.KITE_REDIRECT_URI?.trim() ?? "";

  return {
    apiKey,
    apiSecret,
    redirectUri,
    configured: Boolean(apiKey && apiSecret && redirectUri),
  };
}

export function createKiteLoginUrl(stateToken: string): string {
  const config = getKiteConfig();

  if (!config.configured) {
    throw new Error("Kite integration is not configured on the server.");
  }

  const url = new URL(KITE_LOGIN_BASE_URL);
  url.searchParams.set("v", "3");
  url.searchParams.set("api_key", config.apiKey);
  url.searchParams.set("redirect_params", new URLSearchParams({ state: stateToken }).toString());
  return url.toString();
}

function createChecksum(requestToken: string): string {
  const config = getKiteConfig();

  if (!config.configured) {
    throw new Error("Kite integration is not configured on the server.");
  }

  return createHash("sha256")
    .update(`${config.apiKey}${requestToken}${config.apiSecret}`)
    .digest("hex");
}

function getKiteHeaders(accessToken?: string): HeadersInit {
  const config = getKiteConfig();

  if (!config.apiKey) {
    throw new Error("Kite integration is not configured on the server.");
  }

  return {
    "X-Kite-Version": "3",
    ...(accessToken
      ? {
          Authorization: `token ${config.apiKey}:${accessToken}`,
        }
      : {}),
  };
}

async function parseKiteResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<KiteEnvelope<T>> {
  const payload = (await response.json().catch(() => null)) as KiteEnvelope<T> | null;

  if (!response.ok || !payload || payload.status !== "success") {
    const message = payload?.message ?? fallbackMessage;
    throw new KiteApiError(message, response.status, payload?.error_type);
  }

  return payload;
}

async function kiteGet<T>(path: string, accessToken: string): Promise<T> {
  const response = await fetch(`${KITE_API_BASE_URL}${path}`, {
    headers: getKiteHeaders(accessToken),
  });

  const payload = await parseKiteResponse<T>(
    response,
    `Kite API request to ${path} failed.`,
  );

  return payload.data;
}

export async function exchangeKiteRequestToken(
  requestToken: string,
): Promise<KiteSessionData> {
  const config = getKiteConfig();

  if (!config.configured) {
    throw new Error("Kite integration is not configured on the server.");
  }

  const body = new URLSearchParams({
    api_key: config.apiKey,
    request_token: requestToken,
    checksum: createChecksum(requestToken),
  });

  const response = await fetch(`${KITE_API_BASE_URL}/session/token`, {
    method: "POST",
    headers: {
      ...getKiteHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = await parseKiteResponse<KiteSessionData>(
    response,
    "Kite token exchange failed.",
  );

  return payload.data;
}

export async function fetchKiteProfile(accessToken: string): Promise<KiteProfile> {
  return kiteGet<KiteProfile>("/user/profile", accessToken);
}

export async function fetchKitePortfolio(accessToken: string) {
  const [holdings, mutualFundHoldings, trades] = await Promise.all([
    kiteGet<KiteHolding[]>("/portfolio/holdings", accessToken),
    kiteGet<KiteMutualFundHolding[]>("/mf/holdings", accessToken),
    kiteGet<KiteTrade[]>("/trades", accessToken),
  ]);

  return {
    holdings,
    mutualFundHoldings,
    trades,
  };
}

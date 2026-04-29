import { createHash } from "node:crypto";

const GROWW_API_BASE_URL = "https://api.groww.in/v1";

type GrowwAuthMode = "unconfigured" | "access_token" | "api_key";

interface GrowwApiSuccess<T> {
  status: "SUCCESS";
  payload: T;
}

interface GrowwApiFailure {
  status: "FAILURE";
  error?: {
    code?: string;
    message?: string;
    metadata?: unknown;
  };
}

type GrowwApiResponse<T> = GrowwApiSuccess<T> | GrowwApiFailure;

export interface GrowwConfig {
  configured: boolean;
  authMode: GrowwAuthMode;
}

export interface GrowwTokenData {
  accessToken: string;
  tokenRefId: string | null;
  tokenExpiresAt: Date | null;
  authMode: Exclude<GrowwAuthMode, "unconfigured">;
}

export interface GrowwProfile {
  vendor_user_id: string;
  ucc: string;
  nse_enabled: boolean;
  bse_enabled: boolean;
  ddpi_enabled: boolean;
  active_segments: string[];
}

export interface GrowwHolding {
  isin?: string;
  trading_symbol: string;
  quantity: number;
  average_price: number;
  pledge_quantity?: number;
  demat_locked_quantity?: number;
  groww_locked_quantity?: number;
  repledge_quantity?: number;
  t1_quantity?: number;
  demat_free_quantity?: number;
  corporate_action_additional_quantity?: number;
  active_demat_transfer_quantity?: number;
}

export interface GrowwOrder {
  groww_order_id: string;
  trading_symbol: string;
  order_status: string;
  remark?: string;
  quantity: number;
  price: number;
  trigger_price?: number;
  filled_quantity: number;
  remaining_quantity?: number;
  average_fill_price?: number;
  deliverable_quantity?: number;
  amo_status?: string;
  validity?: string;
  exchange?: string;
  order_type?: string;
  transaction_type?: string;
  segment?: string;
  product?: string;
  created_at?: string;
  exchange_time?: string;
  trade_date?: string;
  order_reference_id?: string;
}

interface GrowwQuote {
  last_price?: number;
  close?: number;
}

interface GrowwTokenResponse {
  token: string;
  tokenRefId?: string;
  expiry?: string;
}

interface GrowwDirectTokenResponse {
  token?: string;
  tokenRefId?: string;
  expiry?: string;
}

export class GrowwApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, options?: { status?: number; code?: string }) {
    super(message);
    this.name = "GrowwApiError";
    this.status = options?.status ?? 500;
    this.code = options?.code;
  }
}

export function getGrowwConfig(): GrowwConfig {
  if (process.env.GROWW_ACCESS_TOKEN?.trim()) {
    return {
      configured: true,
      authMode: "access_token",
    };
  }

  if (process.env.GROWW_API_KEY?.trim() && process.env.GROWW_API_SECRET?.trim()) {
    return {
      configured: true,
      authMode: "api_key",
    };
  }

  return {
    configured: false,
    authMode: "unconfigured",
  };
}

function buildGrowwUrl(
  path: string,
  query?: Record<string, string | number | undefined | null>,
): URL {
  const url = new URL(path, `${GROWW_API_BASE_URL}/`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function parseGrowwResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as GrowwApiResponse<T> | null;
  const failure = data && data.status === "FAILURE" ? data.error : null;

  if (!response.ok || !data || data.status === "FAILURE") {
    const message =
      failure?.message ||
      `Groww request failed with status ${response.status}.`;

    throw new GrowwApiError(message, {
      status: response.status,
      code: failure?.code,
    });
  }

  return data.payload;
}

async function growwGet<T>(
  path: string,
  accessToken: string,
  query?: Record<string, string | number | undefined | null>,
): Promise<T> {
  const response = await fetch(buildGrowwUrl(path, query), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-API-VERSION": "1.0",
    },
  });

  return parseGrowwResponse<T>(response);
}

function getNextDailyExpiry(): Date | null {
  const now = new Date();
  const expiry = new Date(now);
  expiry.setHours(6, 0, 0, 0);

  if (expiry <= now) {
    expiry.setDate(expiry.getDate() + 1);
  }

  return expiry;
}

export async function getGrowwAccessToken(): Promise<GrowwTokenData> {
  const directAccessToken = process.env.GROWW_ACCESS_TOKEN?.trim();

  if (directAccessToken) {
    return {
      accessToken: directAccessToken,
      tokenRefId: null,
      tokenExpiresAt: getNextDailyExpiry(),
      authMode: "access_token",
    };
  }

  const apiKey = process.env.GROWW_API_KEY?.trim();
  const apiSecret = process.env.GROWW_API_SECRET?.trim();

  if (!apiKey || !apiSecret) {
    throw new Error(
      "Set GROWW_ACCESS_TOKEN or GROWW_API_KEY + GROWW_API_SECRET before using Groww integration.",
    );
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const checksum = createHash("sha256")
    .update(`${apiSecret}${timestamp}`)
    .digest("hex");

  const response = await fetch(buildGrowwUrl("token/api/access"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key_type: "approval",
      checksum,
      timestamp,
    }),
  });

  const raw = (await response.json().catch(() => null)) as
    | GrowwApiResponse<GrowwTokenResponse>
    | GrowwDirectTokenResponse
    | null;

  if (!response.ok || !raw) {
    throw new GrowwApiError(`Groww request failed with status ${response.status}.`, {
      status: response.status,
    });
  }

  let payload: GrowwTokenResponse | GrowwDirectTokenResponse;

  if ("status" in raw) {
    if (raw.status === "FAILURE") {
      throw new GrowwApiError(
        raw.error?.message || `Groww request failed with status ${response.status}.`,
        {
          status: response.status,
          code: raw.error?.code,
        },
      );
    }

    payload = raw.payload;
  } else {
    payload = raw;
  }

  if (!payload?.token) {
    throw new GrowwApiError("Groww token response did not include an access token.", {
      status: response.status,
    });
  }

  return {
    accessToken: payload.token,
    tokenRefId: payload.tokenRefId ?? null,
    tokenExpiresAt: payload.expiry ? new Date(payload.expiry) : getNextDailyExpiry(),
    authMode: "api_key",
  };
}

export async function fetchGrowwProfile(accessToken: string): Promise<GrowwProfile> {
  return growwGet<GrowwProfile>("user/detail", accessToken);
}

export async function fetchGrowwHoldings(accessToken: string): Promise<GrowwHolding[]> {
  const payload = await growwGet<{ holdings?: GrowwHolding[] }>("holdings/user", accessToken);
  return payload.holdings ?? [];
}

export async function fetchGrowwOrders(
  accessToken: string,
  segment: "CASH" | "FNO",
): Promise<GrowwOrder[]> {
  const payload = await growwGet<{ order_list?: GrowwOrder[] }>("order/list", accessToken, {
    segment,
    page: 0,
    page_size: 100,
  });

  return payload.order_list ?? [];
}

export async function fetchGrowwQuote(
  accessToken: string,
  symbol: string,
  exchange: "NSE" | "BSE",
): Promise<GrowwQuote> {
  return growwGet<GrowwQuote>("live-data/quote", accessToken, {
    exchange,
    segment: "CASH",
    trading_symbol: symbol,
  });
}

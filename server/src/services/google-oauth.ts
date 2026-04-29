import { createHmac } from "node:crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
}

export interface GoogleUserInfo {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
}

export interface GoogleSignedStatePayload {
  userId: string;
  returnTo: string;
  expiresAt: number;
}

export function getGoogleOAuthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3001"}/api/integrations/google-investments/callback`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    configured: Boolean(clientId && clientSecret && redirectUri),
  };
}

function getStateSigningSecret(): string {
  const secret =
    process.env.INTEGRATION_ENCRYPTION_SECRET?.trim() ||
    process.env.BETTER_AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "Set INTEGRATION_ENCRYPTION_SECRET or BETTER_AUTH_SECRET before using Google integration.",
    );
  }

  return secret;
}

function signStatePayload(encodedPayload: string): string {
  return createHmac("sha256", getStateSigningSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function encodeGoogleSignedState(payload: GoogleSignedStatePayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encodedPayload}.${signStatePayload(encodedPayload)}`;
}

export function decodeGoogleSignedState(token: string): GoogleSignedStatePayload {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    throw new Error("Missing Google integration state.");
  }

  if (signStatePayload(encodedPayload) !== signature) {
    throw new Error("Invalid Google integration state signature.");
  }

  const payload = JSON.parse(
    Buffer.from(encodedPayload, "base64url").toString("utf8"),
  ) as GoogleSignedStatePayload;

  if (!payload.userId || !payload.returnTo || !payload.expiresAt) {
    throw new Error("Malformed Google integration state.");
  }

  if (payload.expiresAt < Date.now()) {
    throw new Error("Google integration state expired. Start the connection again.");
  }

  return payload;
}

export function createGoogleInvestmentsLoginUrl(stateToken: string): string {
  const config = getGoogleOAuthConfig();

  if (!config.configured) {
    throw new Error("Google Gmail integration is not configured on the server.");
  }

  const url = new URL(GOOGLE_AUTH_URL);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set(
    "scope",
    [
      "openid",
      "email",
      "profile",
      "https://www.googleapis.com/auth/gmail.readonly",
    ].join(" "),
  );
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", stateToken);

  return url.toString();
}

async function postGoogleTokenRequest(body: URLSearchParams): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const payload = (await response.json().catch(() => null)) as
    | (GoogleTokenResponse & { error?: string; error_description?: string })
    | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(
      payload?.error_description ||
        payload?.error ||
        `Google token request failed with status ${response.status}.`,
    );
  }

  return payload;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleTokenResponse> {
  const config = getGoogleOAuthConfig();

  if (!config.configured) {
    throw new Error("Google Gmail integration is not configured on the server.");
  }

  return postGoogleTokenRequest(
    new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
  );
}

export async function refreshGoogleAccessToken(
  refreshToken: string,
): Promise<GoogleTokenResponse> {
  const config = getGoogleOAuthConfig();

  if (!config.configured) {
    throw new Error("Google Gmail integration is not configured on the server.");
  }

  return postGoogleTokenRequest(
    new URLSearchParams({
      refresh_token: refreshToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "refresh_token",
    }),
  );
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Google profile request failed with status ${response.status}.`);
  }

  return response.json() as Promise<GoogleUserInfo>;
}

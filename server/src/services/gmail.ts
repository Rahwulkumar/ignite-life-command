const GMAIL_API_BASE_URL = "https://gmail.googleapis.com/gmail/v1/users/me";

export interface GmailMessageListItem {
  id: string;
  threadId?: string;
}

interface GmailListResponse {
  messages?: GmailMessageListItem[];
  nextPageToken?: string;
}

interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessagePartBody {
  data?: string;
  attachmentId?: string;
  size?: number;
}

export interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: GmailHeader[];
  body?: GmailMessagePartBody;
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: GmailMessagePart;
}

export interface GmailAttachmentMeta {
  filename: string;
  mimeType: string;
  attachmentId: string;
  size: number;
}

function buildGmailUrl(path: string, query?: Record<string, string | number | undefined>) {
  const url = new URL(`${GMAIL_API_BASE_URL}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

async function gmailGet<T>(
  accessToken: string,
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const response = await fetch(buildGmailUrl(path, query), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | (T & { error?: { message?: string } })
    | null;

  if (!response.ok || !payload) {
    throw new Error(
      payload?.error?.message || `Gmail request to ${path} failed with status ${response.status}.`,
    );
  }

  return payload;
}

export async function listGmailMessages(
  accessToken: string,
  query: string,
  maxMessages: number,
): Promise<GmailMessageListItem[]> {
  const messages: GmailMessageListItem[] = [];
  let pageToken: string | undefined;

  while (messages.length < maxMessages) {
    const response = await gmailGet<GmailListResponse>(accessToken, "/messages", {
      q: query,
      maxResults: Math.min(100, maxMessages - messages.length),
      pageToken,
    });

    messages.push(...(response.messages ?? []));

    if (!response.nextPageToken) {
      break;
    }

    pageToken = response.nextPageToken;
  }

  return messages;
}

export function getDefaultInvestmentGmailQueries(): string[] {
  const configured = process.env.GMAIL_INVESTMENT_QUERIES?.trim();

  if (configured) {
    return configured
      .split("\n")
      .flatMap((line) => line.split("|"))
      .map((query) => query.trim())
      .filter(Boolean);
  }

  const recency = process.env.GMAIL_INVESTMENT_RECENCY?.trim() || "newer_than:365d";

  return [
    `from:groww.in ${recency}`,
    `from:camsonline.com ${recency}`,
    `from:kfintech.com ${recency}`,
    `from:mfcentral.com ${recency}`,
    `from:cdslindia.com ${recency}`,
    `from:nsdl.co.in ${recency}`,
    `subject:"Consolidated Account Statement" ${recency}`,
    `subject:CAS ${recency}`,
    `subject:"mutual fund" ${recency}`,
    `subject:SIP ${recency}`,
  ];
}

export async function fetchGmailMessage(
  accessToken: string,
  messageId: string,
): Promise<GmailMessage> {
  return gmailGet<GmailMessage>(accessToken, `/messages/${messageId}`, {
    format: "full",
  });
}

export function getHeader(message: GmailMessage, name: string): string | null {
  const header = message.payload?.headers?.find(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );
  return header?.value ?? null;
}

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function collectTextFromPart(part: GmailMessagePart | undefined, output: string[]) {
  if (!part) return;

  const mimeType = part.mimeType?.toLowerCase() ?? "";
  const data = part.body?.data;

  if (data && (mimeType.includes("text/plain") || mimeType.includes("text/html"))) {
    output.push(decodeBase64Url(data).replace(/<[^>]+>/g, " "));
  }

  for (const child of part.parts ?? []) {
    collectTextFromPart(child, output);
  }
}

export function extractMessageText(message: GmailMessage): string {
  const chunks: string[] = [];
  collectTextFromPart(message.payload, chunks);
  return chunks.join("\n").replace(/\s+/g, " ").trim();
}

function collectAttachmentsFromPart(
  part: GmailMessagePart | undefined,
  output: GmailAttachmentMeta[],
) {
  if (!part) return;

  if (part.filename && part.body?.attachmentId) {
    output.push({
      filename: part.filename,
      mimeType: part.mimeType ?? "application/octet-stream",
      attachmentId: part.body.attachmentId,
      size: part.body.size ?? 0,
    });
  }

  for (const child of part.parts ?? []) {
    collectAttachmentsFromPart(child, output);
  }
}

export function extractAttachmentMetadata(message: GmailMessage): GmailAttachmentMeta[] {
  const attachments: GmailAttachmentMeta[] = [];
  collectAttachmentsFromPart(message.payload, attachments);
  return attachments;
}

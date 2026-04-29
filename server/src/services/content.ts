import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { contentFolders, contentItems } from "../db/schema.js";

export type ContentItemType =
  | "video"
  | "reel"
  | "article"
  | "post"
  | "podcast"
  | "resource";

export type ContentCaptureSource = "telegram" | "manual";

export interface SaveSharedContentInput {
  userId: string;
  rawText: string;
  captureSource: ContentCaptureSource;
  sourceType?: string | null;
  messageDate?: number;
  explicitTitle?: string | null;
  explicitUrl?: string | null;
  explicitFolderName?: string | null;
  explicitSource?: string | null;
  explicitType?: ContentItemType | null;
}

export interface SavedContentRecord {
  id: string;
  title: string;
  source: string;
  type: ContentItemType;
  folderId: string | null;
  folderName: string | null;
  summary: string | null;
  url: string;
  wasDuplicate: boolean;
}

export interface SaveSharedContentResult {
  savedItems: SavedContentRecord[];
  duplicateItems: SavedContentRecord[];
}

interface UrlMetadata {
  finalUrl: string | null;
  title: string | null;
  description: string | null;
  siteName: string | null;
  ogType: string | null;
}

interface ClassifiedContentCandidate {
  normalizedUrl: string;
  source: string;
  type: ContentItemType;
  folderName: string;
  title: string;
  summary: string | null;
  confidence: number;
  classifier: "heuristic" | "gemini";
  metadata: Record<string, unknown>;
}

interface GeminiContentPayload {
  title: string;
  source: string;
  type: ContentItemType;
  folderName: string;
  summary: string;
  confidence: number;
}

const URL_PATTERN = /\bhttps?:\/\/[^\s<>()]+/gi;
const SUPPORTED_TYPES: ContentItemType[] = [
  "video",
  "reel",
  "article",
  "post",
  "podcast",
  "resource",
];
const CONTENT_FOLDERS = {
  Learning: "bg-tech",
  Entertainment: "bg-music",
  Inspiration: "bg-spiritual",
  Tech: "bg-tech",
  Trading: "bg-trading",
  Spiritual: "bg-spiritual",
  Music: "bg-music",
  Design: "bg-content",
  Productivity: "bg-finance",
  Reference: "bg-muted-foreground",
  "Watch Later": "bg-muted-foreground",
} as const;
const CONTENT_FOLDER_NAMES = Object.keys(CONTENT_FOLDERS) as Array<keyof typeof CONTENT_FOLDERS>;
const CONTENT_GEMINI_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: ["title", "source", "type", "folderName", "summary", "confidence"],
  properties: {
    title: {
      type: "string",
      description: "Short, human-readable title for the saved content.",
    },
    source: {
      type: "string",
      description: "The platform or site name, such as YouTube, Instagram, or Medium.",
    },
    type: {
      type: "string",
      enum: SUPPORTED_TYPES,
      description: "Normalized content type.",
    },
    folderName: {
      type: "string",
      enum: CONTENT_FOLDER_NAMES,
      description: "Best folder/category for the content item.",
    },
    summary: {
      type: "string",
      description: "One concise sentence explaining what the content appears to be.",
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "Confidence score for the classification.",
    },
  },
};

const LEGACY_SEED_FOLDERS = [
  { name: "Learning", itemCount: 34, color: "bg-tech" },
  { name: "Entertainment", itemCount: 45, color: "bg-music" },
  { name: "Inspiration", itemCount: 28, color: "bg-spiritual" },
  { name: "Tech Tutorials", itemCount: 21, color: "bg-trading" },
  { name: "Music Theory", itemCount: 15, color: "bg-music" },
  { name: "Design Inspo", itemCount: 32, color: "bg-content" },
  { name: "Productivity", itemCount: 18, color: "bg-finance" },
  { name: "Watch Later", itemCount: 67, color: "bg-muted-foreground" },
] as const;

const LEGACY_SEED_ITEMS = [
  {
    title: "React Server Components Deep Dive",
    source: "YouTube",
    type: "video",
    dateLabel: "Today",
    url: "#",
  },
  {
    title: "Minimalist Desk Setup Inspo",
    source: "Instagram",
    type: "reel",
    dateLabel: "Yesterday",
    url: "#",
  },
  {
    title: "System Design Interview Prep",
    source: "YouTube",
    type: "video",
    dateLabel: "Dec 27",
    url: "#",
  },
  {
    title: "Morning Routine for Productivity",
    source: "Instagram",
    type: "reel",
    dateLabel: "Dec 26",
    url: "#",
  },
  {
    title: "Advanced TypeScript Patterns",
    source: "Medium",
    type: "article",
    dateLabel: "Dec 25",
    url: "#",
  },
] as const;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripKnownSiteSuffix(title: string): string {
  return title
    .replace(/\s*[-|•]\s*(YouTube|Instagram|TikTok|Medium|Dev\.to|Substack|X|Twitter)$/i, "")
    .replace(/\s*[-|•]\s*Watch.*$/i, "")
    .trim();
}

function formatDateLabel(timestampSeconds?: number): string {
  const target = new Date((timestampSeconds ?? Math.floor(Date.now() / 1000)) * 1000);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  if (targetDay.getTime() === today.getTime()) {
    return "Today";
  }

  if (targetDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return target.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function extractUrls(text: string, explicitUrl?: string | null): string[] {
  const rawMatches = text.match(URL_PATTERN) ?? [];
  const candidates = explicitUrl?.trim() ? [explicitUrl.trim(), ...rawMatches] : rawMatches;
  return unique(
    candidates
      .map((value) => value.trim().replace(/[),.;!?]+$/g, ""))
      .filter((value) => /^https?:\/\//i.test(value)),
  );
}

function stripUrls(text: string): string {
  return normalizeWhitespace(text.replace(URL_PATTERN, " "));
}

function normalizeUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";

    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "si",
      "feature",
      "fbclid",
      "gclid",
      "igsh",
      "igshid",
    ]) {
      parsed.searchParams.delete(key);
    }

    const host = parsed.hostname.toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
      }
    }

    if (host.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
      }
    }

    if (parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }

    const search = parsed.searchParams.toString();
    parsed.search = search ? `?${search}` : "";
    return parsed.toString();
  } catch {
    return rawUrl.trim();
  }
}

function inferSource(rawUrl: string): string {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();

    if (host.includes("youtube.com") || host === "youtu.be") return "YouTube";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("tiktok.com")) return "TikTok";
    if (host.includes("medium.com")) return "Medium";
    if (host.includes("dev.to")) return "Dev.to";
    if (host.includes("substack.com")) return "Substack";
    if (host.includes("x.com") || host.includes("twitter.com")) return "X";
    if (host.includes("reddit.com")) return "Reddit";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("spotify.com")) return "Spotify";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("notion.so") || host.includes("notion.site")) return "Notion";
    if (host.startsWith("docs.")) return "Docs";

    return host.replace(/^www\./, "").split(".")[0]?.replace(/^\w/, (char) => char.toUpperCase()) || "Website";
  } catch {
    return "Website";
  }
}

function inferType(rawUrl: string, contextText: string): ContentItemType {
  const normalized = rawUrl.toLowerCase();
  const combined = `${normalized} ${contextText.toLowerCase()}`;

  if (
    normalized.includes("youtube.com") ||
    normalized.includes("youtu.be") ||
    normalized.includes("vimeo.com")
  ) {
    return "video";
  }

  if (
    normalized.includes("instagram.com/reel") ||
    normalized.includes("instagram.com/p/") ||
    normalized.includes("tiktok.com")
  ) {
    return "reel";
  }

  if (normalized.includes("spotify.com/episode") || normalized.includes("podcast")) {
    return "podcast";
  }

  if (
    normalized.includes("medium.com") ||
    normalized.includes("dev.to") ||
    normalized.includes("substack.com") ||
    combined.includes("article")
  ) {
    return "article";
  }

  if (
    normalized.includes("twitter.com") ||
    normalized.includes("x.com") ||
    normalized.includes("linkedin.com/posts") ||
    normalized.includes("reddit.com")
  ) {
    return "post";
  }

  return "resource";
}

function buildFallbackTitle(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const lastSegment = parsed.pathname
      .split("/")
      .filter(Boolean)
      .pop();

    if (!lastSegment) {
      return inferSource(rawUrl);
    }

    return decodeURIComponent(lastSegment)
      .replace(/[-_]+/g, " ")
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return "Saved Link";
  }
}

function inferFolderName(title: string, type: ContentItemType, source: string, contextText: string): string {
  const haystack = `${title} ${source} ${contextText}`.toLowerCase();

  if (/\b(react|typescript|javascript|node|programming|code|coding|system design|backend|frontend|ai|llm|openai|github)\b/.test(haystack)) {
    return "Tech";
  }

  if (/\b(trading|stocks|options|market|investing|crypto|forex|chart)\b/.test(haystack)) {
    return "Trading";
  }

  if (/\b(prayer|bible|jesus|sermon|scripture|christian|church|faith|devotional)\b/.test(haystack)) {
    return "Spiritual";
  }

  if (/\b(guitar|piano|music|songwriting|production|singing|mixing|drums)\b/.test(haystack)) {
    return "Music";
  }

  if (/\b(design|ui|ux|figma|branding|typography|visual)\b/.test(haystack)) {
    return "Design";
  }

  if (/\b(productivity|focus|discipline|habit|routine|planning|workflow)\b/.test(haystack)) {
    return "Productivity";
  }

  if (/\b(motivation|inspiration|mindset|self improvement|growth|life advice)\b/.test(haystack)) {
    return "Inspiration";
  }

  if (/\b(fun|funny|meme|comedy|movie|trailer|highlight|entertainment)\b/.test(haystack)) {
    return "Entertainment";
  }

  if (type === "article" || type === "resource" || source === "GitHub" || source === "Docs") {
    return "Learning";
  }

  if (type === "podcast") {
    return "Learning";
  }

  if (type === "video" || type === "reel" || type === "post") {
    return "Watch Later";
  }

  return "Reference";
}

function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim() || null;
}

function supportsGeminiClassification(): boolean {
  return Boolean(getGeminiApiKey());
}

function extractMetaContent(html: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) {
      return decodeHtmlEntities(normalizeWhitespace(match[1]));
    }
  }

  return null;
}

async function fetchUrlMetadata(rawUrl: string): Promise<UrlMetadata> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(rawUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    const finalUrl = response.url || null;
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.toLowerCase().includes("text/html")) {
      return {
        finalUrl,
        title: null,
        description: null,
        siteName: null,
        ogType: null,
      };
    }

    const html = await response.text();
    const trimmedHtml = html.slice(0, 120_000);

    const title =
      extractMetaContent(trimmedHtml, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"]+)["'][^>]*>/i,
        /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"]+)["'][^>]*>/i,
        /<title[^>]*>([^<]+)<\/title>/i,
      ]) ?? null;

    const description =
      extractMetaContent(trimmedHtml, [
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"]+)["'][^>]*>/i,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"]+)["'][^>]*>/i,
      ]) ?? null;

    const siteName =
      extractMetaContent(trimmedHtml, [
        /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"]+)["'][^>]*>/i,
      ]) ?? null;

    const ogType =
      extractMetaContent(trimmedHtml, [
        /<meta[^>]+property=["']og:type["'][^>]+content=["']([^"]+)["'][^>]*>/i,
      ]) ?? null;

    return {
      finalUrl,
      title: title ? stripKnownSiteSuffix(title) : null,
      description,
      siteName,
      ogType,
    };
  } catch {
    return {
      finalUrl: null,
      title: null,
      description: null,
      siteName: null,
      ogType: null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function classifyWithGemini(
  contextText: string,
  heuristic: ClassifiedContentCandidate,
): Promise<GeminiContentPayload | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const prompt = [
    "You classify content links shared into a personal knowledge system called LifeOS.",
    `Allowed content types: ${SUPPORTED_TYPES.join(", ")}`,
    `Allowed folder names: ${CONTENT_FOLDER_NAMES.join(", ")}`,
    "Prefer stable, practical folders rather than inventing new ones.",
    "Keep the summary to one concise sentence.",
    "",
    `Original message: ${contextText || "(url only)"}`,
    `URL: ${heuristic.normalizedUrl}`,
    `Heuristic source: ${heuristic.source}`,
    `Heuristic type: ${heuristic.type}`,
    `Heuristic folder: ${heuristic.folderName}`,
    `Detected title: ${heuristic.title}`,
    `Detected summary: ${heuristic.summary ?? "(none)"}`,
  ].join("\n");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model,
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseJsonSchema: CONTENT_GEMINI_SCHEMA,
          },
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const jsonText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) {
      return null;
    }

    const parsed = JSON.parse(jsonText) as Partial<GeminiContentPayload>;
    if (
      typeof parsed.title !== "string" ||
      typeof parsed.source !== "string" ||
      typeof parsed.type !== "string" ||
      typeof parsed.folderName !== "string" ||
      typeof parsed.summary !== "string" ||
      typeof parsed.confidence !== "number"
    ) {
      return null;
    }

    if (!SUPPORTED_TYPES.includes(parsed.type as ContentItemType)) {
      return null;
    }

    if (!CONTENT_FOLDER_NAMES.includes(parsed.folderName as keyof typeof CONTENT_FOLDERS)) {
      return null;
    }

    return {
      title: normalizeWhitespace(parsed.title),
      source: normalizeWhitespace(parsed.source),
      type: parsed.type as ContentItemType,
      folderName: parsed.folderName,
      summary: normalizeWhitespace(parsed.summary),
      confidence: Math.min(Math.max(parsed.confidence, 0), 1),
    };
  } catch {
    return null;
  }
}

async function classifyContentCandidate(
  rawUrl: string,
  contextText: string,
  explicitTitle?: string | null,
  explicitFolderName?: string | null,
  explicitSource?: string | null,
  explicitType?: ContentItemType | null,
): Promise<ClassifiedContentCandidate> {
  const normalizedUrl = normalizeUrl(rawUrl);
  const metadata = await fetchUrlMetadata(normalizedUrl);
  const finalUrl = metadata.finalUrl ? normalizeUrl(metadata.finalUrl) : normalizedUrl;
  const cleanContext = stripUrls(contextText);
  const source = explicitSource?.trim() || metadata.siteName || inferSource(finalUrl);
  const type = explicitType || inferType(finalUrl, `${cleanContext} ${metadata.ogType ?? ""}`);
  const title =
    explicitTitle?.trim() ||
    metadata.title ||
    (cleanContext && cleanContext.length <= 100 ? cleanContext : null) ||
    buildFallbackTitle(finalUrl);
  const summary =
    metadata.description ||
    (cleanContext && cleanContext.toLowerCase() !== title.toLowerCase() ? cleanContext : null);
  const folderName =
    explicitFolderName?.trim() ||
    inferFolderName(title, type, source, `${cleanContext} ${summary ?? ""}`);

  const heuristic: ClassifiedContentCandidate = {
    normalizedUrl: finalUrl,
    source,
    type,
    folderName,
    title,
    summary,
    confidence: 0.66,
    classifier: "heuristic",
    metadata: {
      finalUrl: metadata.finalUrl,
      description: metadata.description,
      siteName: metadata.siteName,
      ogType: metadata.ogType,
    },
  };

  if (!supportsGeminiClassification()) {
    return heuristic;
  }

  const gemini = await classifyWithGemini(contextText, heuristic);
  if (!gemini) {
    return heuristic;
  }

  return {
    ...heuristic,
    source: gemini.source || heuristic.source,
    type: gemini.type,
    folderName: gemini.folderName,
    title: gemini.title || heuristic.title,
    summary: gemini.summary || heuristic.summary,
    confidence: gemini.confidence,
    classifier: "gemini",
  };
}

async function getOrCreateFolder(userId: string, folderName: string) {
  const normalizedName = normalizeWhitespace(folderName);
  const existing = await db
    .select()
    .from(contentFolders)
    .where(and(eq(contentFolders.userId, userId), eq(contentFolders.name, normalizedName)))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const [folder] = await db
    .insert(contentFolders)
    .values({
      userId,
      name: normalizedName,
      color: CONTENT_FOLDERS[normalizedName as keyof typeof CONTENT_FOLDERS] ?? "bg-content",
      itemCount: 0,
    })
    .returning();

  return folder;
}

function isLegacySeedFolder(row: typeof contentFolders.$inferSelect): boolean {
  return LEGACY_SEED_FOLDERS.some(
    (seed) =>
      row.name === seed.name &&
      row.itemCount === seed.itemCount &&
      row.color === seed.color,
  );
}

function isLegacySeedItem(row: typeof contentItems.$inferSelect): boolean {
  return LEGACY_SEED_ITEMS.some(
    (seed) =>
      row.title === seed.title &&
      row.source === seed.source &&
      row.type === seed.type &&
      row.dateLabel === seed.dateLabel &&
      row.url === seed.url,
  );
}

export async function cleanupLegacySeedContent(userId: string) {
  const [folders, items] = await Promise.all([
    db.select().from(contentFolders).where(eq(contentFolders.userId, userId)),
    db.select().from(contentItems).where(eq(contentItems.userId, userId)),
  ]);

  const seedFolderIds = folders.filter(isLegacySeedFolder).map((folder) => folder.id);
  const seedItemIds = items.filter(isLegacySeedItem).map((item) => item.id);
  const referencedFolderIds = new Set(
    items
      .filter((item) => !seedItemIds.includes(item.id))
      .map((item) => item.folderId)
      .filter((folderId): folderId is string => typeof folderId === "string" && folderId.length > 0),
  );

  if (seedItemIds.length > 0) {
    for (const itemId of seedItemIds) {
      await db.delete(contentItems).where(eq(contentItems.id, itemId));
    }
  }

  if (seedFolderIds.length > 0) {
    for (const folderId of seedFolderIds) {
      if (referencedFolderIds.has(folderId)) {
        continue;
      }
      await db.delete(contentFolders).where(eq(contentFolders.id, folderId));
    }
  }
}

export async function saveSharedContent(
  input: SaveSharedContentInput,
): Promise<SaveSharedContentResult> {
  await cleanupLegacySeedContent(input.userId);

  const urls = extractUrls(input.rawText, input.explicitUrl);
  if (urls.length === 0) {
    return {
      savedItems: [],
      duplicateItems: [],
    };
  }

  const savedItems: SavedContentRecord[] = [];
  const duplicateItems: SavedContentRecord[] = [];

  for (const rawUrl of urls) {
    const classified = await classifyContentCandidate(
      rawUrl,
      input.rawText,
      input.explicitTitle,
      input.explicitFolderName,
      input.explicitSource,
      input.explicitType,
    );

    const folder = await getOrCreateFolder(input.userId, classified.folderName);
    const [existing] = await db
      .select()
      .from(contentItems)
      .where(
        and(
          eq(contentItems.userId, input.userId),
          eq(contentItems.url, classified.normalizedUrl),
        ),
      )
      .limit(1);

    const metadata = {
      ...classified.metadata,
      captureSource: input.captureSource,
      sourceType: input.sourceType ?? null,
      classifier: classified.classifier,
      confidence: classified.confidence,
      rawText: input.rawText,
    };

    if (existing) {
      const [updated] = await db
        .update(contentItems)
        .set({
          folderId: folder.id,
          title: classified.title,
          source: classified.source,
          type: classified.type,
          summary: classified.summary,
          metadata,
          updatedAt: new Date(),
        })
        .where(eq(contentItems.id, existing.id))
        .returning();

      duplicateItems.push({
        id: updated.id,
        title: updated.title,
        source: updated.source,
        type: updated.type as ContentItemType,
        folderId: updated.folderId ?? null,
        folderName: folder.name,
        summary: updated.summary ?? null,
        url: updated.url,
        wasDuplicate: true,
      });
      continue;
    }

    const [created] = await db
      .insert(contentItems)
      .values({
        userId: input.userId,
        folderId: folder.id,
        title: classified.title,
        source: classified.source,
        type: classified.type,
        summary: classified.summary,
        dateLabel: formatDateLabel(input.messageDate),
        url: classified.normalizedUrl,
        metadata,
      })
      .returning();

    savedItems.push({
      id: created.id,
      title: created.title,
      source: created.source,
      type: created.type as ContentItemType,
      folderId: created.folderId ?? null,
      folderName: folder.name,
      summary: created.summary ?? null,
      url: created.url,
      wasDuplicate: false,
    });
  }

  return {
    savedItems,
    duplicateItems,
  };
}

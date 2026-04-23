import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  bibleReadingPlans,
  dailyChecklistEntries,
  officeNotes,
} from "../db/schema.js";

export type CaptureSourceType = "text" | "voice";
export type CaptureTaskId = "prayer" | "bible" | "trading" | "gym";
export type CaptureIntentType =
  | "complete_task"
  | "update_bible"
  | "journal_entry"
  | "multi_action"
  | "unknown";
export type CaptureParserSource = "command" | "deterministic" | "gemini" | "fallback";

export interface BibleProgress {
  book: string;
  chapter: number;
  verse: number;
}

interface CapturePlan {
  intentType: CaptureIntentType;
  completedTaskIds: CaptureTaskId[];
  bibleProgress: BibleProgress | null;
  createJournal: boolean;
  journalDomain: string;
  journalTitle: string;
  parserSource: CaptureParserSource;
  confidence: number;
  summary: string;
  commandName: string | null;
}

type CommandParseResult =
  | { status: "none" }
  | {
      status: "invalid";
      replyText: string;
      parsedIntent: Record<string, unknown>;
    }
  | {
      status: "ready";
      plan: CapturePlan;
    };

export interface CaptureApplicationResult {
  parsedIntent: Record<string, unknown>;
  replyText: string;
}

interface GeminiIntentPayload {
  intentType: CaptureIntentType;
  completedTaskIds: CaptureTaskId[];
  bibleProgress: BibleProgress | null;
  shouldCreateJournal: boolean;
  journalTitle: string;
  confidence: number;
  summary: string;
}

const HIGH_CONFIDENCE_THRESHOLD = 0.84;
const GEMINI_CONFIDENCE_THRESHOLD = 0.62;
const COMPLETION_SIGNAL_PATTERNS = [
  /\bdone\b/i,
  /\bfinished\b/i,
  /\bcompleted\b/i,
  /\bcomplete\b/i,
  /\bwrapped up\b/i,
  /\bchecked off\b/i,
  /\blogged\b/i,
  /\bgot through\b/i,
  /\bmarked\b/i,
];

const TASK_METADATA: Record<
  CaptureTaskId,
  {
    label: string;
    domain: string;
    patterns: RegExp[];
  }
> = {
  prayer: {
    label: "Prayer",
    domain: "spiritual",
    patterns: [/\bprayer\b/i, /\bprayed\b/i, /\bquiet time\b/i],
  },
  bible: {
    label: "Bible Reading",
    domain: "spiritual",
    patterns: [/\bbible\b/i, /\bscripture\b/i, /\bdevotional\b/i],
  },
  trading: {
    label: "Trading/Charts",
    domain: "trading",
    patterns: [
      /\btrading\b/i,
      /\bcharting\b/i,
      /\bcharts\b/i,
      /\bmarket review\b/i,
      /\btrades?\b/i,
    ],
  },
  gym: {
    label: "Gym",
    domain: "projects",
    patterns: [
      /\bgym\b/i,
      /\bworkout\b/i,
      /\btraining\b/i,
      /\bexercise\b/i,
      /\blifting\b/i,
      /\blifted\b/i,
    ],
  },
};

const TASK_IDS = Object.keys(TASK_METADATA) as CaptureTaskId[];
const INTENT_TYPES = new Set<CaptureIntentType>([
  "complete_task",
  "update_bible",
  "journal_entry",
  "multi_action",
  "unknown",
]);

const CANONICAL_BIBLE_BOOKS = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
] as const;

const BIBLE_BOOK_ALIASES: Record<string, string> = CANONICAL_BIBLE_BOOKS.reduce<
  Record<string, string>
>((accumulator, book) => {
  accumulator[book.toLowerCase()] = book;
  return accumulator;
}, {});

Object.assign(BIBLE_BOOK_ALIASES, {
  gen: "Genesis",
  ex: "Exodus",
  lev: "Leviticus",
  num: "Numbers",
  deut: "Deuteronomy",
  josh: "Joshua",
  judg: "Judges",
  psalm: "Psalms",
  ps: "Psalms",
  prov: "Proverbs",
  ecc: "Ecclesiastes",
  song: "Song of Solomon",
  isa: "Isaiah",
  jer: "Jeremiah",
  lam: "Lamentations",
  ezek: "Ezekiel",
  dan: "Daniel",
  hos: "Hosea",
  zech: "Zechariah",
  matt: "Matthew",
  mk: "Mark",
  lk: "Luke",
  jn: "John",
  rom: "Romans",
  "1 cor": "1 Corinthians",
  "2 cor": "2 Corinthians",
  phil: "Philippians",
  col: "Colossians",
  "1 thess": "1 Thessalonians",
  "2 thess": "2 Thessalonians",
  "1 tim": "1 Timothy",
  "2 tim": "2 Timothy",
  phlm: "Philemon",
  heb: "Hebrews",
  jas: "James",
  "1 pet": "1 Peter",
  "2 pet": "2 Peter",
  "1 jn": "1 John",
  "2 jn": "2 John",
  "3 jn": "3 John",
  rev: "Revelation",
});

const BIBLE_ALIAS_KEYS = Object.keys(BIBLE_BOOK_ALIASES).sort(
  (left, right) => right.length - left.length,
);

const GEMINI_CAPTURE_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  required: [
    "intentType",
    "completedTaskIds",
    "bibleProgress",
    "shouldCreateJournal",
    "journalTitle",
    "confidence",
    "summary",
  ],
  properties: {
    intentType: {
      type: "string",
      enum: ["complete_task", "update_bible", "journal_entry", "multi_action", "unknown"],
      description: "The main action the Telegram message should produce inside LifeOS.",
    },
    completedTaskIds: {
      type: "array",
      description: "Checklist task IDs that should be marked complete for today.",
      items: {
        type: "string",
        enum: TASK_IDS,
      },
    },
    bibleProgress: {
      type: ["object", "null"],
      description: "The Bible progress update if the user mentioned a specific chapter or verse.",
      additionalProperties: false,
      required: ["book", "chapter", "verse"],
      properties: {
        book: {
          type: "string",
          description: "Canonical Bible book name like Genesis, John, or Romans.",
        },
        chapter: {
          type: "integer",
          minimum: 1,
          description: "Bible chapter number.",
        },
        verse: {
          type: "integer",
          minimum: 1,
          description: "Bible verse number. Use 1 when no verse is stated.",
        },
      },
    },
    shouldCreateJournal: {
      type: "boolean",
      description: "Whether the message should also be saved as a journal-style note.",
    },
    journalTitle: {
      type: ["string", "null"],
      description: "Short title to use for the journal entry if one should be created.",
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "Confidence score for the interpretation.",
    },
    summary: {
      type: "string",
      description: "Short explanation of the interpretation for audit logs.",
    },
  },
};

export const TELEGRAM_BOT_COMMANDS = [
  { command: "link", description: "Connect this Telegram chat to LifeOS" },
  { command: "done", description: "Mark a task done: gym, prayer, bible, trading" },
  { command: "bible", description: "Update Bible progress, e.g. /bible John 3:16" },
  { command: "journal", description: "Save a reflection or note to LifeOS" },
  { command: "help", description: "Show Telegram capture examples" },
] as const;

export function telegramCommandHelpText(botUrl?: string | null): string {
  const lines = [
    "LifeOS Telegram commands:",
    "/done gym",
    "/done prayer",
    "/bible Genesis 12",
    "/journal Today was difficult but I stayed disciplined",
    "",
    "Natural language also works:",
    "\"I completed gym\"",
    "\"Finished bible reading\"",
    "\"Read Genesis 12 today\"",
  ];

  if (botUrl) {
    lines.push("", `Bot: ${botUrl}`);
  }

  return lines.join("\n");
}

export function supportsGeminiIntentParsing(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim());
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatMessageDate(timestampSeconds?: number): string {
  const value = timestampSeconds ? timestampSeconds * 1000 : Date.now();
  return new Date(value).toLocaleDateString("en-CA");
}

function buildJournalTitle(text: string): string {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) {
    return "Telegram Capture";
  }

  return cleaned.length > 72 ? `${cleaned.slice(0, 69).trimEnd()}...` : cleaned;
}

function hasReflectiveSignals(text: string): boolean {
  return (
    /[.!?].+[.!?]/.test(text) ||
    /\b(today|felt|feel|feeling|learned|grateful|struggled|realized|because|however|but|discipline|disciplined|reflection|journal|note)\b/i.test(
      text,
    )
  );
}

function inferJournalDomain(
  text: string,
  completedTaskIds: CaptureTaskId[],
  bibleProgress: BibleProgress | null,
): string {
  if (
    bibleProgress ||
    completedTaskIds.includes("prayer") ||
    completedTaskIds.includes("bible") ||
    /\b(prayer|bible|scripture|devotional)\b/i.test(text)
  ) {
    return "spiritual";
  }

  if (completedTaskIds.includes("trading")) {
    return "trading";
  }

  if (completedTaskIds.includes("gym")) {
    return "projects";
  }

  return "general";
}

function normalizeBibleBook(value: string): string | null {
  const normalized = normalizeWhitespace(value).toLowerCase();
  return BIBLE_BOOK_ALIASES[normalized] ?? null;
}

function detectBibleProgress(text: string): BibleProgress | null {
  for (const alias of BIBLE_ALIAS_KEYS) {
    const aliasPattern = escapeRegex(alias).replace(/\s+/g, "\\s+");
    const match = text.match(
      new RegExp(`\\b${aliasPattern}\\s+(\\d{1,3})(?::(\\d{1,3}))?\\b`, "i"),
    );

    if (!match) {
      continue;
    }

    const book = normalizeBibleBook(alias);
    if (!book) {
      continue;
    }

    return {
      book,
      chapter: Number(match[1]),
      verse: match[2] ? Number(match[2]) : 1,
    };
  }

  return null;
}

function detectTaskIds(text: string, requireCompletionSignal: boolean): CaptureTaskId[] {
  const normalized = normalizeWhitespace(text);
  const hasCompletionSignal = COMPLETION_SIGNAL_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );

  if (requireCompletionSignal && !hasCompletionSignal) {
    return [];
  }

  const taskIds = new Set<CaptureTaskId>();

  for (const taskId of TASK_IDS) {
    if (TASK_METADATA[taskId].patterns.some((pattern) => pattern.test(normalized))) {
      taskIds.add(taskId);
    }
  }

  return Array.from(taskIds);
}

function shouldCreateJournalEntry(
  text: string,
  completedTaskIds: CaptureTaskId[],
  bibleProgress: BibleProgress | null,
): boolean {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) {
    return false;
  }

  const wordCount = cleaned.split(" ").length;
  const reflective = hasReflectiveSignals(cleaned);

  if (completedTaskIds.length === 0 && !bibleProgress) {
    return reflective || wordCount >= 8;
  }

  return wordCount >= 14 || reflective;
}

function parseExplicitCommand(text: string): CommandParseResult {
  const cleaned = normalizeWhitespace(text);
  const commandMatch = cleaned.match(/^\/([a-z]+)(?:@\w+)?(?:\s+(.*))?$/i);

  if (!commandMatch) {
    return { status: "none" };
  }

  const command = commandMatch[1].toLowerCase();
  const args = normalizeWhitespace(commandMatch[2] ?? "");

  if (["done", "complete", "check", "log"].includes(command)) {
    if (!args) {
      return {
        status: "invalid",
        replyText:
          "Use /done with a known task, for example /done gym, /done prayer, /done bible, or /done trading.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "missing_task",
        },
      };
    }

    const taskIds = detectTaskIds(args, false);
    if (taskIds.length === 0) {
      return {
        status: "invalid",
        replyText:
          "I could not match that to a LifeOS task. Try /done gym, /done prayer, /done bible, or /done trading.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "unknown_task",
          args,
        },
      };
    }

    return {
      status: "ready",
      plan: {
        intentType: taskIds.length > 1 ? "multi_action" : "complete_task",
        completedTaskIds: taskIds,
        bibleProgress: null,
        createJournal: false,
        journalDomain: inferJournalDomain(args, taskIds, null),
        journalTitle: buildJournalTitle(args),
        parserSource: "command",
        confidence: 1,
        summary: `Marked ${taskIds.join(", ")} complete from explicit command.`,
        commandName: command,
      },
    };
  }

  if (["bible", "read"].includes(command)) {
    if (!args) {
      return {
        status: "invalid",
        replyText: "Use /bible with a passage, for example /bible Genesis 12 or /bible John 3:16.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "missing_passage",
        },
      };
    }

    const bibleProgress = detectBibleProgress(args);
    if (!bibleProgress) {
      return {
        status: "invalid",
        replyText: "I could not read that Bible reference. Try /bible Genesis 12 or /bible John 3:16.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "invalid_passage",
          args,
        },
      };
    }

    return {
      status: "ready",
      plan: {
        intentType: "update_bible",
        completedTaskIds: ["bible"],
        bibleProgress,
        createJournal: false,
        journalDomain: "spiritual",
        journalTitle: buildJournalTitle(args),
        parserSource: "command",
        confidence: 1,
        summary: `Updated Bible progress from explicit command to ${bibleProgress.book} ${bibleProgress.chapter}:${bibleProgress.verse}.`,
        commandName: command,
      },
    };
  }

  if (["journal", "note", "reflect", "capture"].includes(command)) {
    if (!args) {
      return {
        status: "invalid",
        replyText: "Use /journal with a reflection or note after it.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "missing_text",
        },
      };
    }

    return {
      status: "ready",
      plan: {
        intentType: "journal_entry",
        completedTaskIds: [],
        bibleProgress: null,
        createJournal: true,
        journalDomain: inferJournalDomain(args, [], null),
        journalTitle: buildJournalTitle(args),
        parserSource: "command",
        confidence: 1,
        summary: "Saved explicit journal command to LifeOS.",
        commandName: command,
      },
    };
  }

  return { status: "none" };
}

function buildDeterministicPlan(text: string): CapturePlan | null {
  const bibleProgress = detectBibleProgress(text);
  const completedTaskIds = detectTaskIds(text, true);

  if (bibleProgress && !completedTaskIds.includes("bible")) {
    completedTaskIds.push("bible");
  }

  const createJournal = shouldCreateJournalEntry(text, completedTaskIds, bibleProgress);
  if (completedTaskIds.length === 0 && !bibleProgress && !createJournal) {
    return null;
  }

  const intentType =
    completedTaskIds.length + (bibleProgress ? 1 : 0) > 1
      ? "multi_action"
      : bibleProgress
        ? "update_bible"
        : completedTaskIds.length > 0
          ? "complete_task"
          : "journal_entry";

  return {
    intentType,
    completedTaskIds,
    bibleProgress,
    createJournal,
    journalDomain: inferJournalDomain(text, completedTaskIds, bibleProgress),
    journalTitle: buildJournalTitle(text),
    parserSource: "deterministic",
    confidence:
      completedTaskIds.length > 0 || bibleProgress
        ? createJournal
          ? 0.9
          : 0.94
        : 0.58,
    summary:
      completedTaskIds.length > 0 || bibleProgress
        ? "Deterministic parser matched known LifeOS tasks or Bible progress."
        : "Deterministic parser treated the message as a journal-style reflection.",
    commandName: null,
  };
}

function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  return key ? key : null;
}

function extractGeminiText(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidatePayload = (payload as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  }).candidates;

  if (!Array.isArray(candidatePayload) || candidatePayload.length === 0) {
    return null;
  }

  const parts = candidatePayload[0].content?.parts;
  if (!Array.isArray(parts)) {
    return null;
  }

  const text = parts
    .map((part) => (typeof part.text === "string" ? part.text : ""))
    .join("")
    .trim();

  return text || null;
}

function normalizeGeminiIntentPayload(payload: unknown, inputText: string): GeminiIntentPayload | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  const rawIntentType = candidate.intentType;
  const rawCompletedTaskIds = candidate.completedTaskIds;
  const rawBibleProgress = candidate.bibleProgress;
  const rawShouldCreateJournal = candidate.shouldCreateJournal;
  const rawJournalTitle = candidate.journalTitle;
  const rawConfidence = candidate.confidence;
  const rawSummary = candidate.summary;

  if (typeof rawIntentType !== "string" || !INTENT_TYPES.has(rawIntentType as CaptureIntentType)) {
    return null;
  }

  const completedTaskIds = Array.isArray(rawCompletedTaskIds)
    ? rawCompletedTaskIds.filter((taskId): taskId is CaptureTaskId =>
        typeof taskId === "string" && TASK_IDS.includes(taskId as CaptureTaskId),
      )
    : [];

  let bibleProgress: BibleProgress | null = null;
  if (rawBibleProgress && typeof rawBibleProgress === "object") {
    const book = (rawBibleProgress as Record<string, unknown>).book;
    const chapter = (rawBibleProgress as Record<string, unknown>).chapter;
    const verse = (rawBibleProgress as Record<string, unknown>).verse;

    if (
      typeof book === "string" &&
      typeof chapter === "number" &&
      typeof verse === "number" &&
      chapter >= 1 &&
      verse >= 1
    ) {
      bibleProgress = {
        book: normalizeBibleBook(book) ?? normalizeWhitespace(book),
        chapter: Math.trunc(chapter),
        verse: Math.trunc(verse),
      };
    }
  }

  const shouldCreateJournal = rawShouldCreateJournal === true;
  const journalTitle =
    typeof rawJournalTitle === "string" && rawJournalTitle.trim()
      ? rawJournalTitle.trim()
      : buildJournalTitle(inputText);
  const confidence =
    typeof rawConfidence === "number" && Number.isFinite(rawConfidence)
      ? Math.min(Math.max(rawConfidence, 0), 1)
      : 0;
  const summary =
    typeof rawSummary === "string" && rawSummary.trim()
      ? rawSummary.trim()
      : "Gemini parsed the message.";

  return {
    intentType: rawIntentType as CaptureIntentType,
    completedTaskIds,
    bibleProgress,
    shouldCreateJournal,
    journalTitle,
    confidence,
    summary,
  };
}

async function parseWithGemini(text: string): Promise<CapturePlan | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const prompt = [
    "You interpret Telegram messages for a LifeOS system.",
    "The message came from the user's Telegram bot, which acts as their mobile app.",
    "Available checklist task IDs are: prayer, bible, trading, gym.",
    "If the user says they read a Bible chapter or verse, include completedTaskIds with bible and also return bibleProgress.",
    "Use shouldCreateJournal only when the message contains reflective or journal-style content worth saving as a note.",
    "If the message is ambiguous, return intentType unknown and a lower confidence.",
    "Never invent task IDs outside the allowed enum.",
    "",
    `User message: ${text}`,
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
            responseJsonSchema: GEMINI_CAPTURE_SCHEMA,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini intent parsing failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as unknown;
    const responseText = extractGeminiText(payload);
    if (!responseText) {
      return null;
    }

    const parsedPayload = normalizeGeminiIntentPayload(JSON.parse(responseText), text);
    if (!parsedPayload) {
      return null;
    }

    return {
      intentType: parsedPayload.intentType,
      completedTaskIds: parsedPayload.completedTaskIds,
      bibleProgress: parsedPayload.bibleProgress,
      createJournal: parsedPayload.shouldCreateJournal,
      journalDomain: inferJournalDomain(
        text,
        parsedPayload.completedTaskIds,
        parsedPayload.bibleProgress,
      ),
      journalTitle: parsedPayload.journalTitle,
      parserSource: "gemini",
      confidence: parsedPayload.confidence,
      summary: parsedPayload.summary,
      commandName: null,
    };
  } catch (error) {
    console.error("Gemini capture parsing failed:", error);
    return null;
  }
}

function buildFallbackPlan(text: string): CapturePlan | null {
  const cleaned = normalizeWhitespace(text);
  if (!cleaned) {
    return null;
  }

  const wordCount = cleaned.split(" ").length;
  if (wordCount < 5 && !hasReflectiveSignals(cleaned)) {
    return null;
  }

  return {
    intentType: "journal_entry",
    completedTaskIds: [],
    bibleProgress: null,
    createJournal: true,
    journalDomain: inferJournalDomain(cleaned, [], null),
    journalTitle: buildJournalTitle(cleaned),
    parserSource: "fallback",
    confidence: 0.32,
    summary: "No confident task mapping was found, so the message was saved as a journal capture.",
    commandName: null,
  };
}

async function upsertChecklistCompletion(
  userId: string,
  taskId: CaptureTaskId,
  entryDate: string,
) {
  await db
    .insert(dailyChecklistEntries)
    .values({
      userId,
      taskId,
      entryDate,
      isCompleted: true,
      metricsData: {},
    })
    .onConflictDoUpdate({
      target: [
        dailyChecklistEntries.userId,
        dailyChecklistEntries.taskId,
        dailyChecklistEntries.entryDate,
      ],
      set: {
        isCompleted: true,
        updatedAt: new Date(),
      },
    });
}

async function upsertBibleProgress(userId: string, progress: BibleProgress) {
  const [existingPlan] = await db
    .select()
    .from(bibleReadingPlans)
    .where(eq(bibleReadingPlans.userId, userId))
    .orderBy(desc(bibleReadingPlans.updatedAt), desc(bibleReadingPlans.createdAt))
    .limit(1);

  if (existingPlan) {
    await db
      .update(bibleReadingPlans)
      .set({
        currentBook: progress.book,
        currentChapter: progress.chapter,
        currentVerse: progress.verse,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(bibleReadingPlans.id, existingPlan.id),
          eq(bibleReadingPlans.userId, userId),
        ),
      );
    return;
  }

  await db.insert(bibleReadingPlans).values({
    userId,
    name: "LifeOS Reading Plan",
    currentBook: progress.book,
    currentChapter: progress.chapter,
    currentVerse: progress.verse,
  });
}

async function createTelegramJournalEntry(
  userId: string,
  text: string,
  plan: CapturePlan,
  sourceType: CaptureSourceType,
  messageDate?: number,
) {
  const [note] = await db
    .insert(officeNotes)
    .values({
      userId,
      title: plan.journalTitle,
      content: {
        body: text,
        source: "telegram",
        sourceType,
        parserSource: plan.parserSource,
        confidence: plan.confidence,
        summary: plan.summary,
        commandName: plan.commandName,
        receivedAt: new Date((messageDate ?? Math.floor(Date.now() / 1000)) * 1000).toISOString(),
        completedTaskIds: plan.completedTaskIds,
        bibleProgress: plan.bibleProgress,
      },
      domain: plan.journalDomain,
      noteType: "journal",
    })
    .returning({ id: officeNotes.id });

  return note.id;
}

async function applyCapturePlan(
  userId: string,
  text: string,
  plan: CapturePlan,
  sourceType: CaptureSourceType,
  messageDate?: number,
): Promise<CaptureApplicationResult> {
  const entryDate = formatMessageDate(messageDate);
  const actions: string[] = [];

  for (const taskId of plan.completedTaskIds) {
    await upsertChecklistCompletion(userId, taskId, entryDate);
  }

  if (plan.completedTaskIds.length > 0) {
    actions.push(
      `logged ${plan.completedTaskIds.map((taskId) => TASK_METADATA[taskId].label).join(", ")}`,
    );
  }

  if (plan.bibleProgress) {
    await upsertBibleProgress(userId, plan.bibleProgress);
    actions.push(
      `updated Bible progress to ${plan.bibleProgress.book} ${plan.bibleProgress.chapter}${
        plan.bibleProgress.verse > 1 ? `:${plan.bibleProgress.verse}` : ""
      }`,
    );
  }

  let journalNoteId: string | null = null;
  if (plan.createJournal) {
    journalNoteId = await createTelegramJournalEntry(
      userId,
      text,
      plan,
      sourceType,
      messageDate,
    );
    actions.push("saved your journal entry");
  }

  const parsedIntent: Record<string, unknown> = {
    intentType: plan.intentType,
    parserSource: plan.parserSource,
    confidence: plan.confidence,
    summary: plan.summary,
    commandName: plan.commandName,
    completedTaskIds: plan.completedTaskIds,
    bibleProgress: plan.bibleProgress,
    createJournal: plan.createJournal,
    journalDomain: plan.journalDomain,
    journalNoteId,
  };

  if (actions.length === 0) {
    return {
      parsedIntent: {
        ...parsedIntent,
        status: "no_op",
      },
      replyText:
        "I understood the message, but it did not produce a LifeOS action. Try /done gym, /bible Genesis 12, or /journal ...",
    };
  }

  if (plan.parserSource === "fallback" && journalNoteId) {
    return {
      parsedIntent,
      replyText:
        "I could not confidently map that to a checklist action, so I saved it as a journal entry in LifeOS.",
    };
  }

  return {
    parsedIntent,
    replyText: `Recorded: ${actions.join(", ")}.`,
  };
}

export async function applyTelegramCapture(
  userId: string,
  text: string,
  sourceType: CaptureSourceType,
  messageDate?: number,
): Promise<CaptureApplicationResult> {
  const commandResult = parseExplicitCommand(text);
  if (commandResult.status === "invalid") {
    return {
      parsedIntent: commandResult.parsedIntent,
      replyText: commandResult.replyText,
    };
  }

  if (commandResult.status === "ready") {
    return applyCapturePlan(userId, text, commandResult.plan, sourceType, messageDate);
  }

  const deterministicPlan = buildDeterministicPlan(text);
  if (
    deterministicPlan &&
    deterministicPlan.confidence >= HIGH_CONFIDENCE_THRESHOLD &&
    (deterministicPlan.completedTaskIds.length > 0 || deterministicPlan.bibleProgress)
  ) {
    return applyCapturePlan(userId, text, deterministicPlan, sourceType, messageDate);
  }

  const geminiPlan = await parseWithGemini(text);
  if (
    geminiPlan &&
    geminiPlan.confidence >= GEMINI_CONFIDENCE_THRESHOLD &&
    (geminiPlan.completedTaskIds.length > 0 || geminiPlan.bibleProgress || geminiPlan.createJournal)
  ) {
    return applyCapturePlan(userId, text, geminiPlan, sourceType, messageDate);
  }

  if (deterministicPlan) {
    return applyCapturePlan(userId, text, deterministicPlan, sourceType, messageDate);
  }

  const fallbackPlan = buildFallbackPlan(text);
  if (fallbackPlan) {
    return applyCapturePlan(userId, text, fallbackPlan, sourceType, messageDate);
  }

  return {
    parsedIntent: {
      intentType: "unknown",
      parserSource: geminiPlan ? "gemini" : "deterministic",
      confidence: geminiPlan?.confidence ?? 0,
      summary: geminiPlan?.summary ?? "No LifeOS action was inferred from the message.",
    },
    replyText:
      "I could not map that to a LifeOS action. Try /done gym, /bible Genesis 12, /journal ..., or clearer natural language.",
  };
}

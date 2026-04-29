import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { bibleReadingPlans, dailyChecklistEntries } from "../db/schema.js";
import { saveSharedContent } from "./content.js";
import {
  appendToDailyJournal,
  createStandaloneJournalNote,
} from "./daily-journal.js";
import {
  DEFAULT_TIMEZONE,
  STANDARD_LIFE_TASKS,
  formatTaskLabel,
  getStandardTaskDefinition,
  inferTaskDomain,
} from "./task-definitions.js";

export type CaptureSourceType = "text" | "voice";
export type CaptureSourceChannel = "telegram" | "app";
export type CaptureTaskId = "prayer" | "bible" | "trading" | "gym";
export type CaptureIntentType =
  | "task_log"
  | "update_bible"
  | "journal_entry"
  | "multi_action"
  | "save_content"
  | "unknown";
export type CaptureParserSource = "command" | "deterministic" | "gemini" | "fallback";
export type ChecklistCaptureStatus = "pending" | "completed" | "missed" | "skipped";

export interface BibleProgress {
  book: string;
  chapter: number;
  verse: number;
}

export interface CaptureTaskHint {
  taskId: string;
  label: string;
  domain?: string | null;
}

interface TaskCatalogItem {
  id: string;
  label: string;
  domain: string;
  patterns: RegExp[];
}

interface CaptureTaskUpdate {
  taskId: string;
  label: string;
  domain: string;
  status: ChecklistCaptureStatus;
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  notes: string | null;
  metricsData: Record<string, unknown>;
}

interface CapturePlan {
  intentType: CaptureIntentType;
  taskUpdates: CaptureTaskUpdate[];
  bibleProgress: BibleProgress | null;
  createJournal: boolean;
  journalMode: "append_daily" | "standalone";
  journalDomain: string;
  journalTitle: string;
  journalText: string | null;
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

export interface LifeCaptureOptions {
  channel: CaptureSourceChannel;
  sourceType: CaptureSourceType;
  messageDate?: number;
  taskHints?: CaptureTaskHint[];
}

interface PrefilledCaptureState {
  actions: string[];
  parsedIntent: Record<string, unknown>;
  standaloneReplyText: string;
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
const URL_PATTERN = /\bhttps?:\/\/[^\s<>()]+/gi;
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
  /\bwent\b/i,
  /\bdid\b/i,
  /\bspent\b/i,
  /\bfrom\b/i,
];
const MISSED_SIGNAL_PATTERNS = [
  /\bdid not\b/i,
  /\bdidn't\b/i,
  /\bdidnt\b/i,
  /\bmissed\b/i,
  /\bskip(?:ped)?\b/i,
  /\bcould not\b/i,
  /\bcouldn't\b/i,
  /\bcouldnt\b/i,
  /\bwasn't able\b/i,
  /\bnot able\b/i,
  /\bno\b/i,
];
const DURATION_PATTERNS = [
  /(\d{1,2})\s*(?:hours?|hrs?|hr|h)\s*(\d{1,2})?\s*(?:minutes?|mins?|min|m)?/i,
  /(\d{1,3})\s*(?:minutes?|mins?|min)\b/i,
];
const TIME_RANGE_PATTERNS = [
  /\bfrom\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s+(?:to|-)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i,
  /\b(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\s*(?:to|-)\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i,
];
const WORKOUT_TYPE_PATTERNS = [
  "chest",
  "legs",
  "back",
  "push",
  "pull",
  "cardio",
  "shoulders",
  "arms",
  "full body",
];

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
const STANDARD_TASK_IDS = STANDARD_LIFE_TASKS.map((task) => task.id) as CaptureTaskId[];
const INTENT_TYPES = new Set<CaptureIntentType>([
  "task_log",
  "update_bible",
  "journal_entry",
  "multi_action",
  "save_content",
  "unknown",
]);

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
      enum: ["task_log", "update_bible", "journal_entry", "multi_action", "unknown"],
    },
    completedTaskIds: {
      type: "array",
      items: {
        type: "string",
        enum: STANDARD_TASK_IDS,
      },
    },
    bibleProgress: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["book", "chapter", "verse"],
      properties: {
        book: { type: "string" },
        chapter: { type: "integer", minimum: 1 },
        verse: { type: "integer", minimum: 1 },
      },
    },
    shouldCreateJournal: {
      type: "boolean",
    },
    journalTitle: {
      type: ["string", "null"],
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    summary: {
      type: "string",
    },
  },
};

export const TELEGRAM_BOT_COMMANDS = [
  { command: "link", description: "Connect this Telegram chat to LifeOS" },
  { command: "done", description: "Log a completed task with optional time and note" },
  { command: "miss", description: "Log a missed task and why it happened" },
  { command: "bible", description: "Update Bible progress, e.g. /bible John 3:16" },
  { command: "journal", description: "Save a reflection or note to LifeOS" },
  { command: "help", description: "Show Telegram capture examples" },
] as const;

export function telegramCommandHelpText(botUrl?: string | null): string {
  const lines = [
    "LifeOS Telegram commands:",
    "/done gym from 6:15 to 7:25 chest day felt strong",
    "/miss prayer because I got home late",
    "/bible Genesis 12",
    "/journal Today felt heavy but I stayed disciplined",
    "",
    "Natural language also works:",
    "\"completed gym 75 mins chest day\"",
    "\"did not do prayer because I overslept\"",
    "\"read John 3 and learned about faith\"",
    "\"Anything else I did today...\"",
    "\"https://youtube.com/...\" to save content straight into LifeOS",
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

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function stripUrls(text: string): string {
  return normalizeWhitespace(text.replace(URL_PATTERN, " "));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTaskCatalog(taskHints?: CaptureTaskHint[]): TaskCatalogItem[] {
  const catalog = STANDARD_LIFE_TASKS.map((task) => ({
    id: task.id,
    label: task.label,
    domain: task.domain,
    patterns: task.patterns,
  }));

  for (const hint of taskHints ?? []) {
    if (catalog.some((task) => task.id === hint.taskId)) {
      continue;
    }

    const normalizedLabel = normalizeWhitespace(hint.label);
    const labelPattern = new RegExp(`\\b${escapeRegex(normalizedLabel).replace(/\s+/g, "\\s+")}\\b`, "i");
    const idLabel = formatTaskLabel(hint.taskId);
    const idPattern = new RegExp(`\\b${escapeRegex(idLabel).replace(/\s+/g, "\\s+")}\\b`, "i");

    catalog.push({
      id: hint.taskId,
      label: normalizedLabel || idLabel,
      domain: hint.domain?.trim() || inferTaskDomain(hint.taskId),
      patterns: unique([labelPattern, idPattern]),
    });
  }

  return catalog;
}

function formatMessageDate(timestampSeconds?: number): string {
  const value = timestampSeconds ? timestampSeconds * 1000 : Date.now();
  return new Date(value).toLocaleDateString("en-CA", {
    timeZone: DEFAULT_TIMEZONE,
  });
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
    /\b(today|felt|feel|feeling|learned|grateful|struggled|realized|because|however|discipline|disciplined|reflection|journal|note|anything else)\b/i.test(
      text,
    )
  );
}

function inferJournalDomain(
  text: string,
  taskUpdates: CaptureTaskUpdate[],
  bibleProgress: BibleProgress | null,
): string {
  if (taskUpdates.length > 0) {
    return taskUpdates[0].domain;
  }

  if (bibleProgress || /\b(prayer|bible|scripture|devotional)\b/i.test(text)) {
    return "spiritual";
  }

  if (/\btrading\b|\bcharts\b/i.test(text)) {
    return "trading";
  }

  if (/\bgym\b|\bworkout\b/i.test(text)) {
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

function splitIntoSegments(text: string): string[] {
  return normalizeWhitespace(text)
    .split(/\s*(?:[\n;]+|[.!?](?=\s|$)|\s+\band\b(?=\s+[A-Za-z]))\s*/i)
    .map((segment) => normalizeWhitespace(segment))
    .filter(Boolean);
}

function inferSharedTaskStatus(text: string): ChecklistCaptureStatus | null {
  const hasPositive = COMPLETION_SIGNAL_PATTERNS.some((pattern) => pattern.test(text));
  const hasNegative = MISSED_SIGNAL_PATTERNS.some((pattern) => pattern.test(text));

  if (hasPositive && !hasNegative) {
    return "completed";
  }

  if (hasNegative && !hasPositive) {
    return "missed";
  }

  return null;
}

function parseDurationSeconds(text: string): number | null {
  const hourMinuteMatch = text.match(DURATION_PATTERNS[0]);
  if (hourMinuteMatch) {
    const hours = Number(hourMinuteMatch[1]);
    const minutes = hourMinuteMatch[2] ? Number(hourMinuteMatch[2]) : 0;
    return hours * 3600 + minutes * 60;
  }

  const minuteMatch = text.match(DURATION_PATTERNS[1]);
  if (minuteMatch) {
    return Number(minuteMatch[1]) * 60;
  }

  return null;
}

function buildTimestampForTime(entryDate: string, timeText: string): Date | null {
  const match = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] ?? "0");
  const meridiem = match[3]?.toLowerCase() ?? null;

  if (meridiem === "pm" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "am" && hour === 12) {
    hour = 0;
  }

  const offset = DEFAULT_TIMEZONE === "Asia/Kolkata" ? "+05:30" : "Z";
  const isoString = `${entryDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00${offset}`;
  const timestamp = new Date(isoString);
  return Number.isNaN(timestamp.getTime()) ? null : timestamp;
}

function parseTimeRange(text: string, entryDate: string): {
  startedAt: Date | null;
  endedAt: Date | null;
} {
  for (const pattern of TIME_RANGE_PATTERNS) {
    const match = text.match(pattern);
    if (!match) {
      continue;
    }

    return {
      startedAt: buildTimestampForTime(entryDate, match[1]),
      endedAt: buildTimestampForTime(entryDate, match[2]),
    };
  }

  return {
    startedAt: null,
    endedAt: null,
  };
}

function formatDuration(durationSeconds: number | null): string | null {
  if (!durationSeconds || durationSeconds <= 0) {
    return null;
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
}

function formatClock(date: Date | null): string | null {
  if (!date) {
    return null;
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: DEFAULT_TIMEZONE,
  });
}

function detectMatchingTasks(text: string, taskCatalog: TaskCatalogItem[]): TaskCatalogItem[] {
  return taskCatalog.filter((task) => task.patterns.some((pattern) => pattern.test(text)));
}

function buildTaskMetrics(taskId: string, text: string): Record<string, unknown> {
  const metrics: Record<string, unknown> = {};

  if (taskId === "gym") {
    const workoutType = WORKOUT_TYPE_PATTERNS.find((pattern) =>
      new RegExp(`\\b${escapeRegex(pattern)}\\b`, "i").test(text),
    );
    if (workoutType) {
      metrics.workoutType = workoutType;
    }
  }

  const learnedMatch = text.match(/\blearned\s+(.+)$/i);
  if (learnedMatch) {
    metrics.learned = normalizeWhitespace(learnedMatch[1]);
  }

  return metrics;
}

function stripTaskPatterns(text: string, task: TaskCatalogItem): string {
  let cleaned = text;
  for (const pattern of task.patterns) {
    cleaned = cleaned.replace(pattern, " ");
  }

  cleaned = cleaned
    .replace(/\/(?:done|miss|skip|journal|bible)\b/gi, " ")
    .replace(/\b(completed|complete|finished|done|did|went|logged|missed|skip(?:ped)?|because)\b/gi, " ")
    .replace(TIME_RANGE_PATTERNS[0], " ")
    .replace(TIME_RANGE_PATTERNS[1], " ")
    .replace(DURATION_PATTERNS[0], " ")
    .replace(DURATION_PATTERNS[1], " ");

  return normalizeWhitespace(cleaned);
}

function shouldInterpretAsTaskUpdate(text: string): boolean {
  const hasPositive = COMPLETION_SIGNAL_PATTERNS.some((pattern) => pattern.test(text));
  const hasNegative = MISSED_SIGNAL_PATTERNS.some((pattern) => pattern.test(text));
  const hasDuration = parseDurationSeconds(text) !== null;
  const { startedAt, endedAt } = parseTimeRange(text, formatMessageDate());
  return hasPositive || hasNegative || hasDuration || Boolean(startedAt || endedAt);
}

function buildTaskUpdateForSegment(
  segment: string,
  entryDate: string,
  taskCatalog: TaskCatalogItem[],
  forcedStatus?: ChecklistCaptureStatus,
): CaptureTaskUpdate[] {
  const matchingTasks = detectMatchingTasks(segment, taskCatalog);
  if (matchingTasks.length === 0) {
    return [];
  }

  const hasNegative = MISSED_SIGNAL_PATTERNS.some((pattern) => pattern.test(segment));
  const hasPositive = COMPLETION_SIGNAL_PATTERNS.some((pattern) => pattern.test(segment));
  const durationSeconds = parseDurationSeconds(segment);
  const { startedAt, endedAt } = parseTimeRange(segment, entryDate);

  if (!forcedStatus && !hasNegative && !hasPositive && !durationSeconds && !startedAt && !endedAt) {
    return [];
  }

  const status = forcedStatus ?? (hasNegative ? "missed" : "completed");

  return matchingTasks.map((task) => {
    const notes = stripTaskPatterns(segment, task);
    const metricsData = buildTaskMetrics(task.id, segment);

    return {
      taskId: task.id,
      label: task.label,
      domain: task.domain,
      status,
      startedAt,
      endedAt,
      durationSeconds,
      notes: notes || null,
      metricsData,
    };
  });
}

function shouldCreateJournalEntry(
  text: string,
  taskUpdates: CaptureTaskUpdate[],
  bibleProgress: BibleProgress | null,
  extraJournalSegments: string[],
): boolean {
  if (taskUpdates.length > 0 || bibleProgress) {
    return true;
  }

  const cleaned = normalizeWhitespace(text);
  if (!cleaned) {
    return false;
  }

  if (extraJournalSegments.length > 0) {
    return true;
  }

  const wordCount = cleaned.split(" ").length;
  return hasReflectiveSignals(cleaned) || wordCount >= 8;
}

function buildDeterministicPlan(
  text: string,
  entryDate: string,
  taskHints?: CaptureTaskHint[],
  forcedStatus?: ChecklistCaptureStatus,
): CapturePlan | null {
  const taskCatalog = buildTaskCatalog(taskHints);
  const segments = splitIntoSegments(text);
  const sharedStatus = forcedStatus ?? inferSharedTaskStatus(text);
  const taskUpdates = new Map<string, CaptureTaskUpdate>();
  const extraJournalSegments: string[] = [];
  let bibleProgress: BibleProgress | null = null;

  for (const segment of segments) {
    if (!bibleProgress) {
      bibleProgress = detectBibleProgress(segment);
    }

    const updates = buildTaskUpdateForSegment(
      segment,
      entryDate,
      taskCatalog,
      sharedStatus ?? undefined,
    );
    for (const update of updates) {
      taskUpdates.set(update.taskId, update);
    }

    if (updates.length === 0 && segment.length >= 5) {
      extraJournalSegments.push(segment);
    }
  }

  if (bibleProgress && !taskUpdates.has("bible")) {
    const bibleTask = getStandardTaskDefinition("bible");
    if (bibleTask) {
      taskUpdates.set("bible", {
        taskId: bibleTask.id,
        label: bibleTask.label,
        domain: bibleTask.domain,
        status: forcedStatus ?? "completed",
        startedAt: null,
        endedAt: null,
        durationSeconds: parseDurationSeconds(text),
        notes: normalizeWhitespace(text) || null,
        metricsData: {},
      });
    }
  }

  const normalizedTaskUpdates = Array.from(taskUpdates.values());
  const createJournal = shouldCreateJournalEntry(
    text,
    normalizedTaskUpdates,
    bibleProgress,
    extraJournalSegments,
  );

  if (normalizedTaskUpdates.length === 0 && !bibleProgress && !createJournal) {
    return null;
  }

  const journalText = extraJournalSegments.length > 0 ? extraJournalSegments.join("\n") : null;
  const intentType =
    normalizedTaskUpdates.length > 1 || (normalizedTaskUpdates.length > 0 && bibleProgress)
      ? "multi_action"
      : bibleProgress && normalizedTaskUpdates.length === 0
        ? "update_bible"
        : normalizedTaskUpdates.length > 0
          ? "task_log"
          : "journal_entry";

  return {
    intentType,
    taskUpdates: normalizedTaskUpdates,
    bibleProgress,
    createJournal,
    journalMode: "append_daily",
    journalDomain: inferJournalDomain(text, normalizedTaskUpdates, bibleProgress),
    journalTitle: buildJournalTitle(text),
    journalText,
    parserSource: "deterministic",
    confidence:
      normalizedTaskUpdates.length > 0 || bibleProgress
        ? createJournal
          ? 0.91
          : 0.95
        : 0.58,
    summary:
      normalizedTaskUpdates.length > 0 || bibleProgress
        ? "Deterministic parser matched checklist activity or Bible progress."
        : "Deterministic parser treated the message as a journal-style reflection.",
    commandName: null,
  };
}

function parseExplicitCommand(
  text: string,
  entryDate: string,
  taskHints?: CaptureTaskHint[],
): CommandParseResult {
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
          "Use /done with a known task, for example /done gym from 6 to 7 chest day, or /done prayer 20 mins.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "missing_task",
        },
      };
    }

    const plan = buildDeterministicPlan(args, entryDate, taskHints, "completed");
    if (!plan || plan.taskUpdates.length === 0) {
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
        ...plan,
        parserSource: "command",
        confidence: 1,
        summary: `Logged ${plan.taskUpdates.map((update) => update.taskId).join(", ")} from explicit command.`,
        commandName: command,
      },
    };
  }

  if (["miss", "skip"].includes(command)) {
    if (!args) {
      return {
        status: "invalid",
        replyText: "Use /miss with a task and optional reason, for example /miss gym because I got home late.",
        parsedIntent: {
          parserSource: "command",
          commandName: command,
          error: "missing_task",
        },
      };
    }

    const status: ChecklistCaptureStatus = command === "skip" ? "skipped" : "missed";
    const plan = buildDeterministicPlan(args, entryDate, taskHints, status);
    if (!plan || plan.taskUpdates.length === 0) {
      return {
        status: "invalid",
        replyText:
          "I could not match that to a LifeOS task. Try /miss gym because..., /miss prayer because..., or /skip trading.",
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
        ...plan,
        parserSource: "command",
        confidence: 1,
        summary: `Logged ${plan.taskUpdates.map((update) => update.taskId).join(", ")} as ${status}.`,
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

    const plan = buildDeterministicPlan(args, entryDate, taskHints, "completed");
    if (!plan?.bibleProgress) {
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
        ...plan,
        parserSource: "command",
        confidence: 1,
        summary: `Updated Bible progress from explicit command to ${plan.bibleProgress.book} ${plan.bibleProgress.chapter}:${plan.bibleProgress.verse}.`,
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
        taskUpdates: [],
        bibleProgress: null,
        createJournal: true,
        journalMode: "standalone",
        journalDomain: inferJournalDomain(args, [], null),
        journalTitle: buildJournalTitle(args),
        journalText: args,
        parserSource: "command",
        confidence: 1,
        summary: "Saved explicit journal command to LifeOS.",
        commandName: command,
      },
    };
  }

  return { status: "none" };
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
        typeof taskId === "string" && STANDARD_TASK_IDS.includes(taskId as CaptureTaskId),
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

async function parseWithGemini(
  text: string,
  entryDate: string,
): Promise<CapturePlan | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  const prompt = [
    "You interpret Telegram and app journaling messages for a LifeOS system.",
    "Available checklist task IDs are: prayer, bible, trading, gym.",
    "Return completedTaskIds only for tasks that the user clearly did.",
    "If the user says they read a Bible chapter or verse, include completedTaskIds with bible and also return bibleProgress.",
    "Use shouldCreateJournal when the message contains reflective or journal-style content worth saving.",
    "If the message is ambiguous, return intentType unknown and a lower confidence.",
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

    const taskUpdates: CaptureTaskUpdate[] = [];
    for (const taskId of parsedPayload.completedTaskIds) {
      const task = getStandardTaskDefinition(taskId);
      if (!task) {
        continue;
      }

      taskUpdates.push({
        taskId,
        label: task.label,
        domain: task.domain,
        status: "completed",
        startedAt: null,
        endedAt: null,
        durationSeconds: parseDurationSeconds(text),
        notes: normalizeWhitespace(text),
        metricsData: buildTaskMetrics(taskId, text),
      });
    }

    if (parsedPayload.bibleProgress && !taskUpdates.some((update) => update.taskId === "bible")) {
      const bibleTask = getStandardTaskDefinition("bible");
      if (bibleTask) {
        taskUpdates.push({
          taskId: bibleTask.id,
          label: bibleTask.label,
          domain: bibleTask.domain,
          status: "completed",
          startedAt: null,
          endedAt: null,
          durationSeconds: null,
          notes: normalizeWhitespace(text),
          metricsData: {},
        });
      }
    }

    return {
      intentType: parsedPayload.intentType,
      taskUpdates,
      bibleProgress: parsedPayload.bibleProgress,
      createJournal: parsedPayload.shouldCreateJournal || taskUpdates.length > 0,
      journalMode: "append_daily",
      journalDomain: inferJournalDomain(text, taskUpdates, parsedPayload.bibleProgress),
      journalTitle: parsedPayload.journalTitle,
      journalText: parsedPayload.shouldCreateJournal ? normalizeWhitespace(text) : null,
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
    taskUpdates: [],
    bibleProgress: null,
    createJournal: true,
    journalMode: "append_daily",
    journalDomain: inferJournalDomain(cleaned, [], null),
    journalTitle: buildJournalTitle(cleaned),
    journalText: cleaned,
    parserSource: "fallback",
    confidence: 0.36,
    summary: "No confident task mapping was found, so the message was saved as a journal capture.",
    commandName: null,
  };
}

async function upsertChecklistUpdate(
  executor: any,
  userId: string,
  entryDate: string,
  taskUpdate: CaptureTaskUpdate,
  responseSource: CaptureSourceChannel,
) {
  await executor
    .insert(dailyChecklistEntries)
    .values({
      userId,
      taskId: taskUpdate.taskId,
      entryDate,
      isCompleted: taskUpdate.status === "completed",
      status: taskUpdate.status,
      startedAt: taskUpdate.startedAt ?? undefined,
      endedAt: taskUpdate.endedAt ?? undefined,
      durationSeconds: taskUpdate.durationSeconds ?? undefined,
      notes: taskUpdate.notes ?? undefined,
      answeredAt: new Date(),
      responseSource,
      metricsData: taskUpdate.metricsData,
    })
    .onConflictDoUpdate({
      target: [
        dailyChecklistEntries.userId,
        dailyChecklistEntries.taskId,
        dailyChecklistEntries.entryDate,
      ],
      set: {
        isCompleted: taskUpdate.status === "completed",
        status: taskUpdate.status,
        startedAt: taskUpdate.startedAt ?? undefined,
        endedAt: taskUpdate.endedAt ?? undefined,
        durationSeconds: taskUpdate.durationSeconds ?? undefined,
        notes: taskUpdate.notes ?? undefined,
        answeredAt: new Date(),
        responseSource,
        metricsData: taskUpdate.metricsData,
        updatedAt: new Date(),
      },
    });
}

async function updateChecklistJournalLink(
  executor: any,
  userId: string,
  entryDate: string,
  taskId: string,
  journalNoteId: string,
) {
  await executor
    .update(dailyChecklistEntries)
    .set({
      journalNoteId,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(dailyChecklistEntries.userId, userId),
        eq(dailyChecklistEntries.taskId, taskId),
        eq(dailyChecklistEntries.entryDate, entryDate),
      ),
    );
}

async function upsertBibleProgress(executor: any, userId: string, progress: BibleProgress) {
  const [existingPlan] = await executor
    .select()
    .from(bibleReadingPlans)
    .where(eq(bibleReadingPlans.userId, userId))
    .orderBy(desc(bibleReadingPlans.updatedAt), desc(bibleReadingPlans.createdAt))
    .limit(1);

  if (existingPlan) {
    await executor
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

  await executor.insert(bibleReadingPlans).values({
    userId,
    name: "LifeOS Reading Plan",
    currentBook: progress.book,
    currentChapter: progress.chapter,
    currentVerse: progress.verse,
  });
}

async function captureSharedTelegramContent(
  userId: string,
  text: string,
  sourceType: CaptureSourceType,
  messageDate?: number,
): Promise<PrefilledCaptureState | null> {
  const result = await saveSharedContent({
    userId,
    rawText: text,
    captureSource: "telegram",
    sourceType,
    messageDate,
  });

  if (result.savedItems.length === 0 && result.duplicateItems.length === 0) {
    return null;
  }

  const savedFolders = unique(
    result.savedItems.map((item) => item.folderName).filter((value): value is string => Boolean(value)),
  );
  const duplicateFolders = unique(
    result.duplicateItems
      .map((item) => item.folderName)
      .filter((value): value is string => Boolean(value)),
  );
  const actions: string[] = [];

  if (result.savedItems.length > 0) {
    const folderLabel = savedFolders.length > 0 ? savedFolders.join(", ") : "Content";
    actions.push(
      `saved ${result.savedItems.length} content item${
        result.savedItems.length === 1 ? "" : "s"
      } to ${folderLabel}`,
    );
  }

  if (result.duplicateItems.length > 0) {
    const folderLabel = duplicateFolders.length > 0 ? duplicateFolders.join(", ") : "Content";
    actions.push(
      `kept ${result.duplicateItems.length} existing content item${
        result.duplicateItems.length === 1 ? "" : "s"
      } in ${folderLabel}`,
    );
  }

  return {
    actions,
    parsedIntent: {
      contentCapture: {
        savedCount: result.savedItems.length,
        duplicateCount: result.duplicateItems.length,
        items: [...result.savedItems, ...result.duplicateItems].map((item) => ({
          id: item.id,
          title: item.title,
          source: item.source,
          type: item.type,
          folderName: item.folderName,
          url: item.url,
          wasDuplicate: item.wasDuplicate,
        })),
      },
    },
    standaloneReplyText: `Content updated: ${actions.join(", ")}.`,
  };
}

function buildJournalHeader(
  channel: CaptureSourceChannel,
  messageDate: number | undefined,
  label: string,
  durationSeconds: number | null,
  startedAt: Date | null,
  endedAt: Date | null,
): string {
  const captureTime = new Date((messageDate ?? Math.floor(Date.now() / 1000)) * 1000);
  const timeLabel = captureTime.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: DEFAULT_TIMEZONE,
  });

  const parts = [timeLabel, channel === "telegram" ? "Telegram" : "App", label];
  const durationLabel = formatDuration(durationSeconds);
  const startLabel = formatClock(startedAt);
  const endLabel = formatClock(endedAt);

  if (durationLabel) {
    parts.push(durationLabel);
  }

  if (startLabel && endLabel) {
    parts.push(`${startLabel} - ${endLabel}`);
  }

  return parts.join(" · ");
}

function buildTaskAction(update: CaptureTaskUpdate): string {
  if (update.status === "completed") {
    return `logged ${update.label}`;
  }

  if (update.status === "missed") {
    return `logged ${update.label} as missed`;
  }

  return `logged ${update.label} as skipped`;
}

async function applyCapturePlan(
  userId: string,
  text: string,
  plan: CapturePlan,
  options: LifeCaptureOptions,
  prefilledState?: PrefilledCaptureState | null,
): Promise<CaptureApplicationResult> {
  const entryDate = formatMessageDate(options.messageDate);
  const actions = [...(prefilledState?.actions ?? [])];

  const journalNoteIds = await db.transaction(async (tx) => {
    for (const taskUpdate of plan.taskUpdates) {
      await upsertChecklistUpdate(tx, userId, entryDate, taskUpdate, options.channel);
    }

    if (plan.bibleProgress) {
      await upsertBibleProgress(tx, userId, plan.bibleProgress);
    }

    const createdNoteIds: string[] = [];

    if (plan.createJournal) {
      const updatesByDomain = new Map<string, CaptureTaskUpdate[]>();
      for (const taskUpdate of plan.taskUpdates) {
        const existing = updatesByDomain.get(taskUpdate.domain) ?? [];
        existing.push(taskUpdate);
        updatesByDomain.set(taskUpdate.domain, existing);
      }

      for (const [domain, updates] of updatesByDomain.entries()) {
        let noteId: string | null = null;

        for (const update of updates) {
          const label =
            update.status === "completed"
              ? `${update.label} completed`
              : update.status === "missed"
                ? `${update.label} missed`
                : `${update.label} skipped`;

          noteId = await appendToDailyJournal(tx, {
            userId,
            domain,
            entryDate,
            source: options.channel,
            header: buildJournalHeader(
              options.channel,
              options.messageDate,
              label,
              update.durationSeconds,
              update.startedAt,
              update.endedAt,
            ),
            body: update.notes,
          });

          await updateChecklistJournalLink(tx, userId, entryDate, update.taskId, noteId);
        }

        if (noteId) {
          createdNoteIds.push(noteId);
        }
      }

      if (plan.bibleProgress && !updatesByDomain.has("spiritual")) {
        const noteId = await appendToDailyJournal(tx, {
          userId,
          domain: "spiritual",
          entryDate,
          source: options.channel,
          header: buildJournalHeader(
            options.channel,
            options.messageDate,
            `Bible progress to ${plan.bibleProgress.book} ${plan.bibleProgress.chapter}${
              plan.bibleProgress.verse > 1 ? `:${plan.bibleProgress.verse}` : ""
            }`,
            null,
            null,
            null,
          ),
          body: plan.journalText,
        });
        createdNoteIds.push(noteId);
      }

      if (plan.journalText && plan.journalMode === "append_daily") {
        const noteId = await appendToDailyJournal(tx, {
          userId,
          domain: plan.journalDomain,
          entryDate,
          source: options.channel,
          header: buildJournalHeader(
            options.channel,
            options.messageDate,
            "Additional reflection",
            null,
            null,
            null,
          ),
          body: plan.journalText,
        });
        createdNoteIds.push(noteId);
      }

      if (plan.journalText && plan.journalMode === "standalone") {
        const noteId = await createStandaloneJournalNote(tx, {
          userId,
          domain: plan.journalDomain,
          title: plan.journalTitle,
          body: plan.journalText,
        });
        createdNoteIds.push(noteId);
      }
    }

    return createdNoteIds;
  });

  if (plan.taskUpdates.length > 0) {
    actions.push(...plan.taskUpdates.map(buildTaskAction));
  }

  if (plan.bibleProgress) {
    actions.push(
      `updated Bible progress to ${plan.bibleProgress.book} ${plan.bibleProgress.chapter}${
        plan.bibleProgress.verse > 1 ? `:${plan.bibleProgress.verse}` : ""
      }`,
    );
  }

  if (plan.createJournal) {
    actions.push(
      plan.journalMode === "standalone"
        ? "saved your journal entry"
        : "updated your daily journal",
    );
  }

  const parsedIntent: Record<string, unknown> = {
    ...(prefilledState?.parsedIntent ?? {}),
    intentType: plan.intentType,
    parserSource: plan.parserSource,
    confidence: plan.confidence,
    summary: plan.summary,
    commandName: plan.commandName,
    taskUpdates: plan.taskUpdates.map((update) => ({
      taskId: update.taskId,
      label: update.label,
      domain: update.domain,
      status: update.status,
      durationSeconds: update.durationSeconds,
      startedAt: update.startedAt?.toISOString() ?? null,
      endedAt: update.endedAt?.toISOString() ?? null,
      notes: update.notes,
      metricsData: update.metricsData,
    })),
    bibleProgress: plan.bibleProgress,
    createJournal: plan.createJournal,
    journalMode: plan.journalMode,
    journalDomain: plan.journalDomain,
    journalNoteIds,
  };

  if (actions.length === 0) {
    return {
      parsedIntent: {
        ...parsedIntent,
        status: "no_op",
      },
      replyText:
        "I understood the message, but it did not produce a LifeOS action. Try /done gym, /miss prayer because..., /bible Genesis 12, or /journal ...",
    };
  }

  if (plan.parserSource === "fallback" && plan.createJournal) {
    return {
      parsedIntent,
      replyText:
        "I could not confidently map that to a checklist action, so I saved it into your journal.",
    };
  }

  return {
    parsedIntent,
    replyText: `Recorded: ${actions.join(", ")}.`,
  };
}

export async function applyLifeCapture(
  userId: string,
  text: string,
  options: LifeCaptureOptions,
): Promise<CaptureApplicationResult> {
  const entryDate = formatMessageDate(options.messageDate);
  const commandResult = parseExplicitCommand(text, entryDate, options.taskHints);
  if (commandResult.status === "invalid") {
    return {
      parsedIntent: commandResult.parsedIntent,
      replyText: commandResult.replyText,
    };
  }

  if (commandResult.status === "ready") {
    return applyCapturePlan(userId, text, commandResult.plan, options);
  }

  const sharedContentState =
    options.channel === "telegram"
      ? await captureSharedTelegramContent(userId, text, options.sourceType, options.messageDate)
      : null;
  const analysisText = sharedContentState ? stripUrls(text) : text;

  if (!analysisText && sharedContentState) {
    return {
      parsedIntent: {
        ...sharedContentState.parsedIntent,
        intentType: "save_content",
        parserSource: "deterministic",
        confidence: 0.94,
        summary: "Detected shared URLs and saved them to the Content domain.",
      },
      replyText: sharedContentState.standaloneReplyText,
    };
  }

  const deterministicPlan = buildDeterministicPlan(
    analysisText,
    entryDate,
    options.taskHints,
  );
  if (
    deterministicPlan &&
    deterministicPlan.confidence >= HIGH_CONFIDENCE_THRESHOLD &&
    (deterministicPlan.taskUpdates.length > 0 || deterministicPlan.bibleProgress)
  ) {
    return applyCapturePlan(userId, analysisText, deterministicPlan, options, sharedContentState);
  }

  const geminiPlan = analysisText ? await parseWithGemini(analysisText, entryDate) : null;
  if (
    geminiPlan &&
    geminiPlan.confidence >= GEMINI_CONFIDENCE_THRESHOLD &&
    (geminiPlan.taskUpdates.length > 0 || geminiPlan.bibleProgress || geminiPlan.createJournal)
  ) {
    return applyCapturePlan(userId, analysisText, geminiPlan, options, sharedContentState);
  }

  if (deterministicPlan) {
    return applyCapturePlan(userId, analysisText, deterministicPlan, options, sharedContentState);
  }

  const fallbackPlan = analysisText ? buildFallbackPlan(analysisText) : null;
  if (fallbackPlan) {
    return applyCapturePlan(userId, analysisText, fallbackPlan, options, sharedContentState);
  }

  if (sharedContentState) {
    return {
      parsedIntent: {
        ...sharedContentState.parsedIntent,
        intentType: "save_content",
        parserSource: "deterministic",
        confidence: 0.94,
        summary: "Detected shared URLs and saved them to the Content domain.",
      },
      replyText: sharedContentState.standaloneReplyText,
    };
  }

  return {
    parsedIntent: {
      intentType: "unknown",
      parserSource: geminiPlan ? "gemini" : "deterministic",
      confidence: geminiPlan?.confidence ?? 0,
      summary: geminiPlan?.summary ?? "No LifeOS action was inferred from the message.",
    },
    replyText:
      "I could not map that to a LifeOS action. Try /done gym, /miss prayer because..., /bible Genesis 12, /journal ..., or clearer natural language.",
  };
}

export async function applyTelegramCapture(
  userId: string,
  text: string,
  sourceType: CaptureSourceType,
  messageDate?: number,
): Promise<CaptureApplicationResult> {
  return applyLifeCapture(userId, text, {
    channel: "telegram",
    sourceType,
    messageDate,
  });
}

import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  dailyCheckinSessions,
  dailyChecklistEntries,
  telegramConnections,
} from "../db/schema.js";
import {
  applyLifeCapture,
  type CaptureApplicationResult,
  type CaptureSourceChannel,
  type CaptureSourceType,
  type CaptureTaskHint,
} from "./telegram-capture.js";
import { sendTelegramMessage } from "./telegram-bot.js";
import {
  DEFAULT_TIMEZONE,
  STANDARD_LIFE_TASKS,
  formatTaskLabel,
  inferTaskDomain,
  taskAppliesOnDate,
} from "./task-definitions.js";

export interface DailyCheckinTaskDescriptor {
  taskId: string;
  label: string;
  domain: string;
  state: "pending" | "needs_details";
}

export interface DailyCheckinState {
  due: boolean;
  sessionId: string | null;
  sessionDate: string;
  timezone: string;
  status: string | null;
  promptText: string | null;
  pendingTasks: DailyCheckinTaskDescriptor[];
  answeredAt: string | null;
  channels: string[];
}

interface SessionMetadataShape {
  tasks: DailyCheckinTaskDescriptor[];
}

interface SubmitDailyCheckinOptions {
  channel: CaptureSourceChannel;
  sourceType: CaptureSourceType;
  messageDate?: number;
}

type DailyCheckinSessionRecord = NonNullable<Awaited<ReturnType<typeof getSessionForUser>>>;

function getReferenceDate(messageDate?: number): Date {
  return new Date((messageDate ?? Math.floor(Date.now() / 1000)) * 1000);
}

function getTimeZoneParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: values.year ?? "0000",
    month: values.month ?? "01",
    day: values.day ?? "01",
    hour: Number(values.hour ?? "0"),
    minute: Number(values.minute ?? "0"),
  };
}

function getLocalDateKey(date: Date, timeZone: string): string {
  const parts = getTimeZoneParts(date, timeZone);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function isNightlyCheckinDue(date: Date, timeZone: string): boolean {
  const parts = getTimeZoneParts(date, timeZone);
  return parts.hour > 21 || (parts.hour === 21 && parts.minute >= 0);
}

function getDayOfWeekForLocalDate(dateKey: string): number {
  const offset = DEFAULT_TIMEZONE === "Asia/Kolkata" ? "+05:30" : "Z";
  return new Date(`${dateKey}T12:00:00${offset}`).getUTCDay();
}

function buildPromptText(
  sessionDate: string,
  tasks: DailyCheckinTaskDescriptor[],
): string {
  const pendingTasks = tasks.filter((task) => task.state === "pending").map((task) => task.label);
  const detailTasks = tasks
    .filter((task) => task.state === "needs_details")
    .map((task) => task.label);

  const lines = [`9 PM check-in for ${sessionDate}.`];

  if (pendingTasks.length > 0) {
    lines.push(`Still open: ${pendingTasks.join(", ")}.`);
  } else {
    lines.push("Your main checklist looks covered.");
  }

  if (detailTasks.length > 0) {
    lines.push(`Add timing or a short note for: ${detailTasks.join(", ")}.`);
  }

  lines.push(
    "Reply with what you completed, how long you spent, the start and end time if you know it, and a short reflection.",
  );
  lines.push("For anything you missed, say why.");
  lines.push("Also tell me anything else you did or want journaled tonight.");

  return lines.join(" ");
}

function extractSessionMetadata(metadata: unknown): SessionMetadataShape {
  if (!metadata || typeof metadata !== "object") {
    return { tasks: [] };
  }

  const rawTasks = (metadata as { tasks?: unknown }).tasks;
  if (!Array.isArray(rawTasks)) {
    return { tasks: [] };
  }

  const tasks = rawTasks
    .map((task) => {
      if (!task || typeof task !== "object") {
        return null;
      }

      const candidate = task as Record<string, unknown>;
      if (
        typeof candidate.taskId !== "string" ||
        typeof candidate.label !== "string" ||
        typeof candidate.domain !== "string" ||
        (candidate.state !== "pending" && candidate.state !== "needs_details")
      ) {
        return null;
      }

      return {
        taskId: candidate.taskId,
        label: candidate.label,
        domain: candidate.domain,
        state: candidate.state,
      } satisfies DailyCheckinTaskDescriptor;
    })
    .filter((task): task is DailyCheckinTaskDescriptor => Boolean(task));

  return { tasks };
}

function toTaskHints(tasks: DailyCheckinTaskDescriptor[]): CaptureTaskHint[] {
  return tasks.map((task) => ({
    taskId: task.taskId,
    label: task.label,
    domain: task.domain,
  }));
}

function hasActionableCapture(result: CaptureApplicationResult): boolean {
  const status = result.parsedIntent.status;
  const intentType = result.parsedIntent.intentType;

  if (status === "no_op") {
    return false;
  }

  return intentType !== "unknown";
}

function appendPendingTaskSummary(
  replyText: string,
  pendingTasks: DailyCheckinTaskDescriptor[],
): string {
  if (pendingTasks.length === 0) {
    return replyText;
  }

  const summary = pendingTasks.map((task) => task.label).join(", ");
  return `${replyText} Still pending: ${summary}.`;
}

async function buildDailyCheckinTasks(
  userId: string,
  sessionDate: string,
): Promise<DailyCheckinTaskDescriptor[]> {
  const entries = await db
    .select()
    .from(dailyChecklistEntries)
    .where(
      and(
        eq(dailyChecklistEntries.userId, userId),
        eq(dailyChecklistEntries.entryDate, sessionDate),
      ),
    );

  const entryByTaskId = new Map(entries.map((entry) => [entry.taskId, entry]));
  const tasks: DailyCheckinTaskDescriptor[] = [];
  const dayOfWeek = getDayOfWeekForLocalDate(sessionDate);

  for (const task of STANDARD_LIFE_TASKS) {
    if (!taskAppliesOnDate(task, dayOfWeek)) {
      continue;
    }

    const entry = entryByTaskId.get(task.id);
    if (!entry) {
      tasks.push({
        taskId: task.id,
        label: task.label,
        domain: task.domain,
        state: "pending",
      });
      continue;
    }

    if (entry.status !== "completed" && !entry.isCompleted) {
      tasks.push({
        taskId: task.id,
        label: task.label,
        domain: task.domain,
        state: "pending",
      });
      continue;
    }

    if (!entry.durationSeconds && !entry.notes) {
      tasks.push({
        taskId: task.id,
        label: task.label,
        domain: task.domain,
        state: "needs_details",
      });
    }
  }

  for (const entry of entries) {
    if (STANDARD_LIFE_TASKS.some((task) => task.id === entry.taskId)) {
      continue;
    }

    if (entry.status === "completed" || entry.isCompleted) {
      if (!entry.durationSeconds && !entry.notes) {
        tasks.push({
          taskId: entry.taskId,
          label: formatTaskLabel(entry.taskId),
          domain: inferTaskDomain(entry.taskId),
          state: "needs_details",
        });
      }
      continue;
    }

    tasks.push({
      taskId: entry.taskId,
      label: formatTaskLabel(entry.taskId),
      domain: inferTaskDomain(entry.taskId),
      state: "pending",
    });
  }

  return tasks;
}

async function getSessionForUser(userId: string, sessionDate: string) {
  const [session] = await db
    .select()
    .from(dailyCheckinSessions)
    .where(
      and(
        eq(dailyCheckinSessions.userId, userId),
        eq(dailyCheckinSessions.sessionDate, sessionDate),
      ),
    )
    .limit(1);

  return session ?? null;
}

function serializeSession(
  session:
    | (Awaited<ReturnType<typeof getSessionForUser>> & {
        metadata?: unknown;
      })
    | null,
  sessionDate: string,
  timeZone: string,
  due: boolean,
): DailyCheckinState {
  const metadata = extractSessionMetadata(session?.metadata);

  return {
    due: due && Boolean(session) && !session?.answeredAt,
    sessionId: session?.id ?? null,
    sessionDate,
    timezone: timeZone,
    status: session?.status ?? null,
    promptText: session?.promptText ?? null,
    pendingTasks: metadata.tasks,
    answeredAt: session?.answeredAt?.toISOString() ?? null,
    channels: Array.isArray(session?.channels)
      ? session.channels.filter((value): value is string => typeof value === "string")
      : ["app", "telegram"],
  };
}

async function createOrRefreshSession(
  userId: string,
  sessionDate: string,
  timeZone: string,
  options?: {
    markAppPrompted?: boolean;
  },
) {
  const tasks = await buildDailyCheckinTasks(userId, sessionDate);
  const promptText = buildPromptText(sessionDate, tasks);
  const existing = await getSessionForUser(userId, sessionDate);

  if (existing) {
    if (!existing.appPromptedAt && options?.markAppPrompted) {
      const [updated] = await db
        .update(dailyCheckinSessions)
        .set({
          appPromptedAt: new Date(),
          promptText,
          pendingTaskIds: tasks.map((task) => task.taskId),
          metadata: { tasks },
          updatedAt: new Date(),
        })
        .where(eq(dailyCheckinSessions.id, existing.id))
        .returning();

      return updated;
    }

    return existing;
  }

  const [created] = await db
    .insert(dailyCheckinSessions)
    .values({
      userId,
      sessionDate,
      timezone: timeZone,
      status: "pending",
      promptText,
      pendingTaskIds: tasks.map((task) => task.taskId),
      channels: ["app", "telegram"],
      appPromptedAt: options?.markAppPrompted ? new Date() : undefined,
      metadata: { tasks },
    })
    .returning();

  return created;
}

async function updateSessionAfterResponse(
  session: DailyCheckinSessionRecord,
  sessionDate: string,
  timeZone: string,
  text: string,
  channel: CaptureSourceChannel,
  pendingTasks: DailyCheckinTaskDescriptor[],
  actionable: boolean,
) {
  const promptText = buildPromptText(sessionDate, pendingTasks);
  const resolved = actionable && pendingTasks.length === 0;
  const nextStatus = resolved
    ? "answered"
    : session.telegramSentAt
      ? "sent"
      : "pending";

  const [updatedSession] = await db
    .update(dailyCheckinSessions)
    .set({
      status: nextStatus,
      promptText,
      pendingTaskIds: pendingTasks.map((task) => task.taskId),
      metadata: { tasks: pendingTasks },
      answeredAt: resolved ? new Date() : null,
      responseText: text,
      responseSource: channel,
      updatedAt: new Date(),
    })
    .where(eq(dailyCheckinSessions.id, session.id))
    .returning();

  return serializeSession(updatedSession, sessionDate, timeZone, true);
}

export async function getDailyCheckinStateForUser(userId: string): Promise<DailyCheckinState> {
  const timeZone = DEFAULT_TIMEZONE;
  const now = new Date();
  const sessionDate = getLocalDateKey(now, timeZone);
  const due = isNightlyCheckinDue(now, timeZone);

  if (!due) {
    return {
      due: false,
      sessionId: null,
      sessionDate,
      timezone: timeZone,
      status: null,
      promptText: null,
      pendingTasks: [],
      answeredAt: null,
      channels: ["app", "telegram"],
    };
  }

  const session = await createOrRefreshSession(userId, sessionDate, timeZone, {
    markAppPrompted: true,
  });
  return serializeSession(session, sessionDate, timeZone, true);
}

export async function submitDailyCheckinResponse(
  userId: string,
  text: string,
  options?: Partial<SubmitDailyCheckinOptions>,
): Promise<{
  session: DailyCheckinState;
  capture: CaptureApplicationResult;
}> {
  const timeZone = DEFAULT_TIMEZONE;
  const now = getReferenceDate(options?.messageDate);
  const sessionDate = getLocalDateKey(now, timeZone);
  const session =
    (await getSessionForUser(userId, sessionDate)) ??
    (await createOrRefreshSession(userId, sessionDate, timeZone, {
      markAppPrompted: options?.channel !== "telegram",
    }));

  const metadata = extractSessionMetadata(session.metadata);
  const capture = await applyLifeCapture(userId, text, {
    channel: options?.channel ?? "app",
    sourceType: options?.sourceType ?? "text",
    messageDate: options?.messageDate ?? Math.floor(now.getTime() / 1000),
    taskHints: toTaskHints(metadata.tasks),
  });
  const actionable = hasActionableCapture(capture);
  const pendingTasks = actionable ? await buildDailyCheckinTasks(userId, sessionDate) : metadata.tasks;
  const updatedSession = await updateSessionAfterResponse(
    session,
    sessionDate,
    timeZone,
    text,
    options?.channel ?? "app",
    pendingTasks,
    actionable,
  );
  const replyText = actionable
    ? appendPendingTaskSummary(capture.replyText, updatedSession.answeredAt ? [] : pendingTasks)
    : `${capture.replyText} ${buildPromptText(sessionDate, metadata.tasks)}`;

  return {
    session: updatedSession,
    capture: {
      ...capture,
      replyText,
      parsedIntent: {
        ...capture.parsedIntent,
        dailyCheckin: {
          sessionId: updatedSession.sessionId,
          answeredAt: updatedSession.answeredAt,
          pendingTasks,
          actionable,
        },
      },
    },
  };
}

export async function maybeSubmitTelegramDailyCheckinResponse(
  userId: string,
  text: string,
  sourceType: CaptureSourceType,
  messageDate?: number,
): Promise<{
  session: DailyCheckinState;
  capture: CaptureApplicationResult;
} | null> {
  const timeZone = DEFAULT_TIMEZONE;
  const referenceDate = getReferenceDate(messageDate);
  const sessionDate = getLocalDateKey(referenceDate, timeZone);
  const existingSession = await getSessionForUser(userId, sessionDate);

  if (existingSession?.answeredAt) {
    return null;
  }

  const due = isNightlyCheckinDue(referenceDate, timeZone);
  if (!due && !existingSession) {
    return null;
  }

  return submitDailyCheckinResponse(userId, text, {
    channel: "telegram",
    sourceType,
    messageDate,
  });
}

export async function runDueTelegramCheckins(): Promise<void> {
  const timeZone = DEFAULT_TIMEZONE;
  const now = new Date();
  if (!isNightlyCheckinDue(now, timeZone)) {
    return;
  }

  const sessionDate = getLocalDateKey(now, timeZone);
  const connections = await db
    .select({
      userId: telegramConnections.userId,
      chatId: telegramConnections.telegramChatId,
    })
    .from(telegramConnections)
    .where(eq(telegramConnections.status, "linked"));

  for (const connection of connections) {
    if (!connection.chatId) {
      continue;
    }

    const session = await createOrRefreshSession(connection.userId, sessionDate, timeZone);
    if (session.answeredAt || session.telegramSentAt) {
      continue;
    }

    const sent = await sendTelegramMessage(connection.chatId, session.promptText);
    if (!sent) {
      continue;
    }

    await db
      .update(dailyCheckinSessions)
      .set({
        status: "sent",
        telegramSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(dailyCheckinSessions.id, session.id));
  }
}

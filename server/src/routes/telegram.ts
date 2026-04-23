import { randomBytes } from "node:crypto";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { db } from "../db/index.js";
import {
  telegramConnections,
  telegramEvents,
} from "../db/schema.js";
import { requireAuth } from "../middleware/auth.js";
import {
  applyTelegramCapture,
  supportsGeminiIntentParsing,
  telegramCommandHelpText,
  TELEGRAM_BOT_COMMANDS,
  type CaptureSourceType,
} from "../services/telegram-capture.js";
import { getUserId } from "../utils/user-context.js";

const telegramRoute = new Hono();

telegramRoute.use("/integrations/telegram/connection", requireAuth);
telegramRoute.use("/integrations/telegram/link-code", requireAuth);

const LINK_CODE_TTL_MS = 30 * 60 * 1000;

let openAIClient: OpenAI | null | undefined;

interface TelegramUser {
  id: number;
  username?: string;
}

interface TelegramChat {
  id: number | string;
  type: string;
  username?: string;
}

interface TelegramVoice {
  file_id: string;
  file_unique_id: string;
  mime_type?: string;
}

interface TelegramMessage {
  date?: number;
  text?: string;
  caption?: string;
  voice?: TelegramVoice;
  chat: TelegramChat;
  from?: TelegramUser;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

type LinkTelegramChatResult =
  | {
      success: true;
      connectionId: string;
      text: string;
    }
  | {
      success: false;
      text: string;
    };

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function getTelegramConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim() ?? "";
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";

  return {
    botToken,
    botUsername: botUsername || null,
    botUrl: botUsername ? `https://t.me/${botUsername}` : null,
    webhookSecret: webhookSecret || null,
    configured: Boolean(botToken),
    voiceTranscriptionEnabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
    geminiIntentEnabled: supportsGeminiIntentParsing(),
  };
}

function getOpenAIClient(): OpenAI | null {
  if (openAIClient !== undefined) {
    return openAIClient;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  openAIClient = apiKey ? new OpenAI({ apiKey }) : null;
  return openAIClient;
}

async function telegramApi<T>(method: string, body?: unknown): Promise<T> {
  const config = getTelegramConfig();

  if (!config.botToken) {
    throw new Error("Telegram bot is not configured on the server.");
  }

  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/${method}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Telegram API ${method} failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as {
    ok: boolean;
    result?: T;
    description?: string;
  };

  if (!payload.ok || payload.result === undefined) {
    throw new Error(payload.description ?? `Telegram API ${method} failed.`);
  }

  return payload.result;
}

async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  try {
    await telegramApi("sendMessage", {
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    });
    return true;
  } catch (error) {
    console.error("Telegram reply failed:", error);
    return false;
  }
}

async function transcribeVoiceNote(voice: TelegramVoice): Promise<string> {
  const openai = getOpenAIClient();

  if (!openai) {
    throw new Error("Voice transcription is not configured on the server.");
  }

  const fileInfo = await telegramApi<{ file_path?: string }>(
    `getFile?file_id=${encodeURIComponent(voice.file_id)}`,
  );

  if (!fileInfo.file_path) {
    throw new Error("Telegram did not return a downloadable file path.");
  }

  const config = getTelegramConfig();
  const fileResponse = await fetch(
    `https://api.telegram.org/file/bot${config.botToken}/${fileInfo.file_path}`,
  );

  if (!fileResponse.ok) {
    throw new Error(`Telegram file download failed with status ${fileResponse.status}.`);
  }

  const fileBlob = await fileResponse.blob();
  const fileName = fileInfo.file_path.split("/").pop() ?? `${voice.file_unique_id}.ogg`;
  const audioFile = new File([await fileBlob.arrayBuffer()], fileName, {
    type: voice.mime_type || fileBlob.type || "audio/ogg",
  });

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "gpt-4o-mini-transcribe",
  });

  return normalizeWhitespace(transcription.text);
}

function extractLinkCode(text: string): string | null {
  const directMatch = text.match(/^\/link(?:@\w+)?\s+([A-Za-z0-9_-]+)$/i);
  if (directMatch) {
    return directMatch[1].toUpperCase();
  }

  const startMatch = text.match(/^\/start(?:@\w+)?\s+link[_-]?([A-Za-z0-9_-]+)$/i);
  if (startMatch) {
    return startMatch[1].toUpperCase();
  }

  return null;
}

async function generateUniqueLinkCode(): Promise<string> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = randomBytes(4).toString("hex").toUpperCase();
    const [existing] = await db
      .select({ id: telegramConnections.id })
      .from(telegramConnections)
      .where(eq(telegramConnections.linkCode, candidate))
      .limit(1);

    if (!existing) {
      return candidate;
    }
  }

  throw new Error("Unable to generate a unique Telegram link code.");
}

async function getConnectionForUser(userId: string) {
  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.userId, userId))
    .limit(1);

  return connection ?? null;
}

async function getConnectionForChat(chatId: string) {
  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.telegramChatId, chatId))
    .limit(1);

  return connection ?? null;
}

async function getConnectionForCode(code: string) {
  const [connection] = await db
    .select()
    .from(telegramConnections)
    .where(eq(telegramConnections.linkCode, code))
    .limit(1);

  if (
    !connection ||
    !connection.linkCodeExpiresAt ||
    connection.linkCodeExpiresAt.getTime() < Date.now()
  ) {
    return null;
  }

  return connection;
}

function serializeConnectionState(
  connection: Awaited<ReturnType<typeof getConnectionForUser>> | null,
) {
  const config = getTelegramConfig();
  const linkCodeExpiresAt = connection?.linkCodeExpiresAt ?? null;
  const linkCodeActive =
    Boolean(connection?.linkCode) &&
    linkCodeExpiresAt instanceof Date &&
    linkCodeExpiresAt.getTime() > Date.now();

  const status = !config.configured
    ? "unconfigured"
    : connection?.telegramChatId
      ? "linked"
      : linkCodeActive
        ? "pending"
        : "not-linked";

  const deepLinkUrl =
    status === "pending" && config.botUsername && connection?.linkCode
      ? `${config.botUrl}?start=link_${connection.linkCode}`
      : null;

  return {
    configured: config.configured,
    voiceTranscriptionEnabled: config.voiceTranscriptionEnabled,
    geminiIntentEnabled: config.geminiIntentEnabled,
    status,
    botUsername: config.botUsername,
    botUrl: config.botUrl,
    deepLinkUrl,
    linkCode: status === "pending" ? connection?.linkCode ?? null : null,
    linkCodeExpiresAt:
      status === "pending" && linkCodeExpiresAt
        ? linkCodeExpiresAt.toISOString()
        : null,
    telegramUsername: connection?.telegramUsername ?? null,
    telegramChatId: connection?.telegramChatId ?? null,
    linkedAt: connection?.linkedAt?.toISOString() ?? null,
  };
}

async function updateTelegramEvent(
  eventId: string,
  patch: Partial<{
    connectionId: string | null;
    parsedIntent: Record<string, unknown>;
    status: string;
    error: string | null;
    processedAt: Date;
  }>,
) {
  await db
    .update(telegramEvents)
    .set({
      ...patch,
      updatedAt: new Date(),
    })
    .where(eq(telegramEvents.id, eventId));
}

async function createOrRefreshLinkCode(userId: string) {
  const existing = await getConnectionForUser(userId);

  if (existing?.telegramChatId) {
    throw new Error("Disconnect the current Telegram connection before generating a new link code.");
  }

  const linkCode = await generateUniqueLinkCode();
  const expiresAt = new Date(Date.now() + LINK_CODE_TTL_MS);

  if (existing) {
    await db
      .update(telegramConnections)
      .set({
        status: "pending",
        linkCode,
        linkCodeExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(telegramConnections.id, existing.id));
  } else {
    await db.insert(telegramConnections).values({
      userId,
      status: "pending",
      linkCode,
      linkCodeExpiresAt: expiresAt,
    });
  }

  return getConnectionForUser(userId);
}

async function linkTelegramChat(
  code: string,
  message: TelegramMessage,
): Promise<LinkTelegramChatResult> {
  const connection = await getConnectionForCode(code);

  if (!connection) {
    return {
      success: false,
      text: "That link code is invalid or expired. Generate a fresh code from LifeOS Settings.",
    };
  }

  const chatId = String(message.chat.id);
  const existingChatConnection = await getConnectionForChat(chatId);

  if (existingChatConnection && existingChatConnection.userId !== connection.userId) {
    return {
      success: false,
      text: "This Telegram chat is already linked to another LifeOS account.",
    };
  }

  await db
    .update(telegramConnections)
    .set({
      telegramChatId: chatId,
      telegramUserId: message.from ? String(message.from.id) : null,
      telegramUsername: message.from?.username ?? message.chat.username ?? null,
      status: "linked",
      linkCode: null,
      linkCodeExpiresAt: null,
      linkedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(telegramConnections.id, connection.id));

  return {
    success: true,
    connectionId: connection.id,
    text: [
      "Telegram is now linked to your LifeOS account.",
      "Use /done gym, /bible Genesis 12, /journal ..., or plain language like \"I completed gym\".",
    ].join("\n"),
  };
}

function getUnlinkedReplyText() {
  const config = getTelegramConfig();
  const lines = [
    "This chat is not linked yet. Generate a code in LifeOS Settings, then send /link YOUR_CODE here.",
    "",
    telegramCommandHelpText(config.botUrl),
  ];

  return lines.join("\n");
}

function getLinkedHelpReply() {
  const config = getTelegramConfig();
  const lines = [telegramCommandHelpText(config.botUrl)];

  if (config.geminiIntentEnabled) {
    lines.push("", "Gemini fallback parsing is enabled for fuzzy natural-language messages.");
  }

  return lines.join("\n");
}

export async function syncTelegramBotCommands(): Promise<void> {
  const config = getTelegramConfig();
  if (!config.configured) {
    return;
  }

  try {
    await telegramApi("setMyCommands", {
      commands: TELEGRAM_BOT_COMMANDS,
    });
    console.log("Telegram bot commands synced.");
  } catch (error) {
    console.warn("Telegram bot command sync failed:", error);
  }
}

telegramRoute.get("/integrations/telegram/connection", async (c) => {
  const userId = getUserId(c);
  const connection = await getConnectionForUser(userId);
  return c.json(serializeConnectionState(connection));
});

telegramRoute.post("/integrations/telegram/link-code", async (c) => {
  const config = getTelegramConfig();
  if (!config.configured) {
    return c.json({ error: "Telegram bot is not configured on the server." }, 503);
  }

  const userId = getUserId(c);

  try {
    const connection = await createOrRefreshLinkCode(userId);
    return c.json(serializeConnectionState(connection));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate Telegram link code.";
    const status = message.includes("Disconnect the current Telegram connection") ? 409 : 500;
    return c.json({ error: message }, status);
  }
});

telegramRoute.delete("/integrations/telegram/connection", async (c) => {
  const userId = getUserId(c);

  await db.delete(telegramConnections).where(eq(telegramConnections.userId, userId));

  return c.json({
    ...serializeConnectionState(null),
    status: getTelegramConfig().configured ? "not-linked" : "unconfigured",
  });
});

telegramRoute.post("/integrations/telegram/webhook", async (c) => {
  const config = getTelegramConfig();

  if (!config.configured) {
    return c.json({ error: "Telegram bot is not configured on the server." }, 503);
  }

  if (config.webhookSecret) {
    const secretHeader = c.req.header("X-Telegram-Bot-Api-Secret-Token");
    if (secretHeader !== config.webhookSecret) {
      return c.json({ error: "Unauthorized" }, 401);
    }
  }

  const update = await c.req.json<TelegramUpdate>();

  if (typeof update.update_id !== "number") {
    return c.json({ error: "Invalid Telegram update payload." }, 400);
  }

  const message = update.message ?? update.edited_message;
  const chatId = message ? String(message.chat.id) : null;
  const fromId = message?.from ? String(message.from.id) : null;
  const updateType =
    message?.voice ? "voice" : message?.text || message?.caption ? "text" : "unsupported";

  const [eventRecord] = await db
    .insert(telegramEvents)
    .values({
      telegramUpdateId: String(update.update_id),
      telegramChatId: chatId,
      telegramUserId: fromId,
      updateType,
      payload: update,
    })
    .onConflictDoNothing({
      target: [telegramEvents.telegramUpdateId],
    })
    .returning({ id: telegramEvents.id });

  if (!eventRecord) {
    return c.json({ ok: true, duplicate: true });
  }

  const eventId = eventRecord.id;

  try {
    if (!message) {
      await updateTelegramEvent(eventId, {
        status: "ignored",
        processedAt: new Date(),
      });
      return c.json({ ok: true, ignored: true });
    }

    if (message.chat.type !== "private") {
      await sendTelegramMessage(
        String(message.chat.id),
        "Use this bot in a private chat so LifeOS entries stay tied to your account.",
      );
      await updateTelegramEvent(eventId, {
        status: "ignored",
        processedAt: new Date(),
      });
      return c.json({ ok: true });
    }

    const rawText = normalizeWhitespace(message.text ?? message.caption ?? "");
    const linkCode = rawText ? extractLinkCode(rawText) : null;

    if (linkCode) {
      const linkResult = await linkTelegramChat(linkCode, message);
      const replySent = await sendTelegramMessage(String(message.chat.id), linkResult.text);

      await updateTelegramEvent(eventId, {
        status: linkResult.success
          ? replySent
            ? "linked"
            : "linked_reply_failed"
          : "link_failed",
        connectionId: linkResult.success ? linkResult.connectionId : null,
        processedAt: new Date(),
      });

      return c.json({ ok: true });
    }

    const connection = await getConnectionForChat(String(message.chat.id));

    if (/^\/(?:start|help|commands)(?:@\w+)?$/i.test(rawText)) {
      const replySent = await sendTelegramMessage(
        String(message.chat.id),
        connection ? getLinkedHelpReply() : getUnlinkedReplyText(),
      );
      await updateTelegramEvent(eventId, {
        connectionId: connection?.id ?? null,
        status: replySent ? "helped" : "help_reply_failed",
        processedAt: new Date(),
      });
      return c.json({ ok: true });
    }

    if (!connection) {
      const replySent = await sendTelegramMessage(String(message.chat.id), getUnlinkedReplyText());
      await updateTelegramEvent(eventId, {
        status: replySent ? "unlinked" : "unlinked_reply_failed",
        processedAt: new Date(),
      });
      return c.json({ ok: true });
    }

    let inputText = rawText;
    let sourceType: CaptureSourceType = "text";

    if (!inputText && message.voice) {
      inputText = await transcribeVoiceNote(message.voice);
      sourceType = "voice";
    }

    if (!inputText) {
      const replySent = await sendTelegramMessage(
        String(message.chat.id),
        "I could not extract any text from that message. Send text directly or enable server transcription for voice notes.",
      );

      await updateTelegramEvent(eventId, {
        connectionId: connection.id,
        status: replySent ? "empty" : "empty_reply_failed",
        processedAt: new Date(),
      });

      return c.json({ ok: true });
    }

    const result = await applyTelegramCapture(
      connection.userId,
      inputText,
      sourceType,
      message.date,
    );
    const replySent = await sendTelegramMessage(String(message.chat.id), result.replyText);

    await updateTelegramEvent(eventId, {
      connectionId: connection.id,
      parsedIntent: result.parsedIntent,
      status: replySent ? "processed" : "processed_reply_failed",
      processedAt: new Date(),
    });

    return c.json({ ok: true });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Telegram processing failed.";

    await updateTelegramEvent(eventId, {
      status: "failed",
      error: messageText,
      processedAt: new Date(),
    });

    if (chatId) {
      await sendTelegramMessage(chatId, `LifeOS could not process that message: ${messageText}`);
    }

    return c.json({ error: messageText }, 500);
  }
});

export default telegramRoute;

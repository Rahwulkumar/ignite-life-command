import { supportsGeminiIntentParsing } from "./telegram-capture.js";

export interface TelegramRuntimeConfig {
  botToken: string;
  botUsername: string | null;
  botUrl: string | null;
  webhookSecret: string | null;
  skipWebhookSecretCheck: boolean;
  configured: boolean;
  voiceTranscriptionEnabled: boolean;
  geminiIntentEnabled: boolean;
}

export function getTelegramConfig(): TelegramRuntimeConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const botUsername = process.env.TELEGRAM_BOT_USERNAME?.trim() ?? "";
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim() ?? "";
  const skipWebhookSecretCheck =
    process.env.TELEGRAM_SKIP_WEBHOOK_SECRET_CHECK?.trim() === "true" ||
    webhookSecret === "put_a_random_long_secret_here";

  return {
    botToken,
    botUsername: botUsername || null,
    botUrl: botUsername ? `https://t.me/${botUsername}` : null,
    webhookSecret: webhookSecret || null,
    skipWebhookSecretCheck,
    configured: Boolean(botToken),
    voiceTranscriptionEnabled: Boolean(process.env.OPENAI_API_KEY?.trim()),
    geminiIntentEnabled: supportsGeminiIntentParsing(),
  };
}

export async function telegramApi<T>(method: string, body?: unknown): Promise<T> {
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

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
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

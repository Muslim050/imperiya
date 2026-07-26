/**
 * Telegram Bot API transport for site leads. Server-only — the token must
 * never reach the browser bundle, so nothing here may be imported from a
 * "use client" module.
 *
 * Setup (once):
 *   1. Create a bot: write to @BotFather → /newbot → copy the token.
 *   2. Add the bot to the managers' group (or just open a private chat with it)
 *      and send any message there.
 *   3. Get the chat id: https://api.telegram.org/bot<TOKEN>/getUpdates →
 *      result[].message.chat.id  (group ids are negative, e.g. -1001234567890).
 *   4. Put both into TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID
 *      (.env.local for dev, Vercel project env vars for production).
 */

/** Telegram rejects messages longer than 4096 characters. */
const MAX_MESSAGE_LENGTH = 3900;

const API_TIMEOUT_MS = 8000;

export function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  /** Comma-separated so several managers/groups can receive the same lead. */
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return { token, chatIds, configured: Boolean(token && chatIds.length) };
}

/** Escapes the three characters Telegram's HTML parse mode treats as markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Splits on line breaks so a long order (up to 20 items) arrives as a few
 * readable messages instead of being rejected by the API.
 */
function splitMessage(text: string): string[] {
  if (text.length <= MAX_MESSAGE_LENGTH) return [text];

  const chunks: string[] = [];
  let current = "";
  for (const line of text.split("\n")) {
    if (current && current.length + line.length + 1 > MAX_MESSAGE_LENGTH) {
      chunks.push(current);
      current = "";
    }
    current += (current ? "\n" : "") + line.slice(0, MAX_MESSAGE_LENGTH);
  }
  if (current) chunks.push(current);
  return chunks;
}

async function callSendMessage(token: string, chatId: string, text: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Telegram sendMessage ${response.status}: ${body.slice(0, 300)}`,
    );
  }
}

/**
 * Delivers one HTML-formatted message to every configured chat.
 * Resolves if at least one chat accepted it — a single dead chat id (bot
 * kicked out of a group, say) must not lose the lead.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const { token, chatIds, configured } = getTelegramConfig();
  if (!configured || !token) {
    throw new Error("Telegram is not configured");
  }

  const chunks = splitMessage(text);
  const errors: unknown[] = [];
  let delivered = 0;

  for (const chatId of chatIds) {
    try {
      // Sequential per chat: Telegram rate-limits bursts to the same chat and
      // the parts must arrive in order.
      for (const chunk of chunks) {
        await callSendMessage(token, chatId, chunk);
      }
      delivered += 1;
    } catch (error) {
      errors.push(error);
    }
  }

  if (delivered === 0) {
    throw new AggregateError(errors, "Telegram delivery failed for every chat");
  }
  if (errors.length) {
    console.warn("[telegram] partial delivery failure", errors);
  }
}

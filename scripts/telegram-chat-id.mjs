#!/usr/bin/env node
/**
 * Помощник для настройки заявок в Telegram: печатает chat_id всех чатов,
 * в которых бот видел сообщения, и объясняет, что делать, если их нет.
 *
 * Запуск:  node scripts/telegram-chat-id.mjs
 *
 * Токен читается из .env.local (или .env) и НИКОГДА не печатается в вывод —
 * его можно спокойно копировать в чат/тикет вместе с ответом скрипта.
 *
 * Нужен, когда меняется чат для заявок: id группы меняется, если она станет
 * супергруппой (включили темы, публичную ссылку, добавили много участников).
 */
import { readFileSync } from "node:fs";

const ENV_FILES = [".env.local", ".env"];

function readToken() {
  for (const file of ENV_FILES) {
    try {
      const line = readFileSync(file, "utf8")
        .split(/\r?\n/)
        .find((l) => /^\s*TELEGRAM_BOT_TOKEN\s*=/.test(l));
      const value = line
        ?.slice(line.indexOf("=") + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (value) return { token: value, source: file };
    } catch {
      // файла нет — пробуем следующий
    }
  }
  const fromEnv = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return fromEnv ? { token: fromEnv, source: "process.env" } : null;
}

async function api(token, method) {
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`);
  return response.json();
}

const found = readToken();
if (!found) {
  console.error(`
✗ TELEGRAM_BOT_TOKEN не заполнен.

  Открой .env.local и впиши токен от @BotFather:
      TELEGRAM_BOT_TOKEN=123456:AA...
  Затем запусти скрипт снова.
`);
  process.exit(1);
}

const { token, source } = found;
console.log(`Токен взят из ${source}\n`);

/* 1. Токен вообще рабочий? */
const me = await api(token, "getMe");
if (!me.ok) {
  console.error(`✗ Telegram отклонил токен: ${me.description ?? "неизвестная ошибка"}

  Причины: токен скопирован не полностью, отозван через BotFather
  (Revoke current token — тогда нужен новый), или взят от другого бота.
`);
  process.exit(1);
}
console.log(`✓ Бот: @${me.result.username} (${me.result.first_name})`);

/* 2. Не перехватывает ли обновления вебхук? */
const hook = await api(token, "getWebhookInfo");
if (hook.ok && hook.result.url) {
  console.error(`
✗ У бота установлен вебхук: ${hook.result.url}
  Пока он активен, getUpdates всегда пустой. Снять:
      https://api.telegram.org/bot<ТОКЕН>/deleteWebhook
`);
  process.exit(1);
}

/* 3. Собираем чаты из всех типов обновлений. */
const updates = await api(token, "getUpdates");
if (!updates.ok) {
  console.error(`✗ getUpdates: ${updates.description ?? "неизвестная ошибка"}`);
  process.exit(1);
}

const chats = new Map();
for (const update of updates.result) {
  const chat =
    update.message?.chat ??
    update.edited_message?.chat ??
    update.channel_post?.chat ??
    update.my_chat_member?.chat ??
    update.callback_query?.message?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.log(`
⚠ Обновлений нет — бот пока не видел ни одного сообщения.

  Что сделать (по порядку, до первого сработавшего):

  1. В группе отправь команду с явным упоминанием бота:
         /start@${me.result.username}
     Адресованную команду бот получает всегда, даже с включённым
     privacy mode. Простой /start в группе иногда до бота не доходит.

  2. Отключи privacy mode: @BotFather → /mybots → бот →
     Bot Settings → Group Privacy → Turn off. Потом удали бота из
     группы и добавь заново — это создаст новое обновление.

  3. Проверь, что бот реально в составе группы (открой список
     участников), и что токен от этого же бота: @${me.result.username}.

  После каждого шага запускай скрипт заново.
`);
  process.exit(0);
}

console.log(`\nНайденные чаты (${chats.size}):\n`);
for (const chat of chats.values()) {
  const name = chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" ");
  const kind = chat.type === "private" ? "личка" : chat.type;
  console.log(`  ${name || "без названия"} — ${kind}`);
  console.log(`  TELEGRAM_CHAT_ID=${chat.id}\n`);
}
console.log("Скопируй нужную строку TELEGRAM_CHAT_ID=… в .env.local.");

import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const WEB_APP_URL = "https://miniappprimer.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const update = await req.json();

    // Check if the update contains a message
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text.startsWith("/start")) {
        const welcomeText =
          `✨ *Добро пожаловать в бутик Maison de Parfum!* ✨\n\n` +
          `У нас вы найдёте нишевые и селективные ароматы, ` +
          `уход за кожей и премиальную косметику 100% подлинности.\n\n` +
          `Нажмите кнопку ниже, чтобы открыть каталог:`;

        // Telegram Bot API sendMessage payload with WebApp Inline Keyboard
        const payload = {
          chat_id: chatId,
          text: welcomeText,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🛍 Открыть магазин",
                  web_app: { url: WEB_APP_URL },
                },
              ],
              [
                {
                  text: "⚙️ Админ-панель",
                  web_app: { url: `${WEB_APP_URL}/admin` },
                },
              ],
            ],
          },
        };

        if (BOT_TOKEN) {
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Telegram webhook error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

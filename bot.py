import asyncio
import logging
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart, Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# Telegram Bot Token (obtain from @BotFather)
BOT_TOKEN = os.getenv("BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
WEB_APP_URL = os.getenv("WEB_APP_URL", "https://miniappprimer.vercel.app")

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    # Keyboard with Web App button
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="🛍 Открыть магазин",
                web_app=WebAppInfo(url=WEB_APP_URL)
            )
        ],
        [
            InlineKeyboardButton(
                text="⚙️ Админ-панель",
                web_app=WebAppInfo(url=f"{WEB_APP_URL}/admin")
            )
        ]
    ])

    welcome_text = (
        f"✨ **Добро пожаловать в бутик Maison de Parfum!** ✨\n\n"
        f"У нас вы найдёте нишевые и селективные ароматы, "
        f"уход за кожей и премиальную косметику с гарантией подлинности 100%.\n\n"
        f"Нажмите кнопку ниже, чтобы открыть каталог:"
    )

    await message.answer(
        welcome_text,
        reply_markup=keyboard,
        parse_mode="Markdown"
    )

@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    await message.answer(
        "ℹ️ **Справка**\n\n"
        "• Для просмотра каталога нажмите на кнопку **«Открыть магазин»**.\n"
        "• По всем вопросам обращайтесь к менеджеру.",
        parse_mode="Markdown"
    )

async main():
    print("Бот успешно запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

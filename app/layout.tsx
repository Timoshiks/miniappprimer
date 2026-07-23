import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";

export const metadata: Metadata = {
  title: "Maison de Parfum - Telegram Mini App",
  description: "Бутик премиальной парфюмерии и косметики",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-gray-100 min-h-screen text-[#111827] antialiased">
        <TelegramProvider>{children}</TelegramProvider>
      </body>
    </html>
  );
}

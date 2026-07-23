"use client";

import { useEffect, createContext, useContext, useState, ReactNode } from "react";

interface TelegramContextType {
  webApp: any;
  user: any;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        setWebApp(tg);
        setUser(tg.initDataUnsafe?.user || null);
        setIsReady(true);
      } else {
        // Fallback for browser dev mode
        setIsReady(true);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}

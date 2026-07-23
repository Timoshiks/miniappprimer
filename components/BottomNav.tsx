"use client";

import React from "react";
import { Home, Grid3x3, Info, ShoppingCart } from "lucide-react";
import { ActiveTab } from "@/lib/types";

interface BottomNavProps {
  tab: ActiveTab;
  setTab: (tab: ActiveTab) => void;
  cartCount: number;
}

export default function BottomNav({ tab, setTab, cartCount }: BottomNavProps) {
  const tabs = [
    { key: "home" as ActiveTab, label: "Главная", icon: Home },
    { key: "catalog" as ActiveTab, label: "Каталог", icon: Grid3x3 },
    { key: "about" as ActiveTab, label: "Инфо", icon: Info },
    { key: "cart" as ActiveTab, label: "Корзина", icon: ShoppingCart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md bg-white/95 backdrop-blur-md border-t border-gray-100 flex z-40">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative transition-colors"
          >
            <div className="relative">
              <Icon
                size={20}
                strokeWidth={active ? 2.1 : 1.6}
                className={active ? "text-[#8B5CF6]" : "text-gray-400"}
                fill={active && t.key === "cart" && cartCount > 0 ? "#8B5CF6" : "none"}
              />
              {t.key === "cart" && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full bg-[#8B5CF6] text-white text-[9px] font-bold flex items-center justify-center px-[3px]">
                  {cartCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${active ? "text-[#8B5CF6]" : "text-gray-400"}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

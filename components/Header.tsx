"use client";

import React from "react";
import { Search, ShoppingCart } from "lucide-react";
import { ActiveTab } from "@/lib/types";

interface HeaderProps {
  query: string;
  setQuery: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ query, setQuery, cartCount, onOpenCart }: HeaderProps) {
  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 pt-4 pb-3 border-b border-gray-50">
      <div className="flex items-center justify-between mb-3 relative">
        <div className="w-8" />
        <h1 className="text-[15px] font-bold tracking-[0.14em] text-[#111827] text-center uppercase">
          Maison de Parfum
        </h1>
        {/* Quick Floating Cart Button with Counter Badge */}
        <button
          onClick={onOpenCart}
          aria-label="Корзина"
          className="relative h-9 w-9 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-gray-200 text-[#111827] transition-transform active:scale-95"
        >
          <ShoppingCart size={18} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center px-[3px] shadow-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по бренду или названию..."
          className="w-full rounded-full bg-[#F9FAFB]/80 border border-gray-100 backdrop-blur-sm pl-9 pr-4 py-2.5 text-[13px] text-[#111827] placeholder-gray-400 outline-none focus:border-[#E0C3FC] transition-colors"
        />
      </div>
    </div>
  );
}

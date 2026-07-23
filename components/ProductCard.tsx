"use client";

import React from "react";
import Image from "next/image";
import { ShoppingCart, Sparkles, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  inCart: boolean;
  onToggleCart: (id: string) => void;
  onOpenDetails: (product: Product) => void;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU") + " ₽";
}

export default function ProductCard({
  product,
  inCart,
  onToggleCart,
  onOpenDetails,
}: ProductCardProps) {
  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="relative rounded-2xl bg-[#F9FAFB] p-3 flex flex-col justify-between border border-gray-100/60 shadow-sm transition-transform active:scale-[0.99]">
      {/* Interactive Cart Toggle Button with Instant Highlight */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleCart(product.id);
        }}
        aria-label={inCart ? "Убрать из корзины" : "Добавить в корзину"}
        className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          inCart
            ? "bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 scale-105"
            : "bg-white text-gray-400 border border-gray-200 hover:text-gray-600"
        }`}
      >
        <ShoppingCart size={15} fill={inCart ? "currentColor" : "none"} strokeWidth={1.8} />
      </button>

      <div>
        {/* Compressed Product Image / Visual Container */}
        <div
          onClick={() => onOpenDetails(product)}
          className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#EDE4FB] to-[#F9FAFB] flex items-center justify-center mb-3 overflow-hidden cursor-pointer relative group"
        >
          {imageSrc && (imageSrc.startsWith("/") || imageSrc.startsWith("http") || imageSrc.startsWith("data:")) ? (
            <img
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Sparkles className="text-[#C4B5FD] transition-transform duration-300 group-hover:scale-110" size={34} strokeWidth={1.2} />
          )}
        </div>

        {/* Product Brand & Title */}
        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
          {product.brand}
        </p>
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-[14px] font-semibold text-[#111827] leading-tight mt-0.5 cursor-pointer hover:text-[#8B5CF6] transition-colors"
        >
          {product.title}
        </h3>
        <p className="text-[12px] text-gray-400 mt-0.5">{product.volume}</p>
      </div>

      {/* Price & Details CTA */}
      <div className="flex items-center justify-between mt-3 pt-1 border-t border-gray-100/50">
        <span className="text-[14px] font-bold text-[#111827]">{formatPrice(product.price)}</span>
        <button
          onClick={() => onOpenDetails(product)}
          className="text-[12px] font-medium text-[#8B5CF6] flex items-center gap-0.5 hover:underline"
        >
          Подробнее <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

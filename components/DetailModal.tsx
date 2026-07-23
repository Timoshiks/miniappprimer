"use client";

import React from "react";
import { X, Sparkles, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "./ProductCard";

interface DetailModalProps {
  product: Product | null;
  onClose: () => void;
  inCart: boolean;
  onToggleCart: (id: string) => void;
}

export default function DetailModal({
  product,
  onClose,
  inCart,
  onToggleCart,
}: DetailModalProps) {
  if (!product) return null;

  const imageSrc = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      />

      {/* Slide-over Container */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl px-5 pt-4 pb-6 max-h-[88%] overflow-y-auto no-scrollbar animate-slideup shadow-2xl z-10">
        {/* Top Handle Pill */}
        <div className="mx-auto h-1 w-10 rounded-full bg-gray-200 mb-4" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-5 h-8 w-8 flex items-center justify-center rounded-full bg-[#F9FAFB] text-gray-500 hover:text-gray-900 border border-gray-100"
        >
          <X size={16} />
        </button>

        {/* Large Image / Gallery */}
        <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#EDE4FB] to-[#F9FAFB] flex items-center justify-center mb-4 overflow-hidden relative border border-gray-100">
          {imageSrc && (imageSrc.startsWith("/") || imageSrc.startsWith("http") || imageSrc.startsWith("data:")) ? (
            <img
              src={imageSrc}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Sparkles className="text-[#C4B5FD]" size={56} strokeWidth={1.2} />
          )}
        </div>

        {/* Category & Title */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">
            {product.brand} · {product.category}
          </p>
          <span className="text-[11px] bg-purple-50 text-[#8B5CF6] font-medium px-2.5 py-0.5 rounded-full">
            {product.volume}
          </span>
        </div>
        <h2 className="text-[20px] font-bold text-[#111827] mt-1">{product.title}</h2>

        {/* Description */}
        <p className="text-[14px] text-gray-600 leading-relaxed mt-3">{product.description}</p>

        {/* Fragrance Notes / Details Pyramid */}
        {product.notes && (
          <div className="mt-4 rounded-2xl bg-[#F9FAFB] p-4 space-y-2.5 border border-gray-100/80">
            <p className="text-[12px] font-semibold text-[#111827] mb-1 uppercase tracking-wider">
              Пирамида нот / детали
            </p>
            {product.notes.top && (
              <div className="flex gap-3 items-baseline">
                <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0 uppercase tracking-wide">
                  Верх
                </span>
                <span className="text-[13px] text-[#111827]">{product.notes.top}</span>
              </div>
            )}
            {product.notes.heart && (
              <div className="flex gap-3 items-baseline">
                <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0 uppercase tracking-wide">
                  Сердце
                </span>
                <span className="text-[13px] text-[#111827]">{product.notes.heart}</span>
              </div>
            )}
            {product.notes.base && (
              <div className="flex gap-3 items-baseline">
                <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0 uppercase tracking-wide">
                  База
                </span>
                <span className="text-[13px] text-[#111827]">{product.notes.base}</span>
              </div>
            )}
          </div>
        )}

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-6 pt-3 border-t border-gray-100">
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Стоимость</p>
            <span className="text-[20px] font-bold text-[#111827]">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={() => onToggleCart(product.id)}
            className={`flex items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-semibold transition-all duration-200 shadow-md ${
              inCart
                ? "bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30"
                : "bg-[#111827] text-white shadow-black/20 hover:bg-[#20293a]"
            }`}
          >
            <ShoppingCart size={16} fill={inCart ? "currentColor" : "none"} />
            {inCart ? "В корзине ✓" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ShoppingCart, Plus, Minus, Trash2, Sparkles, Send } from "lucide-react";
import { Product, CartItem } from "@/lib/types";
import { formatPrice } from "./ProductCard";

interface CartPageProps {
  cart: Record<string, number>;
  products: Product[];
  onChangeQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartPage({
  cart,
  products,
  onChangeQty,
  onRemoveItem,
  onClearCart,
}: CartPageProps) {
  const managerUsername = process.env.NEXT_PUBLIC_TELEGRAM_MANAGER_USERNAME || "parfum_manager";

  const cartItems: CartItem[] = products
    .filter((p) => cart[p.id] && cart[p.id] > 0)
    .map((p) => ({ ...p, qty: cart[p.id] }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckoutViaTelegram = () => {
    if (cartItems.length === 0) return;

    // 1. Format order text into a clean plain text message
    let orderText = `✨ *Новый заказ из Maison de Parfum*\n\n`;
    cartItems.forEach((item, index) => {
      orderText += `${index + 1}. *${item.brand} — ${item.title}* (${item.volume})\n`;
      orderText += `   Количество: ${item.qty} шт. × ${formatPrice(item.price)} = ${formatPrice(item.price * item.qty)}\n\n`;
    });
    orderText += `💰 *Итого к оплате:* ${formatPrice(subtotal)}\n`;
    orderText += `\nПожалуйста, подтвердите наличие и детали доставки.`;

    // 2. Encode message for deep link
    const encodedText = encodeURIComponent(orderText);
    const deepLinkUrl = `https://t.me/${managerUsername}?text=${encodedText}`;

    // 3. Open Telegram Manager Chat via Telegram SDK or window.open
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink(deepLinkUrl);
    } else {
      window.open(deepLinkUrl, "_blank");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="px-4 pt-4 pb-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-[#F9FAFB] flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
          <ShoppingCart size={32} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-[16px] font-bold text-[#111827]">Ваша корзина пуста</h2>
        <p className="text-[13px] text-gray-400 mt-1.5 max-w-[240px]">
          Выберите понравившиеся ароматы в каталоге
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Top Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#111827]">Корзина</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {cartItems.length} позиций на сумму {formatPrice(subtotal)}
          </p>
        </div>
        <button
          onClick={onClearCart}
          className="text-[12px] text-red-500 hover:underline font-medium"
        >
          Очистить
        </button>
      </div>

      {/* Cart Items List */}
      <div className="px-4 mt-2 space-y-3">
        {cartItems.map((item) => {
          const imageSrc = item.images && item.images.length > 0 ? item.images[0] : null;

          return (
            <div
              key={item.id}
              className="flex gap-3 rounded-2xl bg-[#F9FAFB] p-3 border border-gray-100/80 shadow-xs relative"
            >
              {/* Product Thumbnail */}
              <div className="h-20 w-20 shrink-0 rounded-xl bg-gradient-to-br from-[#EDE4FB] to-white flex items-center justify-center overflow-hidden border border-purple-50">
                {imageSrc && (imageSrc.startsWith("/") || imageSrc.startsWith("http") || imageSrc.startsWith("data:")) ? (
                  <img src={imageSrc} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="text-[#C4B5FD]" size={24} strokeWidth={1.2} />
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                      {item.brand}
                    </p>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                      aria-label="Удалить"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="text-[13.5px] font-semibold text-[#111827] leading-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11.5px] text-gray-400">{item.volume}</p>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                  <span className="text-[14px] font-bold text-[#111827]">
                    {formatPrice(item.price * item.qty)}
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-1.5 py-1 border border-gray-200 shadow-2xs">
                    <button
                      onClick={() => onChangeQty(item.id, -1)}
                      className="h-6 w-6 flex items-center justify-center rounded-full text-[#111827] hover:bg-gray-100"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-[12.5px] font-semibold min-w-[16px] text-center">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => onChangeQty(item.id, 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-full bg-[#8B5CF6] text-white hover:bg-[#7c4dff]"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Checkout Button (Fixed above Bottom Navigation Bar) */}
      <div className="fixed bottom-[64px] left-0 right-0 mx-auto max-w-md px-4 z-30">
        <button
          onClick={handleCheckoutViaTelegram}
          className="w-full rounded-2xl bg-[#111827] text-white py-3.5 px-5 flex items-center justify-between shadow-xl shadow-black/20 active:scale-[0.98] transition-all hover:bg-[#1f2937]"
        >
          <div className="flex items-center gap-2">
            <Send size={16} className="text-[#C4B5FD]" />
            <span className="text-[14px] font-semibold">Оформить в Telegram</span>
          </div>
          <span className="text-[14px] font-bold text-[#C4B5FD]">
            {formatPrice(subtotal)}
          </span>
        </button>
      </div>
    </div>
  );
}

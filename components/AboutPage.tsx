"use client";

import React from "react";
import { Leaf, ShieldCheck, Truck, MessageCircle, Send } from "lucide-react";
import FAQAccordion from "./FAQAccordion";
import { FAQ } from "@/lib/mock-data";

export default function AboutPage() {
  const managerUsername = process.env.NEXT_PUBLIC_TELEGRAM_MANAGER_USERNAME || "parfum_manager";

  const handleOpenContact = () => {
    const tg = (window as any).Telegram?.WebApp;
    const url = `https://t.me/${managerUsername}`;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="px-4 pt-3 pb-8 space-y-5">
      <div>
        <h1 className="text-[18px] font-bold text-[#111827]">О бутике Maison de Parfum</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">Информация, гарантии и частые вопросы</p>
      </div>

      {/* Brand Description */}
      <section className="rounded-2xl bg-[#F9FAFB] p-4 border border-gray-100 shadow-xs">
        <p className="text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider mb-1.5">
          О нашем бренде
        </p>
        <p className="text-[13.5px] text-[#111827] leading-relaxed">
          Maison de Parfum — бутик премиальной парфюмерии и косметики. Мы работаем напрямую с официальными дистрибьюторами европейских парфюмерных домов, отбирая нишевые и селективные композиции с соблюдением строгого температурного режима хранения.
        </p>
      </section>

      {/* Guarantees & Features */}
      <section className="rounded-2xl bg-[#F9FAFB] p-4 border border-gray-100 space-y-3">
        <p className="text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider mb-2">
          Гарантии и преимущества
        </p>
        
        <div className="flex gap-3 items-start">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-purple-100 shadow-xs">
            <ShieldCheck size={16} className="text-[#8B5CF6]" strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#111827]">100% Оригинальная продукция</h4>
            <p className="text-[12.5px] text-gray-500 leading-snug mt-0.5">
              Каждая единица товара имеет сертификат подлинности и штрихкод для проверки.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start pt-2 border-t border-gray-100/60">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-purple-100 shadow-xs">
            <Leaf size={16} className="text-[#8B5CF6]" strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#111827]">Дерматологический контроль</h4>
            <p className="text-[12.5px] text-gray-500 leading-snug mt-0.5">
              Все составы косметики гипоаллергенны и прошли европейскую сертификацию.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start pt-2 border-t border-gray-100/60">
          <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-purple-100 shadow-xs">
            <Truck size={16} className="text-[#8B5CF6]" strokeWidth={1.8} />
          </div>
          <div>
            <h4 className="text-[13px] font-semibold text-[#111827]">Бережная доставка</h4>
            <p className="text-[12.5px] text-gray-500 leading-snug mt-0.5">
              Курьерская экспресс-доставка в специальной термоизоляционной упаковке.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Contact Links */}
      <section className="rounded-2xl bg-gradient-to-br from-[#111827] to-[#1f2937] p-4 text-white flex items-center justify-between">
        <div>
          <h4 className="text-[14px] font-semibold">Консультация парфюмера</h4>
          <p className="text-[12px] text-gray-300 mt-0.5">Поможем подобрать идеальный аромат</p>
        </div>
        <button
          onClick={handleOpenContact}
          className="flex items-center gap-1.5 rounded-full bg-[#8B5CF6] text-white px-4 py-2 text-[12.5px] font-semibold hover:bg-[#7c4dff] transition-colors"
        >
          <Send size={14} /> Написать
        </button>
      </section>

      {/* FAQ Section */}
      <section>
        <p className="text-[11px] font-semibold text-[#8B5CF6] uppercase tracking-wider mb-2 px-1">
          Частые вопросы (FAQ)
        </p>
        <FAQAccordion items={FAQ} />
      </section>
    </div>
  );
}

"use client";

import React, { useMemo } from "react";
import CategoryPills from "./CategoryPills";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";

interface HomePageProps {
  products: Product[];
  query: string;
  cart: Record<string, number>;
  onToggleCart: (id: string) => void;
  onOpenDetails: (product: Product) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onViewCatalog: () => void;
}

export default function HomePage({
  products,
  query,
  cart,
  onToggleCart,
  onOpenDetails,
  activeCategory,
  setActiveCategory,
  onViewCatalog,
}: HomePageProps) {
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "Все" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, query, activeCategory]);

  return (
    <div className="pb-6">
      {/* Hero / Aesthetic Banner Section */}
      <div className="mx-4 mt-3 mb-4 rounded-3xl bg-gradient-to-br from-[#111827] via-[#1f1a29] to-[#2b2438] px-5 py-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-[#8B5CF6]/30 blur-2xl" />
        <div className="absolute right-4 bottom-2 opacity-10 font-serif text-6xl select-none font-italic">
          Niche
        </div>
        <p className="text-[11px] uppercase tracking-widest text-[#E0C3FC] font-semibold">
          Селективная коллекция
        </p>
        <h2 className="text-[20px] font-bold mt-1 leading-tight tracking-tight">
          Ароматы высокой<br />парфюмерии
        </h2>
        <p className="text-[12px] text-gray-300 mt-2 max-w-[220px] leading-relaxed">
          100% оригинальная продукция с гарантией подлинности
        </p>
        <button
          onClick={onViewCatalog}
          className="mt-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-[12px] font-medium text-white hover:bg-white/20 transition-colors"
        >
          Перейти в каталог →
        </button>
      </div>

      {/* Category Filters */}
      <div className="mb-3">
        <CategoryPills active={activeCategory} onChange={setActiveCategory} />
      </div>

      {/* Featured Products Section Header */}
      <div className="px-4 mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#111827]">Популярные позиции</h3>
        <span className="text-[12px] text-gray-400">{filtered.length} товаров</span>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-400 text-[13px]">
          По вашему запросу ничего не найдено
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              inCart={!!cart[p.id]}
              onToggleCart={onToggleCart}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

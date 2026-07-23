"use client";

import React, { useMemo, useState } from "react";
import CategoryPills from "./CategoryPills";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";

interface CatalogPageProps {
  products: Product[];
  query: string;
  cart: Record<string, number>;
  onToggleCart: (id: string) => void;
  onOpenDetails: (product: Product) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

const BATCH_SIZE = 6;

export default function CatalogPage({
  products,
  query,
  cart,
  onToggleCart,
  onOpenDetails,
  activeCategory,
  setActiveCategory,
}: CatalogPageProps) {
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);

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

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasMore = visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  };

  return (
    <div className="pb-8">
      {/* Title Header */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#111827]">Каталог парфюмерии</h1>
          <p className="text-[12px] text-gray-400 mt-0.5">
            Показано {visibleProducts.length} из {filtered.length} товаров
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="mb-3">
        <CategoryPills active={activeCategory} onChange={(cat) => {
          setActiveCategory(cat);
          setVisibleCount(BATCH_SIZE);
        }} />
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-400 text-[13px]">
          В данной категории пока нет товаров
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 px-4">
            {visibleProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={!!cart[p.id]}
                onToggleCart={onToggleCart}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="px-4 mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="w-full py-3 rounded-full bg-[#F9FAFB] border border-gray-200 text-[13px] font-semibold text-[#111827] hover:bg-gray-100 active:scale-[0.98] transition-all"
              >
                Показать еще (+{Math.min(BATCH_SIZE, filtered.length - visibleCount)})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

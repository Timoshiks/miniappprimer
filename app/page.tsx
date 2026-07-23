"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/HomePage";
import CatalogPage from "@/components/CatalogPage";
import AboutPage from "@/components/AboutPage";
import CartPage from "@/components/CartPage";
import DetailModal from "@/components/DetailModal";
import { Product, ActiveTab } from "@/lib/types";
import { getProducts } from "@/lib/supabase/client";

export default function Home() {
  const [tab, setTab] = useState<ActiveTab>("home");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getProducts();
      setProducts(data);
    }
    loadData();

    // Restore saved cart from local storage if available
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("maison_cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  const saveCartState = (newCart: Record<string, number>) => {
    setCart(newCart);
    if (typeof window !== "undefined") {
      localStorage.setItem("maison_cart", JSON.stringify(newCart));
    }
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const toggleCart = (id: string) => {
    const next = { ...cart };
    if (next[id]) {
      delete next[id];
      showToast("Удалено из корзины");
    } else {
      next[id] = 1;
      showToast("Добавлено в корзину ✓");
    }
    saveCartState(next);
  };

  const changeQty = (id: string, delta: number) => {
    const next = { ...cart };
    const qty = (next[id] || 0) + delta;
    if (qty <= 0) {
      delete next[id];
    } else {
      next[id] = qty;
    }
    saveCartState(next);
  };

  const removeItem = (id: string) => {
    const next = { ...cart };
    delete next[id];
    saveCartState(next);
    showToast("Удалено из корзины");
  };

  const clearCart = () => {
    saveCartState({});
    showToast("Корзина очищена");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2200);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 font-[system-ui]">
      <div className="relative w-full max-w-md h-[100dvh] max-h-[920px] bg-white overflow-hidden flex flex-col shadow-2xl border-x border-gray-200/50 sm:rounded-3xl my-auto">
        {/* Header Bar with Search (only on Home and Catalog tabs) */}
        <Header
          query={query}
          setQuery={setQuery}
          cartCount={cartCount}
          onOpenCart={() => setTab("cart")}
          showSearch={tab === "home" || tab === "catalog"}
        />

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {tab === "home" && (
            <HomePage
              products={products}
              query={query}
              cart={cart}
              onToggleCart={toggleCart}
              onOpenDetails={setDetailProduct}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onViewCatalog={() => setTab("catalog")}
            />
          )}

          {tab === "catalog" && (
            <CatalogPage
              products={products}
              query={query}
              cart={cart}
              onToggleCart={toggleCart}
              onOpenDetails={setDetailProduct}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}

          {tab === "about" && <AboutPage />}

          {tab === "cart" && (
            <CartPage
              cart={cart}
              products={products}
              onChangeQty={changeQty}
              onRemoveItem={removeItem}
              onClearCart={clearCart}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav tab={tab} setTab={setTab} cartCount={cartCount} />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[12.5px] font-medium px-4 py-2 rounded-full shadow-xl z-50 animate-fadeIn">
            {toastMessage}
          </div>
        )}

        {/* Detail Slide-over Modal */}
        <DetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          inCart={detailProduct ? !!cart[detailProduct.id] : false}
          onToggleCart={toggleCart}
        />
      </div>
    </div>
  );
}

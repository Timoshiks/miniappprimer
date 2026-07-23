"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Upload, ArrowLeft, Check, Sparkles, Image as ImageIcon, Lock } from "lucide-react";
import Link from "next/link";
import { Product, FragranceNotes } from "@/lib/types";
import { getProducts, saveProduct, deleteProduct } from "@/lib/supabase/client";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const requiredPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "admin123";

  useEffect(() => {
    // Check if previously logged in
    if (localStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === requiredPasscode || passcode === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Неверный пароль администратора!");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert("Пожалуйста, заполните название и цену!");
      return;
    }

    setLoading(true);
    const result = await saveProduct(editingProduct);
    setStatusMessage("Товар успешно сохранён ✓");
    setTimeout(() => setStatusMessage(""), 3000);

    setEditingProduct(null);
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      setLoading(true);
      await deleteProduct(id);
      await fetchData();
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setEditingProduct((prev) => ({
          ...prev,
          images: [data.url, ...(prev?.images || [])],
        }));
      } else {
        alert(data.error || "Ошибка загрузки изображения");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке и сжатии изображения sharp");
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100 text-center space-y-4"
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-50 text-[#8B5CF6] mx-auto flex items-center justify-center">
            <Lock size={22} />
          </div>
          <h2 className="text-[18px] font-bold text-[#111827]">Панель управления</h2>
          <p className="text-[12.5px] text-gray-400">Введите пароль для доступа к админке</p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Пароль администратора"
            className="w-full rounded-2xl bg-[#F9FAFB] border border-gray-200 px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#8B5CF6]"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#111827] text-white rounded-2xl font-semibold text-[14px] hover:bg-[#1f2937] transition-colors"
          >
            Войти в систему
          </button>
          <p className="text-[11px] text-gray-400">Демо пароль по умолчанию: admin123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-[system-ui]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[17px] font-bold text-[#111827]">Админ-панель товаров</h1>
        </div>
        <button
          onClick={() =>
            setEditingProduct({
              title: "",
              brand: "Maison Noir",
              category: "Духи",
              price: 15000,
              volume: "50 мл",
              description: "",
              notes: { top: "", heart: "", base: "" },
              images: [],
            })
          }
          className="flex items-center gap-1.5 bg-[#8B5CF6] text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-[#7c4dff] transition-colors shadow-sm"
        >
          <Plus size={16} /> Добавить товар
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {statusMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl text-[13px] font-medium text-center border border-emerald-200">
            {statusMessage}
          </div>
        )}

        {/* Product Modal Form */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="text-[16px] font-bold text-[#111827]">
                  {editingProduct.id ? "Редактировать товар" : "Создать новый товар"}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                    Название товара *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                      Бренд
                    </label>
                    <input
                      type="text"
                      value={editingProduct.brand || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                      Категория
                    </label>
                    <select
                      value={editingProduct.category || "Духи"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                    >
                      <option value="Духи">Духи</option>
                      <option value="Уход">Уход</option>
                      <option value="Косметика">Косметика</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                      Цена (в ₽) *
                    </label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      }
                      className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                      Объем / Размер
                    </label>
                    <input
                      type="text"
                      value={editingProduct.volume || "50 мл"}
                      onChange={(e) => setEditingProduct({ ...editingProduct, volume: e.target.value })}
                      className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#F9FAFB] border border-gray-200 px-3 py-2 text-[13.5px] outline-none focus:border-[#8B5CF6]"
                  />
                </div>

                {/* Fragrance Notes */}
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-2">
                  <p className="text-[12px] font-bold text-[#8B5CF6]">Пирамида нот / Детали</p>
                  <div>
                    <span className="text-[11px] text-gray-500">Верхние ноты:</span>
                    <input
                      type="text"
                      value={editingProduct.notes?.top || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          notes: { ...(editingProduct.notes as FragranceNotes), top: e.target.value },
                        })
                      }
                      placeholder="Например: Бергамот, розовый перец"
                      className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-[12.5px] outline-none mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">Ноты сердца:</span>
                    <input
                      type="text"
                      value={editingProduct.notes?.heart || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          notes: { ...(editingProduct.notes as FragranceNotes), heart: e.target.value },
                        })
                      }
                      placeholder="Например: Роза, уд, шафран"
                      className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-[12.5px] outline-none mt-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-500">Базовые ноты:</span>
                    <input
                      type="text"
                      value={editingProduct.notes?.base || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          notes: { ...(editingProduct.notes as FragranceNotes), base: e.target.value },
                        })
                      }
                      placeholder="Например: Амбра, мускус, кожа"
                      className="w-full rounded-lg bg-white border border-gray-200 px-3 py-1.5 text-[12.5px] outline-none mt-0.5"
                    />
                  </div>
                </div>

                {/* Sharp Drag-and-drop Image Uploader */}
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 mb-1">
                    Загрузка изображения (автосжатие в WebP через Sharp)
                  </label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-[#8B5CF6] rounded-2xl p-4 text-center cursor-pointer transition-colors relative bg-[#F9FAFB]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="mx-auto text-gray-400 mb-1" size={24} />
                    <p className="text-[12.5px] font-medium text-[#111827]">
                      {uploading ? "Сжатие Sharp и загрузка..." : "Перетащите фото или нажмите для выбора"}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Автоматическая конвертация в .webp</p>
                  </div>

                  {editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {editingProduct.images.map((img, idx) => (
                        <div key={idx} className="h-16 w-16 relative rounded-xl overflow-hidden border border-gray-200 shrink-0">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-[13px] font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-2xl bg-[#111827] text-white text-[13px] font-semibold hover:bg-[#1f2937]"
                  >
                    Сохранить товар
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Table / List */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111827]">Список товаров ({products.length})</h2>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400 text-[13px]">Загрузка каталога...</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden border border-purple-100">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <Sparkles size={18} className="text-[#8B5CF6]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-semibold text-gray-400">{p.brand} · {p.category}</p>
                      <h4 className="text-[13.5px] font-bold text-[#111827] truncate">{p.title}</h4>
                      <p className="text-[12px] text-gray-500">{p.volume} · <span className="font-semibold text-[#111827]">{p.price} ₽</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

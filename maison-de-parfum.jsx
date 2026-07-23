import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, ChevronRight, ChevronDown, Plus, Minus, X, Home, Grid3x3, Info, ShieldCheck, Sparkles, Truck, Leaf } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock catalog data
// ---------------------------------------------------------------------------
const CATEGORIES = ["Все", "Духи", "Уход", "Косметика"];

const PRODUCTS = [
  {
    id: 1,
    brand: "Maison Noir",
    title: "Velvet Oud",
    volume: "50 мл",
    price: 18900,
    category: "Духи",
    notes: {
      top: "Бергамот, розовый перец",
      heart: "Роза, уд, шафран",
      base: "Амбра, мускус, кожа",
    },
    description:
      "Насыщенный восточный аромат с дымным древесным сердцем и тёплым шлейфом амбры. Плотный, узнаваемый, для вечерних выходов.",
  },
  {
    id: 2,
    brand: "Lumière Blanche",
    title: "Poudre de Riz",
    volume: "75 мл",
    price: 14200,
    category: "Духи",
    notes: {
      top: "Ирис, миндаль",
      heart: "Пудровая фиалка, гелиотроп",
      base: "Белый мускус, сандал",
    },
    description:
      "Пудровый и нежный аромат, напоминающий шёлковую косметичку. Лёгкий, воздушный, подходит для дневного ношения.",
  },
  {
    id: 3,
    brand: "Atelier Fleur",
    title: "Néroli Doré",
    volume: "100 мл",
    price: 11500,
    category: "Духи",
    notes: {
      top: "Нероли, лимон, бергамот",
      heart: "Флёрдоранж, жасмин",
      base: "Кедр, белый мускус",
    },
    description:
      "Свежий цитрусово-цветочный аромат с солнечным характером. Универсальный выбор для тёплого сезона.",
  },
  {
    id: 4,
    brand: "Maison Noir",
    title: "Ambre Nuit",
    volume: "50 мл",
    price: 19800,
    category: "Духи",
    notes: {
      top: "Кардамон, мандарин",
      heart: "Ладан, бензоин",
      base: "Тёмная амбра, ваниль",
    },
    description:
      "Тягучий смолистый аромат для холодного времени года. Обволакивающий, почти осязаемый шлейф.",
  },
  {
    id: 5,
    brand: "Derma Lab",
    title: "Ретинол-сыворотка 0.3%",
    volume: "30 мл",
    price: 6400,
    category: "Уход",
    notes: {
      top: "Активная формула",
      heart: "Ретинол, ниацинамид",
      base: "Скваланом закреплённая база",
    },
    description:
      "Ночная сыворотка для обновления кожи и выравнивания текстуры. Начинать с 2–3 раз в неделю, обязательно SPF днём.",
  },
  {
    id: 6,
    brand: "Derma Lab",
    title: "Гиалуроновый крем",
    volume: "50 мл",
    price: 5200,
    category: "Уход",
    notes: {
      top: "Лёгкая текстура",
      heart: "Гиалуроновая кислота, пантенол",
      base: "Керамиды, сквалан",
    },
    description:
      "Насыщенное увлажнение без ощущения плёнки. Подходит для чувствительной кожи, без отдушек.",
  },
  {
    id: 7,
    brand: "Botanique",
    title: "Масло для лица «Роза»",
    volume: "20 мл",
    price: 4800,
    category: "Уход",
    notes: {
      top: "Розовая вода",
      heart: "Масло дамасской розы",
      base: "Жожоба, витамин Е",
    },
    description:
      "Питательное масло холодного отжима. Наносить на очищенную кожу перед сном, 2–3 капли.",
  },
  {
    id: 8,
    brand: "Studio Rouge",
    title: "Матовая помада «Grenat»",
    volume: "3.5 г",
    price: 3200,
    category: "Косметика",
    notes: {
      top: "Финиш: матовый",
      heart: "Пигмент: гранатовый",
      base: "База: масло ши",
    },
    description:
      "Стойкая помада с бархатным финишем без эффекта сухости. Держится до 6 часов, не требует докраски после еды.",
  },
  {
    id: 9,
    brand: "Studio Rouge",
    title: "Тональная основа Skin Tint",
    volume: "30 мл",
    price: 5600,
    category: "Косметика",
    notes: {
      top: "Финиш: сатиновый",
      heart: "Покрытие: среднее",
      base: "SPF 25",
    },
    description:
      "Лёгкое покрытие с эффектом «своя кожа, но лучше». Выравнивает тон, не забивает поры.",
  },
  {
    id: 10,
    brand: "Botanique",
    title: "Тушь для ресниц Volume+",
    volume: "9 мл",
    price: 2900,
    category: "Косметика",
    notes: {
      top: "Эффект: объём",
      heart: "Щёточка: конусная",
      base: "Формула без осыпания",
    },
    description:
      "Интенсивный объём без комочков. Не осыпается и не размазывается в течение дня.",
  },
];

const FAQ = [
  {
    q: "Как выбрать аромат?",
    a: "Обратите внимание на верхние ноты — это первое впечатление аромата, которое держится 15–20 минут. Сердечные ноты раскрываются через полчаса и определяют характер, а базовые ноты остаются на коже дольше всего. Рекомендуем наносить пробник на кожу, а не на бумажную полоску, и оценивать аромат через 30–40 минут.",
  },
  {
    q: "Гарантия качества",
    a: "Каждый товар сопровождается сертификатом подлинности и закупается напрямую у официальных дистрибьюторов брендов. Мы не работаем с параллельным импортом сомнительного происхождения. Если товар не соответствует описанию, мы принимаем возврат в течение 14 дней.",
  },
  {
    q: "Доставка и оплата",
    a: "Доставка по Москве — 1–2 дня, по России — 3–7 дней курьерскими службами. Оплата картой онлайн или при получении. Заказы от 5 000 ₽ доставляются бесплатно.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatPrice = (n) => n.toLocaleString("ru-RU") + " ₽";

// ---------------------------------------------------------------------------
// Small shared UI bits
// ---------------------------------------------------------------------------
function CategoryPills({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
      {CATEGORIES.filter((c) => c !== "Все").map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
            active === cat
              ? "bg-[#111827] text-white"
              : "bg-[#F9FAFB] text-[#111827] border border-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, inCart, onToggleCart, onOpenDetails }) {
  return (
    <div className="relative rounded-2xl bg-[#F9FAFB] p-3 flex flex-col">
      <button
        onClick={() => onToggleCart(product.id)}
        aria-label={inCart ? "Убрать из корзины" : "Добавить в корзину"}
        className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
          inCart ? "bg-[#8B5CF6] text-white" : "bg-white text-gray-400 border border-gray-200"
        }`}
      >
        <ShoppingCart size={15} fill={inCart ? "currentColor" : "none"} strokeWidth={1.8} />
      </button>

      <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-[#EDE4FB] to-[#F9FAFB] flex items-center justify-center mb-3 overflow-hidden">
        <Sparkles className="text-[#C4B5FD]" size={34} strokeWidth={1.2} />
      </div>

      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{product.brand}</p>
      <p className="text-[14px] font-semibold text-[#111827] leading-tight mt-0.5">{product.title}</p>
      <p className="text-[12px] text-gray-400 mt-0.5">{product.volume}</p>

      <div className="flex items-center justify-between mt-2">
        <span className="text-[14px] font-bold text-[#111827]">{formatPrice(product.price)}</span>
        <button
          onClick={() => onOpenDetails(product)}
          className="text-[12px] font-medium text-[#8B5CF6] flex items-center gap-0.5"
        >
          Подробнее <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

function ProductGrid({ products, cart, onToggleCart, onOpenDetails }) {
  if (products.length === 0) {
    return (
      <div className="px-4 py-10 text-center text-gray-400 text-[13px]">
        Ничего не найдено
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          inCart={!!cart[p.id]}
          onToggleCart={onToggleCart}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Slide-over product detail modal
// ---------------------------------------------------------------------------
function DetailModal({ product, onClose, inCart, onToggleCart }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-t-3xl px-5 pt-4 pb-6 max-h-[85%] overflow-y-auto animate-slideup">
        <div className="mx-auto h-1 w-10 rounded-full bg-gray-200 mb-4" />
        <button
          onClick={onClose}
          className="absolute top-4 right-5 h-7 w-7 flex items-center justify-center rounded-full bg-[#F9FAFB] text-gray-500"
        >
          <X size={15} />
        </button>

        <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#EDE4FB] to-[#F9FAFB] flex items-center justify-center mb-4">
          <Sparkles className="text-[#C4B5FD]" size={48} strokeWidth={1.2} />
        </div>

        <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{product.brand}</p>
        <h2 className="text-[19px] font-bold text-[#111827] mt-0.5">{product.title}</h2>
        <p className="text-[13px] text-gray-400 mt-0.5">{product.volume}</p>

        <p className="text-[14px] text-[#111827] leading-relaxed mt-3">{product.description}</p>

        <div className="mt-4 rounded-2xl bg-[#F9FAFB] p-4 space-y-2.5">
          <p className="text-[12px] font-semibold text-[#111827] mb-1">Пирамида нот / детали</p>
          <div className="flex gap-3">
            <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0">Верх</span>
            <span className="text-[13px] text-[#111827]">{product.notes.top}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0">Сердце</span>
            <span className="text-[13px] text-[#111827]">{product.notes.heart}</span>
          </div>
          <div className="flex gap-3">
            <span className="text-[11px] font-medium text-[#8B5CF6] w-16 shrink-0">База</span>
            <span className="text-[13px] text-[#111827]">{product.notes.base}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-5">
          <span className="text-[18px] font-bold text-[#111827]">{formatPrice(product.price)}</span>
          <button
            onClick={() => onToggleCart(product.id)}
            className={`rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors ${
              inCart ? "bg-[#8B5CF6] text-white" : "bg-[#111827] text-white"
            }`}
          >
            {inCart ? "В корзине ✓" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
function HomePage({ query, cart, onToggleCart, onOpenDetails, activeCategory, setActiveCategory }) {
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "Все" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="pb-4">
      {/* Promo banner */}
      <div className="mx-4 mt-3 mb-4 rounded-2xl bg-gradient-to-br from-[#111827] to-[#2b2438] px-5 py-5 text-white relative overflow-hidden">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#8B5CF6]/30 blur-2xl" />
        <p className="text-[11px] uppercase tracking-widest text-[#E0C3FC] font-medium">Новая коллекция</p>
        <p className="text-[19px] font-bold mt-1 leading-tight">Осенние ароманы<br/>уже в каталоге</p>
        <p className="text-[12px] text-gray-300 mt-2">Скидка 10% на первый заказ</p>
      </div>

      <div className="mb-3">
        <CategoryPills active={activeCategory} onChange={setActiveCategory} />
      </div>

      <ProductGrid products={filtered} cart={cart} onToggleCart={onToggleCart} onOpenDetails={onOpenDetails} />
    </div>
  );
}

function CatalogPage({ query, cart, onToggleCart, onOpenDetails, activeCategory, setActiveCategory }) {
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "Все" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div className="pb-4">
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-[17px] font-bold text-[#111827]">Каталог</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">{filtered.length} товаров</p>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#111827] text-white"
                : "bg-[#F9FAFB] text-[#111827] border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <ProductGrid products={filtered} cart={cart} onToggleCart={onToggleCart} onOpenDetails={onOpenDetails} />
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3.5 text-left"
      >
        <span className="text-[14px] font-medium text-[#111827] pr-4">{item.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180 text-[#8B5CF6]" : ""}`}
        />
      </button>
      {isOpen && (
        <p className="text-[13px] text-gray-500 leading-relaxed pb-4 pr-2">{item.a}</p>
      )}
    </div>
  );
}

function AboutPage() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="px-4 pt-3 pb-6 space-y-5">
      <div>
        <h1 className="text-[17px] font-bold text-[#111827]">Подробнее</h1>
      </div>

      {/* About us */}
      <section className="rounded-2xl bg-[#F9FAFB] p-4">
        <p className="text-[12px] font-semibold text-[#8B5CF6] uppercase tracking-wide mb-1">О нас</p>
        <p className="text-[13.5px] text-[#111827] leading-relaxed">
          Maison de Parfum — бутик премиальной парфюмерии и косметики, работающий напрямую с официальными дистрибьюторами европейских домов. Мы отбираем нишевые и селективные бренды, которые сложно найти в масс-маркете, и следим за температурными условиями хранения на каждом этапе.
        </p>
      </section>

      {/* Cosmetics details */}
      <section className="rounded-2xl bg-[#F9FAFB] p-4">
        <p className="text-[12px] font-semibold text-[#8B5CF6] uppercase tracking-wide mb-2">Подробнее о косметике</p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <Leaf size={15} className="text-[#8B5CF6]" strokeWidth={1.7} />
            </div>
            <p className="text-[13px] text-[#111827] leading-relaxed">
              Все составы проходят дерматологический контроль, большинство линеек — без отдушек и парабенов.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-[#8B5CF6]" strokeWidth={1.7} />
            </div>
            <p className="text-[13px] text-[#111827] leading-relaxed">
              Каждая единица товара сопровождается сертификатом подлинности и штрихкодом для проверки партии на сайте бренда.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
              <Truck size={15} className="text-[#8B5CF6]" strokeWidth={1.7} />
            </div>
            <p className="text-[13px] text-[#111827] leading-relaxed">
              Хранение и транспортировка проходят с контролем температуры — это критично для стабильности ароматических композиций.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <p className="text-[12px] font-semibold text-[#8B5CF6] uppercase tracking-wide mb-1 px-1">Частые вопросы</p>
        <div className="rounded-2xl bg-[#F9FAFB] px-4">
          {FAQ.map((item, idx) => (
            <AccordionItem
              key={idx}
              item={item}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function CartPage({ cart, products, onChangeQty, onCheckout }) {
  const items = products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, qty: cart[p.id] }));

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="px-4 pt-3 pb-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-16 w-16 rounded-full bg-[#F9FAFB] flex items-center justify-center mb-3">
          <ShoppingCart size={26} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <p className="text-[14px] font-medium text-[#111827]">Корзина пуста</p>
        <p className="text-[12.5px] text-gray-400 mt-1">Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="px-4 pt-3 pb-2">
        <h1 className="text-[17px] font-bold text-[#111827]">Корзина</h1>
        <p className="text-[12px] text-gray-400 mt-0.5">{items.length} товара на сумму {formatPrice(total)}</p>
      </div>

      <div className="px-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-2xl bg-[#F9FAFB] p-3">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-[#EDE4FB] to-white flex items-center justify-center">
              <Sparkles className="text-[#C4B5FD]" size={22} strokeWidth={1.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-medium">{item.brand}</p>
              <p className="text-[13.5px] font-semibold text-[#111827] leading-tight truncate">{item.title}</p>
              <p className="text-[11.5px] text-gray-400">{item.volume}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[13.5px] font-bold text-[#111827]">{formatPrice(item.price * item.qty)}</span>
                <div className="flex items-center gap-2 bg-white rounded-full px-1 py-1 border border-gray-200">
                  <button
                    onClick={() => onChangeQty(item.id, -1)}
                    className="h-6 w-6 flex items-center justify-center rounded-full text-[#111827]"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-[12.5px] font-medium w-4 text-center">{item.qty}</span>
                  <button
                    onClick={() => onChangeQty(item.id, 1)}
                    className="h-6 w-6 flex items-center justify-center rounded-full bg-[#8B5CF6] text-white"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Telegram MainButton style checkout, fixed above bottom nav */}
      <div className="fixed bottom-[64px] left-0 right-0 mx-auto max-w-sm px-4">
        <button
          onClick={onCheckout}
          className="w-full rounded-2xl bg-[#111827] text-white py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
        >
          <span className="text-[14px] font-semibold">Оформить заказ</span>
          <span className="text-[14px] font-bold">· {formatPrice(total)}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bottom navigation
// ---------------------------------------------------------------------------
function BottomNav({ tab, setTab, cartCount }) {
  const tabs = [
    { key: "home", label: "Главная", icon: Home },
    { key: "catalog", label: "Каталог", icon: Grid3x3 },
    { key: "about", label: "Подробнее", icon: Info },
    { key: "cart", label: "Корзина", icon: ShoppingCart },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-sm bg-white/90 backdrop-blur-md border-t border-gray-100 flex">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = tab === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 relative"
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

// ---------------------------------------------------------------------------
// Root App
// ---------------------------------------------------------------------------
export default function App() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [cart, setCart] = useState({}); // { productId: qty }
  const [detailProduct, setDetailProduct] = useState(null);
  const [toast, setToast] = useState("");

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const toggleCart = (id) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] || 0) + delta;
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  };

  const handleCheckout = () => {
    setToast("Заказ оформлен ✓");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 font-[system-ui]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slideup { animation: slideup 0.28s ease-out; }
      `}</style>

      <div className="relative w-full max-w-sm h-[100dvh] max-h-[860px] bg-white overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 pt-4 pb-3 border-b border-gray-50">
          <h1 className="text-[15px] font-bold tracking-[0.12em] text-[#111827] text-center mb-3">
            MAISON DE PARFUM
          </h1>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по бренду или названию"
              className="w-full rounded-full bg-[#F9FAFB]/80 border border-gray-100 backdrop-blur-sm pl-9 pr-4 py-2.5 text-[13px] text-[#111827] placeholder-gray-400 outline-none focus:border-[#E0C3FC] transition-colors"
            />
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {tab === "home" && (
            <HomePage
              query={query}
              cart={cart}
              onToggleCart={toggleCart}
              onOpenDetails={setDetailProduct}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}
          {tab === "catalog" && (
            <CatalogPage
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
              products={PRODUCTS}
              onChangeQty={changeQty}
              onCheckout={handleCheckout}
            />
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav tab={tab} setTab={setTab} cartCount={cartCount} />

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[12.5px] font-medium px-4 py-2 rounded-full shadow-lg z-50">
            {toast}
          </div>
        )}

        {/* Slide-over detail modal */}
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

export interface FragranceNotes {
  top: string;
  heart: string;
  base: string;
}

export interface Product {
  id: string;
  brand: string;
  title: string;
  volume: string;
  price: number;
  category: "Духи" | "Уход" | "Косметика" | string;
  notes: FragranceNotes;
  description: string;
  images: string[];
  created_at?: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface FAQItem {
  q: string;
  a: string;
}

export type ActiveTab = "home" | "catalog" | "about" | "cart";

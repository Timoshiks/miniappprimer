import { createClient } from "@supabase/supabase-js";
import { INITIAL_PRODUCTS } from "../mock-data";
import { Product } from "../types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper data provider with fallback to mock data when Supabase is unconfigured
export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local dataset:", e);
    }
  }

  // Fallback to local storage or INITIAL_PRODUCTS mock data
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("maison_products");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore parse error
      }
    }
  }

  return INITIAL_PRODUCTS;
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  if (supabase) {
    try {
      if (product.id && product.id.length > 10) {
        const { data, error } = await supabase
          .from("products")
          .update(product)
          .eq("id", product.id)
          .select()
          .single();
        if (!error && data) return data as Product;
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([product])
          .select()
          .single();
        if (!error && data) return data as Product;
      }
    } catch (e) {
      console.warn("Supabase save error, utilizing local storage fallback:", e);
    }
  }

  // Local storage fallback for client side
  const current = await getProducts();
  let updatedProduct: Product;

  if (product.id) {
    const idx = current.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...product } as Product;
      updatedProduct = current[idx];
    } else {
      updatedProduct = {
        id: String(Date.now()),
        brand: product.brand || "Brand",
        title: product.title || "Product",
        volume: product.volume || "50 мл",
        price: product.price || 0,
        category: product.category || "Духи",
        notes: product.notes || { top: "", heart: "", base: "" },
        description: product.description || "",
        images: product.images || ["/products/placeholder.webp"],
        created_at: new Date().toISOString(),
      };
      current.unshift(updatedProduct);
    }
  } else {
    updatedProduct = {
      id: String(Date.now()),
      brand: product.brand || "Brand",
      title: product.title || "Product",
      volume: product.volume || "50 мл",
      price: product.price || 0,
      category: product.category || "Духи",
      notes: product.notes || { top: "", heart: "", base: "" },
      description: product.description || "",
      images: product.images || ["/products/placeholder.webp"],
      created_at: new Date().toISOString(),
    };
    current.unshift(updatedProduct);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("maison_products", JSON.stringify(current));
  }
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (!error) return true;
    } catch (e) {
      console.warn("Supabase delete error:", e);
    }
  }

  if (typeof window !== "undefined") {
    const current = await getProducts();
    const filtered = current.filter((p) => p.id !== id);
    localStorage.setItem("maison_products", JSON.stringify(filtered));
  }
  return true;
}

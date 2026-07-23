import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { INITIAL_PRODUCTS } from "@/lib/mock-data";

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { message: "Supabase not configured, using local mock state", products: INITIAL_PRODUCTS },
        { status: 200 }
      );
    }

    // Insert mock products into Supabase products table
    const { data, error } = await supabaseAdmin
      .from("products")
      .upsert(INITIAL_PRODUCTS, { onConflict: "id" })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      products: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

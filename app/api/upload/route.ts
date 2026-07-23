import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Process image with Sharp: resize to max width/height 1000px and compress to WebP
    const compressedWebpBuffer = await sharp(inputBuffer)
      .resize(1000, 1000, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer();

    const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    // Attempt upload to Supabase Storage if configured
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin.storage
        .from("product-images")
        .upload(fileName, compressedWebpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("product-images")
          .getPublicUrl(fileName);

        return NextResponse.json({
          url: publicUrlData.publicUrl,
          success: true,
        });
      } else {
        console.warn("Supabase Storage upload warning:", error);
      }
    }

    // Fallback: return data URL for immediate client-side preview if Supabase Storage is not set up
    const base64Image = `data:image/webp;base64,${compressedWebpBuffer.toString("base64")}`;
    return NextResponse.json({
      url: base64Image,
      success: true,
      fallback: true,
    });
  } catch (err: any) {
    console.error("Image processing error:", err);
    return NextResponse.json(
      { error: err.message || "Image processing failed" },
      { status: 500 }
    );
  }
}

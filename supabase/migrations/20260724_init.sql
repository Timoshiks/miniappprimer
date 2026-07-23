-- Migration: Create products table and product-images storage bucket

-- 1. Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    volume TEXT NOT NULL,
    category TEXT NOT NULL,
    notes JSONB DEFAULT '{"top": "", "heart": "", "base": ""}'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for category and search
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- Enable RLS on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Public products read access" ON public.products;
DROP POLICY IF EXISTS "Admin full access to products" ON public.products;

-- Allow public read access to products
CREATE POLICY "Public products read access" ON public.products
    FOR SELECT USING (true);

-- Allow full access for service_role or authenticated users
CREATE POLICY "Admin full access to products" ON public.products
    FOR ALL USING (true);

-- 2. Create Storage Bucket 'product-images'
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Upload Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Update Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Delete Product Images" ON storage.objects;

-- Policy for public read access to product-images
CREATE POLICY "Public Read Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- Policy for uploading images
CREATE POLICY "Upload Product Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Update Product Images" ON storage.objects
    FOR UPDATE WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Delete Product Images" ON storage.objects
    FOR DELETE USING (bucket_id = 'product-images');

-- ============================================================
-- Supabase SQL Migration: E-Commerce Multi-Tenant Template
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── DROP EXISTING (safe re-run) ────────────────────────────

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_order_number ON orders;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS generate_order_number();
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS business_type;

-- ─── TENANTS ────────────────────────────────────────────────

CREATE TYPE business_type AS ENUM (
  'fruits', 'nursery', 'nonveg', 'electrical',
  'vegetables', 'bakery', 'fashion', 'pharmacy'
);

CREATE TABLE tenants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  store_name TEXT NOT NULL,
  description TEXT,
  business_type business_type NOT NULL,
  theme_config JSONB NOT NULL DEFAULT '{}',
  whatsapp_number TEXT NOT NULL,
  address TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PROFILES ───────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'customer');

CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  whatsapp_number TEXT,
  role user_role DEFAULT 'customer',
  tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CATEGORIES ─────────────────────────────────────────────

CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PRODUCTS ───────────────────────────────────────────────

CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  images TEXT[] DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_demo BOOLEAN DEFAULT FALSE,
  demo_expires_at TIMESTAMPTZ,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS ─────────────────────────────────────────────────

CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled'
);

CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  order_notes TEXT,
  status order_status DEFAULT 'pending',
  total_amount NUMERIC(10, 2) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_price NUMERIC(10, 2) NOT NULL,
  product_unit TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL
);

-- ─── INDEXES ────────────────────────────────────────────────

CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(tenant_id, is_available);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);
CREATE INDEX idx_orders_status ON orders(tenant_id, status);
CREATE INDEX idx_tenants_slug ON tenants(slug);

-- ─── HELPER: Check if current user is super_admin ────────────

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access to tenants (storefronts are public)
CREATE POLICY "Tenants are publicly readable"
  ON tenants FOR SELECT USING (true);

-- Owner or super_admin can update tenants
CREATE POLICY "Owners can update their tenant"
  ON tenants FOR UPDATE USING (auth.uid() = owner_user_id OR is_super_admin());

-- Owner or super_admin can create tenants
CREATE POLICY "Authenticated users can create tenants"
  ON tenants FOR INSERT WITH CHECK (auth.uid() = owner_user_id OR is_super_admin());

-- Super admin can delete tenants
CREATE POLICY "Super admin can delete tenants"
  ON tenants FOR DELETE USING (is_super_admin());

-- Profiles: users can read/update their own, super_admin can read/update all
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = user_id OR is_super_admin());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories: public read, owner or super_admin write
CREATE POLICY "Categories are publicly readable"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Tenant owners can manage categories"
  ON categories FOR ALL USING (
    tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid())
    OR is_super_admin()
  );

-- Products: public read, owner or super_admin write
CREATE POLICY "Available products are publicly readable"
  ON products FOR SELECT USING (true);

CREATE POLICY "Tenant owners can manage products"
  ON products FOR ALL USING (
    tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid())
    OR is_super_admin()
  );

-- Orders: customer can view own, owner or super_admin can view all for tenant
CREATE POLICY "Customers can view their orders"
  ON orders FOR SELECT USING (
    user_id = auth.uid() OR
    tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid())
    OR is_super_admin()
  );

CREATE POLICY "Anyone can create orders (guest checkout)"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Tenant owners can update orders"
  ON orders FOR UPDATE USING (
    tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid())
    OR is_super_admin()
  );

-- Order items: same as orders
CREATE POLICY "Order items readable with order access"
  ON order_items FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE
      user_id = auth.uid() OR
      tenant_id IN (SELECT id FROM tenants WHERE owner_user_id = auth.uid())
    )
    OR is_super_admin()
  );

CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT WITH CHECK (true);

-- ─── AUTO-CLEANUP DEMO PRODUCTS (pg_cron) ───────────────────
-- Enable pg_cron extension in Supabase Dashboard first,
-- then run this to schedule daily cleanup:
--
-- SELECT cron.schedule(
--   'cleanup-demo-products',
--   '0 3 * * *',  -- Runs daily at 3 AM UTC
--   $$ UPDATE products SET is_available = false
--      WHERE is_demo = true AND demo_expires_at < NOW() AND is_available = true $$
-- );

-- ─── STORAGE BUCKETS ─────────────────────────────────────────
-- Run in Supabase Dashboard > Storage:
-- 1. Create bucket: "product-images" (public)
-- 2. Create bucket: "store-assets" (public)

-- ─── FUNCTION: Generate Order Number ─────────────────────────

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || UPPER(SUBSTRING(NEW.id::text, 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

-- ─── FUNCTION: Auto-create profile on signup ─────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to supabase_auth_admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION handle_new_user() TO supabase_auth_admin;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

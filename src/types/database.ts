// ─── Enums ────────────────────────────────────────────────────────

export type BusinessType =
  | "fruits"
  | "nursery"
  | "nonveg"
  | "electrical"
  | "vegetables"
  | "bakery"
  | "fashion"
  | "pharmacy";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type UserRole = "super_admin" | "admin" | "customer";

// ─── Tables ───────────────────────────────────────────────────────

export interface Tenant {
  id: string;
  slug: string;
  store_name: string;
  description: string | null;
  business_type: BusinessType;
  theme_config: ThemeConfig;
  whatsapp_number: string;
  address: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  owner_user_id: string;
  created_at: string;
}

export interface ThemeConfig {
  primary: string;
  accent: string;
  background: string;
  foreground: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  whatsapp_number: string;
  role: UserRole;
  tenant_id: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string | null;
  icon_name: string | null;
  display_order: number;
  tenant_id: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  images: string[];
  stock_quantity: number;
  is_available: boolean;
  is_demo: boolean;
  demo_expires_at: string | null;
  category_id: string;
  tenant_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  tenant_id: string;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_whatsapp: string;
  delivery_address: string;
  order_notes: string | null;
  status: OrderStatus;
  total_amount: number;
  user_id: string | null;
  tenant_id: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_unit: string;
  quantity: number;
  subtotal: number;
  product?: Product;
}

// ─── Client-side Cart (Zustand + localStorage) ───────────────────

export interface LocalCartItem {
  productId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
  tenantId: string;
}

export interface CheckoutDetails {
  name: string;
  whatsappNumber: string;
  address: string;
  notes?: string;
}

// ─── API / Misc ──────────────────────────────────────────────────

export interface WhatsAppMessage {
  to: string;
  templateName: string;
  parameters: string[];
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface TenantWithProducts extends Tenant {
  categories: Category[];
  products: Product[];
}

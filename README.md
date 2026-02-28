# 🛒 EcomStore — Multi-Tenant E-Commerce Template

A **premium, production-ready** multi-tenant e-commerce template built with Next.js, Supabase, and WhatsApp Business API. Create beautiful online storefronts for **any business type** — fruits, nurseries, meat shops, electrical stores, and more — in minutes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **🏪 8 Business Presets** — Fruits & Vegetables, Plant Nursery, Meat & Seafood, Electrical Supplies, Bakery & Sweets, Dairy & Farm, Grocery & General, Fashion & Clothing
- **🎨 Dynamic Theming** — Each store gets its own color scheme via CSS variables, customizable from the admin panel
- **📱 WhatsApp Notifications** — Order confirmations sent to both the customer and vendor via WhatsApp Business Cloud API
- **🛍️ Guest Checkout** — No account required for customers; mandatory WhatsApp number for order updates
- **💰 Cash on Delivery** — Simple COD-based ordering (payment gateway integration planned for v2)
- **📊 Admin Dashboard** — Full product CRUD, order management, category management, store settings & theme editor
- **🚀 One-Click Onboarding** — 3-step wizard: pick business type → enter store details → launch with demo products
- **🧹 Demo Auto-Cleanup** — Seeded demo products expire after 7 days
- **🔒 Row-Level Security** — All data protected with Supabase RLS policies
- **📱 Fully Responsive** — Mobile-first design with fluid animations (Framer Motion)
- **⚡ Free Deployment** — Runs entirely on Vercel (Hobby) + Supabase (Free Tier)

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS Variables, CVA |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| State | Zustand (cart persistence) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | WhatsApp Business Cloud API |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout (Inter font, metadata)
│   ├── globals.css                       # CSS variables, theme, animations
│   ├── auth/
│   │   ├── login/page.tsx                # Email/password + Google OAuth login
│   │   ├── signup/page.tsx               # Registration with email verification
│   │   └── callback/route.ts             # OAuth callback handler
│   ├── admin/
│   │   ├── layout.tsx                    # Auth guard, tenant check, redirects
│   │   ├── page.tsx                      # Dashboard (stats + recent orders)
│   │   ├── onboarding/page.tsx           # 3-step store setup wizard
│   │   ├── products/                     # Full CRUD product manager
│   │   ├── categories/                   # Category manager
│   │   ├── orders/                       # Order management + status updates
│   │   └── settings/                     # Store info + theme editor
│   ├── store/[slug]/
│   │   ├── layout.tsx                    # Dynamic CSS variable injection
│   │   ├── page.tsx                      # Storefront catalog
│   │   ├── checkout/page.tsx             # Checkout flow
│   │   └── order-confirmation/[orderNumber]/page.tsx
│   └── api/
│       ├── orders/route.ts               # Create order + WhatsApp notifications
│       └── seed/route.ts                 # Seed demo categories & products
├── components/
│   ├── ui/                               # Base UI components (Button, Input, etc.)
│   ├── store/                            # Storefront components (ProductCard, Cart, etc.)
│   └── admin/                            # Admin components (Sidebar)
├── lib/
│   ├── supabase/                         # Supabase client (browser + server)
│   ├── store/cart.ts                     # Zustand cart store
│   ├── whatsapp/client.ts               # WhatsApp Cloud API helpers
│   ├── presets/                          # Business type presets + demo products
│   └── utils.ts                          # Utility functions
└── types/
    └── database.ts                       # All TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm**
- A **Supabase** account ([supabase.com](https://supabase.com)) — free tier works
- (Optional) A **WhatsApp Business** account for notifications

### 1. Clone & Install

```bash
git clone <your-repo-url> ecom-store
cd ecom-store
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project
2. Note your **Project URL** and **Anon Key** from **Settings → API**

### 3. Run the Database Migration

1. Open **SQL Editor** in your Supabase dashboard
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and **Run** — this creates all tables, enums, indexes, RLS policies, and triggers

### 4. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key

# Optional — WhatsApp notifications
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
```

### 5. (Optional) Set Up Google OAuth

1. In Supabase Dashboard → **Authentication → Providers → Google**
2. Enable Google and add your OAuth client ID & secret
3. Set the redirect URL to `https://your-domain.com/auth/callback`

### 6. Run the Dev Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see the landing page.

---

## 🏪 How It Works

### For Store Owners (Vendors)

1. **Sign Up** at `/auth/signup` → creates an account
2. **Onboarding Wizard** at `/admin/onboarding`:
   - Pick your business type (e.g., "Fruits & Vegetables")
   - Enter store name, slug, description, address, WhatsApp number
   - Review & launch — demo products are auto-seeded
3. **Admin Dashboard** at `/admin` — manage products, categories, orders, and theme

### For Customers

1. Visit the store at `/store/your-store-slug`
2. Browse products, filter by category, search by name
3. Add items to cart → proceed to checkout
4. Enter name, WhatsApp number, delivery address → place order (COD)
5. Receive order confirmation via WhatsApp (if configured)

---

## 📱 WhatsApp Integration

### Setup

1. Create a **Meta Business** account at [business.facebook.com](https://business.facebook.com)
2. Set up **WhatsApp Business API** in the Meta Developer Console
3. Get your **Phone Number ID** and **Permanent Access Token**
4. Add them to `.env.local`

### How It Works

When an order is placed:
- **Customer** receives an order summary with item details and total
- **Vendor** receives a notification with customer details, items, and delivery address

> WhatsApp notifications are optional. If the env vars aren't set, orders still work — notifications just won't send.

---

## 🎨 Theming

Each store has its own theme defined by CSS variables. Vendors can customize colors from **Admin → Settings**:

| Variable | Purpose |
|----------|---------|
| `--primary` | Main brand color (buttons, headers) |
| `--primary-foreground` | Text on primary color |
| `--accent` | Secondary accent color |
| `--background` | Page background |
| `--foreground` | Main text color |

Business presets come with pre-configured themes:
- 🍎 Fruits — Green (#16a34a)
- 🌿 Nursery — Emerald (#059669)
- 🥩 Non-Veg — Red (#dc2626)
- ⚡ Electrical — Blue (#2563eb)
- 🍰 Bakery — Amber (#d97706)
- 🥛 Dairy — Cyan (#0891b2)
- 🛒 Grocery — Indigo (#4f46e5)
- 👗 Fashion — Pink (#db2777)

---

## 🚢 Deploy to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `WHATSAPP_PHONE_NUMBER_ID` (optional)
   - `WHATSAPP_ACCESS_TOKEN` (optional)
4. Click **Deploy** ✅

> The project builds successfully without env vars (safe proxy fallback during build). Env vars are only needed at runtime.

---

## 📊 Supabase Free Tier Limits

| Resource | Free Tier |
|----------|-----------|
| Database | 500 MB |
| Auth | 50,000 MAU |
| Storage | 1 GB |
| Bandwidth | 2 GB |
| Edge Functions | 500K invocations/month |

More than enough for small-medium stores!

---

## 🗺️ Roadmap

- [ ] **v2** — Payment gateway integration (Razorpay / Stripe)
- [ ] **v2** — Product image upload to Supabase Storage
- [ ] **v2** — Order tracking with status updates via WhatsApp
- [ ] **v2** — Multi-language support
- [ ] **v2** — Customer accounts with order history
- [ ] **v2** — Inventory management & stock alerts
- [ ] **v2** — Analytics dashboard with charts
- [ ] **v2** — PWA support for mobile app-like experience

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR.

---

## 📄 License

MIT — free for personal and commercial use.

# 🛒 EcomStore — Multi-Tenant E-Commerce Template

A **premium, production-ready** multi-tenant e-commerce template built with Next.js, Supabase, and WhatsApp Business API. Create beautiful online storefronts for **any business type** — fruits, nurseries, meat shops, electrical stores, and more — in minutes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **👑 Super Admin Panel** — Create unlimited stores, assign vendors, manage everything from one dashboard with store switcher
- **🏪 8 Business Presets** — Fruits & Vegetables, Plant Nursery, Meat & Seafood, Electrical Supplies, Bakery & Sweets, Dairy & Farm, Grocery & General, Fashion & Clothing
- **🎨 Dynamic Theming** — Each store gets its own color scheme via CSS variables, customizable from the admin panel
- **📱 WhatsApp Notifications** — Order confirmations sent to both the customer and vendor via WhatsApp Business Cloud API
- **🛍️ Guest Checkout** — No account required for customers; mandatory WhatsApp number for order updates
- **💰 Cash on Delivery** — Simple COD-based ordering (payment gateway integration planned for v2)
- **📊 Vendor Dashboard** — Full product CRUD, order management, category management, store settings & theme editor
- **🔐 Google OAuth** — One-click sign-in with Google (+ email/password as fallback)
- **🛒 Cart Isolation** — Cart items are scoped per store — adding items in Store A doesn't affect Store B
- **🚀 One-Click Onboarding** — 3-step wizard: pick business type → enter store details → launch with demo products
- **🧹 Demo Auto-Cleanup** — Seeded demo products expire after 7 days
- **🔒 Row-Level Security** — All data protected with Supabase RLS policies + super_admin bypass
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
│   │   ├── layout.tsx                    # Auth guard, role-based routing, store switcher
│   │   ├── page.tsx                      # Dashboard (stats + recent orders)
│   │   ├── stores/                       # Super admin: create stores, assign vendors
│   │   ├── onboarding/page.tsx           # 3-step store setup wizard (for vendors)
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

### 5. Set Up Google OAuth (Recommended)

Google OAuth allows users (vendors & customers) to sign in with their Google account in one click. Follow these steps carefully:

#### Step A — Create a Google Cloud Project & OAuth Client

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** (or select an existing one):
   - Click the project dropdown at the top → **New Project** → give it a name like `EcomStore` → **Create**
3. Navigate to **APIs & Services → OAuth consent screen**:
   - Choose **External** → click **Create**
   - Fill in the required fields:
     - **App name**: `EcomStore` (or your store's name)
     - **User support email**: your email
     - **Developer contact email**: your email
   - Click **Save and Continue** through Scopes (no changes needed) and Test Users
   - Click **Back to Dashboard**
4. Navigate to **APIs & Services → Credentials**:
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - **Application type**: `Web application`
   - **Name**: `EcomStore Supabase` (any name)
   - Under **Authorized JavaScript origins**, add:
     ```
     https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co
     ```
   - Under **Authorized redirect URIs**, add:
     ```
     https://<YOUR_SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback
     ```
     > ⚠️ Replace `<YOUR_SUPABASE_PROJECT_REF>` with your actual Supabase project reference (found in **Supabase Dashboard → Settings → General → Reference ID**). For example: `https://abcdefghijklmn.supabase.co/auth/v1/callback`
   - Click **Create**
   - **Copy the Client ID and Client Secret** — you'll need them in the next step

> 💡 **Tip**: Your Supabase project URL looks like `https://abcdefghijklmn.supabase.co`. The `abcdefghijklmn` part is your **Project Reference ID**.

#### Step B — Configure Google Provider in Supabase

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Find **Google** in the list and expand it
3. Toggle **Enable Google provider** → ON
4. Paste your **Client ID** (from Step A) into the **Client ID** field
5. Paste your **Client Secret** (from Step A) into the **Client Secret** field
6. The **Authorized Client IDs** field can be left empty (or add the same Client ID)
7. Click **Save**

#### Step C — Verify the Redirect URI Matches

The redirect URI in Google Cloud Console **MUST** exactly match Supabase's callback URL:

| Setting | Value |
|---------|-------|
| **Google Cloud → Authorized redirect URIs** | `https://<YOUR_PROJECT_REF>.supabase.co/auth/v1/callback` |
| **Supabase → Authentication → URL Configuration → Redirect URLs** | Add your site URL: `http://localhost:3000/auth/callback` (dev) and `https://your-domain.com/auth/callback` (production) |

> The flow is: **Your app** → Google login → **Supabase** (`/auth/v1/callback`) → **Your app** (`/auth/callback`) → Admin dashboard

#### Step D — Add Site URL & Redirect URLs in Supabase

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL** to:
   - For local dev: `http://localhost:3000`
   - For production: `https://your-domain.com`
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-domain.com/auth/callback` (for production)

#### Quick Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured (External)
- [ ] OAuth Client ID created (Web Application type)
- [ ] Authorized redirect URI: `https://<ref>.supabase.co/auth/v1/callback`
- [ ] Google provider enabled in Supabase with Client ID + Secret
- [ ] Site URL set in Supabase Authentication settings
- [ ] Redirect URLs added: `http://localhost:3000/auth/callback`

> 🔑 **No environment variables needed for Google OAuth!** The Client ID and Secret are configured entirely in the Supabase Dashboard. Your app code already handles the OAuth flow automatically.

### 6. Make Yourself Super Admin

After signing up for the first time, promote your account to **super admin**:

1. Go to **Supabase Dashboard → Authentication → Users** and copy your **User UID**
2. Open **SQL Editor** and run:
   ```sql
   UPDATE profiles SET role = 'super_admin' WHERE user_id = 'YOUR-USER-UID-HERE';
   ```
3. Now visit `/admin/stores` to create stores and assign vendors!

### 7. Run the Dev Server

```bash
npm run dev
```

Visit **http://localhost:3000** to see the landing page.

---

## 🏪 How It Works

### Three-Tier Role System

| Role | Access | Description |
|------|--------|-------------|
| **Super Admin** | `/admin/stores`, all store dashboards | Creates stores, assigns vendors, manages everything |
| **Vendor (Admin)** | `/admin` (their store only) | Manages products, categories, orders for their assigned store |
| **Customer** | `/store/[slug]` | Browses stores, adds to cart, places orders |

### For Super Admin (You)

1. **Sign Up** at `/auth/signup` → creates an account
2. **Promote yourself** to `super_admin` via SQL (see Step 6 above)
3. **Create Stores** at `/admin/stores` — pick a business type, name, slug, WhatsApp number
4. **Assign Vendors** — invite vendors to sign up, then assign them to a store from the stores page
5. **Manage Everything** — switch between any store using the store switcher in the sidebar

### For Vendors

1. **Sign Up** at `/auth/signup` → creates a customer account
2. **Super Admin assigns** them to a store → their role becomes `admin`
3. **Admin Dashboard** at `/admin` — manage products, categories, orders, and theme for their store

### For Customers

1. Visit the store at `/store/your-store-slug`
2. Browse products, filter by category, search by name
3. Add items to cart → proceed to checkout (cart is isolated per store)
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

### Post-Deploy: Update OAuth Redirect URLs

After deploying to Vercel, update your redirect URLs:

1. **Supabase Dashboard → Authentication → URL Configuration**:
   - Change **Site URL** to `https://your-app.vercel.app`
   - Add `https://your-app.vercel.app/auth/callback` to **Redirect URLs**

2. **Google Cloud Console → Credentials → Your OAuth Client**:
   - Add `https://your-app.vercel.app` to **Authorized JavaScript origins** (optional)
   - The redirect URI stays as `https://<ref>.supabase.co/auth/v1/callback` (unchanged)

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

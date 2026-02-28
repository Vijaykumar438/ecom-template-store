"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  ShoppingCart,
  MessageCircle,
  Zap,
  ArrowRight,
  Sparkles,
  Globe,
  Palette,
  Search,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const businessTypeIcons: Record<string, string> = {
  fruits: "🍎",
  nursery: "🌱",
  nonveg: "🥩",
  electrical: "⚡",
  vegetables: "🥬",
  bakery: "🍰",
  fashion: "👗",
  pharmacy: "💊",
};

const features = [
  {
    icon: ShoppingCart,
    title: "Easy Shopping",
    description:
      "Browse products, add to cart, and checkout with just your name and WhatsApp number. No account needed.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Updates",
    description:
      "Get instant order confirmations and delivery updates directly on WhatsApp.",
  },
  {
    icon: Palette,
    title: "Unique Storefronts",
    description:
      "Every store has its own theme and branding. A premium shopping experience tailored to each business.",
  },
  {
    icon: Globe,
    title: "Local Businesses",
    description:
      "Support local vendors — from fruits and vegetables to bakeries, nurseries, fashion, and more.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Blazing fast experience powered by modern web technology. Works beautifully on any device.",
  },
  {
    icon: Store,
    title: "Cash on Delivery",
    description:
      "Simple COD ordering. No online payment hassles — pay when you receive your order.",
  },
];

interface StoreListing {
  id: string;
  slug: string;
  store_name: string;
  description: string | null;
  business_type: string;
  theme_config: Record<string, string>;
}

export default function LandingPage() {
  const [stores, setStores] = useState<StoreListing[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchStores = async () => {
      const { data } = await supabase
        .from("tenants")
        .select("id, slug, store_name, description, business_type, theme_config")
        .order("created_at", { ascending: false });
      setStores((data as StoreListing[]) || []);
      setLoading(false);
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (s) =>
      s.store_name.toLowerCase().includes(search.toLowerCase()) ||
      s.business_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Store className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900 text-lg">EcomStore</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4" />
              Shop Local • No Account Needed
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Discover Local Stores
            <br />
            <span className="text-blue-600">Shop with Ease</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto"
          >
            Browse stores from local vendors — fruits, bakery, nursery, fashion
            and more. Just pick what you need, checkout with WhatsApp, and pay on
            delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <a href="#stores">
              <Button size="lg" className="rounded-xl gap-2 px-8 h-14 text-base">
                <Store className="h-5 w-5" />
                Browse Stores
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Store Directory */}
      <section id="stores" className="py-16 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              All Stores
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-6">
              Find your favourite local store and start shopping
            </p>
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search stores or business type..."
                className="pl-10 h-12 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 rounded-xl bg-gray-200" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/store/${store.slug}`}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-11 w-11 rounded-xl flex items-center justify-center text-xl"
                            style={{
                              backgroundColor:
                                (store.theme_config?.primary || "#2563eb") + "15",
                            }}
                          >
                            {businessTypeIcons[store.business_type] || "🏪"}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {store.store_name}
                            </h3>
                            <p className="text-xs text-gray-400 capitalize">
                              {store.business_type.replace("_", " ")}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
                      </div>
                      {store.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {store.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : stores.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Store className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No stores yet</p>
              <p className="text-sm mt-1">Stores will appear here once the admin creates them</p>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No stores match &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch("")}
                className="text-sm mt-2 text-blue-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Shop Here?
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              A seamless shopping experience from local vendors you trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Browse our local stores and order your favourites. Just WhatsApp
              checkout — no account, no hassle.
            </p>
            <a href="#stores">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl gap-2 px-8 h-14 text-base shadow-lg"
              >
                Browse Stores
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center">
              <Store className="h-3 w-3" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              EcomStore
            </span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EcomStore. Built with Next.js &
            Supabase.
          </p>
        </div>
      </footer>
    </div>
  );
}

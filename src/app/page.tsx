"use client";

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { businessPresets } from "@/lib/presets/business-types";

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
    title: "Product Catalog",
    description:
      "Beautiful product listings with images, categories, and search. Add-to-cart with smooth animations.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Notifications",
    description:
      "Instant order alerts to both you and your customer via WhatsApp Business API.",
  },
  {
    icon: Palette,
    title: "Custom Themes",
    description:
      "Each business type gets a unique color theme. Fully customizable from your dashboard.",
  },
  {
    icon: Globe,
    title: "Free Deployment",
    description:
      "Deploy on Vercel for free. No hosting costs, no credit card required. Your store is live in minutes.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Built with Next.js 14. Server-side rendering, edge caching, optimized images. 100 Lighthouse score.",
  },
  {
    icon: Store,
    title: "8 Business Presets",
    description:
      "Pre-configured for fruits, nursery, meat, electrical, vegetables, bakery, fashion, and pharmacy.",
  },
];

export default function LandingPage() {
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
            <Link href="/auth/signup">
              <Button size="sm" className="rounded-xl gap-1.5">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="h-4 w-4" />
              Free Forever • No Credit Card
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Launch Your Online Store
            <br />
            <span className="text-blue-600">In Minutes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto"
          >
            A premium e-commerce template for every type of business. Fruits,
            nursery, bakery, fashion — pick your preset, add products, start
            selling.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="rounded-xl gap-2 px-8 h-14 text-base">
                <Store className="h-5 w-5" />
                Create Free Store
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Business Types */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              8 Business Presets, One Platform
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Choose your business type and get pre-configured categories, demo
              products, and a matching theme.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {businessPresets.map((preset, index) => (
              <motion.div
                key={preset.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-default"
              >
                <span className="text-4xl mb-3 block">
                  {businessTypeIcons[preset.type]}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {preset.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {preset.defaultCategories.length} categories
                </p>
                <div className="flex justify-center gap-1.5 mt-3">
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Everything You Need
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Built-in features to help you sell online without any technical
              knowledge.
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
              Ready to Start Selling?
            </h2>
            <p className="text-blue-100 mb-8 max-w-md mx-auto">
              Create your store in under 2 minutes. No credit card, no
              technical skills needed.
            </p>
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 rounded-xl gap-2 px-8 h-14 text-base shadow-lg"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
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

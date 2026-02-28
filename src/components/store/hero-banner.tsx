"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tenant } from "@/types/database";
import { getPreset } from "@/lib/presets/business-types";

interface HeroBannerProps {
  tenant: Tenant;
}

export function HeroBanner({ tenant }: HeroBannerProps) {
  const preset = getPreset(tenant.business_type);

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)`,
        }}
      />
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ backgroundColor: "var(--background)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: "var(--background)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-white/80 text-sm font-medium bg-white/10 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm">
              {preset?.heroPlaceholder || "Welcome to our store"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold text-white mb-4 max-w-2xl"
          >
            {tenant.store_name}
          </motion.h1>

          {tenant.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/80 mb-6 max-w-lg"
            >
              {tenant.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a href="#products">
              <Button
                size="lg"
                className="bg-white hover:bg-gray-100 rounded-xl gap-2 px-6 shadow-lg"
                style={{ color: "var(--primary)" }}
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

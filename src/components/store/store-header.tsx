"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Search, Store, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart";
import { CartSheet } from "@/components/store/cart-sheet";
import type { Tenant } from "@/types/database";

interface StoreHeaderProps {
  tenant: Tenant;
}

export function StoreHeader({ tenant }: StoreHeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount(tenant.id);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Store Name */}
            <Link
              href={`/store/${tenant.slug}`}
              className="flex items-center gap-2"
            >
              {tenant.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={tenant.store_name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  {tenant.store_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-lg text-gray-900 hidden sm:block">
                {tenant.store_name}
              </span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {tenant.whatsapp_number && (
                <a
                  href={`https://wa.me/${tenant.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex"
                >
                  <Button variant="ghost" size="sm" className="gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Phone className="h-4 w-4" />
                    Contact
                  </Button>
                </a>
              )}
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative rounded-full"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      {itemCount > 99 ? "99+" : itemCount}
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <CartSheet
        storeSlug={tenant.slug}
        tenantId={tenant.id}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}

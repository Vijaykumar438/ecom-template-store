"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";

interface CartSheetProps {
  storeSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CartSheet({ storeSlug, isOpen, onClose }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotal, getItemCount } =
    useCartStore();
  const sheetRef = useRef<HTMLDivElement>(null);

  // Filter items for this store's tenant
  const storeItems = items.filter((item) => item.tenantId);
  const totalAmount = getTotal();
  const itemCount = getItemCount();

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" style={{ color: "var(--primary)" }} />
                <h2 className="font-bold text-lg">Your Cart</h2>
                {itemCount > 0 && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {itemCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {storeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ShoppingCart className="h-16 w-16 text-gray-200 mb-4" />
                    <p className="text-gray-500 font-medium mb-1">
                      Your cart is empty
                    </p>
                    <p className="text-gray-400 text-sm">
                      Add items to get started
                    </p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {storeItems.map((item) => (
                      <motion.div
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                        className="flex gap-3 bg-gray-50 rounded-xl p-3"
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatPrice(item.price)} / {item.unit}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  item.quantity <= 1
                                    ? removeItem(item.productId)
                                    : updateQuantity(
                                        item.productId,
                                        item.quantity - 1
                                      )
                                }
                                className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  )
                                }
                                className="h-7 w-7 rounded-md border flex items-center justify-center hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.productId)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {storeItems.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="border-t p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold text-lg">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Delivery charges calculated at checkout
                </p>
                <Link href={`/store/${storeSlug}/checkout`} onClick={onClose}>
                  <Button className="w-full h-12 text-base rounded-xl gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    Proceed to Checkout
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

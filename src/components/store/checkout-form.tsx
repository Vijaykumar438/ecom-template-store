"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, MessageCircle, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { CheckoutDetails } from "@/types/database";

interface CheckoutFormProps {
  storeSlug: string;
  tenantId: string;
  onSubmit: (details: CheckoutDetails) => Promise<void>;
}

export function CheckoutForm({ storeSlug, tenantId, onSubmit }: CheckoutFormProps) {
  const { items, getTotal, savedDetails, saveCheckoutDetails } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveDetails, setSaveDetails] = useState(true);
  const [form, setForm] = useState<CheckoutDetails>({
    name: "",
    whatsappNumber: "",
    address: "",
    notes: "",
  });

  // Load saved details from localStorage
  useEffect(() => {
    if (savedDetails) {
      setForm(savedDetails);
    }
  }, [savedDetails]);

  const storeItems = items.filter((item) => item.tenantId === tenantId);
  const total = storeItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.whatsappNumber.trim() || !form.address.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (saveDetails) {
        saveCheckoutDetails(form);
      }
      await onSubmit(form);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form */}
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-6"
        onSubmit={handleSubmit}
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Delivery Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Your full name"
                  className="pl-10"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                WhatsApp Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="+91 98765 43210"
                  className="pl-10"
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) =>
                    setForm({ ...form, whatsappNumber: e.target.value })
                  }
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Order updates will be sent via WhatsApp
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  placeholder="Full delivery address including landmark"
                  className="pl-10 min-h-[100px]"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Notes (Optional)
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  placeholder="Any special instructions..."
                  className="pl-10"
                  value={form.notes || ""}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Save Details Checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={saveDetails}
                onChange={(e) => setSaveDetails(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
                style={{ accentColor: "var(--primary)" }}
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Save my details for next time
                </span>
                <p className="text-xs text-gray-400">
                  Stored locally on your device
                </p>
              </div>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full h-14 text-lg rounded-xl gap-2"
          disabled={isSubmitting || storeItems.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Placing Order...
            </>
          ) : (
            <>
              Place Order (COD) — {formatPrice(total)}
            </>
          )}
        </Button>
      </motion.form>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2"
      >
        <div className="bg-gray-50 rounded-2xl p-5 sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {storeItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-gray-700 line-clamp-1">
                    {item.name}
                  </span>
                  <span className="text-gray-400 ml-1">
                    × {item.quantity}
                  </span>
                </div>
                <span className="font-medium text-gray-900 ml-3">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span className="text-green-600">To be confirmed</span>
            </div>
            <div className="flex items-center justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-4 bg-green-50 rounded-xl p-3 text-center">
            <p className="text-xs text-green-700 font-medium">
              💵 Cash on Delivery
            </p>
            <p className="text-xs text-green-600 mt-0.5">
              Pay when you receive your order
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

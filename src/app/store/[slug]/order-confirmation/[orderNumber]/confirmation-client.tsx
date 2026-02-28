"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ShoppingBag,
  Phone,
  MapPin,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import type { Tenant } from "@/types/database";

interface OrderConfirmationClientProps {
  tenant: Tenant;
  order: any;
  storeSlug: string;
}

export function OrderConfirmationClient({
  tenant,
  order,
  storeSlug,
}: OrderConfirmationClientProps) {
  const items = order.order_items || [];
  const whatsappMessage = `Hi! I just placed order #${order.order_number} at ${tenant.store_name}. Please confirm. 🙏`;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 150 }}
          className="text-center mb-8"
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: "var(--primary)", opacity: 0.1 }}
          >
            <CheckCircle2
              className="h-12 w-12"
              style={{ color: "var(--primary)" }}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-gray-500">
            Thank you for your order. You&apos;ll receive a WhatsApp confirmation
            shortly.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6"
        >
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <p className="text-lg font-bold text-gray-900">
                  #{order.order_number}
                </p>
              </div>
              <div
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-5 space-y-3">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div>
                  <span className="text-gray-700">{item.product_name}</span>
                  <span className="text-gray-400 ml-1.5">
                    × {item.quantity}
                  </span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatPrice(item.product_price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">💵 Cash on Delivery</p>
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6"
        >
          <h3 className="font-semibold text-gray-900 mb-3">
            Delivery Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">
                {order.customer_whatsapp}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-gray-700">{order.delivery_address}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href={getWhatsAppLink(
              tenant.whatsapp_number,
              whatsappMessage
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              className="w-full rounded-xl gap-2 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with Seller
            </Button>
          </a>
          <Link href={`/store/${storeSlug}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-xl gap-2"
              size="lg"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

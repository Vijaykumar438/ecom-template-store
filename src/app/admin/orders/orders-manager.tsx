"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Phone,
  MapPin,
  MessageCircle,
  Package,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getWhatsAppLink } from "@/lib/utils";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface OrdersManagerProps {
  orders: any[];
  tenantId: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", variant: "warning" },
  { value: "confirmed", label: "Confirmed", variant: "default" },
  { value: "out_for_delivery", label: "Out for Delivery", variant: "default" },
  { value: "delivered", label: "Delivered", variant: "success" },
  { value: "cancelled", label: "Cancelled", variant: "destructive" },
];

export function OrdersManager({ orders: initialOrders, tenantId }: OrdersManagerProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredOrders = initialOrders.filter((o) => {
    const matchSearch =
      o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    router.refresh();
  };

  return (
    <div className="space-y-6 pt-14 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">
          {initialOrders.length} total orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order # or customer..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === order.id ? null : order.id)
                }
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        #{order.order_number}
                      </span>
                      <Badge
                        variant={
                          (statusOptions.find(
                            (s) => s.value === order.status
                          )?.variant || "default") as any
                        }
                      >
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.customer_name} •{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    {formatPrice(order.total_amount)}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedId === order.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {/* Customer Info */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {order.customer_whatsapp}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          {order.delivery_address}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                        {(order.order_items || []).map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-700">
                              {item.product_name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.unit_price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className="h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:border-blue-500"
                        >
                          {statusOptions.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                        <a
                          href={getWhatsAppLink(
                            order.customer_whatsapp,
                            `Hi ${order.customer_name}! Regarding your order #${order.order_number}`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-lg text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

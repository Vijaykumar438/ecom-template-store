"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

interface DashboardContentProps {
  stats: {
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  recentOrders: any[];
}

const statCards = [
  {
    key: "totalProducts",
    label: "Products",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
    href: "/admin/products",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600",
    href: "/admin/orders",
  },
  {
    key: "pendingOrders",
    label: "Pending",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
    href: "/admin/orders",
  },
  {
    key: "totalRevenue",
    label: "Revenue",
    icon: DollarSign,
    color: "bg-purple-50 text-purple-600",
    href: "/admin/orders",
    isPrice: true,
  },
];

const statusColors: Record<string, string> = {
  pending: "warning",
  confirmed: "default",
  out_for_delivery: "default",
  delivered: "success",
  cancelled: "destructive",
};

export function DashboardContent({ stats, recentOrders }: DashboardContentProps) {
  return (
    <div className="space-y-8 pt-14 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={card.href}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`}
                >
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {card.isPrice
                    ? formatPrice(stats[card.key as keyof typeof stats])
                    : stats[card.key as keyof typeof stats]}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="gap-1.5">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900">
                      #{order.order_number}
                    </span>
                    <Badge
                      variant={
                        (statusColors[order.status] || "default") as any
                      }
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.customer_name} •{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Share your store link to start receiving orders
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

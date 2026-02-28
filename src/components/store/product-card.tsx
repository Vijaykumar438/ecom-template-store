"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  tenantId: string;
  index?: number;
}

export function ProductCard({ product, tenantId, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find(
    (i) => i.productId === product.id && i.tenantId === tenantId
  );

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images[0] || "/presets/placeholder.jpg",
      quantity: 1,
      tenantId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={product.images[0] || "/presets/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {product.is_demo && (
          <Badge variant="warning" className="absolute top-2 left-2">
            Sample
          </Badge>
        )}
        {!product.is_available && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-gray-400 ml-1">/{product.unit}</span>
          </div>

          {product.is_available && (
            <>
              {cartItem ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg"
                    onClick={() =>
                      cartItem.quantity <= 1
                        ? removeItem(product.id)
                        : updateQuantity(product.id, cartItem.quantity - 1)
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-semibold w-5 text-center">
                    {cartItem.quantity}
                  </span>
                  <Button
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() =>
                      updateQuantity(product.id, cartItem.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size="sm"
                    className="rounded-lg gap-1.5"
                    onClick={handleAdd}
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

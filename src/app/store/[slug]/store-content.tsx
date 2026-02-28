"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/store/product-card";
import { CategoryFilter } from "@/components/store/category-filter";
import type { Tenant, Category, Product } from "@/types/database";

interface StoreContentProps {
  tenant: Tenant;
  categories: Category[];
  products: Product[];
}

export function StoreContent({ tenant, categories, products }: StoreContentProps) {
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategoryId) {
      result = result.filter((p) => p.category_id === activeCategoryId);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [products, activeCategoryId, search]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
        />
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              tenantId={tenant.id}
              index={index}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <Package className="h-16 w-16 text-gray-200 mb-4" />
          <h3 className="font-semibold text-gray-700 mb-1">No products found</h3>
          <p className="text-sm text-gray-400">
            {search
              ? "Try a different search term"
              : "Products will be available soon!"}
          </p>
        </motion.div>
      )}
    </div>
  );
}

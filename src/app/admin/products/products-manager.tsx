"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface ProductsManagerProps {
  products: any[];
  categories: any[];
  tenantId: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  unit: string;
  images: string[];
  stock_quantity: string;
  is_available: boolean;
  category_id: string;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  unit: "kg",
  images: [],
  stock_quantity: "100",
  is_available: true,
  category_id: "",
};

export function ProductsManager({
  products: initialProducts,
  categories,
  tenantId,
}: ProductsManagerProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const filteredProducts = initialProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || "" });
    setShowForm(true);
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      unit: product.unit,
      images: product.images || [],
      stock_quantity: String(product.stock_quantity),
      is_available: product.is_available,
      category_id: product.category_id,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) return;
    setSaving(true);

    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      unit: form.unit,
      images: form.images,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_available: form.is_available,
      category_id: form.category_id,
      tenant_id: tenantId,
    };

    if (editingId) {
      await supabase.from("products").update(productData).eq("id", editingId);
    } else {
      await supabase.from("products").insert(productData);
    }

    setShowForm(false);
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    router.refresh();
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      setForm({ ...form, images: [...form.images, imageUrl.trim()] });
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 pt-14 md:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {initialProducts.length} total products
          </p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="h-14 w-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </h3>
                    {product.is_demo && (
                      <Badge variant="warning" className="text-[10px]">
                        Demo
                      </Badge>
                    )}
                    {!product.is_available && (
                      <Badge variant="destructive" className="text-[10px]">
                        Unavailable
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {product.categories?.name} • {product.unit}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Stock: {product.stock_quantity}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => openEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Dialog */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-white rounded-2xl shadow-xl z-50 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="font-bold text-lg">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Product description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <Input
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })
                      }
                      placeholder="kg, piece, dozen..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={form.category_id}
                      onChange={(e) =>
                        setForm({ ...form, category_id: e.target.value })
                      }
                      className="w-full h-11 rounded-xl border-2 border-gray-200 px-3 text-sm focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select</option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <Input
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) =>
                        setForm({ ...form, stock_quantity: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addImage}
                      className="rounded-xl"
                    >
                      Add
                    </Button>
                  </div>
                  {form.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {form.images.map((url, i) => (
                        <div
                          key={i}
                          className="relative h-16 w-16 rounded-lg overflow-hidden group"
                        >
                          <img
                            src={url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) =>
                      setForm({ ...form, is_available: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Available for sale
                  </span>
                </label>
              </div>

              {/* Footer */}
              <div className="p-5 border-t flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="gap-1.5 rounded-xl"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{editingId ? "Update" : "Create"} Product</>
                  )}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

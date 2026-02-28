"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Tags,
  GripVertical,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

interface CategoriesManagerProps {
  categories: any[];
  tenantId: string;
}

export function CategoriesManager({
  categories: initialCategories,
  tenantId,
}: CategoriesManagerProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setIconName("");
    setShowForm(true);
  };

  const openEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setIconName(cat.icon_name || "");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    const data = {
      name: name.trim(),
      icon_name: iconName.trim() || null,
      tenant_id: tenantId,
      display_order: editingId
        ? undefined
        : initialCategories.length,
    };

    if (editingId) {
      const { icon_name, name: n } = data;
      await supabase
        .from("categories")
        .update({ name: n, icon_name })
        .eq("id", editingId);
    } else {
      await supabase.from("categories").insert(data);
    }

    setShowForm(false);
    setSaving(false);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in this category won't be deleted."))
      return;
    await supabase.from("categories").delete().eq("id", id);
    router.refresh();
  };

  return (
    <div className="space-y-6 pt-14 md:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">
            {initialCategories.length} categories
          </p>
        </div>
        <Button onClick={openAdd} className="gap-1.5 rounded-xl">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {initialCategories.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {initialCategories.map((cat, index) => (
              <div
                key={cat.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <GripVertical className="h-5 w-5 text-gray-300 flex-shrink-0" />
                <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Tags className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-gray-900">
                    {cat.name}
                  </h3>
                  {cat.icon_name && (
                    <p className="text-xs text-gray-400">
                      Icon: {cat.icon_name}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => openEdit(cat)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Tags className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No categories yet</p>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-xl z-50"
            >
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="font-bold text-lg">
                  {editingId ? "Edit Category" : "Add Category"}
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
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Seasonal Fruits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon Name (optional)
                  </label>
                  <Input
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    placeholder="e.g., apple, leaf, package"
                  />
                </div>
              </div>
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
                  disabled={saving || !name.trim()}
                  className="gap-1.5 rounded-xl"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{editingId ? "Update" : "Create"}</>
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

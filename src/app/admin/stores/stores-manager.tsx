"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Plus,
  ExternalLink,
  Users,
  Package,
  ShoppingCart,
  Trash2,
  UserPlus,
  X,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { businessPresets } from "@/lib/presets/business-types";
import { slugify } from "@/lib/utils";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Tenant, Profile, BusinessType } from "@/types/database";

const businessTypeIcons: Record<string, string> = {
  fruits: "🍎",
  nursery: "🌱",
  nonveg: "🥩",
  electrical: "⚡",
  vegetables: "🥬",
  bakery: "🍰",
  fashion: "👗",
  pharmacy: "💊",
};

interface StoresManagerProps {
  tenants: Tenant[];
  vendors: Profile[];
}

export function StoresManager({ tenants: initialTenants, vendors }: StoresManagerProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [tenants, setTenants] = useState(initialTenants);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create store form
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleCreateStore = async () => {
    if (!businessType || !storeName || !whatsappNumber) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const slug = slugify(storeName);
      const preset = businessPresets.find((p) => p.type === businessType);

      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          slug,
          store_name: storeName,
          description: description || null,
          business_type: businessType,
          theme_config: preset?.colors || {
            primary: "#2563eb",
            accent: "#7c3aed",
            background: "#ffffff",
            foreground: "#171717",
          },
          whatsapp_number: whatsappNumber,
          address: address || null,
          owner_user_id: user.id,
        })
        .select()
        .single();

      if (tenantError) {
        setError(tenantError.message.includes("duplicate")
          ? "A store with this name already exists."
          : tenantError.message
        );
        setLoading(false);
        return;
      }

      // Seed demo data
      await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          businessType,
        }),
      });

      setTenants([tenant, ...tenants]);
      setShowCreateModal(false);
      resetForm();
      router.refresh();
    } catch (err) {
      setError("Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVendor = async (tenantId: string, vendorUserId: string) => {
    setLoading(true);
    try {
      await supabase
        .from("profiles")
        .update({ tenant_id: tenantId, role: "admin" })
        .eq("user_id", vendorUserId);

      setShowAssignModal(null);
      router.refresh();
    } catch {
      setError("Failed to assign vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (tenantId: string) => {
    if (!confirm("Are you sure? This will delete the store and all its data.")) return;

    setLoading(true);
    try {
      await supabase.from("tenants").delete().eq("id", tenantId);
      setTenants(tenants.filter((t) => t.id !== tenantId));
      router.refresh();
    } catch {
      setError("Failed to delete store");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBusinessType(null);
    setStoreName("");
    setDescription("");
    setWhatsappNumber("");
    setAddress("");
    setError(null);
  };

  const getVendorForTenant = (tenantId: string) =>
    vendors.find((v) => v.tenant_id === tenantId);

  const unassignedVendors = vendors.filter(
    (v) => !v.tenant_id || !tenants.some((t) => t.id === v.tenant_id)
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Manage Stores</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Create stores and assign vendors to manage them
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Store
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((tenant, idx) => {
          const vendor = getVendorForTenant(tenant.id);
          return (
            <motion.div
              key={tenant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Store Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      backgroundColor:
                        (tenant.theme_config as any)?.primary + "15" || "#f3f4f6",
                    }}
                  >
                    {businessTypeIcons[tenant.business_type] || "🏪"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {tenant.store_name}
                    </h3>
                    <p className="text-xs text-gray-400 capitalize">
                      {tenant.business_type} • /{tenant.slug}
                    </p>
                  </div>
                </div>
                <a
                  href={`/store/${tenant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              {/* Vendor Assignment */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                {vendor ? (
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {vendor.full_name}
                      </p>
                      <p className="text-[10px] text-gray-400">Vendor</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAssignModal(tenant.id)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Assign Vendor
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setShowAssignModal(tenant.id)}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1" />
                  {vendor ? "Reassign" : "Assign"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                  onClick={() => handleDeleteStore(tenant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}

        {tenants.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400">
            <Store className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No stores yet</p>
            <p className="text-sm mt-1">Create your first store to get started</p>
          </div>
        )}
      </div>

      {/* Create Store Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => { setShowCreateModal(false); resetForm(); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Create New Store</h2>
                  <button onClick={() => { setShowCreateModal(false); resetForm(); }}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Business Type Selection */}
                <div className="mb-5">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Business Type
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {businessPresets.map((preset) => (
                      <button
                        key={preset.type}
                        onClick={() => setBusinessType(preset.type)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs ${
                          businessType === preset.type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-lg">
                          {businessTypeIcons[preset.type]}
                        </span>
                        <span className="font-medium text-gray-700 truncate w-full text-center">
                          {preset.label.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    placeholder="Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                  <Input
                    placeholder="WhatsApp Number (e.g., +919876543210)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                  <Input
                    placeholder="Address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {storeName && (
                  <p className="text-xs text-gray-400 mt-2">
                    Store URL: /store/<strong>{slugify(storeName)}</strong>
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-600 mt-3">{error}</p>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateStore}
                    disabled={!businessType || !storeName || !whatsappNumber || loading}
                    className="flex-1 gap-2"
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Store
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Assign Vendor Modal */}
      <AnimatePresence>
        {showAssignModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowAssignModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[80vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">
                    Assign Vendor
                  </h2>
                  <button onClick={() => setShowAssignModal(null)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Select a user to assign as the vendor for this store.
                  They&apos;ll get access to the admin dashboard for this store.
                </p>

                {vendors.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No users available to assign</p>
                    <p className="text-xs mt-1">Users need to sign up first</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {vendors.map((vendor) => (
                      <button
                        key={vendor.id}
                        onClick={() =>
                          handleAssignVendor(showAssignModal, vendor.user_id)
                        }
                        disabled={loading}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                          {vendor.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {vendor.full_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {vendor.tenant_id ? "Currently assigned to a store" : "Unassigned"}
                          </p>
                        </div>
                        {vendor.tenant_id === showAssignModal && (
                          <Badge variant="success" className="text-[10px]">
                            Current
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

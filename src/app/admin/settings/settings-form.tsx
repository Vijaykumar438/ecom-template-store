"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Store,
  Phone,
  MapPin,
  Palette,
  Save,
  Loader2,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Tenant } from "@/types/database";

interface SettingsFormProps {
  tenant: Tenant;
}

export function SettingsForm({ tenant }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    store_name: tenant.store_name,
    description: tenant.description || "",
    whatsapp_number: tenant.whatsapp_number,
    address: tenant.address || "",
    primary: tenant.theme_config.primary,
    accent: tenant.theme_config.accent,
  });

  const storeUrl = typeof window !== "undefined"
    ? `${window.location.origin}/store/${tenant.slug}`
    : `/store/${tenant.slug}`;

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("tenants")
      .update({
        store_name: form.store_name,
        description: form.description || null,
        whatsapp_number: form.whatsapp_number,
        address: form.address || null,
        theme_config: {
          ...tenant.theme_config,
          primary: form.primary,
          accent: form.accent,
        },
      })
      .eq("id", tenant.id);

    setSaving(false);
    router.refresh();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pt-14 md:pt-0 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your store settings
        </p>
      </div>

      {/* Store URL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 rounded-2xl p-5"
      >
        <p className="text-sm font-medium text-blue-900 mb-2">
          Your Store URL
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-white rounded-xl px-4 py-2.5 text-sm text-blue-700 border border-blue-100 truncate">
            {storeUrl}
          </code>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl flex-shrink-0 border-blue-200"
            onClick={copyUrl}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-blue-600" />
            )}
          </Button>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl flex-shrink-0 border-blue-200"
            >
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </Button>
          </a>
        </div>
      </motion.div>

      {/* Store Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Store className="h-5 w-5 text-gray-400" />
          Store Information
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Store Name
          </label>
          <Input
            value={form.store_name}
            onChange={(e) => setForm({ ...form, store_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="About your store..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            WhatsApp Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              value={form.whatsapp_number}
              onChange={(e) =>
                setForm({ ...form, whatsapp_number: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              className="pl-10"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
      >
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <Palette className="h-5 w-5 text-gray-400" />
          Theme Colors
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Primary Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primary}
                onChange={(e) => setForm({ ...form, primary: e.target.value })}
                className="w-10 h-10 rounded-lg border cursor-pointer"
              />
              <Input
                value={form.primary}
                onChange={(e) => setForm({ ...form, primary: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
                className="w-10 h-10 rounded-lg border cursor-pointer"
              />
              <Input
                value={form.accent}
                onChange={(e) => setForm({ ...form, accent: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        {/* Preview */}
        <div className="rounded-xl overflow-hidden h-16" style={{
          background: `linear-gradient(135deg, ${form.primary} 0%, ${form.accent} 100%)`
        }}>
          <div className="h-full flex items-center justify-center">
            <span className="text-white font-medium text-sm opacity-80">Theme Preview</span>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-1.5 rounded-xl px-6"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

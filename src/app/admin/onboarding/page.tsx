"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Phone,
  Palette,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { businessPresets } from "@/lib/presets/business-types";
import { slugify } from "@/lib/utils";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { BusinessType } from "@/types/database";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Prevent super_admin from accessing onboarding
  const supabaseCheck = createBrowserClient();
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseCheck.auth.getUser();
      if (user) {
        const { data: profile } = await supabaseCheck
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        if (profile?.role === 'super_admin') {
          router.replace('/admin');
          return;
        }
      }
      setChecking(false);
    })();
  }, []);

  // Form state
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [address, setAddress] = useState("");

  const supabase = createBrowserClient();
  const selectedPreset = businessType
    ? businessPresets.find((p) => p.type === businessType)
    : null;

  const handleCreate = async () => {
    if (!businessType || !storeName || !whatsappNumber) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please sign in to continue");
        setLoading(false);
        return;
      }

      const slug = slugify(storeName);

      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          slug,
          store_name: storeName,
          description: description || null,
          business_type: businessType,
          theme_config: selectedPreset?.colors || {
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
        if (tenantError.message.includes("duplicate")) {
          setError(
            "A store with this name already exists. Try a different name."
          );
        } else {
          setError(tenantError.message);
        }
        setLoading(false);
        return;
      }

      // Update profile with tenant
      await supabase
        .from("profiles")
        .update({ tenant_id: tenant.id, role: "admin" })
        .eq("user_id", user.id);

      // Seed demo data
      await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenant.id,
          businessType,
        }),
      });

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Choose Your Business Type",
      subtitle: "This sets up the right categories and demo products for you",
    },
    {
      title: "Store Details",
      subtitle: "Tell us about your business",
    },
    {
      title: "Ready to Launch!",
      subtitle: "Review your store setup",
    },
  ];

  const canProceed = () => {
    if (step === 0) return !!businessType;
    if (step === 1) return !!storeName.trim() && !!whatsappNumber.trim();
    return true;
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? "bg-blue-600 w-12" : "bg-gray-200 w-8"
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-900">
              {steps[step].title}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {steps[step].subtitle}
            </p>
          </div>

          <div className="p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 text-center"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 0: Business Type Picker */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {businessPresets.map((preset) => (
                    <button
                      key={preset.type}
                      onClick={() => setBusinessType(preset.type)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                        businessType === preset.type
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {businessType === preset.type && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                      <span className="text-3xl mb-2 block">
                        {businessTypeIcons[preset.type]}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Step 1: Store Details */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Store Name *
                    </label>
                    <Input
                      placeholder="e.g., Fresh Fruits Market"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                    {storeName && (
                      <p className="text-xs text-gray-400 mt-1">
                        URL: /store/{slugify(storeName)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <Textarea
                      placeholder="A few words about your business..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      WhatsApp Number *
                    </label>
                    <Input
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Orders will be notified to this number
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Business Address
                    </label>
                    <Textarea
                      placeholder="Your business address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Review */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {businessType && businessTypeIcons[businessType]}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {storeName}
                        </h3>
                        <p className="text-xs text-gray-500 capitalize">
                          {selectedPreset?.label}
                        </p>
                      </div>
                    </div>
                    {description && (
                      <p className="text-sm text-gray-600">{description}</p>
                    )}
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📱 WhatsApp: {whatsappNumber}</p>
                      {address && <p>📍 {address}</p>}
                      <p>🔗 /store/{slugify(storeName)}</p>
                    </div>
                  </div>

                  {/* Theme Preview */}
                  {selectedPreset && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Store Theme
                      </p>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded-lg border"
                          style={{
                            backgroundColor: selectedPreset.colors.primary,
                          }}
                          title="Primary"
                        />
                        <div
                          className="w-10 h-10 rounded-lg border"
                          style={{
                            backgroundColor: selectedPreset.colors.accent,
                          }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-sm text-blue-700 font-medium">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      Demo products will be auto-loaded for 7 days
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            {step > 0 ? (
              <Button
                variant="ghost"
                onClick={() => setStep(step - 1)}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="gap-1.5"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={loading || !canProceed()}
                className="gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Store...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Launch My Store
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

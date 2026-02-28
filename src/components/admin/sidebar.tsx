"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ExternalLink,
  ChevronDown,
  Plus,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Tenant, Profile } from "@/types/database";

interface AdminSidebarProps {
  tenant: Tenant | null;
  profile: Profile;
  allTenants?: Tenant[];
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tags },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ tenant, profile, allTenants = [] }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [storeSwitcherOpen, setStoreSwitcherOpen] = useState(false);
  const supabase = createBrowserClient();

  const isSuperAdmin = profile.role === "super_admin";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const handleSwitchStore = async (tenantId: string) => {
    // Update profile's active tenant
    await supabase
      .from("profiles")
      .update({ tenant_id: tenantId })
      .eq("user_id", profile.user_id);
    setStoreSwitcherOpen(false);
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header — Store Info or Super Admin */}
      <div className="p-5 border-b border-gray-100">
        {isSuperAdmin && allTenants.length > 0 ? (
          <div className="space-y-2">
            {/* Super Admin Badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <Shield className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                Super Admin
              </span>
            </div>
            {/* Store Switcher */}
            <div className="relative">
              <button
                onClick={() => setStoreSwitcherOpen(!storeSwitcherOpen)}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {tenant ? (
                  <>
                    <div className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {tenant.store_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {tenant.store_name}
                      </p>
                      <p className="text-[11px] text-gray-400 capitalize">
                        {tenant.business_type}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-9 w-9 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Store className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">Select a store</span>
                  </>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    storeSwitcherOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {storeSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto"
                  >
                    {allTenants.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleSwitchStore(t.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                          tenant?.id === t.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="h-7 w-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {t.store_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {t.store_name}
                          </p>
                          <p className="text-[10px] text-gray-400 capitalize">
                            {t.business_type}
                          </p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : tenant ? (
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <img
                src={tenant.logo_url}
                alt={tenant.store_name}
                className="h-10 w-10 rounded-xl object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                {tenant.store_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-gray-900 text-sm truncate">
                {tenant.store_name}
              </h2>
              <p className="text-xs text-gray-400 capitalize">
                {tenant.business_type.replace("_", " ")}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Super Admin Nav */}
      {isSuperAdmin && (
        <div className="px-3 pt-3">
          <Link
            href="/admin/stores"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === "/admin/stores"
                ? "bg-purple-50 text-purple-600"
                : "text-purple-600 hover:bg-purple-50"
            }`}
          >
            <Users className="h-5 w-5 flex-shrink-0" />
            Manage Stores
          </Link>
          <div className="border-b border-gray-100 my-2" />
        </div>
      )}

      {/* Navigation — only show if a tenant is selected */}
      <nav className="flex-1 p-3 space-y-1">
        {tenant ? (
          navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })
        ) : (
          <div className="text-center text-gray-400 text-sm py-8">
            <Store className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Select a store to manage</p>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        {tenant && (
          <a
            href={`/store/${tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <ExternalLink className="h-5 w-5" />
            View Store
          </a>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r border-gray-100">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="ml-3 font-bold text-gray-900 text-sm">
          {tenant?.store_name || "Admin"}
        </span>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-xl"
            >
              <div className="absolute top-3 right-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

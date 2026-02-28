import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Super admin: can access everything, sees all stores
  if (profile?.role === "super_admin") {
    // Get all tenants for super admin
    const { data: tenants } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });

    // If super admin has a selected tenant, use it; otherwise show management view
    const selectedTenantId = profile.tenant_id;
    const tenant = selectedTenantId
      ? tenants?.find((t: any) => t.id === selectedTenantId)
      : tenants?.[0];

    return (
      <div className="min-h-screen flex bg-gray-50">
        <AdminSidebar
          tenant={tenant || null}
          profile={profile}
          allTenants={tenants || []}
        />
        <main className="flex-1 ml-0 md:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    );
  }

  // Customer role: redirect to home — customers don't access admin
  if (profile?.role === "customer") {
    redirect("/");
  }

  // Vendor without assigned store: show waiting screen
  if (!profile?.tenant_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Waiting for Store Assignment
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Your account is set up! The super admin will assign you to a store shortly.
            Once assigned, you&apos;ll be able to manage products, categories, and orders.
          </p>
          <a
            href="/api/auth/signout"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            Sign Out
          </a>
        </div>
      </div>
    );
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", profile.tenant_id)
    .single();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar tenant={tenant} profile={profile} />
      <main className="flex-1 ml-0 md:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

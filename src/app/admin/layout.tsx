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

  // Regular vendor: must have a tenant assigned
  if (!profile?.tenant_id) {
    // Allow access to onboarding page
    return <>{children}</>;
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

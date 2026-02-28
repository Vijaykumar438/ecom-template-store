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

  // Get user's tenant
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, tenants(*)")
    .eq("user_id", user.id)
    .single();

  // If no tenant, redirect to onboarding
  if (!profile?.tenant_id) {
    // Allow access to onboarding page
    return <>{children}</>;
  }

  const tenant = (profile as any).tenants;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar tenant={tenant} profile={profile} />
      <main className="flex-1 ml-0 md:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

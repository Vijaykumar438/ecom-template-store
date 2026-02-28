import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get profile + tenant
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.tenant_id) {
    // Super admin without a selected store → go to store management
    if (profile?.role === "super_admin") {
      redirect("/admin/stores");
    }
    redirect("/admin/onboarding");
  }

  // Fetch stats in parallel
  const [productsRes, ordersRes, pendingRes] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", profile.tenant_id),
    supabase
      .from("orders")
      .select("id, total_amount", { count: "exact" })
      .eq("tenant_id", profile.tenant_id),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("tenant_id", profile.tenant_id)
      .eq("status", "pending"),
  ]);

  const totalProducts = productsRes.count || 0;
  const totalOrders = ordersRes.count || 0;
  const pendingOrders = pendingRes.count || 0;
  const totalRevenue = (ordersRes.data || []).reduce(
    (sum: number, o: any) => sum + (o.total_amount || 0),
    0
  );

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("tenant_id", profile.tenant_id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <DashboardContent
      stats={{
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
      }}
      recentOrders={recentOrders || []}
    />
  );
}

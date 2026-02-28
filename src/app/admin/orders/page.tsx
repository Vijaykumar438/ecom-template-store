import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrdersManager } from "./orders-manager";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile?.tenant_id) redirect("/admin/onboarding");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("tenant_id", profile.tenant_id)
    .order("created_at", { ascending: false });

  return <OrdersManager orders={orders || []} tenantId={profile.tenant_id} />;
}

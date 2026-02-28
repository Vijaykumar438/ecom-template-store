import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsManager } from "./products-manager";

export default async function AdminProductsPage() {
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

  if (!profile?.tenant_id) {
    if (profile?.role === "super_admin") redirect("/admin/stores");
    redirect("/admin/onboarding");
  }

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("*, categories(name)")
      .eq("tenant_id", profile.tenant_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", profile.tenant_id)
      .order("display_order"),
  ]);

  return (
    <ProductsManager
      products={productsRes.data || []}
      categories={categoriesRes.data || []}
      tenantId={profile.tenant_id}
    />
  );
}

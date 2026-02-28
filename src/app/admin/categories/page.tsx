import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoriesManager } from "./categories-manager";

export default async function AdminCategoriesPage() {
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

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("tenant_id", profile.tenant_id)
    .order("display_order");

  return (
    <CategoriesManager
      categories={categories || []}
      tenantId={profile.tenant_id}
    />
  );
}

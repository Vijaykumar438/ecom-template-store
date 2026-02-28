import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";
import type { Tenant } from "@/types/database";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, tenants(*)")
    .eq("user_id", user.id)
    .single();

  if (!profile?.tenant_id) {
    if (profile?.role === "super_admin") redirect("/admin/stores");
    redirect("/");
  }

  return <SettingsForm tenant={(profile as any).tenants as Tenant} />;
}

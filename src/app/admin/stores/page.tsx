import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoresManager } from "./stores-manager";

export default async function StoresPage() {
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

  if (profile?.role !== "super_admin") {
    redirect("/admin");
  }

  // Get all tenants with their owner profiles
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .order("created_at", { ascending: false });

  // Get all vendor profiles (admin role users)
  const { data: vendors } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "customer"])
    .order("created_at", { ascending: false });

  return (
    <StoresManager
      tenants={tenants || []}
      vendors={vendors || []}
    />
  );
}

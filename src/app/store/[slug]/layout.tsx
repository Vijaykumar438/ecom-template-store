import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types/database";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tenant) return { title: "Store Not Found" };

  return {
    title: `${tenant.store_name} — Shop Online`,
    description: tenant.description || `Browse products from ${tenant.store_name}`,
  };
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tenant) {
    notFound();
  }

  const t = tenant as Tenant;
  const theme = t.theme_config;

  return (
    <div
      style={
        {
          "--primary": theme.primary,
          "--accent": theme.accent,
          "--background": theme.background,
          "--foreground": theme.foreground,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

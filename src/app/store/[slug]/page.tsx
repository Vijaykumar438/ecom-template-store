import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { HeroBanner } from "@/components/store/hero-banner";
import { StoreContent } from "./store-content";
import type { Tenant, Category, Product } from "@/types/database";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tenant) notFound();

  // Fetch categories & products in parallel
  const [categoriesRes, productsRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("tenant_id", tenant.id)
      .order("display_order"),
    supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenant.id)
      .eq("is_available", true)
      .order("created_at", { ascending: false }),
  ]);

  const categories = (categoriesRes.data || []) as Category[];
  const products = (productsRes.data || []) as Product[];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <StoreHeader tenant={tenant as Tenant} />
      <HeroBanner tenant={tenant as Tenant} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 w-full py-8">
        <div id="products">
          <StoreContent
            tenant={tenant as Tenant}
            categories={categories}
            products={products}
          />
        </div>
      </main>

      <StoreFooter tenant={tenant as Tenant} />
    </div>
  );
}

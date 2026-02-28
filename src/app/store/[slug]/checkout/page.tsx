import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Tenant } from "@/types/database";
import { StoreHeader } from "@/components/store/store-header";
import { CheckoutClient } from "./checkout-client";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tenant) notFound();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <StoreHeader tenant={tenant as Tenant} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your order and provide delivery details
          </p>
        </div>
        <CheckoutClient tenant={tenant as Tenant} storeSlug={slug} />
      </main>
    </div>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderConfirmationClient } from "./confirmation-client";
import type { Tenant } from "@/types/database";

interface OrderConfirmationPageProps {
  params: Promise<{ slug: string; orderNumber: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { slug, orderNumber } = await params;
  const supabase = await createClient();

  // Fetch tenant
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!tenant) notFound();

  // Fetch order with items
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", orderNumber)
    .eq("tenant_id", tenant.id)
    .single();

  if (!order) notFound();

  return (
    <OrderConfirmationClient
      tenant={tenant as Tenant}
      order={order}
      storeSlug={slug}
    />
  );
}

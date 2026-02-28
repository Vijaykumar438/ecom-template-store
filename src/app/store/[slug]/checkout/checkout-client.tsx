"use client";

import { useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/store/checkout-form";
import { useCartStore } from "@/lib/store/cart";
import type { Tenant, CheckoutDetails } from "@/types/database";

interface CheckoutClientProps {
  tenant: Tenant;
  storeSlug: string;
}

export function CheckoutClient({ tenant, storeSlug }: CheckoutClientProps) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const handleSubmit = async (details: CheckoutDetails) => {
    const storeItems = items.filter((item) => item.tenantId === tenant.id);

    if (storeItems.length === 0) return;

    // Create order via API route
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: tenant.id,
        items: storeItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
        })),
        customerDetails: details,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to place order");
    }

    const { orderId, orderNumber } = await res.json();
    clearCart();
    router.push(
      `/store/${storeSlug}/order-confirmation/${orderNumber}`
    );
  };

  return (
    <CheckoutForm
      storeSlug={storeSlug}
      tenantId={tenant.id}
      onSubmit={handleSubmit}
    />
  );
}

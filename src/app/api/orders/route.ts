import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWhatsAppText, formatOrderForWhatsApp } from "@/lib/whatsapp/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, items, customerDetails } = body;

    if (!tenantId || !items?.length || !customerDetails) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const { name, whatsappNumber, address, notes } = customerDetails;

    if (!name || !whatsappNumber || !address) {
      return NextResponse.json(
        { message: "Name, WhatsApp number, and address are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get tenant info for WhatsApp notification
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();

    if (tenantError || !tenant) {
      return NextResponse.json(
        { message: "Store not found" },
        { status: 404 }
      );
    }

    // Calculate total
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        tenant_id: tenantId,
        customer_name: name,
        customer_whatsapp: whatsappNumber,
        delivery_address: address,
        notes: notes || null,
        total_amount: totalAmount,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { message: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_price: item.price,
      product_unit: item.unit,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
    }

    // ── WhatsApp Notifications (fire and forget) ──
    // Only send if WhatsApp credentials are configured
    const hasWhatsAppConfig =
      process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN;

    if (hasWhatsAppConfig) {
      const formatted = formatOrderForWhatsApp({
        orderNumber: order.order_number,
        storeName: tenant.store_name,
        customerName: name,
        customerWhatsapp: whatsappNumber,
        items: items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.unit,
        })),
        total: totalAmount,
        address,
      });

      // Notify vendor
      try {
        await sendWhatsAppText(tenant.whatsapp_number, formatted.vendorMessage);
      } catch (e) {
        console.error("Vendor WhatsApp notification failed:", e);
      }

      // Notify customer
      try {
        await sendWhatsAppText(whatsappNumber, formatted.customerMessage);
      } catch (e) {
        console.error("Customer WhatsApp notification failed:", e);
      }
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

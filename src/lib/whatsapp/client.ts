// WhatsApp Business Cloud API helpers
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface SendTemplateParams {
  to: string;
  templateName: string;
  languageCode?: string;
  components?: TemplateComponent[];
}

interface TemplateComponent {
  type: "body" | "header" | "button";
  parameters: { type: "text"; text: string }[];
}

export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode = "en",
  components = [],
}: SendTemplateParams) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.warn("WhatsApp credentials not configured. Skipping notification.");
    return { success: false, error: "WhatsApp not configured" };
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""),
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return { success: false, error };
  }
}

// Send plain text message (requires active conversation window)
export async function sendWhatsAppText(to: string, message: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.warn("WhatsApp credentials not configured. Skipping notification.");
    return { success: false, error: "WhatsApp not configured" };
  }

  try {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to.replace(/[^0-9]/g, ""),
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();
    return response.ok
      ? { success: true, data }
      : { success: false, error: data };
  } catch (error) {
    return { success: false, error };
  }
}

// Helper to format order for WhatsApp
export function formatOrderForWhatsApp(order: {
  orderNumber: string;
  storeName: string;
  customerName: string;
  customerWhatsapp: string;
  items: { name: string; quantity: number; unit: string; price: number }[];
  total: number;
  address: string;
}) {
  const itemsList = order.items
    .map((i) => `• ${i.name} x${i.quantity} ${i.unit} — ₹${i.price * i.quantity}`)
    .join("\n");

  const customerMessage = `✅ *Order Confirmed!*

Hi ${order.customerName}, your order *#${order.orderNumber}* at *${order.storeName}* has been placed!

📦 *Items:*
${itemsList}

💰 *Total: ₹${order.total}*
💵 *Payment: Cash on Delivery*

The vendor will contact you shortly on this number. Thank you for shopping! 🙏`;

  const vendorMessage = `🔔 *New Order #${order.orderNumber}!*

👤 *Customer:* ${order.customerName}
📱 *WhatsApp:* wa.me/${order.customerWhatsapp.replace(/[^0-9]/g, "")}

📦 *Items:*
${itemsList}

💰 *Total: ₹${order.total}*
📍 *Address:* ${order.address}

Tap the customer's WhatsApp link to confirm delivery.`;

  return { customerMessage, vendorMessage };
}

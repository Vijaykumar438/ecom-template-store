import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPreset } from "@/lib/presets/business-types";
import { getDemoProducts, getDemoExpiryDate } from "@/lib/presets/seed-products";
import type { BusinessType } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, businessType } = body;

    if (!tenantId || !businessType) {
      return NextResponse.json(
        { message: "tenantId and businessType are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const preset = getPreset(businessType as BusinessType);

    if (!preset) {
      return NextResponse.json(
        { message: "Invalid business type" },
        { status: 400 }
      );
    }

    // Create categories from preset
    const categoryInserts = preset.defaultCategories.map((cat, index) => ({
      name: cat.name,
      icon_name: cat.iconName,
      display_order: index,
      tenant_id: tenantId,
    }));

    const { data: categories, error: catError } = await supabase
      .from("categories")
      .insert(categoryInserts)
      .select();

    if (catError) {
      console.error("Category seed error:", catError);
      return NextResponse.json(
        { message: "Failed to seed categories" },
        { status: 500 }
      );
    }

    // Create demo products
    const demoProducts = getDemoProducts(businessType as BusinessType);
    const expiryDate = getDemoExpiryDate();

    if (demoProducts && categories) {
      const productInserts = demoProducts.map((product) => {
        // Match product to category by index
        const catId =
          categories[product.categoryIndex]?.id ||
          categories[0]?.id;

        return {
          name: product.name,
          description: product.description,
          price: product.price,
          unit: product.unit,
          images: [product.image],
          stock_quantity: 100,
          is_available: true,
          is_demo: true,
          demo_expires_at: expiryDate,
          category_id: catId,
          tenant_id: tenantId,
        };
      });

      const { error: prodError } = await supabase
        .from("products")
        .insert(productInserts);

      if (prodError) {
        console.error("Product seed error:", prodError);
      }
    }

    return NextResponse.json({
      message: "Demo data seeded successfully",
      categories: categories?.length || 0,
      products: demoProducts?.length || 0,
    });
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

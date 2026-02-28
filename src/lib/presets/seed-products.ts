import type { BusinessType } from "@/types/database";
import type { DemoProduct } from "./business-types";

// Demo products for each business type (3-4 per type)
// Images use placeholder Unsplash URLs — replace with bundled assets in production

const demoProductsByType: Record<BusinessType, DemoProduct[]> = {
  fruits: [
    {
      name: "Alphonso Mango",
      description:
        "Premium Ratnagiri Alphonso mangoes, naturally ripened. Sweet, aromatic, and perfect for desserts or eating fresh.",
      price: 350,
      unit: "dozen",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop",
    },
    {
      name: "Fresh Strawberries",
      description:
        "Farm-fresh Mahabaleshwar strawberries, handpicked and packed same day. Rich in Vitamin C.",
      price: 120,
      unit: "pack",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    },
    {
      name: "Banana Robusta",
      description:
        "Fresh green bananas from local farms. Rich in potassium and great for daily consumption.",
      price: 40,
      unit: "kg",
      categoryIndex: 2,
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    },
    {
      name: "Mixed Dry Fruits Premium Box",
      description:
        "Curated box with almonds, cashews, raisins, and pistachios. Perfect gift or daily snack.",
      price: 499,
      unit: "pack",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1606050451137-31da498e7f42?w=400&h=400&fit=crop",
    },
  ],

  nursery: [
    {
      name: "Money Plant (Golden Pothos)",
      description:
        "Easy to care for indoor plant that purifies air. Comes in a 6-inch plastic pot with healthy vines.",
      price: 149,
      unit: "piece",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1637967886160-fd78dc3ce3f5?w=400&h=400&fit=crop",
    },
    {
      name: "Jade Succulent",
      description:
        "Beautiful Crassula ovata succulent, symbol of prosperity. Low maintenance, perfect for desks.",
      price: 199,
      unit: "piece",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400&h=400&fit=crop",
    },
    {
      name: "Organic Vermicompost 5kg",
      description:
        "100% organic vermicompost enriched with micro-nutrients. Ideal for all types of plants.",
      price: 250,
      unit: "bag",
      categoryIndex: 4,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
    },
    {
      name: "Ceramic Pot Set (3 pcs)",
      description:
        "Elegant hand-painted ceramic pots in 3 sizes with drainage holes. Modern design.",
      price: 599,
      unit: "set",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
    },
  ],

  nonveg: [
    {
      name: "Chicken Breast Boneless",
      description:
        "Fresh, antibiotic-free boneless chicken breast. Cleaned and packed hygienically. Ideal for grilling.",
      price: 280,
      unit: "kg",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop",
    },
    {
      name: "Fresh Pomfret (Medium)",
      description:
        "Wild-caught silver pomfret, cleaned and ready to cook. 2-3 pieces per kg.",
      price: 450,
      unit: "kg",
      categoryIndex: 2,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
    },
    {
      name: "Farm Eggs (12 pcs)",
      description:
        "Country eggs from free-range hens. Rich in nutrition with deep yellow yolk.",
      price: 90,
      unit: "dozen",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
    },
    {
      name: "Tandoori Marinated Drumsticks",
      description:
        "Pre-marinated chicken drumsticks with tandoori spices. Just grill or bake — ready in 25 min.",
      price: 320,
      unit: "pack",
      categoryIndex: 4,
      image: "https://images.unsplash.com/photo-1532636875-6be04a8c2653?w=400&h=400&fit=crop",
    },
  ],

  electrical: [
    {
      name: "LED Bulb 9W (Cool White)",
      description:
        "Energy-efficient LED bulb with B22 base. 15,000 hours lifespan, ISI certified.",
      price: 85,
      unit: "piece",
      categoryIndex: 2,
      image: "https://images.unsplash.com/photo-1550985543-49bee3167284?w=400&h=400&fit=crop",
    },
    {
      name: "Modular Switch Board 8M",
      description:
        "Premium 8-module switch board with flame-retardant body. Elegant finish.",
      price: 450,
      unit: "piece",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    },
    {
      name: "Copper Wire 1.5mm (90m)",
      description:
        "PVC insulated 1.5 sq mm copper wire. Fire resistant, ISI marked, suitable for domestic wiring.",
      price: 1850,
      unit: "roll",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1586953208270-767889fa9b0e?w=400&h=400&fit=crop",
    },
    {
      name: "Digital Multimeter",
      description:
        "Professional-grade digital multimeter with auto-ranging. Measures AC/DC voltage, current & resistance.",
      price: 699,
      unit: "piece",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop",
    },
  ],

  vegetables: [
    {
      name: "Fresh Spinach (Palak)",
      description:
        "Farm-fresh organic spinach bundle. Washed and sorted. Rich in iron and vitamins.",
      price: 30,
      unit: "bundle",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    },
    {
      name: "Tomatoes",
      description:
        "Fresh, firm tomatoes sourced from local farms. Perfect for curries, salads, and chutneys.",
      price: 40,
      unit: "kg",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=400&h=400&fit=crop",
    },
    {
      name: "Toor Dal (Arhar) 1kg",
      description:
        "Premium quality unpolished toor dal. Cooks fast, rich in protein. Staple for Indian households.",
      price: 160,
      unit: "kg",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
    },
    {
      name: "Cold-Pressed Groundnut Oil",
      description:
        "Traditional cold-pressed (kachi ghani) groundnut oil. No preservatives. 1 litre pack.",
      price: 280,
      unit: "liter",
      categoryIndex: 4,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop",
    },
  ],

  bakery: [
    {
      name: "Chocolate Truffle Cake",
      description:
        "Rich, moist chocolate truffle cake with Belgian chocolate ganache. Available in 500g and 1kg.",
      price: 650,
      unit: "kg",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
    },
    {
      name: "Butter Cookies Tin (400g)",
      description:
        "Assorted Danish-style butter cookies in a premium tin. Made with real butter.",
      price: 350,
      unit: "box",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=400&fit=crop",
    },
    {
      name: "Kaju Katli (500g)",
      description:
        "Premium cashew fudge made with pure ghee. Handcrafted traditional Indian sweet.",
      price: 420,
      unit: "box",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1666190094755-bf0c86a5f2a4?w=400&h=400&fit=crop",
    },
    {
      name: "Whole Wheat Bread",
      description:
        "Freshly baked whole wheat bread, no preservatives. Soft and perfect for sandwiches.",
      price: 45,
      unit: "piece",
      categoryIndex: 2,
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    },
  ],

  fashion: [
    {
      name: "Cotton Kurta Set",
      description:
        "Handloom cotton kurta with matching palazzo. Breathable fabric, perfect for daily wear.",
      price: 899,
      unit: "piece",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=400&fit=crop",
    },
    {
      name: "Silk Dupatta",
      description:
        "Pure silk dupatta with traditional bandhani print. Vibrant colors, lightweight and elegant.",
      price: 499,
      unit: "piece",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop",
    },
    {
      name: "Men's Chino Pants",
      description:
        "Slim-fit cotton chinos in khaki. Comfortable stretch fabric, suitable for casual and semi-formal.",
      price: 1299,
      unit: "piece",
      categoryIndex: 0,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
    },
    {
      name: "Handcraft Jute Tote Bag",
      description:
        "Eco-friendly handcrafted jute bag with cotton lining. Stylish and sustainable.",
      price: 249,
      unit: "piece",
      categoryIndex: 3,
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=400&h=400&fit=crop",
    },
  ],

  pharmacy: [
    {
      name: "Multivitamin Tablets (60 tabs)",
      description:
        "Daily multivitamin with A, C, D, E, B-complex, Zinc & Iron. Supports overall immunity.",
      price: 350,
      unit: "bottle",
      categoryIndex: 1,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    },
    {
      name: "Digital Thermometer",
      description:
        "Fast-reading digital thermometer with beep alert. Accurate to ±0.1°C. Battery included.",
      price: 199,
      unit: "piece",
      categoryIndex: 4,
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop",
    },
    {
      name: "Aloe Vera Gel (200ml)",
      description:
        "Pure aloe vera gel for skin and hair. No parabens, no artificial colors. Soothing and hydrating.",
      price: 150,
      unit: "piece",
      categoryIndex: 2,
      image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=400&fit=crop",
    },
    {
      name: "Chyawanprash (500g)",
      description:
        "Authentic Ayurvedic chyawanprash with 40+ herbs. Boosts immunity and energy naturally.",
      price: 280,
      unit: "pack",
      categoryIndex: 5,
      image: "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?w=400&h=400&fit=crop",
    },
  ],
};

export function getDemoProducts(type: BusinessType): DemoProduct[] {
  return demoProductsByType[type] || [];
}

export function getDemoExpiryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

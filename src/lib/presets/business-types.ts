import type { BusinessType, ThemeConfig } from "@/types/database";

export interface BusinessPreset {
  type: BusinessType;
  label: string;
  emoji: string;
  iconName: string; // Lucide icon name
  description: string;
  colors: ThemeConfig;
  defaultCategories: CategoryPreset[];
  defaultUnits: string[];
  heroPlaceholder: string;
}

export interface CategoryPreset {
  name: string;
  iconName: string;
}

export interface DemoProduct {
  name: string;
  description: string;
  price: number;
  unit: string;
  categoryIndex: number; // index into defaultCategories
  image: string;
}

// ─── 8 Business Type Presets ─────────────────────────────────────

export const businessPresets: BusinessPreset[] = [
  // 1. Fruits Vendor
  {
    type: "fruits",
    label: "Fruits Vendor",
    emoji: "🍎",
    iconName: "Apple",
    description: "Fresh fruits, dry fruits, juices & seasonal specials",
    colors: {
      primary: "#16a34a",
      accent: "#f97316",
      background: "#f0fdf4",
      foreground: "#14532d",
    },
    defaultCategories: [
      { name: "Seasonal Fruits", iconName: "Sun" },
      { name: "Exotic Fruits", iconName: "Sparkles" },
      { name: "Daily Essentials", iconName: "ShoppingBasket" },
      { name: "Dry Fruits", iconName: "Nut" },
      { name: "Juices & Pulp", iconName: "GlassWater" },
    ],
    defaultUnits: ["kg", "dozen", "piece", "pack"],
    heroPlaceholder: "/presets/fruits/hero.jpg",
  },

  // 2. Nursery & Plants
  {
    type: "nursery",
    label: "Nursery & Plants",
    emoji: "🌱",
    iconName: "Sprout",
    description: "Indoor & outdoor plants, seeds, pots and gardening tools",
    colors: {
      primary: "#166534",
      accent: "#84cc16",
      background: "#f0fdf4",
      foreground: "#052e16",
    },
    defaultCategories: [
      { name: "Indoor Plants", iconName: "Home" },
      { name: "Outdoor Plants", iconName: "TreePine" },
      { name: "Seeds", iconName: "Leaf" },
      { name: "Pots & Planters", iconName: "FlowerPot" },
      { name: "Fertilizers & Soil", iconName: "Mountain" },
      { name: "Tools", iconName: "Wrench" },
    ],
    defaultUnits: ["piece", "bag", "set", "packet"],
    heroPlaceholder: "/presets/nursery/hero.jpg",
  },

  // 3. Non-Veg & Meat
  {
    type: "nonveg",
    label: "Non-Veg & Meat",
    emoji: "🍖",
    iconName: "Drumstick",
    description: "Fresh chicken, mutton, fish, eggs & marinated products",
    colors: {
      primary: "#dc2626",
      accent: "#1c1917",
      background: "#fef2f2",
      foreground: "#450a0a",
    },
    defaultCategories: [
      { name: "Chicken", iconName: "Bird" },
      { name: "Mutton", iconName: "Beef" },
      { name: "Fish & Seafood", iconName: "Fish" },
      { name: "Eggs", iconName: "Egg" },
      { name: "Marinated & Ready-to-Cook", iconName: "ChefHat" },
    ],
    defaultUnits: ["kg", "piece", "pack", "dozen"],
    heroPlaceholder: "/presets/nonveg/hero.jpg",
  },

  // 4. Electrical & Hardware
  {
    type: "electrical",
    label: "Electrical & Hardware",
    emoji: "⚡",
    iconName: "Zap",
    description: "Wiring, switches, lighting, tools & safety equipment",
    colors: {
      primary: "#2563eb",
      accent: "#f59e0b",
      background: "#eff6ff",
      foreground: "#1e3a5f",
    },
    defaultCategories: [
      { name: "Wiring & Cables", iconName: "Cable" },
      { name: "Switches & Sockets", iconName: "ToggleRight" },
      { name: "Lighting", iconName: "Lightbulb" },
      { name: "Tools", iconName: "Wrench" },
      { name: "Safety Equipment", iconName: "ShieldCheck" },
      { name: "MCBs & Panels", iconName: "LayoutGrid" },
    ],
    defaultUnits: ["piece", "meter", "box", "set", "roll"],
    heroPlaceholder: "/presets/electrical/hero.jpg",
  },

  // 5. Vegetables & Grocery
  {
    type: "vegetables",
    label: "Vegetables & Grocery",
    emoji: "🥬",
    iconName: "Salad",
    description: "Fresh vegetables, spices, pulses, grains & daily groceries",
    colors: {
      primary: "#15803d",
      accent: "#eab308",
      background: "#fefce8",
      foreground: "#1a2e05",
    },
    defaultCategories: [
      { name: "Leafy Greens", iconName: "Leaf" },
      { name: "Root Vegetables", iconName: "Carrot" },
      { name: "Spices & Masala", iconName: "Flame" },
      { name: "Pulses & Grains", iconName: "Wheat" },
      { name: "Oils & Ghee", iconName: "Droplets" },
      { name: "Snacks", iconName: "Cookie" },
    ],
    defaultUnits: ["kg", "gram", "liter", "pack", "bundle"],
    heroPlaceholder: "/presets/vegetables/hero.jpg",
  },

  // 6. Bakery & Sweets
  {
    type: "bakery",
    label: "Bakery & Sweets",
    emoji: "🍰",
    iconName: "Cake",
    description: "Cakes, cookies, bread, Indian sweets & custom orders",
    colors: {
      primary: "#e11d48",
      accent: "#fef3c7",
      background: "#fff1f2",
      foreground: "#4c0519",
    },
    defaultCategories: [
      { name: "Cakes", iconName: "Cake" },
      { name: "Cookies & Biscuits", iconName: "Cookie" },
      { name: "Bread & Buns", iconName: "Croissant" },
      { name: "Indian Sweets", iconName: "Candy" },
      { name: "Savory Snacks", iconName: "Popcorn" },
      { name: "Custom Orders", iconName: "Gift" },
    ],
    defaultUnits: ["piece", "kg", "box", "dozen", "pack"],
    heroPlaceholder: "/presets/bakery/hero.jpg",
  },

  // 7. Fashion & Clothing
  {
    type: "fashion",
    label: "Fashion & Clothing",
    emoji: "👗",
    iconName: "Shirt",
    description: "Men, women, kids clothing, accessories & ethnic wear",
    colors: {
      primary: "#7c3aed",
      accent: "#f472b6",
      background: "#faf5ff",
      foreground: "#2e1065",
    },
    defaultCategories: [
      { name: "Men", iconName: "User" },
      { name: "Women", iconName: "User" },
      { name: "Kids", iconName: "Baby" },
      { name: "Accessories", iconName: "Watch" },
      { name: "Footwear", iconName: "Footprints" },
      { name: "Ethnic Wear", iconName: "Sparkles" },
    ],
    defaultUnits: ["piece", "pair", "set"],
    heroPlaceholder: "/presets/fashion/hero.jpg",
  },

  // 8. Pharmacy & Wellness
  {
    type: "pharmacy",
    label: "Pharmacy & Wellness",
    emoji: "💊",
    iconName: "Pill",
    description: "Medicines, supplements, personal care & health devices",
    colors: {
      primary: "#0d9488",
      accent: "#f0fdf4",
      background: "#f0fdfa",
      foreground: "#042f2e",
    },
    defaultCategories: [
      { name: "Medicines", iconName: "Pill" },
      { name: "Vitamins & Supplements", iconName: "Tablets" },
      { name: "Personal Care", iconName: "Heart" },
      { name: "Baby Care", iconName: "Baby" },
      { name: "Health Devices", iconName: "Activity" },
      { name: "Ayurvedic", iconName: "Leaf" },
    ],
    defaultUnits: ["piece", "strip", "bottle", "pack", "tube"],
    heroPlaceholder: "/presets/pharmacy/hero.jpg",
  },
];

export function getPreset(type: BusinessType): BusinessPreset {
  return businessPresets.find((p) => p.type === type) || businessPresets[0];
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalCartItem, CheckoutDetails } from "@/types/database";

interface CartState {
  items: LocalCartItem[];
  savedDetails: CheckoutDetails | null;

  // Actions
  addItem: (item: LocalCartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  getItemsByTenant: (tenantId: string) => LocalCartItem[];

  // Saved checkout details
  saveCheckoutDetails: (details: CheckoutDetails) => void;
  clearSavedDetails: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedDetails: null,

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === newItem.productId &&
              i.tenantId === newItem.tenantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === newItem.productId &&
                i.tenantId === newItem.tenantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getItemsByTenant: (tenantId) =>
        get().items.filter((i) => i.tenantId === tenantId),

      saveCheckoutDetails: (details) => {
        set({ savedDetails: details });
      },

      clearSavedDetails: () => set({ savedDetails: null }),
    }),
    {
      name: "ecom-cart-storage",
      partialize: (state) => ({
        items: state.items,
        savedDetails: state.savedDetails,
      }),
    }
  )
);

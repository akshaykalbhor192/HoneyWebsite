"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = { slug: string; name: string; size: string; price: number; color: string; qty: number };

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.slug === item.slug && i.size === item.size);
          const items = existing
            ? s.items.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i))
            : [...s.items, { ...item, qty }];
          return { items, open: true };
        }),
      setQty: (slug, size, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.slug === slug && i.size === size ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (slug, size) => set((s) => ({ items: s.items.filter((i) => !(i.slug === slug && i.size === size)) })),
      clear: () => set({ items: [] }),
    }),
    { name: "amritasya-cart", partialize: (s) => ({ items: s.items }) }
  )
);

export const cartTotals = (items: CartItem[], shippingFee: number, freeAbove: number) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= freeAbove ? 0 : shippingFee;
  return { subtotal, shipping, total: subtotal + shipping, count: items.reduce((n, i) => n + i.qty, 0) };
};

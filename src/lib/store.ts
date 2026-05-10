import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const id = `${item.productId}-${item.size}-${item.color}`;
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: Math.min(10, i.qty + item.qty) } : i)) });
        } else {
          set({ items: [...get().items, { ...item, id }] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      setQty: (id, qty) => set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.qty, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
    }),
    { name: "veldra-cart" },
  ),
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({ ids: get().ids.includes(id) ? get().ids.filter((x) => x !== id) : [...get().ids, id] }),
      has: (id) => get().ids.includes(id),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: "veldra-wishlist" },
  ),
);

type ThemeState = { theme: "light" | "dark"; toggle: () => void; init: () => void };
export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggle: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next === "dark");
        }
      },
      init: () => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", get().theme === "dark");
        }
      },
    }),
    { name: "veldra-theme" },
  ),
);

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
export type Order = {
  id: string;
  createdAt: number;
  customer: { name: string; phone: string; email?: string; address?: string };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  mine?: boolean;
};

type OrdersState = {
  orders: Order[];
  add: (o: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Order>) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (o) => {
        const order: Order = {
          ...o,
          id: "VLD-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          createdAt: Date.now(),
          status: o.status ?? "Pending",
        };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      setStatus: (id, status) => set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
      remove: (id) => set({ orders: get().orders.filter((o) => o.id !== id) }),
      update: (id, patch) => set({ orders: get().orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }),
    }),
    { name: "veldra-orders" },
  ),
);

type AdminState = { isAdmin: boolean; login: (pw: string) => boolean; logout: () => void };
export const useAdmin = create<AdminState>()(
  persist(
    (set) => ({
      isAdmin: false,
      login: (pw) => {
        const ok = pw === "veldra-admin";
        if (ok) set({ isAdmin: true });
        return ok;
      },
      logout: () => set({ isAdmin: false }),
    }),
    { name: "veldra-admin" },
  ),
);

type ToastItem = { id: number; type: "success" | "error" | "info"; message: string };
type ToastState = { toasts: ToastItem[]; push: (t: Omit<ToastItem, "id">) => void; dismiss: (id: number) => void };
export const useToasts = create<ToastState>((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = Date.now() + Math.random();
    set({ toasts: [...get().toasts, { ...t, id }] });
    setTimeout(() => set({ toasts: get().toasts.filter((x) => x.id !== id) }), 3000);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

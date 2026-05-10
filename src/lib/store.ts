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
  seeded: boolean;
  add: (o: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => Order;
  setStatus: (id: string, status: OrderStatus) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Order>) => void;
  seedDemo: () => void;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`;

const DEMO_ORDERS: Order[] = [
  {
    id: "VLD-AX9K2P", createdAt: Date.now() - 1000 * 60 * 60 * 6, status: "Pending", mine: true,
    customer: { name: "Aarav Mehta", phone: "+91 98765 43210", email: "aarav.mehta@gmail.com", address: "B-204, Lotus Residency, Koramangala 5th Block, Bengaluru 560095" },
    items: [
      { id: "1-M-White", productId: "1", slug: "veldra-classic-white-tee", name: "VELDRA Classic White Tee", image: img("1598033129183-c4f50c736f10"), price: 1299, size: "M", color: "White", qty: 2 },
      { id: "8-L-Navy", productId: "8", slug: "navy-organic-tee", name: "Navy Organic Tee", image: img("1521572163474-6864f9cf17ab"), price: 1399, size: "L", color: "Navy", qty: 1 },
    ],
    subtotal: 3997, shipping: 0, discount: 0, total: 3997, notes: "Please deliver after 6pm.",
  },
  {
    id: "VLD-7HQ4MR", createdAt: Date.now() - 1000 * 60 * 60 * 48, status: "Shipped", mine: true,
    customer: { name: "Aarav Mehta", phone: "+91 98765 43210", email: "aarav.mehta@gmail.com", address: "B-204, Lotus Residency, Koramangala 5th Block, Bengaluru 560095" },
    items: [
      { id: "3-32-Indigo", productId: "3", slug: "slim-fit-dark-wash-jeans", name: "Slim Fit Dark Wash Jeans", image: img("1542272604-787c3835535d"), price: 3499, size: "32", color: "Indigo", qty: 1 },
      { id: "10-M-Stone", productId: "10", slug: "stone-oxford-shirt", name: "Stone Oxford Shirt", image: img("1602810316693-3667c854239a"), price: 2599, size: "M", color: "Stone", qty: 1 },
    ],
    subtotal: 6098, shipping: 0, discount: 610, total: 5488,
  },
  {
    id: "VLD-3PL8WC", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9, status: "Delivered", mine: true,
    customer: { name: "Aarav Mehta", phone: "+91 98765 43210", email: "aarav.mehta@gmail.com", address: "B-204, Lotus Residency, Koramangala 5th Block, Bengaluru 560095" },
    items: [
      { id: "5-32-Charcoal", productId: "5", slug: "charcoal-twill-trousers", name: "Charcoal Twill Trousers", image: img("1519085360753-af0119f7cbe7"), price: 4299, size: "32", color: "Charcoal", qty: 1 },
    ],
    subtotal: 4299, shipping: 0, discount: 0, total: 4299,
  },
  {
    id: "VLD-K2N6FJ", createdAt: Date.now() - 1000 * 60 * 60 * 4, status: "Pending",
    customer: { name: "Rohan Kapoor", phone: "+91 99876 54321", email: "rohan.k@outlook.com", address: "12 Hill Road, Bandra West, Mumbai 400050" },
    items: [
      { id: "6-L-Ivory", productId: "6", slug: "ivory-linen-overshirt", name: "Ivory Linen Overshirt", image: img("1609505848912-b7c3b9c99049"), price: 3199, size: "L", color: "Ivory", qty: 1 },
      { id: "12-L-Sage", productId: "12", slug: "sage-relaxed-tee", name: "Sage Relaxed Tee", image: img("1576566588028-4147f3842f27"), price: 1199, size: "L", color: "Sage", qty: 2 },
    ],
    subtotal: 5597, shipping: 0, discount: 0, total: 5597,
  },
  {
    id: "VLD-9TXM4V", createdAt: Date.now() - 1000 * 60 * 60 * 18, status: "Confirmed",
    customer: { name: "Ishaan Verma", phone: "+91 91234 56789", email: "ishaan.v@yahoo.com", address: "House 47, Sector 21, Gurugram 122016" },
    items: [
      { id: "9-34-Camel", productId: "9", slug: "camel-chino-trousers", name: "Camel Chino Trousers", image: img("1617127365659-c47fa864d8bc"), price: 3999, size: "34", color: "Camel", qty: 1 },
      { id: "2-M-Indigo", productId: "2", slug: "indigo-washed-linen-shirt", name: "Indigo Washed Linen Shirt", image: img("1602810316693-3667c854239a"), price: 2199, size: "M", color: "Indigo", qty: 1 },
    ],
    subtotal: 6198, shipping: 0, discount: 0, total: 6198,
  },
  {
    id: "VLD-Q5BD7H", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3, status: "Shipped",
    customer: { name: "Vikram Singh", phone: "+91 90909 80808", email: "vikram.singh@protonmail.com", address: "401 Heritage Towers, Civil Lines, Jaipur 302006" },
    items: [
      { id: "7-30-Indigo", productId: "7", slug: "vintage-straight-jeans", name: "Vintage Straight Jeans", image: img("1582552938357-32b906df40cb"), price: 3799, size: "30", color: "Indigo", qty: 1 },
    ],
    subtotal: 3799, shipping: 149, discount: 0, total: 3948,
  },
  {
    id: "VLD-YR8KZN", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14, status: "Delivered",
    customer: { name: "Kabir Nair", phone: "+91 98123 45670", email: "kabir.nair@gmail.com", address: "27/A Marine Drive, Fort Kochi 682001" },
    items: [
      { id: "4-M-Ecru", productId: "4", slug: "ecru-essential-polo", name: "Ecru Essential Polo", image: img("1594938298603-c8148c4b7b15"), price: 1899, size: "M", color: "Ecru", qty: 2 },
      { id: "11-32-Black", productId: "11", slug: "black-slim-jeans", name: "Black Slim Jeans", image: img("1604176354204-9268737828e4"), price: 3299, size: "32", color: "Black", qty: 1 },
    ],
    subtotal: 7097, shipping: 0, discount: 710, total: 6387,
  },
  {
    id: "VLD-MW3CPL", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5, status: "Cancelled",
    customer: { name: "Devansh Rao", phone: "+91 97000 11122", email: "devansh.rao@gmail.com", address: "Flat 8C, Salt Lake Sector V, Kolkata 700091" },
    items: [
      { id: "1-S-Ecru", productId: "1", slug: "veldra-classic-white-tee", name: "VELDRA Classic White Tee", image: img("1598033129183-c4f50c736f10"), price: 1299, size: "S", color: "Ecru", qty: 1 },
    ],
    subtotal: 1299, shipping: 149, discount: 0, total: 1448, notes: "Customer requested cancellation.",
  },
];

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      seeded: false,
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
      seedDemo: () => {
        if (get().seeded) return;
        const existingIds = new Set(get().orders.map((o) => o.id));
        const fresh = DEMO_ORDERS.filter((o) => !existingIds.has(o.id));
        set({ orders: [...get().orders, ...fresh], seeded: true });
      },
    }),
    { name: "veldra-orders" },
  ),
);

export type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  avatar?: string;
};

type ProfileState = {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        name: "Aarav Mehta",
        email: "aarav.mehta@gmail.com",
        phone: "+91 98765 43210",
        address: "B-204, Lotus Residency, Koramangala 5th Block",
        city: "Bengaluru",
        pincode: "560095",
      },
      update: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
    }),
    { name: "veldra-profile" },
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

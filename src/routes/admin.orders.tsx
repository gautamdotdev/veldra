import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Trash2, Search, LogOut, Package, Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAdmin, useOrders, useToasts, type OrderStatus } from "@/lib/store";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin · Orders — VELDRA" }] }),
  component: AdminOrdersPage,
});

const STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Shipped: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

function AdminOrdersPage() {
  const { isAdmin, login, logout } = useAdmin();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const push = useToasts((s) => s.push);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-32">
        <div className="bg-surface border border-border rounded-2xl p-10 text-center">
          <Lock size={36} className="mx-auto opacity-40" strokeWidth={1.5} />
          <h1 className="font-serif text-3xl mt-5">Admin Access</h1>
          <p className="text-xs text-muted-foreground mt-2">Enter the admin password to manage orders.</p>
          <p className="text-[10px] text-muted-foreground mt-1 opacity-60">Demo password: <code className="bg-muted px-1.5 py-0.5 rounded">veldra-admin</code></p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (login(pw)) { push({ type: "success", message: "Welcome back, admin" }); setErr(""); }
              else setErr("Incorrect password");
            }}
            className="mt-8 space-y-3"
          >
            <input
              type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-gold"
            />
            {err && <p className="text-xs text-destructive">{err}</p>}
            <button className="w-full bg-foreground text-background py-3 rounded-xl text-xs label-caps font-bold hover:bg-gold transition">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={logout} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const orders = useOrders((s) => s.orders);
  const setStatus = useOrders((s) => s.setStatus);
  const remove = useOrders((s) => s.remove);
  const push = useToasts((s) => s.push);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<OrderStatus | "All">("All");

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (!q) return true;
      const t = q.toLowerCase();
      return o.id.toLowerCase().includes(t) || o.customer.name.toLowerCase().includes(t) || o.items.some((i) => i.name.toLowerCase().includes(t));
    });
  }, [orders, q, filter]);

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
    const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.status === s).length }), {} as Record<OrderStatus, number>);
    return { revenue, counts, total: orders.length };
  }, [orders]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-12 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-caps text-[10px] text-gold">Admin Dashboard</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">Orders</h1>
        </div>
        <button onClick={onLogout} className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-xs label-caps hover:bg-muted transition">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        <Stat label="Total Orders" value={stats.total.toString()} />
        <Stat label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} accent />
        <Stat label="Pending" value={stats.counts.Pending.toString()} />
        <Stat label="Delivered" value={stats.counts.Delivered.toString()} />
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order ID, customer, or product…" className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-gold" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["All", ...STATUSES] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s as OrderStatus | "All")}
              className={`px-4 py-2 rounded-full text-[11px] label-caps font-bold whitespace-nowrap border transition ${filter === s ? "bg-foreground text-background border-foreground" : "bg-surface border-border hover:bg-muted"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-surface border border-border rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package size={40} className="mx-auto opacity-30 mb-3" strokeWidth={1} />
            <p className="text-sm">No orders match your filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-[10px] label-caps text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-4 font-bold">Order</th>
                  <th className="text-left px-5 py-4 font-bold">Customer</th>
                  <th className="text-left px-5 py-4 font-bold hidden md:table-cell">Items</th>
                  <th className="text-right px-5 py-4 font-bold">Total</th>
                  <th className="text-left px-5 py-4 font-bold">Status</th>
                  <th className="text-right px-5 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-bold">{o.id}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{o.customer.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{o.customer.phone}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 4).map((i) => (
                          <div key={i.id} className="w-9 h-11 rounded-md overflow-hidden bg-muted border-2 border-surface" title={`${i.name} (${i.qty})`}>
                            <img src={i.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {o.items.length > 4 && <span className="text-[10px] text-muted-foreground self-end ml-2">+{o.items.length - 4}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-gold">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => { setStatus(o.id, e.target.value as OrderStatus); push({ type: "success", message: `${o.id} → ${e.target.value}` }); }}
                        className={`text-[10px] label-caps font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer ${STATUS_STYLES[o.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s} className="bg-background text-foreground">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => { if (confirm(`Delete order ${o.id}?`)) { remove(o.id); push({ type: "success", message: "Order deleted" }); } }} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-[10px] label-caps text-muted-foreground">{label}</p>
      <p className={`font-serif text-2xl mt-2 ${accent ? "text-gold" : ""}`}>{value}</p>
    </div>
  );
}

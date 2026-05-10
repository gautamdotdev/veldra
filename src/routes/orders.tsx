import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, MessageCircle, Trash2, ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrders, useToasts, type OrderStatus } from "@/lib/store";
import { whatsappCartUrl } from "@/lib/products";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — VELDRA" }, { name: "description", content: "Track your VELDRA orders." }] }),
  component: MyOrdersPage,
});

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Shipped: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

function MyOrdersPage() {
  const orders = useOrders((s) => s.orders.filter((o) => o.mine));
  const remove = useOrders((s) => s.remove);
  const setStatus = useOrders((s) => s.setStatus);
  const push = useToasts((s) => s.push);
  const [openId, setOpenId] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Package size={56} className="mx-auto opacity-30" strokeWidth={1} />
        <h1 className="font-serif text-3xl mt-6">No orders yet</h1>
        <p className="text-muted-foreground mt-2 text-sm">Your orders will appear here once you check out.</p>
        <Link to="/" className="inline-block mt-8 bg-foreground text-background px-8 py-3 rounded-md text-sm label-caps">Start Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-16 pb-24">
      <div className="flex items-baseline gap-4">
        <h1 className="font-serif text-4xl sm:text-5xl">My Orders</h1>
        <span className="text-muted-foreground text-sm opacity-60">({orders.length})</span>
      </div>

      <div className="mt-12 space-y-4">
        {orders.map((o) => {
          const open = openId === o.id;
          return (
            <div key={o.id} className="bg-surface border border-border rounded-2xl overflow-hidden transition-all">
              <button onClick={() => setOpenId(open ? null : o.id)} className="w-full p-5 sm:p-6 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors">
                <div className="flex -space-x-3 shrink-0">
                  {o.items.slice(0, 3).map((i) => (
                    <div key={i.id} className="w-12 h-14 rounded-md border-2 border-surface overflow-hidden bg-muted">
                      <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[11px] label-caps text-muted-foreground">{o.id}</p>
                  <p className="font-serif text-base sm:text-lg truncate mt-0.5">{o.items.length} item{o.items.length > 1 ? "s" : ""} · ₹{o.total.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                </div>
                <span className={`hidden sm:inline-block text-[10px] label-caps font-bold px-3 py-1.5 rounded-full border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-border p-5 sm:p-6 bg-background/50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="sm:hidden mb-4">
                    <span className={`inline-block text-[10px] label-caps font-bold px-3 py-1.5 rounded-full border ${STATUS_STYLES[o.status]}`}>{o.status}</span>
                  </div>
                  <div className="space-y-3">
                    {o.items.map((i) => (
                      <Link key={i.id} to="/product/$slug" params={{ slug: i.slug }} className="flex gap-4 group">
                        <div className="w-16 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                          <img src={i.image} alt={i.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-sm group-hover:text-gold transition-colors">{i.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">Size {i.size} · {i.color} · Qty {i.qty}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">₹{(i.price * i.qty).toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs border-t border-border pt-5">
                    <div><p className="text-muted-foreground">Subtotal</p><p className="font-medium mt-1">₹{o.subtotal.toLocaleString("en-IN")}</p></div>
                    <div><p className="text-muted-foreground">Shipping</p><p className="font-medium mt-1">{o.shipping === 0 ? "Free" : `₹${o.shipping}`}</p></div>
                    <div><p className="text-muted-foreground">Total</p><p className="font-bold text-gold mt-1">₹{o.total.toLocaleString("en-IN")}</p></div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <a href={whatsappCartUrl(o.items, o.total)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-whatsapp text-white px-4 py-2.5 rounded-lg text-[11px] label-caps font-bold hover:opacity-90 transition">
                      <MessageCircle size={14} /> Contact on WhatsApp
                    </a>
                    {o.status !== "Cancelled" && o.status !== "Delivered" && (
                      <button onClick={() => { setStatus(o.id, "Cancelled"); push({ type: "info", message: "Order cancellation requested" }); }} className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-lg text-[11px] label-caps font-bold hover:bg-muted transition">
                        Cancel Order
                      </button>
                    )}
                    <button onClick={() => { remove(o.id); push({ type: "success", message: "Order removed" }); }} className="inline-flex items-center gap-2 border border-border px-4 py-2.5 rounded-lg text-[11px] label-caps font-bold hover:text-destructive hover:border-destructive/40 transition ml-auto">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

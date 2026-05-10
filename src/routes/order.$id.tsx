import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, MessageCircle, Trash2, Package, MapPin, Phone, Mail, CheckCircle2, Truck, Clock, XCircle, ShoppingBag } from "lucide-react";
import { useOrders, useToasts, type OrderStatus, useAdmin } from "@/lib/store";
import { whatsappCartUrl } from "@/lib/products";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({ meta: [{ title: `Order ${params.id} — VELDRA` }] }),
  component: OrderDetailPage,
});

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Shipped: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  Delivered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Cancelled: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

const TIMELINE: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: "Pending", label: "Order Placed", icon: Clock },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Package },
];

function OrderDetailPage() {
  const { id } = Route.useParams();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));
  const remove = useOrders((s) => s.remove);
  const setStatus = useOrders((s) => s.setStatus);
  const isAdmin = useAdmin((s) => s.isAdmin);
  const push = useToasts((s) => s.push);
  const navigate = useNavigate();

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Package size={56} className="mx-auto opacity-30" strokeWidth={1} />
        <h1 className="font-serif text-3xl mt-6">Order not found</h1>
        <p className="text-muted-foreground text-sm mt-2">We couldn't locate order {id}.</p>
        <Link to="/orders" className="inline-block mt-8 bg-foreground text-background px-8 py-3 rounded-md text-sm label-caps">View My Orders</Link>
      </div>
    );
  }

  const cancelled = order.status === "Cancelled";
  const activeIdx = cancelled ? -1 : TIMELINE.findIndex((t) => t.key === order.status);

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-12 pb-24">
      <Link to={isAdmin ? "/admin/orders" : "/orders"} className="inline-flex items-center gap-2 text-xs label-caps text-muted-foreground hover:text-foreground transition mb-8">
        <ArrowLeft size={14} /> Back to {isAdmin ? "Admin Orders" : "My Orders"}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] label-caps text-gold">{order.id}</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-2">Order Details</h1>
          <p className="text-muted-foreground text-sm mt-2">Placed {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</p>
        </div>
        <span className={`text-[11px] label-caps font-bold px-4 py-2 rounded-full border ${STATUS_STYLES[order.status]}`}>{order.status}</span>
      </div>

      {/* Timeline */}
      {!cancelled && (
        <div className="mt-10 bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <p className="text-[10px] label-caps text-muted-foreground mb-6">Progress</p>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-border -z-0" />
            <div className="absolute left-0 top-5 h-px bg-gold -z-0 transition-all duration-700" style={{ width: `${activeIdx >= 0 ? (activeIdx / (TIMELINE.length - 1)) * 100 : 0}%` }} />
            {TIMELINE.map((t, idx) => {
              const done = idx <= activeIdx;
              const Icon = t.icon;
              return (
                <div key={t.key} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done ? "bg-gold border-gold text-white" : "bg-background border-border text-muted-foreground"}`}>
                    <Icon size={16} />
                  </div>
                  <p className={`text-[10px] label-caps text-center ${done ? "text-foreground font-bold" : "text-muted-foreground"}`}>{t.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {cancelled && (
        <div className="mt-10 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 flex items-center gap-4">
          <XCircle className="text-rose-500" size={24} />
          <div>
            <p className="font-serif text-lg">Order cancelled</p>
            <p className="text-xs text-muted-foreground mt-0.5">{order.notes ?? "This order has been cancelled."}</p>
          </div>
        </div>
      )}

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Items */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">Items <span className="text-muted-foreground text-sm font-normal">({order.items.length})</span></h2>
          </div>
          <div className="space-y-5">
            {order.items.map((i) => (
              <Link key={i.id} to="/product/$slug" params={{ slug: i.slug }} className="flex gap-4 group p-3 -mx-3 rounded-xl hover:bg-muted/40 transition-colors">
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base group-hover:text-gold transition-colors truncate">{i.name}</p>
                  <p className="text-[11px] label-caps text-muted-foreground mt-1">Size {i.size} · {i.color}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Qty {i.qty} × ₹{i.price.toLocaleString("en-IN")}</p>
                </div>
                <p className="font-serif font-bold text-gold whitespace-nowrap">₹{(i.price * i.qty).toLocaleString("en-IN")}</p>
              </Link>
            ))}
          </div>

          {/* Customer */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-serif text-lg mb-4">Shipping To</h3>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              {order.customer.address && <p className="flex gap-2 text-muted-foreground"><MapPin size={14} className="mt-0.5 shrink-0" /> {order.customer.address}</p>}
              <p className="flex gap-2 text-muted-foreground"><Phone size={14} className="mt-0.5 shrink-0" /> {order.customer.phone}</p>
              {order.customer.email && <p className="flex gap-2 text-muted-foreground"><Mail size={14} className="mt-0.5 shrink-0" /> {order.customer.email}</p>}
            </div>
            {order.notes && (
              <div className="mt-5 bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground italic">"{order.notes}"</div>
            )}
          </div>
        </div>

        {/* Summary + actions */}
        <aside className="bg-surface border border-border rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl mb-5">Summary</h2>
          <div className="space-y-3 text-sm border-t border-border pt-5">
            <Row label="Subtotal" value={`₹${order.subtotal.toLocaleString("en-IN")}`} />
            {order.discount > 0 && <Row label="Discount" value={`−₹${order.discount.toLocaleString("en-IN")}`} accent />}
            <Row label="Shipping" value={order.shipping === 0 ? "Free" : `₹${order.shipping}`} />
            <div className="border-t border-border pt-4 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-lg text-gold">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <a href={whatsappCartUrl(order.items, order.total)} target="_blank" rel="noreferrer" className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-whatsapp text-white py-3.5 rounded-xl text-[11px] label-caps font-bold hover:opacity-90 transition">
            <MessageCircle size={16} /> Contact on WhatsApp
          </a>

          {isAdmin && (
            <div className="mt-5 pt-5 border-t border-border">
              <p className="text-[10px] label-caps text-muted-foreground mb-2">Admin · Update Status</p>
              <select
                value={order.status}
                onChange={(e) => { setStatus(order.id, e.target.value as OrderStatus); push({ type: "success", message: `Status → ${e.target.value}` }); }}
                className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold cursor-pointer"
              >
                {(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"] as OrderStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {!isAdmin && order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button onClick={() => { setStatus(order.id, "Cancelled"); push({ type: "info", message: "Cancellation requested" }); }} className="mt-3 w-full border border-border py-3 rounded-xl text-[11px] label-caps font-bold hover:bg-muted transition">
              Cancel Order
            </button>
          )}

          <button onClick={() => { if (confirm(`Delete order ${order.id}?`)) { remove(order.id); push({ type: "success", message: "Order deleted" }); navigate({ to: isAdmin ? "/admin/orders" : "/orders" }); } }} className="mt-3 w-full inline-flex items-center justify-center gap-2 text-muted-foreground py-2.5 rounded-xl text-[11px] label-caps hover:text-destructive transition">
            <Trash2 size={14} /> Delete Order
          </button>

          <Link to="/" className="mt-5 w-full inline-flex items-center justify-center gap-2 text-[11px] label-caps text-muted-foreground hover:text-foreground transition">
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className={accent ? "text-gold" : ""}>{value}</span></div>;
}

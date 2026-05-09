import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart, useToasts } from "@/lib/store";
import { whatsappCartUrl } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — VELDRA" }, { name: "description", content: "Your VELDRA cart." }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const push = useToasts((s) => s.push);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 2999 ? 0 : 149;
  const discAmt = Math.round(subtotal * discount);
  const total = subtotal - discAmt + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "VELDRA10") {
      setDiscount(0.1); push({ type: "success", message: "Coupon applied — 10% off" });
    } else { push({ type: "error", message: "Invalid coupon code" }); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <ShoppingBag size={56} className="mx-auto opacity-30" strokeWidth={1} />
        <h1 className="font-serif text-3xl mt-6">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2 text-sm">Time to find something considered.</p>
        <Link to="/" className="inline-block mt-8 bg-foreground text-background px-8 py-3 rounded-md text-sm label-caps">Start Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10 pb-20">
      <h1 className="font-serif text-4xl">Your Cart</h1>
      <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 p-4 border border-border rounded-lg">
              <Link to="/product/$slug" params={{ slug: i.slug }} className="w-24 h-32 rounded-md overflow-hidden bg-muted shrink-0">
                <img src={i.image} alt={i.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-3">
                  <Link to="/product/$slug" params={{ slug: i.slug }} className="font-serif text-lg hover:text-gold transition-colors">{i.name}</Link>
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Size: {i.size} · Color: {i.color}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center border border-border rounded-md">
                    <button onClick={() => setQty(i.id, i.qty - 1)} className="px-2 py-1.5"><Minus size={12} /></button>
                    <span className="px-3 text-sm">{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} className="px-2 py-1.5"><Plus size={12} /></button>
                  </div>
                  <p className="font-medium">₹{(i.price * i.qty).toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          ))}
          <Link to="/" className="inline-block label-caps text-muted-foreground hover:text-foreground">← Continue Shopping</Link>
        </div>

        <aside className="bg-surface border border-border rounded-lg p-6 h-fit lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl mb-5">Order Summary</h2>
          <div className="flex gap-2 mb-5">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 bg-transparent border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-foreground" />
            <button onClick={applyCoupon} className="bg-foreground text-background px-4 rounded-md text-sm">Apply</button>
          </div>
          <div className="space-y-2 text-sm border-t border-border pt-4">
            <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
            {discount > 0 && <Row label="Discount" value={`−₹${discAmt.toLocaleString("en-IN")}`} accent />}
            <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} />
            <div className="border-t border-border pt-3 mt-3 flex justify-between text-base font-medium"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
          </div>
          <a
            href={whatsappCartUrl(items, total)}
            target="_blank" rel="noreferrer"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-whatsapp text-white py-3.5 rounded-md text-sm label-caps hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} /> Checkout on WhatsApp
          </a>
          <p className="text-xs text-muted-foreground mt-3 text-center">No payment online. Confirm your order with our team.</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className={accent ? "text-gold" : ""}>{value}</span></div>;
}

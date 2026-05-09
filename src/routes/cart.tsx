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
    <div className="min-h-[calc(100vh-64px)] bg-background/50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-16 pb-24">
        <div className="flex items-baseline gap-4">
          <h1 className="font-serif text-4xl sm:text-5xl">Your Cart</h1>
          <span className="text-muted-foreground text-sm font-medium opacity-60">({items.length} items)</span>
        </div>
        
        <div className="mt-12 grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.id} className="group flex flex-col sm:flex-row gap-6 p-5 bg-surface border border-border rounded-2xl transition-all duration-500 hover:shadow-lg hover:border-border-strong relative animate-in fade-in slide-in-from-bottom-4">
                <Link to="/product/$slug" params={{ slug: i.slug }} className="w-full sm:w-32 aspect-[3/4] sm:h-44 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                  <img src={i.image} alt={i.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to="/product/$slug" params={{ slug: i.slug }} className="font-serif text-xl sm:text-2xl hover:text-gold transition-colors duration-300">
                        {i.name}
                      </Link>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] label-caps tracking-widest text-muted-foreground">
                        <span>Size: <span className="text-foreground">{i.size}</span></span>
                        <span>Color: <span className="text-foreground">{i.color}</span></span>
                      </div>
                    </div>
                    <button 
                      onClick={() => remove(i.id)} 
                      className="p-2 -mt-2 -mr-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-300"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] label-caps text-muted-foreground font-bold">Quantity</p>
                      <div className="inline-flex items-center bg-muted/50 rounded-full p-1 border border-border/50">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-full transition-colors active:scale-90"><Minus size={14} /></button>
                        <span className="w-10 text-center text-sm font-medium">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-full transition-colors active:scale-90"><Plus size={14} /></button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="font-serif text-xl font-bold text-gold">₹{(i.price * i.qty).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-6">
              <Link to="/" className="group inline-flex items-center gap-2 label-caps text-xs text-muted-foreground hover:text-foreground transition-all duration-300">
                <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> Continue Shopping
              </Link>
            </div>
          </div>

          <aside className="bg-surface border border-border rounded-2xl p-8 h-fit lg:sticky lg:top-28 shadow-sm">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>
            <div className="flex gap-2 mb-6">
              <input 
                value={coupon} 
                onChange={(e) => setCoupon(e.target.value)} 
                placeholder="Coupon code" 
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-gold transition-all" 
              />
              <button onClick={applyCoupon} className="bg-foreground text-background px-6 rounded-xl text-xs label-caps font-bold hover:bg-gold transition-colors">Apply</button>
            </div>
            <div className="space-y-4 text-sm border-t border-border pt-6">
              <Row label="Subtotal" value={`₹${subtotal.toLocaleString("en-IN")}`} />
              {discount > 0 && <Row label="Discount" value={`−₹${discAmt.toLocaleString("en-IN")}`} accent />}
              <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} />
              <div className="border-t border-border pt-5 mt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-xl">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
            <a
              href={whatsappCartUrl(items, total)}
              target="_blank" rel="noreferrer"
              className="mt-8 w-full flex items-center justify-center gap-3 bg-whatsapp text-white py-4 rounded-xl text-xs label-caps font-bold hover:opacity-90 transition-all shadow-lg shadow-whatsapp/20 active:scale-[0.98]"
            >
              <MessageCircle size={18} /> Checkout on WhatsApp
            </a>
            <p className="text-[10px] text-muted-foreground mt-5 text-center leading-relaxed opacity-60">
              Secure your pieces. Our team will confirm availability and delivery details via WhatsApp.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className={accent ? "text-gold" : ""}>{value}</span></div>;
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Star, Truck, RotateCcw, ShieldCheck, ChevronDown, MessageCircle, X } from "lucide-react";
import { findProduct, products, whatsappProductUrl } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart, useToasts } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = findProduct(params.slug);
    return {
      meta: [
        { title: p ? `${p.name} — VELDRA` : "Product — VELDRA" },
        { name: "description", content: p?.description ?? "" },
        { property: "og:image", content: p?.images[0] ?? "" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = findProduct(slug);
  if (!product) throw notFound();

  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0].name);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [openSection, setOpenSection] = useState<string | null>("details");
  const [reviewModal, setReviewModal] = useState(false);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);

  const price = product.salePrice ?? product.price;
  const related = products.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug).slice(0, 4);

  const handleAdd = () => {
    if (!size) { setError("Please select a size"); return; }
    add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price, size, color, qty });
    push({ type: "success", message: "Added to cart" });
  };

  const reviews = [
    { name: "Karthik R.", date: "12 Mar 2025", rating: 5, text: "Outstanding quality. The fabric weight is perfect and the cut is beautifully considered.", helpful: 24 },
    { name: "Aditya P.", date: "28 Feb 2025", rating: 5, text: "Worth every rupee. Packaging arrived like a gift and the fit is true to size.", helpful: 18 },
    { name: "Devansh M.", date: "14 Feb 2025", rating: 4, text: "Lovely piece. Knocked off a star only because shipping took 6 days, but the product itself is faultless.", helpful: 11 },
  ];
  const dist = [76, 14, 6, 3, 1];

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 pb-20">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <Link to="/collections/$category" params={{ category: product.categorySlug }} className="hover:text-foreground">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8 grid lg:grid-cols-[1.1fr_1fr] gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden group">
            <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {product.images.map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`aspect-square rounded-md overflow-hidden border-2 ${i === imgIdx ? "border-foreground" : "border-transparent"}`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label-caps text-gold">{product.category}</p>
          <h1 className="font-serif text-3xl lg:text-4xl mt-2">{product.name}</h1>
          <a href="#reviews" className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex gap-0.5 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-gold" : "opacity-30"} />)}</span>
            <span className="text-muted-foreground">{product.rating} · {product.reviewCount} reviews</span>
          </a>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl">₹{price.toLocaleString("en-IN")}</span>
            {product.salePrice && <span className="text-muted-foreground line-through">₹{product.price.toLocaleString("en-IN")}</span>}
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          {/* Size */}
          <div className="mt-7">
            <div className="flex items-center justify-between mb-3">
              <p className="label-caps">Select Size</p>
              <button onClick={() => setSizeGuide(true)} className="text-xs underline text-muted-foreground hover:text-foreground">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => { setSize(s); setError(""); }} className={`min-w-[48px] px-3 py-2 rounded-md border text-sm ${size === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>{s}</button>
              ))}
            </div>
            {error && <p className="text-destructive text-xs mt-2">{error}</p>}
          </div>

          {/* Color */}
          <div className="mt-6">
            <p className="label-caps mb-3">Color: <span className="text-muted-foreground">{color}</span></p>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} aria-label={c.name} title={c.name} className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.name ? "border-foreground scale-110" : "border-border"}`} style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mt-6">
            <p className="label-caps mb-3">Quantity</p>
            <div className="inline-flex items-center border border-border rounded-md">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2">−</button>
              <span className="px-4 text-sm">{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="px-3 py-2">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 space-y-3">
            <button onClick={handleAdd} className="w-full bg-foreground text-background py-4 rounded-md text-sm label-caps hover:bg-gold transition-colors">Add to Cart</button>
            <a
              href={whatsappProductUrl(product, size ?? product.sizes[0], color, qty)}
              target="_blank" rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-whatsapp text-white py-4 rounded-md text-sm label-caps hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} /> Ask on WhatsApp
            </a>
          </div>

          {/* Trust */}
          <div className="mt-7 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="border border-border rounded-md p-3"><Truck className="mx-auto mb-1.5 text-gold" size={18} /><p className="text-muted-foreground">Free shipping<br />over ₹2,999</p></div>
            <div className="border border-border rounded-md p-3"><RotateCcw className="mx-auto mb-1.5 text-gold" size={18} /><p className="text-muted-foreground">Easy 30-day<br />returns</p></div>
            <div className="border border-border rounded-md p-3"><ShieldCheck className="mx-auto mb-1.5 text-gold" size={18} /><p className="text-muted-foreground">Authentic &<br />guaranteed</p></div>
          </div>

          {/* Accordion */}
          <div className="mt-8 border-t border-border">
            {[
              { id: "details", title: "Product Details", body: `Fabric: ${product.fabric}. Crafted with a relaxed, contemporary fit. Cold machine wash. Do not bleach. Iron on low.` },
              { id: "fit", title: "Size & Fit", body: "Model is 6'1\" wearing size M. Chest 38\" / Waist 32\". For a relaxed fit, size up. Refer to the size guide above for measurements." },
              { id: "ship", title: "Shipping & Returns", body: "Standard delivery in 3–5 business days. Free shipping on orders over ₹2,999. Returns accepted within 30 days in original condition." },
            ].map((s) => (
              <div key={s.id} className="border-b border-border">
                <button onClick={() => setOpenSection(openSection === s.id ? null : s.id)} className="w-full flex items-center justify-between py-4 text-sm">
                  <span className="label-caps">{s.title}</span>
                  <ChevronDown size={16} className={`transition-transform ${openSection === s.id ? "rotate-180" : ""}`} />
                </button>
                {openSection === s.id && <p className="text-sm text-muted-foreground pb-4">{s.body}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-24">
        <h2 className="font-serif text-3xl mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mt-24 grid md:grid-cols-[280px_1fr] gap-12">
        <div>
          <h2 className="font-serif text-3xl">Reviews</h2>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-5xl">{product.rating}</span>
            <span className="text-muted-foreground text-sm">/ 5</span>
          </div>
          <div className="flex gap-0.5 text-gold mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-gold" : "opacity-30"} />)}</div>
          <p className="text-xs text-muted-foreground mt-1">{product.reviewCount} reviews</p>
          <div className="mt-6 space-y-2">
            {dist.map((pct, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-5">{5 - i}★</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gold" style={{ width: `${pct}%` }} /></div>
                <span className="w-8 text-right text-muted-foreground">{pct}%</span>
              </div>
            ))}
          </div>
          <button onClick={() => setReviewModal(true)} className="mt-6 border border-foreground px-5 py-2.5 rounded-md text-xs label-caps hover:bg-foreground hover:text-background transition-colors">Write a Review</button>
        </div>
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.name} className="border border-border rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <div className="flex gap-0.5 text-gold mt-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < r.rating ? "fill-gold" : "opacity-30"} />)}</div>
                </div>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
              <p className="text-sm mt-3 text-muted-foreground">{r.text}</p>
              <p className="text-xs text-muted-foreground mt-3">Helpful? 👍 {r.helpful}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile sticky WA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 p-4 bg-background border-t border-border">
        <a href={whatsappProductUrl(product, size ?? product.sizes[0], color, qty)} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-whatsapp text-white py-3.5 rounded-md text-sm font-medium">
          <MessageCircle size={16} /> Ask on WhatsApp
        </a>
      </div>

      {/* Review modal */}
      {reviewModal && <ReviewModal close={() => setReviewModal(false)} />}
      {sizeGuide && <SizeGuideModal close={() => setSizeGuide(false)} unit={unit} setUnit={setUnit} />}
    </div>
  );
}

function ReviewModal({ close }: { close: () => void }) {
  const push = useToasts((s) => s.push);
  const [rating, setRating] = useState(5);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60" onClick={close}>
      <div className="bg-surface rounded-xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-serif text-2xl">Write a Review</h3>
          <button onClick={close}><X size={20} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); push({ type: "success", message: "Thank you for your review!" }); close(); }} className="space-y-4">
          <input required placeholder="Name" className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-foreground" />
          <input required type="email" placeholder="Email" className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-foreground" />
          <div>
            <p className="label-caps mb-2">Rating</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)}><Star size={22} className={i < rating ? "fill-gold text-gold" : "text-muted-foreground"} /></button>
              ))}
            </div>
          </div>
          <textarea required placeholder="Your review" rows={4} className="w-full bg-transparent border border-border rounded-md px-4 py-2.5 text-sm outline-none focus:border-foreground" />
          <button className="w-full bg-foreground text-background py-3 rounded-md text-sm label-caps">Submit</button>
        </form>
      </div>
    </div>
  );
}

function SizeGuideModal({ close, unit, setUnit }: { close: () => void; unit: "cm" | "in"; setUnit: (u: "cm" | "in") => void }) {
  const cm = [
    ["XS", 86, 71, 89], ["S", 91, 76, 94], ["M", 96, 81, 99], ["L", 101, 86, 104], ["XL", 106, 91, 109], ["XXL", 111, 96, 114],
  ] as const;
  const conv = (n: number) => unit === "cm" ? n : Math.round(n / 2.54);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60" onClick={close}>
      <div className="bg-surface rounded-xl p-8 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-serif text-2xl">Size Guide</h3>
          <button onClick={close}><X size={20} /></button>
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={() => setUnit("cm")} className={`px-4 py-1.5 rounded-md text-xs ${unit === "cm" ? "bg-foreground text-background" : "border border-border"}`}>cm</button>
          <button onClick={() => setUnit("in")} className={`px-4 py-1.5 rounded-md text-xs ${unit === "in" ? "bg-foreground text-background" : "border border-border"}`}>inches</button>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left label-caps"><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead>
          <tbody>
            {cm.map(([s, c, w, h]) => (
              <tr key={s} className="border-b border-border"><td className="py-3 font-medium">{s}</td><td>{conv(c)}</td><td>{conv(w)}</td><td>{conv(h)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-4">Measurements taken with garment laid flat. For best fit, compare against a piece you already own.</p>
      </div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, useToasts, useWishlist } from "@/lib/store";

export function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  const onSale = !!product.salePrice;

  return (
    <div className="group relative transition-all duration-500 hover:-translate-y-1">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted shadow-sm group-hover:shadow-xl transition-shadow duration-500">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0" loading="lazy" />
          <img src={product.images[1] || product.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" loading="lazy" />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

          {(badge || product.isNew) && (
            <span className="absolute top-3 right-3 label-caps bg-foreground/90 backdrop-blur text-background px-2.5 py-1.5 rounded-full text-[9px] font-bold z-10">{badge ?? "New"}</span>
          )}
          {onSale && (
            <span className="absolute bottom-3 left-3 label-caps bg-gold text-white px-2.5 py-1.5 rounded-full text-[9px] font-bold z-10 shadow-lg">Sale</span>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.salePrice ?? product.price, size: product.sizes[Math.floor(product.sizes.length / 2)], color: product.colors[0].name, qty: 1 });
                push({ type: "success", message: "Added to cart" });
              }}
              className="w-full bg-background/95 backdrop-blur-md text-foreground py-3 rounded-full text-[10px] label-caps font-bold shadow-2xl hover:bg-gold hover:text-white transition-all duration-300"
            >
              Quick Add
            </button>
          </div>
        </div>
      </Link>
      
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(product.id); push({ type: "success", message: wished ? "Removed from wishlist" : "Added to wishlist" }); }}
        aria-label="Wishlist"
        className={`absolute top-3 left-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 z-30 ${wished ? "bg-destructive text-white scale-110 shadow-lg" : "bg-white/80 text-foreground opacity-0 group-hover:opacity-100 hover:bg-white"}`}
      >
        <Heart size={15} className={wished ? "fill-white" : ""} strokeWidth={2} />
      </button>

      <div className="pt-5 pb-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="label-caps text-[10px] text-gold font-bold tracking-widest">{product.category}</p>
            <Link to="/product/$slug" params={{ slug: product.slug }}>
              <h3 className="font-serif text-base mt-1.5 hover:text-gold transition-colors duration-300">{product.name}</h3>
            </Link>
          </div>
          <div className="flex flex-col items-end">
            {onSale ? (
              <>
                <span className="text-gold font-bold">₹{product.salePrice!.toLocaleString("en-IN")}</span>
                <span className="text-[10px] text-muted-foreground line-through opacity-60">₹{product.price.toLocaleString("en-IN")}</span>
              </>
            ) : (
              <span className="font-bold">₹{product.price.toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 opacity-70 italic">{product.fabric}</p>
      </div>
    </div>
  );
}

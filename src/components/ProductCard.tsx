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
    <div className="group relative">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-muted">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-0" loading="lazy" />
          <img src={product.images[1] || product.images[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700" loading="lazy" />
          {(badge || product.isNew) && (
            <span className="absolute top-3 left-12 label-caps bg-foreground text-background px-2.5 py-1 rounded text-[10px]">{badge ?? "New"}</span>
          )}
          {onSale && (
            <span className="absolute bottom-3 left-3 label-caps bg-gold text-[oklch(0.18_0.012_60)] px-2.5 py-1 rounded text-[10px]">Sale</span>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(product.id); push({ type: "success", message: wished ? "Removed from wishlist" : "Added to wishlist" }); }}
        aria-label="Wishlist"
        className="absolute top-3 left-3 w-9 h-9 rounded-full bg-surface/90 backdrop-blur flex items-center justify-center hover:bg-surface transition-colors"
      >
        <Heart size={15} className={wished ? "fill-destructive text-destructive" : ""} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          add({ productId: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.salePrice ?? product.price, size: product.sizes[Math.floor(product.sizes.length / 2)], color: product.colors[0].name, qty: 1 });
          push({ type: "success", message: "Added to cart" });
        }}
        aria-label="Quick add"
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-gold hover:text-background transition-colors"
      >
        <ShoppingBag size={15} />
      </button>
      <div className="pt-4 pb-2 px-1">
        <p className="label-caps text-gold">{product.category}</p>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="font-serif text-base mt-1 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">{product.fabric}</p>
        <div className="mt-2 flex items-baseline gap-2">
          {onSale ? (
            <>
              <span className="text-gold font-medium">₹{product.salePrice!.toLocaleString("en-IN")}</span>
              <span className="text-xs text-muted-foreground line-through">₹{product.price.toLocaleString("en-IN")}</span>
            </>
          ) : (
            <span className="font-medium">₹{product.price.toLocaleString("en-IN")}</span>
          )}
        </div>
      </div>
    </div>
  );
}

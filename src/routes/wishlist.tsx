import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist, useCart, useToasts } from "@/lib/store";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — VELDRA" }, { name: "description", content: "Your saved VELDRA pieces." }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <Heart size={56} className="mx-auto opacity-30" strokeWidth={1} />
        <h1 className="font-serif text-3xl mt-6">Your wishlist is empty</h1>
        <p className="text-muted-foreground mt-2 text-sm">Save the pieces you love.</p>
        <Link to="/" className="inline-block mt-8 bg-foreground text-background px-8 py-3 rounded-md text-sm label-caps">Browse →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-20">
      <h1 className="font-serif text-4xl">Wishlist</h1>
      <p className="text-sm text-muted-foreground mt-2">{items.length} saved pieces</p>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
        {items.map((p) => (
          <div key={p.id}>
            <ProductCard product={p} />
            <div className="flex gap-2 mt-3">
              <button onClick={() => { add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0], price: p.salePrice ?? p.price, size: p.sizes[Math.floor(p.sizes.length / 2)], color: p.colors[0].name, qty: 1 }); push({ type: "success", message: "Moved to cart" }); }} className="flex-1 bg-foreground text-background text-xs label-caps py-2 rounded-md hover:bg-gold transition-colors">Move to Cart</button>
              <button onClick={() => remove(p.id)} className="border border-border text-xs label-caps px-3 rounded-md hover:border-destructive hover:text-destructive">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

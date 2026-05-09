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
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-10">
        {items.map((p) => (
          <div key={p.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ProductCard product={p} />
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button 
                onClick={() => { 
                  add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0], price: p.salePrice ?? p.price, size: p.sizes[Math.floor(p.sizes.length / 2)], color: p.colors[0].name, qty: 1 }); 
                  push({ type: "success", message: "Moved to cart" }); 
                }} 
                className="flex-[2] bg-foreground text-background text-[10px] label-caps py-3 rounded-lg hover:bg-gold transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                Move to Cart
              </button>
              <button 
                onClick={() => remove(p.id)} 
                className="flex-1 border border-border text-[10px] label-caps py-3 rounded-lg hover:bg-destructive/5 hover:text-destructive hover:border-destructive transition-all duration-300 active:scale-95 text-muted-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({ meta: [{ title: "New Arrivals — VELDRA" }, { name: "description", content: "The latest from VELDRA." }] }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const items = products.filter((p) => p.isNew);
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-20">
      <p className="label-caps text-gold">Just Landed</p>
      <h1 className="font-serif text-5xl mt-2">New Arrivals</h1>
      <p className="text-muted-foreground mt-3 max-w-lg">The newest considered additions to the collection.</p>
      <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {items.map((p) => <ProductCard key={p.id} product={p} badge="New" />)}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "@/lib/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — VELDRA" },
      { name: "description", content: "Explore VELDRA's curated categories. Considered menswear for the modern man." },
    ],
  }),
  component: CollectionsIndexPage,
});

function CollectionsIndexPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="label-caps text-gold">The Edit</p>
        <h1 className="font-serif text-5xl mt-2">Collections</h1>
        <p className="text-muted-foreground mt-4">
          Each piece is chosen for its timeless appeal and exceptional quality. 
          Explore our considered categories designed to form the foundation of a modern wardrobe.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {categories.map((cat, i) => (
          <Link 
            key={cat.slug} 
            to="/collections/$category" 
            params={{ category: cat.slug }} 
            className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-muted"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
              <span className="label-caps mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">Explore</span>
              <h2 className="font-serif text-4xl lg:text-5xl">{cat.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

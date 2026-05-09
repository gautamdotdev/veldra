import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, X, SlidersHorizontal } from "lucide-react";
import { products, productsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useToasts } from "@/lib/store";

export const Route = createFileRoute("/collections/$category")({
  head: ({ params }) => {
    const name = params.category.replace("-", " ");
    return {
      meta: [
        { title: `Men's ${name} — VELDRA` },
        { name: "description", content: `Shop VELDRA's curated men's ${name}. Considered design, premium fabrics.` },
      ],
    };
  },
  component: CollectionPage,
});

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];
const COLORS = ["White", "Black", "Navy", "Ecru", "Sage", "Indigo", "Charcoal", "Camel", "Ivory", "Stone"];

function CollectionPage() {
  const { category } = Route.useParams();
  const items = productsByCategory(category);
  if (items.length === 0 && !["t-shirts", "shirts", "jeans", "trousers"].includes(category)) throw notFound();
  const title = items[0]?.category ?? category.replace("-", " ");

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState("newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const push = useToasts((s) => s.push);

  const filtered = useMemo(() => {
    let r = items.slice();
    if (selectedSizes.length) r = r.filter((p) => p.sizes.some((s) => selectedSizes.includes(s)));
    if (selectedColors.length) r = r.filter((p) => p.colors.some((c) => selectedColors.includes(c.name)));
    r = r.filter((p) => (p.salePrice ?? p.price) <= maxPrice);
    if (sort === "low") r.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    if (sort === "high") r.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    if (sort === "best") r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [items, selectedSizes, selectedColors, maxPrice, sort]);

  const toggleArr = (arr: string[], setter: (v: string[]) => void, v: string) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const activeChips: { label: string; clear: () => void }[] = [
    ...selectedSizes.map((s) => ({ label: `Size: ${s}`, clear: () => setSelectedSizes(selectedSizes.filter((x) => x !== s)) })),
    ...selectedColors.map((c) => ({ label: `Color: ${c}`, clear: () => setSelectedColors(selectedColors.filter((x) => x !== c)) })),
    ...(maxPrice < 10000 ? [{ label: `Under ₹${maxPrice}`, clear: () => setMaxPrice(10000) }] : []),
  ];

  const Sidebar = () => (
    <aside className="space-y-8 text-sm">
      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => {
            const on = selectedSizes.includes(s);
            return (
              <button key={s} onClick={() => toggleArr(selectedSizes, setSelectedSizes, s)} className={`px-3 py-1.5 rounded-md border text-xs ${on ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>{s}</button>
            );
          })}
        </div>
      </FilterGroup>
      <FilterGroup title={`Price: up to ₹${maxPrice.toLocaleString("en-IN")}`}>
        <input type="range" min={500} max={10000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[oklch(0.74_0.108_80)]" />
      </FilterGroup>
      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const on = selectedColors.includes(c);
            return (
              <button key={c} onClick={() => toggleArr(selectedColors, setSelectedColors, c)} className={`px-3 py-1.5 rounded-md border text-xs ${on ? "bg-foreground text-background border-foreground" : "border-border hover:border-foreground"}`}>{c}</button>
            );
          })}
        </div>
      </FilterGroup>
    </aside>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-20">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight size={12} />
        <span>Collections</span>
        <ChevronRight size={12} />
        <span className="text-foreground">{title}</span>
      </nav>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl lg:text-5xl">Men's {title}</h1>
          <p className="text-sm text-muted-foreground mt-2">Showing {filtered.length} of {items.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setDrawerOpen(true)} className="lg:hidden flex items-center gap-2 border border-border px-4 py-2 rounded-md text-xs"><SlidersHorizontal size={14} /> Filters</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border border-border rounded-md px-3 py-2 text-xs outline-none">
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="best">Best Selling</option>
          </select>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeChips.map((c, i) => (
            <button key={i} onClick={c.clear} className="flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1 text-xs hover:border-foreground">
              {c.label} <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 grid lg:grid-cols-[240px_1fr] gap-10">
        <div className="hidden lg:block"><Sidebar /></div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && <p className="text-center py-20 text-muted-foreground">No products match these filters.</p>}
          <div className="text-center mt-14">
            <button onClick={() => push({ type: "info", message: "No more products to load" })} className="border border-border px-8 py-3 rounded-md text-xs label-caps hover:border-foreground">Load More</button>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background p-6 overflow-y-auto fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl">Filters</h3>
              <button onClick={() => setDrawerOpen(false)}><X size={20} /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-caps mb-3">{title}</p>
      {children}
    </div>
  );
}

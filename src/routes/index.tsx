import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { categories, products, HERO_IMAGE, EDITORIAL_IMAGE, STORY_IMAGE } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VELDRA — Crafted for the discerning man" },
      { name: "description", content: "Considered menswear. Timeless over trendy. Curated by VELDRA." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 6);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const testimonials = [
    { name: "Arjun M.", rating: 5, text: "The fabric quality is genuinely exceptional. The linen shirt has become a wardrobe staple — and the packaging felt like an experience.", initials: "AM" },
    { name: "Rohan S.", rating: 5, text: "Finally a menswear brand that understands restraint. Quiet, considered pieces that feel made for me. Will be back.", initials: "RS" },
    { name: "Vikram K.", rating: 4, text: "Beautiful tailoring on the trousers. Fit is true to size and the wool blend feels premium without being heavy.", initials: "VK" },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="grid lg:grid-cols-2 min-h-[88vh]">
        <div className="flex flex-col justify-center px-6 lg:px-16 py-16 order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 self-start label-caps text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></span> New Season • SS 2025
          </div>
          <h1 className="font-serif text-[44px] sm:text-6xl lg:text-[80px] leading-[0.95] tracking-tight">
            Dress for<br />the life you<br />deserve.
          </h1>
          <p className="mt-8 text-muted-foreground max-w-md">
            Curated menswear for the discerning gentleman. Timeless over trendy — pieces made to live with you, not the season.
          </p>
          <div className="mt-10">
            <Link to="/collections" className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-sm hover:bg-gold transition-colors">
              Explore Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="relative order-1 lg:order-2 min-h-[50vh] lg:min-h-full">
          <img src={HERO_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((c) => (
            <Link key={c.slug} to="/collections/$category" params={{ category: c.slug }} className="group relative aspect-[3/4] overflow-hidden rounded-lg block">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-serif text-xl">{c.name}</h3>
                <p className="label-caps mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">Shop Now <ArrowRight size={12} /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <div className="text-center mb-14">
          <p className="label-caps text-gold mb-3">Curated</p>
          <h2 className="font-serif text-4xl lg:text-5xl">The Essentials</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="text-center mt-14">
          <Link to="/collections/$category" params={{ category: "t-shirts" }} className="inline-block label-caps border-b border-foreground pb-1 hover:text-gold hover:border-gold transition-colors">View All</Link>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="grid lg:grid-cols-2 mt-20">
        <div className="relative aspect-[4/3] lg:aspect-auto">
          <img src={EDITORIAL_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="bg-surface flex flex-col justify-center px-8 lg:px-20 py-16">
          <p className="label-caps text-gold mb-4">The Edit</p>
          <h2 className="font-serif text-4xl lg:text-5xl leading-tight">The Summer<br />Linen Edit</h2>
          <p className="mt-6 text-muted-foreground max-w-md">Lightweight. Breathable. Effortlessly sharp. Garment-washed linen in a quiet palette of stone, ivory and sage.</p>
          <Link to="/collections/$category" params={{ category: "shirts" }} className="mt-8 inline-flex items-center gap-2 self-start label-caps border-b border-foreground pb-1 hover:text-gold hover:border-gold transition-colors">Shop Linen <ArrowRight size={12} /></Link>
        </div>
      </section>

      {/* NEW ARRIVALS scroll */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="label-caps text-gold mb-2">Just In</p>
            <h2 className="font-serif text-4xl">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="hidden sm:inline-block label-caps border-b border-foreground pb-1 hover:text-gold transition-colors">View All</Link>
        </div>
        <div className="flex gap-6 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-4">
          {newArrivals.map((p) => (
            <div key={p.id} className="min-w-[260px] sm:min-w-[300px]"><ProductCard product={p} /></div>
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="font-serif text-[100px] lg:text-[160px] leading-none text-gold opacity-90">2010</div>
        <div className="space-y-5 text-muted-foreground">
          <p className="label-caps text-foreground">Heritage</p>
          <p>VELDRA was founded on a quiet conviction: that menswear should outlast the season it was made for. From a small atelier in 2010, we set out to build a wardrobe of considered essentials — pieces that earn a permanent place in your life.</p>
          <p>Every garment is sourced from mills with generations of expertise. Supima cotton from the American South. Selvedge denim from Okayama. Linen, garment-washed in small batches.</p>
          <p>We believe in restraint. In refusing trend cycles. In the long, slow craft of dressing well.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-surface py-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="label-caps text-gold mb-3">Words</p>
            <h2 className="font-serif text-4xl">From the Inner Circle</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-background border border-border rounded-xl p-8">
                <div className="flex gap-0.5 text-gold mb-4">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} className={i < t.rating ? "fill-gold" : "opacity-30"} />)}
                </div>
                <p className="text-sm leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-medium">{t.initials}</div>
                  <p className="text-sm font-medium">{t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY IMAGE FULL */}
      <section className="relative h-[60vh] mt-20">
        <img src={STORY_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full flex items-center justify-center text-center text-white px-6">
          <div>
            <p className="label-caps text-gold mb-4">Our Promise</p>
            <h2 className="font-serif text-4xl lg:text-6xl max-w-3xl">"Not the loudest in the room.<br />The most considered."</h2>
          </div>
        </div>
      </section>
    </div>
  );
}

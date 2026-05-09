import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Sun, Moon, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useTheme, useWishlist } from "@/lib/store";
import { products } from "@/lib/products";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/collections/t-shirts", label: "Collections" },
  { to: "/new-arrivals", label: "New Arrivals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const cartCount = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const { theme, toggle, init } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim().length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-background"}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu"><Menu size={22} /></button>
        <Link to="/" className="font-serif text-2xl tracking-tight flex items-baseline">
          VELDRA<span className="text-gold ml-0.5">.</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-9">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link text-foreground/80 hover:text-foreground transition-colors" activeProps={{ className: "nav-link text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="p-2 hover:text-gold transition-colors"><Search size={18} /></button>
          <button onClick={toggle} aria-label="Theme" className="p-2 hover:text-gold transition-colors">{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
          <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:text-gold transition-colors relative">
            <Heart size={18} />
            {wishCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-[10px] text-background w-4 h-4 rounded-full flex items-center justify-center font-medium">{wishCount}</span>}
          </Link>
          <Link to="/cart" aria-label="Cart" className="p-2 hover:text-gold transition-colors relative">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-gold text-[10px] text-background w-4 h-4 rounded-full flex items-center justify-center font-medium">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-surface fade-in-up">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && query) { navigate({ to: "/collections/$category", params: { category: "t-shirts" } }); setSearchOpen(false); } }}
                placeholder="Search for products, categories…"
                className="w-full bg-transparent border border-border rounded-md pl-10 pr-10 py-3 outline-none focus:border-foreground"
              />
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={16} /></button>
            </div>
            {query && (
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {results.length === 0 ? (
                  <p className="text-muted-foreground text-sm col-span-full">No products found for "{query}"</p>
                ) : results.map((p) => (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} onClick={() => setSearchOpen(false)} className="group">
                    <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-serif text-sm mt-2">{p.name}</p>
                    <p className="text-xs text-muted-foreground">₹{(p.salePrice ?? p.price).toLocaleString("en-IN")}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background lg:hidden">
          <div className="flex items-center justify-between h-20 px-6">
            <Link to="/" onClick={() => setMobileOpen(false)} className="font-serif text-2xl">VELDRA<span className="text-gold">.</span></Link>
            <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
          </div>
          <nav className="flex flex-col px-6 gap-6 pt-8">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="font-serif text-3xl">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

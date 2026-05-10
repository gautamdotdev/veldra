import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Search, Sun, Moon, ShoppingBag, Heart, Menu, X, ChevronDown, Package, Shield, User, Mail, Sparkles, Home, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useTheme, useWishlist } from "@/lib/store";
import { products } from "@/lib/products";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/collections", label: "Collections" },
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
  const router = useRouter();

  useEffect(() => { init(); }, [init]);
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = query.trim().length > 0
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 w-full h-16 transition-all duration-300">
      {/* Dynamic Background Layer */}
      <div className={`absolute inset-0 -z-10 transition-all duration-500 ${
        mobileOpen 
          ? "bg-background" 
          : (scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-sm" : "bg-background")
      }`} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between relative">
        <Link to="/" className="font-serif text-xl sm:text-2xl tracking-tight flex items-baseline z-50">
          VELDRA<span className="text-gold ml-0.5">.</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 ml-auto mr-12">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link text-[11px] text-foreground/60 hover:text-foreground transition-all hover:tracking-widest duration-500" activeProps={{ className: "nav-link text-foreground font-semibold" }}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          {!(router.state.location.pathname.includes("/cart") || router.state.location.pathname.includes("/wishlist")) && (
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="p-2 hover:text-gold transition-all duration-300 hover:scale-110"><Search size={18} strokeWidth={1.5} /></button>
          )}
          <button onClick={toggle} aria-label="Theme" className="p-2 hover:text-gold transition-all duration-300 hover:scale-110 hidden sm:block">{theme === "light" ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}</button>
          <Link to="/wishlist" aria-label="Wishlist" className="p-2 hover:text-gold transition-all duration-300 hover:scale-110 relative">
            <Heart size={18} strokeWidth={1.5} />
            {wishCount > 0 && <span className="absolute top-1 right-1 bg-gold text-[8px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-500">{wishCount}</span>}
          </Link>
          <Link to="/cart" aria-label="Cart" className="p-2 hover:text-gold transition-all duration-300 hover:scale-110 relative">
            <ShoppingBag size={18} strokeWidth={1.5} />
            {cartCount > 0 && <span className="absolute top-1 right-1 bg-gold text-[8px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-500">{cartCount}</span>}
          </Link>
          <button className="lg:hidden p-2 ml-1 hover:text-gold transition-all duration-300" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Search Overlay - Positioned relative to this container */}
        {searchOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-[calc(100%-12px)] sm:w-[500px] mt-3 z-[60] animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500">
            <div className="bg-background/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4">
                <Search size={16} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && query) { navigate({ to: "/collections/$category", params: { category: "t-shirts" } }); setSearchOpen(false); } }}
                  placeholder="Search VELDRA..."
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
                />
                <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="p-1 hover:bg-muted rounded-full transition-colors"><X size={16} /></button>
              </div>
              {query && (
                <div className="border-t border-border px-6 py-6 bg-surface/30">
                  <p className="label-caps text-[10px] text-muted-foreground mb-4">Results</p>
                  <div className="grid grid-cols-2 gap-4">
                    {results.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic col-span-full">No matches for "{query}"</p>
                    ) : results.map((p) => (
                      <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} onClick={() => setSearchOpen(false)} className="flex items-center gap-3 group">
                        <div className="w-12 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-serif text-[11px] leading-tight truncate group-hover:text-gold transition-colors">{p.name}</p>
                          <p className="text-[9px] text-muted-foreground mt-0.5">₹{p.price.toLocaleString("en-IN")}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${mobileOpen ? "visible" : "invisible pointer-events-none"}`}>
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${mobileOpen ? "opacity-100" : "opacity-0"}`} 
          onClick={() => setMobileOpen(false)} 
        />
        
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background shadow-2xl transition-transform duration-500 ease-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between h-16 px-8 border-b border-border/50">
            <Link to="/" onClick={() => setMobileOpen(false)} className="font-serif text-xl sm:text-2xl tracking-tight flex items-baseline">
              VELDRA<span className="text-gold ml-0.5">.</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-2 -mr-2 hover:bg-muted rounded-full transition-colors"><X size={20} strokeWidth={1.5} /></button>
          </div>
          
          <div className="flex flex-col h-[calc(100%-64px)] justify-between">
            <nav className="flex flex-col px-8 py-10 gap-8">
              {navLinks.map((l, i) => (
                <Link 
                  key={l.to} 
                  to={l.to} 
                  onClick={() => setMobileOpen(false)} 
                  className={`font-serif text-4xl hover:text-gold transition-all duration-300 transform ${mobileOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className={`px-8 py-10 border-t border-border/50 bg-surface/30 transition-all duration-700 ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-6 mb-8">
                <button onClick={toggle} className="flex items-center gap-3 text-sm font-medium">
                  {theme === "light" ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                </button>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Connect with us</p>
              <div className="flex gap-5 text-muted-foreground">
                <span className="hover:text-foreground cursor-pointer transition-colors">Instagram</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">Twitter</span>
                <span className="hover:text-foreground cursor-pointer transition-colors">Pinterest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

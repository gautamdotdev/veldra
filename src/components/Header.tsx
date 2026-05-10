import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Search, Sun, Moon, ShoppingBag, Heart, Menu, X, ChevronDown, Package, Shield, User, Mail, Sparkles, Home, Layers } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
          <Link to="/profile" aria-label="Profile" className="p-2 hover:text-gold transition-all duration-300 hover:scale-110 hidden sm:block">
            <User size={18} strokeWidth={1.5} />
          </Link>
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
          
          <div className="flex flex-col h-[calc(100%-64px)] overflow-y-auto">
            <nav className="flex flex-col px-7 py-8 gap-1">
              <MobileLink to="/" icon={<Home size={16} />} onNavigate={() => setMobileOpen(false)} delay={0} open={mobileOpen}>Home</MobileLink>

              {/* Shop dropdown */}
              <MobileGroup
                label="Shop"
                icon={<Layers size={16} />}
                delay={50}
                open={mobileOpen}
                items={[
                  { to: "/collections" as const, label: "All Collections", caption: "Browse the full catalogue" },
                  { to: "/collections/$category" as const, params: { category: "t-shirts" }, label: "T-Shirts", caption: "Supima & modal essentials" },
                  { to: "/collections/$category" as const, params: { category: "shirts" }, label: "Shirts", caption: "Linen, oxford & poplin" },
                  { to: "/collections/$category" as const, params: { category: "jeans" }, label: "Jeans", caption: "Selvedge & stretch denim" },
                  { to: "/collections/$category" as const, params: { category: "trousers" }, label: "Trousers", caption: "Pleated wool & chinos" },
                ]}
                onNavigate={() => setMobileOpen(false)}
              />

              <MobileLink to="/new-arrivals" icon={<Sparkles size={16} />} onNavigate={() => setMobileOpen(false)} delay={100} open={mobileOpen}>New Arrivals</MobileLink>
              <MobileLink to="/about" icon={<User size={16} />} onNavigate={() => setMobileOpen(false)} delay={150} open={mobileOpen}>About</MobileLink>
              <MobileLink to="/contact" icon={<Mail size={16} />} onNavigate={() => setMobileOpen(false)} delay={200} open={mobileOpen}>Contact</MobileLink>

              <div className="h-px bg-border/60 my-5" />
              <p className="px-3 mb-2 text-[10px] label-caps text-muted-foreground tracking-widest">Account</p>
              <MobileLink to="/orders" icon={<Package size={16} />} onNavigate={() => setMobileOpen(false)} delay={250} open={mobileOpen}>My Orders</MobileLink>
              <MobileLink to="/wishlist" icon={<Heart size={16} />} onNavigate={() => setMobileOpen(false)} delay={300} open={mobileOpen}>Wishlist</MobileLink>
              <MobileLink to="/cart" icon={<ShoppingBag size={16} />} onNavigate={() => setMobileOpen(false)} delay={350} open={mobileOpen}>Cart</MobileLink>
              <MobileLink to="/admin/orders" icon={<Shield size={16} />} onNavigate={() => setMobileOpen(false)} delay={400} open={mobileOpen}>Admin · Orders</MobileLink>
            </nav>

            <div className={`mt-auto px-8 py-8 border-t border-border/50 bg-surface/30 transition-all duration-700 ${mobileOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="flex items-center gap-6 mb-6">
                <button onClick={toggle} className="flex items-center gap-3 text-sm font-medium">
                  {theme === "light" ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
                </button>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Connect with us</p>
              <div className="flex gap-5 text-muted-foreground text-sm">
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

function MobileLink({ to, icon, children, onNavigate, delay, open }: { to: string; icon: React.ReactNode; children: React.ReactNode; onNavigate: () => void; delay: number; open: boolean }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-muted-foreground group-hover:text-gold transition-colors">{icon}</span>
      <span className="font-serif text-lg group-hover:text-gold transition-colors">{children}</span>
    </Link>
  );
}

type GroupItem = { to: "/collections" } | { to: "/collections/$category"; params: { category: string }; label: string; caption: string } | { to: "/collections"; label: string; caption: string };
function MobileGroup({ label, icon, items, onNavigate, delay, open }: {
  label: string; icon: React.ReactNode; delay: number; open: boolean; onNavigate: () => void;
  items: Array<{ to: any; params?: any; label: string; caption: string }>;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={`transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"}`} style={{ transitionDelay: `${delay}ms` }}>
      <button onClick={() => setExpanded((s) => !s)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-serif text-lg flex-1 text-left">{label}</span>
        <ChevronDown size={16} className={`text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="pl-6 pr-2 py-2 space-y-1">
            {items.map((it) => (
              <Link key={it.label} to={it.to} params={it.params} onClick={onNavigate} className="group block px-3 py-2.5 rounded-lg hover:bg-muted/60 border-l-2 border-border hover:border-gold transition-all">
                <p className="text-sm font-medium group-hover:text-gold transition-colors">{it.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{it.caption}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

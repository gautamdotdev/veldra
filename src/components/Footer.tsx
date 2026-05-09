import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Facebook } from "lucide-react";
import { useToasts } from "@/lib/store";
import { useState } from "react";

export function Footer() {
  const push = useToasts((s) => s.push);
  const [email, setEmail] = useState("");
  return (
    <footer className="bg-[oklch(0.18_0.012_60)] text-[oklch(0.88_0.01_70)] mt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-serif text-2xl">VELDRA<span className="text-gold">.</span></div>
            <p className="text-sm mt-3 opacity-70 max-w-[220px]">Crafted for the discerning man. Considered menswear, made to last.</p>
          </div>
          <FooterCol title="Shop" links={[
            { label: "T-Shirts", to: "/collections/t-shirts" },
            { label: "Shirts", to: "/collections/shirts" },
            { label: "Jeans", to: "/collections/jeans" },
            { label: "Trousers", to: "/collections/trousers" },
            { label: "New Arrivals", to: "/new-arrivals" },
          ]} />
          <FooterCol title="Company" links={[
            { label: "About", to: "/about" },
            { label: "Careers", to: "/about" },
            { label: "Press", to: "/about" },
            { label: "Sustainability", to: "/about" },
          ]} />
          <FooterCol title="Support" links={[
            { label: "Sizing Guide", to: "/contact" },
            { label: "Shipping Info", to: "/contact" },
            { label: "Returns", to: "/contact" },
            { label: "Contact Us", to: "/contact" },
          ]} />
          <div>
            <p className="label-caps mb-4 text-gold">Connect</p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-gold transition-colors"><Instagram size={15} /></a>
              <a href={`https://wa.me/919876543210`} target="_blank" rel="noreferrer" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-gold transition-colors"><MessageCircle size={15} /></a>
              <a href="#" className="w-9 h-9 border border-white/20 rounded-full flex items-center justify-center hover:border-gold transition-colors"><Facebook size={15} /></a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-10 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-serif text-2xl text-white">Join the Inner Circle</h3>
              <p className="text-sm opacity-70 mt-1">No spam. Just curated drops.</p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (email) { push({ type: "success", message: "Welcome to the Inner Circle." }); setEmail(""); } }}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Email address" className="flex-1 bg-transparent border border-white/20 rounded-md px-4 py-3 text-sm outline-none focus:border-gold" />
              <button className="bg-gold text-[oklch(0.18_0.012_60)] px-6 py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between text-xs opacity-60 gap-2">
          <p>© 2025 VELDRA. All rights reserved.</p>
          <div className="flex gap-5"><a href="#">Privacy Policy</a><a href="#">Terms</a></div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <p className="label-caps mb-4 text-gold">{title}</p>
      <ul className="space-y-2 text-sm opacity-80">
        {links.map((l) => <li key={l.label}><Link to={l.to} className="hover:text-gold transition-colors">{l.label}</Link></li>)}
      </ul>
    </div>
  );
}

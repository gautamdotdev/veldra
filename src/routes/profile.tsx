import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Mail, Phone, MapPin, Package, Heart, ShoppingBag, Shield, LogOut, Save, Camera } from "lucide-react";
import { useState } from "react";
import { useProfile, useOrders, useWishlist, useCart, useToasts, useAdmin } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — VELDRA" }, { name: "description", content: "Manage your VELDRA account and preferences." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useProfile((s) => s.profile);
  const update = useProfile((s) => s.update);
  const push = useToasts((s) => s.push);
  const myOrders = useOrders((s) => s.orders.filter((o) => o.mine));
  const wishCount = useWishlist((s) => s.ids.length);
  const cartCount = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const isAdmin = useAdmin((s) => s.isAdmin);
  const adminLogout = useAdmin((s) => s.logout);

  const [form, setForm] = useState(profile);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    update(form);
    push({ type: "success", message: "Profile updated" });
  };

  const initials = profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  const memberSince = "March 2024";

  return (
    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-12 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-amber-700 text-white font-serif text-3xl flex items-center justify-center shadow-lg">{initials}</div>
          <button className="absolute -bottom-1 -right-1 bg-background border border-border rounded-full p-2 hover:bg-muted transition" aria-label="Change photo"><Camera size={14} /></button>
        </div>
        <div>
          <p className="label-caps text-[10px] text-gold">Member · {memberSince}</p>
          <h1 className="font-serif text-4xl sm:text-5xl mt-1">{profile.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{profile.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatLink to="/orders" icon={<Package size={18} />} label="Orders" value={myOrders.length} />
        <StatLink to="/wishlist" icon={<Heart size={18} />} label="Wishlist" value={wishCount} />
        <StatLink to="/cart" icon={<ShoppingBag size={18} />} label="In Cart" value={cartCount} />
        <Stat icon={<Shield size={18} />} label="Status" value={isAdmin ? "Admin" : "Customer"} accent={isAdmin} />
      </div>

      <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Edit form */}
        <form onSubmit={onSave} className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-2xl">Personal Information</h2>
          <p className="text-xs text-muted-foreground mt-1">Used for orders, delivery and WhatsApp inquiries.</p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={<User size={14} />} value={form.name} onChange={set("name")} />
            <Field label="Email" icon={<Mail size={14} />} value={form.email} onChange={set("email")} type="email" />
            <Field label="Phone" icon={<Phone size={14} />} value={form.phone} onChange={set("phone")} />
            <Field label="Pincode" icon={<MapPin size={14} />} value={form.pincode} onChange={set("pincode")} />
            <div className="sm:col-span-2">
              <label className="block">
                <span className="text-[10px] label-caps text-muted-foreground flex items-center gap-2"><MapPin size={14} /> Address</span>
                <textarea value={form.address} onChange={set("address")} rows={2} className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-gold resize-none" />
              </label>
            </div>
            <Field label="City" icon={<MapPin size={14} />} value={form.city} onChange={set("city")} />
          </div>

          <button type="submit" className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-[11px] label-caps font-bold hover:bg-gold transition">
            <Save size={14} /> Save Changes
          </button>
        </form>

        {/* Recent orders */}
        <aside className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl">Recent Orders</h2>
            <Link to="/orders" className="text-[10px] label-caps text-gold hover:underline">View All →</Link>
          </div>
          {myOrders.length === 0 ? (
            <p className="text-xs text-muted-foreground italic mt-6">No orders yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {myOrders.slice(0, 4).map((o) => (
                <Link key={o.id} to="/order/$id" params={{ id: o.id }} className="block group p-3 -mx-3 rounded-xl hover:bg-muted/40 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 shrink-0">
                      {o.items.slice(0, 2).map((i) => (
                        <div key={i.id} className="w-9 h-11 rounded-md overflow-hidden bg-muted border-2 border-surface">
                          <img src={i.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-muted-foreground">{o.id}</p>
                      <p className="text-xs font-medium truncate group-hover:text-gold transition-colors">₹{o.total.toLocaleString("en-IN")} · {o.status}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border space-y-2">
            <Link to="/admin/orders" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition">
              <Shield size={14} /> {isAdmin ? "Admin Dashboard" : "Admin Login"}
            </Link>
            {isAdmin && (
              <button onClick={() => { adminLogout(); push({ type: "info", message: "Admin logged out" }); }} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-destructive transition">
                <LogOut size={14} /> Sign out of Admin
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, type = "text" }: { label: string; icon: React.ReactNode; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] label-caps text-muted-foreground flex items-center gap-2">{icon} {label}</span>
      <input type={type} value={value} onChange={onChange} className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-gold" />
    </label>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-[10px] label-caps">{label}</span></div>
      <p className={`font-serif text-2xl mt-2 ${accent ? "text-gold" : ""}`}>{value}</p>
    </div>
  );
}

function StatLink({ to, icon, label, value }: { to: "/orders" | "/wishlist" | "/cart"; icon: React.ReactNode; label: string; value: number }) {
  return (
    <Link to={to} className="bg-surface border border-border rounded-xl p-4 hover:border-gold transition group">
      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-gold transition">{icon}<span className="text-[10px] label-caps">{label}</span></div>
      <p className="font-serif text-2xl mt-2 group-hover:text-gold transition">{value}</p>
    </Link>
  );
}

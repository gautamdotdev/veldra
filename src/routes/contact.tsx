import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, MapPin, Clock, Mail, Phone } from "lucide-react";
import { useToasts } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — VELDRA" }, { name: "description", content: "Reach the VELDRA team." }] }),
  component: ContactPage,
});

function ContactPage() {
  const push = useToasts((s) => s.push);
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 pb-20">
      <div className="text-center max-w-xl mx-auto">
        <p className="label-caps text-gold">Contact</p>
        <h1 className="font-serif text-5xl mt-3">Get in Touch</h1>
        <p className="text-muted-foreground mt-4">Questions about a piece, your order, or sizing — we'd love to help.</p>
      </div>

      <div className="mt-14 grid lg:grid-cols-[1fr_360px] gap-10">
        <form onSubmit={(e) => { e.preventDefault(); push({ type: "success", message: "Message sent! We'll reply within 24 hours." }); setForm({ name: "", email: "", subject: "General", message: "" }); }} className="bg-surface border border-border rounded-xl p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></Field>
            <Field label="Email"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></Field>
          </div>
          <Field label="Subject">
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="input">
              <option>General</option><option>Order Inquiry</option><option>Sizing Help</option><option>Returns</option><option>Wholesale</option>
            </select>
          </Field>
          <Field label="Message"><textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input" /></Field>
          <button className="bg-foreground text-background px-8 py-3 rounded-md text-sm label-caps hover:bg-gold transition-colors">Send Message</button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-2 text-sm text-whatsapp hover:underline"><MessageCircle size={16} /> Or chat with us directly →</a>

          <style>{`.input { width:100%; background:transparent; border:1px solid var(--color-border); border-radius:6px; padding:0.6rem 0.85rem; font-size:0.875rem; outline:none; transition:border-color 0.2s; } .input:focus { border-color: var(--color-foreground); }`}</style>
        </form>

        <aside className="space-y-6">
          <Info Icon={MapPin} title="Atelier" lines={["12 Heritage Lane", "Bandra West, Mumbai", "400050"]} />
          <Info Icon={Clock} title="Hours" lines={["Mon–Sat: 11:00 – 20:00", "Sunday: by appointment"]} />
          <Info Icon={Mail} title="Email" lines={["hello@veldra.com"]} />
          <Info Icon={Phone} title="Phone" lines={["+91 98765 43210"]} />
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 bg-whatsapp text-white py-3 rounded-md text-sm label-caps">
            <MessageCircle size={16} /> WhatsApp Us
          </a>
          <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border">
            <iframe title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=72.82%2C19.05%2C72.84%2C19.07&layer=mapnik" className="w-full h-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps block mb-2">{label}</span>
      {children}
    </label>
  );
}

function Info({ Icon, title, lines }: { Icon: any; title: string; lines: string[] }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex gap-4">
      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center"><Icon size={16} className="text-gold" /></div>
      <div>
        <p className="label-caps">{title}</p>
        {lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
      </div>
    </div>
  );
}

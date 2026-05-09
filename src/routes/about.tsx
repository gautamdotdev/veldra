import { createFileRoute } from "@tanstack/react-router";
import { Award, Leaf, Scissors } from "lucide-react";
import { STORY_IMAGE } from "@/lib/products";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Our Story — VELDRA" }, { name: "description", content: "The story of VELDRA: considered menswear since 2010." }] }),
  component: AboutPage,
});

function AboutPage() {
  const timeline = [
    { year: "2010", note: "Founded in a small Mumbai atelier" },
    { year: "2014", note: "Expanded to a full menswear collection" },
    { year: "2018", note: "Launched online — direct to gentlemen" },
    { year: "2023", note: "Crossed 10,000 customers worldwide" },
  ];
  const team = [
    { name: "Rajan Mehta", role: "Founder & Creative Director", initials: "RM" },
    { name: "Anand Iyer", role: "Head of Design", initials: "AI" },
    { name: "Sara Bhatia", role: "Head of Atelier", initials: "SB" },
  ];
  return (
    <div>
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="label-caps text-gold mb-4">About</p>
        <h1 className="font-serif text-5xl lg:text-7xl leading-tight">Our Story</h1>
        <p className="mt-6 text-muted-foreground">VELDRA was built on the belief that the most stylish wardrobe is the most considered one. Fewer pieces. Better made. Worn for years, not seasons.</p>
      </section>

      <section className="relative h-[55vh]">
        <img src={STORY_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl text-center mb-12">Our Journey</h2>
        <div className="space-y-8">
          {timeline.map((t, i) => (
            <div key={t.year} className="flex gap-8 items-baseline border-b border-border pb-8 last:border-0">
              <span className="font-serif text-4xl text-gold w-24">{t.year}</span>
              <p className="text-muted-foreground flex-1">{t.note}</p>
              <span className="text-xs text-muted-foreground">0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-serif text-3xl text-center mb-14">Three Pillars</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Pillar Icon={Award} title="Quality" body="Mills with generations of expertise. Fabrics that earn their place in your wardrobe." />
            <Pillar Icon={Leaf} title="Sustainability" body="Small-batch production. Considered materials. A garment made well is the most sustainable choice." />
            <Pillar Icon={Scissors} title="Heritage" body="Tailoring rooted in tradition. Cuts refined over decades of practice." />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-serif text-3xl lg:text-4xl leading-snug">"We make clothes for the man who chooses presence over performance — quietly, confidently, and for a long time."</p>
        <p className="label-caps text-gold mt-6">— Rajan Mehta, Founder</p>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 pb-24">
        <h2 className="font-serif text-3xl text-center mb-12">The People</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="bg-surface border border-border rounded-lg p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-gold/20 text-gold flex items-center justify-center font-serif text-xl">{m.initials}</div>
              <p className="font-serif text-xl mt-5">{m.name}</p>
              <p className="text-xs label-caps text-muted-foreground mt-2">{m.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Pillar({ Icon, title, body }: { Icon: any; title: string; body: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-background border border-border flex items-center justify-center"><Icon size={22} className="text-gold" /></div>
      <h3 className="font-serif text-2xl mt-5">{title}</h3>
      <p className="text-sm text-muted-foreground mt-3">{body}</p>
    </div>
  );
}

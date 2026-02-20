import { Link } from "react-router-dom";
import { CheckCircle, Wifi, Coffee, Monitor, Users } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { business } from "@/data/business";

const features = [
  { icon: <Wifi className="h-5 w-5" />, title: "Yüksek Hızlı İnternet", desc: "Fiber altyapılı kesintisiz internet." },
  { icon: <Coffee className="h-5 w-5" />, title: "Çay & Kahve", desc: "Sınırsız sıcak içecek servisi." },
  { icon: <Monitor className="h-5 w-5" />, title: "Modern Ekipman", desc: "Monitör, yazıcı ve tarayıcı erişimi." },
  { icon: <Users className="h-5 w-5" />, title: "Networking", desc: "Farklı sektörlerden profesyonellerle tanışın." },
];

const faqs = [
  { q: "Coworking alan saatleri nedir?", a: "Hafta içi 09:00-18:00, Cumartesi 09:00-14:00 arası açıktır." },
  { q: "Günlük kullanım mümkün mü?", a: "Evet, günlük geçiş kartı ile tek seferlik kullanım yapabilirsiniz." },
  { q: "Toplantı odası kullanabilir miyim?", a: "Evet, aylık paketlerde belirli saatler dahildir, ek saatler ücretlidir." },
];

const CoworkingSakarya = () => (
  <Layout>
    <SEOHead
      title="Coworking Sakarya | Workhibrit Ortak Çalışma Alanı"
      description="Sakarya'da coworking çalışma alanı. Yüksek hızlı internet, modern ekipman ve networking imkanı. Workhibrit coworking ile verimli çalışın."
      keywords="coworking sakarya, ortak çalışma alanı sakarya, coworking space sakarya"
      canonical="https://sakaryasanalofis.com/coworking-sakarya"
    />

    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h1 className="font-display text-4xl font-extrabold">Coworking Sakarya</h1>
        <p className="mt-4 text-lg text-primary-foreground/80">Modern ve verimli ortak çalışma alanlarında işinizi büyütün.</p>
        <Button size="lg" variant="secondary" className="mt-6" asChild>
          <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">Tur Rezervasyonu Yapın</a>
        </Button>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold">Neden Coworking?</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Coworking, farklı sektörlerden profesyonellerin aynı alanı paylaşarak verimli çalıştığı modern bir iş modelidir. Sabit ofis maliyetlerinden kurtulurken profesyonel bir ortamda çalışmanın keyfini yaşarsınız.
        </p>
      </div>
    </section>

    <section className="bg-secondary py-16">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Özellikler</h2>
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4 rounded-lg bg-background p-5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">{f.icon}</div>
              <div>
                <h3 className="font-display font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16">
      <div className="container text-center">
        <h2 className="font-display text-3xl font-bold">Fiyatlar</h2>
        <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
          {[
            { label: "Günlük", price: "₺150" },
            { label: "Haftalık", price: "₺600" },
            { label: "Aylık", price: "₺1.500" },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">{p.label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-primary">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t py-8">
      <div className="container flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/sanal-ofis-sakarya" className="text-primary hover:underline">Sanal Ofis →</Link>
        <Link to="/toplanti-odasi-sakarya" className="text-primary hover:underline">Toplantı Odası →</Link>
        <Link to="/hazir-ofis" className="text-primary hover:underline">Hazır Ofis →</Link>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection title="Coworking Alanımızı Keşfedin" subtitle="Ücretsiz tur için hemen randevu alın." />
  </Layout>
);

export default CoworkingSakarya;

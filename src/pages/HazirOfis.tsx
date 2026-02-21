import { Link } from "react-router-dom";
import { CheckCircle, Key, Shield, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { useBusinessData } from "@/hooks/useBusinessData";

const benefits = [
  "Tam donanımlı özel ofis",
  "Yüksek hızlı fiber internet",
  "Klima ve ısıtma sistemi",
  "Ortak mutfak kullanımı",
  "7/24 güvenlik",
  "Toplantı odası erişimi",
  "Temizlik hizmeti dahil",
  "Esnek sözleşme süreleri",
];

const faqs = [
  { q: "Hazır ofis nedir?", a: "Hazır ofis, mobilya, internet ve teknik altyapı dahil kullanıma hazır özel ofis alanlarıdır." },
  { q: "Minimum kiralama süresi nedir?", a: "Minimum 1 aylık sözleşme ile kiralama yapılabilmektedir." },
  { q: "Ofis boyutları nelerdir?", a: "1 ile 10 kişilik farklı boyutlarda hazır ofis seçeneklerimiz mevcuttur." },
];

const HazirOfis = () => {
  const { whatsapp } = useBusinessData();

  return (
  <Layout>
    <SEOHead
      title="Hazır Ofis Sakarya | Sakarya Sanal Ofis Kiralık Ofis"
      description="Sakarya'da hazır ofis kiralama. Tam donanımlı, kullanıma hazır özel ofis alanları. Sakarya Sanal Ofis ile hemen taşının."
      keywords="hazır ofis sakarya, kiralık ofis sakarya, ofis kiralama sakarya"
      canonical="https://sakaryasanalofis.com/hazir-ofis"
    />

    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h1 className="font-display text-4xl font-extrabold">Hazır Ofis Çözümleri</h1>
        <p className="mt-4 text-lg text-primary-foreground/80">Tam donanımlı, kullanıma hazır özel ofis alanları.</p>
        <Button size="lg" variant="secondary" className="mt-6" asChild>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">Ofis Turu Planlayın</a>
        </Button>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold">Neden Hazır Ofis?</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Hazır ofis, işinize hemen başlamanız için gereken her şeyi sunar. Mobilya, internet, temizlik ve güvenlik dahil. Dekorasyon ve kurulum maliyeti olmadan profesyonel bir ofis ortamında çalışmaya başlayın.
        </p>
      </div>
    </section>

    <section className="bg-secondary py-16">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Dahil Olanlar</h2>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-background p-4 shadow-sm">
              <CheckCircle className="h-5 w-5 shrink-0 text-accent" />
              <span className="text-sm font-medium">{b}</span>
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
            { label: "1-2 Kişilik", price: "₺3.500/ay" },
            { label: "3-5 Kişilik", price: "₺5.500/ay" },
            { label: "6-10 Kişilik", price: "₺8.500/ay" },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">{p.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-primary">{p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t py-8">
      <div className="container flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/sanal-ofis-sakarya" className="text-primary hover:underline">Sanal Ofis →</Link>
        <Link to="/coworking-sakarya" className="text-primary hover:underline">Coworking →</Link>
        <Link to="/toplanti-odasi-sakarya" className="text-primary hover:underline">Toplantı Odası →</Link>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection title="Hazır Ofisinizi Seçin" subtitle="Size uygun ofis için ücretsiz tur randevusu alın." />
  </Layout>
  );
};

export default HazirOfis;

import { Link } from "react-router-dom";
import { Monitor, Users, Projector, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBusinessData } from "@/hooks/useBusinessData";

const rooms = [
  { name: "Küçük Toplantı Odası", capacity: "4 Kişi", price: "₺200/saat", features: ["TV ekran", "Whiteboard", "Wi-Fi"] },
  { name: "Orta Toplantı Odası", capacity: "8 Kişi", price: "₺350/saat", features: ["Projeksiyon", "Video konferans", "Wi-Fi", "İkram"] },
  { name: "Büyük Toplantı Odası", capacity: "16 Kişi", price: "₺500/saat", features: ["Projeksiyon", "Video konferans", "Ses sistemi", "Wi-Fi", "İkram"] },
];

const faqs = [
  { q: "Toplantı odası nasıl kiralanır?", a: "Telefon veya WhatsApp üzerinden rezervasyon yapabilirsiniz." },
  { q: "Minimum kiralama süresi nedir?", a: "Minimum 1 saatlik kiralama yapılabilmektedir." },
  { q: "Teknik ekipman dahil mi?", a: "Evet, tüm toplantı odalarımızda projeksiyon veya TV ekran ve Wi-Fi dahildir." },
];

const ToplantiOdasiSakarya = () => {
  const { whatsapp } = useBusinessData();

  return (
  <Layout>
    <SEOHead
      title="Toplantı Odası Sakarya | Sakarya Sanal Ofis Kiralık Toplantı Odası"
      description="Sakarya'da kiralık toplantı odası. Profesyonel ekipman, video konferans imkanı. Sakarya Sanal Ofis toplantı odası saatlik ve günlük kiralama."
      keywords="toplantı odası sakarya, kiralık toplantı odası sakarya, toplantı odası kiralama"
      canonical="https://sakaryasanalofis.com/toplanti-odasi-sakarya"
    />

    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h1 className="font-display text-4xl font-extrabold">Toplantı Odası Kiralama</h1>
        <p className="mt-4 text-lg text-primary-foreground/80">Sakarya'da profesyonel toplantı odalarını saatlik veya günlük kiralayın.</p>
        <Button size="lg" variant="secondary" className="mt-6" asChild>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">Rezervasyon Yapın</a>
        </Button>
      </div>
    </section>

    <section className="py-16">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Toplantı Odalarımız</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {rooms.map((r, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{r.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">Kapasite: {r.capacity}</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">{r.price}</p>
                <ul className="mt-4 space-y-1">
                  {r.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t py-8">
      <div className="container flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/sanal-ofis-sakarya" className="text-primary hover:underline">Sanal Ofis →</Link>
        <Link to="/coworking-sakarya" className="text-primary hover:underline">Coworking →</Link>
        <Link to="/hazir-ofis" className="text-primary hover:underline">Hazır Ofis →</Link>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection title="Toplantı Odası Rezervasyonu" subtitle="Profesyonel toplantılarınız için hemen yer ayırtın." />
  </Layout>
  );
};

export default ToplantiOdasiSakarya;

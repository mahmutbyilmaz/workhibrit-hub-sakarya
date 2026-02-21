import { Link } from "react-router-dom";
import { Building2, Users, Presentation, DoorOpen, Star, CheckCircle, Shield, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { business, services, testimonials, homepageFAQs } from "@/data/business";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Presentation: <Presentation className="h-8 w-8" />,
  DoorOpen: <DoorOpen className="h-8 w-8" />,
};

const Index = () => {
  // Fetch dynamic FAQs assigned to homepage
  const { data: dbFaqs } = useQuery({
    queryKey: ["homepage_faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("question, answer")
        .contains("page_assignments", ["homepage"])
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data?.map((f) => ({ q: f.question, a: f.answer })) ?? [];
    },
  });

  // Use DB FAQs if available, fallback to static
  const displayFaqs = dbFaqs && dbFaqs.length > 0 ? dbFaqs : homepageFAQs;

  return (
    <Layout>
      <SEOHead
        title="Workhibrit | Sakarya Sanal Ofis ve Coworking"
        description="Workhibrit, Sakarya'da sanal ofis, coworking, toplantı odası ve hazır ofis hizmeti sunan lider ofis çözümleri markasıdır."
        keywords="sakarya sanal ofis, sanal ofis sakarya, coworking sakarya, toplantı odası sakarya"
        canonical="https://sakaryasanalofis.com"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold leading-tight lg:text-5xl">
              Sakarya'da Profesyonel<br />
              <span className="text-accent">Ofis Çözümleri</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
              {business.name}, {business.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/sanal-ofis-sakarya">Sanal Ofis Hizmeti</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Ücretsiz Danışmanlık
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(215_80%_60%/0.3),transparent_60%)]" />
      </section>

      {/* Trust bar */}
      <section className="border-b bg-secondary py-6">
        <div className="container flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { icon: <Clock className="h-5 w-5 text-primary" />, label: `${business.stats.years}+ Yıllık Deneyim` },
            { icon: <Users className="h-5 w-5 text-primary" />, label: `${business.stats.customers}+ Mutlu Müşteri` },
            { icon: <Shield className="h-5 w-5 text-primary" />, label: "Güvenli & Yasal" },
            { icon: <CheckCircle className="h-5 w-5 text-primary" />, label: `${business.stats.offices}+ Ofis Çözümü` },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">Hizmetlerimiz</h2>
            <p className="mt-3 text-muted-foreground">İşinize en uygun ofis çözümünü seçin.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.id} to={s.slug}>
                <Card className="group h-full transition-shadow hover:shadow-lg">
                  <CardContent className="flex flex-col items-start p-6">
                    <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary">{iconMap[s.icon]}</div>
                    <h3 className="font-display text-lg font-bold group-hover:text-primary">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                    <p className="mt-4 font-display text-2xl font-bold text-primary">
                      {s.price} <span className="text-sm font-normal text-muted-foreground">{s.period}</span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing table */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold">Fiyat Karşılaştırması</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-display font-bold">Özellik</th>
                  <th className="p-4 font-display font-bold text-center">Sanal Ofis</th>
                  <th className="p-4 font-display font-bold text-center">Coworking</th>
                  <th className="p-4 font-display font-bold text-center">Hazır Ofis</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["İş Adresi", "✓", "✓", "✓"],
                  ["Posta Yönetimi", "✓", "✓", "✓"],
                  ["Çalışma Alanı", "—", "✓", "✓"],
                  ["Özel Ofis", "—", "—", "✓"],
                  ["Toplantı Odası", "Ek ücret", "2 saat/ay", "5 saat/ay"],
                  ["Başlangıç Fiyat", "₺750/ay", "₺1.500/ay", "₺3.500/ay"],
                ].map((row, i) => (
                  <tr key={i} className="border-b">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-4 ${j === 0 ? "font-medium" : "text-center"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold">Müşteri Yorumları</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="mb-3 flex">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">"{t.text}"</p>
                  <div className="mt-4">
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Dynamic from DB */}
      <FAQSection faqs={displayFaqs} />

      {/* Map */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold">Konumumuz</h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-sm">
            <iframe
              src={business.mapsEmbed}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Workhibrit Konum"
            />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">{business.fullAddress}</p>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </Layout>
  );
};

export default Index;

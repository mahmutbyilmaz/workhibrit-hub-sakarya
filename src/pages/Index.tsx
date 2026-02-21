import { Link } from "react-router-dom";
import { Building2, Users, Presentation, DoorOpen, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import HeroSlider, { type Slide } from "@/components/HeroSlider";
import { business, services as staticServices, testimonials as staticTestimonials, homepageFAQs } from "@/data/business";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessData } from "@/hooks/useBusinessData";

const toEmbedUrl = (url: string): string => {
  if (!url) return "";
  // Already embed format
  if (url.includes("/maps/embed")) return url;
  // Extract coordinates from standard Google Maps link
  const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str`;
  }
  // Extract place name for search query
  const placeMatch = url.match(/\/place\/([^/@]+)/);
  if (placeMatch) {
    const query = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(query)}`;
  }
  return url;
};

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-8 w-8" />,
  Users: <Users className="h-8 w-8" />,
  Presentation: <Presentation className="h-8 w-8" />,
  DoorOpen: <DoorOpen className="h-8 w-8" />,
};

type Service = { id: string; title: string; slug: string; description: string; icon: string; price: string; period: string };
type Testimonial = { name: string; company: string; text: string; rating: number };

const Index = () => {
  const { whatsapp, mapsEmbed } = useBusinessData();
  // Fetch all homepage content blocks
  const { data: contentBlocks } = useQuery({
    queryKey: ["homepage_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("block_type, content")
        .eq("page_slug", "homepage")
        .in("block_type", ["services", "testimonials", "pricing", "hero_slider"])
        .order("sort_order");
      if (error) throw error;
      const map: Record<string, any> = {};
      data?.forEach((b) => (map[b.block_type] = b.content));
      return map;
    },
    staleTime: 1000 * 60 * 2,
  });

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

  const services: Service[] = (contentBlocks?.services && Array.isArray(contentBlocks.services))
    ? contentBlocks.services : staticServices;
  const testimonials: Testimonial[] = (contentBlocks?.testimonials && Array.isArray(contentBlocks.testimonials))
    ? contentBlocks.testimonials : staticTestimonials;
  const pricingRows: string[][] = (contentBlocks?.pricing && Array.isArray(contentBlocks.pricing))
    ? contentBlocks.pricing : [];
  const sliderSlides: Slide[] = (contentBlocks?.hero_slider && Array.isArray(contentBlocks.hero_slider))
    ? contentBlocks.hero_slider : [];
  const displayFaqs = dbFaqs && dbFaqs.length > 0 ? dbFaqs : homepageFAQs;

  return (
    <Layout>
      <SEOHead
        title="Sakarya Sanal Ofis | Sanal Ofis ve Coworking"
        description="Sakarya Sanal Ofis, Sakarya'da sanal ofis, coworking, toplantı odası ve hazır ofis hizmeti sunan lider ofis çözümleri markasıdır."
        keywords="sakarya sanal ofis, sanal ofis sakarya, coworking sakarya, toplantı odası sakarya"
        canonical="https://sakaryasanalofis.com"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-accent py-20 text-accent-foreground lg:py-28">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-extrabold leading-tight lg:text-5xl">
              Sakarya'da Profesyonel<br />
              <span className="text-primary">Ofis Çözümleri</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
              {business.name}, {business.tagline}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/sanal-ofis-sakarya">Sanal Ofis Hizmeti</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10" asChild>
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                  Ücretsiz Danışmanlık
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38_92%_50%/0.15),transparent_60%)]" />
      </section>

      {/* Hero Slider */}
      {sliderSlides.length > 0 && <HeroSlider slides={sliderSlides} />}

      {/* Trust Statement */}
      <section className="border-b bg-accent py-5">
        <div className="container flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <p className="font-display text-sm font-bold tracking-wide text-accent-foreground sm:text-base">
            Sakarya'nın Güvenilir Ofis Çözüm Ortağı
          </p>
          <Button size="sm" variant="secondary" asChild>
            <Link to="/hakkimizda">Bizi Tanıyın →</Link>
          </Button>
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
      {pricingRows.length > 0 && (
        <section className="bg-secondary py-16">
          <div className="container">
            <h2 className="mb-8 text-center font-display text-3xl font-bold">Fiyat Karşılaştırması</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    {pricingRows[0]?.map((h, j) => (
                      <th key={j} className={`p-4 font-display font-bold ${j > 0 ? "text-center" : ""}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.slice(1).map((row, i) => (
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
      )}

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
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
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

      {/* FAQ */}
      <FAQSection faqs={displayFaqs} />

      {/* Map */}
      <section className="bg-secondary py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold">Konumumuz</h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border shadow-sm">
            <iframe
              src={toEmbedUrl(mapsEmbed)}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sakarya Sanal Ofis Konum"
            />
          </div>
          
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </Layout>
  );
};

export default Index;

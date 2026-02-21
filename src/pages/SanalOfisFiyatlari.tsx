import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessData } from "@/hooks/useBusinessData";
import { supabase } from "@/integrations/supabase/client";

const defaultPlans = [
  { name: "Başlangıç", price: "₺750", period: "/ay", features: ["Prestijli iş adresi", "Posta teslim alma", "Şirket kuruluş desteği", "Aylık sözleşme"], popular: false },
  { name: "Profesyonel", price: "₺1.250", period: "/ay", features: ["Prestijli iş adresi", "Posta & kargo yönetimi", "Telefon yönlendirme", "2 saat toplantı odası/ay", "Şirket kuruluş desteği"], popular: true },
  { name: "Premium", price: "₺1.750", period: "/ay", features: ["Prestijli iş adresi", "Posta & kargo yönetimi", "Telefon yönlendirme", "5 saat toplantı odası/ay", "Coworking erişimi (5 gün/ay)", "Öncelikli destek"], popular: false },
];

const faqs = [
  { q: "Sanal ofis fiyatları ne kadar?", a: "Sanal ofis hizmetimiz aylık ₺750'den başlamaktadır. İhtiyacınıza göre farklı paket seçeneklerimiz mevcuttur." },
  { q: "Sözleşme süresi ne kadar?", a: "Minimum 1 aylık sözleşme ile hizmet alabilirsiniz. Uzun dönem sözleşmelerde indirim uygulanmaktadır." },
  { q: "Fiyatlara KDV dahil mi?", a: "Belirtilen fiyatlar KDV hariçtir. Fatura kesilirken KDV eklenmektedir." },
];

const SanalOfisFiyatlari = () => {
  const { whatsapp } = useBusinessData();

  const { data: dbPlans } = useQuery({
    queryKey: ["pricing_plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("content")
        .eq("page_slug", "sanal-ofis-fiyatlari")
        .eq("block_type", "pricing_plans")
        .single();
      if (error || !data) return null;
      return data.content as unknown as typeof defaultPlans;
    },
  });

  const plans = Array.isArray(dbPlans) && dbPlans.length > 0 ? dbPlans : defaultPlans;

  return (
  <Layout>
    <SEOHead
      title="Sanal Ofis Fiyatları 2025 | Sakarya Sanal Ofis"
      description="Sakarya sanal ofis fiyatları 2025. Aylık ₺750'den başlayan fiyatlarla profesyonel iş adresi. Sakarya Sanal Ofis paketlerini karşılaştırın."
      keywords="sanal ofis fiyat, sanal ofis sakarya fiyat, sanal ofis fiyatları 2025"
      canonical="https://sakaryasanalofis.com/sanal-ofis-fiyatlari"
    />

    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h1 className="font-display text-4xl font-extrabold">Sanal Ofis Fiyatları</h1>
        <p className="mt-4 text-lg text-primary-foreground/80">İhtiyacınıza uygun sanal ofis paketini seçin.</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <Card key={i} className={`relative ${plan.popular ? "border-2 border-primary shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  En Popüler
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                <p className="mt-2 font-display text-4xl font-extrabold text-primary">
                  {plan.price}<span className="text-base font-normal text-muted-foreground">{plan.period}</span>
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <a href={`https://wa.me/${whatsapp}?text=Merhaba, ${plan.name} paketi hakkında bilgi almak istiyorum.`} target="_blank" rel="noopener noreferrer">
                    Hemen Başvurun
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="border-t py-8">
      <div className="container flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/sanal-ofis-sakarya" className="text-primary hover:underline">Sanal Ofis Detayları →</Link>
        <Link to="/coworking-sakarya" className="text-primary hover:underline">Coworking Fiyatları →</Link>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection />
  </Layout>
  );
};

export default SanalOfisFiyatlari;

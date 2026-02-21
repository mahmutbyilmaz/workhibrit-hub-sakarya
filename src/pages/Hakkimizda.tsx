import { Target, Eye, Heart, CheckCircle, Star, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import CTASection from "@/components/CTASection";
import { business } from "@/data/business";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ReactNode> = {
  Target: <Target className="h-8 w-8" />,
  Eye: <Eye className="h-8 w-8" />,
  Heart: <Heart className="h-8 w-8" />,
  CheckCircle: <CheckCircle className="h-8 w-8" />,
  Star: <Star className="h-8 w-8" />,
  Shield: <Shield className="h-8 w-8" />,
};

const Hakkimizda = () => {
  const { data: blocks } = useQuery({
    queryKey: ["about_content"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", "hakkimizda")
        .order("sort_order");
      return (data as unknown as Array<{ block_type: string; content: any }>) ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const get = (type: string) => blocks?.find((b) => b.block_type === type)?.content;

  const hero = get("hero") || { title: "Hakkımızda", subtitle: `${business.name} — ${business.tagline}` };
  const story = get("story") || {
    title: "Hikayemiz",
    paragraphs: [
      `Workhibrit, Sakarya'da girişimcilere ve işletmelere modern ofis çözümleri sunmak amacıyla kurulmuştur. ${business.stats.years} yılı aşkın deneyimimizle, ${business.stats.customers}'den fazla müşteriye hizmet verdik.`,
      "Sakarya'nın iş merkezi Adapazarı'nda konumlanan ofislerimiz, modern altyapı ve profesyonel hizmet anlayışıyla bölgenin lider ofis çözümleri markası olmayı hedeflemektedir.",
    ],
  };
  const values = get("values") || [
    { icon: "Target", title: "Misyonumuz", desc: "İşletmelere esnek, uygun maliyetli ve profesyonel ofis çözümleri sunarak büyümelerine katkıda bulunmak." },
    { icon: "Eye", title: "Vizyonumuz", desc: "Sakarya ve çevresinde ofis çözümlerinde referans marka olmak." },
    { icon: "Heart", title: "Değerlerimiz", desc: "Güvenilirlik, müşteri memnuniyeti, yenilikçilik ve sürdürülebilir hizmet anlayışı." },
  ];
  const stats = get("stats") || [
    { value: `${business.stats.years}+`, label: "Yıllık Deneyim" },
    { value: `${business.stats.customers}+`, label: "Mutlu Müşteri" },
    { value: `${business.stats.offices}+`, label: "Ofis Çözümü" },
  ];

  return (
    <Layout>
      <SEOHead
        title="Hakkımızda | Sakarya Sanal Ofis"
        description="Sakarya Sanal Ofis hakkında. Sakarya'da sanal ofis, coworking ve ofis çözümleri sunan güvenilir yerel marka."
        keywords="sakarya sanal ofis hakkında, sakarya ofis çözümleri"
        canonical="https://sakaryasanalofis.com/hakkimizda"
      />

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-extrabold">{hero.title}</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">{hero.subtitle}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-4xl">
          <h2 className="font-display text-3xl font-bold">{story.title}</h2>
          {(story.paragraphs as string[]).map((p: string, i: number) => (
            <p key={i} className="mt-4 text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {(values as Array<{ icon: string; title: string; desc: string }>).map((item, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {iconMap[item.icon] || <Target className="h-8 w-8" />}
                </div>
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            {(stats as Array<{ value: string; label: string }>).map((s, i) => (
              <div key={i}>
                <p className="font-display text-4xl font-extrabold text-primary">{s.value}</p>
                <p className="mt-1 text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Hakkimizda;

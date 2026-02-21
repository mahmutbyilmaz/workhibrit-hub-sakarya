import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { supabase } from "@/integrations/supabase/client";

const SSS = () => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["faqs_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Group by category
  const categories = faqs
    ? Object.entries(
        faqs.reduce<Record<string, Array<{ q: string; a: string }>>>((acc, faq) => {
          const cat = faq.category || "Genel";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push({ q: faq.question, a: faq.answer });
          return acc;
        }, {})
      )
    : [];

  const allFaqs = faqs?.map((f) => ({ q: f.question, a: f.answer })) ?? [];

  return (
    <Layout>
      <SEOHead
        title="Sıkça Sorulan Sorular | Workhibrit Sakarya"
        description="Sanal ofis, coworking ve ofis çözümleri hakkında sıkça sorulan sorular. Workhibrit SSS sayfası."
        keywords="sanal ofis sss, coworking sss, workhibrit sss"
        canonical="https://sakaryasanalofis.com/sikca-sorulan-sorular"
      />

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-extrabold">Sıkça Sorulan Sorular</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">Merak ettiğiniz tüm soruların cevapları burada.</p>
        </div>
      </section>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">Yükleniyor...</div>
      ) : !categories.length ? (
        <div className="py-16 text-center text-muted-foreground">Henüz soru eklenmemiş.</div>
      ) : (
        <>
          {categories.map(([title, items], i) => (
            <FAQSection key={title} title={title} faqs={items} showSchema={i === 0} />
          ))}
          {allFaqs.length > 0 && <FAQSection faqs={allFaqs} showSchema={true} title="" />}
        </>
      )}

      <CTASection title="Başka Sorunuz mu Var?" subtitle="Bize WhatsApp veya telefonla ulaşabilirsiniz." />
    </Layout>
  );
};

export default SSS;

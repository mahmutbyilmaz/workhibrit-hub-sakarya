import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";

const categories = [
  {
    title: "Sanal Ofis",
    faqs: [
      { q: "Sanal ofis nedir?", a: "Sanal ofis, fiziksel bir mekan kiralamadan profesyonel bir iş adresi ve hizmet almanızı sağlayan bir çözümdür." },
      { q: "Sanal ofis yasal mı?", a: "Evet, Türkiye'de sanal ofis tamamen yasal bir uygulamadır." },
      { q: "Sanal ofis ile şirket kurulabilir mi?", a: "Evet, sanal ofis adresi ile her türlü şirket kurulabilir." },
      { q: "Posta ve kargo hizmeti dahil mi?", a: "Evet, gelen postalarınız sizin adınıza teslim alınır." },
    ],
  },
  {
    title: "Coworking",
    faqs: [
      { q: "Coworking nedir?", a: "Coworking, farklı profesyonellerin ortak bir alanı paylaştığı modern çalışma modelidir." },
      { q: "Günlük kullanım mümkün mü?", a: "Evet, günlük geçiş kartı ile tek seferlik kullanım yapabilirsiniz." },
      { q: "İnternet hızı ne kadar?", a: "Fiber altyapılı yüksek hızlı internet sunuyoruz." },
    ],
  },
  {
    title: "Fiyatlandırma",
    faqs: [
      { q: "Sanal ofis fiyatları ne kadar?", a: "Sanal ofis aylık ₺750'den başlamaktadır." },
      { q: "Fiyatlara KDV dahil mi?", a: "Belirtilen fiyatlar KDV hariçtir." },
      { q: "Ödeme yöntemleri nelerdir?", a: "Havale, EFT ve kredi kartı ile ödeme yapabilirsiniz." },
    ],
  },
  {
    title: "Genel",
    faqs: [
      { q: "Workhibrit nerede?", a: `${" "}Sakarya Adapazarı'nda merkezi konumda bulunuyoruz.` },
      { q: "Çalışma saatleri nedir?", a: "Hafta içi 09:00-18:00, Cumartesi 09:00-14:00." },
      { q: "Ücretsiz tur yapılabiliyor mu?", a: "Evet, ofislerimizi görmek için ücretsiz tur randevusu alabilirsiniz." },
    ],
  },
];

const allFaqs = categories.flatMap((c) => c.faqs);

const SSS = () => (
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

    {categories.map((cat, i) => (
      <FAQSection key={i} title={cat.title} faqs={cat.faqs} showSchema={i === 0} />
    ))}

    {/* Full schema for all FAQs */}
    <FAQSection faqs={allFaqs} showSchema={true} title="" />

    <CTASection title="Başka Sorunuz mu Var?" subtitle="Bize WhatsApp veya telefonla ulaşabilirsiniz." />
  </Layout>
);

export default SSS;

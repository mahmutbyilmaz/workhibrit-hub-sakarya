import { Link } from "react-router-dom";
import { CheckCircle, Building2, Mail, FileText, Phone as PhoneIcon } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { business } from "@/data/business";
import { useBusinessData } from "@/hooks/useBusinessData";

const faqs = [
  { q: "Sanal ofis nedir?", a: "Sanal ofis, fiziksel bir mekan kiralamadan profesyonel bir iş adresi ve sekreterlik hizmeti almanızı sağlar." },
  { q: "Sanal ofis ile şirket kurulabilir mi?", a: "Evet, sanal ofis adresi ile her türlü şirket kurulabilir ve vergi kaydı yapılabilir." },
  { q: "Posta ve kargo hizmeti dahil mi?", a: "Evet, gelen posta ve kargolarınız sizin adınıza teslim alınır ve yönlendirilir." },
  { q: "Sanal ofis yasal mı?", a: "Evet, Türkiye'de sanal ofis tamamen yasal ve Ticaret Bakanlığı tarafından tanınmaktadır." },
];

const benefits = [
  "Prestijli Sakarya iş adresi",
  "Posta ve kargo yönetimi",
  "Şirket kuruluşu desteği",
  "Vergi kaydı için geçerli adres",
  "Telefon yönlendirme hizmeti",
  "Toplantı odası kullanım imkanı",
  "Aylık esnek sözleşme",
  "7/24 destek hattı",
];

const SanalOfisSakarya = () => {
  const { whatsapp } = useBusinessData();

  return (
  <Layout>
    <SEOHead
      title="Sanal Ofis Sakarya | Sakarya Sanal Ofis"
      description="Sakarya'da sanal ofis hizmeti. Prestijli iş adresi, posta yönetimi ve şirket kuruluş desteği. Sakarya Sanal Ofis ile profesyonel sanal ofis çözümleri."
      keywords="sanal ofis sakarya, sakarya sanal ofis, sanal ofis hizmeti sakarya"
      canonical="https://sakaryasanalofis.com/sanal-ofis-sakarya"
    />

    {/* Hero */}
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold">Sakarya Sanal Ofis Hizmeti</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            {business.name} ile Sakarya'da profesyonel bir iş adresine sahip olun. Fiziksel ofis maliyeti olmadan prestijli bir adres kullanın.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">Teklif Alın</a>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/sanal-ofis-fiyatlari">Fiyatları İnceleyin</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>

    {/* What is */}
    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold">Sanal Ofis Nedir?</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Sanal ofis, işletmenize fiziksel bir mekan kiralamadan profesyonel bir iş adresi, posta yönetimi ve iletişim hizmetleri sunan modern bir ofis çözümüdür. Özellikle yeni kurulan şirketler, freelancerlar ve uzaktan çalışan ekipler için ideal bir çözümdür.
        </p>
      </div>
    </section>

    {/* Benefits */}
    <section className="bg-secondary py-16">
      <div className="container">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Sanal Ofis Avantajları</h2>
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

    {/* How it works */}
    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="mb-8 text-center font-display text-3xl font-bold">Nasıl Çalışır?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: <FileText className="h-6 w-6" />, title: "Başvuru", desc: "Online veya telefonla başvurunuzu yapın." },
            { icon: <Building2 className="h-6 w-6" />, title: "Adres Teslim", desc: "İş adresiniz hemen aktif edilir." },
            { icon: <Mail className="h-6 w-6" />, title: "Hizmet Başlasın", desc: "Posta, kargo ve iletişim hizmetlerini kullanmaya başlayın." },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">{s.icon}</div>
              <h3 className="font-display font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Internal links */}
    <section className="border-t py-8">
      <div className="container flex flex-wrap justify-center gap-4 text-sm">
        <Link to="/sanal-ofis-fiyatlari" className="text-primary hover:underline">Sanal Ofis Fiyatları →</Link>
        <Link to="/coworking-sakarya" className="text-primary hover:underline">Coworking Sakarya →</Link>
        <Link to="/toplanti-odasi-sakarya" className="text-primary hover:underline">Toplantı Odası →</Link>
        <Link to="/hazir-ofis" className="text-primary hover:underline">Hazır Ofis →</Link>
      </div>
    </section>

    <FAQSection faqs={faqs} />
    <CTASection title="Sanal Ofis İçin Hemen Başvurun" subtitle="Sakarya'da prestijli bir iş adresine sahip olmak için bize ulaşın." />
  </Layout>
  );
};

export default SanalOfisSakarya;

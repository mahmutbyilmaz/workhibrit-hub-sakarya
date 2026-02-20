import { CheckCircle, Target, Eye, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import CTASection from "@/components/CTASection";
import { business } from "@/data/business";

const Hakkimizda = () => (
  <Layout>
    <SEOHead
      title="Hakkımızda | Workhibrit Sakarya"
      description="Workhibrit hakkında. Sakarya'da sanal ofis, coworking ve ofis çözümleri sunan güvenilir yerel marka."
      keywords="workhibrit hakkında, sakarya ofis çözümleri"
      canonical="https://sakaryasanalofis.com/hakkimizda"
    />

    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h1 className="font-display text-4xl font-extrabold">Hakkımızda</h1>
        <p className="mt-4 text-lg text-primary-foreground/80">{business.name} — {business.tagline}</p>
      </div>
    </section>

    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="font-display text-3xl font-bold">Hikayemiz</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Workhibrit, Sakarya'da girişimcilere ve işletmelere modern ofis çözümleri sunmak amacıyla kurulmuştur. {business.stats.years} yılı aşkın deneyimimizle, {business.stats.customers}'den fazla müşteriye hizmet verdik. Amacımız, esnek ve uygun maliyetli ofis çözümleriyle işletmelerin büyümesine destek olmaktır.
        </p>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Sakarya'nın iş merkezi Adapazarı'nda konumlanan ofislerimiz, modern altyapı ve profesyonel hizmet anlayışıyla bölgenin lider ofis çözümleri markası olmayı hedeflemektedir.
        </p>
      </div>
    </section>

    <section className="bg-secondary py-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: <Target className="h-8 w-8" />, title: "Misyonumuz", desc: "İşletmelere esnek, uygun maliyetli ve profesyonel ofis çözümleri sunarak büyümelerine katkıda bulunmak." },
            { icon: <Eye className="h-8 w-8" />, title: "Vizyonumuz", desc: "Sakarya ve çevresinde ofis çözümlerinde referans marka olmak." },
            { icon: <Heart className="h-8 w-8" />, title: "Değerlerimiz", desc: "Güvenilirlik, müşteri memnuniyeti, yenilikçilik ve sürdürülebilir hizmet anlayışı." },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">{item.icon}</div>
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
          {[
            { value: `${business.stats.years}+`, label: "Yıllık Deneyim" },
            { value: `${business.stats.customers}+`, label: "Mutlu Müşteri" },
            { value: `${business.stats.offices}+`, label: "Ofis Çözümü" },
          ].map((s, i) => (
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

export default Hakkimizda;

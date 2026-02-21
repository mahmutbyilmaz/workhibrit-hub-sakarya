import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { business } from "@/data/business";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Iletisim = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["seo_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_settings").select("key, value");
      const map: Record<string, string> = {};
      data?.forEach((row) => { map[row.key] = row.value; });
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });

  const phone = settings?.phone || business.phone;
  const email = settings?.email || business.email;
  const address = [
    settings?.address_street || business.address.street,
    settings?.address_district || business.address.district,
    settings?.address_city || business.address.city,
    settings?.address_zip || business.address.zip,
  ].filter(Boolean).join(", ");
  const weekdays = settings?.working_hours_weekdays || business.workingHours.weekdays;
  const saturday = settings?.working_hours_saturday || business.workingHours.saturday;
  const sunday = settings?.working_hours_sunday || business.workingHours.sunday;
  const mapsEmbed = settings?.maps_embed || business.mapsEmbed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Hata", description: "Mesaj gönderilemedi, lütfen tekrar deneyin.", variant: "destructive" });
    } else {
      toast({ title: "Mesajınız alındı!", description: "En kısa sürede size dönüş yapacağız." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <Layout>
      <SEOHead
        title="İletişim | Workhibrit Sakarya"
        description="Workhibrit ile iletişime geçin. Sakarya'da sanal ofis, coworking ve ofis çözümleri için bize ulaşın."
        keywords="workhibrit iletişim, sakarya ofis iletişim"
        canonical="https://sakaryasanalofis.com/iletisim"
      />

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-extrabold">İletişim</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">Size nasıl yardımcı olabiliriz?</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="font-display text-2xl font-bold">Bize Yazın</h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Gönderiliyor..." : "Gönder"}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="font-display text-2xl font-bold">İletişim Bilgileri</h2>
              <div className="mt-6 space-y-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">Adres</h3>
                    <p className="text-sm text-muted-foreground">{address}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">Telefon</h3>
                    <a href={`tel:${phone}`} className="text-sm text-muted-foreground hover:text-primary">{phone}</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">E-posta</h3>
                    <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary">{email}</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">Çalışma Saatleri</h3>
                    <p className="text-sm text-muted-foreground">Hafta içi: {weekdays}</p>
                    <p className="text-sm text-muted-foreground">Cumartesi: {saturday}</p>
                    <p className="text-sm text-muted-foreground">Pazar: {sunday}</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 overflow-hidden rounded-lg border">
                <iframe
                  src={mapsEmbed}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Workhibrit Konum"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Iletisim;

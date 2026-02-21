import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { business } from "@/data/business";
import { Phone, Mail, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, string> = {};
      data?.forEach((s) => (map[s.key] = s.value));
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });

  const phone = settings?.footer_phone || business.phone;
  const email = settings?.footer_email || business.email;
  const address = settings?.footer_address || business.fullAddress;

  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-display text-xl font-extrabold text-primary">
              Work<span className="text-accent-foreground">hibrit</span>
            </span>
            <p className="mt-3 text-sm opacity-70">{business.tagline}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 font-display text-sm font-bold">Hizmetler</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/sanal-ofis-sakarya" className="hover:opacity-100">Sanal Ofis</Link></li>
              <li><Link to="/coworking-sakarya" className="hover:opacity-100">Coworking</Link></li>
              <li><Link to="/toplanti-odasi-sakarya" className="hover:opacity-100">Toplantı Odası</Link></li>
              <li><Link to="/hazir-ofis" className="hover:opacity-100">Hazır Ofis</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="mb-3 font-display text-sm font-bold">Kurumsal</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/hakkimizda" className="hover:opacity-100">Hakkımızda</Link></li>
              <li><Link to="/blog" className="hover:opacity-100">Blog</Link></li>
              <li><Link to="/sikca-sorulan-sorular" className="hover:opacity-100">SSS</Link></li>
              <li><Link to="/iletisim" className="hover:opacity-100">İletişim</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-display text-sm font-bold">İletişim</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{address}</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${phone}`} className="hover:opacity-100">{phone}</a></li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${email}`} className="hover:opacity-100">{email}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-accent-foreground/20 pt-6 text-center text-xs opacity-60">
          © {new Date().getFullYear()} {business.name}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

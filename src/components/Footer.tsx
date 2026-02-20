import { Link } from "react-router-dom";
import { business } from "@/data/business";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-secondary">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <span className="font-display text-xl font-extrabold text-primary">
            Work<span className="text-accent">hibrit</span>
          </span>
          <p className="mt-3 text-sm text-muted-foreground">{business.tagline}</p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold">Hizmetler</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sanal-ofis-sakarya" className="hover:text-foreground">Sanal Ofis</Link></li>
            <li><Link to="/coworking-sakarya" className="hover:text-foreground">Coworking</Link></li>
            <li><Link to="/toplanti-odasi-sakarya" className="hover:text-foreground">Toplantı Odası</Link></li>
            <li><Link to="/hazir-ofis" className="hover:text-foreground">Hazır Ofis</Link></li>
          </ul>
        </div>

        {/* Kurumsal */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold">Kurumsal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/hakkimizda" className="hover:text-foreground">Hakkımızda</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/sikca-sorulan-sorular" className="hover:text-foreground">SSS</Link></li>
            <li><Link to="/iletisim" className="hover:text-foreground">İletişim</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3 font-display text-sm font-bold">İletişim</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{business.fullAddress}</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><a href={`tel:${business.phone}`} className="hover:text-foreground">{business.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /><a href={`mailto:${business.email}`} className="hover:text-foreground">{business.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {business.name}. Tüm hakları saklıdır.
      </div>
    </div>
  </footer>
);

export default Footer;

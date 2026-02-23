import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";
import { useBusinessData } from "@/hooks/useBusinessData";

const Footer = () => {
  const { phone, email, address, instagram, linkedin, twitter, name } = useBusinessData();

  const socialLinks = [
    { url: instagram, icon: Instagram, label: "Instagram" },
    { url: linkedin, icon: Linkedin, label: "LinkedIn" },
    { url: twitter, icon: Twitter, label: "Twitter" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t bg-accent text-accent-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="font-display text-xl font-extrabold text-primary">
              Sakarya <span className="text-accent-foreground">Sanal Ofis</span>
            </span>
            <p className="mt-3 text-sm opacity-70">Sakarya'da sanal ofis ve coworking hizmeti sunan yerel bir ofis çözümleri markasıdır.</p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="rounded-md p-2 opacity-70 transition-opacity hover:opacity-100"
                  >
                    <s.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
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
          © {new Date().getFullYear()} {name}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

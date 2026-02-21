import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusinessData } from "@/hooks/useBusinessData";

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Sanal Ofis", href: "/sanal-ofis-sakarya" },
  { label: "Fiyatlar", href: "/sanal-ofis-fiyatlari" },
  { label: "Coworking", href: "/coworking-sakarya" },
  { label: "Toplantı Odası", href: "/toplanti-odasi-sakarya" },
  { label: "Blog", href: "/blog" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Yönetim", href: "/admin/login" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { phone, whatsapp, logoUrl } = useBusinessData();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logoUrl} alt="Sakarya Sanal Ofis" className="h-10 w-auto max-w-[180px] object-contain" />
          ) : (
            <span className="font-display text-2xl font-extrabold tracking-tight text-primary">
              Sakarya <span className="text-accent">Sanal Ofis</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={`tel:${phone}`} className="flex items-center gap-1 text-sm font-medium text-primary">
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <Button asChild size="sm">
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </Button>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menü">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t bg-background p-4 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <a href={`tel:${phone}`} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary">
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useBusinessData } from "@/hooks/useBusinessData";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

const CTASection = ({
  title = "Hemen Başlayın",
  subtitle = "Sakarya'da profesyonel ofis çözümleri için bizimle iletişime geçin.",
}: CTASectionProps) => {
  const { whatsapp, phone } = useBusinessData();

  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container text-center">
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">{subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp ile Yazın
            </a>
          </Button>
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <a href={`tel:${phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Hemen Arayın
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

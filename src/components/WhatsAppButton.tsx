import { MessageCircle } from "lucide-react";
import { business } from "@/data/business";

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${business.whatsapp}?text=Merhaba, bilgi almak istiyorum.`}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent shadow-lg transition-transform hover:scale-110"
    aria-label="WhatsApp ile iletişime geçin"
  >
    <MessageCircle className="h-7 w-7 text-accent-foreground" />
  </a>
);

export default WhatsAppButton;

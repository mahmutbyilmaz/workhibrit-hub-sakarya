import { MessageCircle } from "lucide-react";
import { useBusinessData } from "@/hooks/useBusinessData";

const WhatsAppButton = () => {
  const { whatsapp } = useBusinessData();

  return (
    <a
      href={`https://wa.me/${whatsapp}?text=Merhaba, bilgi almak istiyorum.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-transform hover:scale-110 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
      style={{ backgroundColor: '#25D366' }}
      aria-label="WhatsApp ile iletişime geçin"
    >
      <MessageCircle className="h-8 w-8 text-white" />
    </a>
  );
};

export default WhatsAppButton;

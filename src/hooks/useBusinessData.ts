import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { business } from "@/data/business";

export const useBusinessData = () => {
  const { data: settings } = useQuery({
    queryKey: ["seo_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("seo_settings").select("key, value");
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.key] = row.value;
      });
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });

  // WhatsApp number: strip non-digits for wa.me links
  const rawWhatsapp = settings?.whatsapp || business.whatsapp;
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  return {
    phone: settings?.phone || business.phone,
    whatsapp,
    email: settings?.email || business.email,
    name: settings?.business_name || business.name,
  };
};

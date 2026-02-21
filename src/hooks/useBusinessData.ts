import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { business } from "@/data/business";

export const useBusinessData = () => {
  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.key] = row.value;
      });
      return map;
    },
    staleTime: 1000 * 60 * 5,
  });

  const rawWhatsapp = settings?.footer_whatsapp || business.whatsapp;
  const whatsapp = rawWhatsapp.replace(/\D/g, "");

  return {
    phone: settings?.footer_phone || business.phone,
    whatsapp,
    email: settings?.footer_email || business.email,
    name: settings?.business_name || business.name,
    address: settings?.footer_address || business.fullAddress,
    instagram: settings?.footer_instagram || business.social?.instagram || "",
    linkedin: settings?.footer_linkedin || business.social?.linkedin || "",
    twitter: settings?.footer_twitter || "",
    logoUrl: settings?.header_logo_url || "",
  };
};

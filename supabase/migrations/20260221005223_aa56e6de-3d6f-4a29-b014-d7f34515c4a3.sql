
-- Create site_settings table for footer and other editable site info
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed default footer values
INSERT INTO public.site_settings (key, value) VALUES
  ('footer_phone', '+90 264 123 45 67'),
  ('footer_email', 'info@sakaryasanalofis.com'),
  ('footer_address', 'Sakarya Ticaret Merkezi, Kat 3, Adapazarı, Sakarya 54100'),
  ('footer_whatsapp', '902641234567'),
  ('footer_instagram', 'https://instagram.com/workhibrit'),
  ('footer_linkedin', 'https://linkedin.com/company/workhibrit');

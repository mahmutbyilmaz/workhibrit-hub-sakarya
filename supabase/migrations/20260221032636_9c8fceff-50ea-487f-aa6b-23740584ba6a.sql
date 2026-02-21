
-- Update page_content constraint to include pricing_plans
ALTER TABLE public.page_content DROP CONSTRAINT page_content_block_type_check;
ALTER TABLE public.page_content ADD CONSTRAINT page_content_block_type_check 
  CHECK (block_type = ANY (ARRAY['text','image','pricing_table','faq_block','cta_button','services','testimonials','pricing','hero','story','values','stats','hero_slider','pricing_plans']));

-- Create contract_templates table
CREATE TABLE public.contract_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can read templates" ON public.contract_templates
  FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can manage templates" ON public.contract_templates
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_contract_templates_updated_at
  BEFORE UPDATE ON public.contract_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create contracts table
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES public.contract_templates(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  company_name text,
  phone text,
  email text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  contract_duration integer NOT NULL,
  monthly_price decimal(10,2) NOT NULL,
  address text,
  contract_date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  rendered_content text,
  status text NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can read contracts" ON public.contracts
  FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can insert contracts" ON public.contracts
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update contracts" ON public.contracts
  FOR UPDATE USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can delete contracts" ON public.contracts
  FOR DELETE USING (has_role(auth.uid(), 'admin'));

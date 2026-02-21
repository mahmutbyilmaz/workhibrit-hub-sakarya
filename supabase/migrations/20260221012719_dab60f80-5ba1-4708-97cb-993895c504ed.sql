
ALTER TABLE public.page_content DROP CONSTRAINT page_content_block_type_check;
ALTER TABLE public.page_content ADD CONSTRAINT page_content_block_type_check 
  CHECK (block_type = ANY (ARRAY['text','image','pricing_table','faq_block','cta_button','services','testimonials','pricing','hero','story','values','stats']));

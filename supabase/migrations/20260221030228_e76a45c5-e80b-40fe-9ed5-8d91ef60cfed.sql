
-- Add scheduled_at to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Add status and scheduled_at to faqs
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';
ALTER TABLE public.faqs ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Update RLS for blog_posts: allow scheduled posts that have passed their scheduled time to be visible
DROP POLICY IF EXISTS "Anyone can read published posts" ON public.blog_posts;
CREATE POLICY "Anyone can read published posts" ON public.blog_posts
FOR SELECT USING (
  (status = 'published'::text)
  OR (status = 'scheduled'::text AND scheduled_at <= now())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
);

-- Update RLS for faqs: only show published or past-scheduled faqs publicly
DROP POLICY IF EXISTS "Anyone can read faqs" ON public.faqs;
CREATE POLICY "Anyone can read faqs" ON public.faqs
FOR SELECT USING (
  (status = 'published'::text)
  OR (status = 'scheduled'::text AND scheduled_at <= now())
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'editor'::app_role)
);

ALTER TABLE blog_posts DROP CONSTRAINT blog_posts_status_check;
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check
  CHECK (status = ANY (ARRAY['draft', 'published', 'scheduled']));
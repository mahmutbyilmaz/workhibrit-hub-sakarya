import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { ArticleSchema } from "@/components/JsonLd";
import { supabase } from "@/integrations/supabase/client";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug!)
        .or("status.eq.published,and(status.eq.scheduled,scheduled_at.lte.now())")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts } = useQuery({
    queryKey: ["blog_related", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title")
        .eq("status", "published")
        .neq("slug", slug!)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Yazı bulunamadı</h1>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Blog'a dön</Link>
        </div>
      </Layout>
    );
  }

  const faqs = Array.isArray(post.faqs)
    ? (post.faqs as Array<{ q: string; a: string }>)
    : [];

  return (
    <Layout>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ""}
        keywords={post.category || ""}
        canonical={`https://sakaryasanalofis.com/blog/${post.slug}`}
      />
      <ArticleSchema
        title={post.title}
        description={post.meta_description || post.excerpt || ""}
        date={post.created_at}
        slug={post.slug}
      />

      <article>
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container max-w-3xl">
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" />
              Blog'a dön
            </Link>
            {post.category && (
              <span className="mb-3 inline-block rounded bg-primary-foreground/20 px-2 py-1 text-xs font-medium">{post.category}</span>
            )}
            <h1 className="font-display text-3xl font-extrabold lg:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </section>

        {post.featured_image && (
          <div className="container max-w-3xl py-8">
            <img src={post.featured_image} alt={post.title} className="w-full rounded-lg object-cover" />
          </div>
        )}

        <section className="py-12">
          <div
            className="container prose prose-slate max-w-3xl prose-headings:font-display"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </section>

        {faqs.length > 0 && (
          <FAQSection faqs={faqs} title="Bu Yazı Hakkında SSS" />
        )}

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="border-t py-8">
            <div className="container max-w-3xl">
              <h3 className="mb-4 font-display font-bold">İlgili Yazılar</h3>
              <div className="flex flex-wrap gap-4">
                {relatedPosts.map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="text-sm text-primary hover:underline">
                    {p.title} →
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <CTASection />
    </Layout>
  );
};

export default BlogPost;

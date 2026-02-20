import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { ArticleSchema } from "@/components/JsonLd";
import { blogPosts } from "@/data/business";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

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

  return (
    <Layout>
      <SEOHead
        title={post.metaTitle}
        description={post.metaDescription}
        keywords={post.category}
        canonical={`https://sakaryasanalofis.com/blog/${post.slug}`}
      />
      <ArticleSchema title={post.title} description={post.metaDescription} date={post.date} slug={post.slug} />

      <article>
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container max-w-3xl">
            <Link to="/blog" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground">
              <ArrowLeft className="h-4 w-4" />
              Blog'a dön
            </Link>
            <span className="mb-3 inline-block rounded bg-primary-foreground/20 px-2 py-1 text-xs font-medium">{post.category}</span>
            <h1 className="font-display text-3xl font-extrabold lg:text-4xl">{post.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-primary-foreground/70">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div
            className="container prose prose-slate max-w-3xl prose-headings:font-display"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>

        {post.faqs && post.faqs.length > 0 && (
          <FAQSection faqs={post.faqs} title="Bu Yazı Hakkında SSS" />
        )}

        {/* Related posts */}
        <section className="border-t py-8">
          <div className="container max-w-3xl">
            <h3 className="mb-4 font-display font-bold">İlgili Yazılar</h3>
            <div className="flex flex-wrap gap-4">
              {blogPosts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 3)
                .map((p) => (
                  <Link key={p.slug} to={`/blog/${p.slug}`} className="text-sm text-primary hover:underline">
                    {p.title} →
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </article>

      <CTASection />
    </Layout>
  );
};

export default BlogPost;

import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import CTASection from "@/components/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog_posts_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, category, created_at, featured_image, status, scheduled_at")
        .or("status.eq.published,and(status.eq.scheduled,scheduled_at.lte.now())")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <SEOHead
        title="Blog | Sakarya Sanal Ofis - Sanal Ofis ve Coworking Bilgileri"
        description="Sanal ofis, coworking ve ofis çözümleri hakkında güncel bilgiler. Sakarya Sanal Ofis blog yazıları."
        keywords="sanal ofis blog, coworking blog, ofis çözümleri"
        canonical="https://sakaryasanalofis.com/blog"
      />

      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-extrabold">Blog</h1>
          <p className="mt-4 text-lg text-primary-foreground/80">Sanal ofis ve coworking dünyasından güncel bilgiler.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Yükleniyor...</p>
          ) : !posts?.length ? (
            <p className="text-center text-muted-foreground">Henüz blog yazısı yok.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`}>
                  <Card className="group h-full transition-shadow hover:shadow-lg">
                    {post.featured_image && (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="h-48 w-full rounded-t-lg object-cover"
                        loading="lazy"
                      />
                    )}
                    <CardContent className="p-6">
                      {post.category && (
                        <span className="inline-block rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                      )}
                      <h2 className="mt-3 font-display text-lg font-bold group-hover:text-primary">{post.title}</h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Blog;

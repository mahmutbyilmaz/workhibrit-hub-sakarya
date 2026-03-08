import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml; charset=utf-8",
};

const DOMAIN = "https://sakaryasanalofis.com";

const staticPages = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/sanal-ofis-sakarya", priority: "0.9", changefreq: "monthly" },
  { url: "/sanal-ofis-fiyatlari", priority: "0.9", changefreq: "monthly" },
  { url: "/coworking-sakarya", priority: "0.8", changefreq: "monthly" },
  { url: "/toplanti-odasi-sakarya", priority: "0.8", changefreq: "monthly" },
  { url: "/hazir-ofis", priority: "0.8", changefreq: "monthly" },
  { url: "/hakkimizda", priority: "0.6", changefreq: "monthly" },
  { url: "/iletisim", priority: "0.6", changefreq: "monthly" },
  { url: "/sss", priority: "0.7", changefreq: "weekly" },
  { url: "/blog", priority: "0.8", changefreq: "daily" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    const today = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${DOMAIN}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    if (posts) {
      for (const post of posts) {
        const lastmod = post.updated_at ? post.updated_at.split("T")[0] : today;
        xml += `  <url>
    <loc>${DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, { headers: corsHeaders });
  } catch (error) {
    return new Response(`<error>${error.message}</error>`, {
      status: 500,
      headers: corsHeaders,
    });
  }
});

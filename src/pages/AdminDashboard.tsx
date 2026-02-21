import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, HelpCircle, Image } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ posts: 0, faqs: 0, media: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [posts, faqs, media] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("faqs").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        posts: posts.count ?? 0,
        faqs: faqs.count ?? 0,
        media: media.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const stats = [
    { label: "Blog Yazıları", value: counts.posts, icon: FileText },
    { label: "SSS", value: counts.faqs, icon: HelpCircle },
    { label: "Medya Dosyaları", value: counts.media, icon: Image },
  ];

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

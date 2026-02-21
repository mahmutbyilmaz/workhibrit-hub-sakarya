import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  created_at: string;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, status, category, created_at")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const toggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("blog_posts")
      .update({ status: newStatus })
      .eq("id", post.id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: newStatus } : p));
      toast({ title: newStatus === "published" ? "Yazı yayınlandı" : "Yazı taslağa alındı" });
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Yazı silindi" });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Blog Yazıları</h1>
        <Button asChild>
          <Link to="/admin/blog/new"><Plus className="mr-2 h-4 w-4" />Yeni Yazı</Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">Henüz blog yazısı yok.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </Badge>
                    {post.category && <span>{post.category}</span>}
                    <span>{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                    <Switch
                      checked={post.status === "published"}
                      onCheckedChange={() => toggleStatus(post)}
                    />
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/blog/${post.id}`}><Edit className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlog;

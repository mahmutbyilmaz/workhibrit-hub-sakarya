import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import TipTapEditor from "@/components/TipTapEditor";
import AIBlogGenerator from "@/components/AIBlogGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface FAQ {
  q: string;
  a: string;
}

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    meta_title: "",
    meta_description: "",
    keywords: "",
    category: "Sanal Ofis",
    status: "draft",
    featured_image: "",
  });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (data) {
            setForm({
              title: data.title || "",
              slug: data.slug || "",
              excerpt: data.excerpt || "",
              content: data.content || "",
              meta_title: data.meta_title || "",
              meta_description: data.meta_description || "",
              keywords: (data.keywords || []).join(", "),
              category: data.category || "Sanal Ofis",
              status: data.status || "draft",
              featured_image: data.featured_image || "",
            });
            setFaqs(Array.isArray(data.faqs) ? (data.faqs as unknown as FAQ[]) : []);
          }
        });
    }
  }, [id, isNew]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && isNew) {
      setForm((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöçİĞÜŞÖÇ\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
          .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c"),
      }));
    }
  };

  const addFaq = () => setFaqs((prev) => [...prev, { q: "", a: "" }]);
  const removeFaq = (i: number) => setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  const updateFaq = (i: number, field: "q" | "a", value: string) => {
    setFaqs((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  };

  const handleAIGenerated = (result: any) => {
    setForm({
      title: result.title || "",
      slug: result.slug || "",
      excerpt: result.excerpt || "",
      content: result.content || "",
      meta_title: result.meta_title || "",
      meta_description: result.meta_description || "",
      keywords: (result.keywords || []).join(", "),
      category: result.category || "Sanal Ofis",
      status: "draft",
      featured_image: "",
    });
    if (result.faqs) {
      setFaqs(result.faqs);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      category: form.category,
      status: form.status,
      featured_image: form.featured_image,
      faqs: faqs as any,
      author_id: user?.id,
    };

    let error;
    if (isNew) {
      ({ error } = await supabase.from("blog_posts").insert(payload));
    } else {
      ({ error } = await supabase.from("blog_posts").update(payload).eq("id", id));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: isNew ? "Yazı oluşturuldu" : "Yazı güncellendi" });
      navigate("/admin/blog");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{isNew ? "Yeni Blog Yazısı" : "Yazıyı Düzenle"}</h1>
        <div className="flex gap-2">
          {isNew && <AIBlogGenerator onGenerated={handleAIGenerated} />}
          <Select value={form.status} onValueChange={(v) => handleChange("status", v)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Taslak</SelectItem>
              <SelectItem value="published">Yayınla</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle className="text-base">İçerik</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Başlık" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
              <Input placeholder="URL Slug" value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} />
              <Textarea placeholder="Özet" rows={2} value={form.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} />
              <TipTapEditor content={form.content} onChange={(html) => setForm((prev) => ({ ...prev, content: html }))} />
            </CardContent>
          </Card>

          {/* FAQ section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">SSS</CardTitle>
              <Button variant="outline" size="sm" onClick={addFaq}><Plus className="mr-1 h-3 w-3" />Ekle</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Soru" value={faq.q} onChange={(e) => updateFaq(i, "q", e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeFaq(i)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <Textarea placeholder="Cevap" rows={2} value={faq.a} onChange={(e) => updateFaq(i, "a", e.target.value)} />
                </div>
              ))}
              {faqs.length === 0 && <p className="text-sm text-muted-foreground">Henüz SSS eklenmedi.</p>}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Meta Başlık" value={form.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} />
              <Textarea placeholder="Meta Açıklama" rows={2} value={form.meta_description} onChange={(e) => handleChange("meta_description", e.target.value)} />
              <Input placeholder="Anahtar Kelimeler (virgülle)" value={form.keywords} onChange={(e) => handleChange("keywords", e.target.value)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Detaylar</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sanal Ofis">Sanal Ofis</SelectItem>
                  <SelectItem value="Coworking">Coworking</SelectItem>
                  <SelectItem value="Toplantı Odası">Toplantı Odası</SelectItem>
                  <SelectItem value="Genel">Genel</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Öne Çıkan Görsel URL" value={form.featured_image} onChange={(e) => handleChange("featured_image", e.target.value)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;

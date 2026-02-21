import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AdminLayout from "@/components/AdminLayout";
import TipTapEditor from "@/components/TipTapEditor";
import AIBlogGenerator from "@/components/AIBlogGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();
  const [scheduledTime, setScheduledTime] = useState("09:00");

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
            if ((data as any).scheduled_at) {
              const d = new Date((data as any).scheduled_at);
              setScheduledDate(d);
              setScheduledTime(format(d, "HH:mm"));
            }
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

  const getScheduledAt = (): string | null => {
    if (!scheduledDate) return null;
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const d = new Date(scheduledDate);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const doSave = async (statusOverride?: string) => {
    setSaving(true);
    const finalStatus = statusOverride || form.status;
    const payload: any = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      category: form.category,
      status: finalStatus,
      featured_image: form.featured_image,
      faqs: faqs as any,
      author_id: user?.id,
      scheduled_at: finalStatus === "scheduled" ? getScheduledAt() : null,
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
      if (statusOverride) setForm((prev) => ({ ...prev, status: statusOverride }));
      toast({ title: isNew ? "Yazı oluşturuldu" : "Yazı güncellendi" });
      navigate("/admin/blog");
    }
  };

  const handleSave = () => {
    if (isNew && form.status === "draft") {
      setShowDraftDialog(true);
      return;
    }
    doSave();
  };

  const handleSchedule = () => {
    if (!scheduledDate) {
      toast({ title: "Hata", description: "Lütfen zamanlama tarihi seçin.", variant: "destructive" });
      return;
    }
    doSave("scheduled");
  };

  const toggleStatus = () => {
    const newStatus = form.status === "published" ? "draft" : "published";
    setForm((prev) => ({ ...prev, status: newStatus }));
  };

  const statusBadge = () => {
    if (form.status === "published") return <Badge className="text-sm">Yayında</Badge>;
    if (form.status === "scheduled") return <Badge variant="outline" className="text-sm border-blue-500 text-blue-600">Zamanlanmış</Badge>;
    return <Badge variant="secondary" className="text-sm">Taslak</Badge>;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">{isNew ? "Yeni Blog Yazısı" : "Yazıyı Düzenle"}</h1>
          {statusBadge()}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isNew && <AIBlogGenerator onGenerated={handleAIGenerated} />}
          <Button
            variant={form.status === "draft" ? "default" : "outline"}
            onClick={toggleStatus}
            className={form.status === "draft"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "border-orange-500 text-orange-600 hover:bg-orange-50"
            }
          >
            {form.status === "draft" ? "Yayınla" : "Taslağa Al"}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {/* Draft confirmation dialog */}
      <AlertDialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yazı taslak olarak kaydedilecek</AlertDialogTitle>
            <AlertDialogDescription>
              Bu yazı taslak olarak kaydedilecek ve blog sayfasında görünmeyecek. Yayınlamak ister misiniz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowDraftDialog(false); doSave(); }}>
              Taslak Olarak Kaydet
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => { setShowDraftDialog(false); doSave("published"); }}
              className="bg-green-600 hover:bg-green-700">
              Yayınla ve Kaydet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" /> Zamanlanmış Yayın</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduledDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "dd MMM yyyy") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
              <Button
                onClick={handleSchedule}
                disabled={saving || !scheduledDate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Clock className="mr-2 h-4 w-4" />
                Zamanla
              </Button>
              {form.status === "scheduled" && scheduledDate && (
                <p className="text-xs text-blue-600">
                  Zamanlanmış: {format(scheduledDate, "dd MMM yyyy")} {scheduledTime}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEditor;

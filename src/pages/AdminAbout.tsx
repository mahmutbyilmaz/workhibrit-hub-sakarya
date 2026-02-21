import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

const AdminAbout = () => {
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["about_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", "hakkimizda")
        .order("sort_order");
      if (error) throw error;
      return (data as unknown as Array<{ id: string; block_type: string; content: any }>) ?? [];
    },
  });

  const getBlock = (type: string) =>
    Array.isArray(blocks) ? blocks.find((b) => b.block_type === type) : undefined;

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">Hakkımızda Sayfası</h1>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <Tabs defaultValue="hero">
          <TabsList className="mb-4">
            <TabsTrigger value="hero">Başlık</TabsTrigger>
            <TabsTrigger value="story">Hikaye</TabsTrigger>
            <TabsTrigger value="values">Değerler</TabsTrigger>
            <TabsTrigger value="stats">İstatistikler</TabsTrigger>
          </TabsList>
          <TabsContent value="hero">
            <HeroEditor block={getBlock("hero")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="story">
            <StoryEditor block={getBlock("story")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="values">
            <ValuesEditor block={getBlock("values")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="stats">
            <StatsEditor block={getBlock("stats")} queryClient={queryClient} />
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
};

// ─── Save helper ───
const useSaveBlock = (blockId: string, queryClient: any) =>
  useMutation({
    mutationFn: async (content: any) => {
      const { error } = await supabase
        .from("page_content")
        .update({ content: JSON.parse(JSON.stringify(content)) })
        .eq("id", blockId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about_content"] });
      toast.success("Kaydedildi");
    },
    onError: () => toast.error("Kaydetme başarısız"),
  });

// ─── Hero ───
const HeroEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [title, setTitle] = useState(block?.content?.title || "");
  const [subtitle, setSubtitle] = useState(block?.content?.subtitle || "");
  const mutation = useSaveBlock(block?.id, queryClient);

  return (
    <Card>
      <CardHeader><CardTitle>Sayfa Başlığı</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Başlık</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label>Alt Başlık</Label><Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} /></div>
        <Button onClick={() => mutation.mutate({ title, subtitle })} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Story ───
const StoryEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const content = block?.content || {};
  const [title, setTitle] = useState(content.title || "");
  const [paragraphs, setParagraphs] = useState<string[]>(content.paragraphs || [""]);
  const mutation = useSaveBlock(block?.id, queryClient);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hikayemiz</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setParagraphs([...paragraphs, ""])}>
          <Plus className="mr-1 h-4 w-4" /> Paragraf Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div><Label>Bölüm Başlığı</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={p}
              onChange={(e) => {
                const next = [...paragraphs];
                next[i] = e.target.value;
                setParagraphs(next);
              }}
              rows={3}
              className="flex-1"
            />
            {paragraphs.length > 1 && (
              <Button size="icon" variant="ghost" onClick={() => setParagraphs(paragraphs.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
        <Button onClick={() => mutation.mutate({ title, paragraphs })} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Values ───
const iconOptions = ["Target", "Eye", "Heart", "CheckCircle", "Star", "Shield"];

const ValuesEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [items, setItems] = useState<Array<{ icon: string; title: string; desc: string }>>(
    () => (Array.isArray(block?.content) ? block.content : [])
  );
  const mutation = useSaveBlock(block?.id, queryClient);

  const update = (i: number, key: string, val: string) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    setItems(next);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Misyon / Vizyon / Değerler</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setItems([...items, { icon: "Target", title: "", desc: "" }])}>
          <Plus className="mr-1 h-4 w-4" /> Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">#{i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Başlık</Label><Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
              <div>
                <Label>İkon</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={item.icon}
                  onChange={(e) => update(i, "icon", e.target.value)}
                >
                  {iconOptions.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            <div><Label>Açıklama</Label><Textarea value={item.desc} onChange={(e) => update(i, "desc", e.target.value)} rows={2} /></div>
          </div>
        ))}
        <Button onClick={() => mutation.mutate(items)} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Stats ───
const StatsEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [items, setItems] = useState<Array<{ value: string; label: string }>>(
    () => (Array.isArray(block?.content) ? block.content : [])
  );
  const mutation = useSaveBlock(block?.id, queryClient);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>İstatistikler</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setItems([...items, { value: "", label: "" }])}>
          <Plus className="mr-1 h-4 w-4" /> Ekle
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-end gap-3">
            <div className="flex-1"><Label>Değer</Label><Input value={item.value} onChange={(e) => {
              const next = [...items]; next[i].value = e.target.value; setItems(next);
            }} placeholder="8+" /></div>
            <div className="flex-1"><Label>Etiket</Label><Input value={item.label} onChange={(e) => {
              const next = [...items]; next[i].label = e.target.value; setItems(next);
            }} placeholder="Yıllık Deneyim" /></div>
            <Button size="icon" variant="ghost" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button onClick={() => mutation.mutate(items)} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminAbout;

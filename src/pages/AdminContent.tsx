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
import { Save, Loader2, Plus, Trash2, Star, GripVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Service = { id: string; title: string; slug: string; description: string; icon: string; price: string; period: string };
type Testimonial = { name: string; company: string; text: string; rating: number };
type PricingRow = string[];
type SlideItem = { title: string; description: string; buttonText: string; buttonLink: string; icon: string; bgImage: string };

const iconOptions = ["Building2", "Users", "Presentation", "DoorOpen"];

const AdminContent = () => {
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["homepage_content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_slug", "homepage")
        .in("block_type", ["services", "testimonials", "pricing", "hero_slider"])
        .order("sort_order");
      if (error) throw error;
      return (data as unknown as Array<{ id: string; block_type: string; content: any }>) ?? [];
    },
  });

  const getBlock = (type: string) => Array.isArray(blocks) ? blocks.find((b) => b.block_type === type) : undefined;

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">İçerik Yönetimi</h1>
      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...</div>
      ) : (
        <Tabs defaultValue="slider">
          <TabsList className="mb-4">
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="services">Hizmetler</TabsTrigger>
            <TabsTrigger value="testimonials">Müşteri Yorumları</TabsTrigger>
            <TabsTrigger value="pricing">Fiyat Tablosu</TabsTrigger>
          </TabsList>
          <TabsContent value="slider">
            <SliderEditor block={getBlock("hero_slider")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="services">
            <ServicesEditor block={getBlock("services")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsEditor block={getBlock("testimonials")} queryClient={queryClient} />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingEditor block={getBlock("pricing")} queryClient={queryClient} />
          </TabsContent>
        </Tabs>
      )}
    </AdminLayout>
  );
};

// ─── Services Editor ───
const ServicesEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [items, setItems] = useState<Service[]>(() => {
    const content = block?.content;
    return Array.isArray(content) ? content : [];
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_content")
        .update({ content: JSON.parse(JSON.stringify(items)) })
        .eq("id", block.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["homepage_content"] }); toast.success("Hizmetler kaydedildi"); },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const update = (i: number, key: keyof Service, val: string) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    setItems(next);
  };

  const addItem = () => setItems([...items, { id: `service-${Date.now()}`, title: "", slug: "/", description: "", icon: "Building2", price: "", period: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hizmetler</CardTitle>
        <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Ekle</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Hizmet #{i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Başlık</Label><Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
              <div><Label>Sayfa Linki</Label><Input value={item.slug} onChange={(e) => update(i, "slug", e.target.value)} /></div>
              <div><Label>Fiyat</Label><Input value={item.price} onChange={(e) => update(i, "price", e.target.value)} /></div>
              <div><Label>Periyod</Label><Input value={item.period} onChange={(e) => update(i, "period", e.target.value)} /></div>
              <div>
                <Label>İkon</Label>
                <Select value={item.icon} onValueChange={(v) => update(i, "icon", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Açıklama</Label><Textarea value={item.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} /></div>
          </div>
        ))}
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Testimonials Editor ───
const TestimonialsEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [items, setItems] = useState<Testimonial[]>(() => {
    const content = block?.content;
    return Array.isArray(content) ? content : [];
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_content")
        .update({ content: JSON.parse(JSON.stringify(items)) })
        .eq("id", block.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["homepage_content"] }); toast.success("Yorumlar kaydedildi"); },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const update = (i: number, key: keyof Testimonial, val: string | number) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    setItems(next);
  };

  const addItem = () => setItems([...items, { name: "", company: "", text: "", rating: 5 }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Müşteri Yorumları</CardTitle>
        <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Ekle</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Yorum #{i + 1}</span>
              <Button size="icon" variant="ghost" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>İsim</Label><Input value={item.name} onChange={(e) => update(i, "name", e.target.value)} /></div>
              <div><Label>Şirket</Label><Input value={item.company} onChange={(e) => update(i, "company", e.target.value)} /></div>
              <div>
                <Label>Puan</Label>
                <Select value={String(item.rating)} onValueChange={(v) => update(i, "rating", Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => <SelectItem key={r} value={String(r)}>{r} ★</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Yorum Metni</Label><Textarea value={item.text} onChange={(e) => update(i, "text", e.target.value)} rows={2} /></div>
          </div>
        ))}
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Pricing Editor ───
const PricingEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [rows, setRows] = useState<PricingRow[]>(() => {
    const content = block?.content;
    return Array.isArray(content) ? content : [["Özellik", "Sanal Ofis", "Coworking", "Hazır Ofis"]];
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("page_content")
        .update({ content: JSON.parse(JSON.stringify(rows)) })
        .eq("id", block.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["homepage_content"] }); toast.success("Fiyat tablosu kaydedildi"); },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const updateCell = (r: number, c: number, val: string) => {
    const next = rows.map((row) => [...row]);
    next[r][c] = val;
    setRows(next);
  };

  const addRow = () => setRows([...rows, Array(rows[0]?.length || 4).fill("")]);
  const removeRow = (i: number) => { if (i > 0) setRows(rows.filter((_, idx) => idx !== i)); };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Fiyat Karşılaştırma Tablosu</CardTitle>
        <Button size="sm" variant="outline" onClick={addRow}><Plus className="mr-1 h-4 w-4" /> Satır Ekle</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1">
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        className={ri === 0 ? "font-bold" : ""}
                      />
                    </td>
                  ))}
                  <td className="p-1">
                    {ri > 0 && (
                      <Button size="icon" variant="ghost" onClick={() => removeRow(ri)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button className="mt-4" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Slider Editor ───
const SliderEditor = ({ block, queryClient }: { block: any; queryClient: any }) => {
  const [items, setItems] = useState<SlideItem[]>(() => {
    const content = block?.content;
    return Array.isArray(content) ? content : [];
  });

  const upsertMutation = useMutation({
    mutationFn: async () => {
      if (block?.id) {
        const { error } = await supabase
          .from("page_content")
          .update({ content: JSON.parse(JSON.stringify(items)) })
          .eq("id", block.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("page_content")
          .insert({ page_slug: "homepage", block_type: "hero_slider", sort_order: 0, content: JSON.parse(JSON.stringify(items)) });
        if (error) throw error;
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["homepage_content"] }); toast.success("Slider kaydedildi"); },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const update = (i: number, key: keyof SlideItem, val: string) => {
    const next = [...items];
    (next[i] as any)[key] = val;
    setItems(next);
  };

  const addItem = () => setItems([...items, { title: "", description: "", buttonText: "Detaylar", buttonLink: "/", icon: "Building2", bgImage: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const moveItem = (from: number, dir: number) => {
    const to = from + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    setItems(next);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ana Sayfa Slider</CardTitle>
        <Button size="sm" variant="outline" onClick={addItem}><Plus className="mr-1 h-4 w-4" /> Slide Ekle</Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => moveItem(i, -1)} disabled={i === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▲</button>
                  <button onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">▼</button>
                </div>
                <span className="text-sm font-bold">Slide #{i + 1}</span>
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeItem(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><Label>Başlık</Label><Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
              <div>
                <Label>İkon</Label>
                <Select value={item.icon} onValueChange={(v) => update(i, "icon", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((ic) => <SelectItem key={ic} value={ic}>{ic}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Buton Metni</Label><Input value={item.buttonText} onChange={(e) => update(i, "buttonText", e.target.value)} /></div>
              <div><Label>Buton Linki</Label><Input value={item.buttonLink} onChange={(e) => update(i, "buttonLink", e.target.value)} /></div>
              <div className="sm:col-span-2"><Label>Arka Plan Resmi (URL, opsiyonel)</Label><Input value={item.bgImage} onChange={(e) => update(i, "bgImage", e.target.value)} placeholder="https://..." /></div>
            </div>
            <div><Label>Açıklama</Label><Textarea value={item.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} /></div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">Henüz slide eklenmedi.</p>}
        <Button onClick={() => upsertMutation.mutate()} disabled={upsertMutation.isPending}>
          {upsertMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminContent;

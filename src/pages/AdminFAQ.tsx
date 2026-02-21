import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Edit, Trash2, GripVertical, CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdminLayout from "@/components/AdminLayout";
import AIFAQGenerator from "@/components/AIFAQGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  page_assignments: string[];
  sort_order: number;
  status: string;
  scheduled_at: string | null;
}

const pages = [
  { value: "homepage", label: "Ana Sayfa" },
  { value: "sanal-ofis-sakarya", label: "Sanal Ofis" },
  { value: "sanal-ofis-fiyatlari", label: "Fiyatlar" },
  { value: "coworking-sakarya", label: "Coworking" },
  { value: "toplanti-odasi-sakarya", label: "Toplantı Odası" },
  { value: "hazir-ofis", label: "Hazır Ofis" },
];

const categories = ["Sanal Ofis", "Coworking", "Fiyat", "Genel"];

const emptyForm = { question: "", answer: "", category: "Genel", page_assignments: [] as string[], useSchedule: false, scheduledDate: undefined as Date | undefined, scheduledTime: "09:00" };

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const fetchFaqs = async () => {
    const { data } = await supabase.from("faqs").select("*").order("sort_order");
    if (data) setFaqs(data as FAQ[]);
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const openNew = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (faq: FAQ) => {
    setEditId(faq.id);
    const hasSchedule = faq.status === "scheduled" && faq.scheduled_at;
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      page_assignments: faq.page_assignments || [],
      useSchedule: !!hasSchedule,
      scheduledDate: hasSchedule ? new Date(faq.scheduled_at!) : undefined,
      scheduledTime: hasSchedule ? format(new Date(faq.scheduled_at!), "HH:mm") : "09:00",
    });
    setDialogOpen(true);
  };

  const getScheduledAt = (): string | null => {
    if (!form.useSchedule || !form.scheduledDate) return null;
    const [hours, minutes] = form.scheduledTime.split(":").map(Number);
    const d = new Date(form.scheduledDate);
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
  };

  const handleSave = async () => {
    const scheduled_at = getScheduledAt();
    const status = form.useSchedule && scheduled_at ? "scheduled" : "published";

    const payload: any = {
      question: form.question,
      answer: form.answer,
      category: form.category,
      page_assignments: form.page_assignments,
      sort_order: editId ? undefined : faqs.length,
      status,
      scheduled_at,
    };

    let error;
    if (editId) {
      const { sort_order, ...updatePayload } = payload;
      ({ error } = await supabase.from("faqs").update(updatePayload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("faqs").insert(payload));
    }

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editId ? "SSS güncellendi" : "SSS eklendi" });
      setDialogOpen(false);
      fetchFaqs();
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    toast({ title: "SSS silindi" });
  };

  const togglePage = (page: string) => {
    setForm((prev) => ({
      ...prev,
      page_assignments: prev.page_assignments.includes(page)
        ? prev.page_assignments.filter((p) => p !== page)
        : [...prev.page_assignments, page],
    }));
  };

  const getStatusBadge = (faq: FAQ) => {
    if (faq.status === "scheduled" && faq.scheduled_at) {
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-600 text-xs">
          Zamanlanmış: {format(new Date(faq.scheduled_at), "dd MMM yyyy HH:mm")}
        </Badge>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">SSS Yönetimi</h1>
        <div className="flex gap-2">
          <AIFAQGenerator onSaved={fetchFaqs} />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Yeni Soru</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editId ? "Soruyu Düzenle" : "Yeni Soru Ekle"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Soru" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
                <Textarea placeholder="Cevap" rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div>
                  <p className="mb-2 text-sm font-medium">Sayfalar</p>
                  <div className="space-y-2">
                    {pages.map((p) => (
                      <label key={p.value} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={form.page_assignments.includes(p.value)}
                          onCheckedChange={() => togglePage(p.value)}
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scheduling */}
                <div className="space-y-3 rounded-md border p-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                      checked={form.useSchedule}
                      onCheckedChange={(checked) => setForm({ ...form, useSchedule: !!checked })}
                    />
                    <Clock className="h-4 w-4" />
                    Zamanlanmış Yayın
                  </label>
                  {form.useSchedule && (
                    <div className="space-y-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.scheduledDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.scheduledDate ? format(form.scheduledDate, "dd MMM yyyy") : "Tarih seçin"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={form.scheduledDate}
                            onSelect={(d) => setForm({ ...form, scheduledDate: d })}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        type="time"
                        value={form.scheduledTime}
                        onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleSave} className="w-full">Kaydet</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : faqs.length === 0 ? (
        <p className="text-muted-foreground">Henüz SSS eklenmedi.</p>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="flex items-center gap-3 p-4">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{faq.question}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="secondary">{faq.category}</Badge>
                    {getStatusBadge(faq)}
                    {(faq.page_assignments || []).map((p) => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteFaq(faq.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFAQ;

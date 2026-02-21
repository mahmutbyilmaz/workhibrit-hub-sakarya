import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { addMonths, format } from "date-fns";
import AdminLayout from "@/components/AdminLayout";
import ContractPreview from "@/components/ContractPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Save, Loader2, Eye } from "lucide-react";

const AdminContractNew = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    company_name: "",
    phone: "",
    email: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    contract_duration: 12,
    monthly_price: "",
    address: "",
    contract_date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
    template_id: "",
  });

  const endDate = useMemo(() => {
    if (!form.start_date || !form.contract_duration) return "";
    return format(addMonths(new Date(form.start_date), form.contract_duration), "yyyy-MM-dd");
  }, [form.start_date, form.contract_duration]);

  const { data: templates } = useQuery({
    queryKey: ["contract_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contract_templates").select("*").order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const selectedTemplate = templates?.find((t) => t.id === form.template_id) || templates?.find((t) => t.is_default);

  const renderedContent = useMemo(() => {
    if (!selectedTemplate) return "";
    return selectedTemplate.content
      .replace(/\{\{customer_name\}\}/g, form.customer_name || "___")
      .replace(/\{\{company_name\}\}/g, form.company_name || "___")
      .replace(/\{\{address\}\}/g, form.address || "___")
      .replace(/\{\{start_date\}\}/g, form.start_date)
      .replace(/\{\{end_date\}\}/g, endDate)
      .replace(/\{\{contract_duration\}\}/g, String(form.contract_duration))
      .replace(/\{\{monthly_price\}\}/g, form.monthly_price || "___")
      .replace(/\{\{contract_date\}\}/g, form.contract_date);
  }, [selectedTemplate, form, endDate]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("contracts").insert({
        template_id: selectedTemplate?.id || null,
        customer_name: form.customer_name,
        company_name: form.company_name || null,
        phone: form.phone || null,
        email: form.email || null,
        start_date: form.start_date,
        end_date: endDate,
        contract_duration: form.contract_duration,
        monthly_price: parseFloat(form.monthly_price),
        address: form.address || null,
        contract_date: form.contract_date,
        notes: form.notes || null,
        rendered_content: renderedContent,
        status: "active",
        created_by: user?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Sözleşme kaydedildi");
      navigate("/admin/contracts");
    },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const update = (key: string, val: string | number) => setForm((p) => ({ ...p, [key]: val }));

  if (showPreview) {
    return (
      <AdminLayout>
        <ContractPreview content={renderedContent} onBack={() => setShowPreview(false)} />
        <div className="mt-4 flex gap-2 print:hidden">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
            Kaydet
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">Yeni Sözleşme</h1>
      <Card>
        <CardHeader><CardTitle>Sözleşme Bilgileri</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Müşteri Adı *</Label><Input value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} /></div>
            <div><Label>Şirket Adı</Label><Input value={form.company_name} onChange={(e) => update("company_name", e.target.value)} /></div>
            <div><Label>Telefon</Label><Input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
            <div><Label>E-posta</Label><Input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" /></div>
            <div><Label>Başlangıç Tarihi *</Label><Input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} /></div>
            <div>
              <Label>Süre (ay) *</Label>
              <Input type="number" min={1} value={form.contract_duration} onChange={(e) => update("contract_duration", parseInt(e.target.value) || 1)} />
            </div>
            <div><Label>Bitiş Tarihi (otomatik)</Label><Input value={endDate} readOnly className="bg-muted" /></div>
            <div><Label>Aylık Ücret (TL) *</Label><Input type="number" value={form.monthly_price} onChange={(e) => update("monthly_price", e.target.value)} /></div>
            <div><Label>Sözleşme Tarihi</Label><Input type="date" value={form.contract_date} onChange={(e) => update("contract_date", e.target.value)} /></div>
            <div>
              <Label>Şablon</Label>
              <Select value={form.template_id || selectedTemplate?.id || ""} onValueChange={(v) => update("template_id", v)}>
                <SelectTrigger><SelectValue placeholder="Şablon seçin" /></SelectTrigger>
                <SelectContent>
                  {templates?.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}{t.is_default ? " (Varsayılan)" : ""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><Label>Adres</Label><Textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} /></div>
          <div><Label>Notlar</Label><Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={2} /></div>
          <div className="flex gap-2">
            <Button onClick={() => setShowPreview(true)} disabled={!form.customer_name || !form.monthly_price}>
              <Eye className="mr-1 h-4 w-4" /> Önizleme
            </Button>
            <Button variant="outline" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.customer_name || !form.monthly_price}>
              {saveMutation.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              Kaydet
            </Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminContractNew;

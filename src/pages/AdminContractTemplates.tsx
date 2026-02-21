import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2, Edit, X } from "lucide-react";

type Template = {
  id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
};

const placeholders = [
  { key: "{{customer_name}}", desc: "Müşteri adı" },
  { key: "{{company_name}}", desc: "Şirket adı" },
  { key: "{{address}}", desc: "Adres" },
  { key: "{{start_date}}", desc: "Başlangıç tarihi" },
  { key: "{{end_date}}", desc: "Bitiş tarihi" },
  { key: "{{contract_duration}}", desc: "Süre (ay)" },
  { key: "{{monthly_price}}", desc: "Aylık ücret" },
  { key: "{{contract_date}}", desc: "Sözleşme tarihi" },
];

const AdminContractTemplates = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Template | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["contract_templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contract_templates").select("*").order("created_at");
      if (error) throw error;
      return data as Template[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (tpl: Partial<Template>) => {
      if (isNew) {
        const { error } = await supabase.from("contract_templates").insert({ name: tpl.name!, content: tpl.content!, is_default: tpl.is_default ?? false });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("contract_templates").update({ name: tpl.name, content: tpl.content, is_default: tpl.is_default }).eq("id", tpl.id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract_templates"] });
      toast.success("Şablon kaydedildi");
      setEditing(null);
      setIsNew(false);
    },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contract_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract_templates"] });
      toast.success("Şablon silindi");
    },
    onError: () => toast.error("Silme başarısız"),
  });

  const startNew = () => {
    setEditing({ id: "", name: "", content: "", is_default: false, created_at: "" });
    setIsNew(true);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Sözleşme Şablonları</h1>
        {!editing && <Button onClick={startNew}><Plus className="mr-1 h-4 w-4" /> Yeni Şablon</Button>}
      </div>

      {editing ? (
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? "Yeni Şablon" : "Şablon Düzenle"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Şablon Adı</Label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={editing.is_default} onCheckedChange={(v) => setEditing({ ...editing, is_default: v })} />
              <Label>Varsayılan şablon</Label>
            </div>
            <div>
              <Label>Şablon İçeriği</Label>
              <div className="mb-2 flex flex-wrap gap-1">
                {placeholders.map((p) => (
                  <button
                    key={p.key}
                    className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent"
                    onClick={() => setEditing({ ...editing, content: editing.content + p.key })}
                    title={p.desc}
                  >
                    {p.key}
                  </button>
                ))}
              </div>
              <Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={20} className="font-mono text-xs" />
            </div>
            <div className="flex gap-2">
              <Button onClick={() => saveMutation.mutate(editing)} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
                Kaydet
              </Button>
              <Button variant="outline" onClick={() => { setEditing(null); setIsNew(false); }}>
                <X className="mr-1 h-4 w-4" /> İptal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {templates?.map((tpl) => (
            <Card key={tpl.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{tpl.name}</p>
                  {tpl.is_default && <span className="text-xs text-primary">Varsayılan</span>}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(tpl); setIsNew(false); }}>
                    <Edit className="mr-1 h-3 w-3" /> Düzenle
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(tpl.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!templates || templates.length === 0) && <p className="text-sm text-muted-foreground">Henüz şablon eklenmedi.</p>}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContractTemplates;

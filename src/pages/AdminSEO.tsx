import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const settingsFields = [
  { key: "business_name", label: "İşletme Adı" },
  { key: "phone", label: "Telefon" },
  { key: "email", label: "E-posta" },
  { key: "whatsapp", label: "WhatsApp Numarası" },
  { key: "address_street", label: "Adres (Sokak)" },
  { key: "address_district", label: "İlçe" },
  { key: "address_city", label: "İl" },
  { key: "address_country", label: "Ülke" },
  { key: "address_zip", label: "Posta Kodu" },
  { key: "working_hours_weekdays", label: "Hafta İçi Saatleri" },
  { key: "working_hours_saturday", label: "Cumartesi Saatleri" },
  { key: "working_hours_sunday", label: "Pazar Saatleri" },
  { key: "maps_link", label: "Google Maps Linki" },
  { key: "maps_embed", label: "Google Maps Embed URL" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
];

const AdminSEO = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("seo_settings").select("*").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row) => { map[row.key] = row.value; });
        setSettings(map);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const promises = Object.entries(settings).map(([key, value]) =>
      supabase.from("seo_settings").upsert({ key, value }, { onConflict: "key" })
    );
    await Promise.all(promises);
    setSaving(false);
    toast({ title: "Ayarlar kaydedildi" });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">SEO & İşletme Ayarları</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">İşletme Bilgileri</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settingsFields.slice(0, 9).map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{f.label}</label>
                <Input
                  value={settings[f.key] || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Çalışma Saatleri & Sosyal Medya</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {settingsFields.slice(9).map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{f.label}</label>
                <Input
                  value={settings[f.key] || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSEO;

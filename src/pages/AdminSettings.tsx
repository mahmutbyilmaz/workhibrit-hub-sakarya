import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2, Upload, X, Image } from "lucide-react";

const contactFields = [
  { key: "footer_phone", label: "Telefon" },
  { key: "footer_email", label: "E-posta" },
  { key: "footer_whatsapp", label: "WhatsApp Numarası" },
  { key: "footer_address", label: "Adres" },
];

const socialFields = [
  { key: "footer_instagram", label: "Instagram URL" },
  { key: "footer_linkedin", label: "LinkedIn URL" },
  { key: "footer_twitter", label: "Twitter / X URL" },
];

const allKeys = [...contactFields, ...socialFields].map((f) => f.key).concat("header_logo_url");

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      return (data as Array<{ key: string; value: string }>) ?? [];
    },
  });

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const map: Record<string, string> = {};
      settings.forEach((s) => (map[s.key] = s.value));
      setValues(map);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      const promises = allKeys.map((key) =>
        supabase
          .from("site_settings")
          .upsert({ key, value: values[key] || "" }, { onConflict: "key" })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Ayarlar kaydedildi");
    },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `logos/site-logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      setValues((prev) => ({ ...prev, header_logo_url: urlData.publicUrl }));
      toast.success("Logo yüklendi, kaydetmeyi unutmayın");
    } catch {
      toast.error("Logo yüklenemedi");
    } finally {
      setUploading(false);
    }
  };

  const renderFields = (fields: { key: string; label: string }[]) =>
    fields.map((f) => (
      <div key={f.key} className="grid gap-1.5">
        <Label htmlFor={f.key}>{f.label}</Label>
        <Input
          id={f.key}
          value={values[f.key] || ""}
          onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
        />
      </div>
    ));

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">Site Ayarları</h1>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <div className="space-y-6">
          {/* İletişim */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{renderFields(contactFields)}</CardContent>
          </Card>

          {/* Sosyal Medya */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sosyal Medya</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{renderFields(socialFields)}</CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Logosu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {values.header_logo_url ? (
                <div className="flex items-center gap-4">
                  <img
                    src={values.header_logo_url}
                    alt="Mevcut logo"
                    className="h-12 w-auto rounded border object-contain p-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setValues({ ...values, header_logo_url: "" })}
                  >
                    <X className="mr-1 h-4 w-4" /> Kaldır
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image className="h-4 w-4" /> Logo ayarlanmamış (metin logosu kullanılıyor)
                </div>
              )}

              <div>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 rounded-md border border-dashed px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? "Yükleniyor..." : "Yeni Logo Yükle"}
                  </div>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            size="lg"
          >
            {mutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Tüm Ayarları Kaydet
          </Button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;

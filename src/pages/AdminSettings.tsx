import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

const settingFields = [
  { key: "footer_phone", label: "Telefon" },
  { key: "footer_email", label: "E-posta" },
  { key: "footer_address", label: "Adres" },
  { key: "footer_whatsapp", label: "WhatsApp Numarası" },
  { key: "footer_instagram", label: "Instagram URL" },
  { key: "footer_linkedin", label: "LinkedIn URL" },
];

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => (map[s.key] = s.value));
      setValues(map);
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      const promises = settingFields.map((f) =>
        supabase
          .from("site_settings")
          .update({ value: values[f.key] || "" })
          .eq("key", f.key)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Ayarlar kaydedildi");
    },
    onError: () => toast.error("Kaydetme başarısız"),
  });

  return (
    <AdminLayout>
      <h1 className="mb-6 font-display text-2xl font-bold">Site Ayarları</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Footer & İletişim Bilgileri</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
            </div>
          ) : (
            <>
              {settingFields.map((f) => (
                <div key={f.key} className="grid gap-1.5">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  <Input
                    id={f.key}
                    value={values[f.key] || ""}
                    onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  />
                </div>
              ))}
              <Button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="mt-2"
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Kaydet
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminSettings;

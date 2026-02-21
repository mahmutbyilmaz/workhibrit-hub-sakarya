import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  created_at: string;
}

const AdminMedia = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMedia = async () => {
    const { data } = await supabase.from("media").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { fetchMedia(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const filePath = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(filePath, file);
      if (uploadError) {
        toast({ title: "Yükleme hatası", description: uploadError.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);
      await supabase.from("media").insert({
        file_name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user?.id,
      });
    }

    setUploading(false);
    fetchMedia();
    toast({ title: "Yükleme tamamlandı" });
  };

  const deleteMedia = async (item: MediaItem) => {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    // Extract path from URL
    const path = item.file_url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
    await supabase.from("media").delete().eq("id", item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    toast({ title: "Dosya silindi" });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL kopyalandı" });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Medya Kütüphanesi</h1>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />{uploading ? "Yükleniyor..." : "Yükle"}
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Henüz dosya yüklenmedi.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                {item.file_type?.startsWith("image/") ? (
                  <img src={item.file_url} alt={item.file_name} className="mb-2 aspect-square w-full rounded-md object-cover" />
                ) : (
                  <div className="mb-2 flex aspect-square items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                    {item.file_name}
                  </div>
                )}
                <p className="truncate text-xs font-medium">{item.file_name}</p>
                <div className="mt-2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(item.file_url)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteMedia(item)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMedia;

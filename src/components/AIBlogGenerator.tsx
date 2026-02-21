import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIBlogResult {
  title: string;
  meta_title: string;
  meta_description: string;
  slug: string;
  excerpt: string;
  content: string;
  keywords: string[];
  category: string;
  faqs: Array<{ q: string; a: string }>;
}

interface AIBlogGeneratorProps {
  onGenerated: (result: AIBlogResult) => void;
}

const AIBlogGenerator = ({ onGenerated }: AIBlogGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("medium");
  const [tone, setTone] = useState("informational");
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Konu giriniz", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "blog", topic, length, tone },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onGenerated(data.result);
      setOpen(false);
      setTopic("");
      toast({ title: "İçerik oluşturuldu!", description: "Yayınlamadan önce düzenleme yapabilirsiniz." });
    } catch (e: any) {
      toast({ title: "Hata", description: e.message || "İçerik üretilemedi", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          AI ile Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Blog Yazısı Oluştur
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Konu veya Anahtar Kelime</Label>
            <Input
              placeholder="Örn: Sakarya sanal ofis fiyatları"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <Label>İçerik Uzunluğu</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Kısa (~600 kelime)</SelectItem>
                <SelectItem value="medium">Orta (~1000 kelime)</SelectItem>
                <SelectItem value="long">Uzun (~1500+ kelime)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ton</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="informational">Bilgilendirici</SelectItem>
                <SelectItem value="professional">Profesyonel</SelectItem>
                <SelectItem value="local">Yerel Odaklı</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? "Oluşturuluyor... (30-60 sn)" : "İçerik Oluştur"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIBlogGenerator;

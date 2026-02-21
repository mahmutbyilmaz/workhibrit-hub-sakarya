import { useState } from "react";
import { Sparkles, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const pages = [
  { value: "homepage", label: "Ana Sayfa" },
  { value: "sanal-ofis-sakarya", label: "Sanal Ofis" },
  { value: "sanal-ofis-fiyatlari", label: "Fiyatlar" },
  { value: "coworking-sakarya", label: "Coworking" },
  { value: "toplanti-odasi-sakarya", label: "Toplantı Odası" },
  { value: "hazir-ofis", label: "Hazır Ofis" },
];

const categories = ["Sanal Ofis", "Coworking", "Fiyat", "Genel"];

interface GeneratedFAQ {
  q: string;
  a: string;
  category: string;
  selected: boolean;
  pageAssignments: string[];
}

interface AIFAQGeneratorProps {
  onSaved: () => void;
}

const AIFAQGenerator = ({ onSaved }: AIFAQGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [faqCategory, setFaqCategory] = useState("Sanal Ofis");
  const [count, setCount] = useState("5");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<GeneratedFAQ[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { type: "faq", faqCategory, count: parseInt(count), topic: faqCategory },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const faqs = Array.isArray(data.result) ? data.result : [];
      setResults(
        faqs.map((f: any) => ({
          q: f.q,
          a: f.a,
          category: f.category || faqCategory,
          selected: true,
          pageAssignments: [],
        }))
      );
      toast({ title: `${faqs.length} SSS oluşturuldu!` });
    } catch (e: any) {
      toast({ title: "Hata", description: e.message || "SSS üretilemedi", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const toggleSelect = (i: number) => {
    setResults((prev) => prev.map((f, idx) => idx === i ? { ...f, selected: !f.selected } : f));
  };

  const updateFAQ = (i: number, field: "q" | "a", value: string) => {
    setResults((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  };

  const togglePage = (i: number, page: string) => {
    setResults((prev) =>
      prev.map((f, idx) =>
        idx === i
          ? {
              ...f,
              pageAssignments: f.pageAssignments.includes(page)
                ? f.pageAssignments.filter((p) => p !== page)
                : [...f.pageAssignments, page],
            }
          : f
      )
    );
  };

  const handleSave = async () => {
    const selected = results.filter((f) => f.selected);
    if (!selected.length) {
      toast({ title: "Kaydetmek için en az bir soru seçin", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("faqs").insert(
        selected.map((f, i) => ({
          question: f.q,
          answer: f.a,
          category: f.category,
          page_assignments: f.pageAssignments,
          sort_order: i,
        }))
      );
      if (error) throw error;
      toast({ title: `${selected.length} SSS kaydedildi!` });
      setResults([]);
      setOpen(false);
      onSaved();
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4" />
          AI ile SSS Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI SSS Oluşturucu
          </DialogTitle>
        </DialogHeader>

        {results.length === 0 ? (
          <div className="space-y-4">
            <div>
              <Label>Konu / Sayfa Türü</Label>
              <Select value={faqCategory} onValueChange={setFaqCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Soru Sayısı</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[3, 5, 7, 10].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} soru</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={generating} className="w-full">
              {generating ? "Oluşturuluyor..." : "SSS Oluştur"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Düzenleyip kaydetmeden önce inceleyin:</p>
            {results.map((faq, i) => (
              <Card key={i} className={faq.selected ? "" : "opacity-50"}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start gap-2">
                    <Checkbox checked={faq.selected} onCheckedChange={() => toggleSelect(i)} className="mt-1" />
                    <div className="flex-1 space-y-2">
                      <Input
                        value={faq.q}
                        onChange={(e) => updateFAQ(i, "q", e.target.value)}
                        className="font-medium"
                      />
                      <Textarea
                        value={faq.a}
                        onChange={(e) => updateFAQ(i, "a", e.target.value)}
                        rows={2}
                      />
                      <div className="flex flex-wrap gap-2">
                        {pages.map((p) => (
                          <label key={p.value} className="flex items-center gap-1 text-xs">
                            <Checkbox
                              checked={faq.pageAssignments.includes(p.value)}
                              onCheckedChange={() => togglePage(i, p.value)}
                            />
                            {p.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleGenerate} variant="outline" disabled={generating} className="flex-1">
                Yeniden Oluştur
              </Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Kaydediliyor..." : `${results.filter((f) => f.selected).length} SSS Kaydet`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIFAQGenerator;

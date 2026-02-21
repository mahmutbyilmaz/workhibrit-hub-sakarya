import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import ContractPreview from "@/components/ContractPreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Search, Eye, Trash2, Loader2 } from "lucide-react";

const AdminContracts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  const { data: contracts, isLoading } = useQuery({
    queryKey: ["contracts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contracts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      toast.success("Sözleşme silindi");
    },
    onError: () => toast.error("Silme başarısız"),
  });

  const filtered = contracts?.filter((c) =>
    c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.company_name && c.company_name.toLowerCase().includes(search.toLowerCase()))
  );

  const viewingContract = contracts?.find((c) => c.id === viewing);

  if (viewingContract) {
    return (
      <AdminLayout>
        <ContractPreview content={viewingContract.rendered_content || ""} onBack={() => setViewing(null)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Sözleşmeler</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/admin/contracts/templates">Şablonlar</Link></Button>
          <Button asChild><Link to="/admin/contracts/new"><Plus className="mr-1 h-4 w-4" /> Yeni Sözleşme</Link></Button>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Müşteri veya şirket ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Başlangıç</TableHead>
                  <TableHead>Süre</TableHead>
                  <TableHead>Aylık Ücret</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered?.map((c) => {
                  const isExpired = new Date(c.end_date) < new Date();
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-medium">{c.customer_name}</div>
                        {c.company_name && <div className="text-xs text-muted-foreground">{c.company_name}</div>}
                      </TableCell>
                      <TableCell>{c.start_date}</TableCell>
                      <TableCell>{c.contract_duration} ay</TableCell>
                      <TableCell>₺{Number(c.monthly_price).toLocaleString("tr-TR")}</TableCell>
                      <TableCell>
                        <Badge variant={isExpired ? "secondary" : "default"}>
                          {isExpired ? "Süresi Dolmuş" : "Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setViewing(c.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {(!filtered || filtered.length === 0) && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Sözleşme bulunamadı.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminContracts;

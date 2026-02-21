import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, MailOpen, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !is_read })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_messages"] }),
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast({ title: "Mesaj silindi" });
    },
  });

  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Mesajlar</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} okunmamış mesaj` : "Tüm mesajlar okundu"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : !messages?.length ? (
        <p className="text-muted-foreground">Henüz mesaj yok.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.is_read ? "opacity-70" : "border-primary/30"}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{msg.name}</span>
                      {!msg.is_read && <Badge variant="default" className="text-xs">Yeni</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {msg.email} {msg.phone && `• ${msg.phone}`}
                    </p>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRead.mutate({ id: msg.id, is_read: msg.is_read })}
                      title={msg.is_read ? "Okunmadı işaretle" : "Okundu işaretle"}
                    >
                      {msg.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMessage.mutate(msg.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;

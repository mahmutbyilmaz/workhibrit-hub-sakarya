import { useEffect, useState } from "react";
import { Plus, Trash2, Key, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: "admin" | "editor" | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<string>("editor");
  const [changePassword, setChangePassword] = useState("");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const callApi = async (body: any) => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const fetchUsers = async () => {
    try {
      const data = await callApi({ action: "list" });
      setUsers(data);
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    try {
      await callApi({ action: "create", email: newEmail, password: newPassword, role: newRole });
      toast({ title: "Kullanıcı oluşturuldu" });
      setCreateOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewRole("editor");
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await callApi({ action: "update_role", user_id: userId, role: role || null });
      toast({ title: "Rol güncellendi" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
  };

  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    try {
      await callApi({ action: "update_password", user_id: selectedUser.id, password: changePassword });
      toast({ title: "Şifre güncellendi" });
      setPasswordOpen(false);
      setChangePassword("");
      setSelectedUser(null);
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await callApi({ action: "delete", user_id: userId });
      toast({ title: "Kullanıcı silindi" });
      fetchUsers();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    }
  };

  const getRoleBadge = (role: string | null) => {
    if (role === "admin") return <Badge className="bg-red-500/10 text-red-600 border-red-200">Admin</Badge>;
    if (role === "editor") return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Editör</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">Rol yok</Badge>;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Kullanıcı Yönetimi</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Yeni Kullanıcı</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="E-posta" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <Input placeholder="Şifre (min. 6 karakter)" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editör</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} className="w-full" disabled={!newEmail || newPassword.length < 6}>
                Oluştur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Password change dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Şifre Değiştir — {selectedUser?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Yeni şifre (min. 6 karakter)" type="password" value={changePassword} onChange={(e) => setChangePassword(e.target.value)} />
            <Button onClick={handlePasswordChange} className="w-full" disabled={changePassword.length < 6}>
              Şifreyi Güncelle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {loading ? (
        <p className="text-muted-foreground">Yükleniyor...</p>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{u.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Son giriş: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("tr-TR") : "Hiç"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(u.role)}
                  <Select value={u.role || ""} onValueChange={(v) => handleRoleChange(u.id, v)}>
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Rol seç" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editör</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(u); setChangePassword(""); setPasswordOpen(true); }}>
                    <Key className="h-4 w-4" />
                  </Button>
                  {u.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;

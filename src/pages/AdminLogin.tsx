import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { signIn, signUp, user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to admin when authenticated with a role
  useEffect(() => {
    if (!loading && user && role) {
      navigate("/admin", { replace: true });
    }
  }, [loading, user, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isRegister) {
      const { error } = await signUp(email, password);
      setIsSubmitting(false);
      if (error) {
        toast({ title: "Kayıt başarısız", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Kayıt başarılı", description: "Şimdi giriş yapabilirsiniz." });
        setIsRegister(false);
      }
    } else {
      const { error } = await signIn(email, password);
      setIsSubmitting(false);
      if (error) {
        toast({ title: "Giriş başarısız", description: error.message, variant: "destructive" });
      }
      // Navigation will happen via useEffect when auth state updates
    }
  };

  // Don't block login page with loading spinner

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-2 font-display text-2xl font-extrabold text-primary">
            Work<span className="text-accent">hibrit</span>
          </div>
          <CardTitle className="text-lg">Yönetim Paneli Girişi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "İşleniyor..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
            </Button>
            <button type="button" className="w-full text-center text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

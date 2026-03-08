import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, HelpCircle, Image, Settings, LogOut, MessageSquare, Sliders, Layout, Info, FileSignature, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "İçerik Yönetimi", href: "/admin/content", icon: Layout },
  { label: "Hakkımızda", href: "/admin/about", icon: Info },
  { label: "Blog Yazıları", href: "/admin/blog", icon: FileText },
  { label: "SSS Yönetimi", href: "/admin/faq", icon: HelpCircle },
  { label: "Mesajlar", href: "/admin/messages", icon: MessageSquare },
  { label: "Medya", href: "/admin/media", icon: Image },
  { label: "SEO Ayarları", href: "/admin/seo", icon: Settings },
  { label: "Sözleşmeler", href: "/admin/contracts", icon: FileSignature },
  { label: "Kullanıcılar", href: "/admin/users", icon: Users },
  { label: "Site Ayarları", href: "/admin/settings", icon: Sliders },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { signOut, user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background">
        <div className="border-b p-4">
          <Link to="/" className="font-display text-xl font-extrabold text-primary">
            Work<span className="text-accent">hibrit</span>
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href || (link.href !== "/admin" && location.pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <div className="mb-2 px-3 text-xs text-muted-foreground">
            {user?.email}
            <br />
            <span className="capitalize">{role}</span>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;

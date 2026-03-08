import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import SanalOfisSakarya from "./pages/SanalOfisSakarya";
import SanalOfisFiyatlari from "./pages/SanalOfisFiyatlari";
import CoworkingSakarya from "./pages/CoworkingSakarya";
import ToplantiOdasiSakarya from "./pages/ToplantiOdasiSakarya";
import HazirOfis from "./pages/HazirOfis";
import Hakkimizda from "./pages/Hakkimizda";
import Iletisim from "./pages/Iletisim";
import SSS from "./pages/SSS";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminFAQ from "./pages/AdminFAQ";
import AdminMedia from "./pages/AdminMedia";
import AdminSEO from "./pages/AdminSEO";
import AdminMessages from "./pages/AdminMessages";
import AdminSettings from "./pages/AdminSettings";
import AdminContent from "./pages/AdminContent";
import AdminAbout from "./pages/AdminAbout";
import AdminContracts from "./pages/AdminContracts";
import AdminContractNew from "./pages/AdminContractNew";
import AdminContractTemplates from "./pages/AdminContractTemplates";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/sanal-ofis-sakarya" element={<SanalOfisSakarya />} />
            <Route path="/sanal-ofis-fiyatlari" element={<SanalOfisFiyatlari />} />
            <Route path="/coworking-sakarya" element={<CoworkingSakarya />} />
            <Route path="/toplanti-odasi-sakarya" element={<ToplantiOdasiSakarya />} />
            <Route path="/hazir-ofis" element={<HazirOfis />} />
            <Route path="/hakkimizda" element={<Hakkimizda />} />
            <Route path="/iletisim" element={<Iletisim />} />
            <Route path="/sikca-sorulan-sorular" element={<SSS />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
            <Route path="/admin/blog/:id" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
            <Route path="/admin/faq" element={<ProtectedRoute><AdminFAQ /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
            <Route path="/admin/seo" element={<ProtectedRoute requiredRole="admin"><AdminSEO /></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettings /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
            <Route path="/admin/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
            <Route path="/admin/contracts" element={<ProtectedRoute><AdminContracts /></ProtectedRoute>} />
            <Route path="/admin/contracts/new" element={<ProtectedRoute><AdminContractNew /></ProtectedRoute>} />
            <Route path="/admin/contracts/templates" element={<ProtectedRoute><AdminContractTemplates /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

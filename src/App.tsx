import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

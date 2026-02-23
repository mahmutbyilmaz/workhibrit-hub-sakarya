import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <SEOHead title="Sayfa Bulunamadı | Sakarya Sanal Ofis" description="Aradığınız sayfa bulunamadı." />
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-display text-6xl font-extrabold text-primary">404</h1>
          <p className="mb-6 text-xl text-muted-foreground">Aradığınız sayfa bulunamadı.</p>
          <Link to="/" className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { LocalBusinessSchema, OrganizationSchema, WebSiteSchema } from "./JsonLd";

const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <LocalBusinessSchema />
    <OrganizationSchema />
    <WebSiteSchema />
    <Header />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default Layout;

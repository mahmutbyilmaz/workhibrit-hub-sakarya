

# Workhibrit — Sakarya Sanal Ofis Website

A full-stack, SEO/AEO-optimized local business website with an integrated admin panel for the Workhibrit brand at sakaryasanalofis.com.

---

## Phase 1: Public Website

### Homepage
- Clean, corporate hero section with Workhibrit text logo and tagline: *"Sakarya'da sanal ofis ve coworking hizmeti sunan yerel bir ofis çözümleri markasıdır."*
- Services overview cards (Sanal Ofis, Coworking, Toplantı Odası, Hazır Ofis)
- Pricing summary section with comparison table
- Customer testimonials carousel
- FAQ accordion (auto-generates FAQ Schema JSON-LD)
- Google Maps embed
- Trust elements (years in business, customer count, badges)
- Floating WhatsApp button + click-to-call

### Service Pages (5 pages)
- `/sanal-ofis-sakarya` — Virtual Office details
- `/sanal-ofis-fiyatlari` — Virtual Office pricing
- `/coworking-sakarya` — Coworking space details
- `/toplanti-odasi-sakarya` — Meeting rooms
- `/hazir-ofis` — Ready office solutions

Each page includes: service details, benefits list, pricing, FAQ section, internal links to related pages, and CTA buttons (WhatsApp/call/form).

### Corporate Pages
- `/hakkimizda` — Brand story and mission
- `/iletisim` — Contact form, address, phone, working hours, Google Maps
- `/sikca-sorulan-sorular` — Full FAQ page with categorized questions
- `/blog` — Blog listing page with article cards

### Blog Article Pages
- `/blog/:slug` — Individual blog posts with proper heading structure, FAQ section per article, and internal links
- Placeholder articles on topics like "Sanal ofis yasal mı?", "Vergi avantajları", "Coworking nedir?"

### SEO & AEO Features
- Structured data (JSON-LD) on every page: LocalBusiness, Organization, FAQPage, Article
- SEO meta tags (title, description, keywords) on all pages
- Clean URL structure in Turkish
- Internal linking between related pages
- Mobile-first responsive design
- All content in Turkish with placeholder text

### Conversion Elements
- Floating WhatsApp button (site-wide)
- Contact form on contact page
- Click-to-call phone links
- CTA sections on every page
- Pricing comparison tables

---

## Phase 2: Backend & Admin Panel (Lovable Cloud + Supabase)

### Authentication & Roles
- Secure login page for admin panel
- Two roles: Admin (full access) and Editor (blog/FAQ only)

### Blog Management
- Create, edit, delete blog posts
- Fields: title, URL slug, meta title, meta description, keywords, featured image, rich text content (full editor with headings, bold, italic, links, images, tables, embeds)
- FAQ section builder per blog post
- Publish/Draft status toggle
- Automatic Article + FAQ Schema generation

### FAQ Manager
- Standalone FAQ management system
- Add/edit/delete questions and answers
- Categories: Sanal Ofis, Coworking, Fiyat, Genel
- Drag-to-reorder questions
- Assign FAQs to specific pages
- Auto-generates FAQ Schema JSON-LD

### Page Content Editor
- Edit homepage content blocks, service pages, pricing tables, about page, and contact info
- Modular content blocks: Text, Image, Pricing Table, FAQ Block, CTA Button
- No coding required for staff

### Media Library
- Upload, delete, and browse images
- Reuse images across pages and blog posts

### Local SEO Settings
- Editable business info: name, address, phone, working hours, Google Maps link
- Auto-updates LocalBusiness and Organization Schema across the site

---

## Design Direction
- Corporate, modern, trust-focused design
- Clean white background with professional blue/dark accent colors
- Strong CTA visibility with contrasting buttons
- Mobile-first responsive layout
- Minimal and conversion-oriented


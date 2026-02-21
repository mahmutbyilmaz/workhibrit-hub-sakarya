

# Logo Degisikligi ve Zamanlanmis Yayin Ozelligi

## 1. Logo ve Marka Adi Degisikligi: "Workhibrit" -> "Sakarya Sanal Ofis"

Sitedeki tum "Workhibrit" referanslari "Sakarya Sanal Ofis" olarak guncellenecek:

- **Header.tsx**: Fallback metin logosu "Sakarya Sanal Ofis" olarak degisecek, img alt metni guncellenecek
- **Footer.tsx**: Footer'daki marka adi "Sakarya Sanal Ofis" olarak degisecek
- **SEO basliklarindaki tum sayfalar**: Index, Blog, SSS, Iletisim, SanalOfisSakarya, SanalOfisFiyatlari, HazirOfis, ToplantiOdasiSakarya, CoworkingSakarya, Hakkimizda sayfalarindaki SEO title/description'lardaki "Workhibrit" -> "Sakarya Sanal Ofis"
- **generate-content edge function**: AI icerik uretimindeki marka referanslari guncellenecek

## 2. Blog Yazilari Icin Zamanlanmis Yayin

### Veritabani Degisikligi
`blog_posts` tablosuna `scheduled_at` (timestamp with time zone, nullable) kolonu eklenecek.

### Yayin Mantigi
- Yazi durumu `scheduled` olabilecek (mevcut `draft` ve `published` yaninda)
- `scheduled_at` tarihi gecmis ise ve durum `scheduled` ise, yazi otomatik olarak `published` olacak
- Blog listeleme sorgulari hem `published` durumunu hem de `scheduled_at < now()` kosulunu kontrol edecek

### Blog Editoru (AdminBlogEditor.tsx)
- Detaylar kartina tarih ve saat secici eklenecek (Popover + Calendar + saat input)
- "Zamanla" butonu eklenecek: secilen tarihte otomatik yayinlanmak uzere kaydeder
- Status badge'e "Zamanlanmis" durumu eklenecek (mavi renk)

### Blog Listesi (AdminBlog.tsx)
- Zamanlanmis yazilarda tarih bilgisi gosterilecek
- Badge olarak "Zamanlanmis: 25 Sub 2026 14:00" gibi bilgi gorunecek

### Herkese Acik Blog Sayfasi (Blog.tsx)
- Sorgu guncellenerek `scheduled` durumundaki ve `scheduled_at` gecmis olan yazilari da gosterecek

### Otomatik Yayin Mekanizmasi
Zamanlanmis yazilarin otomatik yayinlanmasi icin iki yaklasim birlikte kullanilacak:
- **Sorgu bazli**: Blog sayfasi sorgularken `scheduled_at <= now()` olan yazilari da gosterecek (aninda gorunurluk)
- **pg_cron ile periyodik guncelleme**: Her 5 dakikada bir zamanlanmis yazilarin durumunu `published` olarak guncelleyen bir cron job (admin panelinde dogrudan gorunurluk icin)

## 3. SSS (FAQ) Icin Zamanlanmis Yayin

### Veritabani Degisikligi
`faqs` tablosuna:
- `status` kolonu (text, default 'published') -- mevcut tum FAQ'lar yayinda kalacak
- `scheduled_at` kolonu (timestamp with time zone, nullable)

### Admin SSS Sayfasi (AdminFAQ.tsx)
- SSS ekleme/duzenleme dialog'una tarih ve saat secici eklenecek
- "Zamanla" secenegi: secilen tarihte otomatik yayinlanacak
- Listede zamanlanmis SSS'ler icin bilgi gosterilecek

### Herkese Acik SSS Sayfasi (SSS.tsx)
- Sorgu guncellenerek sadece aktif (published veya scheduled_at gecmis) SSS'leri gosterecek

## Teknik Detaylar

**Veritabani migration'lari:**
- `blog_posts` tablosuna `scheduled_at` kolonu eklenmesi
- `faqs` tablosuna `status` ve `scheduled_at` kolonlari eklenmesi
- RLS politikalarinin guncellenmesi (scheduled durumundaki yazilarin sadece admin tarafindan gorunmesi)

**Degisecek dosyalar:**
- `src/components/Header.tsx` -- Logo metin degisikligi
- `src/components/Footer.tsx` -- Marka adi degisikligi
- `src/pages/Index.tsx`, `Blog.tsx`, `SSS.tsx`, `Iletisim.tsx`, `SanalOfisSakarya.tsx`, `SanalOfisFiyatlari.tsx`, `HazirOfis.tsx`, `ToplantiOdasiSakarya.tsx`, `CoworkingSakarya.tsx`, `Hakkimizda.tsx` -- SEO basliklarinda marka adi
- `supabase/functions/generate-content/index.ts` -- AI prompt'larda marka adi
- `src/pages/AdminBlogEditor.tsx` -- Tarih/saat secici ve zamanla butonu
- `src/pages/AdminBlog.tsx` -- Zamanlanmis durum gosterimi
- `src/pages/Blog.tsx` -- Sorgu guncelleme
- `src/pages/AdminFAQ.tsx` -- SSS'e zamanlama eklenmesi
- `src/pages/SSS.tsx` -- Sorgu guncelleme


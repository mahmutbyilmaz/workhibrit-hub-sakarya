

# Site Hata ve SEO Analiz Raporu

## Mevcut Hatalar

### 1. 404 Sayfasi Ingilizce
`NotFound.tsx` sayfasi tamamen Ingilizce ("Oops! Page not found"). Turkce olmali.

### 2. Harita Embed URL'sinde Bos API Key
`toEmbedUrl` fonksiyonunda place ismi uzerinden olusturulan URL'de `key=` bos birakilmis. Bu durumda Google Maps Embed API calismaz.

### 3. Open Graph Etiketleri Alt Sayfalarda Eksik
`SEOHead` komponenti sadece `title`, `description`, `keywords` ve `canonical` ayarliyor. Alt sayfalarda `og:title`, `og:description`, `og:image`, `twitter:card` gibi sosyal medya paylasim etiketleri dinamik olarak ayarlanmiyor. Sadece `index.html`'deki statik degerler kullaniliyor.

---

## SEO Iyilestirme Onerileri

### 4. Sitemap.xml Olusturulmali (Kritik)
Sitede `sitemap.xml` yok. Arama motorlarinin sayfalari kesfetmesi icin sitemap sart. Blog yazilari dahil tum sayfalarin otomatik listesi olusturulmali.

### 5. robots.txt'ye Sitemap Eklenmeli
`robots.txt` dosyasinda `Sitemap: https://sakaryasanalofis.com/sitemap.xml` satirisi eksik.

### 6. BreadcrumbList Schema Eklenmeli
Alt sayfalarda breadcrumb (icerik haritasi) yapisi ve buna uygun `BreadcrumbList` schema markup'i eklenirse Google arama sonuclarinda breadcrumb gosterir.

### 7. Service Schema Eklenmeli
Hizmet sayfalarinda (`SanalOfisSakarya`, `CoworkingSakarya`, `ToplantiOdasiSakarya`, `HazirOfis`) `Service` tipi schema markup eklenirse arama motorlari hizmetleri daha iyi anlar.

### 8. WebSite Schema Eklenmeli
Ana sayfada `WebSite` schema'si (site adi, URL, arama fonksiyonu) eklenirse Google'da site baglantilari (sitelinks) gorunme olasiligi artar.

### 9. Blog Gorsellerinde width/height Eksik
Blog listesi ve yazilarindaki gorsellerde `width` ve `height` belirtilmemis. Bu, CLS (Cumulative Layout Shift) sorununa yol acar ve Core Web Vitals puanini dusurur.

### 10. Footer'da Email Linki Eksik
Footer'da email bilgisi gosterilmiyor, sadece telefon var. Email de eklenmeli.

---

## Uygulama Plani

### Dosya 1: `src/components/SEOHead.tsx`
- `og:title`, `og:description`, `og:url`, `og:type` meta etiketlerini dinamik olarak ayarlayan kod eklenecek
- `twitter:card`, `twitter:title`, `twitter:description` eklenecek
- Opsiyonel `ogImage` prop'u ile sosyal medya gorseli destegi

### Dosya 2: `src/pages/NotFound.tsx`
- Sayfa icerigini Turkceye cevirme
- Layout komponenti ile sarmallama (header/footer gosterimi)
- Ana sayfaya yonlendirme linki

### Dosya 3: `public/robots.txt`
- `Sitemap: https://sakaryasanalofis.com/sitemap.xml` satiri eklenmesi

### Dosya 4: `src/components/JsonLd.tsx`
- `WebSiteSchema` komponenti eklenmesi
- `ServiceSchema` komponenti eklenmesi
- `BreadcrumbSchema` komponenti eklenmesi

### Dosya 5: `src/components/Layout.tsx`
- `WebSiteSchema` eklenmesi

### Dosya 6: Hizmet sayfalari (SanalOfisSakarya, CoworkingSakarya, vb.)
- `ServiceSchema` eklenmesi

### Dosya 7: `public/sitemap.xml` (Yeni dosya)
- Tum sayfalarin statik sitemap dosyasi olusturulmasi
- Blog yazilari icin de temel URL'ler eklenmesi

### Dosya 8: `src/components/Footer.tsx`
- Email linkinin eklenmesi

## Degisecek Dosyalar
1. `src/components/SEOHead.tsx` - OG ve Twitter etiketleri
2. `src/pages/NotFound.tsx` - Turkce icerik
3. `public/robots.txt` - Sitemap yolu
4. `src/components/JsonLd.tsx` - Yeni schema'lar
5. `src/components/Layout.tsx` - WebSite schema
6. `src/pages/SanalOfisSakarya.tsx` - Service schema
7. `public/sitemap.xml` - Yeni dosya
8. `src/components/Footer.tsx` - Email linki

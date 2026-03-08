

# Google Hizli Indeksleme ve Blog YouTube Video Destegi

## 1. Google Hizli Indeksleme Icin Yapilacaklar

### IndexNow API Entegrasyonu
IndexNow, Google ve Bing'e yeni/guncellenen sayfayi aninda bildiren bir protokol. Blog yazisi yayinlandiginda otomatik olarak arama motorlarina bildirim gonderilecek.

- **Edge function** olusturulacak: `notify-indexnow`
- Blog yazisi `published` durumuna gectiginde bu fonksiyon cagirilacak
- IndexNow API key dosyasi `public/` klasorune eklenecek

### Dinamik Sitemap
Mevcut `sitemap.xml` statik. Blog yazilari eklendikce guncellenmesi gerekiyor.
- Bir edge function olusturulacak: `generate-sitemap`
- Veritabanindaki tum yayinlanmis blog yazilari + statik sayfalar dahil edilecek
- `lastmod` tarihleri eklenecek

### Blog Yazilarinda VideoObject Schema
YouTube video eklenen bloglarda `VideoObject` schema markup otomatik eklenecek. Bu Google Video aramasinda gorunmeyi saglar.

---

## 2. YouTube Video Destegi

### TipTap Editore YouTube Butonu
- TipTap editorune YouTube ikonu ile yeni bir buton eklenecek
- Kullanici YouTube linkini yapistirdiginda otomatik olarak responsive iframe embed koduna donusturulecek
- TipTap `@tiptap/extension-youtube` yerine basit bir custom node veya `iframe` extension kullanilacak (ek paket gerektirmemesi icin HTML iframe olarak eklenecek)

### BlogPost.tsx'de Video Gosterimi
- `dangerouslySetInnerHTML` zaten iframe'leri render edebilir
- CSS ile iframe'lerin responsive gorunmesi saglanacak (`aspect-ratio: 16/9`, `max-width: 100%`)

### Admin Blog Editoru
- Ayrica sidebar'a "YouTube Video URL" alani eklenecek (opsiyonel)
- Bu alan `blog_posts` tablosuna `video_url` kolonu olarak eklenecek
- Video varsa blog yazisinin basinda otomatik olarak gosterilecek
- Video varsa `VideoObject` schema da otomatik eklenecek

---

## Degisecek Dosyalar

1. **Veritabani migrasyonu** - `blog_posts` tablosuna `video_url` kolonu eklenmesi
2. **`src/components/TipTapEditor.tsx`** - YouTube embed butonu eklenmesi
3. **`src/pages/BlogPost.tsx`** - Video gosterimi, responsive iframe CSS, VideoObject schema
4. **`src/pages/AdminBlogEditor.tsx`** - YouTube Video URL alani (sidebar'da)
5. **`src/components/JsonLd.tsx`** - `VideoObjectSchema` komponenti
6. **`src/index.css`** - Prose icindeki iframe'ler icin responsive stiller
7. **`supabase/functions/generate-sitemap/index.ts`** (yeni) - Dinamik sitemap
8. **`supabase/functions/notify-indexnow/index.ts`** (yeni) - IndexNow bildirimi
9. **`public/sitemap.xml`** - Kaldirilacak (dinamik sitemap ile degistirilecek)




# Blog Hatalari Duzeltme

## Sorun 1: "blog_posts_status_check" Hatasi
Veritabanindaki `blog_posts_status_check` constraint'i sadece `draft` ve `published` degerlerine izin veriyor. Zamanlanmis yayin secildiginde kod `scheduled` statusu gonderiyor ve bu constraint'e takilarak hata veriyor.

### Cozum
Veritabani constraint'i guncellenecek: `scheduled` degeri de izin verilen statusler arasina eklenecek.

```sql
ALTER TABLE blog_posts DROP CONSTRAINT blog_posts_status_check;
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_status_check
  CHECK (status = ANY (ARRAY['draft', 'published', 'scheduled']));
```

---

## Sorun 2: AI Blog SSS'lerini SSS Bolumune Ekleyememe
AI ile blog yazisi olusturuldigunda gelen SSS onerileri sadece blog yazisinin icerisine ekleniyor. Kullanicinin bu SSS'leri ayrica site genelindeki `faqs` tablosuna da kaydetmesi icin bir buton bulunmuyor.

### Cozum
`AdminBlogEditor.tsx` dosyasindaki SSS bolumune bir "SSS'lere Kaydet" butonu eklenecek. Bu buton, blog yazisindaki FAQ'lari `faqs` tablosuna toplu olarak insert edecek.

### Teknik Detay
- SSS kartinin header bolumune "Ekle" butonunun yanina "SSS Tablosuna Kaydet" butonu eklenecek
- Buton tiklandiginda `faqs` tablosuna INSERT yapilacak (question, answer, category alanlari doldurularak)
- Basarili kayit sonrasi toast bildirimi gosterilecek

---

## Degisecek Dosyalar

1. **Veritabani migrasyonu** -- `blog_posts_status_check` constraint'ine `scheduled` eklenmesi
2. **`src/pages/AdminBlogEditor.tsx`** -- SSS bolumune "SSS Tablosuna Kaydet" butonu eklenmesi

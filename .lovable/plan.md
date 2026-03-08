
# Zamanlanmis Blog Yazilari Sorunu Cozumu

## Sorun
Zamanlanmis blog yazilari, belirlenen tarih ve saat gectikten sonra bile `scheduled` durumunda kaliyor ve yayina gecmiyor. Iki farkli sorun var:

1. **BlogPost.tsx**: Tekil yazi sayfasi sadece `status = "published"` filtreliyor. Zamani gecmis `scheduled` yazilar acildiginda "Yazi bulunamadi" gosteriliyor.
2. **Otomatik durum guncelleme yok**: Veritabaninda yazilarin durumunu `scheduled` -> `published` olarak degistiren bir mekanizma bulunmuyor. Blog listesi sayfasi (Blog.tsx) bunu client-side `.or()` filtresiyle gecici olarak cozmus, ama asil cozum veritabani tarafinda olmali.

## Veritabanindaki Mevcut Durum
| Yazi | scheduled_at | status |
|------|-------------|--------|
| Girisimcinin Yeni Rotasi | 22 Subat 06:00 (gecmis!) | scheduled |
| Sanal Ofiste Limited Sirket | 23 Subat 07:00 | scheduled |

Her iki yazi da taslak gibi kaliyor cunku hicbir mekanizma durumu degistirmiyor.

## Cozum Plani

### 1. Veritabani: Otomatik yayinlama fonksiyonu ve cron job
Bir PostgreSQL fonksiyonu olusturulacak: zamani gecmis `scheduled` yazilarin durumunu otomatik olarak `published` olarak guncelleyecek. Bu fonksiyon `pg_cron` uzantisi veya bir Supabase cron ile periyodik olarak calisacak.

SQL fonksiyonu:
- `scheduled` durumundaki ve `scheduled_at <= now()` olan tum yazilarin statusunu `published` olarak gunceller
- Her 5 dakikada bir calistirilir (pg_cron ile)

### 2. BlogPost.tsx: Filtre guncelleme
Tekil yazi sayfasindaki sorgu, RLS politikasina uyumlu hale getirilecek:
- Mevcut: `.eq("status", "published")`
- Yeni: `.or("status.eq.published,and(status.eq.scheduled,scheduled_at.lte.now())")` 

Bu sayede cron job calismadan once bile zamani gecmis zamanlanmis yazilar goruntulenebilecek.

### 3. Mevcut zamani gecmis yazilarin durumunu guncelleme
Migrasyon icinde mevcut zamani gecmis scheduled yazilarin durumu hemen `published` olarak guncellenecek.

## Degisecek Dosyalar
1. **Veritabani migrasyonu** (yeni) - `publish_scheduled_posts` fonksiyonu, cron job ve mevcut veri guncelleme
2. **`src/pages/BlogPost.tsx`** - Tekil yazi sorgusundaki filtre duzeltmesi

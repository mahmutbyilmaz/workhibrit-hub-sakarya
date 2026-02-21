

# Admin Paneli Gelistirme: Sosyal Medya, Footer ve Logo Yonetimi

## Mevcut Durum
- `site_settings` tablosunda telefon, e-posta, adres, WhatsApp, Instagram ve LinkedIn kayitlari zaten var
- Ancak Twitter/X linki eksik ve footer'da sosyal medya ikonlari gorunmuyor
- Header'daki logo sabit metin ("Workhibrit") olarak kodlanmis, degistirilemez
- Admin ayarlar sayfasi sadece basit bir form, kategorilere ayrilmamis

## Yapilacaklar

### 1. Veritabani: Yeni Ayar Satirlari Ekleme
- `site_settings` tablosuna `footer_twitter` ve `header_logo_url` satirlari eklenecek
- Mevcut satirlar korunacak

### 2. Admin Ayarlar Sayfasini Yeniden Yapilandirma
Sayfa kartlara bolunecek:

**Iletisim Bilgileri Karti:** Telefon, E-posta, WhatsApp, Adres (mevcut alanlar)

**Sosyal Medya Karti:** Instagram URL, LinkedIn URL, Twitter/X URL (yeni)

**Logo Karti:** Mevcut logo on izlemesi, yeni logo yuklemek icin dosya secici (media bucket'a yuklenecek), URL olarak kaydedilecek

### 3. Footer'a Sosyal Medya Ikonlari Ekleme
- Footer iletisim bolumunun altina Instagram, LinkedIn ve Twitter/X ikonlari eklenecek
- Linkleri `site_settings` tablosundan dinamik olarak cekilecek
- Bos olan linkler icin ikon gosterilmeyecek

### 4. Header Logosunu Dinamik Yapma
- Header'daki sabit "Workhibrit" metni yerine, eger `header_logo_url` ayarlanmissa resim gosterilecek
- Logo ayarlanmamissa mevcut metin logosu korunacak (fallback)

## Teknik Detaylar

**Veritabani degisikligi:**
- `site_settings` tablosuna 2 yeni satir INSERT edilecek: `footer_twitter`, `header_logo_url`

**Degisecek dosyalar:**
- `src/pages/AdminSettings.tsx` -- Kategorilere ayrilmis form, logo yukleme alani, Twitter/X alani eklenmesi
- `src/components/Footer.tsx` -- Sosyal medya ikonlari (Instagram, LinkedIn, Twitter/X) eklenmesi
- `src/components/Header.tsx` -- Dinamik logo destegi (resim veya metin fallback)
- `src/hooks/useBusinessData.ts` -- Sosyal medya ve logo URL'lerini de dondurecek sekilde genisletilmesi

**Logo yukleme akisi:**
- Admin panelinde dosya secilecek
- Mevcut `media` storage bucket'ina yuklenecek
- Yuklenen dosyanin public URL'i `site_settings` tablosuna `header_logo_url` olarak kaydedilecek


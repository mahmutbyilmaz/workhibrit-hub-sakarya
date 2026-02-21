

# Blog Yayınlama Deneyimini Iyilestirme

## Sorun
Blog yazilari olusturulurken varsayilan durum "Taslak" olarak ayarlaniyor. Yayinlamak icin editordeki kucuk dropdown'dan "Yayinla" secilmesi gerekiyor, ancak bu secici kolayca gozden kaciyor. Ayrica blog listesinden hizli yayinlama secenegi bulunmuyor.

## Yapilacaklar

### 1. Blog Editorunde Belirgin Yayinla Butonu
- Mevcut kucuk dropdown'u kaldirmak yerine, yanina buyuk ve renkli bir "Yayinla" / "Taslaga Al" toggle butonu eklenecek
- Yazi taslak durumundaysa yesil "Yayinla" butonu, yayindaysa turuncu "Taslaga Al" butonu gorunecek
- Kaydet butonunun yaninda durumu acikca gosteren bir Badge eklenecek

### 2. Blog Listesinde Hizli Yayinlama
- `AdminBlog.tsx` sayfasindaki her blog satrina bir Switch (toggle) eklenecek
- Bu switch ile listeden cikmadan tek tikla yayinla/taslaga al islemi yapilabilecek
- Durum degistiginde aninda veritabaninda guncellenecek

### 3. Varsayilan Durum Uyarisi
- Yeni bir yazi kaydedilirken durum hala "Taslak" ise kullaniciya "Bu yazi taslak olarak kaydedilecek. Yayinlamak ister misiniz?" seklinde bir onay dialog'u gosterilecek

## Teknik Detaylar

**Degisecek dosyalar:**
- `src/pages/AdminBlogEditor.tsx` -- Belirgin yayinla butonu ve kaydetme oncesi taslak uyarisi eklenmesi
- `src/pages/AdminBlog.tsx` -- Blog listesine hizli yayinla/taslaga al Switch bileseninin eklenmesi

**Veritabani degisikligi:** Gerekmiyor. Mevcut `status` alani (`draft` / `published`) zaten uygun sekilde calisiyor.


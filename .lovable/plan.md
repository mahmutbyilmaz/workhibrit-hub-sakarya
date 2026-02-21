

# Harita "Baglanti Reddedildi" Sorunu Cozumu

## Sorunun Sebebi
Veritabanindaki `maps_embed` alaninda normal bir Google Maps linki kayitli:
`https://www.google.com/maps/place/Ofisada+Plaza/@40.777733,...`

Google, bu tur linklerin iframe icinde gosterilmesine izin vermiyor. iframe icin ozel **embed** formati gerekiyor:
`https://www.google.com/maps/embed?pb=...`

## Cozum Yaklasimi
Kod tarafinda bir donusturucu ekleyecegiz. Boylece admin panelinden herhangi bir Google Maps linki girildiginde, sistem bunu otomatik olarak embed formatina cevirecek. Ayrica fallback olarak place ID uzerinden embed URL olusturulacak.

### Degisiklikler

**Dosya: `src/pages/Index.tsx`**
- Harita iframe'ine verilen URL'yi render etmeden once kontrol eden bir yardimci fonksiyon eklenecek
- Eger URL zaten embed formatindaysa (`/maps/embed` iceriyorsa) oldugu gibi kullanilacak
- Eger standart Google Maps linki ise (`/maps/place/` iceriyorsa), koordinatlar cikarilarak embed URL'sine donusturulecek
- Donusum yapilamazsa, statik varsayilan embed URL'si kullanilacak

### Teknik Detay
Mevcut URL'den koordinatlar (`@40.777733,30.4021291`) cikarilip soyle bir embed URL'sine donusturulecek:
`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1500!2d30.4021291!3d40.777733!...`

Bu sayede admin panelinden hangi formatta link girilirse girilsin harita dogru calisacak.

## Degisecek Dosyalar
1. `src/pages/Index.tsx` - URL donusturucu fonksiyon ve harita bolumu guncellemesi



# Harita Sorunu Cozumu

## Sorun
Ana sayfa (`Index.tsx`) harita icin veritabanindaki ayarlari degil, kodda sabit yazilmis eski Google Maps linkini kullaniyor. Ayrica veritabaninda `maps_embed` anahtari bulunmuyor, bu da admin panelinden yapilan guncellemenin kaydedilmedigini gosteriyor.

## Cozum

### 1. Ana sayfadaki haritayi dinamik hale getir
`src/pages/Index.tsx` dosyasinda harita bolumu su anda sabit `business.mapsEmbed` degerini kullaniyor. Bunu `useBusinessData` hook'undan veya dogrudan veritabanindan cekilecek sekilde guncelleyecegiz.

### 2. useBusinessData hook'una harita verileri ekle
`src/hooks/useBusinessData.ts` dosyasina `mapsEmbed` ve `mapsLink` alanlari eklenecek, boylece tum sayfalarda veritabanindan gelen deger oncelikli olacak.

### 3. Admin panelinde kayit kontrolu
Admin SEO sayfasinda `maps_embed` ve `maps_link` alanlari zaten tanimli. Kullanicinin bu alanlari admin panelinden tekrar kaydetmesi gerekebilir.

## Teknik Detaylar

**Dosya 1: `src/hooks/useBusinessData.ts`**
- `mapsEmbed` alani eklenecek: `settings?.maps_embed || business.mapsEmbed`
- `mapsLink` alani eklenecek: `settings?.maps_link || business.mapsLink`

**Dosya 2: `src/pages/Index.tsx`**
- `useBusinessData()` hook'undan `mapsEmbed` alinacak
- Harita iframe'indeki `src={business.mapsEmbed}` ifadesi `src={mapsEmbed}` olarak degistirilecek

## Degisecek Dosyalar
1. `src/hooks/useBusinessData.ts`
2. `src/pages/Index.tsx`

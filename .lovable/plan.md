

# Ana Sayfaya Hizmet Slider'i Ekleme

## Ozet
Hero bolumunun hemen altina (veya yerine) hizmetleri gosteren bir slider/carousel eklenecek. Admin panelinden slider icerigini duzenleyebileceksiniz.

## Yapilacaklar

### 1. Veritabani: Slider Verisi
- `page_content` tablosuna `hero_slider` block_type'inda yeni bir satir eklenecek
- Her slide icin: baslik, aciklama, buton metni, buton linki, arka plan resmi (opsiyonel), ikon
- Varsayilan olarak mevcut 4 hizmet (Sanal Ofis, Coworking, Toplanti Odasi, Hazir Ofis) slider'a eklenecek

### 2. Ana Sayfa Slider Bileseni
- Mevcut `embla-carousel-react` kutuphanesi kullanilacak (zaten yuklu)
- Hero bolumunun altina tam genislikte bir slider eklenecek
- Her slide'da: hizmet ikonu, baslik, aciklama, fiyat ve CTA butonu
- Otomatik gecis (5 saniye aralikla), nokta navigasyon ve ok butonlari
- Mobil uyumlu tasarim

### 3. Admin Paneli: Slider Duzenleyici
- `AdminContent.tsx` sayfasindaki tab listesine "Slider" sekme eklenecek
- Her slide icin duzenlenebilir alanlar: baslik, aciklama, buton metni, buton linki, ikon secimi, arka plan resmi yukleme
- Slide ekleme, silme ve siralama

## Teknik Detaylar

**Veritabani:** `page_content` tablosuna INSERT -- `hero_slider` block_type'inda varsayilan hizmet slide'lari

**Degisecek dosyalar:**
- `src/pages/Index.tsx` -- Slider bileseni eklenmesi, `page_content`'ten `hero_slider` verisinin cekilmesi
- `src/pages/AdminContent.tsx` -- "Slider" sekmesi ve SliderEditor bileseni eklenmesi

**Slider veri yapisi (her slide):**
```text
{
  title: "Sanal Ofis",
  description: "Prestijli bir is adresi ile sirketinizi temsil edin.",
  buttonText: "Detaylar",
  buttonLink: "/sanal-ofis-sakarya",
  icon: "Building2",
  bgImage: "" (opsiyonel)
}
```

**Carousel ozellikleri:**
- Otomatik oynatma (autoplay) 5 saniye aralikla
- Nokta gostergeleri (dots)
- Sol/sag ok navigasyon
- Sonsuz dongu (loop)
- Dokunmatik/swipe destegi (embla varsayilan)

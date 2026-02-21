

# Sanal Ofis Fiyatlari Sayfa Yonetimi ve Sozlesme Olusturucu Modulu

## Ozet
Iki buyuk ozellik eklenecek:
1. Sanal Ofis Fiyatlari sayfasinin admin panelinden duzenlenmesi
2. Sozlesme olusturucu modulu (sablon, form, onizleme, yazdirma/PDF, listeleme)

---

## Bolum 1: Sanal Ofis Fiyatlari Sayfa Yonetimi

### 1.1 Veritabani
- `page_content` tablosuna `pricing_plans` block_type'i eklenecek (constraint guncelleme gerekli)
- Varsayilan 3 paket (Baslangic, Profesyonel, Premium) INSERT edilecek
- Veri yapisi: `[{ name, price, period, features: string[], popular: boolean }]`

### 1.2 Admin Paneli
- `AdminContent.tsx` tablistesine "Fiyat Paketleri" sekmesi eklenecek
- Her paket icin: isim, fiyat, periyod, ozellikler listesi (satir satir), "populer" isaretleme
- Paket ekleme/silme/siralama

### 1.3 Frontend
- `SanalOfisFiyatlari.tsx` sayfasi hardcoded `plans` dizisi yerine veritabanindan veri cekecek
- Veri yoksa mevcut statik degerler fallback olarak kullanilacak

---

## Bolum 2: Sozlesme Olusturucu Modulu

### 2.1 Veritabani Degisiklikleri

**Yeni tablo: `contract_templates`**
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid | PK |
| name | text | Sablon adi (orn: Sanal Ofis Sozlesmesi) |
| content | text | Sablon metni (placeholder'li) |
| is_default | boolean | Varsayilan sablon mu |
| created_at | timestamptz | Olusturma tarihi |
| updated_at | timestamptz | Guncelleme tarihi |

**Yeni tablo: `contracts`**
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | uuid | PK |
| template_id | uuid | FK -> contract_templates |
| customer_name | text | Musteri adi |
| company_name | text | Sirket adi (opsiyonel) |
| phone | text | Telefon (opsiyonel) |
| email | text | E-posta (opsiyonel) |
| start_date | date | Baslangic tarihi |
| end_date | date | Bitis tarihi (otomatik hesaplanan) |
| contract_duration | integer | Sure (ay) |
| monthly_price | decimal | Aylik ucret |
| address | text | Adres |
| contract_date | date | Sozlesme tarihi |
| notes | text | Notlar (opsiyonel) |
| rendered_content | text | Olusturulan nihai sozlesme metni |
| status | text | Active / Expired |
| created_by | uuid | Olusturan kullanici |
| created_at | timestamptz | Olusturma tarihi |

**RLS politikalari:** Her iki tablo icin admin/editor okuma-yazma, diger kullanicilar erisim yok.

### 2.2 Admin Paneli - Yeni Sayfalar

**a) Sozlesme Sablonlari (`/admin/contracts/templates`)**
- Sablon listesi
- Yeni sablon olusturma / duzenleme (TipTap veya textarea)
- Placeholder rehberi: `{{customer_name}}`, `{{start_date}}`, `{{monthly_price}}`, `{{contract_duration}}`, `{{end_date}}`, `{{contract_date}}`, `{{company_name}}`, `{{address}}`
- Varsayilan sablon secimi

**b) Yeni Sozlesme Olustur (`/admin/contracts/new`)**
- Form alanlari: Musteri Adi, Sirket Adi, Telefon, E-posta, Baslangic Tarihi, Sure (ay), Aylik Ucret, Adres, Sozlesme Tarihi (varsayilan: bugun), Notlar
- Sablon secimi (dropdown)
- Bitis tarihi otomatik hesaplama: Baslangic + Sure
- Onizleme butonu -> placeholder'lar doldurulmus sozlesme gosterimi
- Onizleme ekraninda: Duzenleme, Yazdir, PDF Indir butonlari
- Kaydet butonu -> veritabanina kayit

**c) Sozlesme Listesi (`/admin/contracts`)**
- Tablo: Musteri Adi, Baslangic, Sure, Aylik Ucret, Durum (Aktif/Suresi Dolmus)
- Arama ve filtreleme
- Sozlesme detay gorunumu
- Tekrar yazdir/PDF indir

### 2.3 Yazdir ve PDF
- `window.print()` ile A4 optimize edilmis yazdirma duzeninde
- CSS `@media print` ile profesyonel gorunum
- Workhibrit logosu, sirket bilgileri, imza alanlari
- PDF icin ayni yazdirma islevi kullanilacak (tarayici PDF kaydetme)

### 2.4 Sidebar Guncelleme
- Admin sidebar'a "Sozlesmeler" basligi altinda link eklenecek
- Ikon: `FileSignature` (lucide-react)

---

## Teknik Detaylar

### Degisecek/Olusturulacak Dosyalar

**Veritabani:**
- Migration: `page_content_block_type_check` constraint'e `pricing_plans` eklenmesi
- Migration: `contract_templates` ve `contracts` tablolari + RLS
- INSERT: Varsayilan fiyat paketleri ve ornek sozlesme sablonu

**Yeni dosyalar:**
- `src/pages/AdminContracts.tsx` - Sozlesme listesi
- `src/pages/AdminContractNew.tsx` - Yeni sozlesme formu + onizleme
- `src/pages/AdminContractTemplates.tsx` - Sablon yonetimi
- `src/components/ContractPreview.tsx` - Sozlesme onizleme ve yazdirma bileseni

**Degisecek dosyalar:**
- `src/pages/AdminContent.tsx` - "Fiyat Paketleri" sekmesi eklenmesi
- `src/pages/SanalOfisFiyatlari.tsx` - Veritabanindan veri cekme
- `src/components/AdminLayout.tsx` - Sidebar'a sozlesme linkleri
- `src/App.tsx` - Yeni route'lar

### Soslesme sablonu ornek icerik:
```text
SANAL OFIS HIZMET SOZLESMESI

Sozlesme Tarihi: {{contract_date}}

Taraflar:
1. Workhibrit - Sakarya
2. {{customer_name}} {{company_name}}

Adres: {{address}}

Hizmet baslangic tarihi: {{start_date}}
Hizmet bitis tarihi: {{end_date}}
Sozlesme suresi: {{contract_duration}} ay
Aylik hizmet bedeli: {{monthly_price}} TL + KDV

...

Imza:
Workhibrit          Musteri
___________         ___________
```


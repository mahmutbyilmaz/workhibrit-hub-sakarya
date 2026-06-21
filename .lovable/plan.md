## Tüm Public Tabloları CSV ZIP Export

Veritabanındaki tüm `public` şema tablolarını CSV formatında dışa aktarıp tek bir ZIP dosyası olarak indirilebilir hale getireceğim.

### Kapsam
Aşağıdaki 11 tablo export edilecek:
- blog_posts
- contact_messages
- contract_templates
- contracts
- faqs
- media
- page_content
- profiles
- seo_settings
- site_settings
- user_roles

### Teknik Adımlar
1. Her tablo için `psql COPY ... TO STDOUT WITH CSV HEADER` ile `/tmp/exports/<tablo>.csv` üret
2. Tüm CSV'leri tek bir ZIP içine paketle: `/mnt/documents/database_export_2026-06-21.zip`
3. ZIP dosyasını `<presentation-artifact>` tag'i ile indirilebilir olarak sun

### Notlar
- Sadece veri export edilir (şema/DDL dahil değil)
- Full database dump desteklenmiyor, tablo-bazlı CSV export kullanılıyor
- Dosya tek seferlik bir artifact; uygulama koduna değişiklik yapılmayacak

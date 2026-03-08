

# Blog YouTube Video Embed Sorunu - Çözüm Planı

## Sorunun Kaynağı

TipTap editörü `iframe` ve `div` etiketlerini tanımıyor. `insertContent` ile eklenen `<div class="video-wrapper"><iframe ...></iframe></div>` HTML'i, TipTap'ın schema'sına uymadığı için **otomatik olarak sıyırılıyor** (stripped). Sonuçta sadece metin veya link kalıyor.

TipTap yalnızca kayıtlı extension'lara ait HTML etiketlerini kabul eder. `iframe` için özel bir extension tanımlanması gerekiyor.

## Çözüm

**Özel bir TipTap Iframe Node extension'ı** oluşturulacak. Bu sayede TipTap, `iframe` etiketini tanıyacak ve hem editörde hem de kaydedilen HTML'de iframe korunacak.

### Değişecek Dosya

**`src/components/TipTapEditor.tsx`**:

1. Dosya içinde küçük bir custom `Iframe` Node extension tanımlanacak (ayrı dosya gereksiz):
   - `group: 'block'`, `atom: true`
   - `src`, `frameborder`, `allow`, `allowfullscreen` gibi attribute'ları parse/render edecek
   - `parseHTML`: `iframe` etiketini tanıyacak
   - `renderHTML`: `iframe` etiketini çıktı olarak üretecek

2. Bu extension, `useEditor`'daki `extensions` listesine eklenecek

3. `addYouTube` fonksiyonu, `insertContent` yerine doğrudan iframe node'u ekleyecek şekilde güncellenecek. Alternatif olarak raw HTML insert ile de çalışacak çünkü artık schema iframe'i tanıyacak.

Bu değişiklik sonrasında:
- Editörde YouTube videoları embed olarak görünecek
- Kaydedilen HTML'de iframe korunacak
- `BlogPost.tsx`'deki `dangerouslySetInnerHTML` zaten iframe'leri doğru render ediyor, orada değişiklik gerekmez


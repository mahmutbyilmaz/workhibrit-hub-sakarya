import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BLOG_SYSTEM_PROMPT = `Sen Workhibrit markası için SEO ve AEO odaklı blog içeriği üreten bir Türkçe içerik yazarısın.

Workhibrit Hakkında:
- Sakarya, Türkiye merkezli sanal ofis, coworking, toplantı odası ve hazır ofis hizmeti sunan yerel bir marka.
- Domain: sakaryasanalofis.com
- Hedef kitle: Sakarya'daki girişimciler, KOBİ'ler, freelancerlar.

İçerik Kuralları:
- Tamamen Türkçe yaz.
- Doğal, akıcı ve özgün içerik üret. Anahtar kelime doldurmadan kaçın.
- Sakarya'ya yerel referanslar ekle.
- Workhibrit markasını doğal şekilde içeriğe yerleştir.
- SEO için H2 ve H3 başlıklar, madde işaretleri kullan.
- AEO için soru-cevap yapısı içer.

Çıktı formatı JSON olmalı:
{
  "title": "SEO optimized başlık",
  "meta_title": "60 karakterden kısa meta başlık",
  "meta_description": "160 karakterden kısa meta açıklama",
  "slug": "seo-uyumlu-url-slug",
  "excerpt": "Kısa özet (1-2 cümle)",
  "content": "HTML formatında tam içerik (h2, h3, p, ul, li, blockquote etiketleri kullan)",
  "keywords": ["anahtar", "kelimeler"],
  "category": "Sanal Ofis | Coworking | Toplantı Odası | Genel",
  "faqs": [{"q": "Soru?", "a": "Cevap."}]
}`;

const FAQ_SYSTEM_PROMPT = `Sen Workhibrit markası için SSS (Sıkça Sorulan Sorular) içeriği üreten bir Türkçe içerik yazarısın.

Workhibrit Hakkında:
- Sakarya, Türkiye merkezli sanal ofis, coworking, toplantı odası ve hazır ofis hizmeti sunan yerel bir marka.
- Domain: sakaryasanalofis.com

SSS Kuralları:
- Gerçek kullanıcıların sorması muhtemel sorular yaz.
- Cevaplar kısa, net ve bilgilendirici olsun.
- Uygun olduğunda Sakarya'ya yerel referans ekle.
- Workhibrit markasını doğal şekilde yerleştir.
- Soru-cevap yapısı AEO (Answer Engine Optimization) için optimize edilmeli.

Çıktı formatı JSON array olmalı:
[{"q": "Soru?", "a": "Cevap.", "category": "Sanal Ofis | Coworking | Fiyat | Genel"}]`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { type, topic, length, tone, count, faqCategory } = await req.json();

    let systemPrompt: string;
    let userPrompt: string;

    if (type === "blog") {
      systemPrompt = BLOG_SYSTEM_PROMPT;
      const wordCount = length === "short" ? 600 : length === "long" ? 1500 : 1000;
      const toneMap: Record<string, string> = {
        informational: "Bilgilendirici ve eğitici",
        professional: "Profesyonel ve kurumsal",
        local: "Yerel ve samimi, Sakarya odaklı",
      };
      userPrompt = `Konu: "${topic}"
Uzunluk: yaklaşık ${wordCount} kelime
Ton: ${toneMap[tone] || "Bilgilendirici"}
Sonuna 3-5 adet SSS ekle.
JSON formatında çıktı ver.`;
    } else if (type === "faq") {
      systemPrompt = FAQ_SYSTEM_PROMPT;
      userPrompt = `Konu/Sayfa türü: "${faqCategory || topic}"
Soru sayısı: ${count || 5}
JSON array formatında çıktı ver.`;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit aşıldı, lütfen biraz bekleyin." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Kredi yetersiz, lütfen workspace ayarlarından kredi ekleyin." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI servisi hatası" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle markdown code blocks)
    let cleaned = raw;
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      cleaned = jsonMatch[1].trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to find JSON in the response
      const start = cleaned.indexOf(type === "blog" ? "{" : "[");
      const end = cleaned.lastIndexOf(type === "blog" ? "}" : "]");
      if (start !== -1 && end !== -1) {
        parsed = JSON.parse(cleaned.slice(start, end + 1));
      } else {
        throw new Error("AI yanıtı parse edilemedi");
      }
    }

    return new Response(JSON.stringify({ result: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-content error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Bilinmeyen hata" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

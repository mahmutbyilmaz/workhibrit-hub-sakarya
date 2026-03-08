const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INDEXNOW_KEY = "d4f8a2b1c7e9304f6a5d8b2e1c9f7a3b";
const DOMAIN = "https://sakaryasanalofis.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return new Response(JSON.stringify({ error: "urls array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const fullUrls = urls.map((u: string) =>
      u.startsWith("http") ? u : `${DOMAIN}${u}`
    );

    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "sakaryasanalofis.com",
        key: INDEXNOW_KEY,
        keyLocation: `${DOMAIN}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls,
      }),
    });

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        submitted: fullUrls,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

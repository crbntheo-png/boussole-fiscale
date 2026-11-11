// Garde Boussole Fiscale connectée à Google Drive : échange le code Google contre un jeton durable,
// puis renouvelle l'accès quand il expire. Le code secret Google reste sur le serveur (secrets Supabase).
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const rep = (corps: unknown, statut = 200) => new Response(JSON.stringify(corps), { status: statut, headers: { ...CORS, "Content-Type": "application/json" } });
const RETOURS = ["https://crbntheo-png.github.io/boussole-fiscale/"];
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const c = await req.json();
    const id = Deno.env.get("BOUSSOLE_GOOGLE_CLIENT_ID"), sec = Deno.env.get("BOUSSOLE_GOOGLE_SECRET");
    if (!id || !sec) return rep({ error: "not_configured" }, 503);
    let p: Record<string, string>;
    if (c.action === "ping") return rep({ ok: true });
    if (c.action === "exchange") {
      if (!RETOURS.includes(c.redirect_uri)) return rep({ error: "redirect_uri refusée" }, 400);
      p = { code: String(c.code || ""), client_id: id, client_secret: sec, redirect_uri: c.redirect_uri, grant_type: "authorization_code" };
    } else if (c.action === "refresh") {
      p = { refresh_token: String(c.refresh_token || ""), client_id: id, client_secret: sec, grant_type: "refresh_token" };
    } else if (c.action === "revoke") {
      await fetch("https://oauth2.googleapis.com/revoke?token=" + encodeURIComponent(String(c.refresh_token || "")), { method: "POST" });
      return rep({ ok: true });
    } else return rep({ error: "action inconnue" }, 400);
    const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(p) });
    const j = await r.json();
    return rep({ access_token: j.access_token, expires_in: j.expires_in, refresh_token: j.refresh_token, error: j.error, error_description: j.error_description }, r.ok ? 200 : 400);
  } catch (e) { return rep({ error: String((e as Error)?.message || e).slice(0, 200) }, 400); }
});

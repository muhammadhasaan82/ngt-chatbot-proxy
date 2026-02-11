// cloudflare/chatbot-proxy-worker.js
var chatbot_proxy_worker_default = {
  async fetch(request, env) {
    const BACKEND_IP = env.BACKEND_IP || "165.245.177.103";
    const CHATBOT_PORT = env.CHATBOT_PORT || "8000";
    const CONTACT_PORT = env.CONTACT_PORT || "3001";
    const BACKEND_HOST = BACKEND_IP.replace(/\./g, "-") + ".nip.io";
    const SERVICES = {
      "/chatbot": CHATBOT_PORT,
      "/contact": CONTACT_PORT
    };
    const ALLOWED_ORIGINS = [
      "https://nexgenteck.github.io",
      "https://muhammadhasaan82.github.io",
      "http://localhost:5173",
      "http://localhost:4173"
    ];
    const origin = request.headers.get("Origin") || "";
    const defaultOrigin = "https://nexgenteck.github.io";
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : defaultOrigin;
    const corsHeaders = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Max-Age": "86400"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const incoming = new URL(request.url);
    const path = incoming.pathname;
    let targetPort = null;
    let strippedPath = path;
    for (const [prefix, port] of Object.entries(SERVICES)) {
      if (path === prefix || path.startsWith(prefix + "/")) {
        targetPort = port;
        strippedPath = path.slice(prefix.length) || "/";
        break;
      }
    }
    if (!targetPort) {
      return new Response(
        JSON.stringify({
          status: "ok",
          worker: "ngt-backend-proxy",
          services: Object.keys(SERVICES),
          usage: "Prefix your request path with /chatbot or /contact"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
    const targetUrl = `http://${BACKEND_HOST}:${targetPort}${strippedPath}${incoming.search}`;
    const headers = new Headers();
    headers.set("Content-Type", request.headers.get("Content-Type") || "application/json");
    headers.set("Accept", request.headers.get("Accept") || "application/json");
    const clientIp = request.headers.get("cf-connecting-ip");
    if (clientIp) headers.set("X-Forwarded-For", clientIp);
    try {
      const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: ["GET", "HEAD"].includes(request.method) ? void 0 : request.body
      });
      const responseHeaders = new Headers(backendResponse.headers);
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }
      return new Response(backendResponse.body, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: responseHeaders
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Backend unreachable", detail: err.message }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }
  }
};
export {
  chatbot_proxy_worker_default as default
};
//# sourceMappingURL=chatbot-proxy-worker.js.map

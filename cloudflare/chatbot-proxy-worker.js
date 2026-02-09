/**
 * NGT Chatbot Proxy Worker
 *
 * Proxies HTTPS requests from GitHub Pages to the Python backend on a
 * DigitalOcean droplet.  The browser talks HTTPS → Worker → HTTP → backend.
 *
 * IMPORTANT: Do NOT override the Host header with a domain name.
 * Cloudflare Workers route outbound fetch() through their infrastructure.
 * If the Host header contains a domain Cloudflare tries to CDN-route it;
 * when the domain has no Cloudflare zone, it returns 1003.  Letting the
 * Host default to the IP:port from the URL avoids this.
 *
 * Environment variables (set in wrangler.toml [vars] or dashboard):
 *   BACKEND_IP    – DigitalOcean droplet public IPv4, e.g. 165.245.177.103
 *   BACKEND_PORT  – backend port, e.g. 8000
 */
export default {
  async fetch(request, env) {
    // ── Configuration ────────────────────────────────────────────────
    const BACKEND_IP   = env.BACKEND_IP   || '165.245.177.103';
    const BACKEND_PORT = env.BACKEND_PORT || '8000';

    const ALLOWED_ORIGINS = [
      'https://nexgenteck.github.io',
      'https://muhammadhasaan82.github.io',
      'http://localhost:5173',
      'http://localhost:4173',
    ];

    // ── CORS helpers ─────────────────────────────────────────────────
    const origin = request.headers.get('Origin') || '';
    const defaultOrigin = 'https://nexgenteck.github.io';
    const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : defaultOrigin;

    const corsHeaders = {
      'Access-Control-Allow-Origin':  corsOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age':       '86400',
    };

    // ── Preflight ────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── Build target URL ─────────────────────────────────────────────
    const incoming  = new URL(request.url);
    const targetUrl = `http://${BACKEND_IP}:${BACKEND_PORT}${incoming.pathname}${incoming.search}`;

    // ── Build clean headers ──────────────────────────────────────────
    //    Only forward the headers the backend actually needs.
    //    Do NOT set a custom Host header – let it default to the IP:port
    //    from the URL so Cloudflare passes the request straight through.
    const headers = new Headers();
    headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
    headers.set('Accept', request.headers.get('Accept') || 'application/json');

    // Carry the real client IP for logging
    const clientIp = request.headers.get('cf-connecting-ip');
    if (clientIp) headers.set('X-Forwarded-For', clientIp);

    // ── Proxy the request ────────────────────────────────────────────
    try {
      const backendResponse = await fetch(targetUrl, {
        method:  request.method,
        headers: headers,
        body:    ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      });

      // Attach CORS headers to the backend's response
      const responseHeaders = new Headers(backendResponse.headers);
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }

      return new Response(backendResponse.body, {
        status:     backendResponse.status,
        statusText: backendResponse.statusText,
        headers:    responseHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'Backend unreachable', detail: err.message }),
        {
          status:  502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        },
      );
    }
  },
};

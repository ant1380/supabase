// Cloudflare / Deno Worker — Generate Clash Meta (Mihomo) YAML Config

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const uuidKey = url.searchParams.get("uuid") || "";

  if (!uuidKey) return new Response("Missing uuid", { status: 400 });

  const links = serverGroups[uuidKey];
  if (!links || !Array.isArray(links) || links.length === 0) {
    return new Response("Invalid uuid or empty group", { status: 404 });
  }

  // ۱. پارس کردن لینک‌ها به نودهای Clash
  const proxies = links.map(parseLinkToClash).filter(Boolean);
  if (!proxies.length) return new Response("No valid nodes for Clash", { status: 422 });

  const proxyNames = proxies.map((p) => p.name);

  // ۲. ساخت فایل YAML برای Clash
  const yamlConfig = generateClashYaml(proxies, proxyNames);

  return new Response(yamlConfig, {
    headers: {
      "content-type": "text/yaml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
});

/* ================
   Server groups
   ================ */
const serverGroups = {
  "1": [
    "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.16.72.162:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D185.230.190.148#1",
    // لینک‌های خودت را اینجا بگذار
  ],
};

/* ================
   Helpers & Parsers
   ================ */
function parseLinkToClash(link) {
  if (typeof link !== "string") return null;

  try {
    const u = new URL(link);
    const proto = u.protocol.replace(":", "");
    const name = decodeURIComponent(u.hash.replace(/^#/, "")) || `Node-${Math.random().toString(36).substring(7)}`;
    const server = u.hostname;
    const port = Number(u.port || "443");
    const p = u.searchParams;

    if (proto === "vless") {
      return {
        name,
        type: "vless",
        server,
        port,
        uuid: u.username,
        cipher: "auto",
        udp: true,
        tls: p.get("security") === "tls",
        servername: p.get("sni") || server,
        "client-fingerprint": p.get("fp") || "chrome",
        network: p.get("type") || "tcp",
        "ws-opts": p.get("type") === "ws" ? {
          path: p.get("path") || "/",
          headers: { Host: p.get("host") || server }
        } : undefined
      };
    }
  } catch {
    return null;
  }
  return null;
}

/* ================
   YAML Generator
   ================ */
function generateClashYaml(proxies, proxyNames) {
  return `
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: 127.0.0.1:9090

proxies:
${JSON.stringify(proxies, null, 2).replace(/"([^"]+)":/g, '$1:')}

proxy-groups:
  - name: "⚡ Best Ping (خودکار)"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 30
    tolerance: 50
    proxies:
${proxyNames.map((n) => `      - "${n}"`).join("\n")}

  - name: "⚖️ Load Balance (توزیع بار)"
    type: load-balance
    url: http://www.gstatic.com/generate_204
    interval: 30
    strategy: round-robin
    proxies:
${proxyNames.map((n) => `      - "${n}"`).join("\n")}

  - name: "PROXIES"
    type: select
    proxies:
      - "⚡ Best Ping (خودکار)"
      - "⚖️ Load Balance (توزیع بار)"
${proxyNames.map((n) => `      - "${n}"`).join("\n")}

rules:
  - GEOIP,LAN,DIRECT
  - MATCH,PROXIES
`;
}

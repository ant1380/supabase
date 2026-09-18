// Supabase / Deno Worker — Generate Valid Clash Meta (Mihomo) YAML Config

Deno.serve(async (request) => {
  const url = new URL(request.url);
  const uuidKey = url.searchParams.get("uuid") || "";

  if (!uuidKey) return new Response("Missing uuid", { status: 400 });

  const links = serverGroups[uuidKey];
  if (!links || !Array.isArray(links) || links.length === 0) {
    return new Response("Invalid uuid or empty group", { status: 404 });
  }

  // ۱. پارس کردن لینک‌ها به ساختار پروکسی کلاش
  const proxies = links.map(parseLinkToClash).filter(Boolean);
  if (!proxies.length) return new Response("No valid nodes for Clash", { status: 422 });

  const proxyNames = proxies.map((p) => p.name);

  // ۲. ساخت خروجی متنی استاندارد YAML
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
        "vless://50414e45-4c5f-5a45-5553-3448ea55ea1a@104.16.70.194:443?encryption=none&security=tls&sni=sdxas.erfanfamily2.ir&fp=unsafe&type=ws&host=sdxas.erfanfamily2.ir&path=%2Fstream%2FPANEL_ZEUS%2F3448ea55ea1a#1",
        "vless://50414e45-4c5f-5a45-5553-c192d1480914@104.16.66.15:443?encryption=none&security=tls&sni=gdz543ezu4ds.v6qnd9c1.workers.dev&fp=unsafe&type=ws&host=gdz543ezu4ds.v6qnd9c1.workers.dev&path=%2Fstream%2FPANEL_ZEUS%2Fc192d1480914#2",
        "vless://efd26d58-6fc6-4999-a02c-0ca13879a756@104.20.18.167:443?encryption=none&security=tls&sni=KI3aGm44dqq-2dJpSbGFKU71VU.DOCom47457.woRKErs.DEV&fp=chrome&alpn=http%2F1.1&type=ws&host=ki3agm44dqq-2djpsbgfku71vu.docom47457.workers.dev&path=%2Fvl%2FbZhNE35Gca3Tl4JrL3H34BpmfMoO9KL%3Fed%3D2560#3",
        "vless://292032c7-15a3-4eaf-8d76-076c13832278@104.16.68.102:443?encryption=none&security=tls&sni=testu.erfanfamily.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=testu.erfanfamily.ir&path=%2Fvl%2FKIG6R8zHJxjnEPNXIeF7YLPOG9oN4%3Fed%3D2560#4",
        "vless://08d047ca-af68-11f1-ab81-2fc870e97527@154.211.8.195:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=%2Fdk1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A9%F0%9F%87%B0%20Denmark",
        "vless://4ad15acc-aecf-11f1-8f31-837c274f3503@104.16.68.102:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&type=ws&host=yes.docom47457.workers.dev&path=nl4.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B3%F0%9F%87%B1%20Netherlands%203",
        "vless://4f5acfc0-ae8d-11f1-a6c5-7351a845204f@104.16.102.15:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=usa4.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%BA%F0%9F%87%B8%20United%20States%20south",
        "vless://1e7cedac-b149-11f1-baef-af4c2e2a6fec@104.16.70.194:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=%2Fcz2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A8%F0%9F%87%BF%20czech%20republic",
        "vless://d97a5dee-c3e0-b8e1-63fc-517dee7a251a@104.20.18.167:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=kylerpanel-production.up.railway.app%3A443%2Fws%2Fd97a5dee-c3e0-b8e1-63fc-517dee7a251a#%F0%9F%87%B3%F0%9F%87%B1%20Netherlands%20%20railway"
      ],
  "2": [
        "vless://7850157b-2560-435e-9695-c8a76c30f31f@104.16.111.127:443?encryption=none&security=tls&sni=first.corw.ir&fp=random&alpn=http%2F1.1&type=ws&host=first.corw.ir&path=%2Fvl%2Fhn71UJzifNrP1a3UDm5mTmCS6hX1Gu%3Fed%3D2560#5",
        "vless://4199303a-8fd4-4e06-8799-7ccad9070671@104.16.66.15:443?encryption=none&security=tls&sni=tesr.erfanhub.ir&fp=random&alpn=http%2F1.1&type=ws&host=tesr.erfanhub.ir&path=%2Fvl%2FUoGuCC2ItjAG6iE80ZSx%3Fed%3D2560#6",
        "vless://c43c59c6-5fdd-4109-8d8d-66578c026f02@104.16.196.44:443?encryption=none&security=tls&sni=IOWzj-QENl8R7zjVMU7klxdCtT2R.wOdiwOW334.WOrkerS.DEV&fp=random&alpn=http%2F1.1&type=ws&host=iowzj-qenl8r7zjvmu7klxdctt2r.wodiwow334.workers.dev&path=%2Fvl%2FCvYgbOvrFqG4ihZhsExQ%3Fed%3D2560#7",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@104.16.66.15:443?encryption=none&security=tls&sni=hola.erfanfamily.ir&fp=random&type=ws&host=hola.erfanfamily.ir&path=%2F%3Fed%3D2048#8",
        "vless://63a4c430-aecf-11f1-bc52-0b8165c38c2e@104.16.66.15:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=nl1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B3%F0%9F%87%B1%20%20Netherlands%201",
        "vless://ef784d0c-b149-11f1-9ea2-070c697b6f59@104.25.206.186:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&type=ws&host=yes.docom47457.workers.dev&path=fr3.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%205",
        "vless://85dba328-af67-11f1-bd4e-e77e72402884@104.16.102.15:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=%2Ffr1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%204",
        "vless://2eb343c0-b0fd-11f1-8ad0-9b7c140afdf5@104.19.41.171:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=http%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=fi2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%AE%20Finland%202"
      ],
  "5": [
        "vless://7b370412-4ca7-428b-8e1a-5898894c412c@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=lolepanel-production.up.railway.app%3A443%2Fws%2F7b370412-4ca7-428b-8e1a-5898894c412c#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%204",
        "vless://bf321190-a9ca-11f1-aa64-b365b0daaae3@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fee2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AA%F0%9F%87%AA%20Estonia%202",
        "vless://a10e6ace-a9ca-11f1-8de5-3347b4531689@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fee1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AA%F0%9F%87%AA%20Estonia%201",
        "vless://4073c950-adfa-11f1-a3c7-5b97971f3a8b@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fru3.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B7%F0%9F%87%BA%20Russia",
        "vless://4f3b5cbd-cad2-408e-b017-7b23ad179edd@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=random&alpn=h2&type=ws&host=lokan.erfanfamily2.ir&path=lola-node-production.up.railway.app%3A443%2Fvless#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%201",
        "vless://fbcbfce4-ae8c-11f1-9f9f-7f062218636c@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Flt1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B1%F0%9F%87%B9%20Lithuania",
        "vless://d471d072-a9ca-11f1-8c67-abcd45721c06@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fdk1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A9%F0%9F%87%B0%20Denmark",
        "vless://f171ac7e-a9ca-11f1-994f-bf6978a51606@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Ffr1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%204",
        "vless://3eca1933-bb13-41ad-8f79-4c5a3ec8408d@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=lokepanel-production.up.railway.app%3A443%2Fws%2F3eca1933-bb13-41ad-8f79-4c5a3ec8408d#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%202",
        "vless://c0e312da-ab75-11f1-9c00-8f101c836b1b@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fcz2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A8%F0%9F%87%BF%20czech%20republic",
        "vless://09b9c410-a9cb-11f1-826e-27b0708dab9b@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Ffr2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%202",
        "vless://e93da5aa-a9c8-11f1-8a3c-aff1d5cc1769@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fie1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AE%F0%9F%87%AA%20Ireland",
        "vless://581f2c6c-a9cb-11f1-84e0-0f9ac33153af@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Ffr4.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%203",
        "vless://2c897172-a9c9-11f1-9898-0016c03a82e2@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Flu1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B1%F0%9F%87%BA%20Luxembourg",
        "vless://572f7f7e-a9ca-11f1-9ed2-aff64964b359@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fuk.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AC%F0%9F%87%A7%20United%20Kingdom",
        "vless://4501b472-ab85-11f1-99ee-6be3ac58e392@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&type=ws&host=lokan.erfanfamily2.ir&path=fr3.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AB%F0%9F%87%B7%20France%205",
        "vless://9dc3875c-ab85-11f1-ad38-00163cbe6c97@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fbh2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A7%F0%9F%87%AD%20Bahrain",
        "vless://044e1200-adfa-11f1-8316-e32404299470@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fse1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B8%F0%9F%87%AA%20Sweden",
        "vless://c3703726-adfa-11f1-891e-73faf013285f@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fgr2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A9%F0%9F%87%AA%20Germany",
        "vless://6f72fbda-ae8c-11f1-9c21-52ac0074670e@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=safari&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=premiusa3.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%BA%F0%9F%87%B8%20United%20States%20west",
        "vless://4f5acfc0-ae8d-11f1-a6c5-7351a845204f@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=usa4.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%BA%F0%9F%87%B8%20United%20States%20south"
      ]
};

/* ================
   Helpers & Parsers
   ================ */
function parseLinkToClash(link, index) {
  if (typeof link !== "string") return null;

  try {
    const u = new URL(link);
    const proto = u.protocol.replace(":", "");
    const rawName = decodeURIComponent(u.hash.replace(/^#/, "")).trim();
    const name = rawName ? rawName : `Node-${index + 1}`;
    const server = u.hostname;
    const port = Number(u.port || "443");
    const p = u.searchParams;

    if (proto === "vless") {
      const node = {
        name: name.replace(/['"#]/g, ""), // حذف کاراکترهای مخرب در YAML
        type: "vless",
        server: server,
        port: port,
        uuid: u.username,
        cipher: "auto",
        udp: true,
        tls: p.get("security") === "tls",
        servername: p.get("sni") || server,
        "client-fingerprint": p.get("fp") || "chrome",
        network: p.get("type") || "tcp"
      };

      if (p.get("type") === "ws") {
        node["ws-opts"] = {
          path: p.get("path") || "/",
          headers: { Host: p.get("host") || server }
        };
      }

      return node;
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
  // تبدیل پروکسی‌ها به ساختار متنی YAML بدون استفاده از JSON.stringify
  const proxiesYaml = proxies.map(p => {
    let res = `  - name: "${p.name}"\n` +
              `    type: ${p.type}\n` +
              `    server: ${p.server}\n` +
              `    port: ${p.port}\n` +
              `    uuid: ${p.uuid}\n` +
              `    cipher: ${p.cipher}\n` +
              `    udp: ${p.udp}\n` +
              `    tls: ${p.tls}\n` +
              `    servername: ${p.servername}\n` +
              `    client-fingerprint: ${p["client-fingerprint"]}\n` +
              `    network: ${p.network}`;
              
    if (p["ws-opts"]) {
      res += `\n    ws-opts:\n` +
             `      path: "${p["ws-opts"].path}"\n` +
             `      headers:\n` +
             `        Host: ${p["ws-opts"].headers.Host}`;
    }
    return res;
  }).join("\n");

  const formattedProxyNames = proxyNames.map(n => `      - "${n}"`).join("\n");

  return `port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: 127.0.0.1:9090

proxies:
${proxiesYaml}

proxy-groups:
  - name: "⚡ Best Ping (خودکار)"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 30
    tolerance: 50
    proxies:
${formattedProxyNames}

  - name: "⚖️ Load Balance (توزیع بار)"
    type: load-balance
    url: http://www.gstatic.com/generate_204
    interval: 30
    strategy: round-robin
    proxies:
${formattedProxyNames}

  - name: "PROXIES"
    type: select
    proxies:
      - "⚡ Best Ping (خودکار)"
      - "⚖️ Load Balance (توزیع بار)"
${formattedProxyNames}

rules:
  - GEOIP,LAN,DIRECT
  - MATCH,PROXIES
`;
}

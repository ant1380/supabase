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
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.16.72.162:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#1",
        "vless://9facaeda-08cb-4032-98ef-208c65c18027@172.66.47.56:443?encryption=none&security=tls&sni=urmy.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=urmy.erfanfamily2.ir&path=%2Fvl%2F0LqYf21RNpzenuMzsU8d1JDVi%3Fed%3D2560#2",
        "vless://efd26d58-6fc6-4999-a02c-0ca13879a756@188.114.97.8:443?encryption=none&security=tls&sni=KI3aGm44dqq-2dJpSbGFKU71VU.DOCom47457.woRKErs.DEV&fp=chrome&alpn=http%2F1.1&type=ws&host=ki3agm44dqq-2djpsbgfku71vu.docom47457.workers.dev&path=%2Fvl%2FbZhNE35Gca3Tl4JrL3H34BpmfMoO9KL%3Fed%3D2560#3",
        "vless://292032c7-15a3-4eaf-8d76-076c13832278@172.66.44.200:443?encryption=none&security=tls&sni=testu.erfanfamily.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=testu.erfanfamily.ir&path=%2Fvl%2FKIG6R8zHJxjnEPNXIeF7YLPOG9oN4%3Fed%3D2560#4",
        "vless://a1399465-94d8-4f02-a0ad-df6cdb7b8823@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=grimness-backlogs.cdn-content.com%3A443%2Fws#%F0%9F%87%BA%F0%9F%87%B8%20United%20States%20north%20%201",
        "vless://4f3b5cbd-cad2-408e-b017-7b23ad179edd@69.46.46.18:443?encryption=none&security=tls&sni=lola-node-production.up.railway.app&fp=random&alpn=h2&type=ws&host=lola-node-production.up.railway.app&path=%2Fvless#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%202",
        "vless://d471d072-a9ca-11f1-8c67-abcd45721c06@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fdk1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A9%F0%9F%87%B0%20Denmark",
        "vless://c0e312da-ab75-11f1-9c00-8f101c836b1b@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fcz2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A8%F0%9F%87%BF%20czech%20republic"
      ],
  "2": [
        "vless://7850157b-2560-435e-9695-c8a76c30f31f@188.114.96.3:443?encryption=none&security=tls&sni=first.corw.ir&fp=random&alpn=http%2F1.1&type=ws&host=first.corw.ir&path=%2Fvl%2Fhn71UJzifNrP1a3UDm5mTmCS6hX1Gu%3Fed%3D2560#5",
        "vless://4199303a-8fd4-4e06-8799-7ccad9070671@104.21.74.63:443?encryption=none&security=tls&sni=tesr.erfanhub.ir&fp=random&alpn=http%2F1.1&type=ws&host=tesr.erfanhub.ir&path=%2Fvl%2FUoGuCC2ItjAG6iE80ZSx%3Fed%3D2560#6",
        "vless://c43c59c6-5fdd-4109-8d8d-66578c026f02@104.20.18.167:443?encryption=none&security=tls&sni=IOWzj-QENl8R7zjVMU7klxdCtT2R.wOdiwOW334.WOrkerS.DEV&fp=random&alpn=http%2F1.1&type=ws&host=iowzj-qenl8r7zjvmu7klxdctt2r.wodiwow334.workers.dev&path=%2Fvl%2FCvYgbOvrFqG4ihZhsExQ%3Fed%3D2560#7",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@172.67.163.166:443?encryption=none&security=tls&sni=hola.erfanfamily.ir&fp=random&type=ws&host=hola.erfanfamily.ir&path=%2F%3Fed%3D2048#8",
        "vless://57ed544c-9260-43e8-8354-f626bd44f58b@188.114.96.3:443?encryption=none&security=tls&sni=joke.corw.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&type=ws&host=joke.corw.ir&path=welldone-node-production.up.railway.app%3A443%2Fvless#%F0%9F%87%BA%F0%9F%87%B8%20United%20States%20East%202",
        "vless://67b30697-b51e-4ae6-a182-161e4a05e8a0@188.114.96.1:443?encryption=none&security=tls&sni=yes.docom47457.workers.dev&fp=chrome&alpn=h3%2Ch2%2Chttp%2F1.1&type=ws&host=yes.docom47457.workers.dev&path=mediumrare-node-production.up.railway.app%3A443%2Fvless#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%203",
        "vless://8355736e-a5f2-11f1-9935-333cbb7a5ff1@172.67.163.166:443?encryption=none&security=tls&sni=joke.corw.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=joke.corw.ir&path=%2Fbg2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A7%F0%9F%87%AC%20Bulgaria",
  ],
  "3": [
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@172.64.229.36:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#8",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.16.72.162:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#1",
        "vless://9facaeda-08cb-4032-98ef-208c65c18027@104.18.152.249:443?encryption=none&security=tls&sni=urmy.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=urmy.erfanfamily2.ir&path=%2Fvl%2F0LqYf21RNpzenuMzsU8d1JDVi%3Fed%3D2560#2",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@173.245.49.165:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#3",
        "vless://292032c7-15a3-4eaf-8d76-076c13832278@172.67.184.127:443?encryption=none&security=tls&sni=testu.erfanfamily.ir&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=testu.erfanfamily.ir&path=%2Fvl%2FKIG6R8zHJxjnEPNXIeF7YLPOG9oN4%3Fed%3D2560#4",
        "vless://44a0e4f6-d0d5-439b-8f2e-b9730620d40e@104.27.119.28:443?encryption=none&security=tls&sni=lolsa.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=lolsa.erfanfamily2.ir&path=ca5.taskflowhub.org%3A8443%2Frealtime#%F0%9F%87%A8%F0%9F%87%A6",
        "vless://8103e96c-9f79-11f1-84f5-6fe34b400539@172.67.184.127:443?encryption=none&security=tls&sni=lolsa.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lolsa.erfanfamily2.ir&path=%2Fie1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AE%F0%9F%87%AA%20Ireland",
        "vless://40299eba-9f78-11f1-96ff-5b700e0d34f2@172.67.184.127:443?encryption=none&security=tls&sni=lolsa.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lolsa.erfanfamily2.ir&path=%2Fnl1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.17.108.68:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#9",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@45.67.215.67:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#10",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@103.21.244.26:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#11",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.20.18.167:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#12",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@91.206.71.164:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#13",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@104.16.72.162:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#14",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@198.41.204.141:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#15",
        "vless://14e28b36-9a4d-40a4-9aff-fb63163c74f4@172.64.75.10:443?encryption=none&security=tls&sni=test1200.erfanhub.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test1200.erfanhub.ir&path=%2Fpyip%3D178.156.139.174#16",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@172.64.229.36:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#17",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@104.17.108.68:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#18",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@45.67.215.67:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#19",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@103.21.244.26:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#20",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@104.20.18.167:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#21",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@91.206.71.164:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#22",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@104.16.72.162:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#23",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@198.41.204.141:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#24",
        "vless://5f99fbcc-bac8-44f0-9f33-fcb9fecfd326@172.64.75.10:443?encryption=none&security=tls&sni=test5000.erfanfamily2.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=test5000.erfanfamily2.ir&path=%2FeyJqdW5rIjoiRlV2bnBzS09yNVZLIiwicHJvdG9jb2wiOiJ2bCIsIm1vZGUiOiJwcm94eWlwIiwicGFuZWxJUHMiOltdfQ%3D%3D%3Fed%3D2560#25",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@172.64.229.36:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#26",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@104.17.108.68:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#27",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@45.67.215.67:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#28",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@103.21.244.26:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#29",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@104.20.18.167:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#30",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@91.206.71.164:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#31",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@104.16.72.162:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#32",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@198.41.204.141:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#33",
        "vless://02b1ea62-173d-43df-a566-6f0f65536e23@172.64.75.10:443?encryption=none&security=tls&sni=hawm.erfanfamily2.ir&fp=random&alpn=h3%2Ch2%2Chttp%2F1.1&insecure=0&allowInsecure=0&type=ws&host=hawm.erfanfamily2.ir&path=%2F%3Fed%3D2048#34",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@172.64.229.36:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#35",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@104.17.108.68:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#36",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@45.67.215.67:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#37",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@103.21.244.26:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#38",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@104.20.18.167:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#39",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@91.206.71.164:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#40",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@104.16.72.162:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#41",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@198.41.204.141:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#42",
        "vless://14371dd4-9ba9-4e3a-88ad-b1eb9569f154@172.64.75.10:443?encryption=none&security=tls&sni=dJt8n4DkF87z6QD1Wy6S.RiDAm68232.worKErS.dEv&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=djt8n4dkf87z6qd1wy6s.ridam68232.workers.dev&path=%2Fvl%2FJpMMgNI2wq0KfjVL7cga%3Fed%3D2560#43"
  ],
  "4": [
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.16.75.207:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#8",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.18.152.249:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#9",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.18.152.101:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#10",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.18.152.44:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#11",
        "vless://7850157b-2560-435e-9695-c8a76c30f31f@188.114.96.3:443?encryption=none&security=tls&sni=first.corw.ir&fp=random&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=first.corw.ir&path=%2Fvl%2Fhn71UJzifNrP1a3UDm5mTmCS6hX1Gu%3Fed%3D2560#5",
        "vless://4199303a-8fd4-4e06-8799-7ccad9070671@104.21.74.63:443?encryption=none&security=tls&sni=tesr.erfanhub.ir&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=tesr.erfanhub.ir&path=%2Fvl%2FUoGuCC2ItjAG6iE80ZSx%3Fed%3D2560#6",
        "vless://c43c59c6-5fdd-4109-8d8d-66578c026f02@104.20.18.167:443?encryption=none&security=tls&sni=IOWzj-QENl8R7zjVMU7klxdCtT2R.wOdiwOW334.WOrkerS.DEV&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&ech=taskulu.com%2Budp%3A%2F%2F1.1.1.1&type=ws&host=iowzj-qenl8r7zjvmu7klxdctt2r.wodiwow334.workers.dev&path=%2Fvl%2FCvYgbOvrFqG4ihZhsExQ%3Fed%3D2560#7",
        "vless://f1ebace6-6bf9-4fe8-8a42-5848975f52ea@45.67.215.67:443?encryption=none&security=tls&sni=fO9lJCOvpe4B394uDeO4g.pAGes.DEV&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&ech=taskulu.com%2Budp%3A%2F%2F1.1.1.1&type=ws&host=fo9ljcovpe4b394udeo4g.pages.dev&path=%2Fvl%2FgaHIeQrRumXAaZfvi7NDb9sy%3Fed%3D2560#8",
        "vless://b585dc5e-55bf-4a8b-913a-27c9ccac05c3@104.21.74.63:443?encryption=none&security=tls&sni=joke.corw.ir&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=joke.corw.ir&path=%2Fbab-6.site%3A443%2Fvws%2F#%F0%9F%87%AB%F0%9F%87%B7",
        "vless://924b826c-9f78-11f1-828b-7fe71eb40a64@172.67.184.127:443?encryption=none&security=tls&sni=lolsa.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lolsa.erfanfamily2.ir&path=%2Fusa8.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%BA%F0%9F%87%B8%20United%20States",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.18.152.216:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#12",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.18.152.197:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#13",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.16.73.199:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#14",
        "vless://0b6f55ce-2c36-453c-899c-89afcb2d7b6e@104.16.73.225:443?encryption=none&security=tls&sni=nalam.erfnmndi474.workers.dev&fp=random&insecure=0&allowInsecure=0&type=ws&host=nalam.erfnmndi474.workers.dev&path=%2Fgateway#15",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.16.75.207:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#16",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.18.152.249:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#17",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.18.152.101:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#18",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.18.152.44:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#19",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.18.152.216:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#20",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.18.152.197:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#21",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.16.73.199:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#22",
        "vless://b56b8e9c-b338-4d42-87c0-35ce808f41eb@104.16.73.225:8443?encryption=none&security=tls&sni=gorbahh.erfanhub.ir&fp=random&insecure=0&allowInsecure=0&type=ws&host=gorbahh.erfanhub.ir&path=%2Fproxyip%3D23.94.103.194#23",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.16.75.207:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#24",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.18.152.249:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#25",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.18.152.101:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#26",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.18.152.44:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#27",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.18.152.216:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#28",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.18.152.197:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#29",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.16.73.199:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#30",
        "vless://a08bcfa1-f3b2-44f2-8899-d19ea09fe9d2@104.16.73.225:443?encryption=none&security=tls&sni=NuJ-VdqKRjD716Kg0CVB20.ErfnmnDI474.WoRkErs.Dev&fp=chrome&alpn=http%2F1.1&insecure=0&allowInsecure=0&type=ws&host=nuj-vdqkrjd716kg0cvb20.erfnmndi474.workers.dev&path=%2Fvl%2FHkFiKqHSWqoacZM7R0daqmO%3Fed%3D2560#31"
  ],
  "5": [
        "vless://7b370412-4ca7-428b-8e1a-5898894c412c@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=lolepanel-production.up.railway.app%3A443%2Fws%2F7b370412-4ca7-428b-8e1a-5898894c412c#%F0%9F%87%B3%F0%9F%87%B1%20The%20Netherlands%204",
        "vless://bf321190-a9ca-11f1-aa64-b365b0daaae3@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fee2.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AA%F0%9F%87%AA%20Estonia%202",
        "vless://a10e6ace-a9ca-11f1-8de5-3347b4531689@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fee1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%AA%F0%9F%87%AA%20Estonia%201",
        "vless://4073c950-adfa-11f1-a3c7-5b97971f3a8b@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fru3.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%B7%F0%9F%87%BA%20Russia",
        "vless://6e1d81c6-ab83-11f1-bdf9-775146839d24@104.20.18.167:443?encryption=none&security=tls&sni=lokan.erfanfamily2.ir&fp=chrome&alpn=http%2F1.1&type=ws&host=lokan.erfanfamily2.ir&path=%2Fgr1.vpnjantit.com%3A10002%2Fvpnjantit#%F0%9F%87%A9%F0%9F%87%AA%20Germany",
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

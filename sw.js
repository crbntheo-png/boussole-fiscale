const C="boussole-v16";const F=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-180.png","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./lib/pdf.min.js","./lib/pdf.worker.min.js","./lib/supabase.js","./lib/pdf-lib.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const same=new URL(r.url).origin===location.origin;
  const net=same?fetch(r.url,{cache:"no-cache",credentials:"same-origin"}):fetch(r);
  e.respondWith(net.then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>caches.match(r).then(x=>x||caches.match("./index.html"))))});

const C="boussole-v12";const F=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-180.png","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./lib/pdf.min.js","./lib/pdf.worker.min.js","./lib/supabase.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp)).catch(()=>{});return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))))});

// 最小限のサービスワーカー: 同一オリジンのアプリシェル(index.html/manifest/アイコン)だけを
// キャッシュし、オフラインでも起動画面までは開けるようにする。
// Firebase / esm.sh / Google などクロスオリジンの通信はそのままネットワークに流し、
// 認証・データが古い内容で誤って処理されないようにしている。
const CACHE_NAME = "moneido-shell-v3";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // 同一オリジン以外(Firebase/esm.sh/Googleなど)はキャッシュせず素通りさせる
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

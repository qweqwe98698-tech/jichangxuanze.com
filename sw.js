const CACHE_NAME = 'yunduan-v2'; // 更新版本号以强制浏览器更新缓存
const urlsToCache = [
  '/',
  '/index.html',
  '/ranking.html',
  '/css/style.css',
  '/js/app.js'
];

// 安装阶段：缓存核心资源
self.addEventListener('install', event => {
  self.skipWaiting(); // 强制新的 SW 立即接管
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活阶段：清理旧版本缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 清除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // 立即获取页面控制权
    })
  );
});

// 拦截请求并处理
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到匹配项，则返回缓存
        if (response) {
          return response;
        }
        // 否则发起网络请求
        return fetch(event.request).catch(() => {
          // 如果网络请求失败（比如 VPN 切换导致网络中断，或被插件拦截），防止抛出 ERR_FAILED
          console.warn('网络请求失败，可能是离线或请求被拦截:', event.request.url);
          // 这里可以返回一个自定义的离线页面，或者直接静默失败
          // 如果是页面导航请求，且无法访问，暂时不做额外处理，避免白屏 ERR_FAILED 的丑陋提示
        });
      })
  );
});

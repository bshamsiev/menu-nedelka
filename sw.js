// Офлайн-режим. При каждом обновлении увеличьте номер версии ниже и номер ?v= у data.js в index.html и в списке FILES.
const CACHE = 'menu-v16';
const FILES = ['./', 'index.html', 'data.js?v=16', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // общее меню (Supabase) всегда идёт в сеть
  // Сначала сеть (чтобы получать обновления), без сети — из кэша
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});

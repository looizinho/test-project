// Service Worker para To-Do List — durante desenvolvimento, apenas passa requisições
// Comente esta linha para ativar cache em produção
if ('serviceWorker' in navigator) { navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())); }

// Instalação
self.addEventListener('install', () => self.skipWaiting());

// Ativação — remove SW anterior
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// Requisições — sem cache durante desenvolvimento
self.addEventListener('fetch', (e) => {
  if (e.request.method === 'GET') {
    e.respondWith(fetch(e.request));
  }
});

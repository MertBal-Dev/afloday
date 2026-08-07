/* Laboratuvar sunucusu. `_build/onizle.mjs` yalnız `site/` klasörünü
   sunuyor; laboratuvar hem kendi dosyalarını hem `site/assets` altındaki
   gerçek fotoğrafları okuduğu için kökü depo kökü olan ayrı bir sunucu
   gerekiyor.

   Kullanım:  node _lab/sunucu.mjs 8900   →  http://127.0.0.1:8900/_lab/ */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || 8900);

const TURLER = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
};

http.createServer(async (istek, cevap) => {
  let yol = decodeURIComponent(istek.url.split('?')[0]);
  if (yol.endsWith('/')) yol += 'index.html';

  /* Kökün dışına çıkma girişimini engelle (../../ gibi) */
  const dosya = path.resolve(KOK, '.' + yol);
  if (!dosya.startsWith(KOK)) {
    cevap.writeHead(403).end('Kök dışı');
    return;
  }

  try {
    const govde = await fs.readFile(dosya);
    cevap.writeHead(200, {
      'Content-Type': TURLER[path.extname(dosya).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    cevap.end(govde);
  } catch {
    cevap.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    cevap.end('Bulunamadı: ' + yol);
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log('laboratuvar → http://127.0.0.1:' + PORT + '/_lab/');
});

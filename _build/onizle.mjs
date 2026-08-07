/* Yerel önizleme sunucusu — `node _build/onizle.mjs`

   Neden gerekli: sayfalardaki iç bağlantılar uzantısız (`href="iletisim"`),
   çünkü yayında Vercel öyle servis ediyor. Python'un basit sunucusu ise
   dosya adını birebir istiyor, bu yüzden menüdeki hiçbir bağlantı yerelde
   açılmıyordu. Bu sunucu uzantısız adresi `.html` dosyasına bağlıyor,
   yani yayındaki davranışın aynısını veriyor.

   Ayrıca 404'te gerçek 404 sayfasını gösteriyor ve önbelleği kapatıyor ki
   yeniden derlemeden sonra eski sayfa görünmesin. */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const KOK = path.resolve('site');
const PORT = Number(process.env.PORT || 8899);

const TURLER = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2',
  /* PDF tabloda yokken `application/octet-stream` gidiyordu ve tarayıcı
     dosyayı gömük göstermek yerine indiriyordu. Site içindeki indirilebilir
     içerikleri (ve tasarım referansı destesini) tarayıcıda açabilmek için
     doğru tür şart. */
  '.pdf': 'application/pdf',
};

/* İstenen adresi diskteki dosyaya çevirir: önce birebir, sonra .html,
   sonra klasör/index.html */
async function coz(istenen) {
  const temiz = decodeURIComponent(istenen.split('?')[0].split('#')[0]);
  const guvenli = path.normalize(temiz).replace(/^(\.\.[/\\])+/, '');
  const taban = path.join(KOK, guvenli);
  if (!taban.startsWith(KOK)) return null;               /* dizin dışına çıkma */

  const adaylar = temiz.endsWith('/')
    ? [path.join(taban, 'index.html')]
    : [taban, taban + '.html', path.join(taban, 'index.html')];

  for (const a of adaylar) {
    try {
      const s = await stat(a);
      if (s.isFile()) return a;
    } catch { /* sıradaki aday */ }
  }
  return null;
}

/* Yayındaki yönlendirmeler burada da uygulansın ki iptal edilen adresler
   yerelde 404 yerine yayındaki gibi 301 dönsün. */
let yonlendirme = new Map();
try {
  const v = JSON.parse(await readFile('vercel.json', 'utf8'));
  yonlendirme = new Map((v.redirects || []).map((r) => [r.source, r.destination]));
} catch { /* vercel.json yoksa yönlendirme yok */ }

createServer(async (istek, cevap) => {
  const yol = (istek.url || '/').split('?')[0].replace(/\/$/, '') || '/';
  const hedef = yonlendirme.get(yol);
  if (hedef) {
    cevap.writeHead(301, { Location: hedef });
    return cevap.end();
  }

  const dosya = await coz(istek.url === '/' ? '/index.html' : istek.url);

  if (!dosya) {
    const dortyuzdort = path.join(KOK, '404.html');
    try {
      const govde = await readFile(dortyuzdort);
      cevap.writeHead(404, { 'Content-Type': TURLER['.html'] });
      return cevap.end(govde);
    } catch {
      cevap.writeHead(404, { 'Content-Type': TURLER['.txt'] });
      return cevap.end('Bulunamadı: ' + istek.url);
    }
  }

  const tur = TURLER[path.extname(dosya).toLowerCase()] || 'application/octet-stream';
  cevap.writeHead(200, {
    'Content-Type': tur,
    /* Derleme sonrası eski sayfa görünmesin */
    'Cache-Control': 'no-store',
  });
  cevap.end(await readFile(dosya));
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Önizleme: http://127.0.0.1:${PORT}/`);
  console.log('Uzantısız adresler yayındaki gibi çalışıyor (örn. /iletisim).');
});

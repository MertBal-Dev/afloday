/* SAYFA İNCELEME — gözle bakmak için kesitler üretir.

   Kullanım:
     node _audit/denetim/incele.mjs <sayfa> [genislik] [kesit-sayisi]
     node _audit/denetim/incele.mjs dogadan-hobi-atolyeleri 390 4

   Sayfayı eşit aralıklarla böler, her parçayı ayrı PNG olarak yazar.
   Tek dev görüntü yerine kesit üretmesinin sebebi: 16 ekranlık bir sayfanın
   tam görüntüsü hem okunmaz hem incelemesi pahalı.

   Önce: node _build/onizle.mjs 8899 */
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const CIKTI = KOK + '_audit/rapor/incele/';
mkdirSync(CIKTI, { recursive: true });

const sayfa = process.argv[2];
const EN = Number(process.argv[3]) || 390;
const ADET = Number(process.argv[4]) || 4;
if (!sayfa) { console.error('Kullanım: node _audit/denetim/incele.mjs <sayfa> [genislik] [adet]'); process.exit(1); }

const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: EN, height: 900 }, deviceScaleFactor: 1 });
sf.setDefaultTimeout(25000);
const adres = sayfa === 'index' ? '' : sayfa;
await sf.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'domcontentloaded' }).catch(() => {});
/* `document.fonts.ready` bazı sayfalarda hiç çözülmüyor ve betiği kilitliyor
   (WebGL ve sonsuz şerit ağı meşgul tutuyor). Süre sınırıyla yarıştır. */
await Promise.race([
  sf.evaluate(() => document.fonts.ready).catch(() => {}),
  new Promise((r) => setTimeout(r, 4000)),
]);
await sf.evaluate(async () => {
  for (const e of document.querySelectorAll('[data-reveal]')) {
    e.setAttribute('data-reveal', 'in'); e.style.opacity = '1'; e.style.transform = 'none';
  }
  const s = document.createElement('style');
  s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
  document.head.appendChild(s);
  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
    window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 35));
  }
  window.scrollTo(0, 0);
  await Promise.all([...document.images].map((i) =>
    i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
});
await sf.waitForTimeout(500);

const boy = await sf.evaluate(() => document.body.scrollHeight);
const ekran = await sf.evaluate(() => window.innerHeight);
console.log(`${sayfa} @ ${EN}px → ${boy}px (${(boy / ekran).toFixed(1)} ekran)`);

const parca = Math.ceil(boy / ADET);
for (let i = 0; i < ADET; i++) {
  const y = i * parca;
  const h = Math.min(parca, boy - y);
  if (h < 50) break;
  const ad = `${sayfa}-${EN}-${i + 1}.png`;
  await sf.screenshot({ path: CIKTI + ad, fullPage: true, clip: { x: 0, y, width: EN, height: h } });
  console.log(`  ${ad}  (y ${y}-${y + h})`);
}
await b.close();

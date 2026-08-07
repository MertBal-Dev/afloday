/* GERÇEK KIRPMA — hangi öğe, ne kadar kesiyor.

   CSS'teki `aspect-ratio` sayısını saymak yetmiyor: bazıları dekoratif,
   bazıları zaten fotoğrafın kendi oranını taşıyor. Kesin cevap tarayıcıda:
   her `img` için doğal oran ile çizilen kutunun oranını karşılaştır.

   object-fit: cover ise fark kırpmadır. contain/fill ise kırpma yoktur.

   Aşama 1'in hedef listesi bu betikten çıkıyor.
   Önce: node _build/onizle.mjs 8899 */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(KOK + '_audit/rapor/', { recursive: true });
const SITE = KOK + 'site/';
const EN = Number(process.argv[2]) || 1440;

const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();
const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: EN, height: 1000 } });
sf.setDefaultTimeout(20000);

const hepsi = [];
for (const dosya of sayfalar) {
  const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
  try { await sf.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'domcontentloaded' }); }
  catch { /* devam */ }
  /* Tembel görselleri tetikle */
  await sf.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) =>
      i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await sf.waitForTimeout(250);

  const bulgular = await sf.evaluate(() => {
    const l = [];
    for (const img of document.images) {
      if (!img.naturalWidth || !img.naturalHeight) continue;
      const r = img.getBoundingClientRect();
      if (r.width < 40 || r.height < 40) continue;          /* ikon, logo */
      const c = getComputedStyle(img);
      const dogal = img.naturalWidth / img.naturalHeight;
      const cizilen = r.width / r.height;
      const kirpar = c.objectFit === 'cover' || c.objectFit === 'none';
      const kalan = dogal > cizilen ? cizilen / dogal : dogal / cizilen;
      const kirpma = kirpar ? (1 - kalan) * 100 : 0;
      if (kirpma < 2) continue;
      /* Çerçeveyi kim kuruyor: en yakın aspect-ratio taşıyan ata */
      let kap = img.parentElement, kapAd = '';
      for (let n = 0; n < 4 && kap; n++) {
        const ks = getComputedStyle(kap);
        if (ks.aspectRatio && ks.aspectRatio !== 'auto') {
          kapAd = kap.tagName.toLowerCase() +
            (kap.className && typeof kap.className === 'string'
              ? '.' + kap.className.trim().split(/\s+/)[0] : '') + ' [' + ks.aspectRatio + ']';
          break;
        }
        kap = kap.parentElement;
      }
      if (!kapAd) kapAd = (img.className || '(img)').split(/\s+/)[0];
      l.push({ kap: kapAd, kirpma: +kirpma.toFixed(1),
        dogal: +dogal.toFixed(2), cizilen: +cizilen.toFixed(2),
        kaynak: img.currentSrc.split('/').pop().slice(0, 44) });
    }
    return l;
  });
  for (const x of bulgular) hepsi.push({ sayfa: dosya, ...x });
}
await b.close();

const grup = {};
for (const x of hepsi) (grup[x.kap] ||= []).push(x);
const sirali = Object.entries(grup)
  .map(([k, l]) => ({ k, n: l.length, ort: l.reduce((a, b) => a + b.kirpma, 0) / l.length,
    enCok: Math.max(...l.map((x) => x.kirpma)), ornek: l[0] }))
  .sort((a, b) => b.n * b.ort - a.n * a.ort);

console.log(`=== GERÇEK KIRPMA (${EN}px) ===\n`);
console.log(`  ${hepsi.length} görsel kırpılıyor, ${new Set(hepsi.map((x) => x.sayfa)).size} sayfada\n`);
console.log('  adet  ort%   max%  çerçeve');
console.log('  ' + '-'.repeat(72));
for (const g of sirali) {
  console.log(`  ${String(g.n).padStart(4)}  ${g.ort.toFixed(1).padStart(5)}  ${g.enCok.toFixed(1).padStart(5)}  ${g.k}`);
  console.log(`                       ${g.ornek.kaynak} (doğal ${g.ornek.dogal} → ${g.ornek.cizilen})`);
}
const toplamOrt = hepsi.reduce((a, b) => a + b.kirpma, 0) / (hepsi.length || 1);
console.log(`\n  ortalama kırpma: %${toplamOrt.toFixed(1)}`);
writeFileSync(KOK + `_audit/rapor/kirpma-${EN}.json`, JSON.stringify(hepsi, null, 1));
console.log(`  Rapor: _audit/rapor/kirpma-${EN}.json`);

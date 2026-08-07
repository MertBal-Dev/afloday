/* Paletin GERÇEK hâlini tarayıcıdan oku. CSS'te token'lar üst üste
   tanımlanmış; cascade'i elle çözmek yerine hesaplanmış değeri alıyoruz.

   Ayrıca: hangi bileşen hangi rengi kullanıyor, ve ham hex'ler nerede.
   Önce `node _build/onizle.mjs 8899`. */
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const CIKTI = KOK + '_audit/rapor/';
mkdirSync(CIKTI, { recursive: true });

const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: 1440, height: 900 } });
await sf.goto('http://127.0.0.1:8899/', { waitUntil: 'networkidle' });

/* 1 · :root'ta tanımlı her özel özelliğin hesaplanmış değeri */
const tokenlar = await sf.evaluate(() => {
  const adlar = new Set();
  for (const ss of document.styleSheets) {
    let kurallar;
    try { kurallar = ss.cssRules; } catch { continue; }
    for (const k of kurallar) {
      if (!k.style) continue;
      for (const p of k.style) if (p.startsWith('--')) adlar.add(p);
    }
  }
  const cs = getComputedStyle(document.documentElement);
  const cikti = {};
  for (const a of [...adlar].sort()) cikti[a] = cs.getPropertyValue(a).trim();
  return cikti;
});

/* 2 · Aynı token kaç kez tanımlanmış — ölü kod ölçüsü */
const css = readFileSync(KOK + 'site/assets/css/afloday.css', 'utf8');
const tanim = {};
for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:/gi)) {
  tanim[m[1]] = (tanim[m[1]] || 0) + 1;
}

/* 3 · :root dışındaki ham hex'ler, satır numarasıyla */
const satirlar = css.split('\n');
const hamHex = {};
satirlar.forEach((s, i) => {
  if (/^\s*--[a-z0-9-]+\s*:/i.test(s)) return;      /* token tanımı, sayma */
  for (const m of s.matchAll(/#[0-9A-Fa-f]{3,8}\b/g)) {
    (hamHex[m[0].toUpperCase()] ||= []).push(i + 1);
  }
});

await b.close();

const renkMi = (v) => /^(#|rgb|hsl)/i.test(v);
const renkler = Object.entries(tokenlar).filter(([, v]) => renkMi(v));
const digerleri = Object.entries(tokenlar).filter(([, v]) => !renkMi(v));

console.log('=== 1 · RENK TOKEN\'LARININ GERÇEK DEĞERİ (' + renkler.length + ') ===\n');
for (const [a, v] of renkler) {
  const n = tanim[a] || 0;
  const uyari = n > 1 ? `  ⚠ ${n} kez tanımlı` : '';
  console.log(`  ${a.padEnd(18)} ${v.padEnd(24)}${uyari}`);
}

console.log('\n=== 2 · RENK OLMAYAN TOKEN (' + digerleri.length + ') ===');
console.log('  ' + digerleri.map(([a]) => a).join(', '));

console.log('\n=== 3 · ÇOK KEZ TANIMLANAN TOKEN (ölü kod) ===\n');
const coklu = Object.entries(tanim).filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]);
for (const [a, n] of coklu) console.log(`  ${String(n)}× ${a}`);
if (!coklu.length) console.log('  yok');

console.log('\n=== 4 · :root DIŞINDA HAM HEX (' + Object.keys(hamHex).length + ' farklı renk) ===\n');
const sirali = Object.entries(hamHex).sort((a, b) => b[1].length - a[1].length);
let toplam = 0;
for (const [h, yerler] of sirali) {
  toplam += yerler.length;
  console.log(`  ${String(yerler.length).padStart(3)}× ${h}   satır: ${yerler.slice(0, 8).join(', ')}${yerler.length > 8 ? ' …' : ''}`);
}
console.log(`\n  toplam ${toplam} ham hex kullanımı, token'a bağlanacak`);

writeFileSync(CIKTI + 'palet.json', JSON.stringify({ tokenlar, tanim, hamHex }, null, 1));
console.log('\nRapor: _audit/rapor/palet.json');

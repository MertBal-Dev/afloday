/* Mobil okunabilirlik ve kontrast — hesaplanmış değerlerle, tarayıcıda.
   Önce `node _build/build.mjs`, sonra `node _build/onizle.mjs 8899`.

   A · Dar sütuna sıkışmış metin — satır başına karakter (CPL).
       Tipografide rahat okuma 45-75 CPL. Mobilde 30 altı sıkışık;
       20 altı "dikine uzun, yatayda kısa" görüntüsünün ölçüsü.
   B · Metin/zemin kontrastı — gerçek zemin, saydam olmayan ilk atadan.

   Not: `data-reveal` opaklığı ölçümden önce 1'e çekiliyor, yoksa açığa
   çıkarma animasyonu tüm blokları görünmez sayar. */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const SITE = KOK + 'site/';
const CIKTI = KOK + '_audit/rapor/';
mkdirSync(CIKTI, { recursive: true });

const TABAN = 'http://127.0.0.1:8899/';
const EN = Number(process.argv[2]) || 390;
const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html'));

const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: EN, height: 844 }, deviceScaleFactor: 2 });

const dar = [];
const kontrast = [];

for (const dosya of sayfalar) {
  const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
  await sf.goto(TABAN + adres, { waitUntil: 'networkidle' }).catch(() => {});
  await sf.evaluate(() => {
    for (const e of document.querySelectorAll('[data-reveal]')) {
      e.setAttribute('data-reveal', 'in');
      e.style.opacity = '1';
      e.style.transform = 'none';
    }
  });
  await sf.waitForTimeout(150);

  const sonuc = await sf.evaluate(() => {
    const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const lum = (c) => 0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2]);
    const ayir = (s) => (s.match(/[\d.]+/g) || []).map(Number);
    const oran = (a, b) => {
      const l1 = lum(a), l2 = lum(b);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const zemin = (el) => {
      let n = el;
      while (n && n !== document.documentElement) {
        const c = ayir(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
        n = n.parentElement;
      }
      return [255, 255, 255];
    };

    const darlar = [], kont = [];
    const BLOK = 'p,li,h1,h2,h3,h4,blockquote,figcaption,dd,dt,td,th,a,span,button';

    for (const el of document.querySelectorAll(BLOK)) {
      const kendi = [...el.childNodes]
        .filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      if (kendi.length < 25) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const st = getComputedStyle(el);
      if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) continue;

      const sy = parseFloat(st.lineHeight) || parseFloat(st.fontSize) * 1.4;
      const satir = Math.max(1, Math.round(r.height / sy));
      const cpl = kendi.length / satir;

      if (cpl < 26 && satir >= 3) {
        darlar.push({
          etiket: el.tagName.toLowerCase(),
          sinif: (el.className || '').toString().slice(0, 60),
          cpl: +cpl.toFixed(1), satir, en: Math.round(r.width), boy: Math.round(r.height),
          punto: st.fontSize, metin: kendi.slice(0, 55),
        });
      }

      const on = ayir(st.color).slice(0, 3);
      const ar = zemin(el);
      const o = oran(on, ar);
      const px = parseFloat(st.fontSize);
      const kalin = +st.fontWeight >= 700;
      const esik = px >= 24 || (px >= 18.66 && kalin) ? 3 : 4.5;
      if (o < esik) {
        kont.push({
          etiket: el.tagName.toLowerCase(), sinif: (el.className || '').toString().slice(0, 60),
          renk: st.color, zemin: `rgb(${ar.join(',')})`, oran: +o.toFixed(2), esik,
          punto: st.fontSize, metin: kendi.slice(0, 55),
        });
      }
    }
    return { darlar, kont };
  });

  for (const d of sonuc.darlar) dar.push({ sayfa: dosya, ...d });
  for (const k of sonuc.kont) kontrast.push({ sayfa: dosya, ...k });
}

await b.close();

writeFileSync(CIKTI + `mobil-dar-${EN}.json`, JSON.stringify(dar, null, 1));
writeFileSync(CIKTI + `mobil-kontrast-${EN}.json`, JSON.stringify(kontrast, null, 1));

console.log(`=== A · DAR SÜTUN (${EN}px, satır başına <26 karakter) ===`);
console.log('toplam ' + dar.length + ' blok, ' + new Set(dar.map((d) => d.sayfa)).size + ' sayfada\n');
const grup = {};
for (const d of dar) { const a = d.etiket + '.' + d.sinif.split(' ')[0]; (grup[a] ||= []).push(d); }
for (const [a, l] of Object.entries(grup).sort((x, y) => y[1].length - x[1].length).slice(0, 14)) {
  const ort = (l.reduce((s, d) => s + d.cpl, 0) / l.length).toFixed(1);
  console.log(`  ${String(l.length).padStart(3)}×  ${a.padEnd(32)} ort ${ort} kar/satır · en dar ${Math.min(...l.map((d) => d.en))}px`);
  console.log(`        "${l[0].metin}" — ${l[0].sayfa}`);
}

console.log(`\n=== B · KONTRAST İHLALİ (${EN}px, hesaplanmış renk) ===`);
console.log('toplam ' + kontrast.length + '\n');
const kg = {};
for (const k of kontrast) { const a = k.renk + ' / ' + k.zemin; (kg[a] ||= []).push(k); }
for (const [a, l] of Object.entries(kg).sort((x, y) => y[1].length - x[1].length).slice(0, 12)) {
  console.log(`  ${String(l.length).padStart(3)}×  ${a}  →  ${l[0].oran}:1 (eşik ${l[0].esik})`);
  console.log(`        ${l[0].etiket}.${l[0].sinif.split(' ')[0]} "${l[0].metin}" — ${l[0].sayfa}`);
}
console.log(`\nRapor: _audit/rapor/mobil-dar-${EN}.json · mobil-kontrast-${EN}.json`);

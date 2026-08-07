/* HESAPLANMIŞ RENK DONDURMA — Aşama 0'ın asıl kapısı.

   Her sayfadaki her öğenin çözülmüş color / background-color / border-color /
   outline-color değerlerini toplar. Renk katmanı refactor'ünde bu küme
   birebir aynı kalmalı.

   Piksel karşılaştırmasından daha keskin: ekran dışındaki öğeleri de görür,
   tembel görsel yüklenmesinden ve animasyon fazından etkilenmez.

   Kullanım:
     node _build/onizle.mjs 8899
     node _audit/denetim/gorunum-dondur.mjs oncesi
     ... refactor + node _build/build.mjs ...
     node _audit/denetim/gorunum-dondur.mjs sonrasi
     node _audit/denetim/gorunum-dondur.mjs kiyas */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const SITE = KOK + 'site/';
const RAPOR = KOK + '_audit/rapor/';
mkdirSync(RAPOR, { recursive: true });

const kip = process.argv[2];
if (!['oncesi', 'sonrasi', 'kiyas'].includes(kip)) {
  console.error('Kullanım: node _audit/denetim/gorunum-dondur.mjs oncesi|sonrasi|kiyas');
  process.exit(1);
}

const dosyaAdi = (k) => `${RAPOR}gorunum-${k}.json`;

if (kip === 'kiyas') {
  const a = JSON.parse(readFileSync(dosyaAdi('oncesi'), 'utf8'));
  const b = JSON.parse(readFileSync(dosyaAdi('sonrasi'), 'utf8'));
  const farklar = [];
  for (const sayfa of Object.keys(a)) {
    if (!b[sayfa]) { farklar.push({ sayfa, tur: 'sayfa yok' }); continue; }
    const x = a[sayfa], y = b[sayfa];
    if (x.length !== y.length) {
      farklar.push({ sayfa, tur: 'öğe sayısı', once: x.length, sonra: y.length });
      continue;
    }
    for (let i = 0; i < x.length; i++) {
      if (x[i].k !== y[i].k) {
        farklar.push({ sayfa, tur: 'renk', secici: x[i].s, once: x[i].k, sonra: y[i].k });
      }
    }
  }
  console.log('=== GÖRÜNÜM KIYASI (renk + tipografi + kutu) ===\n');
  const sayfaSayisi = Object.keys(a).length;
  const ogeSayisi = Object.values(a).reduce((t, l) => t + l.length, 0);
  console.log(`  ${sayfaSayisi} sayfa · ${ogeSayisi} öğe karşılaştırıldı\n`);
  if (!farklar.length) {
    console.log('  ✓ GÖRÜNÜM DEĞİŞMEDİ.');
    process.exit(0);
  }
  const grup = {};
  for (const f of farklar) {
    const anahtar = f.tur === 'renk' ? `${f.once}  →  ${f.sonra}` : f.tur;
    (grup[anahtar] ||= []).push(f);
  }
  for (const [anahtar, l] of Object.entries(grup).sort((p, q) => q[1].length - p[1].length)) {
    console.log(`  ⚠ ${String(l.length).padStart(4)}× ${anahtar}`);
    console.log(`         ${l[0].secici || ''} — ${l[0].sayfa}`);
  }
  writeFileSync(RAPOR + 'gorunum-kiyas.json', JSON.stringify(farklar.slice(0, 500), null, 1));
  console.log(`\n  toplam ${farklar.length} fark · _audit/rapor/gorunum-kiyas.json`);
  process.exit(1);
}

const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();
const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: 1440, height: 1000 } });
sf.setDefaultTimeout(15000);

const cikti = {};
for (const dosya of sayfalar) {
  const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
  try { await sf.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'domcontentloaded' }); }
  catch { /* devam */ }
  /* Web fontu yüklenmeden ölçüm alınırsa metin kutuları yedek fontla
     hesaplanır ve satır sayısı değişir; sahte fark üretir. */
  await sf.evaluate(() => document.fonts.ready);
  await sf.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
    document.head.appendChild(s);
  });
  await sf.waitForTimeout(400);
  cikti[dosya] = await sf.evaluate(() => {
    const l = [];
    let n = 0;
    for (const el of document.querySelectorAll('*')) {
      /* JS ile boyutlanan öğeler: canvas WebGL'den, ilerleme çubuğu
         zamanlayıcıdan boy alıyor. Ölçüm anına göre değişirler. */
      if (el.tagName === 'CANVAS' || /-progress-fill|slide-progress/.test(el.className || '')) continue;
      const c = getComputedStyle(el);
      /* Tek dizede topla: karşılaştırma ucuz olsun */
      /* Renk YETMİYOR. 7 Ağustos'ta renk katmanı göçünde :root'tan font ve
         boşluk token'ları yanlışlıkla silindi; bütün tipografi Times New
         Roman'a düştü ama renkler aynı kaldığı için bu kapı sessiz kaldı.
         O yüzden tipografi ve kutu ölçüleri de karşılaştırılıyor. */
      const r = el.getBoundingClientRect();
      const k = [
        /* renk */
        c.color, c.backgroundColor, c.borderTopColor, c.borderRightColor,
        c.borderBottomColor, c.borderLeftColor, c.outlineColor, c.textDecorationColor,
        c.backgroundImage.slice(0, 120),
        /* tipografi */
        c.fontFamily, c.fontSize, c.fontWeight, c.fontStyle, c.lineHeight,
        c.letterSpacing, c.textTransform,
        /* kutu */
        c.display, c.position, c.margin, c.padding, c.borderWidth,
        c.gridTemplateColumns, c.flexDirection, c.aspectRatio,
        Math.round(r.width), Math.round(r.height),
      ].join('|');
      /* Seçici izi: hata ayıklarken yeri bulmak için */
      const s = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/)[0] : '') + '#' + (n++);
      l.push({ s, k });
    }
    return l;
  });
  process.stdout.write('.');
}
await b.close();

writeFileSync(dosyaAdi(kip), JSON.stringify(cikti));
const toplam = Object.values(cikti).reduce((t, l) => t + l.length, 0);
console.log(`\n\n${sayfalar.length} sayfa · ${toplam} öğe → _audit/rapor/gorunum-${kip}.json`);

/* PİKSEL DONDURMA — görünüm regresyon ağı (PASS kapısı P12).

   Kullanım:
     node _build/build.mjs && node _build/onizle.mjs 8899
     node _audit/denetim/piksel.mjs oncesi     ← değişiklikten ÖNCE
     ... refactor ...
     node _build/build.mjs
     node _audit/denetim/piksel.mjs sonrasi    ← değişiklikten SONRA
     node _audit/denetim/piksel.mjs kiyas      ← farkı ölç

   31 sayfa × 3 genişlik = 93 görüntü. Token katmanı gibi "görünüm
   değişmemeli" turlarında fark SIFIR olmalı.

   Not: data-reveal animasyonları ölçümden önce sabitleniyor, yoksa
   her koşumda farklı ara karede yakalanır ve sahte fark üretir. */
import { chromium } from 'playwright-core';
import { readdirSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const SITE = KOK + 'site/';
const RAPOR = KOK + '_audit/rapor/';
const GORUNTU = RAPOR + 'goruntu/';
const ENLER = [390, 768, 1440];
const TABAN = 'http://127.0.0.1:8899/';

const kip = process.argv[2];
if (!['oncesi', 'sonrasi', 'kiyas'].includes(kip)) {
  console.error('Kullanım: node _audit/denetim/piksel.mjs oncesi|sonrasi|kiyas');
  process.exit(1);
}

const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();

/* ---------- kıyas kipi ---------- */
if (kip === 'kiyas') {
  const a = GORUNTU + 'oncesi/', b = GORUNTU + 'sonrasi/';
  if (!existsSync(a) || !existsSync(b)) {
    console.error('Önce "oncesi" ve "sonrasi" çekilmeli.');
    process.exit(1);
  }
  const farklar = [];
  let esit = 0, atlanan = 0;
  for (const ad of readdirSync(a)) {
    if (!existsSync(b + ad)) { atlanan++; continue; }
    const [x, y] = await Promise.all([
      sharp(a + ad).raw().toBuffer({ resolveWithObject: true }),
      sharp(b + ad).raw().toBuffer({ resolveWithObject: true }),
    ]);
    if (x.info.width !== y.info.width || x.info.height !== y.info.height) {
      farklar.push({ ad, tur: 'boyut', once: `${x.info.width}×${x.info.height}`, sonra: `${y.info.width}×${y.info.height}` });
      continue;
    }
    let sayac = 0, enBuyuk = 0;
    for (let i = 0; i < x.data.length; i += x.info.channels) {
      const d = Math.max(
        Math.abs(x.data[i] - y.data[i]),
        Math.abs(x.data[i + 1] - y.data[i + 1]),
        Math.abs(x.data[i + 2] - y.data[i + 2]),
      );
      if (d > 2) { sayac++; if (d > enBuyuk) enBuyuk = d; }
    }
    const toplam = x.info.width * x.info.height;
    if (sayac) farklar.push({ ad, tur: 'piksel', sayac, yuzde: +(sayac / toplam * 100).toFixed(3), enBuyuk });
    else esit++;
  }

  console.log(`=== PİKSEL KIYASI ===\n`);
  console.log(`  aynı: ${esit} · farklı: ${farklar.length}${atlanan ? ` · eşi yok: ${atlanan}` : ''}\n`);
  if (!farklar.length) {
    console.log('  ✓ GÖRÜNÜM DEĞİŞMEDİ — P12 geçti.');
  } else {
    for (const f of farklar.sort((p, q) => (q.yuzde || 999) - (p.yuzde || 999)).slice(0, 30)) {
      if (f.tur === 'boyut') console.log(`  ⚠ ${f.ad}  BOYUT ${f.once} → ${f.sonra}`);
      else console.log(`  ⚠ ${f.ad}  %${f.yuzde} piksel (${f.sayac}) · en büyük kanal farkı ${f.enBuyuk}`);
    }
    if (farklar.length > 30) console.log(`  … +${farklar.length - 30} dosya daha`);
  }
  writeFileSync(RAPOR + 'piksel-kiyas.json', JSON.stringify(farklar, null, 1));
  process.exit(farklar.length ? 1 : 0);
}

/* ---------- çekim kipi ---------- */
const hedef = GORUNTU + kip + '/';
mkdirSync(hedef, { recursive: true });

const b = await chromium.launch({ channel: 'chrome' });
let n = 0;
for (const en of ENLER) {
  const sf = await b.newPage({ viewport: { width: en, height: 1000 }, deviceScaleFactor: 1 });
  sf.setDefaultTimeout(25000);
  for (const dosya of sayfalar) {
    const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
    /* `networkidle` KULLANMA: sonsuz kayan şerit ve WebGL yüzünden ağ hiç
       boşa çıkmıyor, her sayfa zaman aşımına düşüyor ve koşum 40 dakika
       sürüyor. `domcontentloaded` + açık görsel beklemesi yeterli. */
    try {
      await sf.goto(TABAN + adres, { waitUntil: 'domcontentloaded' });
    } catch { /* yine de devam */ }
    /* Animasyonları sabitle ve görselleri bekle */
    await sf.evaluate(() => {
      for (const e of document.querySelectorAll('[data-reveal]')) {
        e.setAttribute('data-reveal', 'in'); e.style.opacity = '1'; e.style.transform = 'none';
      }
      const s = document.createElement('style');
      s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
      document.head.appendChild(s);
    });
    /* Tembel görselleri tetikle: sayfa sonuna kadar in, sonra başa dön */
    await sf.evaluate(async () => {
      const adim = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += adim) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
      await Promise.all([...document.images].map((i) =>
        i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
    });
    await sf.waitForTimeout(300);
    const ad = `${dosya.replace(/\.html$/, '')}--${en}.png`;
    await sf.screenshot({ path: hedef + ad, fullPage: true });
    n++;
  }
  await sf.close();
  console.log(`  ${en}px bitti`);
}
await b.close();
console.log(`\n${n} görüntü → _audit/rapor/goruntu/${kip}/`);

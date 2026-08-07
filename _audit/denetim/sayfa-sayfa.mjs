/* SAYFA SAYFA GERİ BİLDİRİM UYUMU
   Her sayfa için: fotoğraf yığını (madde 12), görsel/metin dengesi
   (madde 6), uzunluk (madde 2), çözünürlük.
   Önce: node _build/onizle.mjs 8899 */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gorselOlculeri } from '../../_build/gorsel-olculeri.mjs';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const sayfalar = readdirSync(KOK + 'site').filter((f) => f.endsWith('.html')).sort();
const b = await chromium.launch({ channel: 'chrome' });

const olc = async (en) => {
  const sf = await b.newPage({ viewport: { width: en, height: 844 } });
  sf.setDefaultTimeout(15000);
  const o = {};
  for (const d of sayfalar) {
    const a = d === 'index.html' ? '' : d.replace(/\.html$/, '');
    try { await sf.goto('http://127.0.0.1:8899/' + a, { waitUntil: 'domcontentloaded' }); } catch { continue; }
    await sf.evaluate(() => document.fonts.ready);
    await sf.evaluate(async () => {
      for (const e of document.querySelectorAll('[data-reveal]')) {
        e.setAttribute('data-reveal', 'in'); e.style.opacity = '1'; e.style.transform = 'none';
      }
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25));
      }
      window.scrollTo(0, 0);
    });
    await sf.waitForTimeout(200);
    o[d] = await sf.evaluate(() => {
      const akis = [];
      for (const e of document.querySelectorAll('img, p, h1, h2, h3, li, dd')) {
        const r = e.getBoundingClientRect();
        if (r.width < 60 || r.height < 24) continue;
        if (e.tagName === 'IMG') {
          if (r.width < 150 || r.height < 100) continue;
          akis.push({ t: 'f', y: r.y + window.scrollY, src: e.getAttribute('src') || '' });
        } else if (e.textContent.trim().length > 60) akis.push({ t: 'm', y: r.y + window.scrollY });
      }
      akis.sort((x, y) => x.y - y.y);
      let enUzun = 0, suan = 0, bas = 0, yiginY = 0;
      for (const x of akis) {
        if (x.t === 'f') { if (!suan) bas = x.y; suan++; if (suan > enUzun) { enUzun = suan; yiginY = bas; } }
        else suan = 0;
      }
      const foto = akis.filter((x) => x.t === 'f');
      const metin = akis.filter((x) => x.t === 'm');
      /* Metin bloğu genişlikleri — madde 6 için */
      const darMetin = [...document.querySelectorAll('p,li,dd')].filter((e) => {
        const r = e.getBoundingClientRect();
        return e.textContent.trim().length > 40 && r.width > 2 && r.width < 320;
      }).length;
      return {
        boy: document.body.scrollHeight, ekran: window.innerHeight,
        foto: foto.length, metin: metin.length, yigin: enUzun,
        yiginKonum: document.body.scrollHeight ? +(yiginY / document.body.scrollHeight).toFixed(2) : 0,
        darMetin, kaynaklar: foto.map((f) => f.src),
      };
    });
  }
  await sf.close();
  return o;
};

const M = await olc(1440);
const T = await olc(390);
await b.close();

const anahtar = (s) => (s || '').replace(/^assets\/img\//, '').replace(/^rev2\//, '')
  .replace(/-\d+w$/, '').replace(/-800$/, '').replace(/\.(jpe?g|png|webp|avif)$/i, '');

console.log('=== SAYFA SAYFA GERİ BİLDİRİM UYUMU ===\n');
console.log('sayfa                                  ekran(M/T)  foto  metin  yığın  dar  düşük-çöz');
console.log('-'.repeat(94));

const sorunlar = {};
for (const d of sayfalar) {
  const m = M[d], t = T[d];
  if (!m) continue;
  const eM = (m.boy / m.ekran), eT = t ? (t.boy / t.ekran) : 0;
  const dusuk = [...new Set(m.kaynaklar)].filter((s) => {
    const o = gorselOlculeri[anahtar(s)];
    return o && o[0] < 600 && !/^(logos|brand)\//.test(anahtar(s));
  }).length;

  const bayrak = [];
  if (eM > 8 || eT > 10) bayrak.push('UZUN');
  if (m.yigin >= 3) bayrak.push('YIĞIN');
  if (t && t.darMetin > 2) bayrak.push('DAR');
  if (dusuk) bayrak.push('ÇÖZÜNÜRLÜK');
  if (m.foto === 0) bayrak.push('FOTOĞRAFSIZ');

  console.log(
    `${d.replace('.html', '').padEnd(38)}${eM.toFixed(1).padStart(5)}/${eT.toFixed(1).padStart(5)}` +
    `${String(m.foto).padStart(6)}${String(m.metin).padStart(7)}${String(m.yigin).padStart(7)}` +
    `${String(t ? t.darMetin : 0).padStart(5)}${String(dusuk).padStart(8)}   ${bayrak.join(' ')}`,
  );
  if (bayrak.length) sorunlar[d] = { eM: +eM.toFixed(1), eT: +eT.toFixed(1), ...m, darT: t?.darMetin, dusuk, bayrak };
}

console.log('\n\n=== SORUNLU SAYFALAR, KALIBA GÖRE ===\n');
const kalip = {};
for (const [d, s] of Object.entries(sorunlar)) {
  const k = s.bayrak.join(' + ');
  (kalip[k] ||= []).push({ d, ...s });
}
for (const [k, l] of Object.entries(kalip).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${k}  (${l.length} sayfa)`);
  for (const x of l) {
    console.log(`    ${x.d.replace('.html', '').padEnd(36)} masaüstü ${x.eM} / telefon ${x.eT} ekran · ${x.foto} foto · ${x.yigin} üst üste · ${x.darT} dar blok`);
  }
  console.log('');
}
writeFileSync(KOK + '_audit/rapor/sayfa-sayfa.json', JSON.stringify({ M, T, sorunlar }, null, 1));
console.log('Rapor: _audit/rapor/sayfa-sayfa.json');

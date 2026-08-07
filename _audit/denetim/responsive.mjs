/* RESPONSIVE DENETİM — 20 sayfa × 6 ekran sınıfı.
   Telefon, tablet, laptop, masaüstü, 2K, 4K.

   Aranan kusurlar:
     · yatay taşma (en sık ve en görünür hata)
     · içeriğin ekran genişliğini aşması
     · 2K/4K'da içeriğin gereksiz gerilmesi (satır uzunluğu okunmaz olur)
     · metnin çok küçük kalması
     · üst üste binen ögeler
     · görünmeyen/kırpılan ögeler */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const KOK_ = fileURLToPath(new URL('../../', import.meta.url));
const SITE_ = KOK_ + 'site/';
const RAPOR_ = KOK_ + '_audit/rapor/';
mkdirSync(RAPOR_, { recursive: true });


const adresler = readdirSync(SITE_)
  .filter((f) => f.endsWith('.html'))
  .map((f) => (f === 'index.html' ? '' : f.replace(/\.html$/, '')));

const EKRANLAR = [
  ['telefon',  390, 844, 3],
  ['tablet',   768, 1024, 2],
  ['laptop',  1366, 768, 1],
  ['masaüstü',1920, 1080, 1],
  ['2K',      2560, 1440, 1],
  ['4K',      3840, 2160, 1],
];

const denetim = () => {
  const c = [];
  const G = window.innerWidth;

  /* 1 · Yatay taşma */
  const belge = document.documentElement.scrollWidth;
  if (belge > G + 1) {
    /* Taşmaya sebep olan ögeyi bul */
    const suclu = [...document.querySelectorAll('body *')].filter((e) => {
      const r = e.getBoundingClientRect();
      return r.right > G + 2 && r.width > 8 && getComputedStyle(e).position !== 'fixed';
    }).slice(0, 3).map((e) => (e.tagName + '.' + String(e.className).split(' ')[0]).slice(0, 40));
    c.push(`yatay taşma ${belge}>${G} · sebep: ${suclu.join(', ') || '?'}`);
  }

  /* 2 · Satır uzunluğu — geniş ekranda metin okunmaz hale gelmemeli */
  const paragraflar = [...document.querySelectorAll('p')].filter((e) => {
    const t = e.textContent.trim();
    const r = e.getBoundingClientRect();
    return t.length > 120 && r.width > 0;
  });
  for (const p of paragraflar.slice(0, 40)) {
    const s = getComputedStyle(p);
    const px = parseFloat(s.fontSize);
    const kar = p.getBoundingClientRect().width / (px * 0.5);   /* kabaca karakter */
    if (kar > 100) { c.push(`satır çok uzun: ~${Math.round(kar)} karakter · "${p.textContent.trim().slice(0, 30)}"`); break; }
  }

  /* 3 · Çok küçük metin */
  const kucukMetin = [...document.querySelectorAll('p,li,dd,a,span')].filter((e) => {
    const t = e.textContent.trim();
    if (!t || t.length < 12) return false;
    if (e.children.length) return false;
    const r = e.getBoundingClientRect();
    if (!r.width) return false;
    return parseFloat(getComputedStyle(e).fontSize) < 12;
  });
  if (kucukMetin.length) c.push(`${kucukMetin.length} ögede 12px altı metin`);

  /* 4 · Görüntü alanını aşan tek öge (kırpılma) */
  const tasan = [...document.querySelectorAll('img,video,table,pre')].filter((e) => {
    const r = e.getBoundingClientRect();
    return r.width > G + 2;
  });
  if (tasan.length) c.push(`${tasan.length} görsel/tablo ekrandan geniş`);

  /* 5 · Menü durumu — dar ekranda hamburger, geniş ekranda menü */
  const nav = document.querySelector('nav.nav');
  const burger = document.querySelector('.burger');
  if (nav && burger) {
    const navGorunur = getComputedStyle(nav).display !== 'none';
    const burgerGorunur = getComputedStyle(burger).display !== 'none';
    if (navGorunur && burgerGorunur) c.push('menü ve hamburger aynı anda görünüyor');
    if (!navGorunur && !burgerGorunur) c.push('ne menü ne hamburger görünüyor');
  }

  /* 6 · İçerik kabı geniş ekranda sonsuz gerilmemeli */
  const wrap = document.querySelector('.wrap');
  if (wrap && G >= 2560) {
    const w = wrap.getBoundingClientRect().width;
    if (w > 1800) c.push(`içerik kabı ${Math.round(w)}px — çok geniş, okunurluk düşer`);
  }
  return [...new Set(c)];
};

const t = await chromium.launch({ channel: 'chrome' });
const rapor = [];
let toplam = 0;

for (const [ad, w, h, dpr] of EKRANLAR) {
  const ctx = await t.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  for (const a of adresler) {
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:8899/' + a, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.querySelectorAll('[data-reveal]')
      .forEach((e) => { e.style.opacity = '1'; e.style.transform = 'none'; }));
    const b = await p.evaluate(denetim);
    if (b.length) { rapor.push({ ekran: `${ad} ${w}`, sayfa: a || '/', bulgular: b }); toplam += b.length; }
    await p.close();
  }
  await ctx.close();
  process.stdout.write(`${ad} bitti · `);
}
await t.close();

console.log(`\n\n${adresler.length} sayfa × ${EKRANLAR.length} ekran · ${toplam} bulgu\n`);
const grup = {};
for (const r of rapor) for (const b of r.bulgular) {
  const k = b.replace(/\d+/g, 'N').slice(0, 70);
  (grup[k] ||= { n: 0, ekran: new Set(), sayfa: new Set(), ornek: b });
  grup[k].n++; grup[k].ekran.add(r.ekran.split(' ')[0]); grup[k].sayfa.add(r.sayfa);
}
for (const [, v] of Object.entries(grup).sort((a, b) => b[1].n - a[1].n)) {
  console.log(`■ ${v.n} kez · ekran: ${[...v.ekran].join(', ')} · ${v.sayfa.size} sayfa`);
  console.log(`   ${v.ornek}`);
}
if (!toplam) console.log('✓ Altı ekran sınıfında da bulgu yok.');
writeFileSync(RAPOR_ + 'responsive.json', JSON.stringify(rapor, null, 1));

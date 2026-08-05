/* Canlı denetim — Playwright ile 20 sayfa × 4 genişlik.
   Statik taramanın göremediği şeyler: gerçek kontrast oranı, konsol
   hataları, kırık görseller, yatay taşma, dokunma hedefi boyutu. */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync } from 'node:fs';

const SITE = 'c:/Users/Gaming/Desktop/Afloday/site/';
const KOK = 'http://127.0.0.1:8899/';
const adresler = readdirSync(SITE).filter((f) => f.endsWith('.html'))
  .map((f) => (f === 'index.html' ? '' : f.replace(/\.html$/, '')));

const OLCU = [[375, 812], [768, 1024], [1024, 768], [1440, 900]];

const sayfaDenetimi = () => {
  const c = [];
  /* --- kontrast: gerçek renkleri okuyup oran hesapla --- */
  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ayir = (s) => (s.match(/\d+(\.\d+)?/g) || []).map(Number);
  const zemin = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const p = ayir(bg);
      if (p.length >= 3 && (p[3] === undefined || p[3] > 0.5)) return p;
      n = n.parentElement;
    }
    return [255, 255, 255];
  };
  const metinler = [...document.querySelectorAll('p,h1,h2,h3,h4,li,a,button,span,dd,dt,address,label')]
    .filter((e) => {
      const t = e.textContent.trim();
      if (!t || t.length < 2) return false;
      if (e.children.length && ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
      const r = e.getBoundingClientRect();
      const s = getComputedStyle(e);
      return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && Number(s.opacity) > 0.1;
    });
  for (const e of metinler) {
    const s = getComputedStyle(e);
    const fg = ayir(s.color), bg = zemin(e);
    const L1 = lum(fg[0], fg[1], fg[2]), L2 = lum(bg[0], bg[1], bg[2]);
    const oran = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(s.fontSize);
    const kalin = Number(s.fontWeight) >= 700;
    const buyuk = px >= 24 || (px >= 18.66 && kalin);
    const esik = buyuk ? 3 : 4.5;
    if (oran < esik - 0.05)
      c.push(`kontrast ${oran.toFixed(2)} (gerek ${esik}) · ${px}px · "${e.textContent.trim().slice(0, 42)}"`);
  }
  /* --- kırık görsel --- */
  const kirik = [...document.images].filter((i) => i.complete && i.naturalWidth === 0);
  kirik.forEach((i) => c.push('kırık görsel: ' + i.getAttribute('src')));
  /* --- yatay taşma --- */
  if (document.documentElement.scrollWidth > window.innerWidth + 1)
    c.push(`yatay taşma: ${document.documentElement.scrollWidth} > ${window.innerWidth}`);
  /* --- dokunma hedefi --- */
  if (window.innerWidth < 900) {
    const kucuk = [...document.querySelectorAll('a,button,input,select,textarea')].filter((e) => {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      if (e.closest('nav.nav')) return false;             /* masaüstü menüsü mobilde gizli */
      return r.height < 40 || r.width < 40;
    });
    const benzersiz = [...new Set(kucuk.map((e) => (e.textContent.trim() || e.className).slice(0, 34)))];
    benzersiz.slice(0, 3).forEach((x) => c.push('küçük dokunma hedefi: ' + x));
  }
  return [...new Set(c)];
};

/* Kurulu Chromium kullanılıyor; projeye bağımlılık eklenmedi. */
const tarayici = await chromium.launch({ channel: 'chrome' });
const rapor = [];
let toplam = 0;
for (const [w, hgt] of OLCU) {
  const ctx = await tarayici.newContext({ viewport: { width: w, height: hgt } });
  for (const a of adresler) {
    const p = await ctx.newPage();
    const konsol = [];
    p.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text().slice(0, 110)); });
    p.on('pageerror', (e) => konsol.push('JS: ' + String(e).slice(0, 110)));
    await p.goto(KOK + a, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.querySelectorAll('[data-reveal]')
      .forEach((e) => { e.style.opacity = '1'; e.style.transform = 'none'; }));
    const c = await p.evaluate(sayfaDenetimi);
    const hepsi = [...c, ...konsol.map((k) => 'konsol: ' + k)];
    if (hepsi.length) { rapor.push({ olcu: `${w}px`, sayfa: a || '/', bulgular: hepsi }); toplam += hepsi.length; }
    await p.close();
  }
  await ctx.close();
}
await tarayici.close();

console.log(`${adresler.length} sayfa × ${OLCU.length} genişlik · ${toplam} bulgu\n`);
for (const r of rapor) {
  console.log(`── ${r.olcu} · /${r.sayfa}`);
  r.bulgular.forEach((b) => console.log('     ' + b));
}
if (!toplam) console.log('✓ Canlı denetimde bulgu yok.');
writeFileSync('C:/Users/Gaming/AppData/Local/Temp/claude/c--Users-Gaming-Desktop-Afloday/9762a584-306b-4526-88f3-6d66de01acda/scratchpad/canli-rapor.json', JSON.stringify(rapor, null, 1));

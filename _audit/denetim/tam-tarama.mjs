/* TAM TARAMA — her sayfa, üç çözünürlük, yedi ölçüt.

   Ölçütler:
     1 RENK      hesaplanmış kontrast, WCAG AA (4.5 küçük / 3.0 iri metin)
     2 DÜZEN     fotoğraf yığını, metin yığını, akış deseni
     3 GERİ BİLDİRİM  başlık sonu noktası, eski logo rengi, sayaç
     4 TİPOGRAFİ başlık/gövde oranı, en küçük punto
     5 RESPONSIVE yatay taşma, dar metin bloğu
     6 KIRPMA    doğal oran ile çizilen oran farkı
     7 UZUNLUK   ekran sayısı

   Önce: node _build/build.mjs && node _build/onizle.mjs 8899 */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(KOK + '_audit/rapor/', { recursive: true });
const sayfalar = readdirSync(KOK + 'site').filter((f) => f.endsWith('.html')).sort();

const EKRANLAR = [[390, 'mobil'], [1366, 'laptop'], [1920, 'pc']];

const b = await chromium.launch({ channel: 'chrome' });
const rapor = {};

for (const [en, ad] of EKRANLAR) {
  const sf = await b.newPage({ viewport: { width: en, height: 900 } });
  sf.setDefaultTimeout(20000);
  for (const dosya of sayfalar) {
    const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
    try { await sf.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'domcontentloaded' }); }
    catch { continue; }
    await Promise.race([
      sf.evaluate(() => document.fonts.ready).catch(() => {}),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
    /* Tembel görselleri yükle, animasyonları dondur */
    await sf.evaluate(async () => {
      for (const e of document.querySelectorAll('[data-reveal]')) {
        e.setAttribute('data-reveal', 'in'); e.style.opacity = '1'; e.style.transform = 'none';
      }
      const s = document.createElement('style');
      s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
      document.head.appendChild(s);
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
      await Promise.all([...document.images].map((i) =>
        i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })));
    });
    await sf.waitForTimeout(400);

    const o = await sf.evaluate(() => {
      const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      const lum = (c) => 0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2]);
      const ayir = (s) => (s.match(/[\d.]+/g) || []).map(Number);
      const oran = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
      const zemin = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const c = ayir(getComputedStyle(n).backgroundColor);
          if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
          if (getComputedStyle(n).backgroundImage !== 'none') return null;   /* foto üstü, ayrı konu */
          n = n.parentElement;
        }
        return [255, 255, 255];
      };

      /* 1 · KONTRAST */
      const kontrast = [];
      for (const el of document.querySelectorAll('p,li,h1,h2,h3,h4,a,span,dd,dt,button,figcaption')) {
        const kendi = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
        if (kendi.length < 3) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        const c = getComputedStyle(el);
        if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity === 0) continue;
        const ar = zemin(el);
        if (!ar) continue;
        const on = ayir(c.color).slice(0, 3);
        const px = parseFloat(c.fontSize);
        const esik = px >= 24 || (px >= 18.66 && +c.fontWeight >= 700) ? 3 : 4.5;
        const d = oran(on, ar);
        if (d < esik) kontrast.push({ metin: kendi.slice(0, 40), renk: c.color,
          zemin: `rgb(${ar.join(',')})`, oran: +d.toFixed(2), esik, punto: c.fontSize });
      }

      /* 2 · AKIŞ DESENİ */
      const akis = [];
      for (const el of document.querySelectorAll('img,p,h1,h2,h3,li')) {
        const r = el.getBoundingClientRect();
        if (r.width < 60 || r.height < 24) continue;
        if (el.tagName === 'IMG') { if (r.width < 140 || r.height < 90) continue; akis.push('F'); }
        else if (el.textContent.trim().length > 60) akis.push('M');
      }
      const enUzun = (h) => { let m = 0, s = 0; for (const x of akis) { if (x === h) { s++; if (s > m) m = s; } else s = 0; } return m; };

      /* 3 · GERİ BİLDİRİM */
      const noktali = [...document.querySelectorAll('h1,h2,h3,h4')]
        .map((e) => e.textContent.trim()).filter((t) => /[.]$/.test(t) && !/\.\.\.$/.test(t));
      const ESKI = ['rgb(168, 43, 69)', 'rgb(138, 32, 57)', 'rgb(125, 95, 49)', 'rgb(183, 155, 98)'];
      let eskiRenk = 0;
      for (const el of document.querySelectorAll('*')) {
        const c = getComputedStyle(el);
        if (ESKI.includes(c.color) || ESKI.includes(c.backgroundColor)) eskiRenk++;
      }

      /* 4 · TİPOGRAFİ */
      const bas = [...document.querySelectorAll('h1,h2')].map((e) => parseFloat(getComputedStyle(e).fontSize));
      const govde = parseFloat(getComputedStyle(document.body).fontSize);
      const kucukMetin = [...document.querySelectorAll('p,li,dd')]
        .filter((e) => e.textContent.trim().length > 30)
        .map((e) => parseFloat(getComputedStyle(e).fontSize));

      /* 5 · RESPONSIVE */
      const tasma = document.documentElement.scrollWidth > window.innerWidth + 1;
      const darMetin = [...document.querySelectorAll('p,li,dd')].filter((e) => {
        const r = e.getBoundingClientRect();
        return e.textContent.trim().length > 40 && r.width > 2 && r.width < 300;
      }).length;

      /* 6 · KIRPMA */
      const kirpik = [...document.images].filter((i) => {
        const r = i.getBoundingClientRect();
        if (r.width < 140 || !i.naturalWidth) return false;
        const d = i.naturalWidth / i.naturalHeight, c = r.width / r.height;
        return getComputedStyle(i).objectFit === 'cover' && Math.abs(1 - (d > c ? c / d : d / c)) > 0.05;
      });

      return {
        boy: document.body.scrollHeight, ekran: window.innerHeight,
        kontrastIhlal: kontrast.length, kontrastOrnek: kontrast.slice(0, 3),
        desen: akis.join(''), fotoYigin: enUzun('F'), metinYigin: enUzun('M'),
        noktali, eskiRenk,
        enBuyukBaslik: bas.length ? Math.max(...bas) : 0, govde,
        enKucukMetin: kucukMetin.length ? Math.min(...kucukMetin) : 0,
        tasma, darMetin,
        kirpikSayisi: kirpik.length,
        kirpikOrnek: kirpik.slice(0, 2).map((i) => i.getAttribute('src').split('/').pop()),
        gorsel: [...document.images].filter((i) => i.getBoundingClientRect().width > 140).length,
      };
    });
    (rapor[dosya] ||= {})[ad] = o;
  }
  await sf.close();
  console.log(`${ad} (${en}px) bitti`);
}
await b.close();
writeFileSync(KOK + '_audit/rapor/tam-tarama.json', JSON.stringify(rapor, null, 1));
console.log('\nRapor: _audit/rapor/tam-tarama.json');

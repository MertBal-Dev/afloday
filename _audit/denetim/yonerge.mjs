/* Belgedeki 9 yerleşim yönergesi uygulandı mı? Metin denetimine takılmıyorlar,
   kod ve hesaplanmış stil üzerinden doğrulanıyor. */
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';

const KOK = 'c:/Users/Gaming/Desktop/Afloday/';
const oku = (f) => readFileSync(KOK + 'site/' + f, 'utf8');
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();

const sonuc = [];
const yaz = (no, istek, gecti, kanit) => sonuc.push({ no, istek, gecti, kanit });

const index = oku('index.html');
const gt = oku('gelecegi-tasarla.html');

/* 14 · Slayt 1 görseli — belge hem tarif hem dosya adı veriyor (satır 16) */
yaz(14, 'Slayt 1: doğada profesyonel görseli',
  index.includes('rest-after-work-office-beautiful-young-business-woman'),
  'belgenin 16. satırda verdiği dosya kullanılıyor');

/* 15 · Metinler görsellerin ÜZERİNE yazılsın */
await p.goto('http://127.0.0.1:8899/', { waitUntil: 'networkidle' });
const ustunde = await p.evaluate(() => {
  const s = document.querySelector('.slide-content');
  const c = document.querySelector('.webgl-canvas, .slider-wrapper canvas, .slide-gorsel');
  if (!s) return null;
  const cs = getComputedStyle(s);
  const kutu = s.getBoundingClientRect();
  const perde = document.querySelector('.slide-scrim');
  return {
    konum: cs.position, z: cs.zIndex,
    gorselVar: !!c,
    perde: perde ? getComputedStyle(perde).background.slice(0, 40) : 'yok',
    metinUstte: kutu.width > 0 && (cs.position === 'absolute' || cs.position === 'relative'),
  };
});
yaz(15, 'Metinler görsellerin üzerine yazılsın',
  !!(ustunde && ustunde.metinUstte && ustunde.gorselVar),
  ustunde ? `.slide-content position:${ustunde.konum} z-index:${ustunde.z} · perde: ${ustunde.perde !== 'yok' ? 'var' : 'yok'}` : 'slayt bulunamadı');

/* 23 · Slayt 2 görseli — belge satır 24: "Resim1" */
yaz(23, 'Slayt 2: fidan tutan el (belge: Resim1)',
  index.includes('resim1'), 'Resim1.jpg kullanılıyor');

/* 32 · Slayt 3 görseli — belge satır 33 */
yaz(32, 'Slayt 3: nota/ışık motifi',
  index.includes('abstract-woman-hands-touching-music-notes'),
  'belgenin 33. satırda verdiği dosya kullanılıyor');

/* 49 · 4 istatistik kutusu */
const kutuSayisi = (index.match(/istatistik-kutu"/g) || []).length;
yaz(49, '4 istatistik kutusu', kutuSayisi === 4, `${kutuSayisi} kutu`);

/* 54 · Görsel yönü: büyük punto, tek cümle, düşük foto yoğunluğu */
const ist = await p.evaluate(() => {
  const r = document.querySelector('.istatistik-rakam');
  const d = document.querySelector('.istatistik-doku img');
  return {
    punto: r ? getComputedStyle(r).fontSize : '?',
    dokuOpaklik: d ? getComputedStyle(d).opacity : '?',
    dokuFiltre: d ? getComputedStyle(d).filter : '?',
  };
});
yaz(54, 'Büyük punto rakam + düşük foto yoğunluğu',
  parseFloat(ist.punto) >= 40 && parseFloat(ist.dokuOpaklik) <= 0.2,
  `rakam ${ist.punto} · doku opaklık ${ist.dokuOpaklik}, ${ist.dokuFiltre}`);

/* 302 · 4 element ikonu + pencerelere giden harita */
await p.goto('http://127.0.0.1:8899/gelecegi-tasarla', { waitUntil: 'networkidle' });
const harita = await p.evaluate(() => {
  const s = document.querySelectorAll('.gt-element');
  return { adet: s.length, svg: [...s].filter((e) => e.querySelector('svg')).length,
    capa: [...s].filter((e) => (e.getAttribute('href') || '').startsWith('#')).length };
});
yaz(302, '4 küçük ikon, pencerelere giden harita',
  harita.adet === 4 && harita.svg === 4 && harita.capa === 4,
  `${harita.adet} öge · ${harita.svg} SVG ikon · ${harita.capa} çapa bağlantısı`);

/* 304 · 4 anchor kart, kendi rengi, element rozeti */
const kart = await p.evaluate(() => {
  const s = [...document.querySelectorAll('.pencere')];
  return {
    adet: s.length,
    renkli: s.filter((e) => e.style.getPropertyValue('--element')).length,
    rozet: s.filter((e) => e.querySelector('.pencere-element')).length,
    hedef: s.filter((e) => e.id).length,
  };
});
yaz(304, '4 anchor kart · kendi rengi · element rozeti',
  kart.adet === 4 && kart.renkli === 4 && kart.rozet === 4 && kart.hedef === 4,
  `${kart.adet} bölüm · ${kart.renkli} kendi rengi · ${kart.rozet} rozet · ${kart.hedef} çapa hedefi`);

/* 389 · Referans logoları kalsın */
const logo = (index.match(/marquee-item|logo-wall-item|ref-logo/g) || []).length;
yaz(389, 'Referanslarımız marka logoları kalsın', logo > 0, `${logo} logo ögesi`);

await b.close();

console.log('SATIR  YÖNERGE'.padEnd(56) + 'DURUM');
console.log('─'.repeat(112));
for (const s of sonuc)
  console.log(String(s.no).padStart(4) + '   ' + s.istek.padEnd(46)
    + (s.gecti ? '✓ ' : '✗ ') + s.kanit);
console.log('─'.repeat(112));
console.log(`${sonuc.length} yönerge · ${sonuc.filter((x) => x.gecti).length} uygulanmış`);

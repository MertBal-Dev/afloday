/* Yerel site ile YAYINDAKİ siteyi karşılaştır.

   "Yerelde ne değişti?" sorusunun kesin cevabı. Aynı sayfaları iki
   kaynaktan açar, her öğenin rengini/tipografisini/kutu ölçüsünü
   karşılaştırır.

   Kullanım: node _build/onizle.mjs 8899  &&  node _audit/denetim/canli-kiyas.mjs */
import { chromium } from 'playwright-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(KOK + '_audit/rapor/', { recursive: true });

const YEREL = 'http://127.0.0.1:8899/';
const CANLI = 'https://afloday.vercel.app/';

/* Temsilci sayfalar: her tasarım ailesinden biri */
const SAYFALAR = ['', 'hakkimizda', 'doga-temelli-egitimlerimiz', 'kurumsal',
  'etkinlik-cocuk', 'egitim-iletisim-dili', 'gulumseyen-yarinlar-projesi',
  'iletisim', 'ceylan-kalyon'];

const oku = async (sf, adres) => {
  await sf.goto(adres, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await sf.evaluate(() => document.fonts.ready);
  await sf.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
    document.head.appendChild(s);
  });
  await sf.waitForTimeout(500);
  return sf.evaluate(() => {
    const l = [];
    /* Görsel olmayan ve Next'in çalışma anında eklediği öğeler dışarıda:
       yerel önizleme ham statik HTML sunuyor, canlıyı Next sunuyor ve
       14 betik + 6 meta + route-announcer ekliyor. Bunlar sayılırsa
       öğe sayıları tutmaz ve karşılaştırma hiç yapılamaz. */
    const ATLA = new Set(['SCRIPT', 'LINK', 'META', 'STYLE', 'TITLE', 'HEAD',
      'NEXT-ROUTE-ANNOUNCER', 'CANVAS']);
    for (const el of document.querySelectorAll('*')) {
      if (ATLA.has(el.tagName)) continue;
      if (/progress-fill/.test(el.className || '')) continue;
      /* Next'in portal kapları ve kök sarmalayıcısı: sınıfsız, kimliksiz
         div'ler. Kök sarmalayıcı body'nin ilk çocuğu ve içi dolu. */
      if (el.tagName === 'DIV' && !el.className && !el.id) continue;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      l.push([c.color, c.backgroundColor, c.borderTopColor, c.fontFamily, c.fontSize,
        c.fontWeight, c.lineHeight, c.letterSpacing, c.display, c.margin, c.padding,
        Math.round(r.width), Math.round(r.height)].join('|'));
    }
    return l;
  });
};

const b = await chromium.launch({ channel: 'chrome' });
const sf = await b.newPage({ viewport: { width: 1440, height: 1000 } });

console.log('=== YEREL ↔ YAYINDAKİ SİTE ===\n');
let toplamFark = 0, toplamOge = 0;
const rapor = [];

for (const s of SAYFALAR) {
  const [y, c] = [await oku(sf, YEREL + s), await oku(sf, CANLI + s)];
  const ad = s || '(anasayfa)';
  if (y.length !== c.length) {
    /* Sayı tutmuyorsa karşılaştırma yapılamaz. Bunu SESSİZCE geçme:
       önceki sürüm burada `continue` edip sonda "birebir aynı" yazdırıyordu,
       yani hiç karşılaştırmadan yeşil veriyordu. */
    console.log(`  ✗ ${ad.padEnd(32)} öğe sayısı farklı: yerel ${y.length} · canlı ${c.length} — KARŞILAŞTIRILAMADI`);
    rapor.push({ sayfa: ad, tur: 'öğe sayısı', yerel: y.length, canli: c.length });
    toplamFark += Math.abs(y.length - c.length);
    continue;
  }
  let f = 0;
  const ornekler = [];
  for (let i = 0; i < y.length; i++) {
    if (y[i] !== c[i]) { f++; if (ornekler.length < 3) ornekler.push({ i, yerel: y[i], canli: c[i] }); }
  }
  toplamFark += f; toplamOge += y.length;
  const durum = f === 0 ? '✓ aynı' : `⚠ ${f} fark`;
  console.log(`  ${ad.padEnd(32)} ${String(y.length).padStart(4)} öğe · ${durum}`);
  if (f) rapor.push({ sayfa: ad, fark: f, ornekler });
}

await b.close();
writeFileSync(KOK + '_audit/rapor/canli-kiyas.json', JSON.stringify(rapor, null, 1));

console.log(`\n  ${SAYFALAR.length} sayfa · ${toplamOge} öğe · toplam ${toplamFark} fark`);
console.log(toplamFark === 0
  ? '\n  ✓ Yerel site yayındakiyle GÖRSEL OLARAK BİREBİR AYNI.'
  : '\n  Ayrıntı: _audit/rapor/canli-kiyas.json');

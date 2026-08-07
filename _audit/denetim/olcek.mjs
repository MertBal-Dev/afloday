/* ÖLÇEK DENETİMİ — aynı sayfa, dokuz genişlik, yan yana

   Soru: küçük ekranda her şey neden büyük görünüyor?
   Cevabı tahminle değil sayıyla arıyoruz. Her genişlikte gövde puntosu,
   başlık puntosu, bölüm iç boşluğu, satır başına karakter ve sayfanın
   kaç ekran olduğu ölçülüyor.

   Kritik genişlik 1097: Ceylan hanımın 1920x1200 ekranı %175
   yakınlaştırmayla tarayıcıda bu kadar CSS pikseli bırakıyor.

   Kullanım: node _audit/denetim/olcek.mjs [sayfa...]            */
import { chromium } from 'playwright-core';

const GENISLIKLER = [360, 480, 768, 1024, 1097, 1280, 1440, 1920, 2560];
const YUKSEKLIK = { 360: 780, 480: 800, 768: 1024, 1024: 768, 1097: 600, 1280: 800, 1440: 900, 1920: 1080, 2560: 1440 };

const sayfalar = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['index', 'dogadan-hobi-atolyeleri', 'hakkimizda'];

const tarayici = await chromium.launch({ channel: 'chrome' });

for (const sayfa of sayfalar) {
  console.log('\n══ ' + sayfa + ' ' + '═'.repeat(Math.max(0, 58 - sayfa.length)));
  console.log('genişlik  gövde  h1     h2     bölüm-boşluk  satır/krkt  ekran');
  console.log('─'.repeat(66));

  for (const g of GENISLIKLER) {
    const sekme = await tarayici.newPage({ viewport: { width: g, height: YUKSEKLIK[g] } });
    await sekme.goto(`http://127.0.0.1:8899/${sayfa}`, { waitUntil: 'networkidle' });
    await sekme.evaluate(() => document.fonts.ready);

    const o = await sekme.evaluate(() => {
      const px = (e, p) => (e ? Math.round(parseFloat(getComputedStyle(e)[p])) : 0);
      const govde = document.querySelector('main p') || document.body;
      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      const bolum = document.querySelector('main section');

      /* Satır başına karakter: ölçünün gerçek karşılığı. 45-75 arası
         okunur; 100 üstü göz satır sonunu kaybediyor. */
      const gPx = parseFloat(getComputedStyle(govde).fontSize);
      const gEn = govde.getBoundingClientRect().width;
      const krkt = Math.round(gEn / (gPx * 0.5));

      return {
        govde: px(govde, 'fontSize'),
        h1: px(h1, 'fontSize'),
        h2: px(h2, 'fontSize'),
        bosluk: px(bolum, 'paddingTop'),
        krkt,
        ekran: +(document.documentElement.scrollHeight / window.innerHeight).toFixed(2),
        tasma: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    const isaret = (o.ekran > 3 ? ' !' : '  ') + (o.tasma ? ' TAŞMA' : '') + (o.krkt > 90 ? ' geniş' : '');
    console.log(
      String(g).padEnd(10) +
      String(o.govde).padEnd(7) +
      String(o.h1).padEnd(7) +
      String(o.h2).padEnd(7) +
      String(o.bosluk).padEnd(14) +
      String(o.krkt).padEnd(12) +
      String(o.ekran) + isaret
    );
    await sekme.close();
  }
}

await tarayici.close();
console.log('\n! = 3 ekran bütçesi aşıldı');

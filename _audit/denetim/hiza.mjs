/* HİZA VE TAŞMA DENETİMİ — genel kontrol

   Üç soruyu her sayfada, her genişlikte sorar:
   1. Başlık çubuğu, içerik ve alt bilgi aynı dikey çizgide mi başlıyor?
      (Kaymış hiza sayfayı "bozuk" gösteren en sık sebep.)
   2. Yatay taşma var mı?
   3. Herhangi bir kap kendi içeriğinden dar mı?

   Kullanım: node _audit/denetim/hiza.mjs [sayfa...]                  */
import { chromium } from 'playwright-core';

const GENISLIKLER = [390, 768, 1024, 1097, 1280, 1440, 1920, 2560];
const sayfalar = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['index', 'hakkimizda', 'kurumsal', 'dogadan-hobi-atolyeleri', 'iletisim'];

const tarayici = await chromium.launch({ channel: 'chrome' });
let sorun = 0;

for (const sayfa of sayfalar) {
  const satirlar = [];
  for (const g of GENISLIKLER) {
    const sekme = await tarayici.newPage({ viewport: { width: g, height: 900 } });
    await sekme.goto(`http://127.0.0.1:8899/${sayfa}`, { waitUntil: 'networkidle' });
    await sekme.evaluate(() => document.fonts.ready);

    const o = await sekme.evaluate(() => {
      const sol = (sec) => {
        const e = document.querySelector(sec);
        return e ? Math.round(e.getBoundingClientRect().left) : null;
      };
      const tasan = [...document.querySelectorAll('header *, main *, footer *')]
        .filter((e) => e.scrollWidth > Math.ceil(e.getBoundingClientRect().width) + 2
          && getComputedStyle(e).overflowX === 'visible')
        .slice(0, 3)
        .map((e) => (e.className || e.tagName).toString().slice(0, 30));

      /* Kutunun kenarı değil İÇERİĞİN kenarı ölçülüyor. `.hdr-in` tam
         genişlikte kalıp hizayı dolguyla sağladığı için kutunun `left`
         değeri her zaman 0 çıkıyor ve yanlış alarm veriyordu. */
      return {
        baslik: sol('.hdr-logo'),
        icerik: sol('main .wrap > *') ?? sol('main .wrap'),
        altbilgi: sol('.ftr-kunye') ?? sol('.ftr-cols > *'),
        yatayTasma: document.documentElement.scrollWidth > window.innerWidth,
        tasan,
      };
    });

    /* Hiza toleransı 4px: alt piksel yuvarlamaları yüzünden birebir
       eşitlik beklenmiyor. */
    const degerler = [o.baslik, o.icerik, o.altbilgi].filter((x) => x !== null);
    const fark = Math.max(...degerler) - Math.min(...degerler);
    const kotu = fark > 4 || o.yatayTasma || o.tasan.length;
    if (kotu) sorun++;

    satirlar.push(
      String(g).padEnd(7) +
      ('baş ' + o.baslik).padEnd(10) +
      ('içe ' + o.icerik).padEnd(10) +
      ('alt ' + o.altbilgi).padEnd(10) +
      ('fark ' + fark).padEnd(10) +
      (o.yatayTasma ? 'YATAY TAŞMA ' : '') +
      (o.tasan.length ? 'taşan: ' + o.tasan.join(', ') : '') +
      (kotu ? '  ✗' : '  ✓')
    );
    await sekme.close();
  }
  console.log('\n══ ' + sayfa);
  satirlar.forEach((x) => console.log('  ' + x));
}

await tarayici.close();
console.log('\n' + (sorun ? sorun + ' kombinasyonda sorun' : '✓ hiza ve taşma temiz'));

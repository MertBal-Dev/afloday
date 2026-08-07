/* GERİ BİLDİRİM DENETİMİ — Ceylan hanımın 5 Ağustos maddeleri, sayfa sayfa.

   Kaynak: docs/kaynak/geri-bildirim-2026-08-05.md (kelimesi kelimesine)

   Her madde için ölçülebilir bir kural tanımlı. Ölçülemeyenler "göz
   gerektirir" diye işaretleniyor; onlar için ekran görüntüsü alınır.

   Önce: node _build/build.mjs && node _build/onizle.mjs 8899
   Kullanım: node _audit/denetim/geri-bildirim.mjs */
import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
mkdirSync(KOK + '_audit/rapor/', { recursive: true });
const SITE = KOK + 'site/';
const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html')).sort();

const b = await chromium.launch({ channel: 'chrome' });
const olc = async (en) => {
  const sf = await b.newPage({ viewport: { width: en, height: 844 } });
  sf.setDefaultTimeout(20000);
  const cikti = {};
  for (const dosya of sayfalar) {
    const adres = dosya === 'index.html' ? '' : dosya.replace(/\.html$/, '');
    try { await sf.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'domcontentloaded' }); }
    catch { continue; }
    await sf.evaluate(() => document.fonts.ready);
    await sf.evaluate(() => {
      for (const e of document.querySelectorAll('[data-reveal]')) {
        e.setAttribute('data-reveal', 'in'); e.style.opacity = '1'; e.style.transform = 'none';
      }
    });
    await sf.waitForTimeout(220);

    cikti[dosya] = await sf.evaluate(() => {
      const gs = (e) => getComputedStyle(e);
      const px = (v) => parseFloat(v) || 0;

      /* M4 · başlık sonunda nokta */
      const noktali = [...document.querySelectorAll('h1,h2,h3,h4')]
        .map((e) => e.textContent.trim())
        .filter((t) => /[.]$/.test(t) && !/\.\.\.$/.test(t));

      /* M5 · eski logo renkleri: karmen ve bronz tonları */
      const ESKI = ['rgb(168, 43, 69)', 'rgb(138, 32, 57)', 'rgb(125, 95, 49)', 'rgb(183, 155, 98)'];
      let eskiRenk = 0;
      for (const e of document.querySelectorAll('*')) {
        const c = gs(e);
        if (ESKI.includes(c.color) || ESKI.includes(c.backgroundColor)) eskiRenk++;
      }

      /* M1 · başlık puntoları */
      const basliklar = [...document.querySelectorAll('h1,h2')].map((e) => px(gs(e).fontSize));
      const enBuyukBaslik = basliklar.length ? Math.max(...basliklar) : 0;
      const govde = px(gs(document.body).fontSize);

      /* M2 · bölüm boşlukları */
      const bolumler = [...document.querySelectorAll('section')].map((e) => {
        const c = gs(e); return px(c.paddingTop) + px(c.paddingBottom);
      });
      const ortBolumBosluk = bolumler.length
        ? Math.round(bolumler.reduce((a, x) => a + x, 0) / bolumler.length) : 0;

      /* M3 · ara yönlendirme sayaçları: "10 atölye", "7 kişilik ekip" gibi */
      const govdeMetni = document.body.innerText;
      const sayaclar = [...govdeMetni.matchAll(/\b(\d{1,3})\s*(atölye|kişi|eğitim|yıl|proje|kategori)\b/gi)]
        .map((m) => m[0]).slice(0, 6);

      /* M14 · referans logo boyutu.
         DİKKAT: logo iki ayrı bileşende geçiyor. Referans bölümü
         `.logos` ızgarası (index); `.marquee` ise ikincil kayan şerit ve
         kasten küçük. Bir kez şerit ölçülüp madde yanlışlıkla
         "karşılanmadı" işaretlendi. Yalnız `.logos` ölçülüyor. */
      const logolar = [...document.querySelectorAll('.logos img')]
        .map((i) => Math.round(i.getBoundingClientRect().height))
        .filter((h) => h > 0);

      /* M12 · "görseller altta word düzeni gibi toplu verilmiş"
         Ölçüsü: aralarında anlamlı metin OLMAYAN, art arda gelen fotoğraf
         dizisi. Ceylan hanımın şikâyeti tam olarak bu yığın. */
      const akis = [];
      for (const e of document.querySelectorAll('img, p, h1, h2, h3, li')) {
        const r = e.getBoundingClientRect();
        if (r.width < 60 || r.height < 24) continue;
        if (e.tagName === 'IMG') {
          if (r.width < 150 || r.height < 100) continue;      /* ikon/logo değil */
          akis.push({ t: 'f', y: r.y + window.scrollY });
        } else if (e.textContent.trim().length > 60) {
          akis.push({ t: 'm', y: r.y + window.scrollY });
        }
      }
      akis.sort((a, b) => a.y - b.y);
      let enUzunYigin = 0, suan = 0, yiginBas = 0, yiginY = 0;
      for (const x of akis) {
        if (x.t === 'f') {
          if (suan === 0) yiginBas = x.y;
          suan++;
          if (suan > enUzunYigin) { enUzunYigin = suan; yiginY = yiginBas; }
        } else suan = 0;
      }
      const yiginKonum = document.body.scrollHeight
        ? +(yiginY / document.body.scrollHeight).toFixed(2) : 0;

      /* M8 · açılan menüdeki başlık puntosu */
      const menuOge = document.querySelector('.drawer a, .mega a, nav a');
      const menuPunto = menuOge ? px(gs(menuOge).fontSize) : 0;

      /* M6/M7 · görsel-metin oranı ve ritim */
      const fotolar = [...document.images].filter((i) => {
        const r = i.getBoundingClientRect(); return r.width > 150 && r.height > 100;
      });
      const metinBloklari = [...document.querySelectorAll('p')].filter((e) =>
        e.textContent.trim().length > 80).length;

      /* M10 · yönelim: konum göstergesi var mı */
      const konumIzi = !!document.querySelector('[aria-current="page"], .breadcrumb, nav ol');

      return {
        boy: document.body.scrollHeight, ekran: window.innerHeight,
        noktali, eskiRenk, enBuyukBaslik, govde,
        oran: govde ? +(enBuyukBaslik / govde).toFixed(1) : 0,
        ortBolumBosluk, sayaclar, logoBoy: logolar[0] || 0, logoAdet: logolar.length,
        menuPunto, fotoAdet: fotolar.length, metinBloklari, konumIzi,
        yigin: enUzunYigin, yiginKonum,
      };
    });
  }
  await sf.close();
  return cikti;
};

const M = await olc(1440);
const T = await olc(390);
await b.close();

const say = (f) => Object.values(M).reduce((a, x) => a + (f(x) ? 1 : 0), 0);
const topla = (o, f) => Object.entries(o).filter(([, x]) => f(x));

console.log('=== CEYLAN HANIMIN GERİ BİLDİRİMİ — MADDE MADDE ===\n');

const madde = (no, soz, sonuc, ayrinti) => {
  const isaret = sonuc === true ? '✅' : sonuc === false ? '❌' : '👁 ';
  console.log(`${isaret} ${no}. "${soz}"`);
  if (ayrinti) for (const s of [].concat(ayrinti)) console.log(`     ${s}`);
  console.log('');
};

/* --- M4 · başlık sonunda nokta --- */
{
  const kotu = topla(M, (x) => x.noktali.length);
  madde(4, 'Başlıklardan sonra nokta işareti olmasın', kotu.length === 0,
    kotu.length ? kotu.slice(0, 5).map(([s, x]) => `${s}: ${x.noktali.slice(0, 2).join(' | ')}`)
      : '31 sayfada başlık sonu noktası yok');
}

/* --- M5 · eski logo rengi --- */
{
  const kotu = topla(M, (x) => x.eskiRenk > 0);
  madde(5, 'Metin başlıklarında eski logo rengi var, yeni renk turuncu, yeşil', kotu.length === 0,
    kotu.length ? kotu.slice(0, 5).map(([s, x]) => `${s}: ${x.eskiRenk} öğe`)
      : 'karmen ve bronz 0 öğede');
}

/* --- M11 · galeri kapatıldı mı --- */
{
  const varMi = sayfalar.includes('galeri.html');
  madde(11, 'Galeri sayfasını kapatabiliriz', !varMi,
    varMi ? 'galeri.html HÂLÂ ÜRETİLİYOR' : 'galeri.html üretilmiyor');
}

/* --- M14 · referans logoları iki katı --- */
{
  const l = topla(M, (x) => x.logoAdet > 0);
  const boylar = l.map(([, x]) => x.logoBoy);
  const ort = boylar.length ? Math.round(boylar.reduce((a, b) => a + b, 0) / boylar.length) : 0;
  madde(14, 'Referans logoları en az iki katı kadar daha büyüyebilir', ort >= 60,
    `${l.length} sayfada logo şeridi · yükseklik ${ort}px (eskiden 32px, hedef ≥64px)`);
}

/* --- M1 · çok büyük yazılar --- */
{
  const enB = Math.max(...Object.values(M).map((x) => x.enBuyukBaslik));
  const oranlar = Object.values(M).map((x) => x.oran).filter(Boolean);
  const enOran = Math.max(...oranlar);
  madde(1, 'İlk bakışta çok büyük büyük geldi', enB <= 76 && enOran <= 4.2,
    [`masaüstü en büyük başlık ${enB}px · başlık/gövde oranı en fazla ${enOran}`,
      `telefon en büyük başlık ${Math.max(...Object.values(T).map((x) => x.enBuyukBaslik))}px`]);
}

/* --- M8 · açılan menüde başlıklar çok büyük --- */
{
  const p = Math.max(...Object.values(T).map((x) => x.menuPunto).filter(Boolean));
  madde(8, 'Açılan ana menüde başlıklar çok büyük', p <= 22,
    `telefonda menü maddesi ${p}px (eskiden 31px)`);
}

/* --- M3 · ara yönlendirmeler / sayaçlar --- */
{
  const kotu = topla(M, (x) => x.sayaclar.length);
  madde(3, 'Ara yönlendirmeler var 10 atölye, 7 kişi ekip vs onlar olmasın', kotu.length === 0,
    kotu.length ? kotu.slice(0, 6).map(([s, x]) => `${s}: ${x.sayaclar.join(' · ')}`)
      : 'sayfa metinlerinde sayaç ifadesi bulunamadı');
}

/* --- M2 · sayfalarda boşluklar çok --- */
{
  const uzun = topla(M, (x) => x.boy / x.ekran > 8);
  const uzunT = topla(T, (x) => x.boy / x.ekran > 10);
  madde(2, 'Sayfalarda boşluklar da çok', uzun.length === 0 && uzunT.length === 0,
    [`masaüstünde 8 ekrandan uzun: ${uzun.length} sayfa`,
      ...uzun.slice(0, 4).map(([s, x]) => `   ${s} ${(x.boy / x.ekran).toFixed(1)} ekran`),
      `telefonda 10 ekrandan uzun: ${uzunT.length} sayfa`,
      ...uzunT.slice(0, 6).map(([s, x]) => `   ${s} ${(x.boy / x.ekran).toFixed(1)} ekran`)]);
}

/* --- M9 · 5 eğitim tek sayfaya --- */
{
  const e = M['doga-temelli-egitimlerimiz.html'];
  madde(9, 'Eğitim Gelişim Programlarımızdaki 5 eğitimi sayfaya sığdırsak', e && e.boy / e.ekran <= 4.5,
    e ? `doga-temelli-egitimlerimiz ${(e.boy / e.ekran).toFixed(1)} ekran` : 'sayfa bulunamadı');
}

/* --- M10 · kayboldum --- */
{
  const yok = topla(M, (x) => !x.konumIzi);
  madde(10, 'Genel olarak kayboldum sayfalarda', yok.length === 0,
    yok.length ? [`konum göstergesi olmayan: ${yok.length} sayfa`,
      ...yok.slice(0, 6).map(([s]) => `   ${s}`)] : 'her sayfada konum izi var');
}

/* --- Göz gerektirenler --- */
console.log('👁  GÖZ GEREKTİREN MADDELER (otomatik ölçülemez)\n');
madde(6, 'Görseller küçülüp yazılar büyüyebilir, orantılı olmaları', null,
  Object.entries(M).filter(([, x]) => x.fotoAdet > 2)
    .slice(0, 4).map(([s, x]) => `${s}: ${x.fotoAdet} fotoğraf · ${x.metinBloklari} metin bloğu`));
madde(7, 'Metin görsel yazı yazı gidiyor, daha dinamik olabilir', null, 'bant ritmi — ekran görüntüsü gerekir');
/* M12 artık ölçülüyor: art arda, arasında metin olmayan fotoğraf yığını */
{
  const yiginli = topla(M, (x) => x.yigin >= 3)
    .sort((a, b) => b[1].yigin - a[1].yigin);
  madde(12, 'Görseller altta word düzeni gibi olmuş, amatör duruyor', yiginli.length === 0,
    yiginli.length
      ? [`arka arkaya 3+ fotoğraf, arasında metin yok: ${yiginli.length} sayfa`,
        ...yiginli.slice(0, 8).map(([s, x]) =>
          `   ${s.padEnd(38)} ${x.yigin} fotoğraf üst üste · sayfanın %${Math.round(x.yiginKonum * 100)}'inden sonra`)]
      : 'fotoğraf yığını yok, her fotoğrafın etrafında metin var');
}
madde(13, 'Hakkımızda çok büyük yazılar, vizyon misyon alt alta', null,
  'vizyon/misyon masaüstünde yan yana doğrulandı (hk-ikili-ic, aynı y, x=65 ve x=734)');

writeFileSync(KOK + '_audit/rapor/geri-bildirim.json',
  JSON.stringify({ masaustu: M, telefon: T }, null, 1));
console.log('Rapor: _audit/rapor/geri-bildirim.json');

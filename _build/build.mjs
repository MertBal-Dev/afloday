/* AFLODAY — statik site üretici. `node _build/build.mjs` */
import { writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { site, workshops, team, projects, assets,
         surdurulebilirlikGiris, canliAdres } from './data.mjs';
import { layout, opener, logoWall, heroVideo, folio, marquee, galeriBolumu, resim, heroSlayt, homeGaleriVitrin, awwwardsGaleri } from './templates.mjs';
import { oran as gorselOraniHam, gorselOlculeri as gorselOlculeriTablo } from './gorsel-olculeri.mjs';
import { etkinlikSayfasi, etkinlikKategorileri, toplamAtolye } from './etkinlikler.mjs';

/* `assets/img/...` yolundan manifest anahtarına çevirip oranı ver.
   Bant tipini fotoğrafın kendi oranı seçiyor; dikeyse metin yanına,
   yataysa metin altına geçiyor. Çerçeve fotoğrafa uymuyor, kompozisyon
   fotoğrafa uyuyor. */
const gorselAnahtar = (src) => String(src)
  .replace(/^assets\/img\//, '').replace(/^rev2\//, '')
  .replace(/\.(jpe?g|png|webp)$/i, '');

const gorselOraniOku = (src) => gorselOraniHam(gorselAnahtar(src));

/* `width`/`height` öznitelikleri düzen kaymasını (CLS) önlüyor ve
   `verify.mjs` eksikse hata veriyor. Ölçü bilinmiyorsa 3:2 varsay. */
const gorselOlcuOku = (src) => {
  const o = gorselOlculeriTablo[gorselAnahtar(src)];
  return o ? { en: o[0], boy: o[1] } : { en: 1200, boy: 800 };
};
import { kategoriKapak, kategoriMozaik, kategoriGezinme, kategoriDosyasi } from './etkinlik-tasarim.mjs';
import { egitimKapak, egitimGezinme, egitimDosyasi } from './egitim-tasarim.mjs';
import { panelSerit } from './panel-serit.mjs';
import { heroSlaytlari, degerOnerisi, istatistikler, metodoloji, egitimler, deneyimVitrini } from './data.mjs';
import { egitimlerSayfasi } from './egitimler.mjs';
import { kurumsalSayfasi } from './kurumsal-rev2.mjs';
import { sosyalSorumluluk } from './sosyal-sorumluluk.mjs';
import { hakkimizdaRev2 } from './hakkimizda-rev2.mjs';
import { gelecegiTasarla } from './gelecegi-tasarla.mjs';
import { ceylanRev2 } from './ceylan-rev2.mjs';
import { kvkkSayfalari, kvkkHazir } from './kvkk.mjs';
import { galeriRev2 } from './galeri-rev2.mjs';
import { slug as gorselSlug } from './gorsel-hazirla.mjs';
import { orijinalGorsel } from './gorseller.mjs';

/* Meta açıklamaları kelime ortasında kesmez; sınırdan önceki son boşluktan böler. */
const kirp = (t, n) => {
  const d = t.replace(/<[^>]+>/g, '').trim();
  if (d.length <= n) return d;
  const k = d.slice(0, n);
  return k.slice(0, k.lastIndexOf(' ')).replace(/[,;:.–-]$/, '') + '…';
};

const OUT = path.resolve('site');
const pages = [];
const add = (file, html) => pages.push({ file, html });


/* ====================================================================== */
/* ANASAYFA                                                               */
/* ====================================================================== */
{
  const body = `
${heroVideo({
    kicker: 'Afloday · Eğitim Gelişim Danışmanlık',
    heading: 'Doğada öğrenilen,<br>elde kalan <em>bir gün</em>',
    lede: 'Bitkilerin, çiçeklerin başrolde; katılımcının yönetmen olduğu atölyeler tasarlıyoruz.',
    cta: '<a class="btn btn-primary" href="kurumsal.html">Kurumsal Teklif Al</a>',
    // Yalnız afloday.com'da yazan bilgiler. Referans markaları burada yazıyla
    // anmıyoruz: orijinal sitede marka adları metin olarak hiç geçmiyor,
    // sadece "Referanslarımız" başlığı altında logo olarak duruyorlar.
    lines: [
      ['Kurumsal hizmetler', 'Gelişim atölyeleri · Hobi atölyeleri · Danışmanlık'],
      ['Hobi atölyeleri', 'Çiçek · Bitki · Çocuk (+3 ve +5 yaş)'],
      ['Biçim', 'Yüz yüze ya da tüm Türkiye geneli online'],
    ],
    video: 'assets/video/hero.mp4',
    poster: 'assets/img/hero/video-poster.jpg',
    posterAlt: 'Sabah ışığının ağaçların arasından süzüldüğü orman; eğrelti otları, yosun ve pembe kır çiçekleri',
    /* Tanıtım filmi bölümü yeni anasayfa düzeninde yok; kaydırma oku
       artık ilk içerik bölümüne gidiyor. */
    /* Hedef bölüm silindi (slaytla birleşti); ok artık slayta iniyor. */
    asagi: '#slaytlar',
  })}

  <!-- SLAYT — video hero'nun hemen altında, cam kırılması geçişiyle.
       Müşteri isteği: "orman video ile olacak, video sonrasında dönen
       slidelar gelebilir" ve "metinlerin görsellerin üzerine yazılması". -->
${heroSlayt(heroSlaytlari)}

  <!-- 2 · DEĞER ÖNERİSİ ŞERİDİ — belgede hero'nun hemen altı, 3 sütun -->
  ${/* "NE YAPIYORUZ" BÖLÜMÜ KALDIRILDI — Ceylan hanım, 7 Ağustos.
       01/02/03 diye numaralanmış üç sütun vardı: Kurumsal Eğitim &
       Gelişim, Doğadan Deneyimsel Öğrenme, Kişisel Sürdürülebilirlik.
       Bunlar aslında yukarıdaki üç slaydın açıklamasıydı — slayt
       kimlikleri (kurumsal-gelisim, deneyimsel-ogrenme,
       kisisel-surdurulebilirlik) sütun başlıklarıyla birebir aynıydı.

       Metinler slaytların içine taşındı (`data.mjs` → kartBaslik,
       kartMetin). Aynı bilgi iki kez, iki ekranda duruyordu; şimdi
       bir kez, kendi slaydının üstünde. Anasayfa bir bölüm kısaldı. */ ''}

  ${/* "NEDEN DOĞA TEMELLİ GELİŞİM?" BÖLÜMÜ TAŞINDI — 7 Ağustos.
       Ceylan hanımın isteği: bu bölüm anasayfada değil, doğa temelli
       eğitimler sayfasında dursun. Dört istatistik kartı orada, kendi
       bağlamının içinde daha anlamlı; anasayfa da bir bölüm kısalıyor.
       Blok `doga-temelli-egitimler.html` sayfasına aynen taşındı. */ ''}


  <!-- 4 · METODOLOJİ — Kök Sal · Sorumluluk Al · Birlikte Yeşer -->
  <section class="section" id="metodoloji">
    <div class="wrap">
      ${opener('Eğitim metodolojimiz', metodoloji.baslik.replace('Eğitim Metodolojimiz: ', ''), metodoloji.giris)}
      ${/* ÜÇ AŞAMA TEK EKRANDA — bir bitkinin üç evresi.

           Önceki düzen dikeydi: solda tek büyük fotoğraf, sağda üç aşama
           alt alta. Üç ekrana yayılıyordu ve "her şey tek ekran daha
           anlaşılır olacak" maddesini ihlal ediyordu.

           Şimdi üçü yan yana. Metafor içeriğin kendisinden geliyor:
           belge "bir bitkinin hayatta kalma ve serpilme sürecinden ilham
           alan 3 aşamalı patern" diyor. Kartlar kök → gövde → yeşerme
           sırasında ve aralarından geçen ince bir gövde onları bağlıyor.

           METİN KISALTILMADI: kapalıyken slogan görünüyor, karta
           tıklayınca tam paragraf açılıyor. Hem tek ekrana sığıyor hem
           tek kelime kaybolmuyor. */ ''}
      <ol class="mtd" style="margin-top:clamp(28px,3.4vw,52px)">
        ${metodoloji.asamalar.map((a, i) => `<li class="mtd-kart" data-evre="${i + 1}" data-reveal="stagger">
          <button class="mtd-ac" type="button" aria-expanded="false" aria-controls="mtd-${a.no}">
            <span class="mtd-sira">${String(a.no).padStart(2, '0')}</span>
            <span class="mtd-ad">${a.ad}</span>
            <span class="mtd-slogan">${a.slogan}</span>
            <span class="mtd-isaret" aria-hidden="true"></span>
          </button>
          <div class="mtd-govde" id="mtd-${a.no}">
            <p>${a.metin}</p>
          </div>
        </li>`).join('')}
      </ol>
    </div>
  </section>

  <!-- 5 · EĞİTİM PROGRAMLARI VİTRİNİ — 5 program.
       Kartlar kısa; tam metin /doga-temelli-egitimlerimiz sayfasında.
       Aynı uzun metni iki kez okutmuyoruz. -->
  <section class="section rule-top" id="egitimler">
    <div class="wrap">
      ${/* Başlık belgeden (satır 56). Alt metin yok — belge bu bölüme
           açıklama yazmamış, uydurmuyoruz. */ ''}
      ${opener('Eğitim & Gelişim', 'Eğitim &amp; Gelişim Programlarımız', '')}
      ${/* BEŞ PROGRAM TEK SIRADA — Ceylan hanım, 8 Ağustos:
           "3'e 2 değil, 5'i de tek ekran görünecek şekilde."

           Önceki düzen 3+2 ızgaraydı ve iki satıra yayılıyordu. Şimdi
           beşi yan yana.

           ÇERÇEVE KARE. Havuzun oranları 0.563'ten 1.839'a kadar
           dağılıyor; hizalı satır matematiği burada çalışmıyor, çünkü
           dikey kareler 77 piksele iniyor ve başlık sığmıyor. Kare
           çerçeve iki uca da en az haksızlık eden orta yol.

           Kart metni kısaldı: vitrin başlığı ve süre kaldı, uzun açıklama
           çıktı. Tam metin zaten eğitimin kendi sayfasında; burada aynı
           metni ikinci kez okutmuyoruz ve beş kart tek ekrana sığıyor. */ ''}
      <div class="egitim-vitrin" style="margin-top:clamp(28px,3.4vw,52px)">
        ${egitimler.map((e, i) => `<a class="egitim-kart" href="${egitimDosyasi(e)}" data-sira="${i + 1}" data-reveal="stagger">
          <span class="egitim-kart-gorsel">
            ${resim({ gorsel: e.vitrinGorsel || e.gorsel, alt: e.vitrinAlt || e.alt, kucuk: true })}
          </span>
          <span class="egitim-kart-yazi" data-sira="${i + 1}">
            <span class="egitim-kart-ad">${e.vitrinAd}</span>
            <span class="egitim-kart-kunye">${e.format} · ${e.vitrinSure}</span>
          </span>
        </a>`).join('')}
      </div>
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-ghost" href="doga-temelli-egitimler.html">Beş programın tamamını oku</a>
      </div>
    </div>
  </section>

  <!-- 6 · DOĞADAN DENEYİMSEL ÖĞRENME ATÖLYELERİ
       Belge "Öne Çıkan 4 Deneyim" diyor ama metni yazılmış olan iki tanesi
       var. Uydurma kart eklemek yerine ikisi konuldu; Afloday'e soruldu. -->
  <section class="section field">
    <div class="wrap">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">${deneyimVitrini.ustEtiket}</p>
          <h2 class="h2">${deneyimVitrini.baslik}</h2>
        </div>
        <p class="lede" style="color:var(--field-muted)">${deneyimVitrini.altBaslik}</p>
        <div class="opener-rule"></div>
      </div>
      <div class="deneyim-vitrin" style="margin-top:clamp(40px,5vw,72px)">
        ${deneyimVitrini.kartlar.map((k, i) => `<article class="deneyim-kart" data-reveal="stagger">
          <p class="deneyim-no">${String(i + 1).padStart(2, '0')}</p>
          <div>
            <h3 class="deneyim-ad">${k.ad}</h3>
            <p class="deneyim-kunye">${k.bicim}</p>
            <p class="deneyim-bagli">${k.bagliEgitim}</p>
            <p class="deneyim-metin">${k.metin}</p>
          </div>
        </article>`).join('\n        ')}
      </div>
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Etkinlik atölye deneyimleri</a>
      </div>
    </div>
  </section>

  <!-- 7 · GALERİ — menüde "Galeri" var, site haritasında ayrı sayfa yok.
       Anasayfada bölüm olarak kuruldu; karar günlüğü madde 1. -->
  ${/* Galerinin tamamı kendi sayfasında (/galeri, 21 kare). Burada tek
       şeritlik tanıtım duruyor: 3 kare, oraya bağlanıyor.
       Karar günlüğü: madde 23 (ayrı sayfa) ve madde 25 (şerit düzeni). */ ''}
  ${/* ANASAYFA GALERİ VİTRİNİ KALDIRILDI — 7 Ağustos.

       Ceylan hanım 5 Ağustos'ta "Galeri sayfasını kapatabiliriz" dedi;
       sayfa kapatıldı ama anasayfadaki vitrin kalmıştı. Denetimde
       anasayfanın en büyük fotoğraf yığını olarak çıktı: arka arkaya
       42 kare, aralarında metin yok — tam olarak "görseller altta word
       düzeni gibi olmuş" şikâyetinin biçimi.

       Kullanıcı kararı: vitrin de kalksın, gerekirse geri eklenir.
       Kareler silinmedi, `galeri-rev2.mjs` ve dosyalar duruyor. */ ''}

  <!-- 8 · REFERANSLAR — orijinaldeki gibi logo duvarı.
       Müşteri notu: "Marka logoları kalsın derim." -->
  <section class="section rule-top">
    <div class="wrap">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">Afloday</p>
          <h2 class="h2">Referanslarımız</h2>
        </div>
        <div></div>
        <div class="opener-rule"></div>
      </div>
      ${logoWall(30)}
    </div>
  </section>
`;

  add('index.html', layout({
    title: 'Afloday — Doğadan Gelişim ve Hobi Atölyeleri',
    desc: 'Afloday Eğitim Gelişim Danışmanlık olarak; çiçeklerin, doğanın iyileştirici etkisini eğitimle, atölyeyle, özgün tasarımlarla iş ve yaşam alanlarına taşıyoruz.',
    /* Anasayfa menüde bir madde; boş `current` ile hiçbiri işaretlenmiyordu.
       Ekran okuyucu "şu an bu sayfadasınız" bilgisini buradan alıyor. */
    current: 'index.html', body, canonical: '',
    schema: {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: site.name, alternateName: 'Afloday Eğitim Gelişim Danışmanlık',
      url: site.url + '/', logo: `${site.url}/assets/img/brand/logo.png`,
      description: 'Doğa temelli kurumsal gelişim atölyeleri ve hobi atölyeleri.',
      email: site.email, telephone: '+90 216 510 2809',
      address: {
        '@type': 'PostalAddress', streetAddress: site.address.street,
        addressLocality: site.address.locality, addressRegion: site.address.region,
        postalCode: site.address.zip, addressCountry: 'TR',
      },
      sameAs: [site.social.instagram, site.social.youtube],
    },
  }));
}

/* ====================================================================== */
/* KURUMSAL HİZMETLER — 4 Ağustos belgesi, satır 99-124                    */
/* ====================================================================== */
/* Belge bu sayfada iki hizmet hattını anlatıyor. Üçüncü hat (Sosyal
   Sorumluluk & İş Danışmanlığı) canlı sitede kendi adresine sahip, orada
   duruyor ve buradan bağlanıyor. */
{
  const [deneyimsel, etkinlik] = kurumsalSayfasi.hatlar;

  const body = `
${folio({
    eyebrow: 'Afloday',
    plateNo: 'Kurumsal Hizmetler',
    lines: ['Kurumlara', '<em class="em">doğadan</em> hizmet'],
    lede: deneyimsel.ozet,
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>`,
    meta: [
      ['Hat', '3 hizmet hattı'],
      ['Biçim', 'Yüz yüze veya Türkiye geneli online'],   /* belgenin kendi ifadesi */
    ],
  })}

  <!-- 1 · DOĞADAN DENEYİMSEL ÖĞRENME ATÖLYELERİ -->
  <section class="section rule-top" id="${deneyimsel.id}">
    <div class="wrap">
      ${opener('Hizmet hattı 01', deneyimsel.ad, deneyimsel.ozet)}
      <div class="hat" style="margin-top:clamp(40px,5vw,72px)">
        <div class="hat-anlati">
          ${deneyimsel.paragraflar.map(p => `<p class="body" data-reveal>${p}</p>`).join('\n          ')}
          <div class="hat-ornek" data-reveal>
            <p class="eyebrow">${deneyimsel.ornekEtiketi}</p>
            <p>${deneyimsel.ornekler}</p>
          </div>
        </div>
        <figure class="hat-gorsel" data-reveal>
          ${resim({ gorsel: deneyimsel.gorsel, alt: deneyimsel.alt, kucuk: true })}
        </figure>
      </div>

      <!-- Katılımcı & Kurum Faydası — belgede dokuz madde -->
      <div style="margin-top:clamp(40px,5vw,72px)">
        <p class="eyebrow" data-reveal>${deneyimsel.faydaBasligi}</p>
        <div class="fayda">
          ${deneyimsel.faydalar.map((f, i) => `<div class="fayda-oge" data-reveal="stagger">
            <span class="fayda-no">${String(i + 1).padStart(2, '0')}</span>
            <span class="fayda-ad">${f}</span>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <!-- 2 · DOĞADAN ETKİNLİK ATÖLYE DENEYİMLERİ -->
  <section class="section field" id="${etkinlik.id}">
    <div class="wrap">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">Hizmet hattı 02</p>
          <h2 class="h2">${etkinlik.ad}</h2>
        </div>
        <p class="lede" style="color:var(--field-muted)">${etkinlik.ozet}</p>
        <div class="opener-rule"></div>
      </div>

      <div class="hat hat-ters" style="margin-top:clamp(40px,5vw,72px)">
        <div class="hat-anlati">
          ${etkinlik.paragraflar.map(p => `<p class="body" style="color:var(--field-muted)" data-reveal>${p}</p>`).join('\n          ')}
          <div class="btn-row" style="margin-top:clamp(24px,3vw,40px)" data-reveal>
            <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Etkinlik atölye deneyimleri</a>
          </div>
        </div>
        <figure class="hat-gorsel" data-reveal>
          ${resim({ gorsel: etkinlik.gorsel, alt: etkinlik.alt, kucuk: true })}
        </figure>
      </div>

      <!-- Dönemsel konseptler — belgedeki altı eşleme -->
      <div class="konsept" style="margin-top:clamp(40px,5vw,72px)">
        ${etkinlik.konseptler.map((k, i) => `<div class="konsept-satir" data-reveal="stagger">
          <p class="konsept-no">${String(i + 1).padStart(2, '0')}</p>
          <p class="konsept-alan">${k.alan}</p>
          <ul class="konsept-liste">
            ${k.atolyeler.map(a => `<li>${a}</li>`).join('\n            ')}
          </ul>
        </div>`).join('\n        ')}
      </div>

      ${/* YEDİ KATEGORİ ŞERİDİ — 5 Ağustos geri bildirimi:
           "Metin, görsel, yazı yazı gidiyor daha dinamik olabilir.
            Aralara görseller girebilir."

           Bu bölüm ölçüldüğünde metin/görsel oranı 3.73 çıkıyordu: 6.2
           ekranlık sayfada iki görsel vardı. Buraya stok görsel koymak
           yerine Afloday'in kendi atölye fotoğrafları geliyor — hem
           gerçek hem de kategori sayfalarına kapı açıyor. */ ''}
      <div style="margin-top:clamp(40px,5vw,72px)">
        <p class="eyebrow" data-reveal>Etkinlik kategorileri</p>
        <div style="margin-top:var(--s4)">
          ${kategoriGezinme(etkinlikKategorileri, null)}
        </div>
      </div>
    </div>
  </section>

  <!-- 3 · SOSYAL SORUMLULUK — kendi adresinde, buradan bağlanıyor -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Hizmet hattı 03', sosyalSorumluluk.baslik, sosyalSorumluluk.ozet)}
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-primary" href="sosyal-sorumluluk-is-danismanligi.html">Sosyal Sorumluluk &amp; İş Danışmanlığı</a>
        <a class="btn btn-ghost" href="doga-temelli-egitimler.html">Doğa Temelli Eğitimlerimiz</a>
      </div>
    </div>
  </section>

  ${marquee(30)}`;

  add('kurumsal.html', layout({
    title: 'Kurumsal Hizmetler — Afloday',
    desc: kirp(deneyimsel.ozet + ' ' + deneyimsel.paragraflar[0], 155),
    current: 'kurumsal.html', body, canonical: 'kurumsal.html',
    ogImage: `assets/img/rev2/secilmis/${gorselSlug(deneyimsel.gorsel)}.jpg`,
  }));
}


/* ====================================================================== */
/* SOSYAL SORUMLULUK & İŞ DANIŞMANLIĞI — belge satır 125-159              */
/* ====================================================================== */
/* Canlı adres: /sosyal-sorumluluk-is-danismanligi — korunuyor. */
{
  const s = sosyalSorumluluk;

  const body = `
${folio({
    eyebrow: 'Afloday Kurumsal Hizmetler',
    plateNo: 'Sosyal Sorumluluk & İş Danışmanlığı',
    lines: ['Sosyal Sorumluluk', '&amp; <em class="em">İş Danışmanlığı</em>'],
    lede: s.ozet,
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Projenizi Konuşalım</a>`,
    meta: [
      ['Deneyim', 'Yaklaşık 20 yıl saha'],
      ['Kapsam', 'Analiz · Tasarım · Süreç · Raporlama'],
    ],
  })}

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Neden', s.baslik, '')}
      <div class="ss-giris" style="margin-top:clamp(40px,5vw,72px)">
        <div class="ss-giris-yazi">
          ${s.giris.map(p => `<p class="body" data-reveal>${p}</p>`).join('\n          ')}
        </div>
        <figure class="ss-gorsel" data-reveal>
          ${resim({ gorsel: s.girisGorsel, alt: s.girisAlt, kucuk: true })}
        </figure>
      </div>
    </div>
  </section>

  <!-- HİZMETLERİMİZ — üç madde -->
  <section class="section field">
    <div class="wrap">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">Ne yapıyoruz</p>
          <h2 class="h2">${s.hizmetler.baslik}</h2>
        </div>
        <p class="lede" style="color:var(--field-muted)">${s.hizmetler.giris}</p>
        <div class="opener-rule"></div>
      </div>
      <div class="ss-hizmet" style="margin-top:clamp(40px,5vw,72px)">
        ${s.hizmetler.maddeler.map(m => `<article class="ss-hizmet-oge" data-reveal="stagger">
          <p class="ss-no">${String(m.no).padStart(2, '0')}</p>
          <div>
            <h3 class="ss-ad">${m.ad}</h3>
            <p class="ss-metin">${m.metin}</p>
          </div>
        </article>`).join('\n        ')}
      </div>
      <figure class="ss-serit" data-reveal style="margin-top:clamp(40px,5vw,72px)">
        ${resim({ gorsel: s.hizmetler.gorsel, alt: s.hizmetler.alt })}
      </figure>
    </div>
  </section>

  <!-- ÇALIŞMA MODELİMİZ — dört adım -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Nasıl çalışıyoruz', s.calismaModeli.baslik, s.calismaModeli.giris)}
      <div class="ss-adimlar" style="margin-top:clamp(40px,5vw,72px)">
        ${s.calismaModeli.adimlar.map(a => `<div class="ss-adim" data-reveal="stagger">
          <p class="ss-adim-no">${String(a.no).padStart(2, '0')}</p>
          <h3 class="ss-adim-ad">${a.ad}</h3>
          <p class="ss-adim-alt">${a.alt}</p>
          <p class="ss-adim-metin">${a.metin}</p>
        </div>`).join('\n        ')}
      </div>
      <figure class="ss-serit" data-reveal style="margin-top:clamp(40px,5vw,72px)">
        ${resim({ gorsel: s.calismaModeli.gorsel, alt: s.calismaModeli.alt })}
      </figure>
    </div>
  </section>

  <!-- BİZİ FARKLI KILAN NE? -->
  <section class="section">
    <div class="wrap">
      ${opener('Fark', s.farkimiz.baslik, '')}
      <ul class="ss-fark" style="margin-top:clamp(32px,4vw,56px)">
        ${s.farkimiz.maddeler.map((m, i) => `<li data-reveal="stagger">
          <span class="ss-fark-no">${String(i + 1).padStart(2, '0')}</span>
          <span>${m}</span>
        </li>`).join('\n        ')}
      </ul>
      <p class="ss-kapanis" data-reveal>${s.farkimiz.kapanis}</p>
    </div>
  </section>

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Diğer hatlar', 'Kurumsal hizmetlerimiz', '')}
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-primary" href="kurumsal.html">Kurumsal Hizmetler</a>
        <a class="btn btn-ghost" href="doga-temelli-egitimler.html">Doğa Temelli Eğitimlerimiz</a>
      </div>
    </div>
  </section>

  ${marquee(30)}`;

  add('sosyal-sorumluluk-is-danismanligi.html', layout({
    title: 'Sosyal Sorumluluk & İş Danışmanlığı — Afloday',
    desc: kirp(s.giris[3], 155),
    current: 'kurumsal.html', body, canonical: 'sosyal-sorumluluk-is-danismanligi.html',
    ogImage: `assets/img/rev2/secilmis/${gorselSlug(s.girisGorsel)}.jpg`,
  }));
}



/* ====================================================================== */
/* HAKKIMIZDA — 4 Ağustos belgesi, satır 161-179                           */
/* ====================================================================== */
/* Belge dört bölüm veriyor: Hikayemiz · Vizyonumuz · Misyonumuz · Neden Doğa?
   Her birinin kendi görseli var, bölümler dönüşümlü hizalanıyor.
   Ekip bölümü (#ekip) yerinde kalıyor — envanterde yedi ekip sayfası "OK". */
{
  const h = hakkimizdaRev2;

  const body = `
${folio({
    eyebrow: 'Hakkımızda',
    plateNo: '2018’den bugüne',
    lines: ['Doğanın bilgeliğini', '<em class="em">işe taşıyoruz</em>'],
    lede: h.alintiAlt,
    size: 'd-xl',
    buttons: '<a class="btn btn-ghost" href="#ekip">Ekibimiz</a>',
    meta: [
      ['Merkez', `${site.address.locality}, ${site.address.region}`],
      ['Hizmet', 'Kurumsal · Bireysel · Çocuk'],
    ],
  })}

  <!-- Açılış alıntısı — belgede sayfanın başında duran soru -->
  <section class="section hk-alinti">
    <div class="hk-alinti-doku" aria-hidden="true">
      ${resim({ gorsel: h.alintiGorsel, alt: '' })}
    </div>
    <div class="wrap hk-alinti-in">
      <blockquote data-reveal>${h.alinti}</blockquote>
      <p class="hk-alinti-alt" data-reveal>${h.alintiAlt}</p>
    </div>
  </section>

  ${/* VİZYON VE MİSYON YAN YANA — 5 Ağustos geri bildirimi:
       "vizyon, misyon alt alta aynı sayfada word düzeni gibi, sevmedim."

       İkisi de tek paragraf ama her biri tam bir bölüm kaplıyordu; sayfa
       aşağı doğru dört kez aynı şeyi tekrarlıyordu. Şimdi tek bölümde
       yan yana duruyorlar ve metin fotoğrafın üzerinde — "görsellerin
       üzerinde olabilir yazılar vs."

       Anlatı bölümleri (Hikayemiz, Neden Doğa?) metin+görsel düzeninde
       kalıyor; onların gerçekten anlatacak metni var. */ ''}
  ${(() => {
    const ikili = h.bolumler.filter(b => b.id === 'vizyonumuz' || b.id === 'misyonumuz');
    const anlati = h.bolumler.filter(b => !ikili.includes(b));
    const anlatiHtml = anlati.map((b, i) => `
  <section class="section${i === 0 ? ' rule-top' : ''}" id="${b.id}">
    <div class="wrap">
      <div class="hk-bolum${i % 2 ? ' hk-bolum-ters' : ''}">
        <div class="hk-yazi">
          <p class="eyebrow" data-reveal>${b.baslik}</p>
          ${b.paragraflar.map(p => `<p class="body" data-reveal>${p}</p>`).join('\n          ')}
        </div>
        <figure class="hk-gorsel" data-reveal>
          ${resim({ gorsel: b.gorsel, alt: b.alt, kucuk: true, odak: b.odak })}
        </figure>
      </div>
    </div>
  </section>`);

    const ikiliHtml = ikili.length ? `
  <section class="section-tight">
    <div class="wrap">
      <div class="hk-ikili">
        ${ikili.map(b => `<article class="hk-ikili-kart" id="${b.id}" data-reveal="stagger">
          <div class="hk-ikili-medya" aria-hidden="true">
            ${resim({ gorsel: b.gorsel, alt: '', kucuk: true, odak: b.odak })}
          </div>
          <div class="hk-ikili-ic">
            <h2 class="hk-ikili-ad">${b.baslik}</h2>
            ${b.paragraflar.map(p => `<p>${p}</p>`).join('\n            ')}
          </div>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>` : '';

    /* Belgedeki sıra: Hikayemiz → Vizyon → Misyon → Neden Doğa?
       İkili blok o sıradaki yerine, yani ilk anlatıdan sonra giriyor. */
    return [anlatiHtml[0], ikiliHtml, ...anlatiHtml.slice(1)].filter(Boolean).join('\n');
  })()}

  ${marquee(30)}

  <section class="section" id="ekip">
    <div class="wrap">
      ${opener('Ekip', 'Ekibimiz', '')}
      <div class="plates" style="margin-top:clamp(40px,5vw,72px)">
        ${team.map(t => `<a class="plate" href="ekip-${t.slug}.html" data-reveal="stagger">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/team/${t.img}" alt="${t.alt}" loading="lazy" width="900" height="900"></div>
          <div class="plate-label">
            <p class="plate-acc"><span>Ekip</span><span>Profil →</span></p>
            <h3 class="plate-name">${t.name}</h3>
            <p class="caption" style="margin-bottom:var(--s3)">${t.role}</p>
            <p class="plate-note">${t.paras[0]}</p>
          </div>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  add('hakkimizda.html', layout({
    title: 'Hakkımızda ve Ekibimiz — Afloday',
    desc: kirp(h.bolumler[0].paragraflar[0], 155),
    current: 'hakkimizda.html', body, canonical: 'hakkimizda.html',
    ogImage: `assets/img/rev2/secilmis/${gorselSlug(h.alintiGorsel)}.jpg`,
  }));
}

/* ====================================================================== */
/* SÜRDÜRÜLEBİLİRLİK                                                      */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'Sürdürülebilirlik',
    plateNo: `${projects.length} proje`,
    lines: ['Paylaştıkça', '<em class="em">var olacağımızı</em>', 'düşünüyoruz'],
    lede: surdurulebilirlikGiris,
    meta: projects.map(p => ['Proje', p.title]),
  })}

  ${projects.map((p, idx) => `
  <section class="section${idx ? ' field' : ''}" id="${p.id}">
    <div class="wrap">
      ${opener('Sürdürülebilirlik projesi', p.title, p.tagline)}
      <div class="duo" style="margin-top:clamp(40px,5vw,80px)">
        <div class="duo-wide body stack" data-reveal>
          ${p.paras.slice(0, 4).map(x => `<p${idx ? ' style="color:var(--field-muted)"' : ''}>${x}</p>`).join('\n          ')}
          <div class="btn-row"><a class="btn ${idx ? 'btn-ghost' : 'btn-primary'}" href="${p.slug}.html">Projenin tamamını oku</a></div>
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/surdurulebilirlik/${p.img}" alt="${p.alt}" loading="lazy" width="800" height="900"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>Proje</span><span>Sürdürülebilirlik</span></p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>`).join('\n')}`;

  add('surdurulebilirlik.html', layout({
    title: 'Sürdürülebilirlik Projelerimiz — Afloday',
    desc: 'Koruncuk Vakfı ile Gülümseyen Yarınlar Projesi ve çevresel sürdürülebilirlik kapsamında Geleceği Yeşil Tasarla Projesi.',
    current: 'surdurulebilirlik.html', body, canonical: 'surdurulebilirlik.html',
    ogImage: 'assets/img/surdurulebilirlik/koruncuk-01.jpg',
  }));
}

/* ====================================================================== */
/* PROJE SAYFALARI — afloday.com'da her proje kendi sayfasında             */
/* ====================================================================== */
/* Geleceği Doğadan Tasarla 4 Ağustos belgesiyle baştan yazıldı ve aşağıda
   kendi bloğunda kuruluyor; bu döngü yalnız Gülümseyen Yarınlar'ı üretiyor
   (envanterde "OK", dokunulmuyor). */
for (const p of projects.filter(x => x.slug !== 'proje-gelecegi-yesil-tasarla')) {
  const G = (f) => `assets/img/surdurulebilirlik/${f}`;
  const gal = orijinalGorsel[p.id === 'gulumseyen-yarinlar' ? 'gulumseyen-yarinlar-projesi' : 'gelecegi-tasarla'] || [];

  /* KAPSAM MADDELERİ FOTOĞRAFLA EŞLEŞİYOR — 7 Ağustos.

     Ceylan hanım: "atölyeler çok yazı yazı kalmış. Görseller altta word
     düzeni gibi olmuş, amatör duruyor." ve "Metin, görsel, yazı yazı
     gidiyor daha dinamik olabilir. Aralara görseller girebilir."

     Şikâyet bir sayfaya değil bir KALIBA: önce metin yığını, sonra altta
     fotoğraf ızgarası. Bu sayfa o kalıbı adı geçen sayfadan daha ağır
     taşıyordu — 10 metin bloğu, sonra %61'den itibaren 12 fotoğraf.

     Çözüm için yeni cümle gerekmedi: sayfada zaten dört tarihli madde ve
     on iki fotoğraf vardı, eşleştirildiler. Kalanlar galeride duruyor.

     Numaralı sayaçlar (01/02/03) kaldırıldı: "ara yönlendirmeler var
     10 atölye, 7 kişi ekip vs onlar olmasın". Fotoğraf zaten görsel
     çapa görevi görüyor, numaraya gerek kalmadı. */
  /* Kapak fotoğrafı `surdurulebilirlik/koruncuk-01.jpg`, galerinin ilk
     karesi `atolye-koruncuk/01.jpg` — ikisi AYNI fotoğrafın iki kopyası,
     farklı klasörlerde. Bant galerinin başından alınca aynı kare sayfada
     iki kez çıkıyordu. Kullanıcının tespiti: "hem baştaki kısımda aynı
     görsel kullanılmış hem de kapsamın başında aynı görsel."
     Bant ikinci kareden başlıyor. */
  const KAPAK_TEKRARI = 1;
  const havuz = gal.filter((x) => !x.endsWith('/01.jpg'));

  /* Fotoğraflar sayfaya DAĞITILIYOR, iki yerde toplanmıyor.

     Önce üstte tek fotoğraf + dört uzun paragraf, altta sekiz fotoğraflık
     blok vardı. Yığın 12'den 8'e inmişti ama desen aynıydı: "yazı yazı",
     sonra "görseller altta". Ceylan hanımın şikâyeti sayıya değil desene.

     Şimdi: giriş paragrafları ve kapsam maddeleri kendi fotoğraflarıyla
     eşleşiyor, geriye kalan az sayıda kare galeride duruyor. */
  const girisFoto = havuz.slice(0, p.paras.length);
  const eslesen = havuz.slice(girisFoto.length, girisFoto.length + (p.kapsam ? p.kapsam.maddeler.length : 0));
  const kalanGal = havuz.slice(girisFoto.length + eslesen.length);

  const listeBlok = p.kapsam ? `
  <section class="section field">
    <div class="wrap">
      <div class="stack-l" data-reveal>
        <p class="eyebrow">Kapsam</p>
        <h2 class="h2">${p.kapsam.baslik}</h2>
      </div>
      <div class="proje-akis">
        ${p.kapsam.maddeler.map((m, i) => {
    const foto = eslesen[i];
    const dik = foto ? gorselOraniOku(foto) < 1 : false;
    return `<div class="proje-bant${dik ? ' proje-bant-dikey' : ''}" data-reveal style="--d:${i * 60}ms">
          ${foto ? `<figure class="proje-bant-foto">
            <img src="${foto}" alt="${p.alt}" loading="lazy" decoding="async"
              width="${gorselOlcuOku(foto).en}" height="${gorselOlcuOku(foto).boy}">
          </figure>` : ''}
          <p class="body proje-bant-metin">${m}</p>
        </div>`;
  }).join('\n        ')}
      </div>
      ${p.kapanis ? `<p class="lede proje-kapanis" data-reveal>${p.kapanis}</p>` : ''}
    </div>
  </section>` : '';

  const mevsimBlok = p.mevsim ? `
  <section class="section">
    <div class="wrap">
      ${opener('Mevsimsel etkinlikler', 'Dört mevsim doğa', '')}
      <div class="body stack" style="margin-top:clamp(28px,3.5vw,48px); max-width:52rem" data-reveal>
        ${p.mevsim.map(x => `<p>${x}</p>`).join('')}
      </div>
    </div>
  </section>` : '';

  const katkiBlok = p.katki ? `
  <section class="section field">
    <div class="wrap">
      <div class="split">
        <div class="stack-l" data-reveal>
          <p class="eyebrow">Topluma katkı</p>
          <h2 class="h2">${p.katki.baslik}</h2>
          <p class="body" style="color:var(--field-muted)">${p.katki.giris}</p>
        </div>
        <div class="stack-l" data-reveal style="--d:120ms">
          <p class="body" style="color:var(--field-muted)">${p.katki.liste}</p>
          <ul class="tags">${p.katki.maddeler.map(m => `<li>${m}</li>`).join('')}</ul>
          <p class="body" style="color:var(--field-muted)">${p.katki.kapanis}</p>
          <p class="caption" style="color:var(--field-muted)">${p.katki.dipnot}</p>
        </div>
      </div>
    </div>
  </section>` : '';

  const bilimBlok = p.bilim ? `
  <section class="section">
    <div class="wrap">
      ${opener('Neden', p.bilim.baslik, '')}
      <div class="body stack" style="margin-top:clamp(28px,3.5vw,48px); max-width:52rem" data-reveal>
        ${p.bilim.paras.map(x => `<p>${x}</p>`).join('')}
      </div>
      <div class="stack-l" style="margin-top:clamp(40px,5vw,72px)" data-reveal>
        <p class="eyebrow">${p.bilim.veriBaslik}</p>
        <div class="index">
          ${p.bilim.veriler.map((v, i) => `<div class="index-row" style="cursor:default">
            <span class="index-acc">${String(i + 1).padStart(2, '0')}</span>
            <span class="body">${v}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </section>` : '';

  const stratejiBlok = p.strateji ? `
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Ulusal çerçeve', p.strateji.baslik, '')}
      <div class="split" style="margin-top:clamp(32px,4vw,56px)">
        <div class="stack-l" data-reveal>
          <p class="body">${p.strateji.giris}</p>
          <ol class="flow">
            ${p.strateji.eksenler.map((e, i) => `<li class="flow-step" style="grid-template-columns:4em 1fr">
              <span class="flow-num">${String(i + 1).padStart(2, '0')}</span><p class="body">${e}</p>
            </li>`).join('')}
          </ol>
        </div>
        <div class="stack-l" data-reveal style="--d:120ms">
          ${p.strateji.oncelikler.map(o => `<div class="stack">
            <p class="eyebrow">${o.baslik}</p>
            <p class="body">${o.metin}</p>
          </div>`).join('')}
          <p class="body">${p.strateji.kapanis}</p>
        </div>
      </div>
      <div class="stack" style="margin-top:clamp(40px,5vw,72px)" data-reveal>
        <p class="eyebrow">Kaynaklar</p>
        <ol class="kaynaklar">${p.kaynaklar.map(k => `<li>${k}</li>`).join('')}</ol>
      </div>
    </div>
  </section>` : '';

  const davetBlok = p.davet ? `
  <section class="section field">
    <div class="wrap" style="text-align:center">
      <h2 class="d-l" data-reveal style="max-width:24ch;margin-inline:auto">${p.davet[0]}</h2>
      <p class="lede" data-reveal style="--d:100ms; color:var(--field-muted); max-width:44ch; margin:clamp(20px,2.5vw,32px) auto 0">${p.davet[1]}</p>
      <div class="btn-row" data-reveal style="--d:180ms; justify-content:center; margin-top:clamp(28px,3.5vw,44px)">
        <a class="btn btn-primary" href="iletisim.html">Projeye katıl</a>
      </div>
    </div>
  </section>` : '';

  const body = `
${folio({
    eyebrow: 'Sürdürülebilirlik projesi',
    plateNo: p.title,
    lines: [p.title.replace(' Projesi', ''), `<em class="em">Projesi</em>`],
    lede: p.tagline,
    size: 'h1',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Projeye katıl</a>`,
    meta: [['Kapsam', p.id === 'gulumseyen-yarinlar' ? 'Çocuk hakları · gönüllülük' : 'Çevresel sürdürülebilirlik'],
           ['Başlangıç', p.id === 'gulumseyen-yarinlar' ? '2019' : 'Devam ediyor'],
           ...(p.id === 'gelecegi-yesil-tasarla' ? [['Biçim', 'Online ve yüz yüze']] : [])],
  })}

  <section class="section">
    <div class="wrap">
      <div class="stack-l" data-reveal>
        <p class="lede proje-giris">${surdurulebilirlikGiris}</p>
      </div>
      ${/* Giriş paragrafları da fotoğrafla eşleşiyor. Önce dört paragraf
           yan yana tek fotoğrafla duruyordu; sayfanın üst yarısı düz
           metin duvarıydı. Ceylan hanım: "atölyeler çok yazı yazı kalmış",
           "aralara görseller girebilir". */ ''}
      <div class="proje-akis proje-akis-acik">
        ${p.paras.map((x, i) => {
    const foto = girisFoto[i];
    const dik = foto ? gorselOraniOku(foto) < 1 : false;
    return `<div class="proje-bant${dik ? ' proje-bant-dikey' : ''}" data-reveal style="--d:${i * 60}ms">
          ${foto ? `<figure class="proje-bant-foto">
            <img src="${foto}" alt="${p.alt}" loading="lazy" decoding="async"
              width="${gorselOlcuOku(foto).en}" height="${gorselOlcuOku(foto).boy}">
          </figure>` : ''}
          <p class="body proje-bant-metin">${x}</p>
        </div>`;
  }).join('\n        ')}
      </div>
    </div>
  </section>
${listeBlok}${mevsimBlok}${katkiBlok}${bilimBlok}${stratejiBlok}
  ${galeriBolumu(kalanGal, p.title)}
${davetBlok}`;

  add(`${p.slug}.html`, layout({
    title: `${p.title} — Afloday`,
    desc: kirp(p.paras[0], 155),
    current: 'surdurulebilirlik.html', body, canonical: `${p.slug}.html`,
    ogImage: G(p.img),
  }));
}

/* ====================================================================== */
/* GELECEĞİ DOĞADAN TASARLA HAREKETİ — belge satır 287-372                 */
/* ====================================================================== */
/* Canlı adres: /gelecegi-tasarla. Belge sayfanın akışını da tarif ediyor:
   senfoni girişi → dört element haritası → dört pencere kartı (sayfa içi
   çapa) → her pencerenin detayı → ortak zemin ve kapanış çağrısı. */
{
  const g = gelecegiTasarla;

  /* Belge "eşleşme 4 küçük ikonla gösterilir" diyor. İkonlar tek renkli ve
     çizgisel: sitenin saç teli çizgi diliyle aynı ağırlıkta, dolgu yok.
     Her biri elementin doğadaki hâli — toprak katmanları, su dalgası,
     alev, rüzgâr akımı. */
  const IKON = {
    toprak: '<path d="M2 15h20M4 19h16M7 11c1.5-2 3.5-3 5-3s3.5 1 5 3" />',
    su: '<path d="M2 10c3 0 3 3 6 3s3-3 6-3 3 3 6 3M2 16c3 0 3 3 6 3s3-3 6-3 3 3 6 3" />',
    ates: '<path d="M12 3c0 4-4 5-4 9a4 4 0 0 0 8 0c0-2-1-3-1-5 2 1 4 3 4 6a7 7 0 1 1-14 0c0-5 7-6 7-10z" />',
    hava: '<path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h8" />',
  };
  const ikon = (ad) =>
    `<svg class="gt-ikon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"
       aria-hidden="true">${IKON[ad] || ''}</svg>`;

  const pencereBlok = (p, i) => `
  <section class="section${i % 2 ? ' field' : ' rule-top'} pencere" id="${p.id}" style="--element:${p.renk};--element-lift:${p.renkAcik}">
    <div class="wrap">
      <div class="pencere-bas" data-reveal>
        <p class="pencere-no">Pencere ${String(p.no).padStart(2, '0')}</p>
        <div class="pencere-giris">
          ${/* Belge: "kartın üstünde şu an hangi elementte olduğumuzu
               gösteren bir element rozeti bulunur" */ ''}
          <p class="element-rozet">${ikon(p.ikon)}<span>${p.element}</span></p>
          <h2 class="pencere-ad">${p.ad}</h2>
          <p class="pencere-element">Doğa Elementi: ${p.element}</p>
          ${/* ANLATI BURAYA TAŞINDI — 5 Ağustos geri bildirimi:
               "sayfalarda boşluklar da çok" ve "metin, görsel, yazı yazı
               gidiyor daha dinamik olabilir".
               Başlık bloğu 150 piksel, yanındaki görsel 330 piksel; sol
               sütunun altında 180 piksellik boşluk kalıyordu ve anlatı
               görselin altından yeniden başlıyordu. Anlatı yukarı gelince
               boşluk kapanıyor ve metin görselle yan yana duruyor. */ ''}
          <div class="pencere-blok pencere-blok-giris">
            <p class="eyebrow">Anlatı</p>
            <p>${p.anlati}</p>
          </div>
        </div>
        <figure class="pencere-gorsel">
          ${resim({ gorsel: p.gorsel, alt: p.alt, kucuk: true })}
        </figure>
      </div>

      <div class="pencere-govde">
        <div class="pencere-anlati">
          <div class="pencere-blok" data-reveal>
            <p class="eyebrow">Ne Sunuyoruz</p>
            <p>${p.neSunuyoruz}</p>
          </div>
          ${p.ekBolum ? `<div class="pencere-blok" data-reveal>
            <p class="eyebrow">${p.ekBolum.baslik}</p>
            ${p.ekBolum.paragraflar.map(x => `<p>${x}</p>`).join('\n            ')}
          </div>` : ''}
        </div>

        <div class="pencere-liste" data-reveal>
          <p class="eyebrow">${p.programEtiketi || 'Bu Pencerede Yer Alacak Programlar / Atölyeler'}</p>
          <ul>
            ${(p.egitimBaglari
      ? p.egitimBaglari.map(([ad, id]) => `<li><a href="egitim-${id}.html">${ad}</a></li>`)
      : p.programlar.map(x => `<li>${x}</li>`)
    ).join('\n            ')}
          </ul>
          ${p.not ? `<p class="pencere-not">${p.not}</p>` : ''}
        </div>
      </div>
    </div>
  </section>`;

  const body = `
${folio({
    eyebrow: 'Geleceği Doğadan Tasarla',
    plateNo: '4 element · 4 pencere',
    lines: ['Geleceği', '<em class="em">Doğadan Tasarla</em>', 'Hareketi'],
    lede: g.heroAlt,
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">${g.kapanis.cagri}</a>`,
    meta: [
      ['Pencere', '4 bakış açısı'],
      ['Temas', 'En az 4 temas önerilir'],
    ],
  })}

  <!-- ① Senfoni girişi -->
  <section class="section gt-senfoni">
    <div class="wrap wrap-narrow">
      <blockquote data-reveal>${g.hero}</blockquote>
      <p class="gt-senfoni-alt" data-reveal>${g.elementGiris}</p>
    </div>
  </section>

  <!-- ② Dört elementin haritası — aşağıdaki pencerelere çapa -->
  <section class="section-tight">
    <div class="wrap">
      <div class="gt-harita">
        ${/* Belge: "eşleşmesi 4 küçük ikonla gösterilir. Bu blok, aşağıdaki
             4 pencereye giden bir harita işlevi görür." */ ''}
        ${g.pencereler.map(p => `<a class="gt-element" href="#${p.id}" style="--element:${p.renk}" data-reveal="stagger">
          ${ikon(p.ikon)}
          <span class="gt-element-ad">${p.ad}</span>
          <span class="gt-element-cizgi"></span>
          <span class="gt-element-adi">${p.element}</span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- Yaklaşımımız -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Yaklaşımımız', g.yaklasim.baslik, '')}
      <div class="gt-yaklasim" style="margin-top:clamp(40px,5vw,72px)">
        <div class="gt-yaklasim-yazi">
          ${g.yaklasim.paragraflar.map(p => `<p class="body" data-reveal>${p}</p>`).join('\n          ')}
        </div>
        <figure class="gt-yaklasim-gorsel" data-reveal>
          ${resim({ gorsel: g.yaklasim.gorsel, alt: g.yaklasim.alt, kucuk: true })}
        </figure>
      </div>
    </div>
  </section>

  ${g.pencereler.map(pencereBlok).join('\n')}

  <!-- ⑤ Kapanış — ortak zemin ve çağrı -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Ortak zemin', g.kapanis.baslik, '')}
      <div class="gt-alanlar" style="margin-top:clamp(32px,4vw,56px)">
        ${g.kapanis.alanlar.map((a, i) => `<div class="gt-alan" data-reveal="stagger">
          <span class="gt-alan-no">${String(i + 1).padStart(2, '0')}</span>
          <span class="gt-alan-ad">${a}</span>
        </div>`).join('\n        ')}
      </div>
      <div class="gt-cagri" data-reveal>
        <h2 class="h2">${g.kapanis.cagri}</h2>
        <div class="btn-row">
          <a class="btn btn-primary" href="iletisim.html">İletişim</a>
          <a class="btn btn-ghost" href="iletisim.html">Teklif Al</a>
        </div>
      </div>
    </div>
  </section>

  ${marquee(30)}`;

  add('proje-gelecegi-yesil-tasarla.html', layout({
    title: 'Geleceği Doğadan Tasarla Hareketi — Afloday',
    desc: kirp(g.heroAlt + ' ' + g.yaklasim.paragraflar[0], 155),
    /* Menüde kendi maddesi var; `current` onu göstermeli. Burada
       `surdurulebilirlik.html` yazıyordu ve sayfaya girince alt çizgi
       Sürdürülebilirlik'in altında çıkıyordu. `header()` eşleşmeyi
       menüdeki `href` ile yapıyor, o yüzden değer menüdeki adresin
       birebir aynısı olmak zorunda (`data.mjs` → nav). */
    current: 'proje-gelecegi-yesil-tasarla.html', body, canonical: 'proje-gelecegi-yesil-tasarla.html',
    ogImage: `assets/img/rev2/secilmis/${gorselSlug(g.yaklasim.gorsel)}.jpg`,
  }));
}

/* ====================================================================== */
/* DOĞA TEMELLİ EĞİTİMLERİMİZ — 5 program, tam metin                       */
/* ====================================================================== */
/* 4 Ağustos belgesi satır 180-286. Her program aynı iskeleti taşıyor:
   Açılış Sahnesi → Doğadan Öğrendiğimiz Ders → Bu Eğitimle Güçlenen Kaslar
   → İş Hayatına Yansıması → Dolaylı Sosyal Hayata Yansıması → Program
   Bilgileri. Bölüm adları belgeden, veriyle birlikte egitimler.mjs'te.

   Anasayfadaki vitrin kartları buradaki `#id` çapalarına geliyor. */
{
  const B = egitimlerSayfasi.bolumler;
  const A = egitimlerSayfasi.alanlar;

  /* Program sayfası gövdesi — iskelet bir kez tanımlı, beş kez uygulanıyor;
     belgede de beş program birebir aynı başlıkları taşıyor.
     Kapak ve başlık artık `egitim-tasarim.mjs` içinde; burada belgenin
     altı bölümü duruyor. */
  const program = (e) => `
${egitimKapak(e)}

  <section class="section program">
    <div class="wrap">
      <div class="program-govde">
        <div class="program-anlati">
          <div class="program-blok" data-reveal>
            <p class="eyebrow">${B.acilis}</p>
            <p>${e.acilisSahnesi}</p>
          </div>
          <div class="program-blok" data-reveal>
            <p class="eyebrow">${B.ders}</p>
            <p>${e.dogadanDers}</p>
          </div>
          <div class="program-blok" data-reveal>
            <p class="eyebrow">${B.isHayati}</p>
            <p>${e.isHayati}</p>
          </div>
          <div class="program-blok" data-reveal>
            <p class="eyebrow">${B.sosyalHayat}</p>
            <p>${e.sosyalHayat}</p>
          </div>
        </div>

        <div class="program-yan">
          <div class="program-kaslar" data-reveal>
            <p class="eyebrow">${B.kaslar}</p>
            <dl>
              ${e.kaslar.map(([ad, aciklama]) => `<div>
                <dt>${ad}</dt>
                <dd>${aciklama}</dd>
              </div>`).join('\n              ')}
            </dl>
          </div>

          <div class="program-bilgi" data-reveal>
            <p class="eyebrow">${B.bilgiler}</p>
            <dl class="dl">
              <div><dt>${A.format}</dt><dd>${e.format}</dd></div>
              <div><dt>${A.sure}</dt><dd>${e.sure}</dd></div>
              <div><dt>${A.hedefKitle}</dt><dd>${e.hedefKitle}</dd></div>
              <div><dt>${A.yetkinlikler}</dt><dd>${e.yetkinlikler}</dd></div>
            </dl>
            <div class="btn-row" style="margin-top:var(--s4)">
              <a class="btn btn-primary" href="iletisim.html">Bu program için teklif alın</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Diğer programlar', 'Doğa Temelli Eğitimlerimiz', '')}
      <div style="margin-top:clamp(28px,3.5vw,48px)">
        ${egitimGezinme(egitimler, e.id)}
      </div>
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)">
        <a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>
        <a class="btn btn-ghost" href="doga-temelli-egitimler.html">Beş programın tamamı</a>
      </div>
    </div>
  </section>`;

  const body = `
${folio({
    eyebrow: 'Afloday',
    /* Sayaç kaldırıldı — "10 atölye, 7 kişi ekip vs onlar olmasın." */
    plateNo: 'Doğa Temelli Eğitimler',
    lines: ['Doğa Temelli', '<em class="em">Eğitimlerimiz</em>'],
    lede: egitimlerSayfasi.giris,
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>
              <a class="btn btn-ghost" href="#programlar">Programlara git</a>`,
    meta: [
      ['Biçim', 'Yüz Yüze / Online'],
      ['Süre', '1-2 Gün'],
    ],
  })}

  ${/* "5 eğitimi sayfaya sığdırsak çok iyi olur." Beş programın tam
       anlatısı alt alta 10.572 piksel tutuyordu, yani 11.7 ekran.
       Şimdi beşi de tek ızgarada; tam metin kendi sayfasında. */ ''}
  <section class="section-tight" id="programlar">
    <div class="wrap">
      ${/* ŞERİT GÖRSELLERİ ELLE SEÇİLDİ — hepsi yatay.
           Panel şeridinin arka planı geniş bir bant; oraya dikey fotoğraf
           konunca %81'i kesiliyor (6 çözünürlükte ölçüldü). Programların
           `vitrinGorsel` alanları Afloday'in kendi kareleri ama ikisi
           dikey (1067×1600 ve 900×1600), o yüzden şeritte kullanılmıyor.

           `takim-ruhu` ile `degisimin-dogasi` aynı çift-pozlama karesini
           paylaşıyor; şeritte iki panel birebir aynı çıkmasın diye
           ikincisine pusula karesi verildi — "Değişimin Doğası ve Liderlik
           Ekosistemi" için yön/rota anlamı da yerinde oturuyor. */ ''}
      ${panelSerit(egitimler.map(e => ({
    ad: e.ad,
    gorsel: e.id === 'degisimin-dogasi' ? 'man-hand-holding-compass-forest.jpg' : e.gorsel,
    href: egitimDosyasi(e),
  })), { etiket: 'Eğitim programları' }).replace('class="pserit"', 'class="pserit pserit-5"')}
    </div>
  </section>

  <!-- Eğitimin somut hâli — deneyimsel atölyelere köprü -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener(deneyimVitrini.ustEtiket, deneyimVitrini.baslik, deneyimVitrini.altBaslik)}
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Doğadan Etkinlik Atölye Deneyimleri</a>
      </div>
    </div>
  </section>

  <!-- DOKÜMANLAR — afloday.com'daki iki PDF, olduğu gibi kalıyor -->
  ${/* ANASAYFADAN TAŞINDI — Ceylan hanım, 7 Ağustos.
       "Neden Doğa Temelli Gelişim?" dört istatistik kartı anasayfadaydı;
       kendi bağlamı burası. Anasayfa bir bölüm kısaldı, bu sayfa da
       eğitimlerin neden doğa temelli olduğunu kanıtla açıklıyor. */ ''}
  <section class="section istatistik">
    <div class="wrap istatistik-in">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">${istatistikler.ustEtiket}</p>
          <h2 class="h2">${istatistikler.baslik}</h2>
        </div>
        <div></div>
        <div class="opener-rule"></div>
      </div>
      <div class="istatistik-kutular">
        ${istatistikler.kutular.map(k => `<div class="istatistik-kutu" data-reveal="stagger">
          <p class="istatistik-rakam">${k.rakam}</p>
          <p class="istatistik-metin">${k.metin}</p>
          ${k.kaynak
      ? `<p class="istatistik-kaynak">${k.kaynak}</p>`
      /* Belgede bu rakamın kaynağı yazmıyor. Uydurma kaynak yazmak yerine
         boş bırakıldı; Afloday'e soruldu. */
      : '<p class="istatistik-kaynak istatistik-kaynak-yok"></p>'}
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Dokümanlar', 'İndirilebilir içerik', '')}
      <div class="docs" style="margin-top:clamp(32px,4vw,56px)">
        <a href="${assets.pdfs.egitim.url}" rel="noopener" data-reveal>
          <span class="doc-kind">PDF</span>
          <span class="doc-name">Doğa Temelli Eğitimler İçerik Dokümanı</span>
          <span class="doc-go">İndir →</span>
        </a>
        <a href="${assets.pdfs.tasarla.url}" rel="noopener" data-reveal style="--d:100ms">
          <span class="doc-kind">PDF</span>
          <span class="doc-name">Geleceği Doğadan Tasarla — 2025</span>
          <span class="doc-go">İndir →</span>
        </a>
      </div>
      <p class="lede" style="margin-top:clamp(28px,3.5vw,44px)" data-reveal>Detaylı bilgi için lütfen bize ulaşın.</p>
      <div class="btn-row" style="margin-top:20px" data-reveal><a class="btn btn-primary" href="iletisim.html">İletişim formuna git</a></div>
    </div>
  </section>`;

  add('doga-temelli-egitimler.html', layout({
    title: 'Doğa Temelli Eğitimlerimiz — Afloday',
    desc: kirp(egitimlerSayfasi.giris, 155),
    current: 'doga-temelli-egitimler.html', body, canonical: 'doga-temelli-egitimler.html',
    ogImage: `assets/img/rev2/secilmis/${gorselSlug(egitimler[0].gorsel)}.jpg`,
  }));

  /* ── 5 PROGRAM SAYFASI ────────────────────────────────────────────────
     Belgenin altı bölümü olduğu gibi taşındı, tek cümle değişmedi. */
  for (const e of egitimler) {
    add(egitimDosyasi(e), layout({
      title: `${e.ad} | Afloday`,
      desc: kirp(e.acilisSahnesi, 155),
      current: 'doga-temelli-egitimler.html',
      body: program(e),
      canonical: egitimDosyasi(e),
      ogImage: `assets/img/rev2/secilmis/${gorselSlug(e.gorsel)}.jpg`,
    }));
  }
}

/* ====================================================================== */
/* DOĞADAN ETKİNLİK ATÖLYE DENEYİMLERİ — 7 kategori, 53 atölye             */
/* ====================================================================== */
/* 4 Ağustos belgesiyle gelen yeni sayfa. İptal edilen 16 atölye sayfasının
   ve "Doğadan Hobi Atölyeleri"nin yerine geçiyor, o adresi devralıyor —
   böylece adresin arama motorlarındaki birikmiş değeri korunuyor.
   Gerekçe: docs/afloday-sorular-2026-08-04.md · madde 4. */
{
  /* Ortak sayaç: `uygulanabilir` alanındaki atölyeleri de sayıyor.
     Önceden yalnız `atolyeler` toplanıyordu; akordeon başlıkları 53,
     sayfa künyesi 50 diyordu. */

  const body = `
${folio({
    eyebrow: 'Afloday Kurumsal Hizmetler',
    /* Sayaç kaldırıldı — Ceylan hanım 5 Ağustos geri bildirimi:
       "Ara yönlendirmeler var 10 atölye, 7 kişi ekip vs onlar olmasın." */
    plateNo: 'Kurumsal Hizmetler',
    /* Başlık sonundaki nokta kaldırıldı: "Başlıklardan sonra nokta işareti
       olmasın." Aynı düzeltme site genelinde uygulandı. */
    lines: ['Doğadan Etkinlik', '<em class="em">Atölye Deneyimleri</em>'],
    lede: etkinlikSayfasi.giris[0],
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>
              <a class="btn btn-ghost" href="#kategoriler">Kategorilere git</a>`,
    meta: [
      ['Hizmet hattı', 'Kurumsal Hizmetler'],
    ],
  })}

  <!-- Belgedeki ikinci giriş paragrafı — kurumsal faydayı anlatan kısım -->
  <section class="section-tight">
    <div class="wrap wrap-narrow">
      <p class="lede" data-reveal>${etkinlikSayfasi.giris[1]}</p>
    </div>
  </section>

  <section class="section rule-top" id="kategoriler">
    <div class="wrap">
      ${/* Başlık belgedeki sayfa adının kendisi. Açıklama yok: belge bu
           bölüme metin yazmamış, kategoriler doğrudan geliyor. */ ''}
      ${opener('Etkinlik kategorileri', etkinlikSayfasi.baslik, '')}
      ${/* "Hepsi bir arada derli toplu" — Ceylan hanım, 5 Ağustos.
           Boşluklu kart ızgarası yerine uç uca panel şeridi;
           gerekçesi `panel-serit.mjs` başlığında. */ ''}
      <div style="margin-top:clamp(32px,4vw,56px)">
        ${panelSerit(etkinlikKategorileri.map(k => ({
    ad: k.ad, gorsel: k.gorsel, klasor: 'etkinlik', href: kategoriDosyasi(k),
  })), { etiket: 'Etkinlik kategorileri' })}
      </div>
    </div>
  </section>

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Diğer hatlar', 'Kurumsal hizmetlerimiz', '')}
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        ${/* Hizmet hatları 4 Ağustos belgesine göre yeniden adlandırıldı;
             eski `corporate` çapaları yerine yeni sayfa/çapa hedefleri. */
    [
      ['Deneyimsel Öğrenme', 'Doğadan Deneyimsel Öğrenme Atölyeleri', 'kurumsal.html#deneyimsel-ogrenme'],
      ['Sosyal Sorumluluk', 'Sosyal Sorumluluk & İş Danışmanlığı', 'sosyal-sorumluluk-is-danismanligi.html'],
    ].map(([kisa, ad, href]) => `<a class="index-row" href="${href}">
          <span class="index-acc">${kisa}</span>
          <span><span class="index-name">${ad}</span></span>
          <span class="index-meta">Detay</span>
        </a>`).join('')}
        <a class="index-row" href="doga-temelli-egitimler.html">
          <span class="index-acc">Eğitim</span>
          <span><span class="index-name">Doğa Temelli Eğitimlerimiz</span></span>
          <span class="index-meta">Detay</span>
        </a>
      </div>
    </div>
  </section>`;

  add('kurumsal-hobi-atolyeleri.html', layout({
    title: 'Doğadan Etkinlik Atölye Deneyimleri — Kurumsal | Afloday',
    desc: kirp(etkinlikSayfasi.giris[1], 155),
    current: 'kurumsal.html', body, canonical: 'kurumsal-hobi-atolyeleri.html',
    /* Eski `kurumsal/kurumsal-02.jpg` depo temizliğinde silinmişti;
       paylaşım kartı boş çıkıyordu. 1200×630 kapak `og-gorsel.mjs`ten. */
    ogImage: 'assets/img/og/og-kurumsal.jpg',
  }));

  /* ── 7 KATEGORİ SAYFASI ───────────────────────────────────────────────
     Her kategori kendi adresine taşındı. Gerekçe: tek sayfada 12.600
     piksel vardı ve müşteri "genel olarak kayboldum sayfalarda" dedi.
     Bölünce genel bakış tek ekrana sığıyor, kategoriler ayrı ayrı
     paylaşılabilir hâle geliyor.

     Metinlerin tamamı 4 Ağustos belgesinden; bu sayfalar yalnızca var
     olan içeriği yeniden yerleştiriyor, tek cümle eklemiyor. */
  for (const k of etkinlikKategorileri) {
    const govde = `
${kategoriKapak(k)}

  <section class="section-tight">
    <div class="wrap wrap-narrow">
      ${k.girisEtiketi ? `<p class="eyebrow" data-reveal>${k.girisEtiketi}</p>` : ''}
      ${k.giris.map((p, i) => `<p class="${i === 0 ? 'lede' : 'kat-giris-metin'}" data-reveal>${p}</p>`).join('\n      ')}
    </div>
  </section>

  ${k.bilim ? `<section class="section-tight">
    <div class="wrap wrap-narrow">
      <div class="kat-bilim" data-reveal>
        <p class="eyebrow">${k.bilim.baslik}</p>
        ${k.bilim.maddeler.map(m => `<p>${m}</p>`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <section class="section">
    <div class="wrap">
      ${/* Kurumsal Gönüllülük'ün üç atölyesi `uygulanabilir` alanında ve
           belgenin kendi etiketiyle geliyor; diğer kategorilerde belge
           böyle bir başlık vermemiş, o yüzden etiketsiz. */
    !k.atolyeler.length && k.uygulanabilirEtiketi
      ? `<p class="eyebrow" data-reveal>${k.uygulanabilirEtiketi}</p>` : ''}
      ${kategoriMozaik(k)}
    </div>
  </section>

  ${k.uygulanabilir && k.atolyeler.length ? `<section class="section-tight">
    <div class="wrap wrap-narrow">
      <div class="kat-bilim" data-reveal>
        <p class="eyebrow">${k.uygulanabilirEtiketi || 'Uygulanabilir atölyeler'}</p>
        <ul class="kat-liste">${k.uygulanabilir.map(x => `<li>${x}</li>`).join('')}</ul>
      </div>
    </div>
  </section>` : ''}

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Diğer kategoriler', 'Doğadan Etkinlik Atölye Deneyimleri', '')}
      <div style="margin-top:clamp(28px,3.5vw,48px)">
        ${kategoriGezinme(etkinlikKategorileri, k.id)}
      </div>
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)">
        <a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>
        <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Tüm kategoriler</a>
      </div>
    </div>
  </section>`;

    add(kategoriDosyasi(k), layout({
      /* Kategori adları uzun; üst başlığı da eklemek 65 karakteri aşıyor
         ve Google sonuçta kesiyor. Yalnız kategori adı + marka. */
      title: `${k.ad} | Afloday`,
      desc: kirp(k.giris[0], 155),
      current: 'kurumsal.html', body: govde, canonical: kategoriDosyasi(k),
      ogImage: 'assets/img/og/og-kurumsal.jpg',
    }));
  }
}

/* ====================================================================== */
/* İLETİŞİM                                                               */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'İletişim',
    plateNo: 'Bize ulaşın',
    lines: ['Bir <em class="em">&ldquo;TIK&rdquo;</em>', 'yakındayız'],
    lede: 'Bir &ldquo;TIK&rdquo; yakındayız. Formu doldurun ya da doğrudan telefonla ulaşın.',
    meta: [
      ['E-posta', `<a href="mailto:${site.email}" style="color:inherit">${site.email}</a>`],
      ...site.phones.map(p => ['Telefon', p]),
      ['Adres', `${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}`],
      /* Satır içi renk --carmine idi; o değişken artık turuncu ve krem
         zeminde 2.84:1 veriyor. Metin vurgusu --vurgu (yeşil, 5.34:1). */
      ['Yol tarifi', `<a href="${assets.maps}" rel="noopener" style="color:var(--vurgu)">Haritada aç →</a>`],
    ],
    buttons: `<a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Etkinlik atölye deneyimleri</a>`,
  })}

  <section class="section">
    <div class="wrap wrap-narrow">
      <div data-reveal>
        <form class="form" data-demo="form-ok" novalidate>
          <div class="form-row form-row-2">
            <div class="f"><label for="ad">Ad Soyad <span class="req">*</span></label><input id="ad" name="ad" type="text" required autocomplete="name" placeholder="Lütfen adınızı ve soyadınızı yazınız."></div>
            <div class="f"><label for="tel">Telefon <span class="req">*</span></label><input id="tel" name="tel" type="tel" required autocomplete="tel" placeholder="Lütfen telefonunuzu yazınız."></div>
          </div>
          <div class="f"><label for="eposta">E-posta <span class="req">*</span></label><input id="eposta" name="eposta" type="email" required autocomplete="email" placeholder="Lütfen e-posta adresinizi yazınız."></div>
          <div class="f"><label for="mesaj">Mesajınız <span class="req">*</span></label><textarea id="mesaj" name="mesaj" rows="6" maxlength="500" required placeholder="Lütfen mesajınızı yazınız."></textarea><p class="form-say"><span data-sayac="mesaj">0</span>/500</p></div>
          <label class="f-check"><input type="checkbox" name="kvkk" required> Kişisel verilerimin ${kvkkHazir() ? '<a href="kvkk.html">KVKK Aydınlatma Metni</a>' : 'KVKK'} kapsamında işlenmesini kabul ediyorum.</label>
          <div class="btn-row"><button class="btn btn-primary" type="submit">Gönder</button></div>
          <p class="form-note">Bu bir tasarım sunumudur — form gönderimi kaydedilmez.</p>
        </form>

        <div class="form-ok" id="form-ok" role="status">
          <p class="eyebrow">Gönderildi</p>
          <h2 class="h3" style="margin:var(--s3) 0">Teşekkürler! Talebiniz elimize ulaştı.</h2>
          <p class="body">En kısa sürede sizinle iletişime geçeceğiz.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HARİTA — orijinaldeki "Yol tarifi için tıklayın" bağlantısının karşılığı -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Adres', 'Küçüksu Cad., Ümraniye', `${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}`)}
      ${/* HARİTADA İĞNE ÇIKMIYORDU.

           Sorgu ham sokak satırıyla kuruluyordu: "Küçüksu Cad. Antasya
           Residence No:64A/15, 34768 Ümraniye/İstanbul". Google'ın
           coğrafi çözümleyicisi `No:` önekini ve `/15` daire numarasını
           adresin parçası sanıp eşleşmeyi kaybediyor; adresi çözemeyince
           iğne koymadan bölgeyi ortalıyor. Kullanıcının gördüğü buydu.

           Sorgu artık işletme adıyla başlıyor ve daire numarası düşüyor
           — daire zaten binanın içinde, haritada karşılığı yok. Ad önde
           olduğu için Afloday kayıtlıysa etiketli iğne çıkıyor, değilse
           bina adresine iğne düşüyor. Görünen adres metni tam hâliyle
           duruyor, kısaltılan yalnız harita sorgusu. */ ''}
      <div class="harita" data-reveal style="margin-top:clamp(32px,4vw,56px)">
        <iframe title="Afloday ofis konumu — Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(
    `${site.name}, ${site.address.street.replace(/\s*No:\s*/i, ' ').replace(/\/\d+\s*$/, '')}, ${site.address.zip} ${site.address.locality}/${site.address.region}`
  )}&z=17&output=embed"></iframe>
      </div>
      <div class="iletisim-blok" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <p><b>E.</b> <a href="mailto:${site.email}">${site.email}</a></p>
        ${site.phones.map(t => `<p><b>T.</b> <a href="tel:${t.replace(/\s/g, '')}">${t}</a></p>`).join('')}
        <p><b>A.</b> ${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}</p>
      </div>
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        <a class="index-row" href="iletisim.html"><span class="index-acc">01</span><span class="index-name">İletişim</span><span class="index-meta">Form</span></a>
        <a class="index-row" href="kurumsal-hobi-atolyeleri.html"><span class="index-acc">02</span><span class="index-name">Etkinlik Atölye Deneyimleri</span><span class="index-meta">Detay</span></a>
        <a class="index-row" href="ik.html"><span class="index-acc">03</span><span class="index-name">İnsan Kaynakları</span><span class="index-meta">Form</span></a>
      </div>
    </div>
  </section>

  ${marquee(30)}`;

  add('iletisim.html', layout({
    title: 'İletişim ve Kurumsal Teklif — Afloday',
    desc: `Afloday ile iletişime geçin. ${site.email} · ${site.phones[0]} · ${site.address.locality}, ${site.address.region}. İletişim formu, telefon, adres ve harita.`,
    current: 'iletisim.html', body, canonical: 'iletisim.html',
    schema: {
      '@context': 'https://schema.org', '@type': 'ContactPage',
      mainEntity: {
        '@type': 'Organization', name: site.name, email: site.email, telephone: '+90 216 510 2809',
        address: {
          '@type': 'PostalAddress', streetAddress: site.address.street,
          addressLocality: site.address.locality, addressRegion: site.address.region,
          postalCode: site.address.zip, addressCountry: 'TR',
        },
      },
    },
  }));
}

/* ====================================================================== */
/* EKİP ÜYESİ SAYFALARI — orijinalde her biri ayrı sayfaydı               */
/* ====================================================================== */
for (const [i, t] of team.entries()) {
  const others = team.filter(x => x.slug !== t.slug);
  /* Ceylan Kalyon'un metni 4 Ağustos belgesiyle değişti; diğer altı ekip
     üyesinin metni envanterde "OK", bugünkü hâliyle kalıyor. */
  const yeni = t.slug === 'ceylan-kalyon' ? ceylanRev2 : null;
  const body = `
${folio({
    eyebrow: 'Ekip · Afloday',
    /* "Ekip 01 / 7" levha numarası kalktı — Ceylan hanım açıkça
       "7 kişi ekip vs onlar olmasın" dedi. Hem sayfa künyesinde hem
       sağ üst levhada iki kez görünüyordu. */
    plateNo: 'Afloday',
    lines: [yeni ? yeni.tamAd : t.name],
    lede: yeni ? yeni.ozet : t.role,
    size: 'h1',
    buttons: '<a class="btn btn-ghost" href="hakkimizda.html#ekip">Tüm ekip</a>',
    meta: [
      ['Görev', t.role],
      ['Merkez', `${site.address.locality}, ${site.address.region}`],
      ['İletişim', `<a href="mailto:${site.email}" style="color:inherit">${site.email}</a>`],
    ],
  })}

  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide body stack" data-reveal>
          ${(yeni ? yeni.paragraflar : t.paras).map(p => `<p>${p}</p>`).join('\n          ')}
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/team/${t.img}" alt="${t.alt}" loading="lazy" width="900" height="900"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>Ekip</span><span>Afloday</span></p>
            <p class="plate-note">${t.role}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  ${yeni ? `
  <!-- Uzmanlık alanları — belgede yalnız Ceylan Kalyon için verilmiş -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Uzmanlık', yeni.uzmanlik.baslik, '')}
      <div class="uzmanlik" style="margin-top:clamp(32px,4vw,56px)">
        ${yeni.uzmanlik.alanlar.map((a, j) => `<div class="uzmanlik-oge" data-reveal="stagger">
          <span class="uzmanlik-no">${String(j + 1).padStart(2, '0')}</span>
          <span class="uzmanlik-ad">${a}</span>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>` : ''}

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Ekipten', 'Diğer eğitmen ve danışmanlar', '')}
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        ${others.map((o, j) => `<a class="index-row" href="ekip-${o.slug}.html">
          <span class="index-acc">${String(j + 1).padStart(2, '0')}</span>
          <span><span class="index-name">${o.name}</span><br><span class="caption" style="margin-top:6px;display:block">${o.role}</span></span>
          <span class="index-meta">Profil</span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>`;

  add(`ekip-${t.slug}.html`, layout({
    title: `${t.name} — ${site.name}`,
    /* Sabit 110 karakter, uzun unvanlarda toplamı 160'ın üstüne çıkarıyordu
       (Derya 179 karakter) ve arama sonucunda kesiliyordu. Alıntı artık
       ad + unvandan kalan bütçeye göre kırpılıyor. */
    desc: (() => {
      const bas = `${t.name}, ${t.role}. `;
      return bas + kirp(t.paras[0], Math.max(40, 158 - bas.length));
    })(),
    current: 'hakkimizda.html', body, canonical: `ekip-${t.slug}.html`,
    ogImage: `assets/img/team/${t.img}`,
    schema: {
      '@context': 'https://schema.org', '@type': 'Person',
      name: t.name, jobTitle: t.role,
      worksFor: { '@type': 'Organization', name: site.name, url: site.url + '/' },
      image: `${site.url}/assets/img/team/${t.img}`,
    },
  }));
}


/* ====================================================================== */
/* İNSAN KAYNAKLARI                                                       */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'İnsan Kaynakları',
    plateNo: 'Form 02',
    lines: ['Ekibimize', '<em class="em">katılın</em>'],
    lede: '',   /* canlı sitede de belgede de bu sayfaya ait tanıtım metni yok */
    meta: [
      ['Dosya', 'En fazla 4 MB'],
      ['Biçim', 'doc · docx · pdf · jpg · png'],
      ['E-posta', site.email],
    ],
  })}

  <section class="section">
    <div class="wrap wrap-narrow">
      <div data-reveal>
        <form class="form" data-demo="ik-ok" novalidate>
          <div class="form-row form-row-2">
            <div class="f"><label for="i-ad">Adınız <span class="req">*</span></label><input id="i-ad" name="ad" type="text" required autocomplete="given-name"></div>
            <div class="f"><label for="i-soyad">Soyadınız <span class="req">*</span></label><input id="i-soyad" name="soyad" type="text" required autocomplete="family-name"></div>
          </div>
          <div class="form-row form-row-2">
            <div class="f"><label for="i-eposta">E-posta <span class="req">*</span></label><input id="i-eposta" name="eposta" type="email" required autocomplete="email"></div>
            <div class="f"><label for="i-tel">Telefon <span class="req">*</span></label><input id="i-tel" name="tel" type="tel" required autocomplete="tel"></div>
          </div>
          <div class="f">
            <label for="i-cv">Özgeçmiş <span class="req">*</span></label>
            <input id="i-cv" name="cv" type="file" required accept=".doc,.docx,.pdf,.jpg,.jpeg,.png" aria-describedby="i-cv-not">
            <p class="form-note" id="i-cv-not">En fazla 4 MB. Desteklenen biçimler: doc, docx, pdf, jpg, jpeg, png.</p>
          </div>
          <div class="f"><label for="i-mesaj">Mesajınız <span class="req">*</span></label><textarea id="i-mesaj" name="mesaj" rows="6" maxlength="500" required placeholder="Lütfen mesajınızı yazınız!"></textarea><p class="form-say"><span data-sayac="i-mesaj">0</span>/500</p></div>
          <label class="f-check"><input type="checkbox" name="kvkk" required> Kişisel verilerimin ${kvkkHazir() ? '<a href="kvkk.html">KVKK Aydınlatma Metni</a>' : 'KVKK'} kapsamında işlenmesini kabul ediyorum.</label>
          <div class="btn-row"><button class="btn btn-primary" type="submit">Başvurumu Gönder</button></div>
          <p class="form-note">Bu bir tasarım sunumudur — form gönderimi kaydedilmez.</p>
        </form>
        <div class="form-ok" id="ik-ok" role="status">
          <p class="eyebrow">Gönderildi</p>
          <h2 class="h3" style="margin:var(--s3) 0">Başvurunuz elimize ulaştı.</h2>
          <p class="body">Özgeçmişiniz bize ulaştı.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- İletişim künyesi ve form bağlantıları — orijinal sayfaların alt bloğu -->
  <section class="section rule-top">
    <div class="wrap">
      <div class="iletisim-blok" data-reveal>
        <p><b>E.</b> <a href="mailto:${site.email}">${site.email}</a></p>
        ${site.phones.map(t => `<p><b>T.</b> <a href="tel:${t.replace(/ /g, '')}">${t}</a></p>`).join('')}
        <p><b>A.</b> ${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}</p>
      </div>
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        <a class="index-row" href="iletisim.html"><span class="index-acc">01</span><span class="index-name">İletişim</span><span class="index-meta">Form</span></a>
        <a class="index-row" href="kurumsal-hobi-atolyeleri.html"><span class="index-acc">02</span><span class="index-name">Etkinlik Atölye Deneyimleri</span><span class="index-meta">Detay</span></a>
        <a class="index-row" href="ik.html"><span class="index-acc">03</span><span class="index-name">İnsan Kaynakları</span><span class="index-meta">Form</span></a>
      </div>
    </div>
  </section>`;

  add('ik.html', layout({
    title: 'İnsan Kaynakları — Afloday',
    desc: 'Afloday ekibine katılmak için özgeçmişinizi bırakın. Doğa temelli atölyeler alanında eğitmen ve danışman başvuruları.',
    current: '', body, canonical: 'ik.html',
  }));
}

/* ====================================================================== */
/* TEKLİF                                                                 */
/* ====================================================================== */

/* ====================================================================== */
/* GALERİ — menüdeki "Galeri" maddesinin sayfası                           */
/* ====================================================================== */
/* Belge "Galeri"yi yalnızca menü listesinde anıyor (satır 387); sayfa,
   adres ya da içerik tanımlamıyor. İçeriği klasör adı söylüyor: WeTransfer
   arşivindeki "Galeri" klasörü, 21 fotoğraf.

   Etkinlik fotoğrafları buraya girmiyor — onların klasörü kendi sayfasının
   adını taşıyor ("Doğadan Etkinlik Atölye Deneyimleri") ve yerleri o
   sayfanın akordeonları. Karıştırmak Afloday'in kendi düzenini bozardı.
   Karar günlüğü: docs/afloday-sorular-2026-08-04.md · madde 23. */
{
  const body = `
${/* Başlık sayfanın belgedeki adı (satır 387). Önceki hâli "Atölyelerden
     kareler" benim yazdığımdı; iki elemana bölündüğü için madde 24'teki
     ölçüme takılmamıştı. */ ''}
${folio({
    eyebrow: 'Afloday',
    plateNo: 'Afloday arşivi',
    lines: ['<em class="em">Galeri</em>'],
    lede: '',
    size: 'd-xl',
    buttons: '<a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>',
    meta: [['Kaynak', 'Afloday arşivi']],
  })}

  <section class="section-tight">
    <div class="wrap">
      ${awwwardsGaleri(galeriRev2)}
    </div>
  </section>

  <!-- Etkinlik kategorilerinin kendi galerileri o sayfanın içinde -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Devamı', 'Etkinlik atölyelerinden kareler', '')}
      <div class="btn-row" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Doğadan Etkinlik Atölye Deneyimleri</a>
      </div>
    </div>
  </section>

  ${marquee(30)}`;

  /* GALERİ SAYFASI ÜRETİLMİYOR — Ceylan Kalyon Özdemir, 5 Ağustos:
     "Galeri sayfasını kapatabiliriz."

     Fotoğraflar kaybolmadı: 21 kare anasayfadaki vitrin şeridinde,
     70 atölye karesi de yedi etkinlik kategorisi sayfasının mozaiğinde
     duruyor — orada hem daha çoklar hem de bağlamlılar.

     `/galeri` canlı sitede var olan bir adres, o yüzden silinmiyor:
     `vercel.json` içinde 301 ile `/dogadan-hobi-atolyeleri`ne gidiyor.
     Böylece 34 adres kuralı bozulmuyor, adresin arama motorlarındaki
     birikmiş değeri de fotoğrafların gerçekten bulunduğu yere aktarılıyor.

     Sayfa gövdesi (`body`) yukarıda duruyor; karar geri alınırsa tek
     satırla geri açılır. */
}

/* ====================================================================== */
/* KVKK ve ÇEREZ POLİTİKASI — metin Afloday'in hukukçularından bekleniyor  */
/* ====================================================================== */
/* Metin gelmeden sayfa üretilmiyor. Boş bir hukuki sayfa, ziyaretçiye
   taahhüt veriyormuş gibi görünüp hiçbir şey söylemediği için sayfanın hiç
   olmamasından kötüdür. Her derlemede uyarı basılıyor ki unutulmasın. */
for (const s of kvkkSayfalari) {
  if (!s.hazir) {
    console.warn(`UYARI  ${s.baslik} üretilmedi — metin Afloday'den bekleniyor (_build/kvkk.mjs).`);
    continue;
  }
  add(s.dosya, layout({
    title: `${s.baslik} — Afloday`,
    desc: s.aciklama,
    current: '', canonical: s.dosya, pad: true,
    body: `
  <section class="section">
    <div class="wrap wrap-narrow">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">Yasal</p>
          <h1 class="h2">${s.baslik}</h1>
        </div>
        <div></div>
        <div class="opener-rule"></div>
      </div>
      <div class="body stack" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        ${s.paragraflar.map(p => `<p>${p}</p>`).join('\n        ')}
      </div>
    </div>
  </section>`,
  }));
}

/* ====================================================================== */
/* 404                                                                    */
/* ====================================================================== */
add('404.html', layout({
  title: 'Sayfa bulunamadı — Afloday',
  desc: 'Aradığınız sayfa bulunamadı. Afloday atölye kataloğuna, kurumsal programlara ya da ana sayfaya dönebilirsiniz.',
  current: '', canonical: '404.html', pad: true,
  body: `
  <section class="section">
    <div class="wrap stack-l" style="min-height:56vh; align-content:center">
      <p class="eyebrow">Hata 404</p>
      <h1 class="d-l">Bu kayıt <em class="em">katalogda</em> yok.</h1>
      <p class="lede">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="index.html">Ana sayfaya dön</a>
        <a class="btn btn-ghost" href="kurumsal-hobi-atolyeleri.html">Etkinlik atölye deneyimleri</a>
      </div>
    </div>
  </section>`,
}));

/* ====================================================================== */
/* SITEMAP + ROBOTS                                                       */
/* ====================================================================== */
{
  const skip = new Set(['404.html']);
  const urls = pages
    .filter(p => p.file.endsWith('.html') && !skip.has(p.file))
    .map(p => p.file === 'index.html' ? '' : p.file);
  const today = new Date().toISOString().slice(0, 10);
  add('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${site.url}/${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === '' ? '1.0' : u.startsWith('atolye-') ? '0.6' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`);
  // Önizleme dağıtımında arama motorları taramasın — müşterinin gerçek
  // sitesiyle rekabet etmesin, link arama sonuçlarına sızmasın.
  add('robots.txt', process.env.PREVIEW === '1'
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
}

/* ======================================================================
   Buraya kadar `pages` dizisi dolduruldu. Dosyaya yazma yalnızca bu betik
   doğrudan çalıştırıldığında yapılıyor; Next.js tarafı aynı diziyi içeri
   aktarıp kendi sayfalarını üretiyor. Böylece içeriğin tek kaynağı var.
   ====================================================================== */

/* Adres eşleme yardımcıları — hem yazıcı hem Next.js kullanıyor */
/* Şablonlardaki iç notlar teslim edilen HTML'de görünmesin — koşullu
   ifadelerin içindekiler dahil tüm yorumlar çıktıdan temizlenir. */
const yorumsuz = (h) => h
  .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
  .replace(/^[ \t]*\r?\n/gm, '');

/* Adres eşleme — canlı afloday.com'daki adresler birebir korunuyor.
   Sayfalar yukarıda eski dosya adlarıyla üretildi; burada hem dosya adı hem
   içerideki bağlantılar canlı adrese çevriliyor. Uzantılar da düşüyor, çünkü
   canlı adreslerin hiçbirinde .html yok (vercel.json → cleanUrls).

   404.html dokunulmadan kalıyor: Vercel onu uzantısıyla arıyor. */
const yeniAd = (dosya) => {
  if (!dosya.endsWith('.html') || dosya === '404.html') return dosya;
  const kok = dosya.slice(0, -5);
  return (canliAdres.get(kok) || kok) + '.html';
};

/* href="x.html" → href="yeni-adres" · index.html kökün kendisi olur */
const baglantilariCevir = (metin) => metin.replace(
  /(href|src)="(?!https?:|\/\/|#|mailto:|tel:)([^"#?]*?)\.html([^"]*)"/g,
  (tam, nitelik, kok, kuyruk) => {
    if (kok.includes('/')) return tam;              // varlık yolları
    if (kok === '404') return tam;
    const hedef = kok === 'index' ? '/' : (canliAdres.get(kok) || kok);
    return `${nitelik}="${hedef}${kuyruk}"`;
  });

/* Mutlak adresler yukarıdaki dönüşümün dışında kalıyor (canonical, og:url,
   sitemap <loc>, JSON-LD). Site kökünü içeren tam adresleri ayrıca eşliyoruz —
   canonical'ın uzantılı kalması Google'a iki ayrı adres gibi görünürdü. */
const mutlakCevir = (metin) => metin.replace(
  new RegExp(`(${site.url.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})/([a-z0-9\\-]+)\\.html`, 'g'),
  (tam, kokAdres, kok) => {
    if (kok === '404') return tam;
    const hedef = kok === 'index' ? '' : (canliAdres.get(kok) || kok);
    return `${kokAdres}/${hedef}`;
  });

/* Next.js'in kullandığı biçim: gövde, meta ve canlı adres ayrı ayrı */
export const sayfalar = pages
  .filter(p => p.file.endsWith('.html') && p.file !== '404.html')
  .map(p => {
    const kok = p.file.slice(0, -5);
    const adres = kok === 'index' ? '' : (canliAdres.get(kok) || kok);
    const tam = baglantilariCevir(mutlakCevir(yorumsuz(p.html)));

    /* Tam belgeden gövdeyi ve meta değerlerini ayır. Next.js <head>'i kendi
       kuruyor, gövdeyi olduğu gibi basıyor — tasarım birebir korunuyor. */
    const al = (re) => (tam.match(re) || [, ''])[1];
    const govde = (tam.match(/<body[^>]*>([\s\S]*?)<\/body>/) || [, ''])[1]
      /* Betik etiketi gövdeden ÇIKARILMALI: Next kabuğu (app/layout.tsx)
         onu kendisi ekliyor. Burada kalırsa sayfada iki kez bulunur ve
         betik iki kez çalışır — dinleyiciler iki kez bağlanıp tıklamayı
         aç-kapa yapar (menü ve akordeon ölü görünür), WebGL ikinci bir
         program kurup konsolu hata yağmuruna tutar.
         `[^"]*` şart: önbellek damgası eklenince adres `afloday.js?v=...`
         oldu ve eski tam-eşleşme deseni tutmayı bıraktı. */
      .replace(/<script src="assets\/js\/afloday\.js[^"]*"[^>]*><\/script>/, '')
      .trim();

    return {
      adres,
      kaynakDosya: p.file,
      govde,
      baslik: al(/<title>([^<]*)<\/title>/),
      aciklama: al(/<meta name="description" content="([^"]*)"/),
      canonical: al(/<link rel="canonical" href="([^"]*)"/),
      ogGorsel: al(/<meta property="og:image" content="([^"]*)"/),
      jsonLd: (tam.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [, ''])[1].trim(),
    };
  });

export const digerDosyalar = pages.filter(p => !p.file.endsWith('.html'));
export { pages };

/* Yalnızca `node _build/build.mjs` ile çağrıldığında dosyaya yaz */
const dogrudanCalistirildi = process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

if (dogrudanCalistirildi) {
  await mkdir(OUT, { recursive: true });

  /* Artık üretilmeyen HTML dosyalarını sil. Üreteç yalnızca yazsaydı,
     kaldırılan sayfalar diskte kalır ve hem önizlemede hem sitemap
     karşılaştırmasında var gibi görünürdü. */
  const uretilen = new Set(pages.map(p => yeniAd(p.file)));
  const eskiler = (await readdir(OUT)).filter(f => f.endsWith('.html') && !uretilen.has(f));
  for (const f of eskiler) await rm(path.join(OUT, f));
  if (eskiler.length) console.log(`${eskiler.length} eski sayfa silindi: ${eskiler.join(', ')}`);

  for (const p of pages) {
    let cikti = p.file.endsWith('.html') ? yorumsuz(p.html) : p.html;
    if (p.file.endsWith('.html')) cikti = baglantilariCevir(cikti);
    if (p.file.endsWith('.html') || p.file.endsWith('.xml')) cikti = mutlakCevir(cikti);
    await writeFile(path.join(OUT, yeniAd(p.file)), cikti, 'utf8');
  }
  const html = pages.filter(p => p.file.endsWith('.html'));
  console.log(`${pages.length} dosya yazıldı (${html.length} HTML sayfa).`);
  console.log(`${canliAdres.size} adres canlı siteyle eşitlendi.`);
}

/* AFLODAY — sayfa kabuğu ve paylaşılan bileşenler. */
import { site, nav, refs, assets } from './data.mjs';
import { oran as gorselOrani, gorselOlculeri } from './gorsel-olculeri.mjs';
import { slug as gorselSlug } from './gorsel-hazirla.mjs';
import { etkinlikGorselleri } from './etkinlik-gorselleri.mjs';
import { atolyeSayisi } from './etkinlikler.mjs';
import { createHash } from 'node:crypto';
import { readFileSync as _oku } from 'node:fs';

/* ÖNBELLEK DAMGASI
   `vercel.json` /assets/* için `max-age=31536000, immutable` veriyor.
   `immutable` tarayıcıya "bir yıl boyunca hiç sorma" demek — ve bu ancak
   adres içerikle birlikte değişiyorsa doğrudur. `afloday.css` adresi hiç
   değişmediği için dönen ziyaretçi YENİ HTML + ESKİ CSS alıyordu; yeni
   bölümler stilsiz kalıp üst üste biniyordu. Ctrl+Shift+R düzeltiyordu,
   ama ziyaretçiden bunu bekleyemeyiz.

   Çözüm: adrese içerik özeti ekleniyor. CSS değişince adres değişiyor,
   tarayıcı yeni dosyayı indiriyor; değişmediyse önbellekten okuyor. */
const damga = (yol) => {
  try { return createHash('md5').update(_oku(yol)).digest('hex').slice(0, 8); }
  catch { return String(Date.now()); }   /* dosya yoksa derlemeyi durdurma */
};
const CSS_DAMGA = damga('site/assets/css/afloday.css');
const JS_DAMGA = damga('site/assets/js/afloday.js');

const PHONE_E164 = { '0216 510 2809': '+902165102809', '0538 490 0727': '+905384900727', '0532 213 4476': '+905322134476' };

/* Menü — afloday.com'un üç seviyeli yapısını taşır.
   Masaüstünde üst madde üzerine gelince açılan panel, mobilde açılır katman. */
function panel(n) {
  if (!n.children) return '';
  const sutun = n.children.map(c => {
    const not = c.not ? `<span class="mega-not">${c.not}</span>` : '';
    if (!c.children) return `<li><a href="${c.href}"><span class="mega-ad">${c.label}</span>${not}</a></li>`;
    return `<li class="mega-grup"><a href="${c.href}"><span class="mega-ad">${c.label}</span>${not}</a>
              <ul>${c.children.map(g => `<li><a href="${g.href}">${g.label}</a></li>`).join('')}</ul>
            </li>`;
  }).join('\n            ');
  return `
      <div class="mega" data-mega>
        <div class="wrap mega-in">
          <div class="mega-lede">
            <p class="eyebrow">${n.label}</p>
            ${n.ozet ? `<p class="mega-ozet">${n.ozet}</p>` : ''}
            <a class="link" href="${n.href}">${n.label} sayfasına git</a>
          </div>
          <ul class="mega-list">
            ${sutun}
          </ul>
        </div>
      </div>`;
}

export function header(current) {
  const items = nav.map(n => {
    const aktif = n.href === current || (n.children || []).some(c => c.href === current
      || (c.children || []).some(g => g.href === current));
    return `<li${n.children ? ' class="has-mega"' : ''}>
          <a href="${n.href}"${aktif ? ' aria-current="page"' : ''}${n.children ? ' aria-haspopup="true" aria-expanded="false"' : ''}>${n.label}</a>${panel(n)}
        </li>`;
  }).join('\n        ');

  return `<header class="hdr">
  <div class="wrap hdr-in">
    <a class="hdr-logo" href="index.html" aria-label="Afloday ana sayfa">
      <img src="assets/img/brand/logo.png" alt="Afloday" width="360" height="120">
    </a>
    <nav class="nav" aria-label="Ana menü">
      <ul>
        ${items}
      </ul>
    </nav>
    <div class="hdr-cta"><a class="btn btn-primary" href="iletisim.html">Teklif Al</a></div>
    <button class="burger" type="button" aria-expanded="false" aria-controls="drawer">
      <i></i><i></i><span class="sr-only">Menüyü aç</span>
    </button>
  </div>
</header>

<div class="drawer" id="drawer" data-open="false" aria-hidden="true">
  <ul>
    ${nav.map(n => {
    if (!n.children) return `<li><a href="${n.href}">${n.label}${n.tag ? ` <span>${n.tag}</span>` : ''}</a></li>`;
    const alt = n.children.map(c => {
      const torun = c.children
        ? `<ul class="drawer-alt2">${c.children.map(g => `<li><a href="${g.href}">${g.label}</a></li>`).join('')}</ul>` : '';
      return `<li><a href="${c.href}">${c.label}</a>${torun}</li>`;
    }).join('');
    return `<li class="drawer-grup" data-acik="false">
      <div class="drawer-satir">
        <a href="${n.href}">${n.label}${n.tag ? ` <span>${n.tag}</span>` : ''}</a>
        <button class="drawer-ac" type="button" aria-expanded="false"><span class="sr-only">${n.label} alt menüsü</span></button>
      </div>
      <div class="drawer-katman"><div><ul class="drawer-alt">${alt}</ul></div></div>
    </li>`;
  }).join('\n    ')}
  </ul>
  <div class="btn-row">
    <a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>
  </div>
  <div class="drawer-foot">
    <p class="eyebrow">İletişim</p>
    <p><a href="tel:${PHONE_E164[site.phones[0]]}">${site.phones[0]}</a></p>
    <p><a href="mailto:${site.email}">${site.email}</a></p>
    <p class="drawer-foot-links">
      <a href="${site.social.instagram}" rel="noopener">Instagram</a>
      <a href="${site.social.youtube}" rel="noopener">YouTube</a>
      <a href="ik.html">İnsan Kaynakları</a>
    </p>
  </div>
</div>`;
}

/* Alt bilgi — başlıklar afloday.com'un footer'ındaki başlıklarla aynı:
   "İletişim Bilgileri", "Takip Edeyim", "Bir 'TIK' Yakındayız". */
export function footer() {
  return `<footer class="ftr">
  ${/* KAPANIŞ ÇAĞRISI KALDIRILDI — Ceylan hanım, 7 Ağustos:
       "Footer'da bir tık yakındayız kısmı çıkacak, butonlar kalkacak,
        iletişim formu da çıkacak. İletişim, yol tarifi ve takip kalacak.
        İnsan kaynakları da kalıyor."

       Alt bilgi bir kapanış afişi değil, bir künye. Formun yeri iletişim
       sayfası; footer'da ikinci kez sorulması gerekmiyor. */ ''}

  <div class="ftr-main">
    <div class="wrap ftr-cols">
      <div class="stack">
        <div class="ftr-logo"><img src="assets/img/brand/logo.png" alt="Afloday" width="360" height="120"></div>
        <p class="ftr-head">İletişim Bilgileri</p>
        <ul>
          ${site.phones.map(p => `<li><a href="tel:${PHONE_E164[p]}">${p}</a></li>`).join('\n          ')}
          <li><a href="mailto:${site.email}">${site.email}</a></li>
        </ul>
        <address>
          ${site.address.street},<br>
          ${site.address.zip} ${site.address.locality} / ${site.address.region}
        </address>
        <p><a class="link" href="${assets.maps}" rel="noopener">Yol tarifi için tıklayın</a></p>
      </div>
      <!-- Sütun başlıkları menünün ana dallarını izliyor; iptal edilen
           atölye kataloğu bağlantıları kalktı. -->
      <div>
        <p class="ftr-head">Geleceği Doğadan Tasarla</p>
        <ul>
          <li><a href="proje-gelecegi-yesil-tasarla.html">Geleceği Doğadan Tasarla Hareketi</a></li>
          <li><a href="proje-gelecegi-yesil-tasarla.html#cevre">Çevre · Toprak</a></li>
          <li><a href="proje-gelecegi-yesil-tasarla.html#kadin">Kadın · Su</a></li>
          <li><a href="proje-gelecegi-yesil-tasarla.html#cocuk">Çocuk · Ateş</a></li>
          <li><a href="proje-gelecegi-yesil-tasarla.html#is-dunyasi">İş Dünyası · Hava</a></li>
          <li><a href="doga-temelli-egitimler.html">Doğa Temelli Eğitimlerimiz</a></li>
        </ul>
      </div>
      <div>
        <p class="ftr-head">Kurumsal Hizmetler</p>
        <ul>
          <li><a href="kurumsal.html#deneyimsel-ogrenme">Doğadan Deneyimsel Öğrenme Atölyeleri</a></li>
          <li><a href="kurumsal-hobi-atolyeleri.html">Doğadan Etkinlik Atölye Deneyimleri</a></li>
          <li><a href="sosyal-sorumluluk-is-danismanligi.html">Sosyal Sorumluluk &amp; İş Danışmanlığı</a></li>
          <li><a href="hakkimizda.html">Afloday Hakkında</a></li>
          <li><a href="hakkimizda.html#ekip">Ekibimiz</a></li>
          <li><a href="surdurulebilirlik.html">Sürdürülebilirlik</a></li>
        </ul>
        <p class="ftr-head" style="margin-top:var(--s5)">Takip Edeyim</p>
        <ul>
          <li><a href="${site.social.instagram}" rel="noopener">instagram.com/afloday</a></li>
          <li><a href="${site.social.youtube}" rel="noopener">youtube.com/afloday</a></li>
          <li><a href="ik.html">İnsan Kaynakları</a></li>
        </ul>
      </div>
    </div>
    <div class="wrap ftr-base">
      <span>© <span data-year>2026</span> ${site.legal}</span>
      <!-- Sağdaki yuva eskiden ByFlash Agency imzasının yeriydi. Şimdilik
           boş: site.tagline buraya konunca "Doğadan Gelişim Atölyesi"
           telif satırında zaten geçtiği için iki kez yazılıyordu.
           Geliştirici imzası eklenecekse yeri burası.
           NOT: bu blok bir şablon dizesinin içinde, yorumda ters tırnak
           kullanma — dizeyi kapatıp derlemeyi kırıyor. -->
    </div>
  </div>
</footer>`;
}

/* Folyo levhası hero — katalog sayfası olarak açılış.
   Fotoğraf paspartu içinde monte edilir; altında Fig. künyesi, sonra başlık.
   `index` hero içindeki gerçek içerik: kataloğa açılan numaralı minik levhalar. */
/* Video hero — kendi sunucumuzda barındırılan sessiz döngü.
   `lines` sağ alttaki iş kolu satırları; `kicker` üst künye. */
export function heroVideo({ kicker, heading, lede, cta, lines = [], video, poster, posterAlt, asagi = '#tanitim' }) {
  return `<section class="hero-video" data-mode="video">
    <div class="hero-video-media">
      <img src="${poster}" alt="${posterAlt}" width="1920" height="1080" fetchpriority="high">
      <video muted loop playsinline preload="none" poster="${poster}" aria-hidden="true" tabindex="-1">
        <source src="${video}" type="video/mp4">
      </video>
    </div>

    <div class="wrap hero-video-copy">
      <p class="hero-video-top">${kicker}</p>
      <h1>${heading}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      <div class="btn-row" style="align-items:center">
        ${cta}
        <button class="hero-play" type="button" data-play-video>Filmi oynat</button>
      </div>
      ${lines.length ? `<div class="hero-video-lines">
        ${lines.map(([k, v]) => `<p><b>${k}</b>${v}</p>`).join('\n        ')}
      </div>` : ''}
    </div>

    <a class="hero-in" href="${asagi}" aria-label="Aşağı kaydır"><span></span></a>
  </section>`;
}

/* Künye defteri — atölye kataloğu. Kart ızgarası yerine sütunlu örnek kaydı. */
export function ledger(rows) {
  return `<div class="ledger">
        <div class="ledger-head">
          <span></span><span>Ad</span><span>Tür</span><span>Biçim</span><span>Katılım</span>
        </div>
        ${rows.map(r => `<a class="ledger-row" href="${r.href}">
          <span class="ledger-shot"><img src="${r.img}" alt="${r.alt}" loading="lazy" width="900" height="900"></span>
          <span class="ledger-main">
            <span class="ledger-name">${r.name}</span>
            <span class="ledger-note">${r.note}</span>
          </span>
          <span class="ledger-cell ledger-code"><b>Tür</b>${r.code}</span>
          <span class="ledger-cell"><b>Biçim</b>${r.mode}</span>
          <span class="ledger-cell"><b>Katılım</b>${r.who}</span>
        </a>`).join('\n        ')}
      </div>`;
}

/* Folyo başlığı — iç sayfalar için tipografi öncülüğünde açılış.
   Fotoğraf arşivi tam-taşan için yeterli çözünürlükte olmadığından, iç sayfalar
   görselle değil ölçekle açılır. Bu aynı zamanda sayfalar arası ritim farkı yaratır. */
export function folio({ eyebrow, plateNo, lines, lede, buttons = '', meta = [], size = 'd-xl' }) {
  const heading = lines.map(l => `<span class="line"><span>${l}</span></span>`).join('\n        ');
  return `<section class="folio">
    <div class="wrap">
      <p class="folio-top" data-reveal><span>${eyebrow}</span><span>${plateNo}</span></p>
      <div class="folio-grid">
        <div class="stack-l" data-reveal>
          <h1 class="${size}">
        ${heading}
          </h1>
          ${lede ? `<p class="lede">${lede}</p>` : ''}
          ${buttons ? `<div class="btn-row">${buttons}</div>` : ''}
        </div>
        <div class="folio-side" data-reveal style="--d:120ms">
          ${meta.length ? `<dl class="meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

/* Tam taşan görsel kırılımı — bölümler arası nefes ve ölçek değişimi */
export function bleed({ images, quote, cite }) {
  return `<figure class="bleed" style="margin:0">
    <div class="bleed-media">
      ${images.map(([src, alt]) =>
    `<img src="${src}" alt="${alt}" loading="lazy" width="900" height="900">`).join('\n      ')}
    </div>
    ${quote ? `<figcaption class="bleed-copy"><div class="wrap">
      <blockquote>${quote}</blockquote>
      ${cite ? `<figcaption>${cite}</figcaption>` : ''}
    </div></figcaption>` : ''}
  </figure>`;
}

/* Anasayfa slaydı — hero'nun hemen altında dönen kareler.
   Kareler sitedeki gerçek sayfalara açılıyor, başlıklar veri dosyasından geliyor;
   slayta özel yazılmış metin yok. Numaralandırma süsleme değil: kaçıncı karede
   olunduğunu söylüyor, yani gerçekten sıra bilgisi taşıyor.
   Otomatik geçiş üzerine gelince ve odaklanınca duruyor, duraklatma düğmesi var
   (hareketli içerik için erişilebilirlik gereği). Azaltılmış hareket tercihinde
   geçiş hiç başlamıyor, kareler yine düğmelerle gezilebiliyor. */
export function slayt(slides) {
  const iki = (n) => String(n).padStart(2, '0');
  return `<section class="slayt" data-slayt aria-roledescription="slayt" aria-label="Atölye ve programlardan kareler">
    <div class="wrap">
      <div class="slayt-sahne">
        ${slides.map(({ href, img, alt, tur, ad }, i) => `<a class="slayt-kare" href="${href}" data-aktif="${i === 0 ? 'evet' : 'hayir'}"${i ? ' aria-hidden="true" tabindex="-1"' : ''}>
          <img src="${img}" alt="${alt}" width="1600" height="900"${i ? ' loading="lazy"' : ''}>
          <span class="slayt-etiket">
            <b>${tur}</b>
            <span>${ad}</span>
          </span>
        </a>`).join('\n        ')}
      </div>

      <div class="slayt-alt">
        <p class="slayt-sayac"><b data-slayt-no>${iki(1)}</b><span>/ ${iki(slides.length)}</span></p>
        <div class="slayt-cetel">
          ${slides.map((s, i) => `<button type="button" data-slayt-git="${i}" aria-label="${i + 1}. kare: ${s.ad}"${i === 0 ? ' aria-current="true"' : ''}><span></span></button>`).join('\n          ')}
        </div>
        <button class="slayt-duraklat" type="button" data-slayt-duraklat aria-pressed="false">Duraklat</button>
      </div>
    </div>
  </section>`;
}

/* Anasayfa slaydı — cam kırılması geçişi.
   Tasarım kaynağı: 21st.dev · lumina-interactive-list (docs/referans/Not.md).
   Kaynağın düzeni ve sınıf adları birebir korunuyor:

     .slider-wrapper      tam kaplayan sahne
       .webgl-canvas      cam geçişinin çizildiği katman
       .slide-number      sıra sayacı (01)
       .slide-total       toplam (03)
       .slide-content     ortada başlık + açıklama
       .slides-navigation altta her slayt için ilerleme çizgisi ve adı

   Bizde değişenler ve gerekçeleri:
   · THREE + GSAP CDN'den ~650 KB inmiyor. Efektin tamamı tek bir fragment
     shader; shader kaynaktakiyle birebir, düz WebGL ile çiziliyor. Görünen
     sonuç aynı, eklenen ağırlık sıfır. (Karar zaten planın Faz 1b'sinde.)
   · 6 demo görseli yerine belgedeki 3 Afloday slaydı.
   · Kaynakta yalnız başlık + açıklama var; belge her slayt için üst etiket ve
     buton da veriyor, onlar da aynı dilde yerleştirildi.
   · Siyah/altın/Cormorant yerine Afloday paleti ve Newsreader + Jost.
   · Duraklat düğmesi, ok tuşları, azaltılmış hareket desteği eklendi.
   · WebGL yoksa CSS daire açılımı devralıyor.

   Video hero yukarıda olduğu gibi duruyor; bu bölüm onun altında.
   Metin görselin üzerinde — müşterinin açık isteği.

   Başlıklar H1 değil. Belge her slayt için "Ana Başlık (H1)" diyor ama sayfanın
   H1'i yukarıdaki video hero'da duruyor ve bir sayfada tek H1 olur. Slayt
   başlıkları H2; görünüş aynı, belge düzeni bozulmuyor. */
export function heroSlayt(slaytlar) {
  const iki = (n) => String(n).padStart(2, '0');

  /* Harf harf açılım — kaynaktaki splitText'in karşılığı. Gecikme CSS'te
     --i ile hesaplanıyor, GSAP'a gerek kalmıyor. Görünen metin aria'dan
     gizli: ekran okuyucu 40 ayrı harf yerine cümleyi bir kez okusun.

     Harfler kelimelere sarılıyor: her harf tek başına inline-block olsaydı
     tarayıcı iki harf arasından satır bölebilirdi ve uzun Türkçe başlıklar
     kelime ortasından kırılıyordu ("Ka / lıcı"). Kelime kabuğu nowrap,
     aralarında gerçek boşluk var; satır yalnız kelime aralarında bölünüyor. */
  const kacir = (h) => (h === '<' ? '&lt;' : h === '&' ? '&amp;' : h);
  const harfle = (metin) => {
    let n = 0;
    return metin
      .split(' ')
      .map((kelime) =>
        `<span class="slide-title-kelime">${[...kelime]
          .map((h) => `<span class="slide-title-harf" style="--i:${n++}">${kacir(h)}</span>`)
          .join('')}</span>`,
      )
      .join(' ');
  };

  /* Odak noktası hem CSS geri düşüşüne (object-position) hem shader'a
     (data-odak) veriliyor; iki katman aynı kırpmayı yapsın. */
  const kare = (s, i) => `<div class="slide-media-kare" data-aktif="${i === 0 ? 'evet' : 'hayir'}"
          data-odak="${(s.odak || [50, 50]).join(',')}">
          ${resim({ gorsel: s.gorsel, alt: s.alt, oncelik: i === 0, odak: s.odak })}
        </div>`;

  const kopya = (s, i) => {
    const baslik = `<span class="sr-only">${s.baslik}</span><span aria-hidden="true">${harfle(s.baslik)}</span>`;
    const butonlar = [s.birincilButon, s.ikincilButon].filter(Boolean);
    return `<div class="slide-copy" data-aktif="${i === 0 ? 'evet' : 'hayir'}"${i ? ' aria-hidden="true"' : ''}>
            <p class="slide-eyebrow">${s.etiket}</p>
            <h2 class="slide-title">${baslik}</h2>
            <p class="slide-description">${s.altBaslik}</p>
            ${butonlar.length
        ? `<div class="slide-actions">
              ${butonlar.map((b, n) => `<a class="btn ${n === 0 ? 'btn-primary' : 'btn-ghost'}" href="${b.href}"${i ? ' tabindex="-1"' : ''}>${b.yazi}</a>`).join('\n              ')}
            </div>`
        : ''}
          </div>`;
  };

  return `<section class="slider-wrapper" data-hslayt aria-roledescription="slayt"
      aria-label="Afloday hizmet hatları">
    <canvas class="webgl-canvas" data-hslayt-tuval aria-hidden="true"></canvas>

    <!-- Geri düşüş katmanı: WebGL çalışırsa gizleniyor, çalışmazsa
         geçişi CSS daire açılımı devralıyor. -->
    <div class="slide-media">
      ${slaytlar.map(kare).join('\n      ')}
    </div>
    <div class="slide-scrim" aria-hidden="true"></div>

    <span class="slide-number" data-hslayt-no>${iki(1)}</span>
    <span class="slide-total">${iki(slaytlar.length)}</span>

    <div class="slide-content">
      <div class="wrap">
        <div class="slide-copies">
          ${slaytlar.map(kopya).join('\n          ')}
        </div>
      </div>
    </div>

    <nav class="slides-navigation" aria-label="Slayt seçimi">
      <div class="wrap slides-navigation-in">
        ${slaytlar.map((s, i) => `<button class="slide-nav-item" type="button" data-hslayt-git="${i}"${i === 0 ? ' aria-current="true"' : ''}>
          <span class="slide-progress-line"><span class="slide-progress-fill"></span></span>
          <span class="slide-nav-title">${s.etiket}</span>
        </button>`).join('\n        ')}
        <button class="slide-pause" type="button" data-hslayt-duraklat aria-pressed="false">Duraklat</button>
      </div>
    </nav>
  </section>`;
}

/* Sürekli akan referans şeridi */
export function marquee(limit = 30) {
  return `<div class="marquee" aria-label="Birlikte çalıştığımız kurumlar">
      <div class="marquee-track">
        ${refs.slice(0, limit).map(([f, name]) =>
    `<img src="assets/img/logos/${f}.png" alt="${name}" loading="lazy" width="240" height="98">`
  ).join('\n        ')}
      </div>
    </div>`;
}

export function logoWall(limit = 20) {
  return `<div class="logos">
        ${refs.slice(0, limit).map(([f, name]) =>
    `<div><img src="assets/img/logos/${f}.png" alt="${name}" loading="lazy" width="240" height="98"></div>`
  ).join('\n        ')}
      </div>`;
}

/* Atölye galerisi — afloday.com'un o sayfada kullandığı fotoğrafların tamamı.
   Orijinal sayfalarda 10–20 karelik galeriler var; hepsi buraya taşınır.
   Tıklanınca tam ekran ışık kutusu açılır (afloday.js). */
/* HİZALI SATIR — fotoğrafları doğal oranlarıyla, kırpmadan dizer.

   Bir satırdaki kareler AYNI YÜKSEKLİKTE, genişlikleri kendi oranlarına
   göre. Hepsi h yüksekliğindeyse toplam genişlik h × Σoran olur, yani
   satırın oranı Σoran'dır. `aspect-ratio` bu toplamı alınca yükseklik
   kendiliğinden çıkıyor; her kare `flex-grow` olarak kendi oranını alıyor.

   Sonuç: kırpma sıfır, sol ve sağ kenar düz. Aynı matematik
   `etkinlik-tasarim.mjs` içindeki mozaik bandında da kullanılıyor.

   Neden gerekti: galeri ızgarası her fotoğrafı 4/5'e sokup `cover` ile
   kesiyordu. Havuz çift tepeli (dikey ve yatay karışık), tek oran
   dayatınca ortalama dörtte biri gidiyordu. */
export function hizaliSatir(kaynaklar, hedefSayidaKare = 3) {
  const anahtar = (src) => src.replace(/^assets\/img\//, '')
    .replace(/^rev2\//, '').replace(/\.(jpe?g|png|webp)$/i, '');
  const kayitlar = kaynaklar.map((src) => {
    const a = anahtar(src);
    const o = gorselOlculeri[a];
    /* width/height öznitelikleri düzen kaymasını (CLS) önlüyor;
       `verify.mjs` eksikse hata veriyor. Ölçü bilinmiyorsa 3:2 varsay. */
    return { src, oran: gorselOrani(a), en: o ? o[0] : 1200, boy: o ? o[1] : 800 };
  });

  /* Satırlara böl: her satır hedefe yakın sayıda kare taşısın, ama
     dikey fotoğraf çok yer kaplamasın diye orana göre denge kur. */
  const satirlar = [];
  let birikim = [];
  for (const k of kayitlar) {
    birikim.push(k);
    const toplam = birikim.reduce((a, x) => a + x.oran, 0);
    /* Yatay fotoğraflar hızlı doldurur, dikeyler yavaş; eşik oranla ölçülüyor */
    if (toplam >= hedefSayidaKare * 1.15 || birikim.length >= hedefSayidaKare + 1) {
      satirlar.push(birikim); birikim = [];
    }
  }
  if (birikim.length) satirlar.push(birikim);
  return satirlar;
}

/* "Galeri sayfasını kapatabiliriz" iki yeri kapsıyordu ve ikisi de
   kapatıldı: `/galeri` sayfası ve anasayfadaki galeri vitrini.
   Sayfa içindeki etkinlik kareleri KALIYOR — belgede de öyle geçiyor.

   Bu bölümdeki düzeltme kırpmaydı: sabit 4/5 çerçeve her fotoğrafı
   kesiyordu, hizalı satıra geçildi, kırpma sıfırlandı. */
export function galeriBolumu(images, ad) {
  if (!images.length) return '';
  /* Işık kutusu tam boy sürümü kullanıyor. Koruncuk kareleri 7 Ağustos'ta
     eski siteden tam boyutta alındı; artık `s` sonekli küçük hâl yok. */
  const tam = (src) => src.replace('/afloday/0/', '/afloday/tam/').replace(/s\.jpg$/i, '.jpg');
  const satirlar = hizaliSatir(images);
  let no = 0;

  const govde = satirlar.map((satir) => {
    const toplam = satir.reduce((a, x) => a + x.oran, 0);
    return `<div class="gs-satir" style="aspect-ratio:${toplam.toFixed(3)}">
          ${satir.map((k) => {
    no++;
    return `<button class="galeri-hucre" type="button" style="flex:${k.oran.toFixed(3)} 1 0"
            data-full="${tam(k.src)}" data-no="${String(no).padStart(2, '0')}"
            aria-label="${ad} — ${no}. fotoğrafı büyüt">
            <img src="${k.src}" alt="${ad} atölyesinden kare ${no}" loading="lazy" decoding="async" width="${k.en}" height="${k.boy}">
          </button>`;
  }).join('\n          ')}
        </div>`;
  }).join('\n        ');

  return `
  <section class="section rule-top">
    <div class="wrap">
      ${/* Açıklama cümlesi yoktu: ne belgede ne canlı sitede geçiyor. */ ''}
      ${opener('Atölyeden', 'Kareler', '')}
      <div class="galeri-serit" data-lightbox style="margin-top:clamp(32px,4vw,56px)">
        ${govde}
      </div>
    </div>
  </section>`;
}

/* Işık kutusu kabuğu — sayfada galeri varsa gövdenin sonuna eklenir */
export function lightbox() {
  return `<div class="lb" id="lb" hidden aria-hidden="true" role="dialog" aria-label="Görsel Büyütme Modalı">
  <div class="lb-header">
    <span class="lb-caption" id="lb-caption">Afloday Galeri</span>
    <span class="lb-sayac" id="lb-sayac">01 / 21</span>
    <button class="lb-kapat" type="button" aria-label="Galeriyi kapat"><span>Kapat &times;</span></button>
  </div>
  <div class="lb-stage">
    <button class="lb-onceki" type="button" aria-label="Önceki fotoğraf"><span>&larr;</span></button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="1600" height="1200">
    </div>
    <button class="lb-sonraki" type="button" aria-label="Sonraki fotoğraf"><span>&rarr;</span></button>
  </div>
</div>`;
}

/* 4 Ağustos belgesinin görselleri — gorsel-hazirla.mjs bunları
   assets/img/rev2/ altına WebP ve JPG olarak yazıyor. Veri dosyalarında
   kaynak dosya adı duruyor (belgede o adla geçiyor), yol burada kuruluyor.

   `boy` yalnızca yer ayırmak için; gerçek oran korunduğu için çerçeveleme
   CSS'teki object-fit ile yapılıyor. */
export function resim({ gorsel, alt, klasor = 'secilmis', sinif = '', kucuk = false, oncelik = false, odak = null }) {
  const s = `assets/img/rev2/${klasor}/${gorselSlug(gorsel)}`;
  const genislik = kucuk ? 800 : 1600;
  /* Alt metin boşsa görsel süstür: ekran okuyucu atlasın diye açıkça
     işaretleniyor. Denetim (verify.mjs) işaretsiz boş alt'ı hata sayıyor. */
  const dekor = !alt ? ' role="presentation"' : '';
  /* Odak noktası: object-fit:cover kırparken neyin korunacağı. */
  const konum = odak ? ` style="object-position:${odak[0]}% ${odak[1]}%"` : '';
  return `<picture${sinif ? ` class="${sinif}"` : ''}>
            <source type="image/webp" srcset="${s}-800.webp 800w, ${s}.webp 1600w"
                    sizes="${kucuk ? '(max-width: 900px) 100vw, 50vw' : '100vw'}">
            <img src="${s}.jpg" alt="${alt}"${dekor}${konum} width="${genislik}" height="${Math.round(genislik * 0.667)}"
                 ${oncelik ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}>
          </picture>`;
}

function kategoriGalerisi(k) {
  const hepsi = etkinlikGorselleri[k.id] || [];
  const kareler = hepsi.filter((g) => !g.kapak);
  if (!kareler.length) return '';
  return `
            <div class="akordeon-galeri">
              <p class="eyebrow">${k.ad} · ${hepsi.length} kare</p>
              <div class="galeri" data-lightbox>
                ${kareler.map((g, i) => `<button class="galeri-hucre" type="button"
                  data-full="assets/img/rev2/${g.slug}.jpg"
                  data-no="${String(i + 1).padStart(2, '0')}"
                  aria-label="${k.ad} — ${i + 1}. fotoğrafı büyüt">
                  <img src="assets/img/rev2/${g.slug}-800.webp" alt="${k.ad} kapsamındaki atölyelerden kare ${i + 1}"
                       loading="lazy" width="800" height="800">
                </button>`).join('\n                ')}
              </div>
            </div>`;
}

/* SONSUZ KAYAN GALERİ ŞERİDİ
   Tasarım kullanıcıya ait: iki satır, ters yönlerde kesintisiz akış,
   kartın üzerine gelince duraklama ve büyüme, alt köşede levha rozeti.
   Düzen ve his korundu; beş kusur giderildi.

   1 · KATEGORİ ETİKETLERİ KALKTI. `getGaleriKategori` fotoğrafları sıra
       numarasına göre "Kurumsal Eğitim / Atölye Deneyimi / Doğadan Kareler"
       diye etiketliyordu. Bu adlar ne 4 Ağustos belgesinde ne afloday.com'da
       geçiyor; üstelik hangi karenin hangi kategoriye ait olduğu hiçbir
       kaynakta yazmıyor, index'e göre atanıyordu. Rozette levha numarası
       kaldırıldı; kart artık tamamen fotoğraf. Sıra bilgisi ışık kutusunun
       sayacında zaten var (`data-no` özniteliği duruyor, oradan okunuyor).

   2 · KOPYALAR IŞIK KUTUSUNDAN AYRILDI. Kesintisiz döngü için dizi iki kez
       basılıyor; ışık kutusu 21 yerine 42 kart sayıyordu, sayaç "5 / 42"
       diyor ve ok tuşları aynı fotoğrafı iki kez geziyordu. Kopyalar artık
       `data-kopya` taşıyor: ekran okuyucudan ve sekme sırasından çıkarıldı,
       ışık kutusu da onları atlıyor.

   3 · DURAKLAT DÜĞMESİ EKLENDİ. Hareket 36 saniye sürüyor ve yalnız fareyle
       duruyordu; klavye ve dokunmatikte durdurmanın yolu yoktu (WCAG 2.2.2).

   4 · ODAK HALKASI GERİ GELDİ — CSS'te `outline:none` vardı.

   5 · BAŞLIK METNİ KAYNAĞA ÇEKİLDİ. "Sonsuz Kayan Galeri Arşivi" ve
       "Fare ile üzerine gelince..." uydurmaydı; ikincisi ayrıca yalnız fare
       kullananı anlatıyordu. Yerine belgedeki sayfa adı ve kare sayısı. */

/* `oncelik` — şeridin ilk kartları hemen yüklenir.
   Sonsuz şeritte `loading="lazy"` tek başına yetmiyor: kartlar yatayda
   kayarken görüş alanına girdikçe yükleniyor, kullanıcı boş kutuların
   geçtiğini görüyor. Ölçüldü: bölüme kaydırdıktan sonra bile 42 karttan
   yalnız 6'sı yüklüydü, birincisi hiç yüklenmemişti. */
const galeriKart = (g, no, kopya, oncelik = false) => `<button class="slider-card" type="button"
            data-full="assets/img/rev2/${g.slug}.jpg"
            data-no="${no}"${kopya ? ' data-kopya aria-hidden="true" tabindex="-1"' : ''}
            aria-label="${no}. fotoğrafı büyüt">
            <span class="slider-card-media">
              <img src="assets/img/rev2/${g.slug}-800.webp" alt="Afloday arşivinden kare ${no}"
                   decoding="async"
                   loading="${oncelik ? 'eager' : 'lazy'}" width="600" height="750">
            </span>
          </button>`;

/* Bir şerit: kareler iki kez basılır, ikinci tur kopya işaretli.
   `-50%` kaydırması tam bir tur demek, o yüzden kopya sayısı birebir olmalı. */
function sonsuzSerit(kareler, { yon = 'left', ilk = 0 } = {}) {
  const iki = (n) => String(n).padStart(2, '0');
  /* 1440px'te 250px'lik kartlardan ~6 tanesi görünüyor; 8 kart güvenli pay. */
  const tur = (kopya) => kareler
    .map((g, i) => galeriKart(g, iki(ilk + i + 1), kopya, !kopya && i < 8)).join('\n        ');
  return `<div class="infinite-slider-wrapper">
      <div class="infinite-slider-track track-${yon}">
        ${tur(false)}
        ${tur(true)}
      </div>
    </div>`;
}

const durdurDugmesi = `<button class="galeri-durdur" type="button" data-galeri-durdur aria-pressed="false">
        <span data-durdur-metin>Duraklat</span>
      </button>`;

/* ANASAYFA VİTRİNİ — tek satır, /galeri'ye açılan tanıtım */
export function homeGaleriVitrin(kareler) {
  return `<div class="galeri-infinite-app" data-galeri-app data-lightbox>
    <div class="galeri-bar">
      <p class="eyebrow" style="margin:0">Galeri</p>
      ${durdurDugmesi}
    </div>
    ${sonsuzSerit(kareler, { yon: 'left' })}
  </div>`;
}

/* /galeri SAYFASI — iki satır, ters yönlerde */
export function awwwardsGaleri(kareler) {
  const yarisi = Math.ceil(kareler.length / 2);
  /* `galeri-sayfa-serit` tempoyu 36s'den 72s'ye indiriyor (CSS). */
  return `<div class="galeri-infinite-app galeri-sayfa-serit" data-galeri-app data-lightbox>
    <div class="galeri-bar" data-reveal>
      <p class="eyebrow" style="margin:0">Galeri</p>
      ${durdurDugmesi}
    </div>
    ${sonsuzSerit(kareler.slice(0, yarisi), { yon: 'left', ilk: 0 })}
    ${sonsuzSerit(kareler.slice(yarisi), { yon: 'right', ilk: yarisi })}
  </div>`;
}

/* GENİŞLEYEN ŞERİT — 21st.dev `gallery-animation` uyarlaması.
   Mekanik kaynaktakiyle aynı: paneller eşit paylaşır, birinin üzerine
   gelince o `flex:2`ye çıkar, komşuları `flex:.5`e iner; üzerinde
   olunmayan panel koyu perdeyle geride durur.

   Uyarlama, hero slaydında yaptığımızın aynısı:
   · framer-motion yok — geçiş CSS `flex-grow` ile, bağımlılık eklenmiyor
   · `rounded-md` yok — köşe yuvarlaması tasarım dilinde yasak
   · hover JS'e bağlı değil, `:hover` seçicisiyle; klavye için `:focus-within`
   · dokunmatikte hover olmadığı için dar ekranda ızgaraya düşüyor (CSS)

   Kaynak 4 görsel için tasarlanmış; 21 kareyi tek satıra dizmek her paneli
   ekranın %4'üne indiriyordu. Bu yüzden `satir` kadar parçaya bölünüyor. */
export function genisleyenSerit(kareler, { satir = 7, altYazi = 'Afloday atölyelerinden kare' } = {}) {
  const parcalar = [];
  for (let i = 0; i < kareler.length; i += satir) parcalar.push(kareler.slice(i, i + satir));

  return `<div class="serit-yigin" data-lightbox>
        ${parcalar.map((parca, p) => `<div class="serit">
          ${parca.map((g, i) => {
    const no = p * satir + i + 1;
    return `<button class="serit-panel" type="button"
            data-full="assets/img/rev2/${g.slug}.jpg"
            data-no="${String(no).padStart(2, '0')}"
            aria-label="${no}. fotoğrafı büyüt">
            <img src="assets/img/rev2/${g.slug}-800.webp" alt="${altYazi} ${no}"
                 loading="lazy" width="800" height="800">
          </button>`;
  }).join('\n          ')}
        </div>`).join('\n        ')}
      </div>`;
}

export function akordeon(kategoriler, { idOn = 'ak' } = {}) {
  const iki = (n) => String(n).padStart(2, '0');

  const oge = (k, i) => {
    const id = `${idOn}-${k.id}`;
    /* Sayaç `etkinlikler.mjs`ten geliyor; başlık ile sayfa künyesinin
       ayrışmaması için ikisi de aynı yardımcıyı kullanıyor. */
    const sayi = atolyeSayisi(k);
    const olcu = sayi ? `${sayi} atölye` : '';

    const giris = k.giris.map((p) => `<p>${p}</p>`).join('\n              ');

    const bilim = k.bilim
      ? `<div class="akordeon-bilim">
              <p class="eyebrow">${k.bilim.baslik}</p>
              <ul>${k.bilim.maddeler.map((m) => `<li>${m}</li>`).join('\n                  ')}</ul>
            </div>`
      : '';

    const liste = sayi
      ? `<ol class="atolye-liste">
              ${k.atolyeler.map((a, j) => `<li class="atolye">
                <p class="atolye-no">${iki(j + 1)}</p>
                <div class="atolye-govde">
                  <h4 class="atolye-ad">${a.ad}</h4>
                  <p class="atolye-metin">${a.metin}</p>
                </div>
              </li>`).join('\n              ')}
            </ol>`
      : '';

    /* Gönüllülükte atölyeler tek tek anlatılmıyor, belgede tek satırda
       sayılıyor. Uydurma açıklama yazmak yerine olduğu gibi listeleniyor. */
    const uygulanabilir = k.uygulanabilir
      ? `<div class="akordeon-uygulanabilir">
              <p class="eyebrow">${k.uygulanabilirEtiketi}</p>
              <ul>${k.uygulanabilir.map((a) => `<li>${a}</li>`).join('\n                  ')}</ul>
            </div>`
      : '';

    return `<section class="akordeon-oge" data-acik="${i === 0 ? 'true' : 'false'}">
        <h3 class="akordeon-baslik">
          <button class="akordeon-dugme" type="button" id="${id}-bas" aria-expanded="${i === 0}" aria-controls="${id}">
            <span class="akordeon-no">${iki(i + 1)}</span>
            <span class="akordeon-ad">${k.ad}</span>
            ${olcu ? `<span class="akordeon-olcu">${olcu}</span>` : '<span></span>'}
            <span class="akordeon-isaret" aria-hidden="true"></span>
          </button>
        </h3>
        <div class="akordeon-govde" id="${id}" role="region" aria-labelledby="${id}-bas">
          <div class="akordeon-ic">
            <div class="akordeon-giris">
              ${k.girisEtiketi ? `<p class="eyebrow">${k.girisEtiketi}</p>` : ''}
              ${giris}
              ${bilim}
              ${uygulanabilir}
            </div>
            <figure class="akordeon-kapak">
              ${resim({ gorsel: k.gorsel, alt: k.alt, klasor: 'etkinlik', kucuk: true })}
            </figure>
            ${liste}
            ${kategoriGalerisi(k)}
          </div>
        </div>
      </section>`;
  };

  return `<div class="akordeon" data-akordeon>
      ${kategoriler.map(oge).join('\n      ')}
    </div>`;
}

/* Bölüm açılış bandı — sitedeki her ana bölüm bu diziyle başlar */
export function opener(eyebrow, heading, lede) {
  return `<div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">${eyebrow}</p>
          <h2 class="h2">${heading}</h2>
        </div>
        ${lede ? `<p class="lede">${lede}</p>` : '<div></div>'}
        <div class="opener-rule"></div>
      </div>`;
}

/* Örnek levhası — imza bileşeni */
export function plate({ href, img, alt, code, tag, name, note, dl, ratio = '' }) {
  const rows = dl ? `<dl class="dl">${dl.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
  return `<a class="plate" href="${href}" data-reveal="stagger">
          <div class="plate-frame${ratio ? ' ' + ratio : ''}">
            <img src="${img}" alt="${alt}" loading="lazy" width="900" height="900">
          </div>
          <div class="plate-label">
            <p class="plate-acc"><span>${code}</span><span>${tag}</span></p>
            <h3 class="plate-name">${name}</h3>
            ${note ? `<p class="plate-note">${note}</p>` : ''}
            ${rows}
          </div>
        </a>`;
}

/* Kurumun kimlik düğümü — her sayfada `publisher` olarak geçiyor.
   Arama motoru bunu tek varlık olarak birleştiriyor; sayfa başına ayrı
   Organization yazmaktansa `@id` ile aynısına işaret ediyoruz. */
const KURUM_ID = () => `${site.url}/#kurum`;

function varsayilanSema({ title, desc, canonical }) {
  const yol = canonical.replace(/\/$/, '');
  const kirinti = [{ '@type': 'ListItem', position: 1, name: 'Anasayfa', item: `${site.url}/` }];
  if (yol) kirinti.push({ '@type': 'ListItem', position: 2, name: title.split('—')[0].trim(), item: `${site.url}/${yol}` });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', '@id': KURUM_ID(),
        name: site.name, url: `${site.url}/`,
        logo: `${site.url}/assets/img/brand/logo.png`,
        email: site.email, telephone: '+90 216 510 2809',
        address: {
          '@type': 'PostalAddress', streetAddress: site.address.street,
          addressLocality: site.address.locality, addressRegion: site.address.region,
          postalCode: site.address.zip, addressCountry: 'TR',
        },
        sameAs: [site.social.instagram, site.social.youtube],
      },
      {
        '@type': 'WebPage', '@id': `${site.url}/${yol}#sayfa`,
        url: `${site.url}/${yol}`, name: title, description: desc,
        inLanguage: 'tr-TR', isPartOf: { '@id': `${site.url}/#site` },
        publisher: { '@id': KURUM_ID() },
      },
      {
        '@type': 'WebSite', '@id': `${site.url}/#site`,
        url: `${site.url}/`, name: site.name, inLanguage: 'tr-TR',
        publisher: { '@id': KURUM_ID() },
      },
      { '@type': 'BreadcrumbList', itemListElement: kirinti },
    ],
  };
}

export function layout({ title, desc, current, body, ogImage = 'assets/img/og/og-kapak.jpg', schema = null, canonical = '', pad = false }) {
  /* Sayfaya özel şema verilmemişse kurum + sayfa + kırıntı yolu üretiliyor.
     Önceden 20 sayfanın 11'inde hiç yapılandırılmış veri yoktu. */
  const kullanilan = schema || varsayilanSema({ title, desc, canonical });
  const jsonLd = `\n<script type="application/ld+json">\n${JSON.stringify(kullanilan, null, 2)}\n</script>`;
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${site.url}/${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${site.url}/${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Afloday — Çiçekli Bir Gün. Eğitim Gelişim Danışmanlık.">
<meta property="og:url" content="${site.url}/${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#E9E9E0">
${process.env.PREVIEW === '1' ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="icon" href="assets/img/brand/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..500&display=swap">
<link rel="stylesheet" href="assets/css/afloday.css?v=${CSS_DAMGA}">
<script>document.documentElement.classList.add('js');</script>${jsonLd}
</head>
<body>
<a class="skip" href="#main">İçeriğe geç</a>

${header(current)}

<main id="main" tabindex="-1"${pad ? ' class="pad-top"' : ''}>
${body}
</main>

${footer()}
${/* İşaretin kendisine bakıyoruz, sınıf adına değil. Önceden `class="galeri"`
     aranıyordu; genişleyen şerit (.serit-yigin) farklı sınıf kullandığı için
     ışık kutusu sayfaya hiç eklenmiyor, panellere tıklanınca bir şey
     olmuyordu. Izgara da şerit de `data-lightbox` taşıyor. */ ''}
${body.includes('data-lightbox') ? lightbox() : ''}
<script src="assets/js/afloday.js?v=${JS_DAMGA}" defer></script>
</body>
</html>
`;
}

/* AFLODAY — sayfa kabuğu ve paylaşılan bileşenler. */
import { site, nav, refs, assets } from './data.mjs';

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
  <div class="ftr-cta">
    <div class="wrap ftr-cta-in">
      <h2 class="d-l" data-reveal>Bir <em class="em">&ldquo;TIK&rdquo;</em> yakındayız.</h2>
      <div class="btn-row" data-reveal style="--d:80ms">
        <a class="btn btn-primary" href="iletisim.html">İletişim Formu</a>
        <a class="btn btn-ghost" href="katilim.html">Etkinlik Katılımı</a>
      </div>
    </div>
  </div>

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
      <div>
        <p class="ftr-head">Doğadan Hobi Atölyeleri</p>
        <ul>
          <li><a href="atolyeler.html#cicek">Çiçek Tasarım Hobi Atölyeleri</a></li>
          <li><a href="atolyeler.html#bitki">Bitki Tasarım Hobi Atölyeleri</a></li>
          <li><a href="atolyeler.html#cocuk">Çocuk Hobi Atölyeleri</a></li>
          <li><a href="doga-temelli-egitimler.html">Doğa Temelli Eğitimlerimiz</a></li>
          <li><a href="surdurulebilirlik.html">Sürdürülebilirlik</a></li>
        </ul>
      </div>
      <div>
        <p class="ftr-head">Kurumsal Hizmetler</p>
        <ul>
          <li><a href="kurumsal.html#gelisim">Doğadan Gelişim Atölyeleri</a></li>
          <li><a href="kurumsal-hobi-atolyeleri.html">Doğadan Hobi Atölyeleri</a></li>
          <li><a href="kurumsal.html#sosyal">Sosyal Sorumluluk &amp; İş Danışmanlığı</a></li>
          <li><a href="hakkimizda.html">Afloday Hakkında</a></li>
          <li><a href="hakkimizda.html#ekip">Ekibimiz</a></li>
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
      <span style="margin-left:auto">${site.tagline}</span>
    </div>
  </div>
</footer>`;
}

/* Folyo levhası hero — katalog sayfası olarak açılış.
   Fotoğraf paspartu içinde monte edilir; altında Fig. künyesi, sonra başlık.
   `index` hero içindeki gerçek içerik: kataloğa açılan numaralı minik levhalar. */
/* Video hero — kendi sunucumuzda barındırılan sessiz döngü.
   `lines` sağ alttaki iş kolu satırları; `kicker` üst künye. */
export function heroVideo({ kicker, heading, lede, cta, lines = [], video, poster, posterAlt }) {
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

    <a class="hero-in" href="#tanitim" aria-label="Aşağı kaydır"><span></span></a>
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
export function galeriBolumu(images, ad) {
  if (!images.length) return '';
  return `
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Atölyeden', 'Kareler', `${ad} atölyesinden ${images.length} kare.`)}
      <div class="galeri" data-lightbox style="margin-top:clamp(32px,4vw,56px)">
        ${images.map((src, i) => `<button class="galeri-hucre" type="button" data-full="${src}" aria-label="${ad} — ${i + 1}. fotoğrafı büyüt">
          <img src="${src}" alt="${ad} atölyesinden kare ${i + 1}" loading="lazy" width="600" height="600">
        </button>`).join('\n        ')}
      </div>
    </div>
  </section>`;
}

/* Işık kutusu kabuğu — sayfada galeri varsa gövdenin sonuna eklenir */
export function lightbox() {
  return `<div class="lb" id="lb" hidden>
  <button class="lb-kapat" type="button" aria-label="Kapat"></button>
  <button class="lb-onceki" type="button" aria-label="Önceki"></button>
  <img class="lb-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="1600" height="1200">
  <button class="lb-sonraki" type="button" aria-label="Sonraki"></button>
  <p class="lb-sayac"></p>
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

export function layout({ title, desc, current, body, ogImage = 'assets/img/hero/hero-buket.jpg', schema = null, canonical = '', pad = false }) {
  const jsonLd = schema ? `\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` : '';
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
<meta property="og:url" content="${site.url}/${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#E9E9E0">
${process.env.PREVIEW === '1' ? '<meta name="robots" content="noindex, nofollow">' : ''}
<link rel="icon" href="assets/img/brand/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..500&display=swap">
<link rel="stylesheet" href="assets/css/afloday.css">
<script>document.documentElement.classList.add('js');</script>${jsonLd}
</head>
<body>
<a class="skip" href="#main">İçeriğe geç</a>

${header(current)}

<main id="main"${pad ? ' class="pad-top"' : ''}>
${body}
</main>

${footer()}
${body.includes('class="galeri"') ? lightbox() : ''}
<script src="assets/js/afloday.js" defer></script>
</body>
</html>
`;
}

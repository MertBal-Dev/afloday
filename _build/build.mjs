/* AFLODAY — statik site üretici. `node _build/build.mjs` */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { site, workshops, corporate, team, projects, about, cats, assets, katilimSecenekleri,
         donemselKonsept, surdurulebilirlikGiris, formlar } from './data.mjs';
import { layout, opener, plate, logoWall, heroVideo, folio, bleed, marquee, ledger, galeriBolumu, lightbox } from './templates.mjs';
import { galeri, orijinalGorsel } from './gorseller.mjs';

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

const W = (s) => `assets/img/workshops/${s}`;
const byCat = (c) => workshops.filter(w => w.cat === c);

/* ====================================================================== */
/* ANASAYFA                                                               */
/* ====================================================================== */
{
  const rail = ['kokedama', 'kavanoz-teraryum', 'mevsim-kapi-celengi', 'taze-cicek-buket',
    'kuru-cicek-fanus', 'sukulent-aranjman', 'doga-cerceve', 'cicek-cerceve']
    .map(s => workshops.find(w => w.slug === s));

  const body = `
${heroVideo({
    kicker: 'Afloday · Doğadan Gelişim Atölyesi',
    heading: 'Doğada öğrenilen,<br>elde kalan <em>bir gün</em>.',
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
  })}

  <!-- TANITIM FİLMİ — orijinal sitedeki YouTube videosu -->
  <section class="section rule-top" id="tanitim">
    <div class="wrap">
      ${opener('Tanıtım filmi', 'Geleceği Doğadan Tasarla', 'Doğa temelli eğitim yaklaşımımızı anlatan filmimiz.')}
      <div class="split" style="margin-top:clamp(40px,5vw,72px); align-items:start">
        <div class="video" data-reveal>
          <iframe src="https://www.youtube-nocookie.com/embed/${assets.youtubeId}?iv_load_policy=3&rel=0"
            title="${assets.youtubeTitle}" loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div class="stack-l" data-reveal style="--d:120ms">
          <dl class="meta">
            <div><dt>Film</dt><dd>Afloday_Geleceği Doğadan Tasarla_Doğa Temelli Eğitimler</dd></div>
            <div><dt>Konu</dt><dd>Doğa temelli eğitimler</dd></div>
          </dl>
          <p class="body">Doğanın milyarlarca yıllık bilgeliğinin, günümüzün en karmaşık zorluklarına nasıl sürdürülebilir cevaplar sunduğunu anlatıyoruz.</p>
          <div><a class="link" href="https://www.youtube.com/watch?v=${assets.youtubeId}" rel="noopener">YouTube'da izle</a></div>
        </div>
      </div>
    </div>
  </section>

  <!-- MANİFESTO — sessiz, devasa, bol boşluklu -->
  <section class="section">
    <div class="wrap">
      <div class="folio-grid">
        <h2 class="d-l" data-reveal>Elin öğrendiğini <em class="em">zihin</em> unutmuyor.</h2>
        <div class="folio-side" data-reveal style="--d:140ms">
          <p class="lede">Yıllardır etkinliği ispatlanmış aktif öğrenme metodunu kullanıyoruz. Rutin hayatta rastlanmayan doğal malzemeler, zihne yeni kayıtlar atıyor.</p>
          <dl class="meta">
            <div><dt>Kapsam</dt><dd>Kurumsal · Bireysel · Çocuk</dd></div>
            <div><dt>Biçim</dt><dd>Yüz yüze ya da tüm Türkiye geneli online</dd></div>
            <div><dt>Katalog</dt><dd>${workshops.length} atölye · ${corporate.length} program</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <!-- REFERANSLAR — orijinal sitede olduğu gibi: "Referanslarımız" başlığı
       altında logo duvarı. Marka adları metin olarak iddia edilmiyor. -->
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

  <!-- İKİ YOL — asimetrik ikili, ızgara ritmini kırar -->
  <section class="section">
    <div class="wrap">
      ${opener('İki yol', 'Ekibiniz için mi, kendiniz için mi?', 'Aynı atölye anlayışı, iki farklı ihtiyaç.')}
      <div class="duo" style="margin-top:clamp(40px,6vw,88px)">
        <a class="plate duo-a" href="kurumsal.html" data-reveal>
          <div class="plate-frame plate-frame-tall">
            <img src="assets/img/kurumsal/kurumsal-02.jpg" alt="Ofis toplantı masasında doğal malzemelerle tasarım yapan kurumsal atölye katılımcıları" loading="lazy" width="563" height="750">
          </div>
          <div class="plate-label">
            <p class="plate-acc"><span>Kurumsal Hizmetler</span><span>${corporate.length} hat</span></p>
            <h3 class="plate-name">Kurumsal Programlar</h3>
            <p class="plate-note">Doğadan gelişim atölyeleri, doğadan hobi atölyeleri ve sosyal sorumluluk &amp; iş danışmanlığı. Yüz yüze ya da Türkiye geneli online.</p>
          </div>
        </a>
        <a class="plate duo-b" href="atolyeler.html" data-reveal style="--d:140ms">
          <div class="plate-frame">
            <img src="${W('taze-cicek-buket.jpg')}" alt="Mor, sarı ve pembe mevsim çiçeklerinden hazırlanmış el buketi" loading="lazy" width="900" height="900">
          </div>
          <div class="plate-label">
            <p class="plate-acc"><span>Çiçek · Bitki · Çocuk</span><span>${workshops.length} atölye</span></p>
            <h3 class="plate-name">Hobi Atölyeleri</h3>
            <p class="plate-note">Çiçekle, toprakla, kendi ellerinizle. Yetişkin ve çocuk atölyeleri — deneyim gerekmez.</p>
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- TAM TAŞAN KIRILIM -->
  ${bleed({
    images: [
      ['assets/img/hero/hero-buket.jpg', 'Kırmızı ve mercan rengi mevsim çiçeklerinden oluşan taze çiçek aranjmanı'],
      [W('sukulent.jpg'), 'Ahşap kap içinde farklı sukulent türleriyle hazırlanmış aranjman'],
    ],
    quote: 'Bitkiler, çiçekler başrolde; katılımcı <em class="em">yönetmen</em>.',
    cite: 'Afloday — çalışma biçimimiz',
  })}

  <!-- KURUMSAL HİZMET HATLARI -->
  <section class="section">
    <div class="wrap">
      ${opener('Kurumlara', 'Üç hizmet hattı', 'Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında, konsept geliştirerek koçluk yaklaşımıyla.')}
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        ${corporate.map(c => `<a class="index-row" href="kurumsal.html#${c.id}">
          <span class="index-acc">${c.short}</span>
          <span><span class="index-name">${c.title}</span><br><span class="caption" style="margin-top:6px;display:block">${c.tagline}</span></span>
          <span class="index-meta">Detay</span>
        </a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- KATALOG RAYI — yatay kaydırma, dikey monotonluğu kırar -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener(`Katalog · ${workshops.length} atölye`, 'Atölye kataloğundan', 'Çiçek tasarım, bitki tasarım ve çocuk hobi atölyeleri.')}
    </div>
    <div class="rail-wrap" style="margin-top:clamp(40px,5vw,72px)">
      <div class="rail">
        ${rail.map(w => `<a class="plate" href="atolye-${w.slug}.html">
          <div class="plate-frame"><img src="${W(w.img)}" alt="${w.alt}" loading="lazy" width="900" height="900"></div>
          <div class="plate-label">
            <p class="plate-acc"><span>${cats[w.cat].short}</span><span>${w.age || 'Yetişkin'}</span></p>
            <h3 class="plate-name">${w.title}</h3>
          </div>
        </a>`).join('\n        ')}
      </div>
      <div class="wrap"><p class="rail-hint">Kaydırarak gezin · ${workshops.length} kayıttan 8'i</p></div>
    </div>
    <div class="wrap" style="margin-top:var(--s6)">
      <a class="btn btn-ghost" href="atolyeler.html" data-reveal>Tüm kataloğu gör</a>
    </div>
  </section>

  <!-- AFLODAY NE YAPIYOR — afloday.com anasayfasındaki üç cümlenin tamamı -->
  <section class="section field">
    <div class="wrap">
      <div class="split">
        <div class="stack-l" data-reveal>
          <p class="eyebrow">Afloday</p>
          <h2 class="d-l">Çiçeklerin, doğanın <em class="em">iyileştirici</em> etkisi.</h2>
        </div>
        <div class="stack-l body" data-reveal style="--d:120ms">
          <p style="color:var(--field-muted)">Doğa temasıyla koçluk dokunuşlarıyla aktif öğrenme desteği sağlayan atölyelerle <strong>gelişimi</strong>, dakikalar sürse de doğaya dönüş imkânı sunduğumuz hobi edinme atölyeleriyle <strong>eğlence, sosyalleşme, yaratıcı düşünmeyi</strong> destekliyoruz.</p>
          <p style="color:var(--field-muted)">Doğadan ilham alarak tasarladığımız özgün ürünleri ise <strong>&ldquo;Doğadan Tasarım Mağazası&rdquo;</strong> ile doğa aşıklarıyla buluşturuyoruz.</p>
          <p style="color:var(--field-muted)">Afloday Doğadan Gelişim Atölyesi olarak; çiçeklerin, doğanın iyileştirici etkisini eğitimle, atölyeyle, özgün tasarımlarla iş ve yaşam alanlarına taşıyoruz.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SÜRDÜRÜLEBİLİRLİK -->
  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide stack-l" data-reveal>
          <p class="eyebrow">Sürdürülebilirlik</p>
          <h2 class="d-l">Paylaştıkça <em class="em">var olacağımızı</em> düşünüyoruz.</h2>
          <div class="body">
            <p>2019 yılında her ay iki adet ücretsiz <strong>Koruncuk Gönüllü Atölyesi</strong> gerçekleştirdik; yaklaşık 500 kişiye birebir eriştik. 2022 yılından itibaren projeyi kurum ve bireylerin atölye sponsorluğunda sürdürüyoruz.</p>
            <p><strong>Geleceği Yeşil Tasarla Projesi</strong> ise çevresel sürdürülebilirlik kapsamında yetişkin ve çocuklarda davranış geliştirmeyi hedefliyor.</p>
          </div>
          <div><a class="link" href="surdurulebilirlik.html">İki projeyi de incele</a></div>
        </div>
        <figure class="duo-side plate" data-reveal style="--d:140ms; margin:0">
          <div class="plate-frame plate-frame-tall">
            <img src="assets/img/surdurulebilirlik/koruncuk-02.jpg" alt="Koruncuk Vakfı gönüllü atölyesinde bir araya gelen katılımcı grubu" loading="lazy" width="800" height="717">
          </div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>Sürdürülebilirlik</span><span>2019 —</span></p>
            <p class="plate-note">Gülümseyen Yarınlar Projesi · Koruncuk Vakfı gönüllü atölyeleri</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  </section>`;

  add('index.html', layout({
    title: 'Afloday — Doğadan Gelişim ve Hobi Atölyeleri',
    desc: 'Afloday Doğadan Gelişim Atölyesi olarak; çiçeklerin, doğanın iyileştirici etkisini eğitimle, atölyeyle, özgün tasarımlarla iş ve yaşam alanlarına taşıyoruz.',
    current: '', body, canonical: '',
    schema: {
      '@context': 'https://schema.org', '@type': 'Organization',
      name: site.name, alternateName: 'Afloday Doğadan Gelişim Atölyesi',
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
/* KURUMSAL ÇÖZÜMLER                                                      */
/* ====================================================================== */
{
  const [gelisim, egitim, sosyal] = corporate;

  const body = `
${folio({
    eyebrow: 'Kurumsal Çözümler',
    plateNo: `${corporate.length} program hattı`,
    lines: ['Ekipler için', '<em class="em">doğadan</em> gelişim.'],
    lede: 'Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında, konu dahilinde konsept geliştirerek koçluk yaklaşımıyla doğa temalı atölyeler planlıyoruz.',
    buttons: '<a class="btn btn-primary" href="iletisim.html">Programınızı Birlikte Planlayalım</a>',
    meta: [
      ['Hizmet', `${corporate.length} program hattı`],
      ['Biçim', 'Yüz yüze ya da tüm Türkiye geneli online'],
      ['Online', 'İçerik kitleri katılımcı adresine'],
      ['Yöntem', 'Aktif öğrenme + koçluk'],
    ],
  })}

  ${marquee(30)}

  <!-- Doğadan Gelişim Atölyeleri -->
  <section class="section" id="${gelisim.id}">
    <div class="wrap">
      ${opener(gelisim.short, gelisim.title, gelisim.tagline)}
      <div class="duo" style="margin-top:clamp(40px,5vw,80px)">
        <div class="duo-wide body stack" data-reveal>
          ${gelisim.paras.map(p => `<p>${p}</p>`).join('\n          ')}
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/kurumsal/${gelisim.img}" alt="${gelisim.alt}" loading="lazy" width="563" height="750"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>${gelisim.short}</span><span>Kurumsal</span></p>
            <p class="plate-note">Yüz yüze ya da Türkiye geneli online.</p>
          </figcaption>
        </figure>
      </div>

      <div class="stack" style="margin-top:clamp(48px,7vw,112px)" data-reveal>
        <p class="eyebrow">Katılımcı &amp; kurum faydası</p>
          <p class="body">Doğadan Gelişim Atölyelerinin kuruma ve katılımcıya faydalarını şöyle sıralayabiliriz:</p>
        <div class="index">
          ${gelisim.fayda.map((f, i) => `<div class="index-row" style="cursor:default">
            <span class="index-acc">${String(i + 1).padStart(2, '0')}</span>
            <span class="index-name">${f}</span>
            <span class="index-meta"></span>
          </div>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <!-- Doğa Temelli Eğitimler — koyu bant, ritim değişimi -->
  <section class="section field" id="${egitim.id}">
    <div class="wrap">
      <div class="opener" data-reveal>
        <div class="opener-head">
          <p class="eyebrow">${egitim.short}</p>
          <h2 class="d-l">${egitim.title}</h2>
        </div>
        <p class="lede">Doğayla etkileşimde anlam bulmak.</p>
        <div class="opener-rule"></div>
      </div>

      <div class="split" style="margin-top:clamp(40px,5vw,72px)">
        <div class="body stack" data-reveal>
          ${egitim.paras.map(p => `<p style="color:var(--field-muted)">${p}</p>`).join('\n          ')}
        </div>
        <div class="stack" data-reveal style="--d:120ms">
          <p class="eyebrow">Tanıtım</p>
          <div class="video">
            <iframe src="https://www.youtube-nocookie.com/embed/${assets.youtubeId}"
              title="${assets.youtubeTitle}" loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
      </div>

      <div class="stack" style="margin-top:clamp(48px,7vw,96px)" data-reveal>
        <p class="eyebrow">Dokümanlar</p>
        <p class="body">Doğadan Gelişim Atölyeleri ile ilgili daha fazla bilgi içeren PDF sunuma aşağıdaki linkten ulaşabilirsiniz.</p>
        <div class="docs">
          ${Object.values(assets.pdfs).map(d => `<a href="${d.url}" rel="noopener">
            <span class="doc-kind">PDF</span>
            <span class="doc-name">${d.label}</span>
            <span class="doc-go">İndir →</span>
          </a>`).join('\n          ')}
        </div>
      </div>

      <div class="flow" style="margin-top:clamp(48px,7vw,104px)">
        ${egitim.ilkeler.map(i => `<div class="flow-step" data-reveal>
          <span class="flow-num">${i.no}</span>
          <div>
            <h3 class="h3">${i.title}</h3>
            <p class="caption" style="color:var(--bronze-lift); margin-top:6px">${i.sub}</p>
          </div>
          <p class="body" style="color:var(--field-muted)">${i.text}</p>
        </div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <!-- Sosyal Sorumluluk & İş Danışmanlığı -->
  <section class="section" id="${sosyal.id}">
    <div class="wrap">
      ${opener(sosyal.short, sosyal.title, sosyal.tagline)}
      <div class="split split-rev" style="margin-top:clamp(40px,5vw,80px)">
        <figure class="plate" data-reveal style="margin:0">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/kurumsal/${sosyal.img}" alt="${sosyal.alt}" loading="lazy" width="563" height="750"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>${sosyal.short}</span><span>Danışmanlık</span></p>
          </figcaption>
        </figure>
        <div class="stack-l" data-reveal style="--d:120ms">
          <div class="body">${sosyal.paras.map(p => `<p>${p}</p>`).join('')}</div>
          <ul class="tags">${sosyal.hizmetler.map(h => `<li>${h}</li>`).join('')}</ul>
          <div><a class="link" href="iletisim.html">Teklif talep et</a></div>
        </div>
      </div>
    </div>
  </section>`;

  add('kurumsal.html', layout({
    title: 'Kurumsal Çözümler — Afloday',
    desc: 'Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında, konsept geliştirerek koçluk yaklaşımıyla doğa temalı atölyeler. Doğadan Gelişim Atölyeleri, Doğadan Hobi Atölyeleri ve Sosyal Sorumluluk & İş Danışmanlığı.',
    current: 'kurumsal.html', body, canonical: 'kurumsal.html',
    ogImage: 'assets/img/kurumsal/kurumsal-02.jpg',
  }));
}

/* ====================================================================== */
/* ATÖLYELER LİSTESİ                                                      */
/* ====================================================================== */
{
  /* Izgara yerine hairline dizin — 6/5/5 gibi tek sayılarda yarım satır boşluğu
     bırakmaz ve katalog hissini güçlendirir. Her satır fotoğrafını hover'da açar. */
  const catSection = (key, anchor, first = false) => {
    const list = byCat(key);
    return `
  <section class="section${first ? '' : ' rule-top'}" id="${anchor}">
    <div class="wrap">
      ${opener(`${list.length} atölye`, cats[key].label, '')}
      <div style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        ${ledger(list.map(w => ({
      href: `atolye-${w.slug}.html`,
      img: W(w.img), alt: w.alt,
      name: w.title, note: w.tagline,
      code: cats[w.cat].short,
      mode: w.online ? 'Yüz yüze · Online' : 'Yüz yüze',
      who: w.age || 'Yetişkin',
    })))}
      </div>
    </div>
  </section>`;
  };

  const body = `
${folio({
    eyebrow: 'Atölye kataloğu',
    plateNo: `${workshops.length} atölye`,
    lines: ['Atölye', '<em class="em">kataloğu</em>.'],
    lede: 'Doğa temasını koruduğumuz, yaratıcılığa ve keyifli vakit geçirtmeye odaklandığımız atölyeler. Çiçek tasarım, bitki tasarım ve çocuk atölyeleri olmak üzere üç grupta topluyoruz.',
    buttons: '<a class="btn btn-primary" href="iletisim.html">Yerini Ayırt</a>',
    meta: [
      ['Çiçek tasarım', `${byCat('cicek').length} atölye`],
      ['Bitki tasarım', `${byCat('bitki').length} atölye`],
      ['Çocuk', `${byCat('cocuk').length} atölye · +3 ve +5 yaş`],
      ['Biçim', 'Çocuk atölyeleri yüz yüze ve online'],
    ],
  })}
${catSection('cicek', 'cicek', true)}
${catSection('bitki', 'bitki')}
${catSection('cocuk', 'cocuk')}`;

  add('atolyeler.html', layout({
    title: `Atölyeler — ${workshops.length} Çiçek, Bitki ve Çocuk Atölyesi | Afloday`,
    desc: 'Kokedama, teraryum, sukulent, kapı çelengi, taze çiçek buket ve çocuk atölyeleri. Çiçek tasarım, bitki tasarım ve çocuk hobi atölyeleri.',
    current: 'atolyeler.html', body, canonical: 'atolyeler.html',
    ogImage: 'assets/img/workshops/kavanoz-teraryum.jpg',
  }));
}

/* ====================================================================== */
/* ATÖLYE DETAY SAYFALARI                                                 */
/* ====================================================================== */
for (const w of workshops) {
  const others = workshops.filter(x => x.cat === w.cat && x.slug !== w.slug).slice(0, 3);

  const body = `
${folio({
    eyebrow: 'Atölye kataloğu',
    plateNo: cats[w.cat].label,
    lines: [w.title],
    lede: w.tagline,
    size: 'h1',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Yerini Ayırt</a>`,
    // Yalnız afloday.com'un o sayfada yazdıkları. "Malzeme dahil" ve
    // "ön koşul yok" rozetleri orijinalde geçmediği için kaldırıldı.
    meta: [
      ['Kategori', cats[w.cat].label],
      ...(w.age ? [['Yaş', w.age]] : []),
      ...(w.online ? [['Biçim', 'Yüz yüze ve online']] : []),
      ...(w.malzeme ? [['Materyal', w.malzeme]] : []),
    ],
  })}

  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide body stack" data-reveal>
          ${w.paras.map(p => `<p>${p}</p>`).join('\n          ')}
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="${W(w.img)}" alt="${w.alt}" loading="lazy" width="900" height="900"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>${cats[w.cat].short}</span><span>${w.age || 'Yetişkin'}</span></p>
            <p class="plate-note"><strong>Materyal.</strong> ${w.malzeme}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- Akış ve kazanımlar yalnızca afloday.com'un o sayfada yazdığı atölyelerde
       görünür. Yazmadığı 7 atölyede bu blok materyal anlatımına dönüşür. -->
  <section class="section field">
    <div class="wrap">
      <div class="split">
        <div class="stack-l" data-reveal>
          ${w.akis ? `<p class="eyebrow">Atölye akışı</p>
          <h2 class="h2">Nasıl ilerliyor</h2>
          <div class="flow">
            ${w.akis.map((a, i) => `<div class="flow-step" style="grid-template-columns:4em 1fr">
              <span class="flow-num">${String(i + 1).padStart(2, '0')}</span>
              <p class="body" style="color:var(--field-muted)">${a}</p>
            </div>`).join('')}
          </div>` : `<p class="eyebrow">Materyal</p>
          <h2 class="h2">Neyle çalışıyoruz</h2>
          <p class="body" style="color:var(--field-muted)">${w.malzeme}</p>`}
        </div>
        <div class="stack-l" data-reveal style="--d:120ms">
          ${w.kazanim ? `<p class="eyebrow">Atölye kazanımları</p>
          <ul class="tags">${w.kazanim.map(k => `<li>${k}</li>`).join('')}</ul>` : ''}
          <figure class="plate" style="margin:0">
            <div class="plate-frame plate-frame-wide"><img src="${W(w.img2)}" alt="${w.alt2}" loading="lazy" width="900" height="900"></div>
          </figure>
          <div class="btn-row"><a class="btn btn-primary" href="iletisim.html">Yerini Ayırt</a></div>
        </div>
      </div>
    </div>
  </section>

  ${galeriBolumu(galeri(w.slug), w.title)}

  <section class="section">
    <div class="wrap">
      ${opener('Benzer kayıtlar', cats[w.cat].label, '')}
      <div class="plates" style="margin-top:clamp(40px,5vw,72px)">
        ${others.map(o => plate({
    href: `atolye-${o.slug}.html`, img: W(o.img), alt: o.alt,
    code: cats[o.cat].short, tag: o.age || 'Yetişkin', name: o.title, note: o.tagline,
  })).join('\n        ')}
      </div>
    </div>
  </section>`;

  add(`atolye-${w.slug}.html`, layout({
    title: `${w.title} | Afloday`,
    desc: w.tagline,
    current: 'atolyeler.html', body, canonical: `atolye-${w.slug}.html`,
    ogImage: `assets/img/workshops/${w.img}`,
    schema: {
      '@context': 'https://schema.org', '@type': 'Course',
      name: w.title, description: w.tagline, inLanguage: 'tr',
      provider: { '@type': 'Organization', name: site.name, url: site.url + '/' },
      image: `${site.url}/assets/img/workshops/${w.img}`,
      // Süre iddiası yok: afloday.com hiçbir atölyenin süresini yazmıyor.
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: w.online ? ['Onsite', 'Online'] : ['Onsite'] },
    },
  }));
}

/* ====================================================================== */
/* HAKKIMIZDA                                                             */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'Hakkımızda',
    plateNo: `${team.length} kişilik ekip`,
    lines: ['Bitkiler başrolde,', 'katılımcı <em class="em">yönetmen</em>.'],
    lede: 'Kurum organizasyonel gelişimi ve çalışan gelişimi kapsamında, alternatif gelişim ve pekiştirmenin gerekli olduğu durumlarda gelişim atölyeleri düzenliyoruz.',
    buttons: '<a class="btn btn-ghost" href="#ekip">Ekibimiz</a>',
    meta: [
      ['Ekip', `${team.length} kişi`],
      ['Merkez', `${site.address.locality}, ${site.address.region}`],
      ['Hizmet', 'Kurumsal · Bireysel · Çocuk'],
    ],
  })}

  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide body stack" data-reveal>
          ${about.paras.map(p => `<p>${p}</p>`).join('\n          ')}
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="assets/img/hero/hero-hakkimizda.jpg" alt="Vazoda pembe şakayıklar, aydınlık bir pencere önünde" loading="lazy" width="600" height="900"></div>
        </figure>
      </div>
    </div>
  </section>

  ${marquee(30)}

  <section class="section" id="ekip">
    <div class="wrap">
      ${opener(`Ekip · ${team.length} kişi`, 'Ekibimiz', 'Kurumsal iletişim, insan kaynakları, koçluk ve tasarım geçmişinden gelen bir ekip.')}
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
    desc: 'Afloday; kurum organizasyonel gelişimi ve çalışan gelişimi kapsamında, bitkilerin ve çiçeklerin başrolde olduğu gelişim atölyeleri düzenler. 7 kişilik eğitmen ve danışman ekibi.',
    current: 'hakkimizda.html', body, canonical: 'hakkimizda.html',
    ogImage: 'assets/img/hero/hero-hakkimizda.jpg',
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
    lines: ['Paylaştıkça', '<em class="em">var olacağımızı</em>', 'düşünüyoruz.'],
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
for (const p of projects) {
  const G = (f) => `assets/img/surdurulebilirlik/${f}`;
  const gal = orijinalGorsel[p.id === 'gulumseyen-yarinlar' ? 'gulumseyen-yarinlar-projesi' : 'gelecegi-tasarla'] || [];

  const listeBlok = p.kapsam ? `
  <section class="section field">
    <div class="wrap">
      <div class="stack-l" data-reveal>
        <p class="eyebrow">Kapsam</p>
        <h2 class="h2">${p.kapsam.baslik}</h2>
        <div class="flow">
          ${p.kapsam.maddeler.map((m, i) => `<div class="flow-step" style="grid-template-columns:4em 1fr">
            <span class="flow-num">${String(i + 1).padStart(2, '0')}</span>
            <p class="body" style="color:var(--field-muted)">${m}</p>
          </div>`).join('')}
        </div>
        ${p.kapanis ? `<p class="lede" style="color:var(--field-muted)">${p.kapanis}</p>` : ''}
      </div>
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
    lines: [p.title.replace(' Projesi', ''), `<em class="em">Projesi</em>.`],
    lede: p.tagline,
    size: 'h1',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Projeye katıl</a>`,
    meta: [['Kapsam', p.id === 'gulumseyen-yarinlar' ? 'Çocuk hakları · gönüllülük' : 'Çevresel sürdürülebilirlik'],
           ['Başlangıç', p.id === 'gulumseyen-yarinlar' ? '2019' : 'Devam ediyor'],
           ...(p.id === 'gelecegi-yesil-tasarla' ? [['Biçim', 'Online ve yüz yüze']] : [])],
  })}

  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide body stack" data-reveal>
          <p class="lede">${surdurulebilirlikGiris}</p>
          ${p.paras.map(x => `<p>${x}</p>`).join('\n          ')}
        </div>
        <figure class="duo-side plate" data-reveal style="--d:120ms; margin:0">
          <div class="plate-frame plate-frame-tall"><img src="${G(p.img)}" alt="${p.alt}" loading="lazy" width="800" height="900"></div>
          <figcaption class="plate-label">
            <p class="plate-acc"><span>Proje</span><span>Afloday</span></p>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
${listeBlok}${mevsimBlok}${katkiBlok}${bilimBlok}${stratejiBlok}
  ${galeriBolumu(gal, p.title)}
${davetBlok}`;

  add(`${p.slug}.html`, layout({
    title: `${p.title} — Afloday`,
    desc: kirp(p.paras[0], 155),
    current: 'surdurulebilirlik.html', body, canonical: `${p.slug}.html`,
    ogImage: G(p.img),
  }));
}

/* ====================================================================== */
/* DOĞA TEMELLİ EĞİTİMLERİMİZ — afloday.com'da üst düzey kendi sayfası     */
/* ====================================================================== */
{
  const e = corporate.find(c => c.id === 'egitim');
  const body = `
${folio({
    eyebrow: 'Afloday',
    plateNo: 'Doğa Temelli Eğitimlerimiz',
    lines: ['Doğayla etkileşimde', '<em class="em">anlam bulmak</em>.'],
    lede: e.paras[0],
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Detaylı bilgi alın</a>`,
    meta: [['Program', 'Doğa Temelli Eğitimler'], ['İlke', '3 temel ilke'], ['Doküman', '2 PDF']],
  })}

  <section class="section">
    <div class="wrap">
      <div class="folio-grid">
        <h2 class="d-l" data-reveal>Doğayla etkileşimde <em class="em">anlam bulmak</em>.</h2>
        <div class="folio-side body stack" data-reveal style="--d:140ms">
          ${e.paras.slice(1).map(p => `<p>${p}</p>`).join('\n          ')}
        </div>
      </div>
    </div>
  </section>

  <!-- ÜÇ İLKE — sayfanın omurgası -->
  ${e.ilkeler.map((i, idx) => `
  <section class="section${idx % 2 ? ' field' : ' rule-top'}">
    <div class="wrap">
      <div class="split${idx % 2 ? ' split-rev' : ''}">
        <div class="stack-l" data-reveal>
          <p class="eyebrow">İlke ${i.no}</p>
          <h2 class="d-l">${i.title}</h2>
          <p class="lede"${idx % 2 ? ' style="color:var(--field-muted)"' : ''}>${i.sub}</p>
        </div>
        <div class="stack-l" data-reveal style="--d:120ms">
          <p class="body"${idx % 2 ? ' style="color:var(--field-muted)"' : ''}>${i.text}</p>
        </div>
      </div>
    </div>
  </section>`).join('\n')}

  <!-- DOKÜMANLAR — orijinal sayfadaki iki PDF -->
  <section class="section rule-top">
    <div class="wrap">
      ${opener('Dokümanlar', 'İndirilebilir içerik', 'Programın kapsamını ayrıntısıyla anlatan dosyalar.')}
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
    desc: 'Kök salmak, sorumluluk almak, birlikte yeşermek. Doğanın milyarlarca yıllık bilgeliğini iş hayatına taşıyan üç ilkeli eğitim programı.',
    current: 'doga-temelli-egitimler.html', body, canonical: 'doga-temelli-egitimler.html',
    ogImage: `assets/img/kurumsal/${e.img}`,
  }));
}

/* ====================================================================== */
/* DOĞADAN HOBİ ATÖLYELERİ (kurumsal hat) — 9 dönemsel konsept vakası      */
/* ====================================================================== */
{
  const gal = orijinalGorsel['dogadan-hobi-atolyeleri'] || [];
  const body = `
${folio({
    eyebrow: 'Afloday Kurumsal Hizmetler',
    plateNo: `${donemselKonsept.vakalar.length} vaka`,
    lines: ['Doğadan Hobi', '<em class="em">Atölyeleri</em>.'],
    lede: 'Doğa temasını koruduğumuz, yaratıcılığa ve keyifli vakit geçirtmeye odaklandığımız belli bir mesaj ve konu içermeyen “Doğadan Hobi Atölyeleri” ile ise sadece çalışan motivasyonuna odaklanıyoruz.',
    size: 'd-xl',
    buttons: `<a class="btn btn-primary" href="iletisim.html">Kurumsal Teklif Al</a>`,
    meta: [['Hizmet hattı', 'Kurumsal Hizmetler'], ['Odak', 'Çalışan motivasyonu'], ['Örnek', `${donemselKonsept.vakalar.length} proje`]],
  })}

  <section class="section">
    <div class="wrap">
      ${opener('Dönemsel konsept', 'Dönemsel Konsept Hobi Atölyeleri', donemselKonsept.giris)}
      <p class="lede" style="margin-top:clamp(24px,3vw,40px); max-width:52rem" data-reveal>${donemselKonsept.giris2}</p>
    </div>
  </section>

  <!-- Gerçekleşmiş projelerden örnekler — hepsi afloday.com'daki anlatımlar -->
  <section class="section field">
    <div class="wrap">
      <div class="vakalar">
        ${donemselKonsept.vakalar.map((v, i) => `<article class="vaka" data-reveal="stagger">
          <p class="vaka-no">${String(i + 1).padStart(2, '0')}</p>
          <div>
            <p class="eyebrow">${v.baslik}</p>
            <h3 class="vaka-ad">${v.atolye}</h3>
            <p class="body" style="color:var(--field-muted)">${v.metin}</p>
          </div>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  ${galeriBolumu(gal, 'Dönemsel konsept')}

  <section class="section rule-top">
    <div class="wrap">
      ${opener('Diğer hatlar', 'Kurumsal hizmetlerimiz', '')}
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        ${corporate.filter(c => c.id !== 'egitim').map(c => `<a class="index-row" href="kurumsal.html#${c.id}">
          <span class="index-acc">${c.short}</span>
          <span><span class="index-name">${c.title}</span></span>
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
    title: 'Doğadan Hobi Atölyeleri — Kurumsal | Afloday',
    desc: 'Mevsime ve özel günlere göre şekillenen kurumsal hobi atölyeleri. Babalar Günü Kokedama\'dan 23 Nisan çocuk atölyelerine dokuz gerçek proje örneği.',
    current: 'kurumsal.html', body, canonical: 'kurumsal-hobi-atolyeleri.html',
    ogImage: 'assets/img/kurumsal/kurumsal-02.jpg',
  }));
}

/* ====================================================================== */
/* İLETİŞİM                                                               */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'İletişim',
    plateNo: 'Bize ulaşın',
    lines: ['Bir <em class="em">&ldquo;TIK&rdquo;</em>', 'yakındayız.'],
    lede: 'Bir &ldquo;TIK&rdquo; yakındayız. Formu doldurun ya da doğrudan telefonla ulaşın.',
    meta: [
      ['E-posta', `<a href="mailto:${site.email}" style="color:inherit">${site.email}</a>`],
      ...site.phones.map(p => ['Telefon', p]),
      ['Adres', `${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}`],
      ['Yol tarifi', `<a href="${assets.maps}" rel="noopener" style="color:var(--carmine)">Haritada aç →</a>`],
    ],
    buttons: `<a class="btn btn-ghost" href="katilim.html">Bireysel atölye katılımı</a>`,
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
          <label class="f-check"><input type="checkbox" name="kvkk" required> Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.</label>
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
      <div class="harita" data-reveal style="margin-top:clamp(32px,4vw,56px)">
        <iframe title="Afloday ofis konumu — Google Haritalar" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=${encodeURIComponent(site.address.street + ', ' + site.address.zip + ' ' + site.address.locality + '/' + site.address.region)}&output=embed"></iframe>
      </div>
      <div class="iletisim-blok" style="margin-top:clamp(32px,4vw,56px)" data-reveal>
        <p><b>E.</b> <a href="mailto:${site.email}">${site.email}</a></p>
        ${site.phones.map(t => `<p><b>T.</b> <a href="tel:${t.replace(/\s/g, '')}">${t}</a></p>`).join('')}
        <p><b>A.</b> ${site.address.street}, ${site.address.zip} ${site.address.locality} / ${site.address.region}</p>
      </div>
      <div class="index" style="margin-top:clamp(32px,4vw,56px)">
        <a class="index-row" href="iletisim.html"><span class="index-acc">01</span><span class="index-name">İletişim</span><span class="index-meta">Form</span></a>
        <a class="index-row" href="katilim.html"><span class="index-acc">02</span><span class="index-name">Atölye Katılımı</span><span class="index-meta">Form</span></a>
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
  const body = `
${folio({
    eyebrow: 'Ekip · Afloday',
    plateNo: `Ekip ${String(i + 1).padStart(2, '0')} / ${team.length}`,
    lines: [t.name],
    lede: t.role,
    size: 'h1',
    buttons: '<a class="btn btn-ghost" href="hakkimizda.html#ekip">Tüm ekip</a>',
    meta: [
      ['Kayıt', `Ekip ${String(i + 1).padStart(2, '0')} / ${team.length}`],
      ['Görev', t.role],
      ['Merkez', `${site.address.locality}, ${site.address.region}`],
      ['İletişim', `<a href="mailto:${site.email}" style="color:inherit">${site.email}</a>`],
    ],
  })}

  <section class="section">
    <div class="wrap">
      <div class="duo">
        <div class="duo-wide body stack" data-reveal>
          ${t.paras.map(p => `<p>${p}</p>`).join('\n          ')}
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
    desc: `${t.name}, ${t.role}. ${kirp(t.paras[0], 110)}`,
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
/* ATÖLYE KATILIMI                                                        */
/* ====================================================================== */
{
  const body = `
${folio({
    eyebrow: 'Atölye Katılımı',
    plateNo: 'Etkinlik katılımı',
    lines: ['Atölyeye', '<em class="em">yerinizi ayırtın</em>.'],
    lede: 'Katılmak istediğiniz atölyeyi seçin, randevu tarih ve saatinizi birlikte netleştirelim.',
    meta: [
      ['E-posta', `<a href="mailto:${site.email}" style="color:inherit">${site.email}</a>`],
      ...site.phones.map(t => ['Telefon', t]),
    ],
  })}

  <section class="section">
    <div class="wrap wrap-narrow">
      <div data-reveal>
        <form class="form" data-demo="katilim-ok" novalidate>
          <div class="form-row form-row-2">
            <div class="f"><label for="k-ad">Ad Soyad <span class="req">*</span></label><input id="k-ad" name="ad" type="text" required autocomplete="name"></div>
            <div class="f"><label for="k-eposta">E-posta <span class="req">*</span></label><input id="k-eposta" name="eposta" type="email" required autocomplete="email"></div>
          </div>
          <div class="form-row form-row-2">
            <div class="f">
              <label for="k-tel">Telefon <span class="req">*</span></label>
              <input id="k-tel" name="tel" type="tel" required autocomplete="tel" aria-describedby="k-tel-not">
              <p class="form-note" id="k-tel-not">Randevu tarih ve saatinizin netleştirilmesi için size ulaşabileceğimiz bir telefon numarası yazmalısınız.</p>
            </div>
            <div class="f">
              <label for="k-atolye">Atölye <span class="req">*</span></label>
              <select id="k-atolye" name="atolye" required>
                <option value="">Lütfen seçiniz</option>
                ${katilimSecenekleri.map(o => `<option>${o}</option>`).join('\n                ')}
              </select>
            </div>
          </div>
          <div class="f"><label for="k-mesaj">Mesajınız <span class="req">*</span></label><textarea id="k-mesaj" name="mesaj" rows="6" maxlength="500" required placeholder="Lütfen mesajınızı yazınız!"></textarea><p class="form-say"><span data-sayac="k-mesaj">0</span>/500</p></div>
          <label class="f-check"><input type="checkbox" name="kvkk" required> Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.</label>
          <div class="btn-row"><button class="btn btn-primary" type="submit">Katılım Talebimi Gönder</button></div>
          <p class="form-note">Bu bir tasarım sunumudur — form gönderimi kaydedilmez.</p>
        </form>
        <div class="form-ok" id="katilim-ok" role="status">
          <p class="eyebrow">Gönderildi</p>
          <h2 class="h3" style="margin:var(--s3) 0">Teşekkürler! Talebiniz elimize ulaştı.</h2>
          <p class="body">Randevu tarih ve saatini netleştirmek için sizi arayacağız.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section rule-top">
    <div class="wrap">
      ${opener(`Katalog · ${workshops.length} atölye`, 'Hangi atölyeye katılacağınıza karar vermediyseniz', 'Tüm atölyelerin içeriğini ve akışını katalogda bulabilirsiniz.')}
      <div class="btn-row" style="margin-top:var(--s5)" data-reveal>
        <a class="btn btn-ghost" href="atolyeler.html">Atölye kataloğunu aç</a>
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
        <a class="index-row" href="katilim.html"><span class="index-acc">02</span><span class="index-name">Atölye Katılımı</span><span class="index-meta">Form</span></a>
        <a class="index-row" href="ik.html"><span class="index-acc">03</span><span class="index-name">İnsan Kaynakları</span><span class="index-meta">Form</span></a>
      </div>
    </div>
  </section>`;

  add('katilim.html', layout({
    title: 'Atölye Katılımı — Afloday',
    desc: 'Afloday atölyelerine katılım formu. Atölyenizi seçin, randevu tarih ve saatinizi birlikte netleştirelim.',
    current: '', body, canonical: 'katilim.html',
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
    lines: ['Ekibimize', '<em class="em">katılın</em>.'],
    lede: 'Doğayla, tasarımla ve insanla çalışmayı sevenlerle tanışmak isteriz. Özgeçmişinizi bırakın.',
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
          <label class="f-check"><input type="checkbox" name="kvkk" required> Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.</label>
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
        <a class="index-row" href="katilim.html"><span class="index-acc">02</span><span class="index-name">Atölye Katılımı</span><span class="index-meta">Form</span></a>
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
        <a class="btn btn-ghost" href="atolyeler.html">Atölye kataloğu</a>
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
  add('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
}

/* ====================================================================== */
await mkdir(OUT, { recursive: true });
/* Şablonlardaki iç notlar teslim edilen HTML'de görünmesin — koşullu
   ifadelerin içindekiler dahil tüm yorumlar çıktıdan temizlenir. */
const yorumsuz = (h) => h
  .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')
  .replace(/^[ \t]*\r?\n/gm, '');

for (const p of pages) {
  const cikti = p.file.endsWith('.html') ? yorumsuz(p.html) : p.html;
  await writeFile(path.join(OUT, p.file), cikti, 'utf8');
}

const html = pages.filter(p => p.file.endsWith('.html'));
console.log(`${pages.length} dosya yazıldı (${html.length} HTML sayfa).`);

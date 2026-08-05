/* Tüm sayfalarda erişilebilirlik ve yapı taraması — statik.
   Tarayıcı gerektirmeyen her şey burada; kontrast ve odak canlı sınanıyor. */
import { readFileSync, readdirSync } from 'node:fs';

const SITE = 'c:/Users/Gaming/Desktop/Afloday/site/';
const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html'));
const bulgular = [];
const ekle = (s, tur, detay) => bulgular.push({ sayfa: s, tur, detay });

for (const f of sayfalar) {
  const h = readFileSync(SITE + f, 'utf8');
  const govde = h.slice(h.indexOf('<body'), h.lastIndexOf('</body>'));

  /* 1 · lang ve viewport */
  if (!/<html[^>]+lang="tr"/.test(h)) ekle(f, 'lang', 'html lang="tr" yok');
  if (!/name="viewport"[^>]*width=device-width/.test(h)) ekle(f, 'viewport', 'viewport eksik');
  if (/user-scalable=no|maximum-scale=1/.test(h)) ekle(f, 'viewport', 'yakınlaştırma kapatılmış');

  /* 2 · title ve meta description */
  const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  if (!t.trim()) ekle(f, 'title', 'title boş');
  const d = (h.match(/name="description"\s+content="([^"]*)"/) || [])[1] || '';
  if (!d.trim()) ekle(f, 'meta', 'description boş');

  /* 3 · görsellerde alt, width, height */
  for (const m of govde.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\balt=/.test(tag)) ekle(f, 'alt', tag.slice(0, 90));
    if (/class="lb-img"/.test(tag)) continue;      /* ışık kutusu yer tutucusu */
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag))
      ekle(f, 'boyut', 'width/height yok → CLS: ' + tag.slice(0, 80));
  }

  /* 4 · başlık hiyerarşisi */
  const basliklar = [...govde.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const h1 = basliklar.filter((x) => x === 1).length;
  if (h1 === 0) ekle(f, 'h1', 'h1 yok');
  if (h1 > 1) ekle(f, 'h1', `${h1} adet h1`);
  for (let i = 1; i < basliklar.length; i++)
    if (basliklar[i] - basliklar[i - 1] > 1)
      ekle(f, 'baslik-atlama', `h${basliklar[i - 1]} → h${basliklar[i]}`);

  /* 5 · metinsiz düğme / bağlantı */
  for (const m of govde.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const [, , attr, ic] = m;
    const yazi = ic.replace(/<[^>]+>/g, '').trim();
    const etiketli = /aria-label=|aria-labelledby=/.test(attr) || /sr-only/.test(ic);
    if (!yazi && !etiketli) ekle(f, 'etiketsiz', `<${m[1]}> boş: ${attr.slice(0, 70)}`);
  }

  /* 6 · form alanlarında etiket */
  for (const m of govde.matchAll(/<(input|textarea|select)\b([^>]*)>/g)) {
    const attr = m[2];
    if (/type="(hidden|submit|button)"/.test(attr)) continue;
    const id = (attr.match(/\bid="([^"]+)"/) || [])[1];
    const acikEtiket = id && govde.includes(`for="${id}"`);
    /* Örtük etiket de geçerli: alan doğrudan <label> içine sarılmışsa
       erişilebilir ad oradan geliyor (onay kutuları böyle yazılmış). */
    const oncesi = govde.slice(Math.max(0, m.index - 400), m.index);
    const acilan = (oncesi.match(/<label\b/g) || []).length;
    const kapanan = (oncesi.match(/<\/label>/g) || []).length;
    const ortukEtiket = acilan > kapanan;
    if (!acikEtiket && !ortukEtiket && !/aria-label=|aria-labelledby=/.test(attr))
      ekle(f, 'form-etiket', attr.slice(0, 80));
  }

  /* 7 · dış bağlantılarda rel */
  for (const m of govde.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g))
    if (/target="_blank"/.test(m[0]) && !/rel="[^"]*noopener/.test(m[0]))
      ekle(f, 'rel', m[0].slice(0, 80));

  /* 8 · ana içeriğe atlama bağlantısı ve landmark */
  if (!/href="#(ana|main|icerik)/.test(govde)) ekle(f, 'skip-link', 'ana içeriğe atlama yok');
  if (!/<main\b/.test(govde)) ekle(f, 'landmark', '<main> yok');
}

/* Özet */
const gruplar = {};
for (const b of bulgular) (gruplar[b.tur] ||= []).push(b);
console.log(`${sayfalar.length} sayfa tarandı · ${bulgular.length} bulgu\n`);
for (const [tur, l] of Object.entries(gruplar).sort((a, b) => b[1].length - a[1].length)) {
  const sayfaSay = new Set(l.map((x) => x.sayfa)).size;
  console.log(`■ ${tur} — ${l.length} bulgu / ${sayfaSay} sayfa`);
  for (const x of l.slice(0, 4)) console.log(`    ${x.sayfa}: ${x.detay}`);
  if (l.length > 4) console.log(`    … ${l.length - 4} tane daha`);
}
if (!bulgular.length) console.log('✓ Statik taramada bulgu yok.');

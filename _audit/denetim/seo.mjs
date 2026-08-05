/* SEO denetimi — 20 sayfa. Yayına çıkmadan önce bakılması gerekenler. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const KOK = 'c:/Users/Gaming/Desktop/Afloday/';
const SITE = KOK + 'site/';
const sayfalar = readdirSync(SITE).filter((f) => f.endsWith('.html'));
const bulgu = [];
const ekle = (s, t, d) => bulgu.push({ s, t, d });

const basliklar = new Map(), aciklamalar = new Map();

for (const f of sayfalar) {
  const h = readFileSync(SITE + f, 'utf8');
  const al = (re) => (h.match(re) || [])[1] || '';

  /* title */
  const t = al(/<title>([^<]*)<\/title>/);
  if (!t) ekle(f, 'title', 'yok');
  else {
    if (t.length > 60) ekle(f, 'title', `${t.length} karakter (60 üstü aramada kesiliyor): ${t}`);
    if (basliklar.has(t)) ekle(f, 'title', `aynı başlık ${basliklar.get(t)} sayfasında da var`);
    basliklar.set(t, f);
  }

  /* description */
  const d = al(/name="description"\s+content="([^"]*)"/);
  if (!d) ekle(f, 'description', 'yok');
  else {
    if (d.length > 160) ekle(f, 'description', `${d.length} karakter (160 üstü kesiliyor)`);
    if (d.length < 70) ekle(f, 'description', `${d.length} karakter (kısa)`);
    if (aciklamalar.has(d)) ekle(f, 'description', `aynı açıklama ${aciklamalar.get(d)} sayfasında da var`);
    aciklamalar.set(d, f);
  }

  /* canonical */
  const c = al(/rel="canonical"\s+href="([^"]*)"/);
  if (!c) ekle(f, 'canonical', 'yok');
  else if (!/^https?:\/\//.test(c)) ekle(f, 'canonical', `mutlak adres değil: ${c}`);

  /* Open Graph + Twitter */
  for (const p of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type'])
    if (!h.includes(`property="${p}"`) && !h.includes(`name="${p}"`)) ekle(f, 'og', `${p} yok`);
  if (!/name="twitter:card"/.test(h)) ekle(f, 'twitter', 'twitter:card yok');

  /* og:image mutlak mı, dosya var mı */
  const og = al(/property="og:image"\s+content="([^"]*)"/);
  if (og && !/^https?:\/\//.test(og)) ekle(f, 'og', `og:image mutlak değil: ${og}`);
  if (og) {
    const yerel = og.replace(/^https?:\/\/[^/]+\//, '');
    if (!existsSync(SITE + yerel)) ekle(f, 'og', `og:image dosyası yok: ${yerel}`);
  }

  /* yapılandırılmış veri */
  if (!/application\/ld\+json/.test(h)) ekle(f, 'schema', 'JSON-LD yok');

  /* dil ve robots */
  if (/name="robots"\s+content="[^"]*noindex/.test(h)) ekle(f, 'robots', 'noindex!');
}

/* sitemap ve robots */
const smYol = KOK + 'app/sitemap.ts';
if (!existsSync(smYol)) ekle('-', 'sitemap', 'app/sitemap.ts yok');
if (!existsSync(KOK + 'app/robots.ts')) ekle('-', 'robots', 'app/robots.ts yok');

/* out/ içindeki gerçek çıktı */
if (existsSync(KOK + 'out/sitemap.xml')) {
  const sm = readFileSync(KOK + 'out/sitemap.xml', 'utf8');
  const n = (sm.match(/<loc>/g) || []).length;
  console.log(`sitemap.xml: ${n} adres`);
  const iptal = ['katilim', 'dogadan-gelisim-atolyeleri', 'kokedama-tasarim-atolyesi'];
  for (const i of iptal) if (sm.includes('/' + i)) ekle('sitemap.xml', 'sitemap', `iptal adres var: ${i}`);
} else ekle('-', 'sitemap', 'out/sitemap.xml üretilmemiş');

const grup = {};
for (const b of bulgu) (grup[b.t] ||= []).push(b);
console.log(`\n${sayfalar.length} sayfa · ${bulgu.length} SEO bulgusu\n`);
for (const [t, l] of Object.entries(grup).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`■ ${t} — ${l.length}`);
  const gorulen = new Set();
  for (const x of l) {
    const iz = x.d.slice(0, 60);
    if (gorulen.has(iz) && gorulen.size > 2) continue;
    gorulen.add(iz);
    console.log(`    ${x.s}: ${x.d.slice(0, 110)}`);
    if (gorulen.size >= 4) { console.log(`    … (${l.length - 4} tane daha)`); break; }
  }
}
if (!bulgu.length) console.log('✓ SEO bulgusu yok.');

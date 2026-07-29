// Afloday görsel + içerik hasadı: tüm sayfaları gez, görsel URL'lerini topla, indir.
import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const BASE = 'https://www.afloday.com';
const OUT = path.resolve('_arsiv');

const PAGES = [
  '/', '/hakkimizda', '/iletisim', '/katilim',
  '/dogadan-gelisim-atolyeleri', '/doga-temelli-egitimlerimiz', '/gelecegi-tasarla',
  '/ik', '/sosyal-sorumluluk-is-danismanligi', '/gulumseyen-yarinlar-projesi',
  '/dogadan-hobi-atolyeleri',
  '/kokedama-tasarim-atolyesi', '/kavanoz-teraryum-tasarim-atolyesi',
  '/sukulent-aranjman-atolyesi', '/minyatur-bahce-tasarim-atolyesi',
  '/doga-cerceve-tasarim-atolyesi', '/mevsim-kapi-celengi-tasarimi-atolye',
  '/kuru-cicek-fanus-tasarim-atolyesi', '/taze-cicek-buket-aranjman-tasarim-atolyesi',
  '/cicek-aksesuar-tasarim-atolyesi', '/cicek-cerceve-tasarim-atolyesi',
  '/mini-kavanoz-teraryum-atolyesi-3-yas', '/mini-bahce-atolyesi-5-yas',
  '/kus-evi-tasarim-atolyesi-5-yas', '/kalemlik-tasarim-atolyesi-5-yas',
  '/doga-cerceve-atolyesi-5-yas',
  '/ceylan-kalyon', '/tugce-hazinedar', '/derya-akyazici-kalyon',
  '/elif-celikkol-duman', '/alara-apaydin-saruhan', '/zeynep-altunhan',
  '/muharrem-ozdemir',
];

const IMG_RE = /(?:src|data-src|href|content)=["']([^"']*\/images\/[^"']+\.(?:jpe?g|png|webp|gif))["']/gi;
const CSS_URL_RE = /url\(["']?([^"')]*\/images\/[^"')]+\.(?:jpe?g|png|webp|gif))["']?\)/gi;

const found = new Map(); // url -> Set(pages)

async function scrape(p) {
  const url = BASE + p;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { page: p, status: res.status, imgs: [] };
    const html = await res.text();
    const imgs = new Set();
    for (const re of [IMG_RE, CSS_URL_RE]) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(html))) {
        let u = m[1].replace(/&amp;/g, '&').trim();
        if (u.startsWith('//')) u = 'https:' + u;
        else if (u.startsWith('/')) u = BASE + u;
        else if (!u.startsWith('http')) u = BASE + '/' + u;
        u = u.replace(/([^:])\/\/+/g, '$1/');
        if (!u.includes('afloday.com')) continue;
        imgs.add(u);
        if (!found.has(u)) found.set(u, new Set());
        found.get(u).add(p);
      }
    }
    return { page: p, status: 200, imgs: [...imgs], bytes: html.length };
  } catch (e) {
    return { page: p, status: 'ERR ' + e.message, imgs: [] };
  }
}

async function download(url) {
  const name = decodeURIComponent(url.split('/images/')[1] || '').replace(/[\/\\]/g, '__');
  const dest = path.join(OUT, name);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { url, ok: false, status: res.status };
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    return { url, ok: true, file: name, bytes: Number(res.headers.get('content-length') || 0) };
  } catch (e) {
    return { url, ok: false, status: e.message };
  }
}

const limit = async (items, n, fn) => {
  const out = [];
  const q = [...items];
  await Promise.all(Array.from({ length: n }, async () => {
    while (q.length) out.push(await fn(q.shift()));
  }));
  return out;
};

await mkdir(OUT, { recursive: true });

console.log('Sayfalar taranıyor...');
const pageResults = await limit(PAGES, 6, scrape);
const bad = pageResults.filter(r => r.status !== 200);
console.log(`  ${pageResults.length - bad.length}/${PAGES.length} sayfa OK`);
if (bad.length) console.log('  Hatalı:', bad.map(b => `${b.page} (${b.status})`).join(', '));

const urls = [...found.keys()];
console.log(`\n${urls.length} benzersiz görsel bulundu. İndiriliyor...`);
const dl = await limit(urls, 8, download);
const ok = dl.filter(d => d.ok);
console.log(`  ${ok.length}/${urls.length} indirildi`);

await writeFile('_audit/image-map.json', JSON.stringify({
  pages: pageResults.map(r => ({ page: r.page, status: r.status, imageCount: r.imgs.length, images: r.imgs })),
  downloaded: ok.map(d => ({ file: d.file, url: d.url, usedOn: [...(found.get(d.url) || [])] })),
  failed: dl.filter(d => !d.ok),
}, null, 2));
console.log('\n_audit/image-map.json yazıldı');

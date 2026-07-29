/* afloday.com'un tamamını indirir; her sayfanın düz metnini ve görsellerini
   _audit/orijinal/ altına yazar. Karşılaştırma bu dosyalar üzerinden yapılır. */
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = 'https://www.afloday.com';
const OUT = new URL('./orijinal/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const PAGES = [
  '/', '/hakkimizda', '/ceylan-kalyon', '/tugce-hazinedar', '/derya-akyazici-kalyon',
  '/elif-celikkol-duman', '/alara-apaydin-saruhan', '/zeynep-altunhan', '/muharrem-ozdemir',
  '/dogadan-gelisim-atolyeleri', '/dogadan-hobi-atolyeleri', '/sosyal-sorumluluk-is-danismanligi',
  '/mevsim-kapi-celengi-tasarimi-atolye', '/kuru-cicek-fanus-tasarim-atolyesi',
  '/cicek-aksesuar-tasarim-atolyesi', '/dogal-tutsu-herbaryum-tasarim-atolyesi',
  '/taze-cicek-buket-aranjman-tasarim-atolyesi', '/cicek-cerceve-tasarim-atolyesi',
  '/kokedama-tasarim-atolyesi', '/minyatur-bahce-tasarim-atolyesi', '/sukulent-aranjman-atolyesi',
  '/kavanoz-teraryum-tasarim-atolyesi', '/doga-cerceve-tasarim-atolyesi',
  '/mini-kavanoz-teraryum-atolyesi-3-yas', '/mini-bahce-atolyesi-5-yas',
  '/kus-evi-tasarim-atolyesi-5-yas', '/kalemlik-tasarim-atolyesi-5-yas', '/doga-cerceve-atolyesi-5-yas',
  '/doga-temelli-egitimlerimiz', '/gelecegi-tasarla', '/gulumseyen-yarinlar-projesi',
  '/iletisim', '/katilim', '/ik',
];

/* Kaba ama yeterli HTML→metin: script/style at, blok etiketlerinde satır kır. */
function toText(html) {
  let s = html;
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/<\/(p|div|li|h[1-6]|tr|section|article|td|figcaption|blockquote)>/gi, '\n');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
       .replace(/&#39;|&rsquo;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
       .replace(/&[a-z]+;/gi, ' ');
  s = s.split('\n').map(l => l.replace(/[ \t ]+/g, ' ').trim()).filter(Boolean).join('\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s;
}

const pick = (html, re) => [...html.matchAll(re)].map(m => m[1]);

const index = [];
for (const p of PAGES) {
  const url = BASE + p;
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const name = (p === '/' ? 'anasayfa' : p.slice(1)).replace(/\//g, '_');

  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) || [, ''])[1].trim();
  const imgs = [...new Set(pick(html, /<img[^>]+src=["']([^"']+)["']/gi))];
  const links = [...new Set(pick(html, /<a[^>]+href=["']([^"']+)["']/gi))]
    .filter(h => !h.startsWith('#') && !h.startsWith('javascript'));
  const iframes = pick(html, /<iframe[^>]+src=["']([^"']+)["']/gi);
  const pdfs = links.filter(h => /\.pdf$/i.test(h));
  const text = toText(html);

  writeFileSync(new URL(name + '.txt', OUT),
    `URL: ${url}\nTITLE: ${title}\nDESC: ${desc}\n` +
    `IFRAME: ${iframes.join(' | ') || '-'}\nPDF: ${pdfs.join(' | ') || '-'}\n` +
    `GORSEL (${imgs.length}):\n${imgs.map(i => '  ' + i).join('\n')}\n` +
    `\n===== METIN =====\n${text}\n`, 'utf8');

  index.push({ path: p, name, title, desc, kelime: text.split(/\s+/).length, gorsel: imgs.length, iframe: iframes.length, pdf: pdfs.length });
  console.log(`${name.padEnd(44)} ${String(text.split(/\s+/).length).padStart(5)} kelime  ${String(imgs.length).padStart(3)} görsel`);
}
writeFileSync(new URL('_index.json', OUT), JSON.stringify(index, null, 2), 'utf8');
console.log(`\n${index.length} sayfa indirildi → _audit/orijinal/`);

/* orijinal-gorseller.json → _build/gorseller.mjs
   Her orijinal sayfa için, o sayfada gerçekten içerik olan görsellerin listesi.
   Logo / menü / arka plan gibi kabuk görselleri elenir. */
import { readFileSync, writeFileSync } from 'node:fs';

const map = JSON.parse(readFileSync(new URL('./orijinal-gorseller.json', import.meta.url), 'utf8'));

const KABUK = [
  /^\/images\/logo\//, /^\/images\/menu-logo/, /^\/images\/afloday\/title-bg/,
  /^\/images\/afloday\/menu-bg/, /^\/media\/jce\//, /^\/images\/afloday\/ref\//,
  /-linkedin\.png$/, /-link\.png$/, /link\.png$/,
];
const kabukMu = p => KABUK.some(r => r.test(p));

const perPage = {};
for (const [path, sayfalar] of Object.entries(map)) {
  if (!path.startsWith('/images/')) continue;
  if (kabukMu(path)) continue;
  for (const s of sayfalar) (perPage[s] ||= []).push(path);
}

/* Doğal sıra: 001, 002 … dosya adındaki sayıya göre */
const num = p => { const m = p.match(/(\d+)[^\/]*$/); return m ? +m[1] : 1e9; };
for (const k of Object.keys(perPage)) perPage[k].sort((a, b) => num(a) - num(b) || a.localeCompare(b));

/* Site içi yol: /images/x/y.jpg → assets/img/afloday/x/y.jpg */
const yerel = p => 'assets/img/afloday/' + p.replace(/^\/images\//, '');

const out = `/* OTOMATİK ÜRETİLDİ — _audit/gorsel-map-uret.mjs
   afloday.com'un her sayfasında kullanılan görsellerin birebir listesi.
   Anahtarlar orijinal sayfa adları; yollar bizim site kökümüze göre. */
export const orijinalGorsel = ${JSON.stringify(
  Object.fromEntries(Object.entries(perPage).sort().map(([k, v]) => [k, v.map(yerel)])),
  null, 2)};

/* Bizim slug'ımız → orijinal sayfa adı */
export const sayfaEsleme = {
  'mevsim-kapi-celengi': 'mevsim-kapi-celengi-tasarimi-atolye',
  'kuru-cicek-fanus': 'kuru-cicek-fanus-tasarim-atolyesi',
  'cicek-aksesuar': 'cicek-aksesuar-tasarim-atolyesi',
  'dogal-tutsu-herbaryum': 'dogal-tutsu-herbaryum-tasarim-atolyesi',
  'taze-cicek-buket': 'taze-cicek-buket-aranjman-tasarim-atolyesi',
  'cicek-cerceve': 'cicek-cerceve-tasarim-atolyesi',
  'kokedama': 'kokedama-tasarim-atolyesi',
  'minyatur-bahce': 'minyatur-bahce-tasarim-atolyesi',
  'sukulent-aranjman': 'sukulent-aranjman-atolyesi',
  'kavanoz-teraryum': 'kavanoz-teraryum-tasarim-atolyesi',
  'doga-cerceve': 'doga-cerceve-tasarim-atolyesi',
  'mini-kavanoz-teraryum': 'mini-kavanoz-teraryum-atolyesi-3-yas',
  'mini-bahce': 'mini-bahce-atolyesi-5-yas',
  'kus-evi': 'kus-evi-tasarim-atolyesi-5-yas',
  'kalemlik': 'kalemlik-tasarim-atolyesi-5-yas',
  'cocuk-doga-cerceve': 'doga-cerceve-atolyesi-5-yas',
};

export const galeri = (slug) => orijinalGorsel[sayfaEsleme[slug]] || [];
`;

writeFileSync(new URL('../_build/gorseller.mjs', import.meta.url), out, 'utf8');
console.log(Object.entries(perPage).map(([k, v]) => `${k.padEnd(44)} ${v.length}`).sort().join('\n'));
console.log('\n_build/gorseller.mjs yazıldı.');

/* Atölye fark raporunun 13 maddesini uygular.
   İlke: afloday.com'da karşılığı olmayan hiçbir iddia kalmayacak. */
import { readFileSync, writeFileSync } from 'node:fs';
const P = new URL('../_build/data.mjs', import.meta.url);
let s = readFileSync(P, 'utf8');
const j = (x) => JSON.stringify(x);
const log = [];

/* Bir atölye kaydının içinde alan değiştirir/siler */
function alan(slug, ad, yeni) {
  const i = s.indexOf(`slug: '${slug}'`);
  if (i < 0) throw new Error('slug yok: ' + slug);
  const son = s.indexOf('\n  },', i);
  const blok = s.slice(i, son);
  const re = new RegExp(`\\n\\s*${ad}: (\\[[\\s\\S]*?\\n\\s*\\]|'[^']*'|"[^"]*"),`);
  const m = blok.match(re);
  if (!m) { log.push(`  ! ${slug}.${ad} bulunamadı`); return; }
  const mut = yeni === null ? '' : `\n    ${ad}: ${yeni},`;
  s = s.slice(0, i) + blok.replace(re, mut) + s.slice(son);
  log.push(`  ${slug}.${ad} ${yeni === null ? 'kaldırıldı' : 'güncellendi'}`);
}
const dizi = (arr) => '[' + arr.map(j).join(', ') + ']';

/* 3 — mini-kavanoz-teraryum yaşı: URL, <title> ve menünün üçü de +3 diyor */
alan('mini-kavanoz-teraryum', 'age', j('+3 yaş'));

/* 4 + 10 — orijinalde AKIŞ bölümü olmayan 7 atölyeden akis'i kaldır */
for (const sl of ['mevsim-kapi-celengi', 'cicek-aksesuar', 'mini-kavanoz-teraryum',
                  'mini-bahce', 'kus-evi', 'kalemlik', 'cocuk-doga-cerceve']) {
  alan(sl, 'akis', null);
}
/* 4 — mevsim-kapi-celengi'de kazanım listesi de orijinalde yok */
alan('mevsim-kapi-celengi', 'kazanim', null);
alan('mevsim-kapi-celengi', 'malzeme', j('Çelenk çemberi, kuru çiçekler, doğadan materyaller'));

/* 9 — başlık: orijinal "Mevsim Kapı Çelengi Tasarımı Atölyesi" */
alan('mevsim-kapi-celengi', 'title', j('Mevsim Kapı Çelengi Tasarımı Atölyesi'));

/* 7 — cicek-cerceve kazanım son maddesi */
{
  const i = s.indexOf(`slug: 'cicek-cerceve'`);
  const son = s.indexOf('\n  },', i);
  const blok = s.slice(i, son).replace("'Özgün Tasarım'", "'Özgün Tasarım Aksesuarlar'");
  s = s.slice(0, i) + blok + s.slice(son);
  log.push('  cicek-cerceve.kazanim son madde düzeltildi');
}

/* 11 — eksik materyal adları tamamlandı (orijinal metinden) */
alan('sukulent-aranjman', 'malzeme', j('Sukulentler, kaktüsler, ağaç kabukları, dekoratif taşlar, toprak'));
alan('cicek-cerceve', 'malzeme', j('Çerçeve, kuru çiçekler, demir otu, tarçın çubukları, portakal dilimleri'));
alan('doga-cerceve', 'malzeme', j('Çerçeve, kara yosunu, demir otu, tarçın çubukları, portakal dilimleri, ağaç kabukları, gerçek kuru çiçekler'));
/* 12 — orijinalde geçmeyen materyaller çıkarıldı */
alan('mini-kavanoz-teraryum', 'malzeme', j('Cam kavanoz, bitkiler, renkli taşlar, toprak'));
alan('kalemlik', 'malzeme', j('Seramik ayakkabı, bitkiler, toprak, dekoratif taşlar'));

writeFileSync(P, s, 'utf8');
console.log('ATÖLYE DÜZELTMELERİ:\n' + log.join('\n'));

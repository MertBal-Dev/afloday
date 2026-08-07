/* Menü düzleşince hiçbir sayfa erişilemez hâle geldi mi?
   Dosyalar canlı adreslerle yazılıyor, `href="x.html"` aramak yanlış. */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const KOK_ = fileURLToPath(new URL('../../', import.meta.url));
const SITE_ = KOK_ + 'site/';
const RAPOR_ = KOK_ + '_audit/rapor/';
mkdirSync(RAPOR_, { recursive: true });


const KOK = SITE_;
const sayfalar = readdirSync(KOK).filter((f) => f.endsWith('.html'));
const metin = Object.fromEntries(sayfalar.map((f) => [f, readFileSync(KOK + f, 'utf8')]));
const adres = (f) => (f === 'index.html' ? '/' : f.replace(/\.html$/, ''));

const yetim = [];
for (const hedef of sayfalar) {
  if (hedef === '404.html') continue;               /* 404'e bağlantı verilmez */
  const a = adres(hedef);
  const nereden = sayfalar.filter(
    (f) => f !== hedef && (metin[f].includes(`href="${a}"`) || metin[f].includes(`href="${a}#`)),
  );
  if (!nereden.length) yetim.push(a);
}
console.log('ERİŞİLEMEYEN SAYFA:', yetim.length ? yetim.join(', ') : 'yok');

console.log('\nEKİP SAYFALARI — nereden erişiliyor');
for (const f of sayfalar.filter((x) => /^(ceylan|tugce|derya|elif|alara|zeynep|muharrem)/.test(x))) {
  const a = adres(f);
  const n = sayfalar.filter(
    (x) => x !== f && (metin[x].includes(`href="${a}"`) || metin[x].includes(`href="${a}#`)),
  );
  console.log(`  ${a.padEnd(26)} ← ${n.map(adres).join(', ') || 'HİÇBİR YER'}`);
}

const nav = (metin['index.html'].match(/<nav class="nav"[\s\S]*?<\/nav>/) || [''])[0];
console.log('\nMENÜ:', [...nav.matchAll(/>([^<>]+)<\/a>/g)].map((m) => m[1].trim()).join(' · '));
console.log('menüdeki bağlantı sayısı:', (nav.match(/<a /g) || []).length);

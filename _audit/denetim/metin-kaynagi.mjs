/* Sitedeki her görünür metni kaynağına göre sınıflandırır.
   Soru: hangi cümleyi belge verdi, hangisini ben yazdım?

   ÖNEMLİ: yalnız YAPRAK metin düğümleri ölçülür. Kapsayıcı elemanı ölçmek
   yanıltıyor — bir <li> içinde numara + başlık + açıklama birleşince ortaya
   hiçbir kaynakta bulunmayan bir dize çıkıyor, oysa parçaların hepsi
   birebir belgeden.

   Kaynaklar:
     1. belge-tam.txt  — 4 Ağustos içerik belgesi (tablolar dahil)
     2. data.mjs       — canlı afloday.com'dan alınmış eski içerik */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const KOK_ = fileURLToPath(new URL('../../', import.meta.url));
const SITE_ = KOK_ + 'site/';
const RAPOR_ = KOK_ + '_audit/rapor/';
mkdirSync(RAPOR_, { recursive: true });


const S = RAPOR_;
const KOK = KOK_;
const SITE = KOK + 'site/';

const norm = (s) =>
  s.replace(/&ldquo;|&rdquo;|&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, ' ')
    /* Ayrac ve tirnak isaretleri kaynaklar arasinda degisiyor:
       dokum '2019 yilinda', bizde “2019'dan beri”; belge “ve”, bizde “·”.
       Hepsini bosluga indirip karsilastiriyoruz. */
    .replace(/["“”'’·—–;:,]/g, ' ')
    .replace(/\s*&\s*/g, ' & ').replace(/\s+/g, ' ').trim()
    /*  dökümü küçük harfe çevrilmiş hâlde duruyor.
       Her iki taraf da aynı dönüşümden geçmezse afloday.com'un kendi
       metinleri "kaynaksız" görünüyor — ilk ölçümü bozan kusur buydu. */
    .toLowerCase();

const belge = norm(readFileSync(S + 'belge-tam.txt', 'utf8'));
/* KAYNAK 2 — canlı afloday.com'un gerçek metni.
   `_audit/orijinal/` klasörü, siteden 34 sayfanın tam dökümü. Tek doğru
   kaynak bu; `build.mjs` ya da `templates.mjs` okumak ölçümü bozar çünkü
   orada benim yazdığım başlıklar da var. */
const ORJ = KOK + '_audit/orijinal/';
const orijinal = norm(
  readdirSync(ORJ).filter((f) => f.endsWith('.txt'))
    .map((f) => readFileSync(ORJ + f, 'utf8')).join('\n'),
);

/* Yaprak düğüm: içinde başka etiket olmayan metin taşıyıcı */
const YAPRAK = /<(h1|h2|h3|h4|p|li|dt|dd|blockquote|figcaption|button|a|span|address)\b[^>]*>([^<]+)<\/\1>/gi;

const bulgular = new Map();
for (const f of readdirSync(SITE).filter((x) => x.endsWith('.html'))) {
  const html = readFileSync(SITE + f, 'utf8');
  const govde = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  for (const m of govde.matchAll(YAPRAK)) {
    const t = norm(m[2]);
    if (t.length < 8) continue;                    /* rakam, ok, tek kelime etiket */
    if (/^[\d\s/·—–-]+$/.test(t)) continue;
    if (!bulgular.has(t)) bulgular.set(t, new Set());
    bulgular.get(t).add(f);
  }
}

const belgede = [], siteden = [], benim = [];
for (const [t, sayfalar] of bulgular) {
  const iz = t.slice(0, Math.min(t.length, 55));
  if (belge.includes(iz)) belgede.push(t);
  else if (orijinal.includes(iz)) siteden.push(t);
  else benim.push([t, [...sayfalar].sort().join(', ')]);
}

const toplam = bulgular.size;
const kaynakli = belgede.length + siteden.length;
console.log('SİTEDEKİ METİNLERİN KAYNAĞI  (yaprak düğümler)\n');
console.log(`  toplam benzersiz metin : ${toplam}`);
console.log(`  4 Ağustos belgesinden  : ${belgede.length}`);
console.log(`  canlı afloday.com'dan  : ${siteden.length}`);
console.log(`  benim yazdığım         : ${benim.length}`);
console.log(`\n  KAYNAKLI ORAN: %${((kaynakli / toplam) * 100).toFixed(1)}`);

/* Kelime sayısına göre de ölç — asıl önemli olan metnin hacmi */
const kelime = (l) => l.reduce((t, x) => t + (Array.isArray(x) ? x[0] : x).split(' ').length, 0);
const kToplam = kelime(belgede) + kelime(siteden) + kelime(benim);
console.log(`  KELİME BAZINDA: %${(((kelime(belgede) + kelime(siteden)) / kToplam) * 100).toFixed(1)} kaynaklı`);
console.log(`    belge ${kelime(belgede)} · site ${kelime(siteden)} · benim ${kelime(benim)} kelime`);

benim.sort((a, b) => b[0].split(' ').length - a[0].split(' ').length);
console.log(`\nBENİM YAZDIKLARIM — ${benim.length} adet\n`);
benim.forEach(([t, s]) => console.log(`  ${t}\n      → ${s}\n`));
writeFileSync(S + 'benim-metinler.txt', benim.map(([t, s]) => `${t}\t[${s}]`).join('\n'));

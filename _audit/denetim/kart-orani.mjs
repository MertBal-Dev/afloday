/* Kart ızgarasında kırpma kaça iner? Kart oranı kategoriye göre seçilirse
   her kategorinin kendi medyan oranı kullanılır, tek oran dayatılmaz.

   Kıyas: bugünkü tek oran vs kategoriye göre oran. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const { olcumler } = JSON.parse(readFileSync(KOK + '_audit/rapor/oran.json', 'utf8'));

const kisalt = (p) => p.split('\\').join('/').split('/assets/img/').pop();
const etkinlik = olcumler
  .map((m) => ({ ...m, yol: kisalt(m.yol) }))
  .filter((m) => m.yol.includes('etkinlik/') && /\.jpg$/i.test(m.yol));

const kategoriler = {};
for (const m of etkinlik) {
  const ad = m.yol.split('/').pop().replace(/-\d+\.jpg$/i, '').replace(/\.jpg$/i, '');
  (kategoriler[ad] ||= []).push(m.oran);
}

const medyan = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const kirp = (o, c) => (1 - (o > c ? c / o : o / c)) * 100;
const ort = (a) => a.reduce((x, y) => x + y, 0) / a.length;

/* Yakın standart orana yuvarla, keyfî ondalık kullanma */
const standartlar = [
  [0.6667, '2/3'], [0.75, '3/4'], [0.8, '4/5'], [1, '1/1'],
  [1.25, '5/4'], [1.3333, '4/3'], [1.5, '3/2'], [1.7778, '16/9'],
];
const yuvarla = (o) => standartlar.reduce((iyi, s) =>
  Math.abs(s[0] - o) < Math.abs(iyi[0] - o) ? s : iyi, standartlar[0]);

console.log('=== ETKİNLİK KATEGORİLERİ · kart oranı kategoriye göre ===\n');

const kategoriKirpma = [];
const tekOranKirpma = [];
const TEK = 0.8;   /* bugün yaygın kullanılan 4/5 */

for (const [ad, oranlar] of Object.entries(kategoriler).sort((a, b) => b[1].length - a[1].length)) {
  if (oranlar.length < 4) continue;
  const [deger, etiket] = yuvarla(medyan(oranlar));
  const k = oranlar.map((o) => kirp(o, deger));
  kategoriKirpma.push(...k);
  tekOranKirpma.push(...oranlar.map((o) => kirp(o, TEK)));
  const agir = k.filter((x) => x > 20).length;
  console.log(`  ${ad.slice(0, 32).padEnd(34)} ${String(oranlar.length).padStart(2)} foto · kart ${etiket.padEnd(5)} · kırpma %${ort(k).toFixed(1).padStart(5)} · %20 üstü: ${agir}`);
}

console.log('\n=== SONUÇ ===\n');
console.log(`  Tek oran (4/5) herkese          : ortalama %${ort(tekOranKirpma).toFixed(1)}`);
console.log(`  Kategoriye göre oran            : ortalama %${ort(kategoriKirpma).toFixed(1)}`);
console.log(`  Kazanç                          : %${(ort(tekOranKirpma) - ort(kategoriKirpma)).toFixed(1)} daha az kırpma`);
console.log(`\n  Kategoriye göre %20'den fazla kırpılan: ${kategoriKirpma.filter((x) => x > 20).length}/${kategoriKirpma.length}`);

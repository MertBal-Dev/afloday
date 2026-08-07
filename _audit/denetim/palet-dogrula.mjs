/* palet.mjs'in ürettiği değerler, tarayıcıdan ölçülen bugünkü efektif
   değerlerle birebir aynı mı? Aşama 0'ın "görünüm değişmeyecek" iddiası
   bu karşılaştırmaya dayanıyor.

   Önce: node _audit/denetim/palet-oku.mjs  (palet.json üretir) */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { palet, takmaAdlar } from '../../_build/palet.mjs';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const olculen = JSON.parse(readFileSync(KOK + '_audit/rapor/palet.json', 'utf8')).tokenlar;

const kebap = (s) => '--' + s.replace(/[A-Z]/g, (h) => '-' + h.toLowerCase());

/* Yeni tokenların çözülmüş değeri */
const cozum = {};
for (const [ad, v] of Object.entries(palet)) cozum[kebap(ad)] = v.toUpperCase();
for (const [eski, yeni] of Object.entries(takmaAdlar)) cozum[eski] = palet[yeni].toUpperCase();

let hata = 0, tamam = 0, yeni = 0;
console.log('=== ESKİ TOKEN → YENİ DEĞER KARŞILAŞTIRMASI ===\n');
for (const [ad, deger] of Object.entries(olculen)) {
  if (!/^#/.test(deger)) continue;
  const o = deger.toUpperCase();
  const y = cozum[ad];
  if (!y) { console.log(`  ?  ${ad.padEnd(16)} ${o}  → palette karşılığı YOK`); hata++; continue; }
  if (o !== y) { console.log(`  ✗  ${ad.padEnd(16)} ölçülen ${o}  ürettiğim ${y}`); hata++; }
  else tamam++;
}
for (const ad of Object.keys(cozum)) if (!(ad in olculen)) yeni++;

console.log(`\n  eşleşen: ${tamam} · UYUŞMAZLIK: ${hata} · yeni eklenen: ${yeni}`);
if (hata) {
  console.log('\n  ✗ Aşama 0 başlatılamaz. Uyuşmazlık giderilmeden görünüm değişir.');
  process.exit(1);
}
console.log('\n  ✓ Üretilen palet bugünkü efektif değerlerle birebir aynı.');

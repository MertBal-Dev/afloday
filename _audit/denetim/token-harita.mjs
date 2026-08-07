/* Token haritası: her renk token'ı kaç kez tanımlı, kaç kez çağrılıyor,
   hangi CSS özelliklerinde kullanılıyor. Aşama 0'ın giriş verisi. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const p = JSON.parse(readFileSync(KOK + '_audit/rapor/palet.json', 'utf8'));
const css = readFileSync(KOK + 'site/assets/css/afloday.css', 'utf8');

const kacar = (ad) => {
  let n = 0;
  let i = 0;
  const iz = 'var(' + ad;
  while ((i = css.indexOf(iz, i)) !== -1) {
    const sonra = css[i + iz.length];
    if (sonra === ')' || sonra === ',' || sonra === ' ') n++;
    i += iz.length;
  }
  return n;
};

/* Bir token'ın hangi özelliklerde geçtiği */
const ozellikler = (ad) => {
  const bulunan = {};
  for (const satir of css.split('\n')) {
    if (!satir.includes('var(' + ad)) continue;
    for (const m of satir.matchAll(/([a-z-]+)\s*:\s*[^;]*var\(/g)) {
      bulunan[m[1]] = (bulunan[m[1]] || 0) + 1;
    }
  }
  return Object.entries(bulunan).sort((a, b) => b[1] - a[1]).slice(0, 4)
    .map(([k, v]) => `${k}×${v}`).join(' ');
};

const renkler = Object.entries(p.tokenlar).filter(([, v]) => /^#|^rgb/.test(v));

console.log('=== RENK TOKEN HARİTASI ===\n');
console.log('  token            değer      tanım  çağrı  kullanıldığı özellikler');
console.log('  ' + '-'.repeat(78));
let olu = 0;
for (const [ad, deger] of renkler) {
  const tanim = p.tanim[ad] || 0;
  const cagri = kacar(ad);
  if (tanim > 1) olu += tanim - 1;
  const isaret = tanim > 1 ? '⚠' : ' ';
  console.log(`${isaret} ${ad.padEnd(16)} ${deger.padEnd(10)} ${String(tanim).padStart(4)}  ${String(cagri).padStart(5)}  ${ozellikler(ad)}`);
}
console.log(`\n  ${renkler.length} renk token · ${olu} ölü tanım silinecek`);

const hamToplam = Object.values(p.hamHex).reduce((a, b) => a + b.length, 0);
console.log(`  ${Object.keys(p.hamHex).length} farklı ham hex, ${hamToplam} kullanım · token'a bağlanacak\n`);

/* Ham hex'ler hangi token'ın değerine eşit — otomatik eşleme adayları */
console.log('=== HAM HEX → TOKEN EŞLEME ADAYLARI ===\n');
const degerden = {};
for (const [ad, v] of renkler) (degerden[v.toUpperCase()] ||= []).push(ad);
const eslesen = [], eslesmeyen = [];
for (const [hex, yerler] of Object.entries(p.hamHex).sort((a, b) => b[1].length - a[1].length)) {
  const uzun = hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
  const aday = degerden[uzun.toUpperCase()];
  if (aday) eslesen.push({ hex, yerler, aday });
  else eslesmeyen.push({ hex, yerler });
}
for (const e of eslesen) {
  console.log(`  ${e.hex.padEnd(9)} ${String(e.yerler.length).padStart(3)}× → var(${e.aday.join(' | ')})`);
}
console.log(`\n  eşleşen: ${eslesen.length} renk / ${eslesen.reduce((a, b) => a + b.yerler.length, 0)} kullanım`);
console.log(`  EŞLEŞMEYEN (yeni token gerekebilir): ${eslesmeyen.length} renk\n`);
for (const e of eslesmeyen) {
  console.log(`  ${e.hex.padEnd(9)} ${String(e.yerler.length).padStart(3)}×  satır ${e.yerler.slice(0, 6).join(', ')}`);
}

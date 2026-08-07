/* GÖRSEL ÇÖZÜNÜRLÜĞÜ — hangi sayfa yeterli fotoğrafa sahip?

   Editoryal bant fotoğrafı 600-1300px genişlikte gösteriyor. Kaynak
   bundan küçükse büyütülür ve bulanıklaşır. Hiçbir yerleşim sistemi
   bunu kurtaramaz; çözüm Afloday'den yüksek çözünürlüklü dosya istemek.

   Eşikler:
     ≥1200px  masaüstünde tam kanamalı bant için yeterli
     ≥ 800px  iki sütunlu bant için yeterli
     < 600px  editoryal kullanıma UYGUN DEĞİL */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gorselOlculeri } from '../../_build/gorsel-olculeri.mjs';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const SITE = KOK + 'site/';

/* src="assets/img/X.jpg" → manifest anahtarı */
const anahtar = (src) => {
  const y = src.replace(/^assets\/img\//, '').replace(/\.(jpe?g|png|webp|avif)$/i, '')
    .replace(/-\d+w$/, '').replace(/-800$/, '');
  return y.startsWith('rev2/') ? y.replace('rev2/', '') : y;
};

const satirlar = [];
for (const dosya of readdirSync(SITE).filter((f) => f.endsWith('.html')).sort()) {
  const h = readFileSync(SITE + dosya, 'utf8');
  const kaynaklar = [...h.matchAll(/src="(assets\/img\/[^"]+)"/g)].map((m) => m[1]);
  const enler = [];
  const bilinmeyen = [];
  for (const s of new Set(kaynaklar)) {
    const a = anahtar(s);
    /* Logo, marka ve favicon küçük olmalı — editoryal fotoğraf değiller.
       Sayıya katılırlarsa her sayfa "sorunlu" görünür ve gerçek sorun
       (220px'lik içerik fotoğrafları) kalabalıkta kaybolur. */
    if (/^(logos|brand)\//.test(a)) continue;
    const o = gorselOlculeri[a];
    if (o) enler.push({ en: o[0], boy: o[1], yol: a });
    else bilinmeyen.push(s);
  }
  if (!enler.length) { satirlar.push({ dosya, yok: true, bilinmeyen: bilinmeyen.length }); continue; }
  enler.sort((a, b) => a.en - b.en);
  const ortanca = enler[Math.floor(enler.length / 2)].en;
  const kucuk = enler.filter((x) => x.en < 600);
  satirlar.push({
    dosya, adet: enler.length, enKucuk: enler[0].en, ortanca,
    kucukAdet: kucuk.length, ornek: kucuk[0]?.yol || '', bilinmeyen: bilinmeyen.length,
  });
}

console.log('=== SAYFA BAŞINA GÖRSEL ÇÖZÜNÜRLÜĞÜ ===\n');
console.log('  sayfa                                 adet  en küçük  ortanca  <600px');
console.log('  ' + '-'.repeat(76));
const sorunlu = [];
for (const s of satirlar.sort((a, b) => (a.ortanca || 0) - (b.ortanca || 0))) {
  if (s.yok) { console.log(`  ${s.dosya.padEnd(38)}  —  ölçüsü bilinen görsel yok (${s.bilinmeyen} bilinmeyen)`); continue; }
  const isaret = s.kucukAdet > 0 ? ' ✗' : '  ';
  console.log(`${isaret} ${s.dosya.padEnd(38)}${String(s.adet).padStart(4)}${String(s.enKucuk).padStart(10)}${String(s.ortanca).padStart(9)}${String(s.kucukAdet).padStart(8)}`);
  if (s.kucukAdet > 0) sorunlu.push(s);
}
console.log(`\n  ${sorunlu.length} sayfada 600px altı görsel var.`);
if (sorunlu.length) {
  console.log('\n  EN KRİTİKLER (editoryal kullanıma uygun değil):');
  for (const s of sorunlu.sort((a, b) => b.kucukAdet - a.kucukAdet).slice(0, 8)) {
    console.log(`    ${s.dosya.padEnd(38)} ${s.kucukAdet} görsel · örnek ${s.ornek} (${s.enKucuk}px)`);
  }
}

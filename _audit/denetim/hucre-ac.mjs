/* Belirli bir tablo hücresini parçalayıp her parçayı sitede arar.
   Kullanım: node hucre-ac.mjs <satirNo> [sayfa.html ...]

   Gerekçe: belgenin bazı hücreleri koca bir sayfanın tüm içeriğini
   tek satırda taşıyor (örn. 121 = Kurumsal Hizmetler sayfasının tamamı).
   `bolum.mjs` hücreleri Excel satır etiketi sayıp atlıyor; burada
   `||` sütun, `/` alan ayracı olarak açılıyor. */
import { readFileSync, readdirSync } from 'node:fs';

const S = 'C:/Users/Gaming/AppData/Local/Temp/claude/c--Users-Gaming-Desktop-Afloday/9762a584-306b-4526-88f3-6d66de01acda/scratchpad/';
const SITE = 'c:/Users/Gaming/Desktop/Afloday/site/';

const norm = (s) => s
  .replace(/&ldquo;|&rdquo;|&quot;/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
  .replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, ' ')
  .replace(/[“”"'’·—–;:,()&①②③④⑤•\[\]→]/g, ' ')
  .replace(/\s+/g, ' ').trim().toLowerCase();

const [, , no, ...dosyalar] = process.argv;
const satir = readFileSync(S + 'belge-tam.txt', 'utf8').split('\n')[Number(no) - 1];
const hedefler = dosyalar.length ? dosyalar : readdirSync(SITE).filter((f) => f.endsWith('.html'));
const metin = {};
for (const f of hedefler) metin[f] = norm(readFileSync(SITE + f, 'utf8').replace(/<[^>]+>/g, ' '));

const sutunlar = satir.replace('[HÜCRE]', '').split('||');
let toplamVar = 0, toplamYok = 0;

sutunlar.forEach((sut, si) => {
  console.log(`\n╔═ SÜTUN ${si + 1}`);
  for (const parca of sut.split(/\s\/\s/)) {
    const k = norm(parca);
    if (k.split(' ').length < 2) continue;
    /* Uzun paragrafta ilk 70 karakter yeterli iz; kısa başlıkta tamamı */
    const iz = k.slice(0, Math.min(k.length, 70));
    const nerede = hedefler.filter((f) => metin[f].includes(iz));
    if (nerede.length) { toplamVar++; } else {
      toplamYok++;
      console.log(`  ✗ ${parca.trim().slice(0, 150)}`);
    }
  }
});

console.log(`\nVAR ${toplamVar} · YOK ${toplamYok}`);

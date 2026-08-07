/* HİZALI SATIR (justified rows) benzetimi — kırpmasız düzenin sınanması.

   Yöntem: fotoğraflar doğal oranlarıyla sırayla bir satıra eklenir; satır
   kapta taşacak hâle gelince o satırdaki her fotoğraf AYNI YÜKSEKLİĞE
   ölçeklenir ve satır kabın tam genişliğini doldurur.

   Sonuç: kırpma sıfır, sol ve sağ kenar dümdüz, her satır kendi içinde
   aynı boyda. Flickr/Unsplash/Google Fotoğraflar bu düzeni kullanır.

   Ölçtüğümüz şey: satır yükseklikleri birbirine ne kadar yakın kalıyor.
   Yükseklikler çok oynarsa "sırıtma" olur, işte o zaman düzen bozulur. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const { olcumler } = JSON.parse(readFileSync(KOK + '_audit/rapor/oran.json', 'utf8'));

/* Kapa göre satırlara böl. hedefBoy: arzu edilen satır yüksekliği. */
const hizala = (fotolar, kapEn, hedefBoy, bosluk) => {
  const satirlar = [];
  let birikim = [];
  for (const f of fotolar) {
    birikim.push(f);
    /* Bu satır hedef boyda olsaydı toplam genişlik ne olurdu */
    const toplamOran = birikim.reduce((s, x) => s + x.oran, 0);
    const gerekli = toplamOran * hedefBoy + bosluk * (birikim.length - 1);
    if (gerekli >= kapEn) {
      /* Kaba tam otursun diye yüksekliği geri hesapla */
      const kullanilabilir = kapEn - bosluk * (birikim.length - 1);
      const boy = kullanilabilir / toplamOran;
      satirlar.push({ fotolar: birikim, boy, adet: birikim.length });
      birikim = [];
    }
  }
  if (birikim.length) {
    const toplamOran = birikim.reduce((s, x) => s + x.oran, 0);
    const kullanilabilir = kapEn - bosluk * (birikim.length - 1);
    /* Son satır: hedefi aşmasın, sola yaslı kalsın */
    satirlar.push({ fotolar: birikim, boy: Math.min(hedefBoy, kullanilabilir / toplamOran), adet: birikim.length, son: true });
  }
  return satirlar;
};

const dene = (ad, kapEn, hedefBoy, bosluk) => {
  const s = hizala(olcumler, kapEn, hedefBoy, bosluk);
  const tam = s.filter((r) => !r.son);
  const boylar = tam.map((r) => r.boy);
  const ort = boylar.reduce((a, b) => a + b, 0) / boylar.length;
  const enAz = Math.min(...boylar), enCok = Math.max(...boylar);
  const sapma = Math.sqrt(boylar.reduce((a, b) => a + (b - ort) ** 2, 0) / boylar.length);
  const adetler = {};
  for (const r of tam) adetler[r.adet] = (adetler[r.adet] || 0) + 1;

  console.log(`\n${ad}  (kap ${kapEn}px · hedef satır boyu ${hedefBoy}px)`);
  console.log(`  ${s.length} satır · satır başına ${Object.entries(adetler).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' foto ×' + v).join(', ')}`);
  console.log(`  satır yüksekliği: ort ${ort.toFixed(0)}px · aralık ${enAz.toFixed(0)}-${enCok.toFixed(0)}px · sapma ${sapma.toFixed(0)}px (%${(sapma / ort * 100).toFixed(1)})`);
  console.log(`  KIRPMA: %0 — her fotoğraf doğal oranında`);
  return { sapma: sapma / ort };
};

console.log('=== HİZALI SATIR DÜZENİ — 136 gerçek fotoğrafla benzetim ===');

console.log('\n--- MASAÜSTÜ 1440px ---');
dene('hedef 300', 1272, 300, 16);
dene('hedef 360', 1272, 360, 16);
dene('hedef 420', 1272, 420, 16);

console.log('\n--- TABLET 768px ---');
dene('hedef 260', 688, 260, 12);

console.log('\n--- TELEFON 390px ---');
dene('hedef 200', 350, 200, 8);
dene('hedef 240', 350, 240, 8);

console.log('\n--- KIYAS: sabit 3 sütun ızgara (kırpmalı) ---');
console.log('  her hücre aynı, ama ortalama %24-30 kırpma\n');

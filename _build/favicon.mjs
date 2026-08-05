/* favicon.ico üreteci.
   Tarayıcı `<link rel="icon">` varsa onu kullanır, ama araçlar ve bazı
   tarayıcılar kök dizindeki /favicon.ico'yu doğrudan ister — orada dosya
   yoksa 404 düşer. ICO kabı Vista'dan beri içine PNG gömmeye izin veriyor,
   bu yüzden ayrı bir kodlayıcıya gerek yok: 32 ve 16 piksellik iki PNG'yi
   ICO başlığıyla sarıyoruz.

   Çalıştır: node _build/favicon.mjs */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const KAYNAK = 'site/assets/img/brand/favicon.png';
const OLCULER = [32, 16];

const pngler = [];
for (const n of OLCULER) {
  pngler.push({ n, veri: await sharp(KAYNAK).resize(n, n, { fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer() });
}

const baslik = Buffer.alloc(6);
baslik.writeUInt16LE(0, 0);              // ayrılmış
baslik.writeUInt16LE(1, 2);              // tür: 1 = ikon
baslik.writeUInt16LE(pngler.length, 4);  // görsel sayısı

const girisler = [];
let konum = 6 + pngler.length * 16;
for (const { n, veri } of pngler) {
  const g = Buffer.alloc(16);
  g.writeUInt8(n === 256 ? 0 : n, 0);    // genişlik (256 ise 0 yazılır)
  g.writeUInt8(n === 256 ? 0 : n, 1);    // yükseklik
  g.writeUInt8(0, 2);                    // palet yok
  g.writeUInt8(0, 3);                    // ayrılmış
  g.writeUInt16LE(1, 4);                 // renk düzlemi
  g.writeUInt16LE(32, 6);                // bit derinliği
  g.writeUInt32LE(veri.length, 8);
  g.writeUInt32LE(konum, 12);
  girisler.push(g);
  konum += veri.length;
}

const ico = Buffer.concat([baslik, ...girisler, ...pngler.map((p) => p.veri)]);
writeFileSync('site/favicon.ico', ico);
console.log(`favicon.ico yazıldı — ${OLCULER.join(', ')} piksel · ${(ico.length / 1024).toFixed(1)} KB`);

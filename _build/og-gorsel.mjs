/* OG KAPAK ÜRETİCİ
   Paylaşım kartları (WhatsApp, LinkedIn, Slack, X) 1200×630 bekliyor.
   Sayfa görsellerimiz 1600px uzun kenar ve serbest oranda; olduğu gibi
   verilince platform ortadan kırpıyor ve çoğu zaman konu dışarıda kalıyor.

   Bu betik her OG görselini 1200×630'a, `odak` noktasına göre kırpar.
   `layout()` içindeki `og:image:width/height` bu ölçüyü bildiriyor;
   üretmeden o meta yanlış oluyordu.

   Çalıştır: node _build/og-gorsel.mjs */
import sharp from 'sharp';

/* Beyaz siluet logo — sitedeki `filter: brightness(0) invert(1)` karşılığı.
   Alfa kanalı maske olarak alınıp beyaz zemine geçiriliyor.
   `negate()` KULLANMA: bütün renkleri ters çevirip markayı maviye döndürüyor. */
async function beyazLogo(genislik) {
  const kaynak = sharp('site/assets/img/brand/logo.png').resize({ width: genislik });
  const { width, height } = await kaynak.clone().metadata();
  const alfa = await kaynak.clone().ensureAlpha().extractChannel('alpha').toBuffer();
  const beyaz = await sharp({ create: { width, height, channels: 3, background: '#ffffff' } })
    .png().toBuffer();
  return sharp(beyaz).joinChannel(alfa).png().toBuffer();
}
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const SITE = 'site/';
const HEDEF = SITE + 'assets/img/og/';

/* [kaynak, çıktı adı, yatay odak %, dikey odak %]
   Odak değerleri data.mjs'teki `odak` alanlarıyla aynı mantık: soldan ve
   üstten yüzde. Varsayılan 50/50 merkez kırpma. */
const ISLER = [
  /* Paylaşım kartı — "senfoni" el görseli. Kullanıcı seçimi: WhatsApp ve
     LinkedIn'de duygusal olarak en çok iş gören kare bu. Üzerine sol alta
     beyaz siluet logo basılıyor (aşağıda), böylece marka görünüyor ama
     fotoğrafa yapıştırılmış durmuyor. */
  ['assets/img/rev2/secilmis/abstract-woman-hands-touching-music-notes-nature-background-music-concept.jpg',
    'og-kapak.jpg', 50, 38],
  /* Dosya adı `gorsel-hazirla.mjs` tarafından kısaltılmış hâliyle diskte */
  ['assets/img/rev2/secilmis/brainstorming-collaboration-successful-partnership-analysis-by-young-business-as.jpg',
    'og-kurumsal.jpg', 50, 40],
];

mkdirSync(HEDEF, { recursive: true });

for (const [kaynak, ad, ox, oy] of ISLER) {
  const giris = SITE + kaynak;
  if (!existsSync(giris)) { console.log(`ATLANDI (kaynak yok): ${kaynak}`); continue; }
  const cikti = HEDEF + ad;

  const m = await sharp(giris).metadata();
  /* 1200×630 oranını doldur, sonra odak noktasına göre kırp */
  const oran = 1200 / 630;
  const kaynakOran = m.width / m.height;
  let kw, kh;
  if (kaynakOran > oran) { kh = m.height; kw = Math.round(m.height * oran); }
  else { kw = m.width; kh = Math.round(m.width / oran); }
  const left = Math.round(Math.max(0, Math.min(m.width - kw, (m.width - kw) * (ox / 100))));
  const top = Math.round(Math.max(0, Math.min(m.height - kh, (m.height - kh) * (oy / 100))));

  const taban = await sharp(giris)
    .extract({ left, top, width: kw, height: kh })
    .resize(1200, 630, { fit: 'fill' })
    .toBuffer();

  /* Alt kenara koyu geçiş: logo her fotoğrafta okunsun. */
  const perde = Buffer.from(
    `<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
     <stop offset="0%" stop-color="#131A15" stop-opacity="0.90"/>
     <stop offset="50%" stop-color="#131A15" stop-opacity="0.22"/>
     <stop offset="100%" stop-color="#131A15" stop-opacity="0"/></linearGradient></defs>
     <rect width="1200" height="630" fill="url(#g)"/></svg>`);

  await sharp(taban)
    .composite([{ input: perde }, { input: await beyazLogo(300), top: 478, left: 72 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(cikti);

  const s = await sharp(cikti).metadata();
  console.log(`${ad}  ${s.width}×${s.height}  ${(s.size / 1024).toFixed(0)} KB`);
}

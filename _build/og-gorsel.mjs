/* OG KAPAK ÜRETİCİ
   Paylaşım kartları (WhatsApp, LinkedIn, Slack, X) 1200×630 bekliyor.
   Sayfa görsellerimiz 1600px uzun kenar ve serbest oranda; olduğu gibi
   verilince platform ortadan kırpıyor ve çoğu zaman konu dışarıda kalıyor.

   Bu betik her OG görselini 1200×630'a, `odak` noktasına göre kırpar.
   `layout()` içindeki `og:image:width/height` bu ölçüyü bildiriyor;
   üretmeden o meta yanlış oluyordu.

   Çalıştır: node _build/og-gorsel.mjs */
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const SITE = 'site/';
const HEDEF = SITE + 'assets/img/og/';

/* [kaynak, çıktı adı, yatay odak %, dikey odak %]
   Odak değerleri data.mjs'teki `odak` alanlarıyla aynı mantık: soldan ve
   üstten yüzde. Varsayılan 50/50 merkez kırpma. */
const ISLER = [
  ['assets/img/rev2/secilmis/rest-after-work-office-beautiful-young-business-woman-black-suit-is-sitting-park.jpg',
    'og-kapak.jpg', 50, 25],
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

  await sharp(giris)
    .extract({ left, top, width: kw, height: kh })
    .resize(1200, 630, { fit: 'fill' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(cikti);

  const s = await sharp(cikti).metadata();
  console.log(`${ad}  ${s.width}×${s.height}  ${(s.size / 1024).toFixed(0)} KB`);
}

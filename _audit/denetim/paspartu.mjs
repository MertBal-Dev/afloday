/* PASPARTU (levha) düzeni — kırpmasız ama dış geometrisi tek tip.

   Fikir: her kart aynı dış orana sahip bir "levha". Fotoğraf levhanın
   içine doğal oranıyla, ortalanmış olarak monte edilir. Kırpma sıfır.
   Dış hizalama kusursuz, çünkü bütün levhalar aynı.

   Değişen tek şey: fotoğrafın etrafındaki paspartu payı. Yatay fotoğrafta
   üstte-altta, dikey fotoğrafta sağda-solda pay kalır.

   Ölçtüğümüz: levha ne kadar doluyor. Doluluk çok düşükse kart boş görünür,
   çok oynaksa ahenk bozulur. Aradığımız: yüksek ortalama doluluk + düşük sapma.

   Kıyas için "yan yana serbest" (hizalı satır) da hesaplanıyor. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const { olcumler } = JSON.parse(readFileSync(KOK + '_audit/rapor/oran.json', 'utf8'));

/* Fotoğraf levhaya "contain" ile oturur: kırpma yok, boşluk kalır.
   pay: levhanın kenarındaki en az iç boşluk oranı (0.06 = %6). */
const doluluk = (fotoOran, levhaOran, pay) => {
  const icEn = 1 - 2 * pay;                  /* levha eni 1 kabul */
  const icBoy = (1 / levhaOran) - 2 * pay;   /* levha boyu */
  if (icBoy <= 0) return 0;
  /* contain: hangi kenar önce dolarsa */
  const olcek = Math.min(icEn / fotoOran, icBoy) ;
  const fEn = fotoOran * olcek, fBoy = olcek;
  return (fEn * fBoy) / (1 * (1 / levhaOran));
};

const dene = (ad, levhaOran, pay) => {
  const d = olcumler.map((m) => doluluk(m.oran, levhaOran, pay));
  const ort = d.reduce((a, b) => a + b, 0) / d.length;
  const sapma = Math.sqrt(d.reduce((a, b) => a + (b - ort) ** 2, 0) / d.length);
  const enAz = Math.min(...d);
  console.log(`  ${ad.padEnd(26)} doluluk ort %${(ort * 100).toFixed(1).padStart(5)} · sapma %${(sapma * 100).toFixed(1).padStart(4)} · en boş %${(enAz * 100).toFixed(1)}`);
  return { ort, sapma };
};

console.log('=== TEK LEVHA ORANI, %6 paspartu payı ===\n');
for (const [ad, o] of [['1/1 kare levha', 1], ['4/5 dikey levha', 0.8],
  ['3/4 dikey levha', 0.75], ['5/4 yatay levha', 1.25], ['4/3 yatay levha', 1.3333]]) {
  dene(ad, o, 0.06);
}

console.log('\n=== TEK LEVHA ORANI, paspartu payı değişiyor (1/1 levha) ===\n');
for (const p of [0.03, 0.06, 0.09, 0.12]) dene(`pay %${(p * 100).toFixed(0)}`, 1, p);

console.log('\n=== İKİ LEVHA: dikey fotoğraflar dikey levhaya, yatay yataya ===\n');
{
  const dikeyler = olcumler.filter((m) => m.oran < 1);
  const yataylar = olcumler.filter((m) => m.oran >= 1);
  const hesap = (liste, lo) => {
    const d = liste.map((m) => doluluk(m.oran, lo, 0.06));
    const ort = d.reduce((a, b) => a + b, 0) / d.length;
    const sapma = Math.sqrt(d.reduce((a, b) => a + (b - ort) ** 2, 0) / d.length);
    return { ort, sapma, n: liste.length };
  };
  const a = hesap(dikeyler, 0.8);
  const b = hesap(yataylar, 1.25);
  console.log(`  dikey levha 4/5  (${a.n} foto)  doluluk ort %${(a.ort * 100).toFixed(1)} · sapma %${(a.sapma * 100).toFixed(1)}`);
  console.log(`  yatay levha 5/4  (${b.n} foto)  doluluk ort %${(b.ort * 100).toFixed(1)} · sapma %${(b.sapma * 100).toFixed(1)}`);
  const tOrt = (a.ort * a.n + b.ort * b.n) / olcumler.length;
  console.log(`  BİRLEŞİK doluluk ort %${(tOrt * 100).toFixed(1)}`);
  console.log('  not: iki levha tipi yan yana gelirse dış geometri yine iki tip olur.');
}

console.log('\n=== KIYAS: yan yana serbest (hizalı satır) ===');
console.log('  doluluk %100 — paspartu yok, ama kart genişlikleri satır içinde değişiyor.');
console.log('  dış geometri tek tip DEĞİL. Karmaşa riski burada.\n');

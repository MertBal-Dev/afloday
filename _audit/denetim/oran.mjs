/* Görsellerin doğal en/boy oranı ile CSS çerçevelerinin oranı.
   Kırpma yüzdesi = çerçeveye sığdırmak için atılan alan.

   Soru: sabit oranlı çerçeve mi kullanmalıyız, yoksa yerleşim görselin
   oranına mı uymalı? Cevap dağılımdan çıkar. */
import sharp from 'sharp';
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = fileURLToPath(new URL('../../', import.meta.url));
const CIKTI = KOK + '_audit/rapor/';
mkdirSync(CIKTI, { recursive: true });

/* Özgün kaynaklar: her görselin tek bir temsilcisi yeter, türev
   boyutlar aynı oranı taşıyor. .webp/.avif türevlerini atlıyoruz. */
const topla = (dizin, biriken = []) => {
  for (const ad of readdirSync(dizin)) {
    const p = path.join(dizin, ad);
    if (statSync(p).isDirectory()) topla(p, biriken);
    else if (/\.(jpe?g|png)$/i.test(ad) && !/-\d+w\./.test(ad)) {
      /* Logo, marka ve OG kapakları çerçeveye girmiyor, havuzun dışında */
      const g = p.replace(/\\/g, '/');
      if (/\/(logos|brand|og)\//.test(g)) continue;
      biriken.push(p);
    }
  }
  return biriken;
};

const dosyalar = topla(KOK + 'site/assets/img');
const olcumler = [];
for (const f of dosyalar) {
  try {
    const m = await sharp(f).metadata();
    if (!m.width || !m.height) continue;
    olcumler.push({
      yol: f.replace(KOK + 'site/assets/img/', '').replace(/\\/g, '/'),
      en: m.width, boy: m.height, oran: +(m.width / m.height).toFixed(3),
    });
  } catch { /* okunamadı */ }
}

/* Oran kümeleri */
const kova = (o) => {
  if (o < 0.62) return 'çok dikey (<1:1.6)';
  if (o < 0.85) return 'dikey (3:4 civarı)';
  if (o < 1.18) return 'kare (1:1 civarı)';
  if (o < 1.45) return 'yatay (4:3 civarı)';
  if (o < 1.85) return 'yatay geniş (3:2 – 16:9)';
  return 'çok geniş (>1.85)';
};

const gruplar = {};
for (const m of olcumler) (gruplar[kova(m.oran)] ||= []).push(m);

console.log(`=== GÖRSEL ORAN DAĞILIMI (${olcumler.length} özgün görsel) ===\n`);
const sira = ['çok dikey (<1:1.6)', 'dikey (3:4 civarı)', 'kare (1:1 civarı)',
  'yatay (4:3 civarı)', 'yatay geniş (3:2 – 16:9)', 'çok geniş (>1.85)'];
for (const k of sira) {
  const l = gruplar[k] || [];
  if (!l.length) continue;
  const yuzde = ((l.length / olcumler.length) * 100).toFixed(0);
  console.log(`  ${String(l.length).padStart(3)}  %${String(yuzde).padStart(2)}  ${k}`);
}

/* CSS'teki sabit oranlı çerçeveler */
const css = readFileSync(KOK + 'site/assets/css/afloday.css', 'utf8');
const cerceveler = [];
css.split('\n').forEach((s, i) => {
  const m = s.match(/aspect-ratio\s*:\s*([\d.]+)\s*\/\s*([\d.]+)/);
  if (m) cerceveler.push({ satir: i + 1, oran: +(+m[1] / +m[2]).toFixed(3), ham: `${m[1]}/${m[2]}` });
});

console.log(`\n=== CSS'TEKİ SABİT ORANLI ÇERÇEVELER (${cerceveler.length}) ===\n`);
const cGrup = {};
for (const c of cerceveler) (cGrup[c.ham] ||= []).push(c.satir);
for (const [ham, satirlar] of Object.entries(cGrup).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${String(satirlar.length).padStart(2)}× ${ham.padEnd(10)} (${(+ham.split('/')[0] / +ham.split('/')[1]).toFixed(2)})  satır ${satirlar.slice(0, 6).join(', ')}`);
}

/* Her çerçeve oranı için: görselleri object-fit:cover ile sığdırınca
   ortalama ne kadarı kırpılıyor */
console.log(`\n=== KIRPMA: her çerçeve oranı tüm havuza uygulanırsa ===\n`);
for (const ham of Object.keys(cGrup)) {
  const co = +ham.split('/')[0] / +ham.split('/')[1];
  let toplam = 0, agir = 0;
  for (const m of olcumler) {
    /* cover: kısa kenar doldurulur, uzun kenardan kesilir */
    const kalan = m.oran > co ? co / m.oran : m.oran / co;
    const kirpma = (1 - kalan) * 100;
    toplam += kirpma;
    if (kirpma > 40) agir++;
  }
  const ort = (toplam / olcumler.length).toFixed(1);
  console.log(`  ${ham.padEnd(10)} ortalama %${ort} kırpma · %40'tan fazla kırpılan: ${agir}/${olcumler.length}`);
}

writeFileSync(CIKTI + 'oran.json', JSON.stringify({ olcumler, cerceveler }, null, 1));
console.log('\nRapor: _audit/rapor/oran.json');

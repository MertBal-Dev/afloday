/* Galeri küçük resimleri (NNs.jpg, 300×300) yerine afloday.com'un sunduğu
   tam boy sürümleri (NN.jpg, ~900px) indirir. Işık kutusunda net görünsün diye. */
import { readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';

const KOK = new URL('../site/assets/img/afloday/0/', import.meta.url);
const TAM = new URL('../site/assets/img/afloday/tam/', import.meta.url);

/* JPEG başlığından boyut oku — harici bağımlılık yok */
function olc(b) {
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { w: 0, h: 0 };
}

let indi = 0, atlandi = 0, yok = 0;
const rapor = [];

for (const klasor of readdirSync(KOK, { withFileTypes: true })) {
  if (!klasor.isDirectory()) continue;
  const ad = klasor.name;
  const hedefDir = new URL(ad + '/', TAM);
  mkdirSync(hedefDir, { recursive: true });

  for (const dosya of readdirSync(new URL(ad + '/', KOK))) {
    const m = dosya.match(/^(.*?)s\.jpg$/i);
    if (!m) continue;                              // zaten tam boy
    const tamAd = m[1] + '.jpg';
    const hedef = new URL(tamAd, hedefDir);
    if (existsSync(hedef) && statSync(hedef).size > 1024) { atlandi++; continue; }

    const url = `https://www.afloday.com/images/0/${ad}/${tamAd}`;
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
      if (!r.ok) { yok++; continue; }
      const b = Buffer.from(await r.arrayBuffer());
      if (b.length < 2048) { yok++; continue; }
      writeFileSync(hedef, b);
      const d = olc(b);
      rapor.push(`${ad}/${tamAd}  ${d.w}x${d.h}  ${Math.round(b.length / 1024)}KB`);
      indi++;
    } catch { yok++; }
  }
}

console.log(rapor.slice(0, 6).join('\n'));
console.log(`\nindirildi: ${indi} · zaten vardı: ${atlandi} · sunucuda yok: ${yok}`);

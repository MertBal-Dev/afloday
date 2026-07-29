// İndirilen görselleri boyut/oran bilgisiyle katalogla, kullanılabilir olanları ayıkla.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('_arsiv');

function pngSize(b) {
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}
function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    if (m === 0xd8 || (m >= 0xd0 && m <= 0xd9)) { i += 2; continue; }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
function gifSize(b) {
  if (b.slice(0, 3).toString() !== 'GIF') return null;
  return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
}
function webpSize(b) {
  if (b.slice(0, 4).toString() !== 'RIFF') return null;
  const fmt = b.slice(12, 16).toString();
  if (fmt === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (fmt === 'VP8L') {
    const bits = b.readUInt32LE(21);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (fmt === 'VP8X') return { w: (b.readUIntLE(24, 3) & 0xffffff) + 1, h: (b.readUIntLE(27, 3) & 0xffffff) + 1 };
  return null;
}

const files = await readdir(DIR);
const rows = [];
for (const f of files) {
  const p = path.join(DIR, f);
  let buf;
  try { buf = await readFile(p); } catch { continue; }
  const dim = pngSize(buf) || jpegSize(buf) || gifSize(buf) || webpSize(buf);
  if (!dim || !dim.w) continue;
  rows.push({
    file: f,
    w: dim.w, h: dim.h,
    ratio: +(dim.w / dim.h).toFixed(2),
    kb: Math.round(buf.length / 1024),
    px: dim.w * dim.h,
  });
}

rows.sort((a, b) => b.px - a.px);

// Kullanışlı: en az 700px genişlik, fotoğraf oranında, ikon/logo olmayan
const usable = rows.filter(r => r.w >= 700 && r.h >= 400);
const medium = rows.filter(r => r.w >= 350 && r.w < 700 && r.h >= 250);
const logos = rows.filter(r => /ref|logo/i.test(r.file));

const report = {
  toplam: rows.length,
  buyukFotograf: usable.length,
  ortaFotograf: medium.length,
  logolar: logos.length,
  BUYUK: usable.map(r => `${r.file} — ${r.w}x${r.h} (${r.ratio}) ${r.kb}KB`),
  ORTA: medium.map(r => `${r.file} — ${r.w}x${r.h} (${r.ratio}) ${r.kb}KB`),
  LOGOLAR: logos.map(r => `${r.file} — ${r.w}x${r.h} ${r.kb}KB`),
};
await writeFile('_audit/catalog.json', JSON.stringify(report, null, 2));

console.log(`Toplam okunabilir görsel: ${rows.length}`);
console.log(`Büyük foto (>=700px): ${usable.length}`);
console.log(`Orta foto: ${medium.length}`);
console.log(`Referans logo: ${logos.length}\n`);
console.log('--- EN BÜYÜK 45 ---');
usable.slice(0, 45).forEach(r => console.log(`${r.w}x${r.h}  ${String(r.kb).padStart(5)}KB  ${r.file}`));
console.log('\n--- LOGOLAR ---');
logos.slice(0, 45).forEach(r => console.log(`${r.w}x${r.h}  ${r.file}`));

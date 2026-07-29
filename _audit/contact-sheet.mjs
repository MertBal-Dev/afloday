// Büyük görsellerden kontakt föy üret — tek ekran görüntüsünde hepsini görmek için.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('site/assets/img/_raw');

function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    if (m === 0xd8 || (m >= 0xd0 && m <= 0xd9)) { i += 2; continue; }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
function pngSize(b) {
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const files = await readdir(DIR);
const rows = [];
for (const f of files) {
  if (/ref__|logo|icon|favicon/i.test(f)) continue;
  let buf; try { buf = await readFile(path.join(DIR, f)); } catch { continue; }
  const d = jpegSize(buf) || pngSize(buf);
  if (!d || d.w < 600 || d.h < 380) continue;
  rows.push({ f, ...d, kb: Math.round(buf.length / 1024) });
}
rows.sort((a, b) => a.f.localeCompare(b.f));

const cells = rows.map((r, i) => `
  <figure>
    <img src="../site/assets/img/_raw/${encodeURIComponent(r.f)}" loading="eager">
    <figcaption><b>${i + 1}.</b> ${r.f}<br>${r.w}×${r.h}</figcaption>
  </figure>`).join('');

await writeFile('_audit/contact-sheet.html', `<!doctype html><meta charset="utf-8">
<style>
  body{background:#111;color:#eee;font:11px/1.35 system-ui;margin:0;padding:12px}
  .g{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
  figure{margin:0}
  img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#222}
  figcaption{font-size:9px;color:#9a9;padding-top:3px;word-break:break-all;line-height:1.25}
  h1{font:600 14px system-ui;margin:0 0 10px}
</style>
<h1>Afloday görsel arşivi — ${rows.length} aday</h1>
<div class="g">${cells}</div>`);

console.log(`${rows.length} aday görsel, _audit/contact-sheet.html yazıldı`);

// Düzeltilmesi gereken kategoriler için hedefli kontakt föy.
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIR = path.resolve('site/assets/img/_raw');
const GROUPS = {
  'ÇT-02 fanus': /^0__fanus__\d+\.jpg$/,
  'ÇT-04 tütsü/herbaryum adayı (cerceve)': /^0__cerceve__\d+\.jpg$/,
  'BT-01 kokedama': /^0__kokedama__\d+\.jpg$/,
  'BT-02 minyatür bahçe': /^0__minyatur-bahce__\d+\.jpg$/,
  'BT-04 kavanoz teraryum': /^0__kavanoz-teraryum__\d+\.jpg$/,
  'BT-05 doğa çerçeve': /^0__doga-cerceve__\d+\.jpg$/,
  'ÇH-01 mini kavanoz': /^0__mini-kavanoz__\d+\.jpg$/,
};

const files = await readdir(DIR);
let html = `<!doctype html><meta charset="utf-8">
<style>
  body{background:#111;color:#eee;font:12px/1.4 system-ui;margin:0;padding:14px}
  h2{font:600 13px system-ui;margin:16px 0 8px;color:#f9c}
  .g{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}
  img{width:100%;aspect-ratio:1;object-fit:cover;display:block;background:#222}
  figure{margin:0}figcaption{font-size:10px;color:#9c9;padding-top:3px}
</style>
<h1 style="font:600 15px system-ui;margin:0">DÜZELTİLECEK KARTLAR</h1>`;

for (const [label, re] of Object.entries(GROUPS)) {
  const matches = files.filter(f => re.test(f)).sort();
  html += `<h2>${label} — ${matches.length} aday</h2><div class="g">`;
  for (const f of matches) {
    html += `<figure><img src="/site/assets/img/_raw/${encodeURIComponent(f)}"><figcaption>${f.replace(/^0__/, '').replace('.jpg', '')}</figcaption></figure>`;
  }
  html += `</div>`;
}

await writeFile('_audit/fix-sheet.html', html);
console.log('_audit/fix-sheet.html yazıldı');

/* afloday.com'daki TÜM görselleri, orijinal klasör yapısını koruyarak indirir.
   Kaynak: _audit/orijinal-gorseller.json (yol → hangi sayfalarda geçtiği). */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

const map = JSON.parse(readFileSync(new URL('./orijinal-gorseller.json', import.meta.url), 'utf8'));
const ROOT = new URL('../site/assets/img/afloday/', import.meta.url);

let indi = 0, atlandi = 0, hata = [];
const boyut = {};

for (const [path, sayfalar] of Object.entries(map)) {
  if (!path.startsWith('/')) continue;
  if (/^\/media\/jce\//.test(path)) continue;              // editör ikonu
  const rel = path.replace(/^\/images\//, '');
  const dest = new URL(rel, ROOT);
  if (existsSync(dest) && statSync(dest).size > 1024) { atlandi++; boyut[path] = statSync(dest).size; continue; }
  try {
    const res = await fetch('https://www.afloday.com' + encodeURI(path), { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) { hata.push(`${res.status} ${path}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 512) { hata.push(`bos ${path}`); continue; }
    mkdirSync(dirname(dest.pathname.slice(1).replace(/\//g, '\\')), { recursive: true });
    mkdirSync(new URL('.', dest), { recursive: true });
    writeFileSync(dest, buf);
    boyut[path] = buf.length;
    indi++;
  } catch (e) { hata.push(`${e.message} ${path}`); }
}

writeFileSync(new URL('./gorsel-boyut.json', import.meta.url), JSON.stringify(boyut, null, 1), 'utf8');
console.log(`indirildi: ${indi} · zaten vardı: ${atlandi} · hata: ${hata.length}`);
if (hata.length) console.log(hata.slice(0, 20).join('\n'));

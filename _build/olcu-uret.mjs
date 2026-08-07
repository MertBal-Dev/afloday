/* GÖRSEL ÖLÇÜ ÇIKARICI — node _build/olcu-uret.mjs
   ────────────────────────────────────────────────────────────────────────
   Her fotoğrafın gerçek en-boy oranını çıkarır ve `gorsel-olculeri.mjs`
   olarak yazar. Mozaik ve şerit çerçeveyi bu orandan kuruyor; böylece
   çerçeve fotoğrafa uyuyor, fotoğraf çerçeveye zorlanmıyor.

   Gerekçe: Sürdürülebilirlik kategorisinde iki kişinin teraryum tuttuğu
   DİKEY kare, 3:2 yatay çerçeveye sokulunca teraryumlar kesiliyordu —
   yani atölyenin ürünü kayboluyordu. */
import sharp from 'sharp';
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

/* Tarama kökü `img` — eskiden yalnız `img/rev2` taranıyordu ve ekip,
   sürdürülebilirlik, koruncuk klasörlerindeki fotoğraflar kayıt dışıydı.
   Bant motoru oranı bilmediği fotoğrafa varsayılan uygular ve kırpar,
   o yüzden havuzun tamamı gerekiyor.

   Anahtar biçimi: `rev2/` altındakiler eski kısa hâliyle kalıyor (yüzlerce
   çağrı ona bakıyor), diğerleri `img/`ye göreli tam yolla giriyor. */
const IMG = 'site/assets/img';
const REV2 = IMG + '/rev2';
const olcu = {};

const gez = async (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { await gez(p); continue; }
    if (!/\.(jpe?g|png)$/i.test(e.name)) continue;
    if (/-\d+w\./.test(e.name)) continue;              /* türev boyutlar */
    let m;
    try { m = await sharp(p).metadata(); } catch { continue; }
    if (!m.width || !m.height) continue;
    const duz = p.split(path.sep).join('/');
    const anahtar = duz.startsWith(REV2 + '/')
      ? duz.replace(REV2 + '/', '').replace(/\.(jpe?g|png)$/i, '')
      : duz.replace(IMG + '/', '').replace(/\.(jpe?g|png)$/i, '');
    olcu[anahtar] = [m.width, m.height];
  }
};
await gez(IMG);

const satirlar = Object.entries(olcu).sort(([a], [b]) => a.localeCompare(b))
  .map(([k, [w, h]]) => `  '${k}': [${w}, ${h}],`).join('\n');

const govde = [
  '/* OTOMATİK ÜRETİLDİ — node _build/olcu-uret.mjs',
  '',
  '   Her fotoğrafın piksel ölçüsü. Mozaik ve şerit çerçeveyi bu orandan',
  '   kuruyor: dikey fotoğraf dikey çerçeveye, yatay fotoğraf yatay',
  '   çerçeveye giriyor ve kırpma sıfıra iniyor.',
  '',
  '   Gerekçe: Sürdürülebilirlik kategorisinde iki kişinin teraryum tuttuğu',
  '   DİKEY kare 3:2 yatay çerçeveye sokulunca teraryumlar — yani atölyenin',
  '   ürünü — kesiliyordu. Fotoğrafın anlamı çerçevede kayboluyordu.',
  '',
  `   ${Object.keys(olcu).length} görsel. */`,
  'export const gorselOlculeri = {',
  satirlar,
  '};',
  '',
  '/* Oranı ver; bilinmiyorsa 3:2 varsay (havuzun çoğunluğu). */',
  'export const oran = (yol) => {',
  '  const o = gorselOlculeri[yol];',
  '  return o ? o[0] / o[1] : 1.5;',
  '};',
  '',
  '/* CSS aspect-ratio için sadeleştirilmiş kesir. Ham oranı yazmak yerine',
  '   en yakın basit kesire yuvarlanıyor: 1600/1067 yerine 3/2 gibi.',
  '   Kayıp yüzde birin altında kalıyor, çıktı okunur oluyor. */',
  'export const cerceveOrani = (yol) => {',
  '  const o = oran(yol);',
  '  const adaylar = [[2, 3], [3, 4], [4, 5], [1, 1], [5, 4], [4, 3], [3, 2], [16, 9]];',
  '  let en = adaylar[0], fark = Infinity;',
  '  for (const [a, b] of adaylar) {',
  '    const d = Math.abs(a / b - o);',
  '    if (d < fark) { fark = d; en = [a, b]; }',
  '  }',
  '  return en[0] + " / " + en[1];',
  '};',
  '',
].join('\n');

writeFileSync('_build/gorsel-olculeri.mjs', govde, 'utf8');

const d = Object.values(olcu);
const yatay = d.filter(([w, h]) => w / h > 1.15).length;
const dikey = d.filter(([w, h]) => w / h < 0.9).length;
console.log(`  ${d.length} görsel ölçüldü`);
console.log(`  yatay ${yatay} · dikey ${dikey} · kareye yakın ${d.length - yatay - dikey}`);

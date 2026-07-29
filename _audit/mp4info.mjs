/* ffmpeg olmadan MP4 künyesi: süre, boyut, kodek, moov konumu. */
import { openSync, readSync, closeSync, statSync } from 'node:fs';

const file = process.argv[2];
const size = statSync(file).size;
const fd = openSync(file, 'r');
const read = (pos, len) => { const b = Buffer.alloc(len); readSync(fd, b, 0, len, pos); return b; };

function boxes(start, end, depth = 0, want = null, out = []) {
  let p = start;
  while (p < end - 8) {
    const head = read(p, 16);
    let sz = head.readUInt32BE(0);
    const type = head.slice(4, 8).toString('latin1');
    let hs = 8;
    if (sz === 1) { sz = Number(head.readBigUInt64BE(8)); hs = 16; }
    if (sz === 0) sz = end - p;
    if (sz < 8) break;
    out.push({ type, pos: p, size: sz, depth });
    const container = ['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'udta'].includes(type);
    if (container && depth < 5) boxes(p + hs, p + sz, depth + 1, want, out);
    p += sz;
  }
  return out;
}

const all = boxes(0, size);
const top = all.filter(b => b.depth === 0);
console.log('Üst düzey kutular:', top.map(b => `${b.type}(${(b.size / 1048576).toFixed(1)}MB)`).join(' '));

const moov = all.find(b => b.type === 'moov');
const mdat = all.find(b => b.type === 'mdat');
console.log('moov konumu :', moov ? moov.pos : '-', '| mdat konumu:', mdat ? mdat.pos : '-');
console.log('Hızlı başlangıç (faststart):', moov && mdat && moov.pos < mdat.pos ? 'EVET' : 'HAYIR — moov sonda, akış için kötü');

const mvhd = all.find(b => b.type === 'mvhd');
if (mvhd) {
  const b = read(mvhd.pos + 8, 32);
  const ver = b[0];
  const timescale = ver === 1 ? b.readUInt32BE(20) : b.readUInt32BE(12);
  const dur = ver === 1 ? Number(b.readBigUInt64BE(24)) : b.readUInt32BE(16);
  const sec = dur / timescale;
  console.log('Süre        :', Math.floor(sec / 60) + ' dk ' + Math.round(sec % 60) + ' sn', `(${sec.toFixed(1)} sn)`);
  console.log('Ortalama bit hızı:', ((size * 8) / sec / 1e6).toFixed(2), 'Mbps');
}

for (const tkhd of all.filter(b => b.type === 'tkhd')) {
  const b = read(tkhd.pos + 8, 92);
  const ver = b[0];
  const off = ver === 1 ? 84 : 72;
  const w = b.readUInt32BE(off) / 65536;
  const h = b.readUInt32BE(off + 4) / 65536;
  if (w && h) console.log('Görüntü izi :', `${w}x${h}`, `(oran ${(w / h).toFixed(3)})`);
}

const codecs = all.filter(b => ['avc1', 'hev1', 'hvc1', 'mp4a', 'av01', 'vp09'].includes(b.type));
if (codecs.length) console.log('Kodekler    :', [...new Set(codecs.map(c => c.type))].join(', '));

console.log('Dosya boyutu:', (size / 1048576).toFixed(1), 'MB');
closeSync(fd);

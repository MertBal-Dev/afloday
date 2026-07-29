/* Afloday logosunun düz beyaz zeminini şeffafa çevirir (RGB -> RGBA).
   Harici bağımlılık yok: PNG elle çözülür, alfa eklenir, yeniden yazılır.
   curate adımından SONRA çalışmalıdır — aksi halde kopyalama üzerine yazar. */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync, deflateSync } from 'node:zlib';

const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return (buf) => {
    let c = -1;
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();

const readChunks = (buf) => {
  const out = [];
  let p = 8;
  while (p < buf.length) {
    const len = buf.readUInt32BE(p);
    out.push({ type: buf.slice(p + 4, p + 8).toString('latin1'), data: buf.slice(p + 8, p + 8 + len) });
    p += 12 + len;
  }
  return out;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(td));
  return Buffer.concat([len, td, crc]);
};

const paeth = (a, b, c) => {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

function unfilter(raw, w, h, bpp) {
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const ft = raw[pos++];
    const line = raw.slice(pos, pos + stride); pos += stride;
    const cur = out.slice(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev[x], c = x >= bpp ? prev[x - bpp] : 0;
      let v = line[x];
      if (ft === 1) v += a; else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1; else if (ft === 4) v += paeth(a, b, c);
      cur[x] = v & 0xff;
    }
  }
  return out;
}

export function makeLogoTransparent(file = 'site/assets/img/brand/logo.png') {
  const buf = readFileSync(file);
  const chunks = readChunks(buf);
  const ihdr = chunks.find(c => c.type === 'IHDR').data;
  const w = ihdr.readUInt32BE(0), h = ihdr.readUInt32BE(4);

  if (ihdr[9] === 6) return { skipped: true, reason: 'zaten RGBA' };
  if (ihdr[8] !== 8 || ihdr[9] !== 2 || ihdr[12] !== 0) {
    return { skipped: true, reason: `desteklenmeyen format (bit ${ihdr[8]}, tip ${ihdr[9]})` };
  }

  const rgb = unfilter(inflateSync(Buffer.concat(chunks.filter(c => c.type === 'IDAT').map(c => c.data))), w, h, 3);

  const HI = 246, LO = 205;  // üstü tam şeffaf / altı tam opak; arası yumuşak geçiş
  let cleared = 0, feathered = 0;
  const rgba = Buffer.alloc(w * h * 4);
  for (let i = 0, j = 0; i < rgb.length; i += 3, j += 4) {
    const r = rgb[i], g = rgb[i + 1], b = rgb[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    let a = 255;
    if (spread < 26) {
      if (lum >= HI) { a = 0; cleared++; }
      else if (lum > LO) { a = Math.round(255 * (HI - lum) / (HI - LO)); feathered++; }
    }
    rgba[j] = r; rgba[j + 1] = g; rgba[j + 2] = b; rgba[j + 3] = a;
  }

  const stride = w * 4;
  const rawOut = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    rawOut[y * (stride + 1)] = 0;
    rgba.copy(rawOut, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const newIhdr = Buffer.from(ihdr);
  newIhdr[9] = 6;
  writeFileSync(file, Buffer.concat([
    buf.slice(0, 8), chunk('IHDR', newIhdr),
    chunk('IDAT', deflateSync(rawOut, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]));

  return { skipped: false, w, h, cleared, feathered };
}

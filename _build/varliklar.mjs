/* site/assets → public/assets kopyalama.
   Varlıkların tek kaynağı site/assets. Next.js yalnızca public/ altını sunduğu
   için derlemeden önce buraya kopyalanıyor; public/ git'te izlenmiyor. */
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const KAYNAK = path.resolve('site/assets');
const HEDEF = path.resolve('public/assets');

await rm(HEDEF, { recursive: true, force: true });
await mkdir(path.dirname(HEDEF), { recursive: true });
await cp(KAYNAK, HEDEF, { recursive: true });

/* Kök dizinde durması gereken dosyalar. `<link rel="icon">` etiketi zaten
   var ama araçlar ve bazı tarayıcılar doğrudan /favicon.ico istiyor;
   dosya yoksa 404 düşüyordu. public/ git'te izlenmediği için buraya
   her derlemede kopyalanıyor. */
for (const ad of ['favicon.ico']) {
  try {
    await cp(path.resolve('site', ad), path.resolve('public', ad));
    console.log(`Kök dosyası kopyalandı: site/${ad} → public/${ad}`);
  } catch { /* dosya yoksa sessizce geç */ }
}

console.log('Varlıklar kopyalandı: site/assets → public/assets');

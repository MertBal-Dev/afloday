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
console.log('Varlıklar kopyalandı: site/assets → public/assets');

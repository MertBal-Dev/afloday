/* site/assets altında hiçbir yerden referans verilmeyen dosyaları bulur.
   HTML, CSS (`url()`), JS ve veri dosyalarındaki tüm `assets/...` yollarını
   toplayıp diskteki dosyalarla karşılaştırır. */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync } from 'node:fs';
const KOK_ = fileURLToPath(new URL('../../', import.meta.url));
const SITE_ = KOK_ + 'site/';
const RAPOR_ = KOK_ + '_audit/rapor/';
mkdirSync(RAPOR_, { recursive: true });


const KOK = KOK_;
const kullanilan = new Set();

const tara = (d) => {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const y = path.join(d, f.name);
    if (f.isDirectory()) {
      if (!/^(node_modules|\.next|out|\.git)$/.test(f.name)) tara(y);
    } else if (/\.(html|css|js|mjs|ts|tsx|json|md)$/i.test(f.name)) {
      let t = '';
      try { t = readFileSync(y, 'utf8'); } catch { continue; }
      for (const m of t.matchAll(/assets\/[\w./%-]+\.(?:jpg|jpeg|png|webp|svg|mp4|webm|pdf|ico|woff2?)/gi))
        kullanilan.add(m[0].toLowerCase());
    }
  }
};
for (const d of ['site', '_build', 'app', 'docs']) {
  try { tara(KOK + d); } catch { /* yok */ }
}

const diskte = [];
const gez = (d) => {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const y = path.join(d, f.name);
    if (f.isDirectory()) gez(y);
    else {
      const norm = y.replace(/\\/g, '/');
      diskte.push({
        yol: norm,
        rel: norm.slice(norm.indexOf('assets/')).toLowerCase(),
        kb: statSync(y).size / 1024,
      });
    }
  }
};
gez(KOK + 'site/assets');

const sahipsiz = diskte.filter((f) => !kullanilan.has(f.rel));
console.log(`diskte ${diskte.length} dosya · kodda geçen ${kullanilan.size} yol`);
console.log(`SAHİPSİZ: ${sahipsiz.length} dosya · ${(sahipsiz.reduce((t, f) => t + f.kb, 0) / 1024).toFixed(1)} MB\n`);

const grup = {};
for (const f of sahipsiz) {
  const k = path.dirname(f.yol).replace(/\\/g, '/').replace(KOK, '');
  (grup[k] ||= { n: 0, mb: 0 });
  grup[k].n++; grup[k].mb += f.kb / 1024;
}
for (const [k, v] of Object.entries(grup).sort((a, b) => b[1].mb - a[1].mb))
  console.log(`  ${String(v.n).padStart(4)} dosya · ${v.mb.toFixed(1).padStart(6)} MB  ${k}`);

/* Silme listesini yaz — elle gözden geçirilecek */
const S = RAPOR_;
const { writeFileSync } = await import('node:fs');
writeFileSync(S + 'sahipsiz-liste.txt', sahipsiz.map((f) => f.yol).join('\n'));
console.log(`\nliste: scratchpad/sahipsiz-liste.txt`);

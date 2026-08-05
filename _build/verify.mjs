/* Tüm üretilen sayfaları denetle: kırık bağlantı, eksik görsel, alt metni,
   başlık hiyerarşisi, meta etiketleri. `node _build/verify.mjs` */
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const SITE = path.resolve('site');
const files = (await readdir(SITE)).filter(f => f.endsWith('.html'));

const problems = [];
const flag = (file, kind, detail) => problems.push({ file, kind, detail });

const exists = async (p) => { try { await access(p); return true; } catch { return false; } };

/* Adresler canlı afloday.com'daki gibi uzantısız (vercel.json → cleanUrls).
   Bir bağlantıyı çözerken önce olduğu gibi, sonra ".html" ekleyerek bakılıyor;
   "/" ise anasayfaya karşılık geliyor. */
const cozumle = (href) => {
  const yol = href.replace(/^\//, '');
  if (!yol) return 'index.html';
  return yol.endsWith('.html') ? yol : yol + '.html';
};
const hedefVar = async (href) => {
  const y = cozumle(href);
  return (await exists(path.join(SITE, y))) || (await exists(path.join(SITE, href.replace(/^\//, ''))));
};

let totalImgs = 0, totalLinks = 0;

for (const file of files) {
  const html = await readFile(path.join(SITE, file), 'utf8');

  /* --- başlık hiyerarşisi --- */
  const h1s = [...html.matchAll(/<h1[\s>]/g)];
  if (h1s.length === 0) flag(file, 'H1', '<h1> yok');
  if (h1s.length > 1) flag(file, 'H1', `${h1s.length} adet <h1> var (1 olmalı)`);

  /* --- meta --- */
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) flag(file, 'META', 'description eksik ya da 50 karakterden kısa');
  if (!/<meta property="og:image"/.test(html)) flag(file, 'META', 'og:image yok');
  if (!/<link rel="canonical"/.test(html)) flag(file, 'META', 'canonical yok');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
  if (!title) flag(file, 'META', 'title yok');
  else if (title.length > 65) flag(file, 'META', `title ${title.length} karakter (65 üstü kesilir): "${title}"`);

  /* --- dil --- */
  if (!/<html lang="tr">/.test(html)) flag(file, 'A11Y', 'lang="tr" yok');
  if (!/class="skip"/.test(html)) flag(file, 'A11Y', 'içeriğe geç bağlantısı yok');

  /* --- görseller --- */
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    const attrs = m[1];
    // Işık kutusunun boş çerçevesi — kaynağı ve alt'ı çalışma anında JS doldurur
    if (/class="lb-img"/.test(attrs)) continue;
    totalImgs++;
    const src = attrs.match(/src="([^"]+)"/)?.[1];
    const alt = attrs.match(/alt="([^"]*)"/);
    if (!src) { flag(file, 'IMG', 'src yok'); continue; }
    /* Süs görselinin doğru alt metni boş alt metindir; ekran okuyucu onu
       atlamalı. Niyetin unutkanlıktan ayrılması için role="presentation"
       şart koşuluyor — işaretlenmemiş boş alt hâlâ hata. */
    const dekor = /role="presentation"/.test(attrs);
    if (!alt) flag(file, 'IMG', `alt niteliği yok: ${src}`);
    else if (!alt[1].trim() && !dekor) flag(file, 'IMG', `alt boş: ${src}`);
    if (!/^https?:/.test(src) && !(await exists(path.join(SITE, src)))) {
      flag(file, 'IMG', `dosya yok: ${src}`);
    }
    if (!/width="\d+"/.test(attrs) || !/height="\d+"/.test(attrs)) {
      flag(file, 'IMG', `width/height yok (düzen kayması riski): ${src}`);
    }
  }

  /* --- bağlantılar --- */
  for (const m of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    totalLinks++;
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const [p] = href.split('#');
    if (!p) continue;
    if (!(await hedefVar(p))) flag(file, 'LINK', `hedef yok: ${href}`);
  }

  /* --- iç çapa hedefleri --- */
  for (const m of html.matchAll(/href="([a-z0-9\-\.\/]*)#([a-zA-Z][\w\-]*)"/g)) {
    const [, page, anchor] = m;
    const target = page ? cozumle(page) : file;
    if (!(await exists(path.join(SITE, target)))) continue;
    const targetHtml = target === file ? html : await readFile(path.join(SITE, target), 'utf8');
    if (!new RegExp(`id="${anchor}"`).test(targetHtml)) {
      flag(file, 'ANCHOR', `çapa hedefi yok: ${target}#${anchor}`);
    }
  }

  /* --- yer tutucu metin ---
     Sözcük sınırı şart: sınırsız arama "metodolojimiz" içindeki "todo"yu
     yer tutucu sanıyordu. */
  if (/lorem ipsum|\bTODO\b|\bFIXME\b|\bXXX\b|placeholder text/i.test(html)) {
    flag(file, 'İÇERİK', 'yer tutucu metin bulundu');
  }
}

/* --- rapor --- */
console.log(`Denetlenen: ${files.length} sayfa · ${totalImgs} görsel · ${totalLinks} bağlantı\n`);

if (!problems.length) {
  console.log('✓ Sorun bulunamadı.');
} else {
  const byKind = {};
  for (const p of problems) (byKind[p.kind] ||= []).push(p);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`\n[${kind}] ${list.length} sorun`);
    const shown = list.slice(0, 12);
    for (const p of shown) console.log(`  ${p.file}: ${p.detail}`);
    if (list.length > shown.length) console.log(`  … ve ${list.length - shown.length} tane daha`);
  }
  console.log(`\nToplam ${problems.length} sorun.`);
}
process.exit(problems.length ? 1 : 0);

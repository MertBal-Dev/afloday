/* Sayfayı gerçek kullanıcı gibi yavaşça kaydır, sonra HÂLÂ görünmeyen
   ögeleri bul. data-reveal'e dokunulmuyor. */
import { chromium } from 'playwright-core';
const b = await chromium.launch({ channel: 'chrome' });
const [,, adres = 'dogadan-hobi-atolyeleri', gen = '390'] = process.argv;
const p = await (await b.newContext({ viewport: { width: +gen, height: 844 } })).newPage();
await p.goto('http://127.0.0.1:8899/' + adres, { waitUntil: 'networkidle' });

/* adım adım kaydır */
const yuk = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < yuk; y += 600) {
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(140);
}
await p.waitForTimeout(1200);

console.log(JSON.stringify(await p.evaluate(() => {
  const gizli = [...document.querySelectorAll('[data-reveal]')]
    .filter(e => getComputedStyle(e).opacity !== '1')
    .map(e => ({
      sinif: (e.className || e.tagName).slice(0, 46),
      opaklik: getComputedStyle(e).opacity,
      yukseklik: Math.round(e.getBoundingClientRect().height),
      isIn: e.classList.contains('is-in'),
      metin: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40),
    }));
  return { sayfaYuksekligi: document.body.scrollHeight, ekran: innerHeight, gizliSayisi: gizli.length, gizli };
}), null, 1));
await b.close();

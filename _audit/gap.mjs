/* Orijinal afloday.com ile prototipi karşılaştır: hangi sayfa/işlev eksik? */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://www.afloday.com';

// Orijinal sitenin menüsünden çıkarılan tam sayfa listesi
const ORIGINAL = {
  '/': 'Anasayfa',
  '/hakkimizda': 'Afloday Hakkında',
  '/ceylan-kalyon': 'Ekip · Ceylan Kalyon',
  '/tugce-hazinedar': 'Ekip · Tuğçe Hazinedar',
  '/derya-akyazici-kalyon': 'Ekip · Derya Akyazıcı Kalyon',
  '/elif-celikkol-duman': 'Ekip · Elif Çelikkol Duman',
  '/alara-apaydin-saruhan': 'Ekip · Alara Apaydın Saruhan',
  '/zeynep-altunhan': 'Ekip · Zeynep Altunhan',
  '/muharrem-ozdemir': 'Ekip · Muharrem Özdemir',
  '/dogadan-gelisim-atolyeleri': 'Kurumsal · Doğadan Gelişim Atölyeleri',
  '/sosyal-sorumluluk-is-danismanligi': 'Kurumsal · Sosyal Sorumluluk & İş Danışmanlığı',
  '/doga-temelli-egitimlerimiz': 'Kurumsal · Doğa Temelli Eğitimlerimiz',
  '/dogadan-hobi-atolyeleri': 'Hobi Atölyeleri (liste)',
  '/mevsim-kapi-celengi-tasarimi-atolye': 'Atölye · Mevsim Kapı Çelengi',
  '/kuru-cicek-fanus-tasarim-atolyesi': 'Atölye · Kuru Çiçek Fanus',
  '/cicek-aksesuar-tasarim-atolyesi': 'Atölye · Çiçek Aksesuar',
  '/dogal-tutsu-herbaryum-tasarim-atolyesi': 'Atölye · Doğal Tütsü & Herbaryum',
  '/taze-cicek-buket-aranjman-tasarim-atolyesi': 'Atölye · Taze Çiçek Buket',
  '/cicek-cerceve-tasarim-atolyesi': 'Atölye · Çiçek Çerçeve',
  '/kokedama-tasarim-atolyesi': 'Atölye · Kokedama',
  '/minyatur-bahce-tasarim-atolyesi': 'Atölye · Minyatür Bahçe',
  '/sukulent-aranjman-atolyesi': 'Atölye · Sukulent Aranjman',
  '/kavanoz-teraryum-tasarim-atolyesi': 'Atölye · Kavanoz Teraryum',
  '/doga-cerceve-tasarim-atolyesi': 'Atölye · Doğa Çerçeve',
  '/mini-kavanoz-teraryum-atolyesi-3-yas': 'Atölye · Mini Kavanoz Teraryum',
  '/mini-bahce-atolyesi-5-yas': 'Atölye · Mini Bahçe',
  '/kus-evi-tasarim-atolyesi-5-yas': 'Atölye · Kuş Evi',
  '/kalemlik-tasarim-atolyesi-5-yas': 'Atölye · Kalemlik',
  '/doga-cerceve-atolyesi-5-yas': 'Atölye · Doğa Çerçeve (çocuk)',
  '/gelecegi-tasarla': 'Sürdürülebilirlik · Geleceği Yeşil Tasarla',
  '/gulumseyen-yarinlar-projesi': 'Sürdürülebilirlik · Gülümseyen Yarınlar',
  '/iletisim': 'İletişim',
  '/katilim': 'Atölye Katılımı (form)',
  '/ik': 'İnsan Kaynakları (CV formu)',
};

// Prototipteki karşılıkları
const MAPPING = {
  '/': 'index.html',
  '/hakkimizda': 'hakkimizda.html',
  '/ceylan-kalyon': 'ekip-ceylan-kalyon.html',
  '/tugce-hazinedar': 'ekip-tugce-hazinedar.html',
  '/derya-akyazici-kalyon': 'ekip-derya-akyazici-kalyon.html',
  '/elif-celikkol-duman': 'ekip-elif-celikkol-duman.html',
  '/alara-apaydin-saruhan': 'ekip-alara-apaydin-saruhan.html',
  '/zeynep-altunhan': 'ekip-zeynep-altunhan.html',
  '/muharrem-ozdemir': 'ekip-muharrem-ozdemir.html',
  '/dogadan-gelisim-atolyeleri': 'kurumsal.html#gelisim',
  '/sosyal-sorumluluk-is-danismanligi': 'kurumsal.html#sosyal',
  '/doga-temelli-egitimlerimiz': 'doga-temelli-egitimler.html',
  '/dogadan-hobi-atolyeleri': 'atolyeler.html',
  '/mevsim-kapi-celengi-tasarimi-atolye': 'atolye-mevsim-kapi-celengi.html',
  '/kuru-cicek-fanus-tasarim-atolyesi': 'atolye-kuru-cicek-fanus.html',
  '/cicek-aksesuar-tasarim-atolyesi': 'atolye-cicek-aksesuar.html',
  '/dogal-tutsu-herbaryum-tasarim-atolyesi': 'atolye-dogal-tutsu-herbaryum.html',
  '/taze-cicek-buket-aranjman-tasarim-atolyesi': 'atolye-taze-cicek-buket.html',
  '/cicek-cerceve-tasarim-atolyesi': 'atolye-cicek-cerceve.html',
  '/kokedama-tasarim-atolyesi': 'atolye-kokedama.html',
  '/minyatur-bahce-tasarim-atolyesi': 'atolye-minyatur-bahce.html',
  '/sukulent-aranjman-atolyesi': 'atolye-sukulent-aranjman.html',
  '/kavanoz-teraryum-tasarim-atolyesi': 'atolye-kavanoz-teraryum.html',
  '/doga-cerceve-tasarim-atolyesi': 'atolye-doga-cerceve.html',
  '/mini-kavanoz-teraryum-atolyesi-3-yas': 'atolye-mini-kavanoz-teraryum.html',
  '/mini-bahce-atolyesi-5-yas': 'atolye-mini-bahce.html',
  '/kus-evi-tasarim-atolyesi-5-yas': 'atolye-kus-evi.html',
  '/kalemlik-tasarim-atolyesi-5-yas': 'atolye-kalemlik.html',
  '/doga-cerceve-atolyesi-5-yas': 'atolye-cocuk-doga-cerceve.html',
  '/gelecegi-tasarla': 'proje-gelecegi-yesil-tasarla.html',
  '/gulumseyen-yarinlar-projesi': 'proje-gulumseyen-yarinlar.html',
  '/iletisim': 'iletisim.html',
  '/katilim': 'katilim.html',
  '/ik': 'ik.html',
};

const SITE = path.resolve('site');
const files = new Set((await readdir(SITE)).filter(f => f.endsWith('.html')));

const eksik = [], kismi = [], tam = [];

for (const [orig, label] of Object.entries(ORIGINAL)) {
  const target = MAPPING[orig];
  if (!target) { eksik.push([orig, label, 'karşılığı yok']); continue; }
  const [file, anchor] = target.split('#');
  if (!files.has(file)) { eksik.push([orig, label, `dosya yok: ${file}`]); continue; }
  if (anchor) {
    const html = await readFile(path.join(SITE, file), 'utf8');
    if (!html.includes(`id="${anchor}"`)) { eksik.push([orig, label, `çapa yok: ${target}`]); continue; }
    kismi.push([orig, label, target]);
  } else {
    tam.push([orig, label, target]);
  }
}

/* --- Ayrıca: orijinaldeki işlevler --- */
const idx = await readFile(path.join(SITE, 'index.html'), 'utf8');
const all = (await Promise.all([...files].map(f => readFile(path.join(SITE, f), 'utf8')))).join('');

const islevler = [
  // Gömme için youtube-nocookie kullanılıyor (çerez azaltma)
  ['YouTube tanıtım videosu', /youtube(-nocookie)?\.com\/(embed|watch)|youtu\.be/i.test(all)],
  ['Instagram bağlantısı', /instagram\.com\/afloday/i.test(all)],
  ['YouTube kanal bağlantısı', /youtube\.com\/afloday/i.test(all)],
  ['Kurumsal PDF sunum bağlantısı', /\.pdf/i.test(all)],
  ['Atölye katılım formu (atölye seçmeli)', /name="atolye"|Atölye Katılımı/i.test(all)],
  ['İK / CV yükleme formu', /type="file"|CV Yükle|İnsan Kaynakları/i.test(all)],
  ['Tasarım Mağazası', /Tasarım Mağazası/i.test(all)],
  ['Yol tarifi / harita bağlantısı', /maps\.|goo\.gl\/maps|Yol tarifi/i.test(all)],
  ['Referans logoları', /assets\/img\/logos\//.test(all)],
  ['KVKK onayı', /KVKK/i.test(all)],
];

console.log('=== SAYFA KARŞILAŞTIRMASI ===');
console.log(`Orijinal sayfa sayısı: ${Object.keys(ORIGINAL).length}`);
console.log(`Birebir karşılığı olan: ${tam.length}`);
console.log(`Birleştirilmiş (bölüm/çapa olarak var): ${kismi.length}`);
console.log(`EKSİK: ${eksik.length}`);
if (eksik.length) {
  console.log('\n--- EKSİK SAYFALAR ---');
  eksik.forEach(([o, l, r]) => console.log(`  ${o.padEnd(46)} ${l}  [${r}]`));
}
console.log('\n--- BİRLEŞTİRİLENLER (ayrı sayfa değil, bölüm) ---');
kismi.forEach(([o, l, t]) => console.log(`  ${o.padEnd(46)} -> ${t}`));

console.log('\n=== İŞLEV KARŞILAŞTIRMASI ===');
islevler.forEach(([ad, v]) => console.log(`  ${v ? 'VAR  ' : 'EKSİK'} ${ad}`));

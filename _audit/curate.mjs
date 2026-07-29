// Ham arşivden seçilmiş görselleri semantik isimlerle site klasörüne kopyala.
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { makeLogoTransparent } from '../_build/logo-alpha.mjs';

const RAW = path.resolve('_arsiv');          // afloday.com'dan indirilen ham arşiv
const IMG = path.resolve('site/assets/img'); // teslim edilen kürate görseller

const MAP = {
  brand: {
    'logo.png': 'logo__new-logo-1.png',
    'favicon.png': 'logo__favicon.png',
  },
  hero: {
    'hero-buket.jpg': '0__buket__01.jpg',
    // Hero levhası. Arşiv zemin ölçümüyle tarandı (bkz. _audit/measure.html):
    // beyaz zeminde, düz, nötr ve öznesi net ayrışan tek kare. Çelenk simetrik
    // ve yoğun olduğu için levha olarak en güçlüsü.
    'ornek-celenk.jpg': '0__celeng__12.jpg',
    // NOT: banner2__*.jpg dosyalarının HEPSİNDE yazı gömülü (eski slider
    // görselleri). Kırpınca yazı kenarları görünüyor — kullanmayın.
    'hero-dogal.jpg': 'afloday__bg4.jpg',
    'hero-pembe-cicek.jpg': 'afloday__cicek-tasarimi-kurumsal-etkinlikler.jpg',
    'hero-kurumsal.jpg': 'afloday__atolye-kurumsal__kurumsal-2.jpg',
    'hero-surdurulebilirlik.jpg': 'surdur__011.jpg',
    'hero-hakkimizda.jpg': 'afloday__afloday-hakkinda.jpg',
  },
  kurumsal: {
    'kurumsal-01.jpg': 'afloday__atolye-kurumsal__kurumsal-1.jpg',
    'kurumsal-02.jpg': 'afloday__atolye-kurumsal__kurumsal-2.jpg',
    'kurumsal-03.jpg': 'afloday__atolye-kurumsal__kurumsal-3.jpg',
    'kurumsal-04.jpg': 'afloday__atolye-kurumsal__kurumsal-5.jpg',
    'kurumsal-masa.jpg': '0__cicek-aksesuar__05.jpg',
    'kurumsal-detay.jpg': 'donemsel-konsept__005.jpg',
  },
  workshops: {
    // Çiçek tasarım
    'kapi-celengi.jpg': '0__kapi-celengi__001.jpg',
    'kapi-celengi-2.jpg': '0__celeng__12.jpg',
    'kuru-cicek-fanus.jpg': '0__fanus__06.jpg',
    'kuru-cicek-fanus-2.jpg': '0__fanus__09.jpg',
    'cicek-aksesuar.jpg': '0__cicek-aksesuar__01.jpg',
    'cicek-aksesuar-2.jpg': '0__cicek-aksesuar__09.jpg',
    'tutsu-herbaryum.jpg': '0__cerceve__14.jpg',
    'taze-cicek-buket.jpg': '0__buket__05.jpg',
    'taze-cicek-buket-2.jpg': '0__taze-cicek__001.jpg',
    'cicek-cerceve.jpg': '0__cerceve__13.jpg',
    'cicek-cerceve-2.jpg': '0__cerceve__15.jpg',
    // Bitki tasarım
    'kokedama.jpg': '0__kokedama__04.jpg',
    'kokedama-2.jpg': '0__kokedama__11.jpg',
    'minyatur-bahce.jpg': '0__minyatur-bahce__06.jpg',
    'minyatur-bahce-2.jpg': '0__minyatur-bahce__04.jpg',
    'sukulent.jpg': '0__skulent-aranjman__02.jpg',
    'sukulent-2.jpg': '0__skulent-aranjman__05.jpg',
    'kavanoz-teraryum.jpg': '0__kavanoz-teraryum__07.jpg',
    'kavanoz-teraryum-2.jpg': '0__kavanoz-teraryum__06.jpg',
    'doga-cerceve.jpg': '0__doga-cerceve__02.jpg',
    'doga-cerceve-2.jpg': '0__doga-cerceve__04.jpg',
    // Çocuk
    'mini-kavanoz.jpg': '0__mini-kavanoz__04.jpg',
    'mini-bahce.jpg': '0__mini-bahce__05.jpg',
    'kus-evi.jpg': '0__kus-evi__002.jpg',
    'kalemlik.jpg': '0__kalemlik__kalemlik-1.jpg',
    'cocuk-doga-cerceve.jpg': '0__doga-cerceve__03.jpg',
  },
  team: {
    'ceylan-kalyon.jpg': 'ceylan-kalyon-afloday.jpg',
    'tugce-hazinedar.jpg': 'tugce-hazinedar.jpg',
    'derya-akyazici-kalyon.jpg': 'derya-akyazici-kalyon.jpg',
    'elif-celikkol-duman.jpg': 'elif-celikkol-duman.jpg',
    'alara-apaydin-saruhan.jpg': 'alara-apaydin-saruhan.jpg',
    'zeynep-altunhan.jpg': 'ekip__zeynep-altunhan.jpg',
    'muharrem-ozdemir.jpg': 'muharrem-ozdemir.jpg',
  },
  surdurulebilirlik: {
    'yesil-tasarla-01.jpg': 'surdur__009.jpg',
    'yesil-tasarla-02.jpg': 'surdur__011.jpg',
    'yesil-tasarla-03.jpg': 'surdur__018.jpg',
    'yesil-tasarla-04.jpg': 'surdur__021.jpg',
    'koruncuk-01.jpg': 'afloday__atolye-koruncuk__01.jpg',
    'koruncuk-02.jpg': 'afloday__atolye-koruncuk__05.jpg',
    'koruncuk-03.jpg': 'afloday__atolye-koruncuk__09.jpg',
    'sosyal-sorumluluk.jpg': 'sosyal__sosyal-sorumluluk.jpg',
  },
};

const LOGOS = [
  'bosch', 'pfizer', 'p-g', 'ingbank', 'denizbank', 'trendyol', 'akmerkez',
  'estelauder', 'godiva', 'skoda', 'yapikredi', 'aon', 'autoliv', 'pasabahce',
  'kalekim', 'evyap', 'hektas', 'igsas', 'koruncuk', 'sahibinden', 'intertech',
  'workinton', 'starwood', 'capitol', 'kule', 'carousel', 'yildizlar',
  'floralfest', 'make-my-day', 'tabi-tasarim',
];

const missing = [];
let copied = 0;

for (const [folder, files] of Object.entries(MAP)) {
  await mkdir(path.join(IMG, folder), { recursive: true });
  for (const [dest, src] of Object.entries(files)) {
    try {
      await copyFile(path.join(RAW, src), path.join(IMG, folder, dest));
      copied++;
    } catch {
      missing.push(`${folder}/${dest}  <-  ${src}`);
    }
  }
}

await mkdir(path.join(IMG, 'logos'), { recursive: true });
for (const l of LOGOS) {
  try {
    await copyFile(path.join(RAW, `afloday__ref__${l}.png`), path.join(IMG, 'logos', `${l}.png`));
    copied++;
  } catch { missing.push(`logos/${l}.png`); }
}

// Marka logosu düz beyaz zeminli RGB PNG olarak geliyor; koyu zeminde
// kullanılabilmesi için kopyalamadan HEMEN SONRA şeffaflaştırılmalı.
const logo = makeLogoTransparent(path.join(IMG, 'brand', 'logo.png'));
console.log(logo.skipped
  ? `Logo şeffaflığı atlandı: ${logo.reason}`
  : `Logo şeffaflaştırıldı: ${logo.cleared} piksel temizlendi, ${logo.feathered} yumuşatıldı`);

console.log(`${copied} görsel kürate edildi.`);
if (missing.length) {
  console.log(`\nEKSİK (${missing.length}):`);
  missing.forEach(m => console.log('  ' + m));
} else {
  console.log('Eksik yok.');
}

// Kalan klasörleri raporla
for (const d of ['brand', 'hero', 'kurumsal', 'workshops', 'team', 'surdurulebilirlik', 'logos']) {
  const n = (await readdir(path.join(IMG, d)).catch(() => [])).length;
  console.log(`  ${d}: ${n} dosya`);
}

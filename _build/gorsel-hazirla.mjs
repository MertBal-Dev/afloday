/* GÖRSEL HAZIRLAMA — 4 Ağustos 2026 içerik belgesinin görselleri.
   Kaynak dosyalar tanesi 2-27 MB; web için küçültülüp WebP'ye çevriliyor.

   Çalıştırma:  node _build/gorsel-hazirla.mjs
   Kaynak yolu: GORSEL_KAYNAK ortam değişkeniyle değiştirilebilir.

   Çıktı  site/assets/img/rev2/<slug>.webp      en uzun kenar 1600
          site/assets/img/rev2/<slug>-800.webp  kart ve galeri için
          site/assets/img/rev2/<slug>.jpg       WebP desteklemeyen tarayıcı

   Kırpma yapılmıyor: oran korunuyor, çerçeveleme CSS'te object-fit ile.
   Otomatik kırpma yüz veya kompozisyon kesebilir, bu iş göz ister.

   Betik idempotent: çıktı kaynaktan yeniyse dosyayı atlar. */

import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

/* Belgedeki bazı görsel adları 175 karakter; klasör yoluyla birlikte
   Windows'un 260 karakterlik sınırını aşıyorlar ve dosya "yok" görünüyor.
   \\?\ öneki bu sınırı kaldırıyor, ama yalnızca ters bölülü tam yolda. */
const uzunYol = (p) =>
  process.platform === 'win32' && !p.startsWith('\\\\?\\')
    ? '\\\\?\\' + path.resolve(p).replace(/\//g, '\\')
    : p;

const KAYNAK =
  process.env.GORSEL_KAYNAK ||
  'C:/Users/Gaming/Downloads/wetransfer_afloday-web-metin-ve-gorseller_2026-08-04_1711/Afloday Web Metin ve Görseller';

const HEDEF = path.join(process.cwd(), 'site', 'assets', 'img', 'rev2');

/* Hangi klasörden ne alınıyor. Klasör adları belgeyle birlikte gelen
   arşivdeki adlar; değişirse burası güncellenir. */
const KLASORLER = {
  secilmis: 'Seçilmiş Olanlar',
  etkinlik: 'Doğadan Etkinlik Atölye Deneyimleri',
  galeri: 'Galeri',
};

/* Türkçe karakterleri düşürüp dosya adını web'e uygun hâle getirir.
   data dosyalarındaki `gorsel` alanları kaynak dosya adını tutuyor;
   şablonlar bu fonksiyondan geçirip yolu buluyor. */
export function slug(dosyaAdi) {
  const govde = dosyaAdi.replace(/\.[^.]+$/, '');
  return govde
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

/* Şablonların kullandığı yol yardımcısı.

   Klasör adı yolun parçası: "Seçilmiş Olanlar/Resim1.jpg" ile
   "Galeri/Resim1.jpg" farklı iki fotoğraf ama adları aynı. Tek klasöre
   yazılınca biri diğerini eziyordu — hero'nun ikinci slaydı sessizce galeri
   fotoğrafına dönmüştü. Klasör ayrımı bunu yapısal olarak imkânsız kılıyor. */
export const webYol = (dosyaAdi, klasor = 'secilmis') =>
  `assets/img/rev2/${klasor}/${slug(dosyaAdi)}`;

/* Dosya başına üst sınır 300 KB. Yaprak/kök gibi yoğun dokulu fotoğraflar
   bu sınırı ilk kalitede aşıyor; kalite kademe kademe düşürülüp yeniden
   sıkıştırılıyor. Sade kompozisyonlar ilk denemede geçiyor, onlarda kayıp yok. */
const SINIR = 300 * 1024;
const KALITE_KADEMELERI = [0, -8, -16, -23];

/* Bazı fotoğraflar sayfada tam görünürlükte değil, düşük opaklıkta doku
   olarak kullanılıyor. Onlarda çözünürlük ve kalite düşürmek görünür bir
   fark yaratmıyor; sınırı zorlamak yerine baştan küçük üretiyoruz.
   Anahtar: kaynak dosya adı. */
const DOKU_GORSELLERI = new Map([
  /* hakkimizda açılış alıntısının arkasında %20 opaklıkta */
  ['massive-network-tree-roots-dominating-forest-ground.jpg', { kenar: 1100, kalite: 62 }],
  /* galeri karesi; ızgarada 800px, ışık kutusunda JPG açılıyor.
     1600px WebP varyantı hiçbir yerde kullanılmıyor ama üretiliyor —
     yoğun doku yüzünden tek başına sınırı aşan dosya. */
  ['Resim2.jpg', { kenar: 1400, kalite: 68 }],
]);

const BOYUTLAR = [
  { ek: '.webp', kenar: 1600, bicim: 'webp', kalite: 78 },
  { ek: '-800.webp', kenar: 800, bicim: 'webp', kalite: 76 },
  { ek: '.jpg', kenar: 1600, bicim: 'jpeg', kalite: 80, mozjpeg: true },
];

async function isle(kaynakYolu, ad, altKlasor) {
  const s = `${altKlasor}/${slug(ad)}`;
  const kaynakBilgi = await stat(uzunYol(kaynakYolu));
  const uretilen = [];
  let veri = null;
  const doku = DOKU_GORSELLERI.get(ad);

  for (const ham of BOYUTLAR) {
    /* Doku görsellerinde ölçü ve kalite baştan kısılıyor */
    const b = doku
      ? { ...ham, kenar: Math.min(ham.kenar, doku.kenar), kalite: Math.min(ham.kalite, doku.kalite) }
      : ham;
    const cikti = path.join(HEDEF, s + b.ek);
    if (existsSync(cikti)) {
      const c = await stat(cikti);
      if (c.mtimeMs >= kaynakBilgi.mtimeMs) continue; /* güncel, atla */
    }
    /* Dosyayı sharp'a yol yerine arabellek olarak veriyoruz: uzun yol
       önekini libvips değil Node çözsün. */
    veri ??= await readFile(uzunYol(kaynakYolu));

    const sikistir = async (kenar, kalite) => {
      const ayar = { quality: kalite };
      if (b.mozjpeg) ayar.mozjpeg = true;
      return sharp(veri)
        .rotate() /* EXIF yönünü uygula, yoksa telefon fotoğrafları yan yatar */
        .resize({ width: kenar, height: kenar, fit: 'inside', withoutEnlargement: true })
        [b.bicim](ayar)
        .toBuffer();
    };

    let cikan = null;
    for (const kademe of KALITE_KADEMELERI) {
      cikan = await sikistir(b.kenar, b.kalite + kademe);
      if (cikan.length <= SINIR) break;
    }
    /* Kök/yaprak gibi çok yoğun dokularda kalite düşürmek bile yetmiyor.
       Kaliteyi daha da kırmak yerine ölçüyü küçültüyoruz: 1280px'lik net bir
       fotoğraf, 1600px'lik bulanık olandan iyi görünür. */
    if (cikan.length > SINIR) {
      const kucuk = await sikistir(Math.round(b.kenar * 0.8), b.kalite - 12);
      if (kucuk.length < cikan.length) cikan = kucuk;
    }
    await writeFile(cikti, cikan);
    uretilen.push(path.basename(cikti));
  }
  return { slug: s, uretilen };
}

async function klasoruIsle(etiket, klasorAdi, altKlasor, suzgec) {
  const dizin = path.join(KAYNAK, klasorAdi);
  if (!existsSync(dizin)) {
    console.log(`ATLANDI  ${etiket}: klasör yok — ${dizin}`);
    return [];
  }
  await mkdir(path.join(HEDEF, altKlasor), { recursive: true });

  const dosyalar = (await readdir(dizin))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .filter((f) => (suzgec ? suzgec(f) : true));

  /* Aynı klasörde iki dosya aynı slug'a düşerse biri diğerini ezer.
     Kaynakta bunun iki sebebi var:
       · aynı fotoğraf iki kez → biri atılır
       · farklı fotoğraf, aynı ad, farklı uzantı ("… 5.jpeg" / "… 5.JPG")
         → ikisi de gerekli, uzantı slug'a ekleniyor
     Ayrım içerik özetiyle yapılıyor, dosya adına güvenilmiyor. */
  const slugSahibi = new Map();
  const ekUzanti = new Set();
  const ozetler = new Map();
  for (const f of dosyalar) {
    const ozet = createHash('md5').update(await readFile(uzunYol(path.join(dizin, f)))).digest('hex');
    ozetler.set(f, ozet);
    const s = slug(f);
    const onceki = slugSahibi.get(s);
    if (!onceki) { slugSahibi.set(s, f); continue; }
    if (ozetler.get(onceki) === ozet) continue;   /* birebir aynı dosya */
    ekUzanti.add(onceki);
    ekUzanti.add(f);
  }
  /* Aynı içerikli kopyaları bir kez işle */
  const gorulenOzet = new Set();
  const islenecek = dosyalar.filter((f) => {
    const o = ozetler.get(f);
    if (gorulenOzet.has(o)) return false;
    gorulenOzet.add(o);
    return true;
  });
  const kopya = dosyalar.length - islenecek.length;
  if (kopya) console.log(`  ${kopya} birebir kopya atlandı`);
  if (ekUzanti.size) {
    console.log(`  ${ekUzanti.size} dosyada ad çakışması — uzantı slug'a eklendi`);
  }

  const sonuc = [];
  for (const f of islenecek) {
    const ad = ekUzanti.has(f) ? f.replace(/\.([^.]+)$/, '-$1.$1') : f;
    const { slug: s, uretilen } = await isle(path.join(dizin, f), ad, altKlasor);
    const kayit = { kaynak: f, slug: s };
    /* Etkinlik fotoğraflarında hangi akordeona ait olduğu da kaydediliyor */
    if (altKlasor === 'etkinlik') {
      kayit.kategori = etkinlikKategorisi(f);
      kayit.kapak = ETKINLIK_KAPAKLARI.has(f);
    }
    sonuc.push(kayit);
    if (uretilen.length) console.log(`  ${f}  →  ${s}`);
  }
  console.log(`${etiket}: ${dosyalar.length} görsel`);
  return sonuc;
}

/* Etkinlik klasöründeki 71 fotoğrafın tamamı işleniyor.

   Hangi fotoğrafın hangi ATÖLYEYE ait olduğu belli değil (numaralar atölye
   sırasıyla örtüşmüyor), ama dosya adı hangi KATEGORİYE ait olduğunu
   söylüyor. Bu yüzden atölye başına eşleme yapılmıyor; her kategori kendi
   fotoğraflarını galeri olarak gösteriyor. Kategori düzeyinde iddia doğru,
   atölye düzeyinde uydurma olurdu.

   İlk fotoğraf kategorinin kapağı, kalanı galeri. */
const ETKINLIK_KAPAKLARI = new Set([
  'Sürdürülebilirlik Etkinlikleri 1.JPG',
  'Motivasyon ve Çalışan Deneyimi Etkinlikleri 2.jpg',
  'Özel Gün ve Dönemsel Etkinlikleri 1.jpg',
  'Takım Gelişim Etkinlikleri.jpg',
  'Kurumsal Gönüllülük Etkinlikleri 1.jpg',
  'Wellbeing İyi Oluş Etkinlikleri 1.jpeg',
  'Çocuk Atölye Etkinlikleri.jpeg',
]);

/* Dosya adından kategori kimliğini çıkarır. Adı kategoriye uymayan üç dosya
   elle eşleniyor: ikisi belirli bir atölyenin fotoğrafı, biri belirsiz. */
const ELLE_ESLEME = new Map([
  ['Mottolu Farkındalık Çerçevesi Tasarım Atölyesi Görsel4.jpg', 'motivasyon'],
  ['Mini Kavanoz Teraryum Atölyesi.jpeg', 'cocuk'],
  /* thumbnail_IMG_0624.jpg — hangi kategoriye ait olduğu belli değil,
     dışarıda bırakıldı. Afloday'e soruldu. */
]);

export function etkinlikKategorisi(dosyaAdi) {
  if (ELLE_ESLEME.has(dosyaAdi)) return ELLE_ESLEME.get(dosyaAdi);
  const ad = dosyaAdi.toLocaleLowerCase('tr');
  if (ad.startsWith('sürdürülebilirlik')) return 'surdurulebilirlik';
  if (ad.startsWith('motivasyon')) return 'motivasyon';
  if (ad.startsWith('özel gün')) return 'ozel-gun';
  if (ad.startsWith('takım gelişim')) return 'takim-gelisim';
  if (ad.startsWith('kurumsal gönüllülük')) return 'gonulluluk';
  if (ad.startsWith('wellbeing')) return 'wellbeing';
  if (ad.startsWith('çocuk atölye')) return 'cocuk';
  return null;
}

async function main() {
  await mkdir(HEDEF, { recursive: true });
  console.log(`Kaynak: ${KAYNAK}\nHedef:  ${HEDEF}\n`);

  const kayit = {
    secilmis: await klasoruIsle('Seçilmiş Olanlar', KLASORLER.secilmis, 'secilmis'),
    /* Kategorisi çözülemeyen dosya siteye girmiyor */
    etkinlik: await klasoruIsle('Etkinlik fotoğrafları', KLASORLER.etkinlik, 'etkinlik', (f) =>
      etkinlikKategorisi(f) !== null,
    ),
    galeri: await klasoruIsle('Galeri', KLASORLER.galeri, 'galeri'),
  };

  /* Kaynak dosya adı → slug tablosu. Şablonlar bunu okumuyor; kaynak
     klasör elde olmadan da hangi görselin nereden geldiği görünsün diye. */
  await writeFile(
    path.join(HEDEF, 'kayit.json'),
    JSON.stringify(kayit, null, 2) + '\n',
    'utf8',
  );

  const toplam = Object.values(kayit).reduce((t, l) => t + l.length, 0);
  console.log(`\nToplam ${toplam} görsel hazır.`);
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

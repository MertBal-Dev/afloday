/* AFLODAY — içerik verisi.
   Tüm Türkçe metin afloday.com'dan birebir alınmıştır. */

export const site = {
  name: 'Afloday',
  legal: 'Afloday | Doğadan Gelişim Atölyesi',
  tagline: 'Doğadan Gelişim Atölyesi',
  /* Önizleme dağıtımlarında SITE_URL ile geçersiz kılınır; böylece
     og:image ve canonical yayınlandığı adrese işaret eder. */
  url: (process.env.SITE_URL || 'https://www.afloday.com').replace(/\/$/, ''),
  email: 'info@afloday.com',
  phones: ['0216 510 2809', '0538 490 0727', '0532 213 4476'],
  address: {
    street: 'Küçüksu Cad. Antasya Residence No:64A/15',
    locality: 'Ümraniye',
    region: 'İstanbul',
    zip: '34768',
  },
  social: {
    instagram: 'https://www.instagram.com/afloday/',
    youtube: 'https://www.youtube.com/afloday/',
  },
};

/* Canlı afloday.com adresleri — 4 Ağustos 2026'da Playwright ile siteden
   okundu, belirsizler HTTP durum koduyla sınandı. Tahmin yok.

   Sayfalar aşağıdaki eski dosya adlarıyla üretiliyor; yazılmadan hemen önce
   build.mjs bu tabloyu uygulayıp hem dosya adını hem içerideki bağlantıları
   canlı adrese çeviriyor. Böylece şablonlarda tek tek adres düzenlemek
   gerekmiyor ve eşleme tek yerden yönetiliyor.

   Amaç Ceylan Hanım'ın en net isteği: sayfa adresleri birebir korunacak ki
   arama sonuçları bozulmasın. Uzantılar vercel.json'daki cleanUrls ile düşüyor. */
export const canliAdres = new Map([
  /* Ekip — slug'lar zaten uyuşuyor, yalnızca "ekip-" öneki düşüyor */
  ['ekip-ceylan-kalyon', 'ceylan-kalyon'],
  ['ekip-tugce-hazinedar', 'tugce-hazinedar'],
  ['ekip-derya-akyazici-kalyon', 'derya-akyazici-kalyon'],
  ['ekip-elif-celikkol-duman', 'elif-celikkol-duman'],
  ['ekip-alara-apaydin-saruhan', 'alara-apaydin-saruhan'],
  ['ekip-zeynep-altunhan', 'zeynep-altunhan'],
  ['ekip-muharrem-ozdemir', 'muharrem-ozdemir'],

  /* Atölyeler — canlıda uzun açıklayıcı adresler kullanılıyor */
  ['atolye-mevsim-kapi-celengi', 'mevsim-kapi-celengi-tasarimi-atolye'],
  ['atolye-kuru-cicek-fanus', 'kuru-cicek-fanus-tasarim-atolyesi'],
  ['atolye-cicek-aksesuar', 'cicek-aksesuar-tasarim-atolyesi'],
  ['atolye-dogal-tutsu-herbaryum', 'dogal-tutsu-herbaryum-tasarim-atolyesi'],
  ['atolye-taze-cicek-buket', 'taze-cicek-buket-aranjman-tasarim-atolyesi'],
  ['atolye-cicek-cerceve', 'cicek-cerceve-tasarim-atolyesi'],
  ['atolye-kokedama', 'kokedama-tasarim-atolyesi'],
  ['atolye-minyatur-bahce', 'minyatur-bahce-tasarim-atolyesi'],
  ['atolye-sukulent-aranjman', 'sukulent-aranjman-atolyesi'],
  ['atolye-kavanoz-teraryum', 'kavanoz-teraryum-tasarim-atolyesi'],
  ['atolye-doga-cerceve', 'doga-cerceve-tasarim-atolyesi'],
  ['atolye-mini-kavanoz-teraryum', 'mini-kavanoz-teraryum-atolyesi-3-yas'],
  ['atolye-mini-bahce', 'mini-bahce-atolyesi-5-yas'],
  ['atolye-kus-evi', 'kus-evi-tasarim-atolyesi-5-yas'],
  ['atolye-kalemlik', 'kalemlik-tasarim-atolyesi-5-yas'],
  ['atolye-cocuk-doga-cerceve', 'doga-cerceve-atolyesi-5-yas'],

  /* Kurumsal ve projeler */
  ['kurumsal-hobi-atolyeleri', 'dogadan-hobi-atolyeleri'],
  ['doga-temelli-egitimler', 'doga-temelli-egitimlerimiz'],
  ['proje-gelecegi-yesil-tasarla', 'gelecegi-tasarla'],
  ['proje-gulumseyen-yarinlar', 'gulumseyen-yarinlar-projesi'],

  /* Adresi zaten birebir olanlar: index, hakkimizda, iletisim, katilim, ik.
     Bizde olup canlıda olmayan yeni sayfalar (atolyeler, surdurulebilirlik,
     blog, kvkk) tabloya girmiyor; yeni adres oldukları için SEO riski yok. */
]);

/* Menü — 4 Ağustos 2026 belgesi satır 381-388 sekiz madde veriyor:
   Anasayfa · Hakkımızda · Geleceği Doğadan Tasarla · Doğa Temelli
   Eğitimlerimiz · Kurumsal Hizmetler · Sürdürülebilirlik · Galeri · İletişim
   Sıra belgedeki gibi. "Hobi Atölyeleri Kataloğu" belgede yok, kalktı;
   16 atölye sayfası zaten iptal edildi.

   DÜZ SEKİZ MADDE — alt menü yok. Önceki hâlde afloday.com'un üç seviyeli
   menüsü taşınıyordu (24 bağlantı); belge alt madde tanımlamıyor. Kalkan
   bağlantıların hepsi başka yoldan erişilebilir durumda:
     · 7 ekip sayfası      → /hakkimizda#ekip
     · 3 kurumsal alt sayfa → /kurumsal ve kendi sayfaları
     · 2 sürdürülebilirlik projesi → /surdurulebilirlik
     · İnsan Kaynakları    → footer ve mobil çekmece
   Hepsi footer'da da duruyor, kaybolan adres yok.
   Panellerdeki alt başlıklar (`ozet`, `not`) belgede geçmiyordu; madde 24'te
   "kaynaksız" işaretlenen metinlerin bir bölümü bunlardı, birlikte kalktı. */
export const nav = [
  { href: 'index.html', label: 'Anasayfa' },
  { href: 'hakkimizda.html', label: 'Hakkımızda' },
  { href: 'proje-gelecegi-yesil-tasarla.html', label: 'Geleceği Doğadan Tasarla' },
  { href: 'doga-temelli-egitimler.html', label: 'Doğa Temelli Eğitimlerimiz' },
  { href: 'kurumsal.html', label: 'Kurumsal Hizmetler' },
  { href: 'surdurulebilirlik.html', label: 'Sürdürülebilirlik' },
  /* Belge "Galeri"yi menüde anıyor ama sayfa tanımlamıyor; içeriğini
     klasör adı söylüyor (WeTransfer arşivindeki "Galeri" klasörü).
     Gerekçe: docs/afloday-sorular-2026-08-04.md · madde 23. */
  /* GALERİ MENÜDEN KALKTI — Ceylan Kalyon Özdemir, 5 Ağustos:
     "Galeri sayfasını kapatabiliriz."
     Fotoğraflar kaybolmuyor: 21 kare anasayfadaki vitrin şeridinde,
     70 atölye karesi de 7 etkinlik kategorisi sayfasının mozaiğinde
     duruyor. /galeri adresi 301 ile etkinlik genel bakışına gidiyor. */
  { href: 'iletisim.html', label: 'İletişim' },
];


/* Orijinal sitedeki gerçek varlıklar */
export const assets = {
  youtubeId: 'asJG04Q9QUI',
  youtubeTitle: 'Afloday — Geleceği Doğadan Tasarla · Doğa Temelli Eğitim',
  pdfs: {
    /* PDF'ler canlı afloday.com'da duruyordu ve mutlak adresle bağlanıyordu.
       A kaydı Vercel'e döndüğü an ikisi de 404 verecekti — eski sunucuda
       kalıyorlar, yeni sunucuda yoklar. Üçü de indirilip `assets/docs/`
       altına alındı, bağlantılar göreli oldu. */
    gelisim: { url: 'assets/docs/dogadan-gelisim-atolyeleri.pdf', label: 'Doğadan Gelişim Atölyeleri — PDF sunum' },
    egitim: { url: 'assets/docs/doga-temelli-egitimler-icerik.pdf', label: 'Doğa Temelli Eğitimler — içerik dokümanı' },
    tasarla: { url: 'assets/docs/gelecegi-dogadan-tasarla-2025.pdf', label: 'Geleceği Doğadan Tasarla 2025' },
  },
  maps: 'https://maps.google.com/?q=K%C3%BC%C3%A7%C3%BCksu+Cad.+Antasya+Residence+No%3A64A%2F15+%C3%9Cmraniye+%C4%B0stanbul',
};

/* Atölye Katılımı formundaki orijinal seçenekler */
export const katilimSecenekleri = [
  'Atölye Eğitmen / Eğitici Eğitimi',
  'Çiçek Aksesuar Atölyesi',
  'Kapı Süsü Tasarımı Atölyesi',
  'Teraryum Atölyesi',
  'Minyatür Bahçe Atölyesi',
  'Doğadan Çerçeve Atölyesi',
  'Koruncuk Vakfı Gönüllü Atölyesi',
  'Diğer',
];

export const refs = [
  ['bosch', 'Bosch'], ['pfizer', 'Pfizer'], ['p-g', 'P&amp;G'], ['ingbank', 'ING Bank'],
  ['denizbank', 'DenizBank'], ['yapikredi', 'Yapı Kredi'], ['trendyol', 'Trendyol'],
  ['estelauder', 'Estée Lauder'], ['godiva', 'Godiva'], ['skoda', 'Škoda'],
  ['pasabahce', 'Paşabahçe'], ['akmerkez', 'Akmerkez'], ['aon', 'Aon'],
  ['autoliv', 'Autoliv'], ['kalekim', 'Kalekim'], ['hektas', 'Hektaş'],
  ['igsas', 'İGSAŞ'], ['evyap', 'Evyap'], ['sahibinden', 'sahibinden.com'],
  ['koruncuk', 'Koruncuk Vakfı'], ['starwood', 'Starwood'], ['intertech', 'Intertech'],
  ['workinton', 'Workinton'], ['capitol', 'Capitol'], ['kule', 'Kule'],
  ['carousel', 'Carousel'], ['yildizlar', 'Yıldızlar Yatırım Holding'],
  ['floralfest', 'Floral Fest'], ['make-my-day', 'Make My Day'], ['tabi-tasarim', 'Tabi Tasarım'],
];

export const cats = {
  cicek: { label: 'Çiçek Tasarım Hobi Atölyeleri', short: 'Çiçek' },
  bitki: { label: 'Bitki Tasarım Hobi Atölyeleri', short: 'Bitki' },
  cocuk: { label: 'Çocuk Hobi Atölyeleri', short: 'Çocuk' },
};

const AKIS_BITKI = [
  'Tanışma',
  'Bitki Tasarımı & Temel Bitki Bakımı Bilgilendirme & Örnek Tasarım Eğitmen Uygulama',
  'Atölye Eş Zamanlı Uygulama Zamanı',
];
const AKIS_DOGA = [
  'Tanışma',
  'Doğal Eko Sistem & Bitkilerin İnsanlara Faydaları & Doğa - Çevre Koruma Farkındalık & Örnek Tasarım Eğitmen Uygulama',
  'Atölye Eş Zamanlı Uygulama Zamanı',
];
const KAZ_BITKI = ['Topraklama', 'Stresten Uzaklaşma', 'Temel Tasarım Becerileri', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Dekoratif Obje'];
const KAZ_COCUK = ['Bitkilerle İlgili Genel Bilgiler', 'Doğa Sevgisi', 'Çevre Farkındalığı', 'Bitki Bakımı ile Sorumluluk Bilinci'];
const KAZ_COCUK_2 = ['Yaratıcı Düşünme', 'Doğa Sevgisi', 'Çevre Farkındalığı', 'Empati Kurma'];

export const workshops = [
  /* ---- ÇİÇEK TASARIM ---- */
  {
    slug: 'mevsim-kapi-celengi', cat: 'cicek',
    title: "Mevsim Kapı Çelengi Tasarımı Atölyesi",
    tagline: 'Gerçek dallarla örülmüş kapı çelenklerinin konsepte, mevsime göre tasarlandığı atölye.',
    img: 'kapi-celengi.jpg', img2: 'kapi-celengi-2.jpg',
    alt: 'Gerçek dallardan örülmüş, kozalak ve kurutulmuş portakal dilimleriyle süslenmiş kapı çelengi',
    alt2: 'Kırmızı meyveler ve yeşilliklerle tasarlanmış mevsim kapı çelengi',
    paras: [
      'Gerçek dallarla örülmüş kapı çelenklerinin konsepte, mevsime göre tasarlandığı atölye…',
      'Doğadan ilham alarak tasarlanan çelenkler kapıları süsleyebildiği gibi masa üzerinde de ev dekorlarının doğal bir parçası olabiliyor. Gerçek dallardan, yapraklardan örülmüş, gerçek yosunla kaplanmış çemberlerle çalışılıyor ve doğadan unsurlarla konsepte göre tasarım yapılıyor.',
    ],
    malzeme: 'Gerçek dallardan, yapraklardan örülmüş, gerçek yosunla kaplanmış çemberler; doğadan unsurlar',
  },
  {
    slug: 'kuru-cicek-fanus', cat: 'cicek',
    title: 'Kuru Çiçek Fanus Tasarım Atölyesi',
    tagline: 'Ters fanusların içine kuru çiçeklerle ömürlük tasarımın deneyimlendiği atölye.',
    img: 'kuru-cicek-fanus.jpg', img2: 'kuru-cicek-fanus-2.jpg',
    alt: 'Ters cam fanus içine yerleştirilmiş kuru çiçek ve pamuk tasarımı',
    alt2: 'Kuru çiçeklerle tasarlanmış cam fanus, açık zemin üzerinde',
    paras: [
      'Ters fanusların içine kuru çiçeklerle ömürlük tasarımın deneyimlendiği atölye.',
      'Son zamanların gözdesi olan ters fanusların içine kuru çiçeklerle çalışarak özgün dekoratif bir obje tasarlanıyor. Doğadan malzemelerin tanıtılmasıyla başlayan atölye; bir ürünün tasarlanma aşamaları, eğitmen ile eş zamanlı uygulama süreçleriyle devam ediyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; kurutulmuş çiçekler, gerçek pamuklar, mevsime göre; kurutulmuş portakal dilimleri, kozalaklar tasarıma konu olan doğadan malzemelerden…',
      'Doğadan ilham alarak tasarlanan fanuslar ofis ya da ev dekorasyonunda kullanılabilir.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: ['Temel Tasarım Becerileri', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Dekoratif Obje'],
    akis: ['Tanışma', 'Materyal Ürün Tasarımı Bilgilendirme & Tasarım İlkeleri Sunum Örnek Tasarım Eğitmen Uygulama', 'Atölye Eş Zamanlı Uygulama Zamanı'],
    malzeme: 'Kurutulmuş çiçekler, gerçek pamuklar, kurutulmuş portakal dilimleri, kozalaklar',
  },
  {
    slug: 'cicek-aksesuar', cat: 'cicek',
    title: 'Çiçek Aksesuar Tasarım Atölyesi',
    tagline: 'Kuru ve kumaş çiçeklerle küpe, yaka iğnesi, toka ve magnet tasarlanan atölye.',
    img: 'cicek-aksesuar.jpg', img2: 'cicek-aksesuar-2.jpg',
    alt: 'Kuru çiçeklerden tasarlanmış küpe ve yaka iğnesi aksesuarları',
    alt2: 'Çiçek aksesuar atölyesinde masaya serilmiş kuru çiçek ve malzemeler',
    paras: [
      'Doğadan ilham alarak kuru ve kumaş çiçeklerle aksesuarlar (Küpe, Yaka İğnesi, Toka, Magnet) tasarlanan atölye.',
      'Bir ürünün tasarlanma aşamaları, malzemelerin tanıtımı, eğitmen ile eş zamanlı uygulama süreçleriyle devam ediyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; kuru ve kumaş çiçeklerden yararlanarak küpe, yaka iğnesi, toka ve magnet tasarlanabiliyor.',
      'Atölyede çiçeklerin yanı sıra doğanın sunduğu kurutulmuş meyve, tarçın çubuğu, yıldız anason gibi zengin malzeme alternatifleriyle çalışma imkanı sunuluyor.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: ['Temel Tasarım Becerileri', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Aksesuarlar'],
    malzeme: 'Kuru ve kumaş çiçekler, kurutulmuş meyve, tarçın çubuğu, yıldız anason',
  },
  {
    slug: 'dogal-tutsu-herbaryum', cat: 'cicek',
    title: 'Doğal Tütsü & Herbaryum Tasarım Atölyesi',
    tagline: 'Aromatik bitkilerin yapraklarıyla doğal taze tütsü yapımı ve cam şişelerde bitki herbaryumu tasarımı.',
    img: 'tutsu-herbaryum.jpg', img2: 'cicek-cerceve-2.jpg',
    alt: 'Kurutulmuş aromatik bitkiler ve kuru çiçeklerle hazırlanmış herbaryum tasarımı',
    alt2: 'Kuru çiçek ve otlarla tasarlanmış çerçeve içi botanik kompozisyon',
    paras: [
      'Aromatik bitkilerin yapraklarıyla doğal taze tütsü yapımının deneyimlendiği atölyede ayrıca kuru çiçeklerle cam şişelerin içine bitki herbaryumları tasarlanıyor.',
      'Atölye; aromatik bitkilerin günlük hayatta kullanımı, tarihte tütsünün kullanım amaçları, bitkilerle ilgili ilginç araştırmalarla ilgili bilgilerin kaynaklarıyla paylaşıldığı atölye, doğal tütsü yapımı ve herbaryum tasarımı devam ediyor.',
      'Çiçeklerin katılımcıların üzerinde yarattığı olumlu etkilerin ışığında aromatik bitkilerin zihin açıcı kokuları eşliğinde ürün tasarımı, renk bilgisi atölyeye konu olan deneyimlerden.',
      'Eğitmen ile eş zamanlı uygulama yaparak tasarım deneyimi yaşayan katılımcılar atölye sonunda tasarladıkları tütsüleri kendilerine alabilecekleri gibi dilediklerine hediye de edebilirler.',
      'Doğal tütsü mevsime göre 1-2 hafta kurutulduktan sonra kullanılabiliyor. Herbaryum şişe ise bir ömür bu deneyimi hatırlatıyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; biberiye, lavanta, okaliptüs defne gibi bitkilerin yaprakları, jüt ipler, kuru çiçekler, tarçın çubukları tasarıma konu olan doğadan malzemelerden…',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: ['Stresten Uzaklaşma', 'Temel Tasarım Becerileri', 'Renk Bilgisi', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Doğal Tütsü', 'Herbaryum Tasarımı'],
    akis: ['Tanışma', 'Doğal Tütsü ve Herbaryum Tasarımı & Renk Bilgisi & Örnek Tasarım Eğitmen Uygulama', 'Atölye Eş Zamanlı Uygulama Zamanı'],
    malzeme: 'Biberiye, lavanta, okaliptüs, defne yaprakları, jüt ipler, kuru çiçekler, tarçın çubukları',
  },
  {
    slug: 'taze-cicek-buket', cat: 'cicek',
    title: 'Taze Çiçek Buket & Aranjman Tasarım Atölyesi',
    tagline: 'Mevsim çiçekleriyle buket ve masa üzeri aranjman tasarlamanın deneyimlendiği atölye.',
    img: 'taze-cicek-buket.jpg', img2: 'taze-cicek-buket-2.jpg',
    alt: 'Mor, sarı ve pembe mevsim çiçeklerinden hazırlanmış el buketi',
    alt2: 'Pembe şakayık ve papatyalarla tasarlanmış taze çiçek aranjmanı',
    paras: [
      'Basit buket yapım teknikleri kullanılarak mevsim çiçekleriyle buket tasarlamanı, masa üzeri aranjman tasarlamanın deneyimlendiği atölye.',
      'Atölye; kesme çiçeklerin genel özellikleri ile ilgili bilgilerin aktarılması ile başlıyor. Dünya\'da ve Türkiye\'de kesme çiçek üretimi ile ilgili genel bilgiler, atölyede kullanılacak çiçeklerin isimleri, işlevleri ve buket tasarım teknikleriyle devam ediyor.',
      'Buket, taze kesme çiçek bakım bilgileri, buket vazolama teknikleri, çiçek süngeri ile çalışmak atölyeye konu olan günlük yaşama destek olacak pratik bilgilerden…',
      'Eğitmen ile eş zamanlı uygulama yaparak tasarım deneyimi yaşayan katılımcılar atölye sonunda tasarladıkları buketi kendilerine hediye olarak tasarlayabilecekleri gibi diledikleri kişiye hediye de edebilirler.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; rengarenk, mis kokan mevsim kesme çiçekleri, jüt ipler tasarıma konu olan doğadan malzemelerden…',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: ['Stresten Uzaklaşma', 'Temel Tasarım Becerileri', 'Renk Bilgisi', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Taze Çiçek Buketi'],
    akis: ['Tanışma', 'Buket Tasarımı & Renk Bilgisi Bilgilendirme & Örnek Tasarım Eğitmen Uygulama', 'Atölye Eş Zamanlı Uygulama Zamanı'],
    malzeme: 'Mevsim kesme çiçekleri, jüt ipler, çiçek süngeri',
  },
  {
    slug: 'cicek-cerceve', cat: 'cicek',
    title: 'Çiçek Çerçeve Tasarım Atölyesi',
    tagline: 'Kuru ve kumaş çiçeklerle, doğal kara yosunlarıyla çiçekleri çerçeve içine alan tasarım atölyesi.',
    img: 'cicek-cerceve.jpg', img2: 'cicek-cerceve-2.jpg',
    alt: 'Çerçeve içine yerleştirilmiş kuru çiçek ve kara yosunu kompozisyonu',
    alt2: 'Kuru çiçeklerle tasarlanmış dekoratif duvar çerçevesi',
    paras: [
      'Doğadan, çiçeklerden ilham alarak doğanın sunduğu eşsiz güzelliklerle, çiçeklerle çalışılan çiçekleri çerçeve içine alan tasarım atölyesi.',
      'Kuru ve kumaş çiçeklerle, doğal kara yosunlarıyla çalışılan atölyede amaç; çiçeklere yakından bakabilmek, doğanın güzelliklerini keşfedebilmek, varlıklarıyla ilgili farkındalık yaratmak.',
      'Tasarıma konu malzemelerin tanıtılmasıyla başlayan atölye; çiçeklerle ilgili temel bilgilerle, tasarım ilkeleri ve renk bilgisi paylaşımı ile ilgili bilgilerle ilerliyor.',
      'Yetkinlik ve ek beceri gerektirmeyen atölyede; kuru ve kumaş çiçekler, gerçek doğal otlar (lavanta, biberiye, ruscus, demir otu vb) kozalaklar, kara yosunu, mevsime göre tarçın çubukları, portakal dilimleri, ağaç kabukları tasarıma konu olan doğadan malzemelerden…',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
      'Doğadan ilham alarak tasarlanan çiçek çerçeve kadın katılımcılarımızın gözdelerinden…',
    ],
    kazanim: ['Temel Tasarım Becerileri', 'Yaratıcı Düşünme', 'Sosyalleşme', 'Bilinçli Farkındalık', 'Özgün Tasarım Aksesuarlar'],
    akis: AKIS_DOGA,
    malzeme: "Çerçeve, kuru çiçekler, demir otu, tarçın çubukları, portakal dilimleri",
  },

  /* ---- BİTKİ TASARIM ---- */
  {
    slug: 'kokedama', cat: 'bitki',
    title: 'Kokedama Tasarım Atölyesi',
    tagline: 'Otsu bitkilerle saksısız bitki yetiştirme sanatının deneyimlendiği bitki tasarım atölyesi.',
    img: 'kokedama.jpg', img2: 'kokedama-2.jpg',
    alt: 'Mor hercai menekşeli kokedama yosun topu, yakın plan',
    alt2: 'Ahşap masa üzerinde elde tutulan, yeşil yapraklı kokedama',
    paras: [
      'Otsu bitkilerle saksısız bitki yetiştirme sanatının deneyimlendiği bitki tasarım atölyesi.',
      'Kokedama Japonca bir kelimedir, kelime anlamıyla yosun topu demektir. Uygun toprak karışımıyla bir çamur topu hazırlayıp bitkinin kökleri bu topa dahil edilip yosunla sarılarak tasarlanıyor. Amaç bitkiyi özgürleştirmek, saksısından kurtararak gelişimini sürdürmesini sağlamak.',
      'Kokedama Sanatı\'nın ortaya çıkışı, tarihsel yolculuğu ile başlayan atölye, bitkilerle ilgili genel bilgilerle, kokedamanın bakımı ve gelişim ipuçlarıyla ilerliyor. Eğitmen ile eş zamanlı uygulama süreçleriyle de devam ediyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; otsu bitki, uygun toprak karışımı, kara yosunu, dere taşları, jüt ipler tasarıma konu olan doğadan malzemelerden…',
      'Kokedama tasarım bitki, ofis ya da ev dekorasyonunda kullanılabilir. Minimalist dekorasyonların gözdesi olabilir.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: KAZ_BITKI, akis: AKIS_BITKI,
    malzeme: 'Otsu bitki, uygun toprak karışımı, kara yosunu, dere taşları, jüt ipler',
  },
  {
    slug: 'minyatur-bahce', cat: 'bitki',
    title: 'Minyatür Bahçe Tasarım Atölyesi',
    tagline: 'Çiçekli ve çiçeksiz bitkilerle bir saksı içine tasarlanan minyatür bahçe atölyesi.',
    img: 'minyatur-bahce.jpg', img2: 'minyatur-bahce-2.jpg',
    alt: 'Saksı içinde farklı bitkilerle oluşturulmuş minyatür bahçe aranjmanı',
    alt2: 'Minyatür bahçe atölyesinde tasarlanmış bitki kompozisyonu',
    paras: [
      'Çiçekli ve çiçeksiz bitkilerle bir saksı içine tasarlanarak oluşturulan minyatür bahçe, bitki tasarım atölyesi.',
      'Bakımı, gelişimi kolay olan ve birbirleriyle uyum içinde yaşayabilen bitkilerle bir saksı içerisine bitki aranjmanı olarak tasarlanan minyatür bir bahçe…',
      'Atölye, şehir insanlarını stresten uzaklaştırarak, toprağın mucizevi gücüyle tazelenme imkanı sunuyor.',
      'Doğadan malzemelerin tanıtılmasıyla başlayan atölye; bitkilerle ilgili genel bilgilerle, bitki aranjmanlarının bakımı ve gelişimiyle ilerliyor. Eğitmen ile eş zamanlı uygulama süreçleriyle de devam ediyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; birbirine uyumlu otsu bitkiler, uygun toprak karışımı, kara yosunu, drenaj taşları, lotuslar, ağaç kabukları tasarıma konu olan doğadan malzemelerden…',
      'Doğadan ilham alarak tasarlanan minyatür bahçe ofis ya da ev dekorasyonunda kullanılabilir.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: KAZ_BITKI, akis: AKIS_BITKI,
    malzeme: 'Otsu bitkiler, uygun toprak karışımı, kara yosunu, drenaj taşları, lotuslar, ağaç kabukları',
  },
  {
    slug: 'sukulent-aranjman', cat: 'bitki',
    title: 'Sukulent Aranjman Atölyesi',
    tagline: 'Sukulent bitki türlerinin bir saksı içine dikilmesiyle tasarlanan bitki tasarım atölyesi.',
    img: 'sukulent.jpg', img2: 'sukulent-2.jpg',
    alt: 'Ahşap kap içinde farklı sukulent türleriyle hazırlanmış aranjman',
    alt2: 'Sukulent aranjman atölyesinde tasarlanmış bitki kompozisyonu',
    paras: [
      'Sukulent bitki türlerinin bir saksı içine dikilmesiyle tasarlanan bitki tasarım atölyesi.',
      'Sukulentlerle ilgili ilginç bilgilerin aktarılmasıyla başlayan atölye; bitkilerle ilgili genel bilgilerle, sukulentlerin bakımı ve gelişimiyle ilerliyor. Eğitmen ile eş zamanlı uygulama süreçleriyle de devam ediyor.',
      'Yetkinlik ve beceri gerektirmeyen atölyede; sukulent bitkiler, uygun toprak karışımı, kara yosunu, drenaj taşları, lotuslar, ağaç kabukları tasarıma konu olan doğadan malzemelerden…',
      'Doğadan ilham alarak tasarlanan sukulent aranjmanı ofis ya da ev dekorasyonunda kullanılabilir.',
      'Toprağa dokunmanın stresten arınmaya destek olmasının yanında bitkilerle çalışmak da oldukça motive edici. Yapılan birçok araştırmaya göre; bitkiler salgıladıkları fitonsit gazıyla insan sağlığı üzerinde hem fiziksel hem de zihinsel iyileşme sağlıyor.',
    ],
    kazanim: KAZ_BITKI, akis: AKIS_BITKI,
    malzeme: 'Sukulent bitkiler, uygun toprak karışımı, kara yosunu, drenaj taşları, lotuslar, ağaç kabukları',
  },
  {
    slug: 'kavanoz-teraryum', cat: 'bitki',
    title: 'Kavanoz Teraryum Tasarım Atölyesi',
    tagline: 'Sukulent bitkilerle kavanozların içine bir ekosistem oluşturulan bitki tasarım atölyesi.',
    img: 'kavanoz-teraryum.jpg', img2: 'kavanoz-teraryum-2.jpg',
    alt: 'Cam kavanoz içinde sukulentlerle oluşturulmuş katmanlı teraryum',
    alt2: 'Teraryum atölyesinde tasarlanmış cam kavanoz ekosistemi',
    paras: [
      'Sukulent bitkilerle kavanozların içine bir ekosistem oluşturulan bitki tasarım atölyesi.',
      'En sevilen bitki türlerinden sukulentlerle kavanozların içinde tasarlanan atölyede amaç; doğadaki gibi katmanlar yaratmak.',
      'Doğadan malzemelerin tanıtılmasıyla başlayan atölye; bitkilerle ilgili temel bilgilerle, teraryumun ortaya çıkışı ve gelişimiyle ilerliyor. Eğitmen ile eş zamanlı uygulama süreçleriyle de devam ediyor.',
      'Yetkinlik ve ek beceri gerektirmeyen atölyede; sukulent bitkiler, teraryuma uygun toprak karışımı, kara yosunu, dere taşları, kozalaklar tasarıma konu olan doğadan malzemelerden…',
      'Doğadan ilham alarak tasarlanan teraryum ofis ya da ev dekorasyonunda kullanılabilir.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: KAZ_BITKI, akis: AKIS_BITKI,
    malzeme: 'Sukulent bitkiler, teraryuma uygun toprak karışımı, kara yosunu, dere taşları, kozalaklar',
  },
  {
    slug: 'doga-cerceve', cat: 'bitki',
    title: 'Doğa Çerçeve Tasarım Atölyesi',
    tagline: 'Doğanın sunduğu eşsiz materyallerle doğayı çerçeve içine alan tasarım atölyesi.',
    img: 'doga-cerceve.jpg', img2: 'doga-cerceve-2.jpg',
    alt: 'Canlı bitkiler ve kara yosunuyla tasarlanmış doğa çerçevesi',
    alt2: 'Sukulent ve doğal otlarla oluşturulmuş çerçeve içi bitki kompozisyonu',
    paras: [
      'Doğadan ilham alarak doğanın sunduğu eşsiz materyallerle çalışılan doğayı çerçeve içine alan tasarım atölyesi.',
      'Gerçek canlı bitkilerle, kuru çiçeklerle, doğal kara yosunlarıyla çalışılan atölyede amaç; doğa ile, faydaları ile ilgili farkındalık yaratmak.',
      'Doğadan malzemelerin tanıtılmasıyla başlayan atölye; bitkilerle ilgili temel bilgilerle, ağacın, yosunun ortaya çıkışı ile ilgili bilgilerle ilerliyor. Eğitmen ile eş zamanlı uygulama süreçleriyle de devam ediyor.',
      'Yetkinlik ve ek beceri gerektirmeyen atölyede; sukulent bitkiler, gerçek doğal otlar (lavanta, biberiye, ruscus, demir otu vb) kozalaklar, kara yosunu, dere taşları, mevsime göre tarçın çubukları, deniz kabukları, portakal dilimleri, ağaç kabukları, gerçek kuru çiçekler tasarıma konu olan doğadan malzemelerden…',
      'Doğadan ilham alarak tasarlanan doğa çerçeve her yaştan katılımcıyı cezbederken, oldukça özgün de bir hediye alternatifi oluyor.',
      'Daha önce hiç karşılaşmadığı ya da nadir gördüğü malzemelerle çalışan zihin, yeni kayıtlarla tazelenmiş oluyor. Böylece yaratıcı düşünme potansiyeli artmış oluyor.',
    ],
    kazanim: KAZ_BITKI, akis: AKIS_DOGA,
    malzeme: "Çerçeve, kara yosunu, demir otu, tarçın çubukları, portakal dilimleri, ağaç kabukları, gerçek kuru çiçekler",
  },

  /* ---- ÇOCUK ---- */
  {
    slug: 'mini-kavanoz-teraryum', cat: 'cocuk', online: true, age: '+3 yaş',
    title: 'Mini Kavanoz Teraryum Atölyesi',
    tagline: 'Minik eller üretiyor, hayal kuruyor, yeşille buluşuyor.',
    img: 'mini-kavanoz.jpg', img2: 'mini-bahce.jpg',
    alt: 'Çocuklar için hazırlanmış mini kavanoz teraryum, içinde minik figürlerle',
    alt2: 'Çocuk atölyesinde tasarlanmış mini bahçe saksısı',
    paras: [
      'Minik eller üretiyor, hayal kuruyor, yeşille buluşuyor!',
      'Teraryumun kelime anlamıyla başlıyor bitkilerin güzel dünyalarına doğru bir yolculuğa çıkıyoruz. Minik eller toprakla buluşuyor ve bir eko sistem yaratıyorlar.',
      'Gerisi tamamen hayal gücü… Bitkinin dibinde minik mantarlar, uğur böcekleri, mini bir kuş, belki bir de taşlı patika bir yol, yolun sonunda yavru bir kedi…',
      'Online ya da yüz yüze gerçekleştirilen atölyede dilerlerse ebeveynler de çocuklara eşlik edebiliyor.',
    ],
    kazanim: KAZ_COCUK,
    malzeme: 'Cam kavanoz, toprak, bitkiler ve minik dekoratif figürler',
  },
  {
    slug: 'mini-bahce', cat: 'cocuk', online: true, age: '+5 yaş',
    title: 'Mini Bahçe Atölyesi',
    tagline: 'Minik katılımcıların toprağa dokunup doğaya yakından bakma fırsatı bulduğu doğa aktivitesi.',
    img: 'mini-bahce.jpg', img2: 'mini-kavanoz.jpg',
    alt: 'Ahşap çit ve süs mantarlarıyla bezenmiş çocuk mini bahçe saksısı',
    alt2: 'Çocuk atölyesinde hazırlanmış mini kavanoz teraryum',
    paras: [
      'Minik katılımcıların bitkilere buluştuğu, toprağa dokunup doğaya yakından bakma fırsatı bulduğu keyifli bir doğa aktivitesi.',
      'İlk olarak Tubitak Bitkiler Nasıl Büyür kitabı üzerinden bitkileri konuşuyoruz.',
      'Ardından minik katılımcılar yetiştirme saksısı içerisine yeni tanıştıkları bitkileri dikime hazırlayıp toprakla buluşturuyorlar. Bahçelerini ahşap çitler, mini süs mantarları, kozaklar, ahşap uğur böcekleriyle bahçelerine isimlerinin yazılı olduğu tabelalar dikiyorlar.',
      'Sonrasında bitkinin gelişimini izleyerek bahçelerinin sorumluluğunu alıp; bitki bakım kartlarına gözlemlerini yazarak sonuçları ebeveynlerle paylaşabiliyorlar.',
      'Online ya da yüz yüze gerçekleştirilen atölyede dilerlerse ebeveynler de çocuklara eşlik edebiliyor.',
    ],
    kazanim: KAZ_COCUK,
    malzeme: 'Yetiştirme saksısı, bitkiler, ahşap çitler, mini süs mantarları, kozalaklar, ahşap uğur böcekleri',
  },
  {
    slug: 'kus-evi', cat: 'cocuk', online: true, age: '+5 yaş',
    title: 'Kuş Evi Tasarım Atölyesi',
    tagline: 'Bitkilerin en yakın dostlarını, kuşları konu ederek doğa sevgisi farkındalığı yaratan atölye.',
    img: 'kus-evi.jpg', img2: 'kalemlik.jpg',
    alt: 'Çocukların boyayıp süslediği ahşap kuş evi tasarımı',
    alt2: 'Doğal malzemelerle süslenmiş çocuk kalemlik tasarımı',
    paras: [
      'Kuş Evi Tasarım Atölyesi ile bitkilerin en yakın dostlarını, kuşları konu ederek doğa sevgisi ile ilgili farkındalık yaratmayı hedefliyoruz.',
      'Doğanın eşsiz güzellikleri kuşları tanıyarak özelliklerini konuştuğumuz atölyenin devamında çocuklar, serçe gibi küçük kuşlar için gerçek bir kuş evi tasarlıyorlar.',
      'Ebeveyn-çocuk etkinliği olarak da gerçekleştirilebilen atölyede, tasarıma ham ahşap obje boyanarak başlanıyor hemen ardından da sevimli mini materyallerle süsleniyor.',
      'Online ya da yüz yüze gerçekleştirilen atölyede dilerlerse ebeveynler de çocuklara eşlik edebiliyor.',
    ],
    kazanim: KAZ_COCUK_2,
    malzeme: 'Ham ahşap kuş evi, boya, mini dekoratif materyaller',
  },
  {
    slug: 'kalemlik', cat: 'cocuk', online: true, age: '+5 yaş',
    title: 'Kalemlik Tasarım Atölyesi',
    tagline: 'Çocukların doğadan malzemelerle kendi kalemliklerini tasarladığı atölye.',
    img: 'kalemlik.jpg', img2: 'kus-evi.jpg',
    alt: 'Doğal malzemelerle süslenmiş, çocuk tarafından tasarlanmış kalemlik',
    alt2: 'Çocukların boyadığı ahşap kuş evi tasarımı',
    paras: [
      'Kalemlerin düzenleyicileri kalemlikleri çocuklar dilediği gibi tasarlayıp çalışma masalarına yerleştiriyorlar.',
      'Bazen bir saksı, bazen bir vazo ve hatta bir bardak bile kalemlik görevi görebiliyor, yaratıcı zihinler doğadan malzemelerle, doğadan aldıkları ilhamla iş başında…',
      'Online ya da yüz yüze gerçekleştirilen atölyede dilerlerse ebeveynler de çocuklara eşlik edebiliyor.',
      'Ebeveyn-çocuk birlikte tasarlayabilecekleri ayakkabılar oldukça sevimli.',
    ],
    kazanim: KAZ_COCUK_2,
    malzeme: 'Saksı, vazo ya da bardak; doğadan malzemeler',
  },
  {
    slug: 'cocuk-doga-cerceve', cat: 'cocuk', online: true, age: '+5 yaş',
    title: 'Doğa Çerçeve Atölyesi',
    tagline: 'Doğada bulunan diğer canlılarla ilgili farkındalık yaratmak üzere doğadan çerçeve tasarlanıyor.',
    img: 'cocuk-doga-cerceve.jpg', img2: 'doga-cerceve.jpg',
    alt: 'Çocuklar için doğadan malzemelerle tasarlanmış çerçeve',
    alt2: 'Kara yosunu ve bitkilerle oluşturulmuş doğa çerçevesi',
    paras: [
      'Doğa Çerçeve Atölyesi\'nde doğada bulunan diğer canlılarla ilgili farkındalık yaratmak üzere doğadan çerçeve tasarlanıyor.',
      'Tubitak\'ın Yabani Çiçekler kitabıyla giriş yapılan atölyede doğayı baş ucuna koymak isteyen minik eller doğadan malzemelerle çerçeve tasarlıyor. Yeryüzünde yayılan ilk bitkilerden olan kara yosunlarını çerçeveye zemin olarak yerleştirilip doğadan diğer malzemelere odaklanılıyor.',
      'Online ya da yüz yüze gerçekleştirilen atölyede dilerlerse ebeveynler de çocuklara eşlik edebiliyor.',
    ],
    kazanim: ['Yaratıcı Düşünme', 'Doğa Sevgisi', 'Çevre Farkındalığı', 'Temel Botanik', 'Yabani Çiçekler'],
    malzeme: 'Çerçeve, kara yosunu, doğadan toplanmış bitki materyalleri',
  },
];

export const corporate = [
  {
    id: 'gelisim', short: 'Atölye',
    title: 'Doğadan Gelişim Atölyeleri',
    tagline: 'Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında, koçluk yaklaşımıyla doğa temalı atölyeler.',
    img: 'kurumsal-01.jpg',
    alt: 'Kurumsal atölyede uzun masa etrafında doğal malzemelerle tasarım yapan katılımcılar',
    paras: [
      'Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında <strong>konu dahilinde konsept geliştirerek koçluk yaklaşımıyla doğa temalı</strong> olarak planladığımız <strong>atölyeler</strong> gerçekleştiriyoruz.',
      'Atölye katılımcılarının günlük rutin hayatında sıkça rastlamadığı doğal ürünler, çiçekler, bitkilerle zihne yeni kayıtlar atıyor, böylelikle yaratıcı düşünebilmenin kapısını aralamış oluyoruz.',
      'Zihin pratiği fırsatı sunuyor, üretmenin keyfini yaşatıyoruz.',
      'Yıllardır birçok farklı alanda çalışmaya konu olmuş ve etkinliği ispatlanmış aktif öğrenme metodunu kullanıyoruz. Kurum kültürü ya da çalışan yetkinlik gelişimi çerçevesinde pekiştirilmesi ya da davranışa dönmesi amaçlanan konuyu, aktif öğrenme metodu ile derinleştiriyoruz.',
      '<strong>Aktif öğrenme yöntemleri arasında olan atölyeler; katılımcıların hem bilişsel hem fiziksel becerilerini eş zamanlı çalıştırarak</strong> yaratıcı düşünme, iş birliği geliştirme, problem çözme ve kişilerarası becerilerin gelişimi gibi önemli noktalarda fark yaratabilmektedir.',
      'Atölyeleri yüz yüze ya da Tüm Türkiye geneli online olarak planlayabiliyoruz. Atölyelerin türlerine göre hazırlanan içerikleri kitlerle katılımcıların adreslerine ulaştırıyor, katılımcıya online destek vererek gerçekleştiriyoruz.',
    ],
    fayda: [
      'Problem çözme pratiği edinme', 'Rutin dışı beceriyle zihinsel esneklik', 'Yaratıcı Düşünme',
      'Somut başarı (Ürün üretme)', 'Terapi (Rahatlama, stres atma)', 'Eğlence, Sosyal Aktivite',
      'Sonuç Odaklılık (İş Sonucu Görme)', 'İşe Adaptasyon Destek', 'Odaklanma',
    ],
  },
  {
    id: 'egitim', short: 'Eğitim',
    title: 'Doğa Temelli Eğitimlerimiz',
    tagline: 'Doğayla etkileşimde anlam bulmak — üç ilke üzerine kurulu bir eğitim programı.',
    img: 'kurumsal-03.jpg',
    alt: 'Doğa temelli eğitim programında bir araya gelmiş kurumsal katılımcı grubu',
    paras: [
      'Doğayı kendi amaçlarımız için kullanacağımız bir kaynak olarak görme yanılgısı, bizi hem gezegenden hem de kendi doğamızdan uzaklaştırdı.',
      'Oysa varoluşumuz, kendimizle, başka insanlarla ve tüm canlılarla kurduğumuz etkileşimlerin bir mozaiğidir.',
      'Biz iş hayatını hayatta kalma mücadelesi verilen bir arena olarak değil, her bir parçanın birbiriyle görünmez ağlarla beslendiği canlı bir ekosistem olarak yeniden hayal ediyoruz.',
      'Çünkü biliyoruz ki, doğanın milyarlarca yıllık bilgeliği, günümüzün en karmaşık zorluklarına bile en sürdürülebilir cevapları sunuyor.',
    ],
    ilkeler: [
      {
        no: '01', title: 'Kök Salmak', sub: 'Ait Olduğun Ekosistemi Anlamak',
        text: 'Bu, varlığımızın temelidir. Tıpkı bir ağacın toprağa, bir canlının habitatına ait olması gibi, insanın da anlam bulması için bir "yere" ait hissetmesi gerekir. Bu ilke, bizi çevreleyen her şeyle derin bir bağ kurmaya davet eder. Bu, "ben" bilincinden "biz" bilincine, etrafımızdaki canlı ve cansız her şeyin birbirine bağlı olduğu gerçeğini idrak etmeye geçiştir. Ayrı ve üstün değiliz; varlığımız, içinde bulunduğumuz ekosistemin sağlığıyla doğrudan ilişkilidir. Gerçek dönüşüm, ancak ait olduğun zemini anladığında başlar.',
      },
      {
        no: '02', title: 'Sorumluluk Almak', sub: 'Yatağını Bulan Nehir Olmak',
        text: 'Ekosistemin bir parçası olmak, pasif bir kabulleniş değildir; aksine, aktif bir sorumluluk gerektirir. Tıpkı bir nehrin kendi yatağını bularak denize doğru kararlılıkla akması gibi, her birey de kendi özünü tanımalı ve potansiyelini bu ekosistem içinde en doğru şekilde akıtmalıdır. Bu, gezegen üzerindeki etkimizin farkında olmak, proaktif davranmak ve kendine yetebilme gücünü keşfetmektir. Sorumluluk, sadece görevleri yerine getirmek değil, ekosistemdeki etkinin bilinciyle hareket etmektir.',
      },
      {
        no: '03', title: 'Birlikte Yeşermek', sub: 'Simbiyotik Ağlar Kurmak',
        text: 'Kök saldığımız bu ekosistemde yalnız değiliz. Bir orman, tekil ağaçların toplamı değil, kökler aracılığıyla birbiriyle konuşan, kaynakları paylaşan ve birbirini destekleyen devasa bir organizmadır. Bu ilke, rekabet yerine simbiyozu, hiyerarşi yerine ise güven ağlarını koyar. Sosyal bağlar ve iş birliği, ekosistemin refahını sağlayan ve bizi besleyen görünmez köklerdir.',
      },
    ],
  },
  {
    id: 'sosyal', short: 'Danışmanlık',
    title: 'Sosyal Sorumluluk & İş Danışmanlığı',
    tagline: 'Kurum kültürüne göre sosyal sorumluluk proje tasarımı, süreç danışmanlığı ve raporlama.',
    img: 'kurumsal-04.jpg',
    alt: 'Sosyal sorumluluk projesi kapsamında düzenlenen kurumsal atölye',
    paras: [
      'Kurum özelinde ülke istatistiklerine dayanan ihtiyaçlar paralelinde; kurum kültürüne göre sosyal sorumluluk proje tasarımı, proje süreç danışmanlığı, proje raporlama, gönüllülük seminerleri, çalışan motivasyonu etkinlik hizmetleri veriyoruz.',
    ],
    hizmetler: [
      'Sosyal sorumluluk proje tasarımı',
      'Proje süreç danışmanlığı',
      'Proje raporlama',
      'Gönüllülük seminerleri',
      'Çalışan motivasyonu etkinlikleri',
    ],
  },
];

export const team = [
  {
    slug: 'ceylan-kalyon', name: 'Ceylan Kalyon', role: "Atölye Eğitmeni - Koç - Tasarımcı",
    img: 'ceylan-kalyon.jpg', alt: 'Ceylan Kalyon portresi',
    paras: [
      "Kariyer yolculuğu; kurumsal iletişim, iç iletişim, marka iletişimi, medya ilişkileri, dergi editörlüğü, sosyal medya yönetimi ile iletişim çerçevesinde süregeldi.",
      "Profesyonel kariyeri, Dünya Göz Hastaneler Grubu’nda medya iletişim departmanında başladı. Medya ilişkileri yönetimi ve iç iletişim alanlarında görev yaptı.",
      "Ardından yayıncılık sektöründe Dünya Gazetesi ile gazeteciliği, Kobilife dergisi ile editörlüğü deneyimleme fırsatı buldu. İletişim ajanslarıyla; ulusal markaların iletişim departmanlarına hizmet ederken uluslararası bir firmada görev yapma fırsatı buldu.",
      "GSK’da (GlaxoSmithKline) İletişim departmanında İç İletişim’den sorumlu olarak göreve başladı. Ardından görevine ek olarak Kurumsal İletişim Departmanı’nda da görev alarak İç ve Kurumsal İletişim Yöneticisi olarak birçok yerel ve global projede aktif görev aldı. GSK’da kültür değişim projesi kapsamında çalışan kulüpleri kurulması, iç iletişim organizasyonlarının planlanması, kurumsal iletişim kapsamında iletişim stratejisinin oluşturulması, yürütülmesi, basın ilişkileri, sosyal sorumluluk projelerinin planlanması, hayata geçirilmesi, sosyal medya yönetimi görevlerinde bulundu.",
      "Kurumsal sosyal sorumluluk ve gönüllülük yolculuğu ise; üniversite yıllarında TOG gönüllüsü olarak adım attığı sivil toplum kuruluşlarına Make a Wish, Koruncuk Vakfı, TOÇEV, TEMA gibi vakıflarda gönüllü olarak çalıştı.",
      "Dünya Göz Grubu’nda Türkiye ile Göz Göz’e sosyal sorumluluk projesinde aktif rol alarak; kurumsal iletişim faaliyetleri yürüttü.",
      "GSK’da Sosyal Sorumluluk Kulübü’nü kurdu ve iki dönem kulüp başkanlığını yaptı. Hayata geçirilen Kök Hücre Kardeşliği, Turuncu Pedal Hareketi, Bağlanamam Sağlıklı Gençlik Hareketi projeleri birçok ödül kazandı. GSK’nın 10 yılı aşkın süredir devam eden Global Sosyal Sorumluluk Projesi PULSE kapsamında Hatay’da yerleşik olarak çocuk koruma alanında faaliyet gösteren Save The Children bünyesinde gönüllü olarak aktif görev alarak çocuk koruma alanında ülkesine katkı sağladı.",
      "Ardından eğitim sektöründe faaliyet gösteren MB Akademi’de Pazarlama İletişimi Direktörü ve profesyonel koç olarak görev yaptı.",
      "Kariyer yolculuğuna aldığı koçluk eğitimi sonrası farklı bir yön veren Ceylan; sosyal sorumluluk proje danışmanlığı, çalışan markası yaratma, kurum içi kültür değişim yönetimi, sosyal medya yönetimi alanlarında danışmanlık ve koçluk yapmaya başladı. Bu alanda görev yaparken botaniğe, çiçeklere ve doğaya olan ilgisini işe dönüştürebilmek üzere; Temel Çiçekçilik Eğitimi, Profesyonel Çiçek Tasarım Eğitimi ve materyal tasarım eğitimleri alarak Afloday’i kurdu.",
      "İletişim becerilerine güvenen bir iletişim profesyoneli, koçluk mesleğinin inceliklerine hakim bir koç, çiçeklere, doğaya, yeşile hayran bir kadın olarak; doğayı iletişim disiplini, sosyal sorumluluk ile birleştirdi.",
      "Marmara Üniversitesi İletişim Fakültesi ve Galatasaray Üniversitesi Pazarlama İletişimi yüksek lisans mezunu, ICF Koçluk Federasyonu onaylı koç olan Ceylan Kalyon; şimdi insanların hayatlarını yeniden tasarlamalarına ilham verecek; doğayla tasarımın birleştiği atölyelerde aktif öğrenme desteği modeli ile kurumlara ve kişilere katkı sağlıyor.",
    ],
    linkedin: true,
  },
  {
    slug: 'tugce-hazinedar', name: 'Tuğçe Hazinedar', role: "Atölye Eğitmeni - Tasarımcı",
    img: 'tugce-hazinedar.jpg', alt: 'Tuğçe Hazinedar portresi',
    paras: [
      "Çocukluğundan beri, botanik bilimleri, doğa ve çiçeklerle yakından ilgili olan Tuğçe; bulduğu her fırsatta doğaya, çiçeklere yakınlaşma çabası içinde oldu.",
      "Kariyerini INDITEX bünyesinde insan kaynakları alanında 10 yılı aşkın sürede çeşitli pozisyonlarda görev yaparak şekillendirdi.",
      "Kurum bünyesinde çeşitli eğitimler vererek hem kurumuna hem çalışanlara katkı sağladı.",
      "Çiçeklere, doğaya hayatında her zaman bir kapı aralayan Tuğçe, yıllardır hayalini kurduğu hobisini işe dönüştürme hedefini Tila Flora’yı kurarak gerçekleştirdi. Bu alanda da uzmanlaşmak üzere profesyonel çiçek tasarımı ile ilgili eğitim aldı. Tila Flora’da butik çiçek düzenlemeleri, düğün çiçekleri ve kurumsal çiçek hediyeleri hazırlamaktan büyük mutluluk duyuyor.",
      "İlk ve lise öğrenimini Özel Şişli Terakki Okulları’nda ve lisans eğitimini İngiliz Dili ve Edebiyatı bölümünde İstanbul Özel Kültür Üniversitesi’nde tamamladı.",
      "Tuğçe evli ve bir kız çocuğu annesidir.",
    ],
  },
  {
    slug: 'derya-akyazici-kalyon', name: 'Derya Akyazıcı Kalyon', role: "Atölye Eğitmeni – Çocuk Atölyeleri Danışmanı",
    img: 'derya-akyazici-kalyon.jpg', alt: 'Derya Akyazıcı Kalyon portresi',
    paras: [
      "Erken yaşta çocukluk dönemi uzmanlığına sahip olan danışmanımız okul öncesi eğitmeni olarak uzun yıllar görev yaparak bir çok çocuğun zihnen ve fiziken sağlıkla gelişmesi için öncülük etmiştir.",
      "Okul öncesi öğretmeni olarak bir çok eğitim kurumunda uzun yıllar görev yapan danışmanımız; meslek aşkını çocuk sevgisine bağlar. Okul öncesi eğitiminin yanında aynı zamanda Helen Doron Eğitim Sistemi’nin Eğitmen Eğitimi’ni de tamamlayarak, Helen Doron Okulları’nda eğitmenlik yapmıştır.",
      "Derya evli ve bir çocuk annesidir.",
    ],
  },
  {
    slug: 'elif-celikkol-duman', name: 'Elif Çelikkol Duman', role: "Atölye Eğitmeni – Tasarımcı",
    img: 'elif-celikkol-duman.jpg', alt: 'Elif Çelikkol Duman portresi',
    paras: [
      "1989 yılının ılık bir ilkbahar öğleden sonrasında İstanbul’da güzel bir bahçede dünyaya gelmiştir.",
      "Yıldız Teknik Üniversitesi Kimya bölümünü tamamlayıp kariyerine kurumsal bir firmada başlamış 2 yıl süreyle görev yapmıştır.",
      "El sanatlarına olan ilgisi yaratıcı kişiliğiyle birleşince farklı arayışlara girmiş bir Grafik ve Web Tasarım Eğitim Programı’nı tamamlayarak el becerilerini kullanabileceği farklı bir kariyer arayışına girmiştir.",
      "Yolu bir çiçek atölyesi ile kesişmiş, aldığı çiçek tasarım eğitimleri sonrasında; bireysel hobi edinme workshoplarında ve kurumlarda çiçek, bitki tasarım atölyelerinde atölye eğitmenliği yapmıştır.",
      "Teraryum Atölyesi, Kapı Süsü Tasarımı Atölyesi, Kokedama Atölyesi, Çiçek Küpe Atölyesi, Tablo Atölyesi gibi birçok atölyede tasarımla yaratıcılığın başrolde olduğu saatlere keyifle liderlik etmiştir.",
      "2019 yılında kendi hayalinin peşinden koşma cesaretini göstererek kendi markası; Filart Design’ı kurmuştur.",
      "Çiçekli ve rengarenk camekanlar ardından bakmaya çalıştığı dünyasında, kişiye özel tamamı doğal ve el yapımı hediyelikler tasarlayıp üretmeye, insanların hayatlarını çiçekli tasarımlarıyla güzelleştirmeye devam etmektedir.",
    ],
    linkedin: true,
  },
  {
    slug: 'alara-apaydin-saruhan', name: 'Alara Apaydın Saruhan', role: "Atölye Eğitmeni",
    img: 'alara-apaydin-saruhan.jpg', alt: 'Alara Apaydın Saruhan portresi',
    paras: [
      "Kariyer yolculuğuna uluslararası kurumların iletişim departmanlarında başlayan Alara, 10 yılı aşkın süre uluslararası firmalarda birçok farklı sektörde İç İletişim, Marka İletişimi, Kurumsal İletişim, Çalışan Markası Yaratma, Sosyal Medya Yönetimi alanlarında görev yaparak deneyim kazanmıştır.",
      "Turizm otelcilik sektöründe Grand Hyatt İstanbul’da, ilaç sektöründe GSK’da (GlaxoSmithKline) ardından Philip Morris ve kozmetik sektöründe AVON’da birçok iç iletişim ve medya kampanyası yürütmüş, aktif rol aldığı projelerin çoğu ulusal ve uluslararası alanda birçok ödül kazanmıştır.",
      "Her dem bitkilerden ilham alan, çiçeklerle arasını hep yakın tutan Alara aldığı bitki hobi eğitimlerini işe dönüştürme fırsatı yaratarak kurumsal etkinliklerde keyifle atölye eğitmenliği yapmaktadır.",
      "Lisans eğitimini İstanbul Bilgi Üniversitesi Uluslararası İlişkiler ve Ekonomi bölümlerinde, yüksek lisansını Hollanda Twente Üniversitesi’nde Kamu Yönetimi alanında yapmıştır.",
      "İyi derecede İngilizce bilen Alara, evli ve iki çocuk annesidir.",
    ],
    linkedin: true,
  },
  {
    slug: 'zeynep-altunhan', name: 'Zeynep Altunhan', role: "Eğitmen",
    img: 'zeynep-altunhan.jpg', alt: 'Zeynep Altunhan portresi',
    paras: [
      "Kariyer yolculuğunda ağırlıklı olarak perakende sektöründe insan kaynakları yöneticisi olarak görev alan Zeynep; şirket birleşmeleri ve satın almalar, şirketlerin büyümesi ve küçülmesi süreçlerinde aktif görev alma, bölge müdürlükleri açma, start-up girişimlere destek verme gibi pek çok farklı süreçte önemli deneyimler edindi.",
      "İnsan kaynakları politikaları ve stratejileri oluşturma, işe alım, eğitim ve gelişim, yetenek yönetimi, değişim yönetimi projeleri, performans sistemi, iç iletişim, çalışan bağlılığı projeleri, DIE, ücretlendirme ve yan haklar sistem yönetimi gibi birçok insan kaynakları fonksiyonunda deneyim kazandı.",
      "Zeynep kariyer yolculuğuna eğitim danışmanlık alanında devam ederken hemen her sektörde yer alan şirket için eğitim programları düzenledi. Ağırlıklı olarak etkili iletişim, ekip çalışması, yöneticilik teknikleri, liderlik yeteneklerini geliştirme ve kadın liderliği konularına yoğunlaştı.",
      "Eğitim programlarının yanı sıra PCC seviyesinde profesyonel koç olarak üst düzey yönetici koçluğu ve yöneticiliğe yeni adım atan çalışanlar için mentorluk desteği sağlıyor.",
      "Analiz yeteneği, sistem tasarlama ve uygulama becerisi zengin olan Zeynep, Gestalt psikoloji ekolünde bilgi ve deneyimini derinleştirmek için çalışıyor, nöroscience alanındaki son araştırmaları takip ediyor, Batı ve Doğu felsefesi konusunda okumalar yapmayı sürdürüyor.",
    ],
  },
  {
    slug: 'muharrem-ozdemir', name: 'Muharrem Özdemir', role: "Kurumsal Eğitim Danışmanı",
    img: 'muharrem-ozdemir.jpg', alt: 'Muharrem Özdemir portresi',
    paras: [
      "Kariyerine Doğuş Grubu’nda Satış Yöneticisi olarak başladı. Sonrasında Nestle Türkiye ve Marsa Kraft’da FMCG sektöründe satış ve yöneticilik pozisyonlarında görev aldı. Bu süre içerisinde Türkiye’nin birçok ilinin ticari yapısını gözlemleme şansını elde etti. Bu süre zarfında hem geleneksel hem de modern satış kanallarında görev aldı.",
      "2005 yılında Turkcell ile GSM sektörüne geçiş yaptı. Turkcell’de Kurumsal Hizmetlerde sırasıyla Bölge Yöneticisi, Bölge Müdürü ve Grup Satış Müdürü olarak kurumsal saha satış departmanında görev aldı. Hem iş ortağı hem de iş ortağı personeli yönetimi ile sektöre yeni bir anlayış kazandıran ticari tasarımların uygulanmasında görev aldı. Turkcell Kurumsal Hizmetler’de Satış Operasyon Grup Müdürü olarak Satış Operasyon, Raporlama ve Eğitim Takımını yönetti.",
      "2011 yılından itibaren profesyonel eğitmenlik ve danışmanlık yapmaktadır. Aile şirketlerinin kurumsallaşma, satış süreçleri ve prim sistemi tasarımları, değişim yönetimi, performans yönetimi gibi alanların yanında üst düzey yönetim danışmanlığı konularında kurum veya yöneticilere danışmanlıklar yapmaktadır.",
      "Kurum ihtiyacına göre çalışan yetkinlik gelişimi kapsamında; eğitim süreç tasarımı, kültür-değişim proje yönetimi, prim ve performans yönetim modeli geliştirme, satış süreci iyileştirme, kurum süreç mükemmelleştirme gibi birçok farklı fonksiyonda iş geliştirme üzerine danışmanlık vermektedir.",
      "1971 yılında Ankara’da doğan Muharrem; lisans eğitimini Atatürk Üniversitesi İktisadi ve İdari Bilimler Fakültesi İşletme Bölümü’nde tamamlamıştır. Model arabalara ilgi duymakta ve profesyonel fotoğrafçılık ile uğraşmaktadır.",
    ],
  },
];

/* "Dönemsel Konsept Hobi Atölyeleri" — afloday.com/dogadan-hobi-atolyeleri
   sayfasındaki gerçek vaka örnekleri. Metinler birebir alınmıştır. */
export const donemselKonsept = {
  giris: 'Atölyelerimizi kurum ihtiyaçlarına göre şekillendirebildiğimiz gibi, mevsime göre, özel günlere göre de şekillendirebiliyoruz.',
  giris2: 'Çalışan motivasyonu, özel gün etkinlikleri, iç iletişim aktivitesi, işe adaptasyon kapsamında gerçekleştirdiğimiz projelerden örnek vermek gerekirse:',
  vakalar: [
    { baslik: 'Yeni ürün lansmanı',
      atolye: 'Dekoratif Obje Tasarım Atölyesi',
      metin: 'Yeni ürün lansmanı yapan bir kurum için, doğal içeriği olan ürünün konsept bir atölye ile tanıtımının yapılmasına eşlik ettik. İç lansmana özel Dekoratif Obje Tasarım Atölyesi düzenleyerek ambalajı dekoratif süs olarak kullandık.' },
    { baslik: 'Sonbahar',
      atolye: 'Bal Kabağı Sukulent Atölyesi',
      metin: 'Sonbaharda çıkan bal kabaklarıyla sonbahar neşesini çalışanların masalarına taşımak üzere Bal Kabağı Sukulent Atölyesi gerçekleştirdik.' },
    { baslik: 'İç iletişim etkinliği',
      atolye: 'Şapka Tasarım Atölyesi',
      metin: 'Yazın sıcağında bir kurumda iç iletişim etkinlikleri kapsamında bir dondurma tadım aktivitesinde Şapka Tasarım Atölyesi düzenledik.' },
    { baslik: 'Babalar Günü',
      atolye: 'Kokedama Atölyesi',
      metin: 'Babalar Günü’nde çalışanların çocuklarıyla dahil olabildiği hoş bir babalar günü anısı olan Kokedama Atölyesi organize ettik.' },
    { baslik: 'Kadınlar Günü',
      atolye: 'Koruncuk Kurumsal Gönüllü Atölyesi',
      metin: 'Kadınlar Günü’nde kadın çalışanlara bir Koruncuk Kurumsal Gönüllü Atölyesi düzenleyerek Çiçek Aksesuar Atölyesi gerçekleştirdik. Kurumları her kadın çalışan adına Koruncuk Vakfı’ndan bir Dijital Bağış Sertifikası aldı ve onlara Çiçek Aksesuar Atölyesi hediye etti. Katılımcı kadın çalışanlar ilk olarak haklarından yoksun çocuklarla ilgili bilgi aldılar ve çiçeklerden aksesuarlar tasarlayarak birini kendileri için anı olarak aldılar, diğerlerini vakıf yararına çevrelerine satarak vakfa bağış desteği sağladılar. Biz de böylelikle kız çocuklarının eğitimine katkı sağlamalarına aracılık ettik.' },
    { baslik: 'Çalışan motivasyonu',
      atolye: 'Minyatür Bahçe Atölyesi',
      metin: 'Çalışan Motivasyonu kapsamında çalışanları şehrin, işin, pandemi etkilerinin dönemsel stresinden arındırmak üzere toprağın iyileştirici gücünden yararlanarak Minyatür Bahçe Atölyesi yaptık. Çalışanlar masalarının üzerine uzun ömürlü, bakımı kolay bitkilerle bir bitki aranjmanı yaparak çalışma ortamlarını yeşillendirdiler.' },
    { baslik: 'Hobi edindirme projesi',
      atolye: 'Kavanoz Teraryum Atölyesi',
      metin: 'Çalışanların hobi edinmesi amacıyla hayata geçen özel bir projede Kavanoz Teraryum Atölyesi düzenledik. Katılımcıları bitkilerin bir ekosistemde bir arada yaşaması uğraşı olan Teraryum’la tanıştırdık ve bir ekosistem yaratmalarına eşlik ettik.' },
    { baslik: 'Kurum içi piknik',
      atolye: 'Çiçek Taç Atölyesi',
      metin: 'Kurum içi piknik etkinliğinde Çiçek Taç Atölyesi düzenleyerek canlı kır çiçekleriyle çiçeklerden taç tasarlamayı deneyimlettik.' },
    { baslik: '23 Nisan',
      atolye: 'Doğadan Çocuk Atölyeleri',
      metin: '23 Nisan’da çalışanların çocukları için bir çocuk gelişimi uzmanı ile çalışarak çocukların yaş grupları ve becerilerine göre yaratıcılıklarını geliştiren Doğadan Çocuk Atölyeleri organize ettik. Mini Bahçe Atölyesi, Seramik Ayakkabı Kalemlik Tasarımı, Mini Kavanoz Teraryum Atölyesi gibi atölyeler düzenledik.' },
  ],
};

export const projects = [
  {
    id: 'gulumseyen-yarinlar',
    slug: 'proje-gulumseyen-yarinlar',
    title: 'Gülümseyen Yarınlar Projesi',
    tagline: 'Çiçeklerle Gülümseyen Yarınlara Gönüllü Olduk',
    img: 'koruncuk-01.jpg', img2: 'koruncuk-03.jpg',
    alt: 'Koruncuk Vakfı gönüllü atölyesinde bir araya gelen katılımcılar',
    alt2: 'Gönüllü atölyesinde doğal malzemelerle çalışan katılımcı grubu',
    paras: [
      'AFLODAY Doğadan Gelişim Atölyesi olarak; paylaştıkça var olacağımızı düşünüyor, topluma fayda sağlamayı görev biliyoruz.',
      'Küçük de olsa her işletme odaklandığında ve stratejik hareket ettiğinde topluma bir konuda katkı sağlayabilir, fayda yaratabilir biliyoruz. İddiamız proje sonunda yarattığımız etkiyi belgeleyerek küçük işletmeler için de bir model oluşturmak.',
      'Haklarından yoksun çocukların temel haklarına kavuşabilmesine, iyi bir geleceğe sahip olmasına ve topluma geri kazandırılmasına destek olma amacını güden projede; hakları ihlal edilen çocuklarla ilgili farkındalık yaratmak, şartlarını iyileştirmek üzere toplumu bilinçlendirmek, gönüllüğü teşvik etmek üzere çalışıyoruz.',
      '2019 yılında başlattığımız projenin kısa vadede hedefi online atölyelerle her yıl 1000 kişiye ulaşıp konu ile ilgili farkındalık yaratmak, uzun vadeli hedef ise; çocuk haklarını korumak, sağlıklı toplum için sağlıklı çocuklar yetişmesine destek sağlamak üzere toplumu bilinçlendirmek.',
    ],
    kapsam: {
      baslik: 'Gülümseyen Yarınlar Projesi kapsamında;',
      maddeler: [
        '2019 yılında her ay iki adet ücretsiz Koruncuk Gönüllü Atölyesi gerçekleştirdik.',
        'Çocuk haklarını, çocuk hakları ihlallerine karşı yapılabilecekleri, Koruncuk Vakfı’nı anlattığımız atölyeler ile yaklaşık 500 kişiye birebir eriştik, gönüllülüğü teşvik ettik ve yüzlerce kişide konu ile ilgili farkındalık yarattık.',
        '2019 yılından beri finanse ettiğimiz projeyi 2022 yılından itibaren kurum ve bireylerin atölye sponsorluğunda gerçekleştirerek daha fazla sayıda insana ulaşma hedefinde ilerliyoruz.',
        '2022 proje stratejisiyle her ay 2, yılda 24 atölye ile 1000’den fazla gönüllüye ulaşarak 20.000 kişiyle etkileşimli farkındalık, medya erişimiyle 6 milyon kişiye ulaşıp 100 çocuğun 1 yıllık eğitim masrafını karşılamak hedefleniyor.',
      ],
    },
    kapanis: 'Koruncuk Vakfı Gönüllü Atölyesi detayları için <a href="iletisim.html">buraya</a>, kampanyaya bağış yapmak için ise <a href="https://www.koruncuk.org/" rel="noopener">buraya</a> tıklayabilirsiniz.',
  },
  {
    id: 'gelecegi-yesil-tasarla',
    slug: 'proje-gelecegi-yesil-tasarla',
    title: 'Geleceği Yeşil Tasarla Projesi',
    tagline: 'Doğaya ve Topluma Sorumluluk',
    img: 'yesil-tasarla-01.jpg', img2: 'yesil-tasarla-03.jpg',
    alt: 'Geleceği Yeşil Tasarla atölyesinde fidan ve bitkilerle çalışan katılımcılar',
    alt2: 'Sürdürülebilirlik atölyesinde doğal malzemelerle tasarım yapan grup',
    paras: [
      'Geleceği Yeşil Tasarla Projesi, çevresel sürdürülebilirlik kapsamında yetişkin ve çocuklarda davranış geliştirmeyi hedefleyen bir sürdürülebilirlik projesidir.',
      'Proje; doğaya duyarlılık ve çevre bilinci oluşturmayı amaçlayarak, doğal kaynakların korunması, sürdürülebilir kaynak yönetiminin sağlanması ve bireylerde olumlu davranış değişiklikleri oluşturmayı hedefliyor.',
      'Bu kapsamda doğadan ilham alarak yetişkinler ve çocuklarla doğadan sürdürülebilir hobi atölyeleri düzenliyor, interaktif online seminerlerle de bu bilinci yerleştirmeye, toplumda sorumlu bireylerin yetişmesine katkı sağlamayı, bireylerin karbon ayak izini azaltmayı amaçlıyoruz.',
      'Doğadan ilham alan hobi atölyeleri ve interaktif online seminerler sayesinde katılımcılarımız, çevreye duyarlılık konusunda bilinçlenirken aynı zamanda iklim değişikliği ile mücadelede nasıl bir rol üstlenebileceklerini öğreniyorlar. Projemiz, yetişkinlerde ve çocuklarda sürdürülebilir davranış değişikliği sağlayarak toplumda daha sorumlu ve çevreye duyarlı bireylerin yetişmesine katkıda bulunmayı da amaçlıyor.',
      'Doğadan Hobi Atölyeleri ile doğaya olan sevgiyi pekiştirmeyi, doğaya yaklaşmalarını ve sürdürülebilirlik bilincini artırmayı öngörüyoruz.',
      'Online Seminerler ile iklim değişikliği, çevresel sürdürülebilirlik ve toplumsal, çevresel sorumluluk konularında katılımcılara bilgi ve farkındalık kazandırmayı hedefliyoruz. Uzman konuşmacılar eşliğinde gerçekleşen bu seminerlerle katılımcılar hem doğayla hem kendileriyle ilgili farkındalık kazanıyorlar.',
      'Geleceği Yeşil Tasarla Projesi ile doğadan ilham alarak katılımcılarımıza sürdürülebilirlik ve çevre bilinci konularında eğitim verirken aynı zamanda topluma sorumlu bir kurum olarak hareket etmeyi kendimize misyon edindik.',
      'Projemizi kurumların sponsorluğunda kurum çalışanları ve çocuklarıyla online gerçekleştirebildiğimiz gibi yüz yüze de gerçekleştirebiliyoruz.',
      'Yanı sıra her ay kendi bünyemizde düzenlediğimiz ücretsiz doğadan hobi atölyeleri ile de toplumda farkındalık yaratmaya devam ediyoruz.',
    ],
    davet: [
      'Bizimle aynı amaçları önemseyen, destekleyen ve bu alanda bir fark yaratmak isteyen herkesi projemize dahil olmaya davet ediyoruz, çünkü bu dünya hepimizin.',
      'Siz de projemize katılarak geleceğe yeşil bir dokunuş yapmaya davetlisiniz.',
    ],
    mevsim: [
      'Bu projede yer alan mevsimsel etkinlikler sayesinde katılımcılar; doğayı fark ediyor ve sürdürülebilir kaynak yönetimi konusunda bilinçleniyor.',
      'Sonbahar, kış, ilkbahar ve yaz mevsimlerine özgü doğa etkinlikleriyle katılımcılara doğaya saygılı bilinçli tüketici olma ve sıfır atık prensibini benimseme fırsatı sunulmaktadır. Ayrıca projenin uzun vadeli hedefi, yeni ve genç neslin doğaya daha saygılı ve sürdürülebilir tüketiciler olmalarını sağlayarak ülkedeki karbon ayak izinin azaltılmasına katkıda bulunmaktır.',
    ],
    katki: {
      baslik: 'Projenin Topluma Katkısı',
      giris: 'ISO 14000 serisi* standartlarınca çevresel performansın artırılabilmesi için insan faaliyetlerinin doğa üzerindeki etkilerini belirlemek gerekmektedir. Bu kapsamda geliştirilen ekolojik ayak izi, çevreye bırakılan etkileri gösterir. Ekolojik ayak izinin azaltılması çevresel etkinin azaltılması ve devamlılığın sağlanması için önemli bir adımdır.',
      liste: 'Çevresel sürdürülebilirliğin önemi; günümüze ve geleceğe olan katkılarından gelmekte birlikte, herkes için daha temiz ve sağlıklı bir geleceğin faydaları:',
      maddeler: [
        'Biyoçeşitliliğin korunması',
        'Kirliliğin azaltılması sonucu daha sağlıklı koşullar elde etme',
        'Küresel ısınma ile etkili mücadele edebilme',
        'Doğal düzenin korunması',
        'Kaynakların verimli şekilde kullanılması',
      ],
      kapanis: 'Gezegenimizin doğal kaynaklarının sürdürülebilir bir şekilde kullanılması herkes için değer yaratmaktadır.',
      dipnot: '* ISO 14000 serisi standartları, çevre yönetimi alanında ilgili performansın takip edilerek iyileştirilmesi için gerekli olan standartları kapsamaktadır. Bu standartlar serisi, kurumlara pratik anlamda yol göstermektedir.',
    },
    bilim: {
      baslik: 'Çevresel Sürdürülebilirlikle Geleceği Yeşil Tasarla',
      paras: [
        'Bilimsel araştırmalar; çevresel sürdürülebilirliğin sağlanmasının, doğal kaynakların korunması ve iklim değişikliği gibi küresel sorunların önlenmesi açısından hayati öneme sahip olduğunu göstermektedir.',
        'Çevresel sürdürülebilirlik, gelecek nesillerin de sağlıklı bir çevrede yaşama hakkını korumayı ve mevcut kaynakları israf etmeden kullanmayı amaçlar. Kapsamında; temiz enerji kullanımı, su kaynaklarının korunması, biyoçeşitliliğin desteklenmesi gibi konular yer alır.',
      ],
      veriBaslik: 'Bilimsel araştırmalardan bazı örnekler verecek olursak',
      veriler: [
        'Yaklaşık 1,1 milyar kişi (dünya nüfusunun %18’i) temiz su kaynaklarına ulaşmada sorun yaşamaktadır. 2,4 milyar kişi yeterli sağlıklı suya sahip değildir. Su talebi her geçen gün artmakta ve ulaşılabilir tatlı su kaynakları ise kirlenme sebebiyle gün geçtikçe azalmaktadır. Kısıtlı su kaynaklarının kirlenmesi ve suya olan ihtiyacın artması neticesinde sürdürülebilirlik ve doğal kaynakların kontrollü kullanımı, özellikle son yirmi yılda, tüm dünyada önem kazanmış ve alternatif su kaynakları üstündeki çalışmalar artmıştır.',
        'Türkiye de su zengini bir ülke değildir. Kişi başına düşen yıllık su miktarına göre ülkemiz su azlığı yaşayan bir ülke konumundadır. DSİ’nin su potansiyeli hesaplarına göre Türkiye kişi başına yıllık 1.652 m³ su potansiyeline sahiptir. Öngörülere göre Türkiye nüfusu 2030 yılında 100 milyona ulaşacak ve su potansiyeli kişi başına yıllık 1.120 m³’e düşecektir. Türkiye su sıkıntısı yaşayan ülkeler arasında yer alacak ve kaynakların çok daha etkin kullanmayı amaçlayan politikalar izlemek durumda olacaktır.',
      ],
    },
    strateji: {
      baslik: 'Türkiye Mekansal Strateji Planı’nın 2053 yılını hedefleyen vizyonu',
      giris: '“Kapsayıcı, yaşanabilir, yenilikçi, rekabetçi, iklim değişikliğine ve afetlere duyarlı, dayanıklı ve sürdürülebilir mekânlar” olarak belirlenmiştir. Bu vizyonunun gerçekleştirilebilmesine yönelik 6 eksen altında öncelikler ortaya koyulmuştur. Bu eksenler;',
      eksenler: [
        'Yaşanabilir yerleşmeler, erişilebilirlik ve hareketlilik',
        'Doğal yapı, doğal afetler ve ekosistem servislerinde sürdürülebilirlik',
        'İklim değişikliği ile mücadele',
        'Rekabetçilik ve çekicilik',
        'Yenilikçilik ve teknoloji',
        'Nüfus dinamikleri ve beşeri gelişme',
      ],
      oncelikler: [
        { baslik: '“Doğal Yapı, Doğal Afetler ve Ekosistem Servislerinde Sürdürülebilirlik” ekseni öncelikleri',
          metin: 'Doğal kaynakların etkin kullanımı; Havzaların (tarım, su) korunması ve etkin yönetimi; Doğal afet risklerinin ortaya konulması ve yerleşmelerin dayanıklılığı; Yenilenebilir enerji kaynaklarının verimli, etkin ve yaygın kullanımı; Atıkların geri dönüşümü ve bertarafıdır.' },
        { baslik: '“İklim Değişikliği ile Mücadele” ekseni öncelikleri',
          metin: 'Sera gazı salımı; Sektörel kararlarda iklim değişikliğine uyum; Arazi kullanım kararlarında iklim değişikliğine uyumdur.' },
      ],
      kapanis: 'Tüm bu başlıklar altında mevcut durumda ve gelecekte çevre politikaları ile ekonomik ve sosyal politikaların birbirlerine etkisi ve entegrasyonu analiz edilmekte ve gözetilmektedir.',
    },
    kaynaklar: [
      'Türkiye Çevre Durum Raporu, ÇED İzin ve Denetim Genel Müdürlüğü, Ankara 2020',
      'Avrupa Çevre Ajansı ve Türkiye’de Yapılan Çalışmalar Raporu, 2022',
      'Çevresel Göstergeler Çevresel Etki Değerlendirmesi, İzin Ve Denetim Genel Müdürlüğü, Ankara 2022',
    ],
  },
];

/* Sürdürülebilirlik sayfasının açılış cümlesi — afloday.com'da iki projede de aynı */
export const surdurulebilirlikGiris =
  'AFLODAY olarak biz: inançla atılan her adımın bir fayda, bir katkı ve değer yaratma, bir hayali yaşatma olduğuna inanıyoruz. Paylaştıkça da var olacağımızı düşünüyoruz.';

/* Formlar — afloday.com'daki alanların birebir karşılığı. Fazlası eklenmedi. */
export const formlar = {
  iletisim: { baslik: 'İletişim', alanlar: ['ad', 'telefon', 'eposta', 'mesaj'] },
  katilim: { baslik: 'Atölye Katılımı', alanlar: ['ad', 'eposta', 'telefon', 'atolye', 'mesaj'] },
  ik: { baslik: 'İnsan Kaynakları Formu', alanlar: ['ad', 'soyad', 'eposta', 'telefon', 'cv', 'mesaj'] },
  cvNot: 'Göndereceğiniz doküman en fazla 4 MB. büyüklükte olmalı. Desteklenen formatlar: doc, docx, pdf, jpg, jpeg, png',
};

export const about = {
  /* afloday.com/hakkimizda — birebir. Vurgular bizim, metin onların. */
  paras: [
    "Kurum organizasyonel gelişimi, çalışan gelişimi kapsamında alternatif gelişim ve pekiştirmenin gerekli olduğu durumlarda bitkilerin, çiçeklerin başrolde; katılımcının yönetmen olduğu gelişim atölyeleri düzenliyoruz.",
    "Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında konu dahilinde konsept geliştirerek koçluk yaklaşımıyla doğa temalı olarak gerçekleştirdiğimiz atölyelere <strong>\u201cDoğadan Gelişim Atölyeleri\u201d</strong>, doğa temasını koruduğumuz, yaratıcılığa ve keyifli vakit geçirtmeye odaklandığımız atölyelere <strong>\u201cDoğadan Hobi Atölyeleri\u201d</strong> diyoruz.",
    "Doğa temasını koruyarak; bitkilerle, çiçeklerle tasarladığımız tasarım ürünlerini <strong>\u201cAfloday Doğadan Tasarım Mağazası\u201d</strong> ile doğa aşıklarıyla buluşturuyoruz. Tasarım ürünlerimizi online mağazalarımızdan ve Etiler\u2019deki tasarım atölyemizde bulabilir, sipariş verebilirsiniz.",
  ],
};

/* ======================================================================
   4 AĞUSTOS 2026 İÇERİK BELGESİ
   Kaynak: Afloday_WEB Sayfası Metinler_04082026.docx
   Metinler belgeden birebir alınmıştır. Kısaltma, yeniden yazma, ekleme yok.
   Görsel adları belgede geçen dosya adlarıdır.
   ====================================================================== */

/* Hero — 3 dönen slayt. Müşteri isteği: metin görselin üzerinde yazacak.
   Orman videosu açılışta kalıyor, slaytlar videodan sonra geliyor.

   `odak`: görsel tam ekranı kaplarken kırpılıyor; bu nokta kırpmanın neyi
   koruyacağını söylüyor. CSS'teki object-position ile aynı okuma — soldan ve
   ÜSTTEN yüzde. Merkez kırpma birinci slaytta kadının yüzünü kesiyordu. */
export const heroSlaytlari = [
  {
    id: 'kurumsal-gelisim',
    etiket: 'DOĞADAN İLHAMLA KURUMSAL GELİŞİM',
    baslik: 'Geleceği Doğadan Tasarlıyoruz',
    altBaslik: 'Kurumlara, bireylere ve çocuklara; doğanın 3,8 milyar yıllık bilgeliğinden ilham alan, deneyimsel eğitim ve gelişim programları sunuyoruz.',
    /* Adresler iç dosya adlarıyla yazılıyor; build.mjs yazmadan hemen önce
       canliAdres tablosundan geçirip canlı adrese çeviriyor. */
    birincilButon: { yazi: 'Eğitim Programlarını İncele', href: 'doga-temelli-egitimler.html' },
    ikincilButon: { yazi: 'Eğitim içi Doğadan Deneyimsel Öğrenme Atölyeleri', href: 'kurumsal-hobi-atolyeleri.html' },
    gorsel: 'rest-after-work-office-beautiful-young-business-woman-black-suit-is-sitting-park-lawn-smiling-women-s-shoes-foreground.jpg',
    alt: 'Parkta, iş kıyafetiyle çimenlikte oturan, gülümseyen genç profesyonel kadın',
    /* Kadının başı görselin üst %15'inde; merkez kırpma onu kesiyordu. */
    odak: [50, 25],
  },
  {
    id: 'deneyimsel-ogrenme',
    etiket: 'DOĞADAN İLHAMLA DENEYİMSEL ÖĞRENME',
    baslik: 'Öğrenmek Deneyimle Kalıcı Olur',
    altBaslik: 'Doğadan malzemelerle, aktif ve deneyimsel atölyelerle; eğitim programlarımızı teoride bırakmıyor, somut bir deneyime dönüştürüyoruz.',
    birincilButon: null,
    ikincilButon: null,
    gorsel: 'Resim1.jpg',
    alt: 'Doğaya uzanan, elinde fidan tutan yakın plan el',
    /* El üst yarıda; kırpma alttaki boş çimenden yensin. */
    odak: [50, 38],
  },
  {
    id: 'kisisel-surdurulebilirlik',
    etiket: 'DOĞADAN İLHAMLA KİŞİSEL SÜRDÜRÜLEBİLİRLİK',
    baslik: 'İnsan Kendi Senfonisini Kendi Tamamlamalı',
    altBaslik: 'Kurum stratejileri paralelinde; kurum çalışanlarına Kadın, Çocuk, Çevre ve İş Dünyası penceresinden; doğadan ilhamla kendi davranış ve alışkanlıklarını dönüştürmelerine rehberlik ediyoruz.',
    birincilButon: { yazi: 'Geleceği Doğadan Tasarla Hareketi’ni Keşfet', href: 'proje-gelecegi-yesil-tasarla.html' },
    ikincilButon: null,
    gorsel: 'abstract-woman-hands-touching-music-notes-nature-background-music-concept.jpg',
    alt: 'Doğa arka planında, ellerden yükselen nota motifleri',
    /* Kare görsel; geniş ekranda yüksekliğin yarısı kırpılıyor.
       El ve notalar orta bantta, hafif yukarı kaydırmak ikisini de tutuyor. */
    odak: [50, 45],
  },
];

/* Değer önerisi şeridi — hero'nun hemen altı, 3 sütun */
export const degerOnerisi = {
  gorsel: 'earth-day-environment-concept-eco-concept.jpg',
  alt: 'Dünya günü ve çevre bilinci temalı görsel',
  sutunlar: [
    {
      baslik: 'Kurumsal Eğitim & Gelişim Programları',
      metin: 'Doğadan ilhamla tasarlanmış, yetkinlik odaklı eğitim modülleriyle ekiplerinizin duygusal dayanıklılığını, iletişimini, iş birliğini ve yaratıcılığını güçlendiriyoruz.',
    },
    {
      baslik: 'Doğadan Deneyimsel Öğrenme',
      metin: 'Aktif ve deneyimsel öğrenme prensipleriyle; doğadan malzemeler ve atölye pratikleriyle desteklenen, teoride kalmayan, kalıcı öğrenme deneyimleri sunuyoruz.',
    },
    {
      baslik: 'Kişisel Sürdürülebilirlik',
      metin: 'Kadın, Çocuk, Çevre ve İş Dünyası penceresinden; bireylerin doğadan ilhamla kendi davranış ve alışkanlıklarını dönüştürmesine rehberlik ediyoruz.',
    },
  ],
};

/* "Neden Doğa Temelli Gelişim?" — 4 istatistik kutusu.
   Belgedeki not: "Sade, büyük punto rakamlar + tek cümlelik açıklama; arka planda
   hafif doğa dokusu, fotoğraf yoğunluğu düşük tutulmalı ki veri okunabilir kalsın." */
export const istatistikler = {
  baslik: 'Neden Doğa Temelli Gelişim?',
  ustEtiket: 'Amaç',
  /* Belge satır 54 arka planda "hafif doğa dokusu (yaprak/toprak deseni)"
     istiyor; 55. satırda kendi eklediği görsel ise iş insanı elleri. Tarife
     uyan doku ayrıca üretildi. Eski dosya yerinde duruyor, geri dönülebilir. */
  gorsel: 'dogal-zemin-dokusu.jpg',
  alt: 'Bir araya gelmiş ellerle dayanışmayı simgeleyen ekip görseli',
  kutular: [
    { rakam: '%59', metin: 'Z kuşağı çalışanların, iş teklifini kabul etmeden önce markanın çevresel politikalarını araştırma oranı.', kaynak: 'Deloitte' },
    { rakam: '%88', metin: 'Güçlü amaç duygusuna sahip şirketlerde kendini motive/sadık hisseden çalışan oranı.', kaynak: '' },
    { rakam: '%76', metin: 'Kuruluşunun sürdürülebilirlik vizyonundan haberdar olan çalışan oranı.', kaynak: 'Gallup' },
    { rakam: '%58', metin: 'Etkili iş birliğine sahip ekiplerin verimlilik artışı.', kaynak: 'Korn Ferry, 2021-2023' },
  ],
};

/* Marka metodolojisi — değer önerisinin hemen altı */
export const metodoloji = {
  baslik: 'Eğitim Metodolojimiz: Kök Sal · Sorumluluk Al · Birlikte Yeşer',
  giris: 'Tüm eğitim tasarımımız, bir bitkinin hayatta kalma ve serpilme sürecinden ilham alan 3 aşamalı bir paterne dayanır — bu, sadece doğanın değil, bağlılığı yüksek, proaktif ve verimli çalışanların da temel başarı formülüdür.',
  gorsel: 'beautiful-landscape-with-tree.jpg',
  alt: 'Geniş bir ovada tek başına duran ağaç',
  asamalar: [
    {
      no: 1,
      ad: 'KÖK SALMAK',
      slogan: 'Derinleşmeden Yükselemezsin',
      metin: 'Gerçek büyüme yukarı değil, aşağı doğru başlar. “Ben” egosunun sınırlarından çıkıp “Biz” bilincine uyanmaktır — bireyin, ait olduğu kurum kültürünü ve değerlerini gerçekten sahiplenmesidir.',
    },
    {
      no: 2,
      ad: 'SORUMLULUK ALMAK',
      slogan: 'Akışını Bulan Nehir Ol',
      metin: 'Ekosistemin bir parçası olmak, rüzgârda savrulmak değildir. Bir nehrin denize ulaşma kararlılığıyla kendi yatağını bulması gibi; proaktif davranarak kendi potansiyeli ve etki alanı içinde inisiyatif kullanmaktır.',
    },
    {
      no: 3,
      ad: 'BİRLİKTE YEŞERMEK',
      slogan: 'Rekabet Değil, Simbiyoz',
      metin: 'Orman, ağaçların toplamından fazlasıdır — köklerin altında birbirini besleyen devasa bir zekadır. Kendini geliştirirken ekosistemi de besleyerek yukarı taşımaktır; en güçlü olan değil, en iyi bağ kuran hayatta kalır.',
    },
  ],
};

/* Beş eğitim programı ve deneyim vitrini ayrı dosyada — data.mjs şişmesin */
export { egitimler, deneyimVitrini } from './egitimler.mjs';

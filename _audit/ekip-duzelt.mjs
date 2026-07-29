/* _build/data.mjs içindeki `team` paragraflarını ve `about` metnini
   afloday.com'daki BİREBİR metinle değiştirir.
   Yapılan tek müdahale: bariz imla/noktalama düzeltmeleri (aşağıda işaretli). */
import { readFileSync, writeFileSync } from 'node:fs';

const P = new URL('../_build/data.mjs', import.meta.url);
let src = readFileSync(P, 'utf8');

const j = (s) => JSON.stringify(s);

/* Ünvanlar — orijinal sayfa içi başlıklardan birebir */
const roller = {
  'ceylan-kalyon': 'Atölye Eğitmeni - Koç - Tasarımcı',
  'tugce-hazinedar': 'Atölye Eğitmeni - Tasarımcı',
  'derya-akyazici-kalyon': 'Atölye Eğitmeni – Çocuk Atölyeleri Danışmanı',
  'elif-celikkol-duman': 'Atölye Eğitmeni – Tasarımcı',
  'alara-apaydin-saruhan': 'Atölye Eğitmeni',
  'zeynep-altunhan': 'Eğitmen',
  'muharrem-ozdemir': 'Kurumsal Eğitim Danışmanı',
};

/* Gövde paragrafları — afloday.com'dan birebir.
   Yalnız şu düzeltmeler yapıldı ve her biri yorumda belirtildi. */
const paragraflar = {
  'ceylan-kalyon': [
    'Kariyer yolculuğu; kurumsal iletişim, iç iletişim, marka iletişimi, medya ilişkileri, dergi editörlüğü, sosyal medya yönetimi ile iletişim çerçevesinde süregeldi.', // "yolculuğu ;" → "yolculuğu;"
    'Profesyonel kariyeri, Dünya Göz Hastaneler Grubu’nda medya iletişim departmanında başladı. Medya ilişkileri yönetimi ve iç iletişim alanlarında görev yaptı.',
    'Ardından yayıncılık sektöründe Dünya Gazetesi ile gazeteciliği, Kobilife dergisi ile editörlüğü deneyimleme fırsatı buldu. İletişim ajanslarıyla; ulusal markaların iletişim departmanlarına hizmet ederken uluslararası bir firmada görev yapma fırsatı buldu.',
    'GSK’da (GlaxoSmithKline) İletişim departmanında İç İletişim’den sorumlu olarak göreve başladı. Ardından görevine ek olarak Kurumsal İletişim Departmanı’nda da görev alarak İç ve Kurumsal İletişim Yöneticisi olarak birçok yerel ve global projede aktif görev aldı. GSK’da kültür değişim projesi kapsamında çalışan kulüpleri kurulması, iç iletişim organizasyonlarının planlanması, kurumsal iletişim kapsamında iletişim stratejisinin oluşturulması, yürütülmesi, basın ilişkileri, sosyal sorumluluk projelerinin planlanması, hayata geçirilmesi, sosyal medya yönetimi görevlerinde bulundu.',
    'Kurumsal sosyal sorumluluk ve gönüllülük yolculuğu ise; üniversite yıllarında TOG gönüllüsü olarak adım attığı sivil toplum kuruluşlarına Make a Wish, Koruncuk Vakfı, TOÇEV, TEMA gibi vakıflarda gönüllü olarak çalıştı.', // "ise ; Üniversite" → "ise; üniversite"
    'Dünya Göz Grubu’nda Türkiye ile Göz Göz’e sosyal sorumluluk projesinde aktif rol alarak; kurumsal iletişim faaliyetleri yürüttü.',
    'GSK’da Sosyal Sorumluluk Kulübü’nü kurdu ve iki dönem kulüp başkanlığını yaptı. Hayata geçirilen Kök Hücre Kardeşliği, Turuncu Pedal Hareketi, Bağlanamam Sağlıklı Gençlik Hareketi projeleri birçok ödül kazandı. GSK’nın 10 yılı aşkın süredir devam eden Global Sosyal Sorumluluk Projesi PULSE kapsamında Hatay’da yerleşik olarak çocuk koruma alanında faaliyet gösteren Save The Children bünyesinde gönüllü olarak aktif görev alarak çocuk koruma alanında ülkesine katkı sağladı.',
    'Ardından eğitim sektöründe faaliyet gösteren MB Akademi’de Pazarlama İletişimi Direktörü ve profesyonel koç olarak görev yaptı.',
    'Kariyer yolculuğuna aldığı koçluk eğitimi sonrası farklı bir yön veren Ceylan; sosyal sorumluluk proje danışmanlığı, çalışan markası yaratma, kurum içi kültür değişim yönetimi, sosyal medya yönetimi alanlarında danışmanlık ve koçluk yapmaya başladı. Bu alanda görev yaparken botaniğe, çiçeklere ve doğaya olan ilgisini işe dönüştürebilmek üzere; Temel Çiçekçilik Eğitimi, Profesyonel Çiçek Tasarım Eğitimi ve materyal tasarım eğitimleri alarak Afloday’i kurdu.',
    'İletişim becerilerine güvenen bir iletişim profesyoneli, koçluk mesleğinin inceliklerine hakim bir koç, çiçeklere, doğaya, yeşile hayran bir kadın olarak; doğayı iletişim disiplini, sosyal sorumluluk ile birleştirdi.',
    'Marmara Üniversitesi İletişim Fakültesi ve Galatasaray Üniversitesi Pazarlama İletişimi yüksek lisans mezunu, ICF Koçluk Federasyonu onaylı koç olan Ceylan Kalyon; şimdi insanların hayatlarını yeniden tasarlamalarına ilham verecek; doğayla tasarımın birleştiği atölyelerde aktif öğrenme desteği modeli ile kurumlara ve kişilere katkı sağlıyor.',
  ],
  'tugce-hazinedar': [
    'Çocukluğundan beri, botanik bilimleri, doğa ve çiçeklerle yakından ilgili olan Tuğçe; bulduğu her fırsatta doğaya, çiçeklere yakınlaşma çabası içinde oldu.',
    'Kariyerini INDITEX bünyesinde insan kaynakları alanında 10 yılı aşkın sürede çeşitli pozisyonlarda görev yaparak şekillendirdi.',
    'Kurum bünyesinde çeşitli eğitimler vererek hem kurumuna hem çalışanlara katkı sağladı.',
    'Çiçeklere, doğaya hayatında her zaman bir kapı aralayan Tuğçe, yıllardır hayalini kurduğu hobisini işe dönüştürme hedefini Tila Flora’yı kurarak gerçekleştirdi. Bu alanda da uzmanlaşmak üzere profesyonel çiçek tasarımı ile ilgili eğitim aldı. Tila Flora’da butik çiçek düzenlemeleri, düğün çiçekleri ve kurumsal çiçek hediyeleri hazırlamaktan büyük mutluluk duyuyor.',
    'İlk ve lise öğrenimini Özel Şişli Terakki Okulları’nda ve lisans eğitimini İngiliz Dili ve Edebiyatı bölümünde İstanbul Özel Kültür Üniversitesi’nde tamamladı.', // "Ingiliz" → "İngiliz"
    'Tuğçe evli ve bir kız çocuğu annesidir.',
  ],
  'derya-akyazici-kalyon': [
    'Erken yaşta çocukluk dönemi uzmanlığına sahip olan danışmanımız okul öncesi eğitmeni olarak uzun yıllar görev yaparak bir çok çocuğun zihnen ve fiziken sağlıkla gelişmesi için öncülük etmiştir.',
    'Okul öncesi öğretmeni olarak bir çok eğitim kurumunda uzun yıllar görev yapan danışmanımız; meslek aşkını çocuk sevgisine bağlar. Okul öncesi eğitiminin yanında aynı zamanda Helen Doron Eğitim Sistemi’nin Eğitmen Eğitimi’ni de tamamlayarak, Helen Doron Okulları’nda eğitmenlik yapmıştır.',
    'Derya evli ve bir çocuk annesidir.',
  ],
  'elif-celikkol-duman': [
    '1989 yılının ılık bir ilkbahar öğleden sonrasında İstanbul’da güzel bir bahçede dünyaya gelmiştir.',
    'Yıldız Teknik Üniversitesi Kimya bölümünü tamamlayıp kariyerine kurumsal bir firmada başlamış 2 yıl süreyle görev yapmıştır.',
    'El sanatlarına olan ilgisi yaratıcı kişiliğiyle birleşince farklı arayışlara girmiş bir Grafik ve Web Tasarım Eğitim Programı’nı tamamlayarak el becerilerini kullanabileceği farklı bir kariyer arayışına girmiştir.',
    'Yolu bir çiçek atölyesi ile kesişmiş, aldığı çiçek tasarım eğitimleri sonrasında; bireysel hobi edinme workshoplarında ve kurumlarda çiçek, bitki tasarım atölyelerinde atölye eğitmenliği yapmıştır.',
    'Teraryum Atölyesi, Kapı Süsü Tasarımı Atölyesi, Kokedama Atölyesi, Çiçek Küpe Atölyesi, Tablo Atölyesi gibi birçok atölyede tasarımla yaratıcılığın başrolde olduğu saatlere keyifle liderlik etmiştir.',
    '2019 yılında kendi hayalinin peşinden koşma cesaretini göstererek kendi markası; Filart Design’ı kurmuştur.',
    'Çiçekli ve rengarenk camekanlar ardından bakmaya çalıştığı dünyasında, kişiye özel tamamı doğal ve el yapımı hediyelikler tasarlayıp üretmeye, insanların hayatlarını çiçekli tasarımlarıyla güzelleştirmeye devam etmektedir.',
  ],
  'alara-apaydin-saruhan': [
    'Kariyer yolculuğuna uluslararası kurumların iletişim departmanlarında başlayan Alara, 10 yılı aşkın süre uluslararası firmalarda birçok farklı sektörde İç İletişim, Marka İletişimi, Kurumsal İletişim, Çalışan Markası Yaratma, Sosyal Medya Yönetimi alanlarında görev yaparak deneyim kazanmıştır.',
    'Turizm otelcilik sektöründe Grand Hyatt İstanbul’da, ilaç sektöründe GSK’da (GlaxoSmithKline) ardından Philip Morris ve kozmetik sektöründe AVON’da birçok iç iletişim ve medya kampanyası yürütmüş, aktif rol aldığı projelerin çoğu ulusal ve uluslararası alanda birçok ödül kazanmıştır.', // fazladan virgül kaldırıldı
    'Her dem bitkilerden ilham alan, çiçeklerle arasını hep yakın tutan Alara aldığı bitki hobi eğitimlerini işe dönüştürme fırsatı yaratarak kurumsal etkinliklerde keyifle atölye eğitmenliği yapmaktadır.',
    'Lisans eğitimini İstanbul Bilgi Üniversitesi Uluslararası İlişkiler ve Ekonomi bölümlerinde, yüksek lisansını Hollanda Twente Üniversitesi’nde Kamu Yönetimi alanında yapmıştır.', // "ilişkiler" → "İlişkiler"
    'İyi derecede İngilizce bilen Alara, evli ve iki çocuk annesidir.',
  ],
  'zeynep-altunhan': [
    'Kariyer yolculuğunda ağırlıklı olarak perakende sektöründe insan kaynakları yöneticisi olarak görev alan Zeynep; şirket birleşmeleri ve satın almalar, şirketlerin büyümesi ve küçülmesi süreçlerinde aktif görev alma, bölge müdürlükleri açma, start-up girişimlere destek verme gibi pek çok farklı süreçte önemli deneyimler edindi.',
    'İnsan kaynakları politikaları ve stratejileri oluşturma, işe alım, eğitim ve gelişim, yetenek yönetimi, değişim yönetimi projeleri, performans sistemi, iç iletişim, çalışan bağlılığı projeleri, DIE, ücretlendirme ve yan haklar sistem yönetimi gibi birçok insan kaynakları fonksiyonunda deneyim kazandı.',
    'Zeynep kariyer yolculuğuna eğitim danışmanlık alanında devam ederken hemen her sektörde yer alan şirket için eğitim programları düzenledi. Ağırlıklı olarak etkili iletişim, ekip çalışması, yöneticilik teknikleri, liderlik yeteneklerini geliştirme ve kadın liderliği konularına yoğunlaştı.',
    'Eğitim programlarının yanı sıra PCC seviyesinde profesyonel koç olarak üst düzey yönetici koçluğu ve yöneticiliğe yeni adım atan çalışanlar için mentorluk desteği sağlıyor.',
    'Analiz yeteneği, sistem tasarlama ve uygulama becerisi zengin olan Zeynep, Gestalt psikoloji ekolünde bilgi ve deneyimini derinleştirmek için çalışıyor, nöroscience alanındaki son araştırmaları takip ediyor, Batı ve Doğu felsefesi konusunda okumalar yapmayı sürdürüyor.',
  ],
  'muharrem-ozdemir': [
    'Kariyerine Doğuş Grubu’nda Satış Yöneticisi olarak başladı. Sonrasında Nestle Türkiye ve Marsa Kraft’da FMCG sektöründe satış ve yöneticilik pozisyonlarında görev aldı. Bu süre içerisinde Türkiye’nin birçok ilinin ticari yapısını gözlemleme şansını elde etti. Bu süre zarfında hem geleneksel hem de modern satış kanallarında görev aldı.', // "Türkiye, ve" → "Türkiye ve"
    '2005 yılında Turkcell ile GSM sektörüne geçiş yaptı. Turkcell’de Kurumsal Hizmetlerde sırasıyla Bölge Yöneticisi, Bölge Müdürü ve Grup Satış Müdürü olarak kurumsal saha satış departmanında görev aldı. Hem iş ortağı hem de iş ortağı personeli yönetimi ile sektöre yeni bir anlayış kazandıran ticari tasarımların uygulanmasında görev aldı. Turkcell Kurumsal Hizmetler’de Satış Operasyon Grup Müdürü olarak Satış Operasyon, Raporlama ve Eğitim Takımını yönetti.', // "Müdürü Olarak," → "Müdürü olarak"
    '2011 yılından itibaren profesyonel eğitmenlik ve danışmanlık yapmaktadır. Aile şirketlerinin kurumsallaşma, satış süreçleri ve prim sistemi tasarımları, değişim yönetimi, performans yönetimi gibi alanların yanında üst düzey yönetim danışmanlığı konularında kurum veya yöneticilere danışmanlıklar yapmaktadır.',
    'Kurum ihtiyacına göre çalışan yetkinlik gelişimi kapsamında; eğitim süreç tasarımı, kültür-değişim proje yönetimi, prim ve performans yönetim modeli geliştirme, satış süreci iyileştirme, kurum süreç mükemmelleştirme gibi birçok farklı fonksiyonda iş geliştirme üzerine danışmanlık vermektedir.', // "kültür -değişim" → "kültür-değişim"
    '1971 yılında Ankara’da doğan Muharrem; lisans eğitimini Atatürk Üniversitesi İktisadi ve İdari Bilimler Fakültesi İşletme Bölümü’nde tamamlamıştır. Model arabalara ilgi duymakta ve profesyonel fotoğrafçılık ile uğraşmaktadır.',
  ],
};

/* LinkedIn — orijinalde yalnız bu üç kişide ikon/bağlantı var */
const linkedin = {
  'ceylan-kalyon': true, 'elif-celikkol-duman': true, 'alara-apaydin-saruhan': true,
};

let degisen = 0;
for (const [slug, paras] of Object.entries(paragraflar)) {
  const i = src.indexOf(`slug: '${slug}'`);
  if (i < 0) throw new Error('bulunamadı: ' + slug);
  // role
  const rRe = /role: '[^']*'/g; rRe.lastIndex = i;
  const rm = rRe.exec(src);
  src = src.slice(0, rm.index) + `role: ${j(roller[slug])}` + src.slice(rm.index + rm[0].length);
  // paras
  const pStart = src.indexOf('paras: [', i);
  const pEnd = src.indexOf('\n    ],', pStart) + '\n    ],'.length;
  const yeni = 'paras: [\n' + paras.map(p => `      ${j(p)},`).join('\n') + '\n    ],'
    + (linkedin[slug] ? `\n    linkedin: true,` : '');
  src = src.slice(0, pStart) + yeni + src.slice(pEnd);
  degisen++;
}

/* about — 3. paragrafın düşen cümlesi geri kondu */
const aboutYeni = `export const about = {
  /* afloday.com/hakkimizda — birebir. Vurgular bizim, metin onların. */
  paras: [
    "Kurum organizasyonel gelişimi, çalışan gelişimi kapsamında alternatif gelişim ve pekiştirmenin gerekli olduğu durumlarda bitkilerin, çiçeklerin başrolde; katılımcının yönetmen olduğu gelişim atölyeleri düzenliyoruz.",
    "Kurum kültürü ve çalışan yetkinlik gelişimi kapsamında konu dahilinde konsept geliştirerek koçluk yaklaşımıyla doğa temalı olarak gerçekleştirdiğimiz atölyelere <strong>\\u201cDoğadan Gelişim Atölyeleri\\u201d</strong>, doğa temasını koruduğumuz, yaratıcılığa ve keyifli vakit geçirtmeye odaklandığımız atölyelere <strong>\\u201cDoğadan Hobi Atölyeleri\\u201d</strong> diyoruz.",
    "Doğa temasını koruyarak; bitkilerle, çiçeklerle tasarladığımız tasarım ürünlerini <strong>\\u201cAfloday Doğadan Tasarım Mağazası\\u201d</strong> ile doğa aşıklarıyla buluşturuyoruz. Tasarım ürünlerimizi online mağazalarımızdan ve Etiler\\u2019deki tasarım atölyemizde bulabilir, sipariş verebilirsiniz.",
  ],
};`;
const aStart = src.indexOf('export const about = {');
const aEnd = src.indexOf('\n};', aStart) + 3;
src = src.slice(0, aStart) + aboutYeni + src.slice(aEnd);

writeFileSync(P, src, 'utf8');
console.log(`${degisen} ekip kaydı + about güncellendi.`);

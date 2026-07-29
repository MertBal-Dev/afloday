/* Dört fark raporunun kalan maddelerini data.mjs'e uygular:
   – künye (legal) orijinaline döner
   – menü afloday.com'daki 7 üst maddeli, alt menülü yapıya geçer
   – "Doğadan Hobi Atölyeleri" kurumsal hattı geri gelir (9 vaka)
   – Doğa Temelli Eğitimler'in kırpılmış cümleleri tamamlanır
   – iki sürdürülebilirlik projesinin tam metni yerine konur
   – form alanları orijinaldeki alanlara indirilir */
import { readFileSync, writeFileSync } from 'node:fs';
const P = new URL('../_build/data.mjs', import.meta.url);
let s = readFileSync(P, 'utf8');

const kes = (bas, bit) => {
  const i = s.indexOf(bas);
  if (i < 0) throw new Error('yok: ' + bas);
  const j = s.indexOf(bit, i) + bit.length;
  return [i, j];
};
const degistir = (bas, bit, yeni) => { const [i, j] = kes(bas, bit); s = s.slice(0, i) + yeni + s.slice(j); };

/* 1 — künye: orijinal footer "© 2026 Afloday | Doğadan Gelişim Atölyesi" */
s = s.replace(`legal: 'Afloday — Eğitim Gelişim Danışmanlık',`, `legal: 'Afloday | Doğadan Gelişim Atölyesi',`);

/* 2 — menü: afloday.com'un yedi üst maddeli, üç seviyeli yapısı */
degistir('export const nav = [', '\n];', `export const nav = [
  { href: 'index.html', label: 'Anasayfa' },
  {
    href: 'hakkimizda.html', label: 'Hakkımızda', tag: 'Ekip',
    children: [
      { href: 'hakkimizda.html', label: 'Afloday Hakkında' },
      {
        href: 'hakkimizda.html#ekip', label: 'Ekibimiz',
        children: [
          { href: 'ekip-ceylan-kalyon.html', label: 'Ceylan Kalyon (Kurucu)' },
          { href: 'ekip-tugce-hazinedar.html', label: 'Tuğçe Hazinedar' },
          { href: 'ekip-derya-akyazici-kalyon.html', label: 'Derya Akyazıcı Kalyon' },
          { href: 'ekip-elif-celikkol-duman.html', label: 'Elif Çelikkol Duman' },
          { href: 'ekip-alara-apaydin-saruhan.html', label: 'Alara Apaydın Saruhan' },
          { href: 'ekip-zeynep-altunhan.html', label: 'Zeynep Altunhan' },
          { href: 'ekip-muharrem-ozdemir.html', label: 'Muharrem Özdemir' },
        ],
      },
    ],
  },
  {
    href: 'kurumsal.html', label: 'Kurumsal Hizmetler', tag: 'Kurumlara',
    children: [
      { href: 'kurumsal.html#gelisim', label: 'Doğadan Gelişim Atölyeleri' },
      { href: 'kurumsal-hobi-atolyeleri.html', label: 'Doğadan Hobi Atölyeleri' },
      { href: 'kurumsal.html#sosyal', label: 'Sosyal Sorumluluk & İş Danışmanlığı' },
    ],
  },
  {
    href: 'atolyeler.html', label: 'Doğadan Hobi Atölyeleri', tag: '16 atölye',
    children: [
      { href: 'atolyeler.html#cicek', label: 'Çiçek Tasarım Hobi Atölyeleri', cat: 'cicek' },
      { href: 'atolyeler.html#bitki', label: 'Bitki Tasarım Hobi Atölyeleri', cat: 'bitki' },
      { href: 'atolyeler.html#cocuk', label: 'Çocuk Hobi Atölyeleri', cat: 'cocuk' },
    ],
  },
  { href: 'doga-temelli-egitimler.html', label: 'Doğa Temelli Eğitimlerimiz', tag: 'Eğitim' },
  {
    href: 'surdurulebilirlik.html', label: 'Sürdürülebilirlik', tag: 'Projeler',
    children: [
      { href: 'proje-gelecegi-yesil-tasarla.html', label: 'Geleceği Yeşil Tasarla Projesi' },
      { href: 'proje-gulumseyen-yarinlar.html', label: 'Gülümseyen Yarınlar Projesi' },
    ],
  },
  {
    href: 'iletisim.html', label: 'İletişim', tag: 'Ulaşın',
    children: [
      { href: 'iletisim.html', label: 'İletişim' },
      { href: 'katilim.html', label: 'Atölye Katılımı' },
      { href: 'ik.html', label: 'İnsan Kaynakları' },
    ],
  },
];`);

/* 3 — Doğa Temelli Eğitimler: kırpılan üç cümle geri kondu (birebir) */
s = s.replace(
  `"Bu, varlığımızın temelidir. Tıpkı bir ağacın toprağa, bir canlının habitatına ait olması gibi, insanın da anlam bulması için bir \\"yere\\" ait hissetmesi gerekir. Bu, \\"ben\\" bilincinden \\"biz\\" bilincine, etrafımızdaki canlı ve cansız her şeyin birbirine bağlı olduğu gerçeğini idrak etmeye geçiştir. Gerçek dönüşüm, ancak ait olduğun zemini anladığında başlar."`,
  `"Bu, varlığımızın temelidir. Tıpkı bir ağacın toprağa, bir canlının habitatına ait olması gibi, insanın da anlam bulması için bir \\"yere\\" ait hissetmesi gerekir. Bu ilke, bizi çevreleyen her şeyle derin bir bağ kurmaya davet eder. Bu, \\"ben\\" bilincinden \\"biz\\" bilincine, etrafımızdaki canlı ve cansız her şeyin birbirine bağlı olduğu gerçeğini idrak etmeye geçiştir. Ayrı ve üstün değiliz; varlığımız, içinde bulunduğumuz ekosistemin sağlığıyla doğrudan ilişkilidir. Gerçek dönüşüm, ancak ait olduğun zemini anladığında başlar."`);
s = s.replace(
  `"Ekosistemin bir parçası olmak, pasif bir kabulleniş değildir; aksine, aktif bir sorumluluk gerektirir. Tıpkı bir nehrin kendi yatağını bularak denize doğru kararlılıkla akması gibi, her birey de kendi özünü tanımalı ve potansiyelini bu ekosistem içinde en doğru şekilde akıtmalıdır. Sorumluluk, sadece görevleri yerine getirmek değil, ekosistemdeki etkinin bilinciyle hareket etmektir."`,
  `"Ekosistemin bir parçası olmak, pasif bir kabulleniş değildir; aksine, aktif bir sorumluluk gerektirir. Tıpkı bir nehrin kendi yatağını bularak denize doğru kararlılıkla akması gibi, her birey de kendi özünü tanımalı ve potansiyelini bu ekosistem içinde en doğru şekilde akıtmalıdır. Bu, gezegen üzerindeki etkimizin farkında olmak, proaktif davranmak ve kendine yetebilme gücünü keşfetmektir. Sorumluluk, sadece görevleri yerine getirmek değil, ekosistemdeki etkinin bilinciyle hareket etmektir."`);
s = s.replace(
  `"Kök saldığımız bu ekosistemde yalnız değiliz. Bir orman, tekil ağaçların toplamı değil, kökler aracılığıyla birbiriyle konuşan, kaynakları paylaşan ve birbirini destekleyen devasa bir organizmadır. Bu ilke, rekabet yerine simbiyozu, hiyerarşi yerine ise güven ağlarını koyar. Sosyal bağlar ve iş birliği, ekosistemin refahını sağlayan ve bizi besleyen görünmez köklerdir."`,
  `"Kök saldığımız bu ekosistemde yalnız değiliz. Bir orman, tekil ağaçların toplamı değil, kökler aracılığıyla birbiriyle konuşan, kaynakları paylaşan ve birbirini destekleyen devasa bir organizmadır. Bu ilke, rekabet yerine simbiyozu, hiyerarşi yerine ise güven ağlarını koyar. Sosyal bağlar ve iş birliği, ekosistemin refahını sağlayan ve bizi besleyen görünmez köklerdir."`);

/* 4 — sürdürülebilirlik projeleri: afloday.com'daki tam metin */
degistir('export const projects = [', '\n];', `export const projects = [
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
    kapanis: 'Koruncuk Vakfı Gönüllü Atölyesi detayları için bize ulaşabilir, kampanyaya bağış yapmak için Koruncuk Vakfı ile iletişime geçebilirsiniz.',
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
};`);

writeFileSync(P, s, 'utf8');
console.log('data.mjs: künye, menü, eğitim metinleri, projeler ve formlar güncellendi.');

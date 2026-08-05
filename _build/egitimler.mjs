/* Beş eğitim programı — 4 Ağustos 2026 içerik belgesinden birebir.
   Anasayfada vitrin kartı, /doga-temelli-egitimlerimiz sayfasında tam metin
   olarak kullanılıyor; aynı uzun metni iki kez okutmuyoruz.

   ANASAYFA ile İÇ SAYFA AYRIMI — belge ikisini farklı yazıyor:
   · `vitrinAd`   anasayfa kartının başlığı (belge satır 57-81)
     `ad`         iç sayfanın başlığı (belge satır 183-267)
     Üçünde farklılar: iç sayfada "…Eğitimi" eki var, İletişim programında ise
     iki ad tamamen ayrı ("Öğreneceklerimiz" / "Dili Eğitimi").
   · `vitrinGorsel` / `gorsel` — iki programda farklı fotoğraf veriliyor.
   · `vitrinSure` / `sure` — belge anasayfada uzun tire ("1–2 Gün"), iç sayfanın
     "Program Bilgileri" bloğunda kısa tire ("1-2 Gün") kullanıyor. Beşinde de
     böyle, yani tutarlı bir bağlam ayrımı; ikisi de olduğu gibi korunuyor.

   Belgede iki programın iç sayfası aynı fotoğrafı gösteriyor (Takım Ruhu ve
   Değişimin Doğası → double-exposure-businessman…). Kopyala-yapıştır kaynaklı
   görünüyor ama belge böyle diyor, değiştirmedik. Afloday'e soruldu. */

/* Sayfa girişi — belge satır 180-181 */
export const egitimlerSayfasi = {
  baslik: 'Doğa Temelli Eğitimlerimiz',
  giris:
    'Doğa, 3,8 milyar yıldır kriz yönetiyor, iletişim kuruyor, iş birliği yapıyor, yeniliyor ve değişiyor. Biz bu eğitimlerde, doğanın test edip onayladığı stratejileri kurumunuza taşıyoruz. Her modül, çalışanlarınızın hem iş hayatında hem de bunun doğal bir uzantısı olan sosyal hayatında güçlenmesini istediğimiz belirli “kasları” hedefler — çünkü gerçek gelişim, mesai saatiyle sınırlı kalmaz.',
  /* Belgedeki bölüm başlıkları; her programda aynı iskelet tekrar ediyor. */
  bolumler: {
    acilis: 'Açılış Sahnesi',
    ders: 'Doğadan Öğrendiğimiz Ders',
    kaslar: 'Bu Eğitimle Güçlenen Kaslar',
    isHayati: 'İş Hayatına Yansıması',
    sosyalHayat: 'Dolaylı Sosyal Hayata Yansıması',
    bilgiler: 'Program Bilgileri',
  },
  alanlar: {
    format: 'Format',
    sure: 'Süre',
    hedefKitle: 'Hedef Kitle',
    yetkinlikler: 'Hedef Yetkinlikler',
  },
};

export const egitimler = [
  {
    id: 'duygusal-dayaniklilik',
    ad: 'Doğanın Gücüyle Duygusal Dayanıklılık ve Esneklik',
    vitrinAd: 'Doğanın Gücüyle Duygusal Dayanıklılık ve Esneklik',
    slogan: 'Bambu Gibi Esnemek, Kırılmadan Kalmak',
    vitrinBaslik: 'Kırılmadan esneyen, kriz anında güçlenen ekipler',
    vitrinMetin: 'Doğanın 3,8 milyar yıllık adaptasyon stratejileriyle çalışanlarınız, bir bambu gibi zorluklar karşısında kırılmadan esnemeyi ve kaos ortamında profesyonel dengesini korumayı öğrenir.',
    etiketler: ['Stres Yönetimi', 'Esneklik', 'Duygusal Dayanıklılık'],
    gorsel: 'close-up-executives-ready-start-running.jpg',
    alt: 'Koşmaya hazırlanan yöneticiler, yakın plan',
    acilisSahnesi: 'Pazartesi sabahı, üst üste üç kriz toplantısı, bir müşteri şikâyeti ve henüz cevaplanmamış kırk e-posta… Ayşe daha masasına oturmadan “bugün de mi böyle olacak?” diye düşünür. Oysa o sabah, ofis penceresinin dışındaki söğüt ağacı sert rüzgârda eğilir, savrulur — ama kırılmaz. Çünkü kökleri derin, gövdesi esnektir.',
    dogadanDers: 'Doğa milyarlarca yıldır kriz yönetiyor: kuraklık, don, fırtına… Hayatta kalan tür en güçlü olan değil, en esnek olandır. Bambu en sert fırtınada bile yere yatar ama kırılmaz; çünkü direnmez, akışa katılır. Bu eğitim, çalışanlarınıza tam bu refleksi kazandırır: dirençli olmak katı durmak değil, doğru yerde esneyip doğru yerde köklenmektir.',
    kaslar: [
      ['Stres Kası', 'baskı altında karar netliğini koruma'],
      ['Toparlanma Kası', 'bir aksilikten sonra hızla “sıfırlanabilme”'],
      ['Sınır Kası', 'tükenmeden önce sağlıklı “hayır” diyebilme'],
      ['Olumlu Bakış Kası', 'zorluğu tehdit değil veri olarak görme'],
    ],
    isHayati: 'Ekipler kriz anında paniğe kapılmak yerine önceliklendirme yapabilir hale gelir; tükenmişlik belirtileri erken fark edilir ve yönetilir.',
    sosyalHayat: 'İş yerinde biriken gerginlik eve taşınmaz; kişi akşam yorgun ama “boşalmış” değil “dolu” hisseder — aile ve arkadaşlık ilişkilerine daha fazla enerji kalır.',
    format: 'Yüz Yüze / Online',
    sure: '1-2 Gün',
    vitrinSure: '1–2 Gün',
    hedefKitle: 'Tüm çalışanlar, özellikle yoğun tempoda çalışan ekipler',
    yetkinlikler: 'Stres Yönetimi · Esneklik · Duygusal Dayanıklılık · Olumlu Düşünme',
  },
  {
    id: 'iletisim-dili',
    ad: 'Doğanın İletişim Dili Eğitimi',
    vitrinAd: 'Doğanın İletişim Yeteneğinden Öğreneceklerimiz',
    slogan: 'Kökler Gibi Sessizce Beslemek',
    vitrinBaslik: 'Görülmeyeni duyan, güvene dayalı bir iletişim kültürü',
    vitrinMetin: 'Doğadaki mikoriza ağı prensibinden ilhamla katılımcılar, yalnızca söyleneni değil söylenmeyeni de duymayı öğrenir; geri bildirim bir eleştiri değil, gelişimi besleyen bir veriye dönüşür.',
    etiketler: ['İletişim', 'Empati', 'Çatışma Yönetimi'],
    gorsel: 'handshake-environmentalists-generative-ai.jpg',
    alt: 'Doğa temalı bir zeminde el sıkışan iki kişi',
    acilisSahnesi: 'Toplantıda Mehmet bir fikir söyler ama kimse gerçekten dinlemez; herkes kendi cevabını hazırlamakla meşguldür. Toplantı biter, hiçbir şey netleşmemiştir ama herkes “konuştuk” sanır. Oysa ormanda bir ağaç tehlikeyi fark ettiğinde, bu bilgi kök ağı üzerinden komşu ağaçlara saniyeler içinde ulaşır — net, kayıpsız, çarpıtılmadan.',
    dogadanDers: 'Mikoriza ağı ormanın “interneti”dir: ağaçlar birbirine yalnızca besin değil bilgi de gönderir. Bu iletişim net, zamanında ve karşılıklı güvene dayalıdır. Bu eğitim, katılımcılara “gürültüyü” değil “sinyali” iletmeyi öğretir: doğru zamanda, doğru zeminde, doğru mesajı vermek.',
    kaslar: [
      ['Dinleme Kası', 'söylenmeyeni (ton, beden dili, duygu) fark etme'],
      ['Netlik Kası', 'mesajı niyet edildiği gibi iletebilme'],
      ['Geri Bildirim Kası', 'eleştiriyi saldırı değil besleyici veri olarak sunma/alma'],
      ['Empati Kası', 'karşı tarafın bakış açısını gerçekten anlama'],
    ],
    isHayati: 'Yanlış anlaşılmalar azalır, toplantılar daha kısa sürede daha net kararlarla biter; geri bildirim kültürü savunmacılık değil gelişim yaratır.',
    sosyalHayat: 'İş yerinde geliştirilen “gerçekten dinleme” becerisi, kişinin evdeki ve arkadaşlık ilişkilerindeki tartışmaları da yumuşatır — duyulduğunu hissetmek her ilişkide fark yaratır.',
    format: 'Yüz Yüze / Online',
    sure: '1-2 Gün',
    vitrinSure: '1–2 Gün',
    hedefKitle: 'Tüm çalışanlar, yöneticiler, müşteriyle birebir çalışan ekipler',
    yetkinlikler: 'İletişim · Dinleme · Empati · Çatışma Yönetimi · Güvenli Davranış',
  },
  {
    id: 'takim-ruhu',
    ad: 'Doğanın Takım Ruhuyla İş Ekosistemi Eğitimi',
    vitrinAd: 'Doğanın Takım Ruhuyla İş Ekosistemi',
    slogan: 'Orman Tek Bir Ağaçtan İbaret Değildir',
    vitrinBaslik: 'Kopuk parçalar değil, tek organizma gibi çalışan takımlar',
    vitrinMetin: '“Wood Wide Web” prensibiyle takımlarınızı birbirine kenetlenmiş kolektif bir zekaya dönüştürür; “benim işim bitti” kültüründen “biz başardık” kültürüne geçişi sağlar.',
    etiketler: ['İş Birliği', 'Takım Ruhu', 'Sonuç Odaklılık'],
    vitrinGorsel: 'business-people-assembling-puzzle.jpg',
    vitrinAlt: 'Birlikte yapboz parçalarını birleştiren iş insanları',
    gorsel: 'double-exposure-businessman-suit-with-nature-digital-icons-symbolizing-innovation-environmental-consciousness.jpg',
    alt: 'Doğa ve dijital simgelerin iç içe geçtiği çift pozlama görsel',
    acilisSahnesi: 'Proje gecikir. Herkes kendi görevini tamamladığını söyler ama “bütün” ortaya çıkmamıştır; “benim işim bitti” cümlesi odada dolaşır durur. Ormanda ise hiçbir ağaç “benim işim bitti” demez — kökler suyu taşır, mantarlar besini dağıtır, yapraklar güneşi işler; hiçbiri diğerinden daha az önemli değildir.',
    dogadanDers: 'Orman, ağaçların toplamından fazlasıdır: köklerin altında birbirini besleyen devasa bir zekâdır (“Wood Wide Web”). En güçlü olan değil, en iyi bağ kuran hayatta kalır. Bu eğitim, ekiplere rekabeti değil tamamlayıcılığı öğretir.',
    kaslar: [
      ['Güven Kası', 'hatanın cezalandırılmadığı, fikrin özgürce paylaşıldığı bir zemin kurma'],
      ['Rol Netliği Kası', 'kendi uzmanlığında derinleşip bütüne katkı sağlama'],
      ['Ortak Hedef Kası', 'dağınık enerjiyi aynı “ışığa” hizalama'],
      ['Dayanışma Kası', '“benim eksiğim, senin fazlan” ile birbirini yukarı taşıma'],
    ],
    isHayati: 'Projeler silo hâlinde değil bütünsel ilerler; ekip içi güven arttıkça karar alma hızı ve kalitesi yükselir.',
    sosyalHayat: '“Birlikte başarma” alışkanlığı kazanan kişi, ailesinde ve arkadaş gruplarında da sorumluluğu paylaşmaya, her şeyi tek başına taşımamaya daha yatkın hâle gelir.',
    format: 'Yüz Yüze / Online',
    sure: '1-2 Gün',
    vitrinSure: '1–2 Gün',
    hedefKitle: 'Takımlar, proje ekipleri, departman içi/departmanlar arası gruplar',
    yetkinlikler: 'İş Birliği · Takım Oyunu Oynama · Güvenli Davranış · Sonuç Odaklılık',
  },
  {
    id: 'yaratici-dusunme',
    ad: 'Doğanın İlhamıyla Yaratıcı Düşünme Eğitimi',
    vitrinAd: 'Doğanın İlhamıyla Yaratıcı Düşünme',
    slogan: 'Doğa İsraf Etmez, Sadece Dönüştürür',
    vitrinBaslik: 'İsraf etmeyen, hatadan beslenen bir inovasyon kültürü',
    vitrinMetin: 'Biyomimikri prensipleriyle mental blokları aşan katılımcılar, “doğa israf etmez” yasasından ilhamla kısıtlı kaynaklarla sınırları zorlayan, yalın ve yaratıcı çözümler üretmeyi öğrenir.',
    etiketler: ['Yaratıcı Düşünme', 'Değişim Yönetimi', 'Problem Çözme'],
    vitrinGorsel: 'WhatsApp Image 2026-07-22 at 14.29.50 (2).jpeg',
    vitrinAlt: 'Afloday atölyesinde kuru çiçeklerle çalışan katılımcılar',
    gorsel: 'creativity-design-process-graphics-concept.jpg',
    alt: 'Yaratıcı tasarım sürecini anlatan çalışma masası',
    acilisSahnesi: 'Bir proje başarısız olur. Toplantıda kimse konuşmak istemez, çünkü “başarısızlık” kelimesi odada bir suçluluk havası yaratır. Oysa doğada “hata” diye bir şey yoktur — düşen bir yaprak toprağa geri döner ve bir sonraki filizin besinine dönüşür.',
    dogadanDers: 'Biyomimikri, doğanın milyonlarca yıllık Ar-Ge’sinden ilham alır: doğa asla israf etmez, her “atık” bir sonraki adımın yakıtıdır. Bu eğitim, katılımcılara başarısızlığı bir engel değil, bir sonraki doğru adımın gübresi olarak görmeyi öğretir.',
    kaslar: [
      ['Cesaret Kası', 'yeni ve alışılmadık fikirleri söyleyebilme'],
      ['Yeniden Çerçeveleme Kası', 'hatayı “veri”ye, atığı kaynağa dönüştürme'],
      ['Yalınlık Kası', 'kısıtlı kaynakla maksimum çözüm üretme'],
      ['Uyum Kası', 'değişen koşullara hızla yön değiştirme'],
    ],
    isHayati: 'Ekipler risk almaktan çekinmez; deneme-yanılma bir utanç kaynağı değil doğal bir süreç hâline gelir ve inovasyon hızlanır.',
    sosyalHayat: 'Kişi kendi hayatındaki “başarısızlıkları” da daha az yargılayıcı bir gözle görmeye başlar — bu, özgüveni ve genel yaşam doyumunu olumlu etkiler.',
    format: 'Yüz Yüze / Online',
    sure: '1-2 Gün',
    vitrinSure: '1–2 Gün',
    hedefKitle: 'İnovasyon/Ar-Ge ekipleri, tüm yaratıcı süreçlerde yer alan çalışanlar',
    yetkinlikler: 'Tasarım Odaklı Düşünme · Yaratıcılık · Değişim Yönetimi',
  },
  {
    id: 'degisimin-dogasi',
    ad: 'Değişimin Doğası ve Liderlik Ekosistemi Eğitimi',
    vitrinAd: 'Değişimin Doğası ve Liderlik Ekosistemi Eğitimi',
    slogan: 'Mevsimler Değişir, Kökler Kalır',
    vitrinBaslik: 'Mevsimler değişir, kökler kalır',
    vitrinMetin: 'Yeniden yapılanma, rol değişikliği veya belirsizlik dönemlerinde çalışanlarınız, değişimi tehdit değil doğal bir döngü olarak görmeyi ve bu döngüde kendi değer ve amaçlarını kaybetmeden dönüşmeyi öğrenir.',
    etiketler: ['Değişim Yönetimi', 'Denge', 'Dönüşüm Liderliği'],
    gorsel: 'double-exposure-businessman-suit-with-nature-digital-icons-symbolizing-innovation-environmental-consciousness.jpg',
    alt: 'Doğa ve dijital simgelerin iç içe geçtiği çift pozlama görsel',
    acilisSahnesi: 'Şirket yeniden yapılanıyor. Roller değişiyor, bazı ekipler birleşiyor, bazı süreçler tamamen kayboluyor. Cem iki yıldır aynı masada oturuyordu; şimdi hem yeni bir ekip yönetecek hem kendi rolünü yeniden tanımlayacak. “Neye tutunacağım?” sorusu aklından geçiyor. Oysa doğada sonbahar geldiğinde ağaç yapraklarını bırakır — ama kök kalır, gövde kalır; ağaç “kendi olmaktan” çıkmaz, yalnızca formunu değiştirir.',
    dogadanDers: 'Mevsimler doğaya sürekli değişmesini dayatır; ama hiçbir ağaç bu değişimle yok olmaz — kökleri sabit kalır, kimliğini korur, yalnızca dışa dönük formunu uyarlar. Yangın sonrası ormanlarda bile toprak yeniden filizlenir; değişim sonun değil, yeni bir döngünün başlangıcıdır. Bu eğitim, katılımcılara değişimi tehdit değil doğal bir döngü olarak görmeyi ve bu döngüde “kök”lerini — değerlerini, amaçlarını — kaybetmeden dönüşmeyi öğretir.',
    kaslar: [
      ['Denge Kası', 'belirsizlik içinde bile iç istikrarı koruma'],
      ['Bırakma Kası', 'artık işe yaramayan alışkanlığı/rolü bırakabilme'],
      ['Dönüşüm Liderliği Kası', 'değişimi başkalarına da güven verecek şekilde yönetme'],
      ['Kök Kası', 'değişirken bile kendi değer ve amacına bağlı kalma'],
    ],
    isHayati: 'Yeniden yapılanma, rol değişikliği veya belirsizlik dönemlerinde çalışanlar dirençten çıkıp süreci yönlendiren aktif özneler hâline gelir; yöneticiler ekiplerine değişim sürecinde güven veren bir duruş sergiler.',
    sosyalHayat: 'Değişimle kurulan bu sağlıklı ilişki, kişinin hayatındaki büyük dönüm noktalarında (taşınma, yeni şehir, ilişki değişiklikleri) da daha az kaygı, daha fazla uyum getirir.',
    format: 'Yüz Yüze / Online',
    sure: '1-2 Gün',
    vitrinSure: '1–2 Gün',
    hedefKitle: 'Değişim/dönüşüm sürecindeki kurumlar, yöneticiler, liderlik pozisyonundaki çalışanlar',
    yetkinlikler: 'Değişim Yönetimi · Denge · Esneklik · Dönüşüm Liderliği · Belirsizlikle Baş Etme',
  },
];

/* Anasayfa vitrini — "Doğadan Deneyimsel Öğrenme Atölyeleri" bölümü.
   Belgede öne çıkan deneyimlerden metni yazılmış olan ikisi burada. */
export const deneyimVitrini = {
  ustEtiket: 'EĞİTİMİN SOMUT HALİ',
  baslik: 'Doğadan Deneyimsel Öğrenme Atölyeleri',
  altBaslik: 'Eğitim programlarımız teoride kalmaz. Doğadan malzemelerle, aktif ve deneyimsel atölyelerle; kurumunuzun ve çalışanlarınızın öğrendiğini somut bir deneyime dönüştürüyoruz.',
  kartlar: [
    {
      ad: 'Bitki Dikim Saksı Değişimi Atölyesi',
      bicim: 'Yüz Yüze / Online · Deneyim',
      /* Belgede "ve" yok; eğitimin kendi adından farklı yazılmış, öyle bırakıldı. */
      bagliEgitim: 'Değişimin Doğası Liderlik Ekosistemi Eğitimi Uygulaması',
      metin: 'Değişim ve liderliği doğanın metaforlarıyla görünür kılan deneyimsel bir öğrenme uygulamasıdır. Katılımcılar; saksıyı değişim süreci, kökleri değerler ve konfor alanı, yeni toprağı kurum kültürü, su ve ışığı ise destek sistemleri ile motivasyon olarak ele alırken, seçtikleri doğal materyaller aracılığıyla kendi değişim yolculuklarını somutlaştırırlar.',
    },
    {
      ad: 'Doğadan Mottolu Çerçeve Tasarım Atölyesi',
      bicim: 'Yüz Yüze / Online · Deneyim',
      bagliEgitim: 'Doğanın İlhamıyla Yaratıcı Düşünme Eğitimi',
      metin: 'Katılımcıların kurutulmuş çiçeklerle ilham veren bir mesajı tasarlarken yaratıcı düşünme ve tasarım odaklı düşünme becerilerini deneyimlediği uygulamalı bir öğrenme deneyimidir. Süreç içerisinde beklenmedik tasarım değişiklikleriyle karşılaşarak esneklik, farklı bakış açıları geliştirme ve birlikte üretme becerilerini de keşfederler.',
    },
  ],
};

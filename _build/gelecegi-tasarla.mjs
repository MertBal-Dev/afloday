/* GELECEĞİ DOĞADAN TASARLA HAREKETİ — 4 Ağustos 2026 belgesi, satır 287-372.
   Canlı adres: /gelecegi-tasarla (iç dosya adı proje-gelecegi-yesil-tasarla).

   Belge bu sayfa için hem metin hem yerleşim talimatı veriyor. Talimat satırları
   (① Hero — Senfoni Girişi, ② Dört Elementin Tanıtımı, ③ Dört Pencere — Anchor
   Kartlar, ④ Her Pencere İçin Detaylı Bölüm, ⑤ Kapanış) sayfaya basılmıyor;
   sayfanın yapısı bunlara göre kuruldu.

   BELGEDEKİ DİZGİ HATALARI — düzeltilenler:
     1. "iklim değişikliği ,"                virgülden önce boşluk
     2. "doğadan hobi  atölyeleri"           çift boşluk
     3. "programlarımız  4, 8 veya"          çift boşluk
     4. "gerektiğine inanıyoruz Bu nedenle"  cümle sonu noktası yoktu
     5. "Ne Sunuyoruz" / "Ne Sunuyoruz?"     4. pencerede etiket iki kez yazılmış
     6. "Bu Pencerede Yer Alan Eğitimler Doğanın İletişim Dili Eğitimi"
        etiket ile ilk madde tek satırda birleşmiş, ayrıldı
   Kelime, cümle veya sıra değişikliği yok. */

export const gelecegiTasarla = {
  baslik: 'Geleceği Doğadan Tasarla Hareketi',

  /* ① Hero — Senfoni Girişi */
  hero: 'Dünyamız, adeta bir senfoni gibi... Farklı sesler, farklı melodiler, hepsi bir araya gelerek büyüleyici bir uyum yaratıyor. Bu senfonide her sesin önemi var, her melodinin yeri var. Peki, ya bu senfonide bazı sesler duyulmuyorsa, bazı melodiler çalınmıyorsa?',
  heroAlt: 'Geleceği Doğadan Tasarla Hareketi bireyleri doğaya yaklaştırarak kendi potansiyellerini gerçekleştirmelerini destekler.',

  /* ② Dört Elementin Tanıtımı */
  elementGiris: 'Bu senfoninin en önemli unsurlarının doğanın dört elementi ile yakından ilgili olduğunu biliyor muydunuz?',

  yaklasim: {
    baslik: 'Geleceği Doğadan Tasarla Hareketi Yaklaşımımız',
    paragraflar: [
      'Kalıcı davranış değişikliği, tek bir eğitim ya da atölyeyle gerçekleşmez. Bu nedenle Geleceği Doğadan Tasarla programlarımızı; seminerler, deneyimsel atölyeler ve kurum içi iletişim çalışmalarıyla birbirini tamamlayan gelişim yolculukları olarak tasarlıyoruz.',
      'Programlarımız, davranış değişikliği alanında yaygın olarak kullanılan bilimsel modellerden ilham alarak tasarlanır. Araştırmalar, kalıcı davranış değişikliğinin tek seferlik eğitimlerle değil; belirli aralıklarla gerçekleşen tekrar eden temaslar ve uygulamalarla desteklendiğinde daha başarılı olduğunu göstermektedir. Bilimsel davranış değişikliği modellerinden ilham alarak, hedeflenen kazanım için en az 4 temas öneriyoruz. Her temas, katılımcının öğrendiklerini günlük yaşamına taşımasını destekler; belirli aralıklarla gerçekleşen bu süreç, farkındalığın kalıcı alışkanlıklara dönüşmesine katkı sağlar.',
      'İhtiyaca göre programlarımız 4, 8 veya yıl boyu devam eden temaslarla kurumunuza özel olarak planlanabilir.',
    ],
    gorsel: 'abstract-woman-hands-touching-music-notes-nature-background-music-concept.jpg',
    alt: 'Doğa arka planında, ellerden yükselen nota motifleri',
  },

  /* ③ + ④ Dört pencere. Sıra ve eşleşme belgedeki gibi:
     Çevre–Toprak / Kadın–Su / Çocuk–Ateş / İş Dünyası–Hava

     Belge iki şey daha istiyor (satır 302 ve 304):
       · eşleşme "4 küçük ikonla" gösterilsin
       · "her kart kendi rengini taşısın", üstünde "element rozeti" olsun

     `renk` — elementin kendi rengi. Afloday paletinden seçildi, dışarıdan
     renk getirilmedi: toprak bronz, su karmen-soft yerine derin mavi-yeşil
     olamaz — palette mavi yok — bu yüzden dördü de mevcut token'ların
     tonlarından türetildi ve koyu zeminde de okunacak şekilde seçildi.
     `ikon` — tek renkli, çizgisel SVG; elementin doğadaki hâli. */
  pencereler: [
    {
      no: 1,
      id: 'cevre',
      ad: 'Çevre',
      element: 'Toprak',
      renk: '#6E6540',           /* haki — yeni logonun harf rengi, 4.78:1 */
      renkAcik: '#C2A667',       /* koyu bölümde okunur karşılığı — 7.4:1 */
      ikon: 'toprak',
      gorsel: 'business-people-holding-plant-sprout-together-unity-as-csr-commitmentgyre.jpg',
      alt: 'Birlikte fidan tutan eller',
      anlati: 'Toprak, yaşamın başladığı ve sürdüğü yerdir. Sessizce besler, korur ve geleceği bugünden inşa eder. Biz de çevreyi aynı bakış açısıyla ele alıyor; seminerlerimiz ve doğadan hobi atölyelerimizle kurumların ve bireylerin sürdürülebilir yaşam alışkanlıkları geliştirmelerine, karbon ayak izlerini azaltmalarına ve doğayla daha güçlü bir bağ kurmalarına katkı sağlıyoruz.',
      neSunuyoruz: 'Kurumlara çevre farkındalık programları sunuyoruz: iklim değişikliği, kirlilik kaynakları, biyoçeşitlilik, sürdürülebilir kalkınma, enerji tasarrufu, su ve atık yönetimi konularında hem bilgi hem pratik beceri kazandıran seminer ve doğadan hobi atölyeleri.',
      programlar: [
        'Karbon Ayak İzimizi Azaltalım (Seminer)',
        'Akıllı Mutfak Akıllı Alışveriş (Seminer)',
        'Yeni Başlayanlar İçin Kentte Ekolojik Yaşam (Seminer)',
        'Sürdürülebilir Yaşam: Kompost Yapımı (Deneyim)',
        'Doğayla Kavuşma Zamanı: Orman Banyosu Etkinliği (Deneyim)',
        'Doğanın İlhamıyla Geri Dönüşüm Çiçek Aksesuar Tasarım Atölyesi (Deneyim)',
        'Sahi Bu Ne Demek Konuşma Serileri (Seminer)',
      ],
    },
    {
      no: 2,
      id: 'kadin',
      ad: 'Kadın',
      element: 'Su',
      renk: '#3E6B63',           /* yosun-su, palette en soğuk yeşil */
      renkAcik: '#6BA89C',       /* koyu bölümde 6.5:1; #3E6B63 orada 2.94 kalıyordu */
      ikon: 'su',
      gorsel: 'day-holding-sale-consumerism-red-bag.jpg',
      alt: 'Elinde kırmızı çanta taşıyan kişi',
      anlati: 'Su, hem durgun derinliği hem de dalgaların gücüyle yaşamın akışını temsil eder. Kadın da tıpkı su gibi; uyum sağlayan, dönüştüren ve ilham veren bir güçtür. Bu nedenle seminerlerimiz ve doğadan hobi atölyelerimiz kadınların doğal liderlik ve girişimci ruhunu destekleyerek sürdürülebilir fikirleri hayata geçirmelerine odaklanır.',
      neSunuyoruz: 'Kadınların bedenlerini ve zihinlerini en iyi şekilde kullanmalarını destekleyen fiziksel ve ruhsal sağlık gelişim programları sunuyoruz — egzersiz, beslenme, stres yönetimi, kişisel gelişim ve doğadan ilhamla üretim/atölye deneyimlerini bir araya getiriyoruz.',
      programlar: [
        'Rahmin Bilge Yolu (Seminer)',
        'Minimalist Ebeveynlik (Seminer)',
        'Beslenmede Farkındalık (Seminer)',
        'Ekolojik Yaşam Yolu: Ne Yersek O\'yuz Ne Giyersek O\'yuz (Seminer)',
        'Aromaterapi ile Doğal Temizlik Atölyesi (Deneyim)',
        'Toprak Elementini Dengelemek: Güvende ve Sağlam Hissetmek (Seminer)',
        'Bir Ekosistem Tasarlıyoruz: Teraryum Atölyesi (Deneyim)',
        'Wabi-Sabi Felsefesiyle Saksısız Bitki Yetiştirme Atölyesi (Deneyim)',
      ],
      /* KALDIRILDI — belge satır 348. Bu cümle ziyaretçiye değil bize
         yazılmış bir konumlandırma notu ("…örtüşür", "…sunulabilir"),
         yani belgenin yönerge kısmı. Sayfada görünür hâldeydi.
         Diğer üç pencerede böyle bir alan yok. */
    },
    {
      no: 3,
      id: 'cocuk',
      ad: 'Çocuk',
      element: 'Ateş',
      renk: '#A83A16',           /* turuncunun koyu tonu — ateş. Saf #F05625
                                    açık zeminde 2.84:1, küçük metinde
                                    kullanılamıyor; bu tonu 5.24:1 veriyor. */
      renkAcik: '#F2764A',       /* turuncunun açık tonu — koyu bölümde 6.29:1.
                                    Eski #E08199 karmen ailesindendi, palet
                                    değişince tek başına kalmıştı. */
      ikon: 'ates',
      gorsel: 'curious-kids-participating-treasure-hunt (1).jpg',
      alt: 'Hazine avına katılan meraklı çocuklar',
      anlati: 'Ateş, kadim öğretilerde yaşam enerjisinin, dönüşümün ve harekete geçme gücünün simgesidir. Çocuk da bu enerjiyi en doğal haliyle merakı, keşfetme isteği ve öğrenme heyecanıyla taşır. Doğadan hobi atölyelerimizle çocukların bu potansiyelini güçlendirirken, doğayla bağ kuran ve yaşadığı dünyaya karşı sorumluluk hisseden bireyler yetişmesine katkı sağlıyoruz.',
      neSunuyoruz: '4-14 yaş arası çocuklara yönelik, doğadan materyaller ve el sanatlarıyla desteklenen, eğlenceli ve interaktif beceri geliştirme atölyeleri sunuyoruz. Bu atölyeler aynı zamanda ebeveyn-çocuk birlikte katılımına da açık, özel gün etkinlikleri olarak kurgulanabilir.',
      programlar: [
        'Kuş Evi Tasarım Atölyesi (Deneyim, 4-14 yaş)',
        'Mini Kavanoz Teraryum Atölyesi (Deneyim, 4-14 yaş)',
        'Saksısız Bitki Yetiştirme (Kokedama) Atölyesi (Deneyim, 4-14 yaş)',
        'Kağıt İleri Dönüşüm Atölyesi (Deneyim, 4-14 yaş)',
        'Minik Çiftçiler (Deneyim, 4-14 yaş)',
        'Doğadan Çerçeve Tasarım Atölyesi (Deneyim, 4-14 yaş)',
        'Bez Çanta Kişiselleştirme Atölyesi (Deneyim, 4-14 yaş)',
      ],
      ekBolum: {
        baslik: 'Çocuk ve Aile Etkinlikleri',
        paragraflar: [
          'Kurumların aile günü, yaz kampı, bayram kutlamaları ve çocuklara yönelik özel gün etkinlikleri için doğadan ilham alan hazır programlar sunuyoruz. 23 Nisan Ulusal Egemenlik ve Çocuk Bayramı, 5 Haziran Dünya Çevre Günü gibi özel günleri, yalnızca kutlanan etkinlikler olmaktan çıkarıp çocukların doğayla bağ kurduğu anlamlı deneyimlere dönüştürüyoruz.',
          'Geleceği korumanın ilk adımı, çocukların doğayı tanıması ve sevmesidir. Çünkü insan, bağ kurduğu şeyi korumak ister. Doğadan ilham alan deneyimsel atölyelerimiz ve etkinliklerimizle çocukların doğayla kalıcı bir bağ kurmalarını desteklerken, kurumların sürdürülebilirlik ve sosyal etki hedeflerine de katkı sağlıyoruz.',
        ],
      },
    },
    {
      no: 4,
      id: 'is-dunyasi',
      ad: 'İş Dünyası',
      element: 'Hava',
      renk: '#5C6158',           /* ink-muted, havanın grisi */
      renkAcik: '#9AA196',       /* koyu bölümde 6.7:1; #5C6158 orada 2.79 kalıyordu */
      ikon: 'hava',
      gorsel: 'businessman-using-laptop-park.jpg',
      alt: 'Parkta dizüstü bilgisayarla çalışan profesyonel',
      anlati: 'Hava, görünmez bağların, iletişimin, hareketin ve çevikliğin simgesidir. Doğadaki ekosistemler, yaşamlarını sürekli etkileşim, iş birliği ve değişime uyum sayesinde sürdürür; biz de iş dünyasını aynı bakış açısıyla yaşayan bir ekosistem olarak görüyoruz. Değişimin kaçınılmaz olduğu iş dünyasında, kurumların da doğa gibi çevik, uyumlu ve öğrenen yapılar kurması gerektiğine inanıyoruz. Bu nedenle doğadan ilham alan eğitimlerimiz ve deneyimsel atölyelerimizle kurumların iletişim kültürünü güçlendirmelerine, çevik çalışma anlayışını benimsemelerine ve değişimin mimarı olmalarına katkı sağlıyoruz.',
      neSunuyoruz: 'Doğanın milyonlarca yıllık deneyiminden ilham alarak; iş dünyasının ihtiyaç duyduğu yetkinlikleri araştırmaya dayalı ve deneyimsel öğrenme yöntemleriyle geliştiriyoruz. Eğitimlerimiz, çalışanların kurumlarına aidiyet duymasını, sorumluluk almasını ve iş birliğiyle değer üreten ekipler oluşturmasını destekleyen bütünsel bir gelişim deneyimi sunuyor.',
      /* Bu pencerede program değil, beş eğitim var; hepsi kendi çapasına bağlanıyor */
      programEtiketi: 'Bu Pencerede Yer Alan Eğitimler',
      egitimBaglari: [
        ['Doğanın İletişim Dili Eğitimi', 'iletisim-dili'],
        ['Doğanın Gücüyle Duygusal Dayanıklılık ve Esneklik Eğitimi', 'duygusal-dayaniklilik'],
        ['Doğanın Takım Ruhuyla İş Ekosistemi Eğitimi', 'takim-ruhu'],
        ['Doğanın İlhamıyla Yaratıcı Düşünme Eğitimi', 'yaratici-dusunme'],
        ['Değişimin Doğası ve Liderlik Ekosistemi Eğitimi', 'degisimin-dogasi'],
      ],
    },
  ],

  /* ⑤ Kapanış — Ortak Zemin. Belge bu bölüm için PDF'teki altı gelişim alanını
     öneriyor ("kullanılabilir") ve kapanış çağrısını birebir veriyor. */
  kapanis: {
    baslik: 'Odaklanılan Gelişim Alanları',
    /* Belgede bu bölüm için açıklama cümlesi yok; sayfada da yok.
       Alan, ileride metin gelirse diye duruyor. */
    giris: '',
    alanlar: [
      'Sürekli İletişim',
      'Uyum & İş Birliği',
      'EÇK',
      'Esenlik',
      'Sürekli Yenilenme',
      'Çevresel Liderlik',
    ],
    cagri: 'Kurumunuzun Senfonisini Tamamlamaya Hazır mısınız?',
  },
};

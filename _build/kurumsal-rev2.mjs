/* KURUMSAL HİZMETLER sayfası — 4 Ağustos 2026 belgesi, satır 99-124.
   Metinler belgeden birebir. Kısaltma, yeniden yazma, ekleme yok.

   Sayfa iki hizmet hattını anlatıyor; üçüncüsü (Sosyal Sorumluluk &
   İş Danışmanlığı) kendi adresinde duruyor ve buradan bağlanıyor.

   BELGEDEKİ DİZGİ HATALARI — düzeltilenler:
     1. "Babalar Günü  Kokedama"            çift boşluk
     2. "+ilgili derneğe bağış"             + sonrası boşluk yoktu
     3. "ambalajın  tasarıma  dönüşmesi"    çift boşluk
   Ayrıca belgede Gönüllülük ve Ürün lansmanı satırlarında iki ayrı öneri
   arka arkaya, aralarında ayraç olmadan yazılmış; ikisi ayrı madde yapıldı.
   Kelime değişikliği yok. */

export const kurumsalSayfasi = {
  baslik: 'Kurumsal Hizmetler',

  hatlar: [
    {
      id: 'deneyimsel-ogrenme',
      ad: 'Doğadan Deneyimsel Öğrenme Atölyeleri',
      ozet: 'Kurum kültürü ve çalışan yetkinlik gelişimi hedefiyle, koçluk yaklaşımıyla tasarlanan, konu odaklı doğa temalı atölyeler.',
      paragraflar: [
        'Katılımcıları günlük rutinde sık karşılaşmadıkları doğal malzemelerle buluşturarak zihne yeni kayıtlar açar, yıllardır etkinliği kanıtlanmış aktif öğrenme metoduyla hedeflenen kurum kültürü/yetkinlik konusunu derinleştiririz. Bilişsel ve fiziksel becerileri eş zamanlı çalıştırarak değişim, liderlik, yaratıcı düşünme, iletişim, iş birliği ve problem çözmede fark yaratırız.',
        'Eğitimlerde oyunlaştırılmış aktif öğrenmeye imkanı sunan, somut çıktı yaratan, eğitim içi uygulama olarak yüz yüze veya Türkiye geneli online (kit gönderimi + canlı destek) uygulanır.',
      ],
      faydaBasligi: 'Katılımcı & Kurum Faydası',
      faydalar: [
        'Problem çözme pratiği',
        'Rutin dışı beceriyle zihinsel esneklik',
        'Yaratıcı düşünme',
        'Somut başarı (ürün üretme)',
        'Terapi — rahatlama, stres atma',
        'Eğlence, sosyal aktivite',
        'Sonuç odaklılık (iş sonucu görme)',
        'İşe adaptasyon desteği',
        'Odaklanma',
      ],
      ornekEtiketi: 'Doğadan Deneyimsel Öğrenme Atölyeleri',
      ornekler: 'Mottolu Çerçeve Tasarım Atölyesi, Bitki Dikim Tasarım Atölyesi, Kavanoz Teraryum Tasarım Atölyesi, Çiçek Aksesuar Tasarım Atölyesi vb',
      gorsel: 'creativity-design-process-graphics-concept.jpg',
      alt: 'Yaratıcı tasarım sürecini anlatan çalışma masası',
    },
    {
      id: 'etkinlik-deneyimleri',
      ad: 'Doğadan Etkinlik Atölye Deneyimleri',
      ozet: 'Doğa temasını koruyan ama belirli bir mesaj/konu taşımayan, yaratıcılığa ve keyifli vakit geçirmeye odaklanan atölyeler — hedefimiz sadece çalışan motivasyonu.',
      paragraflar: [
        'Kurum ihtiyacına, mevsime veya özel günlere göre şekillenen dönemsel konseptlerle; motivasyon, özel gün etkinliği, iç iletişim ve işe adaptasyon projelerine katılımcıları doğaya yaklaştırarak onlara keyifli vakit geçirme imkanı sunar, eşlik ederiz.',
      ],
      gorsel: 'business-people-holding-plant-sprout-together-unity-as-csr-commitmentgyre.jpg',
      alt: 'Birlikte fidan tutan eller, kurumsal sorumluluk temalı',
      /* Belgede "alan → atölyeler" biçiminde altı eşleme */
      konseptler: [
        {
          alan: 'Sürdürülebilirlik',
          atolyeler: [
            'İleri Dönüşüm Kavanoz Teraryum Tasarım Atölyesi',
            'Bitki Akvaryumu Tasarım Atölyesi',
            'Kupa Bahçe Tasarım Atölyesi',
          ],
        },
        {
          alan: 'İç iletişim → Motivasyon / dönemsel stres',
          atolyeler: [
            'Mottolu Çerçeve Tasarım Atölyesi',
            'Kuru Çiçek Fanus Tasarım Atölyesi',
            'Minyatür Bahçe Atölyesi vb',
          ],
        },
        {
          alan: 'Mevsim Konseptleri',
          atolyeler: [
            'Sonbahar Konsepti - Bal Kabağı Sukulent Atölyesi',
            'Yılbaşı Kapı Çelengi Tasarım Atölyesi',
            'Hasır Şapka Tasarım Atölyesi vb',
          ],
        },
        {
          alan: 'Özel Günler',
          atolyeler: [
            'Babalar Günü Kokedama Atölyesi',
            'Kadınlar Günü Çiçek Aksesuar Atölyesi',
            '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı Doğadan Çocuk Hobi Atölyeleri (Mini Kavanoz Teraryum, Ahşap Kuş Evi Tasarım, İlk Bitkim Dikim Atölyesi vb)',
            'Sevgililer Günü Aşk Bahçesi Tasarım Atölyesi',
            'Çiçek Buket Tasarım Atölyesi vb.',
          ],
        },
        {
          alan: 'Gönüllülük Atölyeleri',
          atolyeler: [
            'Gönüllülük Eğitim Semineri + Çiçek Aksesuar Tasarım Atölyesi + ilgili derneğe bağış (kurumsal gönüllülük)',
            'Gönüllülük Eğitim Semineri + Saksısız Bitki Yetiştirme Atölyesi + ilgili derneğe bağış (kurumsal gönüllülük)',
          ],
        },
        {
          alan: 'Ürün lansmanı',
          atolyeler: [
            'Dekoratif Obje Tasarım Atölyesi (ambalajın tasarıma dönüşmesi)',
            'İlham veren Mini Ekosistem Teraryum Atölyesi vb.',
          ],
        },
      ],
    },
  ],
};

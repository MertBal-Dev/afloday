/* OTOMATİK ÜRETİLDİ — node _build/gorsel-hazirla.mjs sonrası yenilenir.
   Etkinlik klasöründeki 70 fotoğrafın akordeon kategorilerine dağılımı.

   Hangi fotoğrafın hangi ATÖLYEYE ait olduğu belli değil — dosya adlarındaki
   numaralar atölye sırasıyla örtüşmüyor. Ama dosya adı hangi KATEGORİYE ait
   olduğunu söylüyor, o yüzden eşleme kategori düzeyinde yapılıyor.
   Kategori düzeyinde iddia doğru; atölye düzeyinde uydurma olurdu.

   `kapak: true` olan, akordeon başlığının yanındaki büyük görsel; kalanı galeri.
   Kategorisi çözülemeyen tek dosya (thumbnail_IMG_0624.jpg) dışarıda. */
export const etkinlikGorselleri = {
  'gonulluluk': [
    /* Kapak 1'den 6'ya geçti (7 Ağustos): 1 numara havuzun en dikey karesi,
       geniş bantta yanında en çok boşluğu o bırakıyordu. 1 numara kapak
       olmaktan çıktı ama SİLİNMEDİ — galeriye indi, sayfada duruyor. */
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-6', kapak: true },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-1', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-5', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-7', kapak: false },
    { slug: 'etkinlik/kurumsal-gonulluluk-etkinlikleri-9', kapak: false },
  ],
  'cocuk': [
    /* Kapak numarasızdan 1'e geçti (7 Ağustos) — gerekçe etkinlikler.mjs'de.
       Numarasız kare silinmedi, galeriye indi. */
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-1', kapak: true },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-5', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-6', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-7', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-8', kapak: false },
    { slug: 'etkinlik/cocuk-atolye-etkinlikleri-9', kapak: false },
    { slug: 'etkinlik/mini-kavanoz-teraryum-atolyesi', kapak: false },
  ],
  'motivasyon': [
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-2', kapak: true },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-5', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-7', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-8', kapak: false },
    { slug: 'etkinlik/motivasyon-ve-calisan-deneyimi-etkinlikleri-9', kapak: false },
    { slug: 'etkinlik/mottolu-farkindalik-cercevesi-tasarim-atolyesi-gorsel4', kapak: false },
  ],
  'surdurulebilirlik': [
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-1', kapak: true },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-5', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-6', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-7', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-8', kapak: false },
    { slug: 'etkinlik/surdurulebilirlik-etkinlikleri-9', kapak: false },
  ],
  'takim-gelisim': [
    { slug: 'etkinlik/takim-gelisim-etkinlikleri', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-1', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-5-jpeg', kapak: false },
    { slug: 'etkinlik/takim-gelisim-etkinlikleri-5-jpg', kapak: true },
  ],
  'wellbeing': [
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-1', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-5', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-6', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-7', kapak: true },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-8-jpeg', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-8-jpg', kapak: false },
    { slug: 'etkinlik/wellbeing-iyi-olus-etkinlikleri-9', kapak: false },
  ],
  'ozel-gun': [
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-1', kapak: true },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-10', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-2', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-3', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-4', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-5-jpeg', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-5-jpg', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-6', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-7', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-8-jpeg', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-8-jpg', kapak: false },
    { slug: 'etkinlik/ozel-gun-ve-donemsel-etkinlikleri-9', kapak: false },
  ],
};

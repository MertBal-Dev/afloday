/* KVKK AYDINLATMA METNİ ve ÇEREZ POLİTİKASI — metin Afloday'den bekleniyor.

   Bu metinleri BİZ YAZMIYORUZ. Aydınlatma metni hukuki bir beyandır: veri
   sorumlusunun kim olduğunu, hangi veriyi hangi hukuki sebeple işlediğini,
   ne kadar sakladığını ve kimlere aktardığını taahhüt eder. Yanlış beyanın
   sorumluluğu Afloday'de kalır. Şablon uyarlamak müşteriyi hukuken bağlar.

   4 Ağustos içerik belgesinde KVKK, aydınlatma, çerez, gizlilik başlıkları
   hiç geçmiyor. Plandaki "Afloday'den beklenen cevaplar" listesinde 8. madde:
   "KVKK aydınlatma metni ve çerez politikası metinleri (hukukçularından)."

   NASIL ÇALIŞIYOR
   `hazir` false olduğu sürece build.mjs bu sayfaları üretmiyor ve her
   derlemede uyarı basıyor. Metin geldiğinde `paragraflar` doldurulup
   `hazir: true` yapılır, sayfa kendiliğinden yayına girer ve form onay
   kutusundaki bağlantı canlanır.

   Boş bir hukuki sayfa yayınlamak, sayfanın hiç olmamasından kötüdür:
   ziyaretçiye taahhüt veriyormuş gibi görünüp hiçbir şey söylemez. */

export const kvkkSayfalari = [
  {
    id: 'kvkk',
    dosya: 'kvkk.html',
    baslik: 'KVKK Aydınlatma Metni',
    aciklama: 'Afloday kişisel verilerin korunması aydınlatma metni.',
    hazir: false,
    paragraflar: [],
  },
  {
    id: 'cerez-politikasi',
    dosya: 'cerez-politikasi.html',
    baslik: 'Çerez Politikası',
    aciklama: 'Afloday çerez politikası.',
    hazir: false,
    paragraflar: [],
  },
];

/* Form onay kutusu: metin yayımlanmadan bağlantı verilmez, aksi hâlde
   ziyaretçi var olmayan bir sayfaya tıklar. */
export const kvkkHazir = () => kvkkSayfalari.every((s) => s.hazir);

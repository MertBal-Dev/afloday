/* İçerik veri dosyalarının tip tanımları.
   `.mjs` dosyaları düz JavaScript; bu bildirim TypeScript'in ve editörün
   alan adlarını tanımasını sağlıyor. Alan adında yazım hatası artık sessizce
   boş çıktı vermek yerine editörde işaretleniyor.

   Neden ayrı .d.ts: veri dosyalarını .ts yapmak derleme zincirine bir adım
   daha ekler ve statik üretecin bağımsız çalışmasını bozar (bkz. docs/mimari.md).
   Tip bildirimi bu maliyeti getirmeden aynı korumayı sağlıyor. */

/** Kaynak fotoğrafın dosya adı; yol `resim()` içinde kuruluyor. */
type GorselAdi = string;

/** CSS object-position gibi okunur: soldan ve ÜSTTEN yüzde. */
type Odak = [x: number, y: number];

interface Buton {
  yazi: string;
  /** İç dosya adı (`iletisim.html`); canlı adrese build sırasında çevrilir. */
  href: string;
}

export interface HeroSlayt {
  id: string;
  etiket: string;
  baslik: string;
  altBaslik: string;
  birincilButon: Buton | null;
  ikincilButon: Buton | null;
  gorsel: GorselAdi;
  alt: string;
  odak?: Odak;
}

export interface Egitim {
  id: string;
  /** İç sayfa başlığı. Anasayfa kartı `vitrinAd` kullanır. */
  ad: string;
  vitrinAd: string;
  slogan: string;
  vitrinBaslik: string;
  vitrinMetin: string;
  etiketler: string[];
  gorsel: GorselAdi;
  alt: string;
  /** Belge iki programda anasayfa kartı için farklı fotoğraf veriyor. */
  vitrinGorsel?: GorselAdi;
  vitrinAlt?: string;
  acilisSahnesi: string;
  dogadanDers: string;
  /** [kas adı, açıklama] */
  kaslar: [string, string][];
  isHayati: string;
  sosyalHayat: string;
  format: string;
  /** İç sayfada kısa tire, anasayfada uzun tire — belge böyle yazıyor. */
  sure: string;
  vitrinSure: string;
  hedefKitle: string;
  yetkinlikler: string;
}

export interface EtkinlikAtolyesi {
  ad: string;
  metin: string;
}

export interface EtkinlikKategorisi {
  id: string;
  ad: string;
  /** Belgede yalnız Takım Gelişim'de var: "Amacı". */
  girisEtiketi?: string;
  giris: string[];
  gorsel: GorselAdi;
  alt: string;
  atolyeler: EtkinlikAtolyesi[];
  /** Yalnız Wellbeing'de: "Bilim Ne Diyor?" */
  bilim?: { baslik: string; maddeler: string[] };
  /** Yalnız Gönüllülük'te: atölyeler tek tek anlatılmıyor, sayılıyor. */
  uygulanabilirEtiketi?: string;
  uygulanabilir?: string[];
}

export interface HakkimizdaBolumu {
  id: string;
  baslik: string;
  paragraflar: string[];
  gorsel: GorselAdi;
  alt: string;
  odak?: Odak;
}

export interface Pencere {
  no: number;
  id: string;
  ad: string;
  /** Doğa elementi: Toprak · Su · Ateş · Hava */
  element: string;
  gorsel: GorselAdi;
  alt: string;
  anlati: string;
  neSunuyoruz: string;
  /** Üç pencerede program listesi, dördüncüde eğitim bağlantıları var. */
  programlar?: string[];
  programEtiketi?: string;
  /** [eğitim adı, eğitim sayfasındaki çapa] */
  egitimBaglari?: [string, string][];
  not?: string;
  ekBolum?: { baslik: string; paragraflar: string[] };
}

export interface KvkkSayfasi {
  id: string;
  dosya: string;
  baslik: string;
  aciklama: string;
  /** false olduğu sürece sayfa üretilmez ve derleme uyarı basar. */
  hazir: boolean;
  paragraflar: string[];
}

/* Sayfa gövdesi — app/[[...slug]]/page.tsx bu şekli bekliyor. */
export interface Sayfa {
  adres: string;
  govde: string;
  baslik: string;
  aciklama: string;
  canonical: string;
  ogGorsel: string;
  jsonLd: string;
}

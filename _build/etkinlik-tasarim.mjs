/* ETKİNLİK ATÖLYE DENEYİMLERİ — genel bakış + 7 kategori sayfası
   ────────────────────────────────────────────────────────────────────────
   Ceylan Kalyon Özdemir'in 5 Ağustos geri bildirimi bu sayfa için:

     "atölyeler çok yazı yazı kalmış. Görseller altta word düzeni gibi
      olmuş, amatör duruyor. Mesela buradaki gibi hepsini bir arada
      görebilir, tıklayınca içine girebiliriz."   → naregitim.com/cozumlerimiz

   Eski yapı: tek sayfada 7 akordeon, her akordeonun içinde 53 atölyenin
   numaralı metin listesi, en altta fotoğraf ızgarası. Sayfa 12.600 piksel.
   Fotoğrafın metinden sonra gelmesi tam olarak "word düzeni" hissini
   veriyordu, ve kimse 12.600 pikseli taramıyor.

   Yeni yapı iki katmanlı:
     1 · Genel bakış   7 kategori kartı, hepsi bir ekranda
     2 · Kategori      kendi adresi, tam genişlik kapak, mozaik gövde

   ── FOTOĞRAF EŞLEMESİ HAKKINDA ────────────────────────────────────────
   Atölye kartlarına fotoğraf KOYULMUYOR, koyulamaz. Dosya adları hangi
   KATEGORİYE ait olduğunu söylüyor, hangi ATÖLYEYE ait olduğunu değil
   (bkz. etkinlik-gorselleri.mjs başlığı). "Bonsai Atölyesi" başlığının
   yanına rastgele bir kare koymak, fotoğrafın o atölyeden olduğunu iddia
   etmek olur — galeri kategorisi uydurmasıyla aynı hata.

   Onun yerine fotoğraflar atölye kartlarıyla EŞİT hücreler olarak aynı
   ızgaraya giriyor. Görsel yoğunluk metinle başa baş, hiçbir fotoğraf tek
   bir atölyeye bağlanmıyor. Ceylan hanım hangi karenin hangi atölye
   olduğunu söylerse eşleme tek satırla yapılabilir. */

import { resim } from './templates.mjs';
import { etkinlikGorselleri } from './etkinlik-gorselleri.mjs';

/* Kategori sayfalarının dosya adı. Site genelinde adresler düz (klasörsüz):
   `hakkimizda`, `ceylan-kalyon`... Aynı geleneği sürdürüyoruz, böylece
   `canliAdres` ve `baglantilariCevir` makinesine hiç dokunulmuyor. */
export const kategoriDosyasi = (k) => `etkinlik-${k.id}.html`;

const kareler = (k) => (etkinlikGorselleri[k.id] || []).filter((g) => !g.kapak);

/* Atölye kartlarıyla fotoğraf karolarını oranı koruyarak harmanlar.
   İkisini de sonuna kadar kullanır: 10 atölye + 9 fotoğraf neredeyse
   birer birer sıralanır, 3 atölye + 8 fotoğraf ağırlıklı fotoğraf olur.
   Basit "her 3 atölyede bir fotoğraf" kuralı fotoğrafların çoğunu
   dışarıda bırakıyordu. */
function harmanla(atolyeler, fotograflar) {
  const n = atolyeler.length, m = fotograflar.length;
  const cikti = [];
  let a = 0, g = 0;
  while (a < n || g < m) {
    /* Hangi türün "borcu" daha büyükse o gelir. */
    const aSira = n ? (a + 0.5) / n : Infinity;
    const gSira = m ? (g + 0.5) / m : Infinity;
    if (aSira <= gSira) cikti.push({ tur: 'atolye', v: atolyeler[a++] });
    else cikti.push({ tur: 'foto', v: fotograflar[g++] });
  }
  return cikti;
}

/* ══ 1 · GENEL BAKIŞ IZGARASI ═══════════════════════════════════════════
   Yedi kart, üç sütun: 3 + 3 + 1. Yalnız kalan yedinci kart tüm satırı
   kaplayıp yatay düzene geçiyor — boş hücre bırakmak yerine kasıtlı bir
   ritim. Kartta atölye sayısı YAZMIYOR: "Ara yönlendirmeler var 10 atölye,
   7 kişi ekip vs onlar olmasın." */
export function kategoriIzgara(kategoriler) {
  return `<div class="kat-izgara">
      ${kategoriler.map((k, i) => {
    const genis = i === kategoriler.length - 1 && kategoriler.length % 3 === 1;
    return `<a class="kat-kart${genis ? ' kat-kart-genis' : ''}" href="${kategoriDosyasi(k)}" data-reveal="stagger">
        <span class="kat-kart-medya">
          ${resim({ gorsel: k.gorsel, alt: '', klasor: 'etkinlik', kucuk: true })}
        </span>
        <span class="kat-kart-govde">
          <span class="kat-kart-ad">${k.ad}</span>
          <span class="kat-kart-ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 12h15M13 6l6 6-6 6"/>
            </svg>
          </span>
        </span>
      </a>`;
  }).join('\n      ')}
    </div>`;
}

/* ══ 2 · KATEGORİ KAPAĞI ════════════════════════════════════════════════
   "Aralara görseller girebilir, görsellerin üzerinde olabilir yazılar vs."
   Kategori adı fotoğrafın üzerinde duruyor. Alt yarıya koyu bir perde
   iniyor: metnin okunması fotoğrafın parlaklığına bırakılmıyor. */
export function kategoriKapak(k) {
  return `<header class="kat-kapak">
    <div class="kat-kapak-medya">
      ${resim({ gorsel: k.gorsel, alt: '', klasor: 'etkinlik', oncelik: true })}
    </div>
    <div class="kat-kapak-ic">
      <div class="wrap">
        <p class="kat-kapak-ust">
          <a href="kurumsal-hobi-atolyeleri.html">Doğadan Etkinlik Atölye Deneyimleri</a>
        </p>
        <h1 class="kat-kapak-ad">${k.ad}</h1>
      </div>
    </div>
  </header>`;
}

/* ══ 3 · MOZAİK GÖVDE ═══════════════════════════════════════════════════
   Atölye kartı ve fotoğraf karosu aynı ızgaranın eşit hücreleri.
   Fotoğraflar `.galeri-hucre` sınıfını taşıyor: ışık kutusu, klavye
   gezinmesi ve imleç rozeti hazır çalışıyor. `data-no` bilerek yok —
   "galeri kısmında altta 01 02 03 diye sayılar yazmasın." */
export function kategoriMozaik(k) {
  const foto = kareler(k);
  const atolyeler = k.atolyeler.length
    ? k.atolyeler
    /* Kurumsal Gönüllülük'ün üç atölyesi belgede tek satırda, açıklamasız
       veriliyor (belge satır 496). Başlık var, metin yok. */
    : (k.uygulanabilir || []).map((ad) => ({ ad, metin: '' }));

  const hucreler = harmanla(atolyeler, foto);
  let fotoNo = 0;

  return `<div class="kat-mozaik" data-lightbox>
      ${hucreler.map((h) => {
    if (h.tur === 'atolye') {
      return `<article class="mz-atolye" data-reveal="stagger">
          <h2 class="mz-ad">${h.v.ad}</h2>
          ${h.v.metin ? `<p class="mz-metin">${h.v.metin}</p>` : ''}
        </article>`;
    }
    fotoNo++;
    return `<button class="mz-foto galeri-hucre" type="button" data-reveal="stagger"
          data-full="assets/img/rev2/${h.v.slug}.jpg"
          data-caption="${k.ad}"
          aria-label="${k.ad} — ${fotoNo}. fotoğrafı büyüt">
          <img src="assets/img/rev2/${h.v.slug}-800.webp"
               alt="${k.ad} kapsamındaki atölyelerden kare ${fotoNo}"
               loading="lazy" decoding="async" width="800" height="800">
        </button>`;
  }).join('\n      ')}
    </div>`;
}

/* ══ 4 · DİĞER KATEGORİLER ══════════════════════════════════════════════
   "Genel olarak kayboldum sayfalarda." Her kategori sayfasının sonunda
   diğer altısı duruyor, geri dönmek için üste çıkmak gerekmiyor. */
export function kategoriGezinme(kategoriler, aktifId) {
  const digerleri = kategoriler.filter((k) => k.id !== aktifId);
  return `<nav class="kat-gezinme" aria-label="Diğer etkinlik kategorileri">
      ${digerleri.map((k) => `<a class="kat-gezinme-oge" href="${kategoriDosyasi(k)}">
        <span class="kat-gezinme-medya">
          ${resim({ gorsel: k.gorsel, alt: '', klasor: 'etkinlik', kucuk: true })}
        </span>
        <span class="kat-gezinme-ad">${k.ad}</span>
      </a>`).join('\n      ')}
    </nav>`;
}

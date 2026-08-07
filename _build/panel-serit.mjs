/* PANEL ŞERİDİ — "hepsini bir arada görebilir"
   ────────────────────────────────────────────────────────────────────────
   Ceylan Kalyon Özdemir, 5 Ağustos:

     "Doğadan Etkinlik Atölye Deneyimleri sayfasında atölyeler çok yazı
      yazı kalmış. Görseller altta word düzeni gibi olmuş, amatör duruyor.
      Mesela buradaki gibi HEPSİNİ BİR ARADA GÖREBİLİR, tıklayınca içine
      girebiliriz."  → https://naregitim.com/cozumlerimiz

   ── ÜÇÜNCÜ TUR: ARKA PLAN SAHNESİ KALKTI ──────────────────────────────
   İlk kurulumda her panelin kendi fotoğrafı vardı, dar dikey çerçevede
   %68 kırpıyordu. İkinci kurulumda referansın mekaniği alındı: arkada tek
   fotoğraf, üstünde etiket panelleri, panele gelince fotoğraf değişiyor.
   Kırpma çözüldü ama maddenin kendisi kaldı — o düzende aynı anda YALNIZ
   BİR fotoğraf görünüyor, kalan altısı imleç üzerine gelene kadar yok.
   "Hepsini bir arada görebilir" karşılanmıyordu.

   Artık yedisi de aynı anda duruyor ve hiçbiri kırpılmıyor. Yöntem sitenin
   galerisinde kullanılan hizalı satır matematiği:

     satır oranı  = Σ(karelerin oranları)
     kare esnemesi= kendi oranı        (flex-grow)

   Satır genişliği S ise satır yüksekliği S/Σ, karenin genişliği S·oran/Σ
   olur; bölünce karenin oranı kendi oranına eşit çıkar. Yani çerçeve
   fotoğrafa uyuyor, fotoğraf çerçeveye zorlanmıyor: kırpma sıfır, satır
   sonu düz, aralarda boşluk yok. Referansın "uç uca, saç teli çizgiyle
   ayrılmış" hissi de böyle korunuyor.

   Paneller hâlâ yalnız etiket ve tıklama alanı; fotoğraf panelin zemini.
   JavaScript gerekmiyor — `afloday.js` içindeki `pserit` bloğu artık
   `.pserit-kare` bulamadığı için kendini kapatıyor (`kareler.length < 2`
   koruması). Sayfa JS olmadan da eksiksiz çalışıyor. */

import { slug as gorselSlug } from './gorsel-hazirla.mjs';
import { oran as gorselOrani } from './gorsel-olculeri.mjs';

/* Satır yüksekliği = satır genişliği / Σoran. Yani satırdaki kare sayısı
   azaldıkça satır YÜKSELİR. İki kareli satır 1920'de 640 piksele çıkıyor
   ve bandı 1037 piksele şişiriyor — sayfa uzunluğu zaten geri bildirimde
   açık madde, oraya 400 piksel eklenmez.

   Ters yönde de bir sınır var: kalabalık satır alçalıyor. Beş kare tek
   satıra alınınca 1440'ta satır 184 piksele iniyor, kare 276×184 oluyor
   ve iki satırlık etiket okla üst üste biniyor — ölçüldü, gözle de
   görüldü. O yüzden beş kare bölünüyor.

   Kural: 4 ve altı tek satır, 5+ ikiye bölünür.
     7 → 4 + 3   (1440'ta 252 + 316 = 568 piksel)
     5 → 3 + 2   (1440'ta 298 + 480 = 778 piksel) */
function satirlaraBol(liste) {
  if (liste.length <= 4) return [liste];
  const ilk = Math.ceil(liste.length / 2);
  return [liste.slice(0, ilk), liste.slice(ilk)];
}

/* ogeler: [{ ad, gorsel, href, klasor }] */
export function panelSerit(ogeler, { etiket = '' } = {}) {
  const anahtar = (o) => `${o.klasor || 'secilmis'}/${gorselSlug(o.gorsel)}`;

  /* KÖK-GÖRELİ OLMAK ZORUNDA (baştaki eğik çizgi). CSS `url()` göreli yolu
     STİL DOSYASINA göre çözüyor, sayfaya göre değil: `assets/...` yazınca
     tarayıcı `/assets/css/assets/...` arayıp 404 alıyordu. Sitedeki diğer
     görseller `src` özniteliğinden geldiği için bu tuzağa düşmüyor. */
  const zemin = (o) => `/assets/img/rev2/${anahtar(o)}-800.webp`;

  const panel = (o, i) => `<a class="pserit-panel" href="${o.href}" data-panel="${i}"
          style="--kare:url('${zemin(o)}');--oran:${gorselOrani(anahtar(o)).toFixed(4)}">
          <span class="pserit-ic">
            <span class="pserit-ad">${o.ad}</span>
            <span class="pserit-ok" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
                <path d="M4 12h15M13 6l6 6-6 6"/>
              </svg>
            </span>
          </span>
        </a>`;

  let sira = 0;
  const satirlar = satirlaraBol(ogeler).map((satir) => {
    const toplam = satir.reduce((t, o) => t + gorselOrani(anahtar(o)), 0);
    const icerik = satir.map((o) => panel(o, sira++)).join('\n        ');
    return `<div class="pserit-satir" style="--toplam:${toplam.toFixed(4)}">
        ${icerik}
      </div>`;
  }).join('\n      ');

  return `<div class="pserit" data-pserit${etiket ? ` aria-label="${etiket}"` : ''}>
      ${satirlar}
    </div>`;
}

/* PANEL ŞERİDİ — "hepsi bir arada derli toplu"
   ────────────────────────────────────────────────────────────────────────
   Ceylan Kalyon Özdemir, 5 Ağustos, naregitim.com/cozumlerimiz üzerine:

     Soru : "Buradaki ana sayfadaki gibi büyük mü istiyorsunuz Etkinlik
             Atölye görsellerini?"
     Cevap: "Büyüklük olarak değil şekil olarak demek istedim."
            "Hepsi bir arada derli toplu"

   Referansın şekli Playwright ile ölçüldü:
     · 6 dikey panel uç uca, aralarında boşluk yok, saç teli çizgi ayırıyor
     · Arkada TEK illüstrasyon, panellerin tamamını boydan boya geçiyor
     · Panele gelince arka plandaki görselin tamamı değişiyor
     · Paneller genişlemiyor, sabit kalıyor

   ── NEDEN ARKA PLAN TEK GÖRSEL ────────────────────────────────────────
   İlk uygulamada her panelin kendi fotoğrafı vardı ve 6 çözünürlükte
   ölçüldüğünde ağır kırpma çıktı: 195×400 piksellik dar panelde 3:2
   fotoğrafın **%68'i** gidiyordu. Kullanıcının gözlemi de buydu:
   "geniş görseller küçük çerçevede kesilmiş duruyor, bazı görseller
   anlamını kaybediyor."

   Dar dikey çerçeveye geniş fotoğraf sığmaz — bu bir ayar meselesi değil,
   geometri. Referansın çözümü de zaten bu değil: onlarda fotoğraf panelin
   içinde değil, ARKASINDA ve tam genişlikte duruyor. Tek geniş çerçeveye
   geniş fotoğraf giriyor, kırpma sıfıra iniyor.

   Paneller artık sadece etiket ve tıklama alanı. Hangi panelin üzerindeysen
   onun fotoğrafı görünüyor (`afloday.js` içindeki `pserit` bloğu).
   JavaScript çalışmazsa ilk fotoğraf durur ve bağlantılar çalışır. */

import { resim } from './templates.mjs';
import { slug as gorselSlug } from './gorsel-hazirla.mjs';

/* ogeler: [{ ad, gorsel, href, klasor }] */
export function panelSerit(ogeler, { etiket = '' } = {}) {
  const katman = ogeler.map((o, i) => `<span class="pserit-kare${i === 0 ? ' is-aktif' : ''}" data-kare="${i}">
          ${resim({ gorsel: o.gorsel, alt: '', klasor: o.klasor || 'secilmis', oncelik: i === 0 })}
        </span>`).join('\n        ');

  /* Dar ekranda tek sahne kapanıyor ve her panel kendi fotoğrafını
     zemin olarak gösteriyor; adres burada değişken olarak veriliyor.

     KÖK-GÖRELİ OLMAK ZORUNDA (baştaki eğik çizgi). CSS `url()` göreli
     yolu STİL DOSYASINA göre çözüyor, sayfaya göre değil: `assets/...`
     yazınca tarayıcı `/assets/css/assets/...` arıyor ve 404 alıyordu.
     Sitedeki diğer görseller `src` özniteliğinden geldiği için bu
     tuzağa düşmüyor; yalnız CSS'ten okunan bu yol etkileniyor. */
  const zemin = (o) =>
    `/assets/img/rev2/${o.klasor || 'secilmis'}/${gorselSlug(o.gorsel)}-800.webp`;

  const panel = ogeler.map((o, i) => `<a class="pserit-panel" href="${o.href}" data-panel="${i}"
        style="--kare:url('${zemin(o)}')">
        <span class="pserit-ic">
          <span class="pserit-ad">${o.ad}</span>
          <span class="pserit-ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
              <path d="M4 12h15M13 6l6 6-6 6"/>
            </svg>
          </span>
        </span>
      </a>`).join('\n      ');

  return `<div class="pserit" data-pserit${etiket ? ` aria-label="${etiket}"` : ''}>
      <div class="pserit-sahne" aria-hidden="true">
        ${katman}
      </div>
      ${panel}
    </div>`;
}

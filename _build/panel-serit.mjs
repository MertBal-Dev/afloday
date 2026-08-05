/* PANEL ŞERİDİ — "hepsi bir arada derli toplu"
   ────────────────────────────────────────────────────────────────────────
   Ceylan Kalyon Özdemir, 5 Ağustos, naregitim.com/cozumlerimiz üzerine:

     Soru : "Buradaki ana sayfadaki gibi büyük mü istiyorsunuz Etkinlik
             Atölye görsellerini?"
     Cevap: "Büyüklük olarak değil şekil olarak demek istedim."
            "Hepsi bir arada derli toplu"

   Yani tam ekran dev panel değil; istenen ŞEKİL. Referansın şekli şu:

     · Paneller uç uca, ARALARINDA BOŞLUK YOK
     · Aralarını yalnız saç teli çizgi ayırıyor
     · Hepsi aynı ölçüde, hepsi tek satırda
     · Etiket fotoğrafın üzerinde, dikey
     · Sayfa kenarından kenarına taşıyor

   Önceki kart ızgaramızın sorunu tam buydu: 36 piksellik boşluklarla
   yüzen ayrı kutular, üstelik yedinci kart geniş banda dönüşüyordu.
   Yedi ayrı nesne gibi duruyordu, tek bir derli toplu blok gibi değil.

   Kategori adlarımız referanstakilerden uzun ("Motivasyon ve Çalışan
   Deneyimi Etkinlikleri" 42 karakter, onlarda "Liderlik" 8). Dar panelde
   yatay yazı beş satıra bölünüyor; dikey yazı panel boyunca akıyor ve
   uzunluğu taşıyor. Referansın da dikey olmasının sebebi bu. */

import { resim } from './templates.mjs';

/* ogeler: [{ ad, gorsel, href, klasor }] */
export function panelSerit(ogeler, { etiket = '' } = {}) {
  return `<div class="pserit"${etiket ? ` aria-label="${etiket}"` : ''}>
      ${ogeler.map((o) => `<a class="pserit-panel" href="${o.href}" data-reveal="stagger">
        <span class="pserit-medya">
          ${resim({ gorsel: o.gorsel, alt: '', klasor: o.klasor || 'secilmis', kucuk: true })}
        </span>
        <span class="pserit-ic">
          <span class="pserit-ad">${o.ad}</span>
          <span class="pserit-ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">
              <path d="M4 12h15M13 6l6 6-6 6"/>
            </svg>
          </span>
        </span>
      </a>`).join('\n      ')}
    </div>`;
}

/* DOĞA TEMELLİ EĞİTİMLER — genel bakış + 5 program sayfası
   ────────────────────────────────────────────────────────────────────────
   Ceylan Kalyon Özdemir, 5 Ağustos:

     "Eğitim Gelişim Programlarımızdaki 5 eğitimi sayfaya sığdırsak
      çok iyi olur."
     "Genel olarak kayboldum sayfalarda."

   Eski hâl: tek sayfada 5 programın tam anlatısı alt alta. Ölçüldü,
   10.572 piksel — masaüstünde 11.7 ekran. Beş programı "bir sayfada
   görmek" mümkün değildi; ikinci programa varmak için altı ekran
   kaydırmak gerekiyordu.

   Yeni hâl, etkinlik kategorilerindeki kalıbın aynısı:
     1 · Genel bakış   5 program kartı, hepsi bir arada
     2 · Program       kendi adresi, tam genişlik kapak, tam metin

   Site tek bir gezinme fikri kullanıyor artık: koleksiyonu gör, birine gir.
   Kapak ve ızgara bileşenleri (.kat-kapak, .kat-izgara) etkinliklerle
   ORTAK — iki ayrı görsel dil kurmuyoruz.

   Belgenin altı bölümü (Açılış Sahnesi, Doğadan Öğrendiğimiz Ders, Bu
   Eğitimle Güçlenen Kaslar, İş Hayatına Yansıması, Dolaylı Sosyal Hayata
   Yansıması, Program Bilgileri) olduğu gibi duruyor. Tek cümle silinmedi,
   tek cümle eklenmedi; yalnız yerleşim değişti. */

import { resim } from './templates.mjs';

export const egitimDosyasi = (e) => `egitim-${e.id}.html`;

/* ══ 1 · GENEL BAKIŞ IZGARASI ═══════════════════════════════════════════
   Beş kart, üç sütun: 3 + 2. Beşinci kart yalnız kalmadığı için geniş
   karta gerek yok; ikisi satırı paylaşıyor.

   Kartta süre veya sıra numarası YAZMIYOR: "Ara yönlendirmeler var
   10 atölye, 7 kişi ekip vs onlar olmasın." */
export function egitimIzgara(egitimler) {
  return `<div class="kat-izgara">
      ${egitimler.map((e) => `<a class="kat-kart" href="${egitimDosyasi(e)}" data-reveal="stagger">
        <span class="kat-kart-medya">
          ${resim({ gorsel: e.gorsel, alt: '', kucuk: true })}
        </span>
        <span class="kat-kart-govde kat-kart-govde-alt">
          <span class="kat-kart-yazi">
            <span class="kat-kart-ad">${e.ad}</span>
            <span class="kat-kart-slogan">${e.slogan}</span>
          </span>
          <span class="kat-kart-ok" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 12h15M13 6l6 6-6 6"/>
            </svg>
          </span>
        </span>
      </a>`).join('\n      ')}
    </div>`;
}

/* ══ 2 · PROGRAM KAPAĞI ═════════════════════════════════════════════════ */
export function egitimKapak(e) {
  return `<header class="kat-kapak">
    <div class="kat-kapak-medya">
      ${resim({ gorsel: e.gorsel, alt: '', oncelik: true })}
    </div>
    <div class="kat-kapak-ic">
      <div class="wrap">
        <p class="kat-kapak-ust">
          <a href="doga-temelli-egitimler.html">Doğa Temelli Eğitimlerimiz</a>
        </p>
        <h1 class="kat-kapak-ad">${e.ad}</h1>
        <p class="kat-kapak-slogan">${e.slogan}</p>
      </div>
    </div>
  </header>`;
}

/* ══ 3 · DİĞER PROGRAMLAR ═══════════════════════════════════════════════ */
export function egitimGezinme(egitimler, aktifId) {
  return `<nav class="kat-gezinme" aria-label="Diğer eğitim programları">
      ${egitimler.filter((e) => e.id !== aktifId).map((e) => `<a class="kat-gezinme-oge" href="${egitimDosyasi(e)}">
        <span class="kat-gezinme-medya">
          ${resim({ gorsel: e.gorsel, alt: '', kucuk: true })}
        </span>
        <span class="kat-gezinme-ad">${e.ad}</span>
      </a>`).join('\n      ')}
    </nav>`;
}

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
import { oran, gorselOlculeri } from './gorsel-olculeri.mjs';

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

  /* ── HİZALANMIŞ FOTO BANDI ────────────────────────────────────────────
     Havuzun 114 karesinin 48'i dikey, 54'ü yatay. Hepsini tek bir orana
     zorlamak dikey karelerin yarısını siliyordu: Sürdürülebilirlik'teki
     teraryum karesinde iki kişinin ELİNDEKİ teraryumlar kesiliyordu,
     yani atölyenin ürünü kayboluyordu.

     Her kareye kendi oranını vermek kırpmayı bitirdi ama bu sefer ızgara
     dağıldı — satırlar farklı yükseklikte kaldı, sayfa 8'den 10.8 ekrana
     çıktı ve ahenk gitti.

     Doğrusu ikisinin ortası, matbaadan bilinen "hizalanmış satır":
     bir bandaki karelerin hepsi AYNI YÜKSEKLİKTE, genişlikleri kendi
     oranlarına göre değişiyor. Dikey kare dar, yatay kare geniş oluyor;
     bant üstten ve alttan düz kesiliyor.

     Matematiği basit: hepsi h yüksekliğindeyse toplam genişlik
     h × Σoran olur, yani BANDIN oranı Σoran'dır. Bandın `aspect-ratio`
     değerine bu toplamı verince yükseklik kendiliğinden doğru çıkıyor;
     her kare de `flex-grow` olarak kendi oranını alıyor. Sonuç: sıfır
     kırpma, düz hizalanmış satırlar. */
  const bant = (kareGrubu, no) => {
    const oranlar = kareGrubu.map((g) => oran(g.slug));
    const toplam = oranlar.reduce((a, b) => a + b, 0);
    return `<div class="mz-bant" style="aspect-ratio:${toplam.toFixed(3)}">
        ${kareGrubu.map((g, i) => `<button class="mz-foto galeri-hucre" type="button"
          style="flex:${oranlar[i].toFixed(3)} 1 0"
          data-full="assets/img/rev2/${g.slug}.jpg"
          data-caption="${k.ad}"
          aria-label="${k.ad} — ${no + i + 1}. fotoğrafı büyüt">
          <img src="assets/img/rev2/${g.slug}-800.webp"
               alt="${k.ad} kapsamındaki atölyelerden kare ${no + i + 1}"
               loading="lazy" decoding="async" width="800" height="800">
        </button>`).join('\n        ')}
      </div>`;
  };

  /* ── SIRAYLA BİR YAZI BİR FOTOĞRAF ────────────────────────────────────
     Bant deseni masaüstünde çalışıyordu ama telefonda tek sütuna inince
     "üç fotoğraf, iki yazı" diye topaklanıyordu: düzen değil yığın.
     Kullanıcının tespiti: "tertip düzen sıfır".

     Şimdi akış birebir dönüşümlü — bir atölye, bir kare, bir atölye,
     bir kare. İki sütunlu ızgarada her satır [yazı][fotoğraf] oluyor;
     tek sütunda da aynı ritim iniyor. Her iki ekranda da öngörülebilir.

     ── ÜÇ STANDART ÇERÇEVE ──
     Oranı tamamen serbest bırakmak her kareyi farklı yükseklikte
     bırakıyordu. Şimdi her kare kendi yönüne en yakın ÜÇ çerçeveden
     birine oturuyor: dikey 3:4, kare 1:1, yatay 3:2.

     Havuzumuz zaten bu üç orana yakın toplandığı için kırpma yüzde
     onun altında kalıyor, ama sayfada yalnız üç farklı yükseklik
     olduğu için göz düzeni yakalıyor. */
  const CERCEVE = [[3, 4], [1, 1], [3, 2]];
  const cerceve = (slug) => {
    const o = oran(slug);
    let en = CERCEVE[0], fark = Infinity;
    for (const [a, b] of CERCEVE) {
      const d = Math.abs(a / b - o);
      if (d < fark) { fark = d; en = [a, b]; }
    }
    return `${en[0]} / ${en[1]}`;
  };

  const parcalar = [];
  const enUzun = Math.max(atolyeler.length, foto.length);
  for (let i = 0; i < enUzun; i++) {
    const a = atolyeler[i];
    if (a) {
      parcalar.push(`<article class="mz-atolye" data-reveal="stagger">
        <h2 class="mz-ad">${a.ad}</h2>
        ${a.metin ? `<p class="mz-metin">${a.metin}</p>` : ''}
      </article>`);
    }
    const g = foto[i];
    if (g) {
      parcalar.push(`<button class="mz-foto galeri-hucre" type="button" data-reveal="stagger"
        style="aspect-ratio:${cerceve(g.slug)}"
        data-full="assets/img/rev2/${g.slug}.jpg"
        data-caption="${k.ad}"
        aria-label="${k.ad} — ${i + 1}. fotoğrafı büyüt">
        <img src="assets/img/rev2/${g.slug}-800.webp"
             alt="${k.ad} kapsamındaki atölyelerden kare ${i + 1}"
             loading="lazy" decoding="async" width="800" height="800">
      </button>`);
    }
  }

  /* SON KARE YETİM KALIYORSA TAM GENİŞLİĞE YAYILIR.

     Izgara iki sütunlu. Öğe sayısı tek olduğunda sonuncusu yalnız kalıyor
     ve yanında boş hücre bırakıyor (etkinlik-cocuk: 21 öğe). Metni olmayan
     bir fotoğraf için doğru davranış onu kapanış karesi olarak tam
     genişlikte göstermek.

     Yayılan kare iki şey daha istiyor:
       · TAM BOY dosya — 800px'lik türev 1295px'e yayılınca bulanıklaşır,
         tam boy 1600px mevcut
       · KENDİ oranı — `cerceve()` en yakın standart kesire yuvarlıyor;
         tam genişlikte bu fark %11 kırpma demek */
  const sonFotoYetim = parcalar.length % 2 === 1
    && parcalar[parcalar.length - 1].includes('class="mz-foto');
  if (sonFotoYetim) {
    /* KAPANIŞ KARESİ YATAY OLMALI.

       Kapanış karesi iki sütunu birden alıyor. Yatay kare orada bir bant
       gibi oturuyor; DİKEY kare tam genişlikte devleşiyor ve sayfayı
       kesiyor. Kullanıcının sözü: "bu dikey görsel tek kalınca pc de
       sayfa düzeni bozuldu gibi". Üç sayfada böyleydi (wellbeing,
       gönüllülük, motivasyon); üçünün de son karesi 1200×1600'dü.

       Sırayı baştan sona karıştırmıyoruz — yalnız son kareyle havuzun
       en geniş karesi YER DEĞİŞTİRİYOR. İki konum değişiyor, gerisi
       duruyor.

       Neden sıra karıştırılmıyor: yazı-fotoğraf eşleşmesinin doğrulanmış
       bir kaynağı yok. Arşiv karelerinde etiket yok, 4 Ağustos belgesi de
       atölyelere dosya adı atamıyor (belgede görsel yalnız 5 yerde geçiyor,
       beşi de anasayfa). Yani eşleşme zaten rastgele; onu topluca
       değiştirmek ne düzeltir ne bozar, ama gereksiz oynama olur.
       Hangi karenin hangi atölyeye ait olduğu Afloday'den beklenen bilgi. */
    const sonIndeks = foto.length - 1;
    if (oran(foto[sonIndeks].slug) < 1) {
      let enGenis = -1, enGenisOran = 1;
      for (let i = 0; i < sonIndeks; i++) {
        const o = oran(foto[i].slug);
        if (o > enGenisOran) { enGenisOran = o; enGenis = i; }
      }
      if (enGenis >= 0) {
        const t = foto[sonIndeks];
        foto[sonIndeks] = foto[enGenis];
        foto[enGenis] = t;
        /* Değişen iki hücreyi gövdede de güncelle: `parcalar` yukarıdaki
           döngüde eski sırayla kuruldu. */
        const hucre = (g, i) => `<button class="mz-foto galeri-hucre" type="button" data-reveal="stagger"
        style="aspect-ratio:${cerceve(g.slug)}"
        data-full="assets/img/rev2/${g.slug}.jpg"
        data-caption="${k.ad}"
        aria-label="${k.ad} — ${i + 1}. fotoğrafı büyüt">
        <img src="assets/img/rev2/${g.slug}-800.webp"
             alt="${k.ad} kapsamındaki atölyelerden kare ${i + 1}"
             loading="lazy" decoding="async" width="800" height="800">
      </button>`;
        let sayac = -1;
        for (let p = 0; p < parcalar.length; p++) {
          if (!parcalar[p].includes('class="mz-foto')) continue;
          sayac++;
          if (sayac === enGenis || sayac === sonIndeks) {
            parcalar[p] = hucre(foto[sayac], sayac);
          }
        }
      }
    }

    const sonSlug = foto[foto.length - 1]?.slug;
    if (sonSlug) {
      const o = oran(sonSlug);
      parcalar[parcalar.length - 1] = `<button class="mz-foto mz-foto-genis galeri-hucre" type="button" data-reveal="stagger"
        style="aspect-ratio:${o.toFixed(3)}"
        data-full="assets/img/rev2/${sonSlug}.jpg"
        data-caption="${k.ad}"
        aria-label="${k.ad} — kapanış karesi">
        ${/* `srcset` şart: kare masaüstünde ~1295px'e yayılıyor ve orada
             800px'lik türev bulanık kalıyor; telefonda ise ~350px'e
             düşüyor ve orada 1600px'lik dosya (216 kB) israf oluyor.
             Tarayıcı yuvanın gerçek genişliğine bakıp seçsin. */ ''}
        <img src="assets/img/rev2/${sonSlug}.jpg"
             srcset="assets/img/rev2/${sonSlug}-800.webp 800w,
                     assets/img/rev2/${sonSlug}.jpg 1600w"
             sizes="(max-width: 760px) 92vw, 1295px"
             alt="${k.ad} kapsamındaki atölyelerden kapanış karesi"
             loading="lazy" decoding="async"
             width="${gorselOlculeri[sonSlug]?.[0] ?? 1600}" height="${gorselOlculeri[sonSlug]?.[1] ?? 1067}">
      </button>`;
    }
  }

  return `<div class="kat-mozaik" data-lightbox>
      ${parcalar.join('\n      ')}
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

# Afloday — tasarım promptu (v2)

> Boş bir klasörde çalışan bir kodlama aracına (Antigravity, Cursor, Claude Code)
> olduğu gibi yapıştırılmak üzere yazıldı. **İçerik değil, tasarım sistemi
> istiyoruz.** Gerçek metinler sonra taşınacak; sen yer tutucu metinle çalış.
>
> **Kopyalanacak bir referans yok.** Müşterinin elinde bir sunum destesi
> var ve görsel dilini beğeniyor; renk sistemi oradan çıkarıldı. Ama deste
> basılı bir iş, biz web yapıyoruz — oradaki çözümler sayfa çözümleri.
> Ödüllü site koleksiyonları da tarandı ve işe yaramadı; sebebi
> **bölüm 6**'nın sonundaki araştırma notunda.
>
> Okuma sırası: **bölüm 0** (ekran bütçesi — diğer bütün kararları yönetir),
> sonra **bölüm 6** (tasarım dağarcığı — sorun başına fikir), sonra gerisi.

---

## PROMPT BURADAN BAŞLIYOR — hepsini kopyala

Bir kurumsal web sitesinin **tasarım sistemini ve sayfa düzenlerini** sıfırdan
kuracaksın. İçerik yerine yer tutucu kullan; asıl iş görsel dil.

### Müşteri ve iş

**Afloday — Eğitim Gelişim Danışmanlık.** Kurumlara doğa temelli eğitim,
atölye ve etkinlik tasarlıyorlar: teraryum yapımı, kokedama, kuru çiçek
tasarımı, orman banyosu, sürdürülebilirlik atölyeleri. Müşterileri kurumsal
İK ve kurumsal iletişim yöneticileri. Türkiye, Türkçe site.

Ton: sıcak, canlı, profesyonel. Satış dili yok, em dash yok, çocuksu ton yok.

### Bu tasarımın çözmesi gereken problem

Sitenin önceki hâli reddedildi. Müşterinin kelimesi kelimesine eleştirisi:

> "Görseller altta word düzeni gibi olmuş, amatör duruyor."
> "Atölyeler çok yazı yazı kalmış."
> "Sayfalarda kayboldum."
> "Hepsini bir arada görebilir, tıklayınca içine girebiliriz."
> "Sayfa içlerinde görseller küçülüp yazılar büyüyebilir, orantılı olmaları."

Yani hedef: **bir Word dosyası değil, bir katalog.** Okuması akıcı, gezmesi
keyifli, her ekranı düşünülmüş.

---

## 0 · BİRİNCİ KISIT: EKRAN BÜTÇESİ

**Bu, tasarımın diğer bütün kararlarını yöneten kuraldır. Önce bunu oku,
sonra gerisini.**

Site şu anda reddedildi çünkü her şey aşağı doğru uzuyordu: bir kategori bir
ekran, beş kategori beş ekran, kullanıcı kaydıra kaydıra okumak zorunda
kalıyordu. Müşterinin sözü:

> "5 kategoriyse biz her bir EKRANA 1 kategoriyi sığdırıp kocaman yazı ve
> resim olarak sunmuşuz. Ama gerçek hayatta 5 kategori kadar aşağı kaydırıp
> kimse bakmaz. Gerekirse küçük olsun, 5'i tek ekrana sığsın."

### Kural

1. **Bir sayfa en fazla 3 ekran.** Anasayfa dahil. Dördüncü ekrana taşan
   sayfa tasarım hatasıdır, içerik fazlalığı değil.
2. **N tane şey varsa N'i de aynı anda görünecek.** 5 eğitim tek ekranda,
   7 etkinlik kategorisi tek ekranda, 7 kişilik ekip tek ekranda. Sırayla
   göstermek, hover'a saklamak, kaydırınca belirmek — hepsi bu kuralın
   ihlali.
3. **Sığmıyorsa küçült, uzatma.** Kare küçülür, punto düşer, metin kısalır
   ya da açılır kartın içine girer. Sayfa uzamaz.
4. **Detay yerinde açılır.** Bir öğenin ayrıntısı gerekiyorsa kart yerinde
   genişler, komşuları kaymaz, sayfa uzamaz. Yeni sayfaya gitmek son çare.

### Bütçe, piksel cinsinden

| Ekran | Kullanılabilir yükseklik | 3 ekranlık bütçe |
|---|---|---|
| 1097×600 (müşterinin ekranı, %175 zoom) | ~600px | **1800px** |
| 1440×900 | ~810px | 2430px |
| 1920×1080 | ~990px | 2970px |
| 390×844 telefon | ~760px | 2280px |

Tasarımı **1800px bütçesiyle** kur. Orada çalışıyorsa her yerde çalışır.

### Telefonda "hepsi bir arada" nasıl korunur

Beş kartı 390 piksele yan yana koyamazsın. Ama kuralı bozmadan çözülür:
**kare küçülür, sayısı azalmaz.** 2 sütunlu ızgarada 5 kart ~180×120
boyutunda tek ekrana sığar. Ekip 7 kişiyse 3 sütunda 96px dairelerle sığar.

Yatay kaydırmalı şerit (carousel) **son çare** — kullanıcı orada da ne kadar
şey olduğunu göremez. Önce küçültmeyi dene.

### Bu kuralın doğal sonuçları

- Kahraman bölümler (tam ekran dev başlık) **bir sayfada en fazla bir tane**,
  o da anasayfada. İç sayfalarda yarım ekran giriş yeter.
- Bölüm iç boşlukları cömert olamaz. `clamp(28px, 3vw, 48px)` üst sınır;
  `120px` boşluk bu bütçede lüks.
- Uzun metin bloğu ya kısalacak ya açılır karta girecek. Ekranda duran
  metin özet, ayrıntı tıklamayla gelir.
- Tipografi merdiveni geniş kalır ama **display punto sayfa başına bir kez**
  kullanılır. Her bölümde dev başlık olursa bütçe biter.

---

## 0b · DESTEYİ GEÇ — tasarımın iddiası

Destenin sistemi iyi ve müşterinin beğendiği dil o. Ama deste basılı bir
sunum; sen web yapıyorsun. Dört yerde onu geçeceksin.

**1 · Izgara içerikten beslensin, sabit olmasın.**
Destedeki kutu ızgarası eşit dikdörtgenler. Sen kutu boyutunu içerik
ağırlığından türet: ana atölye iki hücre, yan atölye bir hücre, fotoğraf
kendi oranınca. Hizalı satır matematiği bunu boşluk bırakmadan çözer.
Sonuç bir ızgara değil, bir kompozisyon.

**2 · Duotone her yerde değil, doğru yerde.**
Deste bütün fotoğrafları boyuyor. Aşırıya kaçarsa ucuzlar ve atölyenin
gerçek ürünü (teraryumun rengi, çiçeğin tonu) kaybolur. Kural:
kapak fotoğrafı tam duotone, ızgara fotoğrafı hafif renk yıkaması,
**ürünün kendisini gösteren fotoğraf boyanmaz.** Üzerine gelince boya
çekilir ve fotoğraf gerçek rengine döner. Bu küçük an sitenin en çok
hatırlanacak detayı olabilir.

**3 · Tipografi değişken eksenleri kullansın.**
Deste basılı olduğu için yazıyı tek boyutta dondurmuş. Sen `Fraunces`in
`opsz`, `SOFT` ve `WONK` eksenlerini gerçekten oynat: iri display'de
organik ve yumuşak, küçük metinde sakin ve düz. Aynı aile iki farklı iş
yapar ve sayfa tek yazıyla hem canlı hem okunur olur.
Bu, basılı işin yapamadığı bir incelik.

**4 · Durum ve etkileşim.**
Destede hover yok, odak yok, klavye yok, hareket yok. Her bileşenin dört
durumu tasarlanacak: dinlenme, üzerine gelme, odak, basılı. Odak halkası
sonradan eklenen bir erişilebilirlik yaması değil, tasarımın parçası olacak.

**Ölçüt:** biri siteyi ve desteyi yan yana koyduğunda "aynısını web'e
taşımışlar" değil, "bunu basılı yapamazdın" demeli.

---

## 1 · RENK MİMARİSİ — sistemin belkemiği

Site tek bir palet kullanmıyor. **Dört doğa elementi, dört renk ailesi.**
Bir bölüm hangi elemente aitse o rengin tonlarına bürünüyor: zemini, kutuları,
başlığı, hatta fotoğrafı.

| Element | Konu | Aile |
|---|---|---|
| **Toprak** | Çevre | yeşil |
| **Su** | Kadın | mavi |
| **Ateş** | Çocuk | turuncu |
| **Hava** | İş Hayatı | lacivert |

Her aile beş kademeli bir merdiven. Marka renkleri (turuncu `#F05625`,
yeşil `#428840`) logodan geliyor ve merdivenlerin 500 kademesinde duruyor.

```css
:root {
  /* TOPRAK — Çevre */
  --toprak-900: #1E4620;  --toprak-700: #2F6A2E;  --toprak-500: #428840;
  --toprak-300: #7FB03F;  --toprak-100: #C8DE8C;

  /* SU — Kadın */
  --su-900: #0B3A5C;      --su-700: #12648F;      --su-500: #1F8FBF;
  --su-300: #5FB8D8;      --su-100: #BEE3F0;

  /* ATEŞ — Çocuk */
  --ates-900: #8A2A0C;    --ates-700: #C6401A;    --ates-500: #F05625;
  --ates-300: #F58B54;    --ates-100: #FBD3BE;

  /* HAVA — İş Hayatı */
  --hava-900: #1B2470;    --hava-700: #2E3E9E;    --hava-500: #4557C8;
  --hava-300: #8290E0;    --hava-100: #D2D7F4;

  /* Nötrler */
  --kagit: #FFFFFF;  --krem: #F4F1E7;  --murekkep: #131A15;  --soluk: #5C6158;
}
```

**Bölüm rengi tek bir değişkenle geçer.** Her bölüm kabına `data-element`
koy, bileşenler `--e-900 … --e-100` üzerinden okusun:

```css
[data-element="toprak"] { --e-900: var(--toprak-900); --e-700: var(--toprak-700);
  --e-500: var(--toprak-500); --e-300: var(--toprak-300); --e-100: var(--toprak-100); }
/* su, ates, hava için aynısı */
```

Böylece tek bir bileşen dört renkte çalışıyor ve yeni element eklemek tek satır.

**Kontrast kuralları — pazarlık yok:**
- Açık zeminde metin: yalnız `700` ve `900`. `500` ve altı metin olarak
  kullanılamaz (turuncu `#F05625` krem üzerinde 2.84:1, WCAG'ı geçmiyor).
- Koyu zeminde metin: `100`, `300` ve beyaz.
- Odak halkası her zeminde 3:1 geçmeli.
- Küçük metin 4.5:1, iri metin 3.0:1. İstisna yok.

---

## 2 · TON MERDİVENİ — okumayı kolaylaştıran asıl numara

Destedeki en güçlü fikir bu ve kimse fark etmeden çalışıyor.

Bir metin sütununda paragraflar aşağı indikçe **rengin tonu açılıyor.**
Punto değişmiyor, ağırlık değişmiyor — yalnız doygunluk düşüyor. Göz ilk
paragrafı önce görüyor, sonrakiler sırayla soluyor. Hiyerarşi kuruluyor ama
sayfa hâlâ sakin.

```css
.merdiven > p:nth-child(1) { color: var(--e-900); }
.merdiven > p:nth-child(2) { color: var(--e-700); }
.merdiven > p:nth-child(3) { color: var(--e-500); }
.merdiven > p:nth-child(n+4) { color: var(--e-300); }
```

Dördüncü kademeden sonra durdur; daha açığı okunmaz olur ve kontrast düşer.
`500` ve `300` kademeleri yalnız **iri metinde** (18.66px+ kalın veya 24px+)
kullanılabilir; gövde metninde `900`/`700` ile sınırlı kal.

**Sayılar vurgulanır.** Metin içindeki yüzde ve rakamlar `<b>` ile bir kademe
koyulaşır. "%59'u", "%81'i" gibi veriler cümleden sıyrılır.

---

## 3 · TİPOGRAFİ

Site "cıvıl cıvıl, doğanın canlılığını hissettiren" olacak. Bu, yazı
seçiminin de kararı: ağırbaşlı gazete serifi burada soğuk kalır.

- **Display: `Fraunces`** (değişken, Google Fonts).
  Üç ekseni birden var ve üçü de bu iş için:
  `opsz` optik boyut, **`SOFT` yumuşaklık**, **`WONK` organik eğrilik**.
  `WONK` açıldığında harfler hafifçe "yamuluyor" — el yapımı, bitkisel bir
  his veriyor ama ciddiyetini kaybetmiyor. Doğa temalı bir marka için
  tasarlanmış gibi.
  Ayar: display'de `opsz 144, SOFT 60, WONK 1, wght 300-400`.

- **Metin: `Plus Jakarta Sans`** (değişken, Google Fonts).
  Yuvarlak terminaller, açık apertürler, x-yüksekliği yüksek. Küçük puntoda
  okunaklı, geniş harf aralığında büyük harf kullanıldığında ferah.
  Jost'tan daha sıcak; Jost geometrik ve mesafeli, bu değil.

**Türkçe kontrolü kurulumun ilk adımı:** `ğ Ğ ş Ş ı I İ ç Ç ö Ö ü Ü` altı
puntoda ve display puntosunda tek tek görülecek. Özellikle **noktasız ı ve
noktalı İ** — pek çok değişken yazı bunları eksik ya da hatalı taşıyor.
Sorun çıkarsa alternatifler: display için `Bricolage Grotesque` veya
`Instrument Serif`, metin için `Figtree` ya da `Onest`.

**Ağırlık kullanımı:** display ince (300), gövde normal (400), etiket ve
mikro metin orta (500-600). Kalın (700+) yalnız kutu içi başlıklarda.
İnce iri + orta küçük kontrastı sayfayı hem canlı hem sakin tutar.

**İki tonlu başlık — imza öğe.** Başlık iki satır, iki farklı ağırlık ve ton:

```
Çevre                              ← serif, 300 ağırlık, çok iri, --e-700
Doğadan Gelişim Etkinlikleri       ← serif, 300 ağırlık, %62 punto, --e-500
```

Tipografi merdiveni geniş olsun. Referans destede bir sayfada **12pt'den
112.5pt'ye** kadar dokuz kademe var. Timid olma — display gerçekten iri olacak.

```css
--t-display: clamp(3rem, 7.5vw, 8rem);     /* element adı */
--t-baslik:  clamp(2rem, 4.2vw, 4rem);
--t-alt:     clamp(1.25rem, 2.4vw, 2.4rem);
--t-govde:   clamp(0.9375rem, 1.05vw, 1.0625rem);
--t-eyebrow: clamp(0.6875rem, 0.85vw, 0.8125rem);
```

**Eyebrow:** büyük harf, `0.14em` harf aralığı, 600 ağırlık, `--e-700`.
Her bölümün üstünde durur ve nerede olduğunu söyler.

---

## 4 · FOTOĞRAF — sisteme boyanarak katılır

Bu, tasarımın en kritik kararı. Afloday'in arşivi karışık: kimi dikey, kimi
yatay, kimi kare, farklı ışık, farklı yıl. Olduğu gibi yan yana konunca
dağınık duruyor.

**Çözüm: duotone.** Her fotoğraf ait olduğu elementin rengine boyanıyor.
Dört farklı fotoğraf aynı bölümde bir aile hâline geliyor.

```css
.duo {
  position: relative;
  filter: grayscale(1) contrast(1.08);
}
.duo::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(160deg, var(--e-900), var(--e-500));
  mix-blend-mode: color;      /* renk taşır, aydınlık değerini korur */
}
```

Kapak fotoğraflarında karışım biraz güçlü (`opacity: .82`), ızgara içindeki
küçük karelerde daha hafif (`opacity: .45`) olsun ki detay kaybolmasın.

**Kırpma kuralı — ihlal edilemez.** Çerçevenin oranı fotoğrafın oranına eşit
olacak, tersi değil. Sabit çerçeveye fotoğraf sokma. İki teknik:

1. **Hizalı satır:** satıra `aspect-ratio: Σ(oranlar)`, her kareye
   `flex: <kendi oranı> 1 0`. Satır yüksekliği eşit, kırpma sıfır, satır sonu
   düz. (Bu matematik doğrulanmıştır: kare genişliği S·oran/Σ, yükseklik S/Σ,
   bölünce karenin oranı kendi oranına eşit çıkar.)
2. **Kendi oranı:** kareye `aspect-ratio: var(--oran)` ver, `--oran` görselin
   gerçek en/boy oranı olsun. Izgarada `align-items: start` şart, yoksa kısa
   hücre satır yüksekliğine gerilir ve oran bozulur.

Fotoğrafın gerçek ölçüleri bir manifestoda tutulacak ve `--oran` oradan
gelecek. Tahminle çerçeve kurma.

---

## 5 · KUTU IZGARASI — atölye ve kategori listelerinin biçimi

Destedeki en karakteristik bileşen. Liste değil, **dolu renk kutularından
oluşan bir ızgara** ve her kutu elementin başka bir tonunda. Izgara boyunca
koyudan açığa bir akış oluşuyor.

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 900      │ 700      │ 700      │ 500      │ 300      │
│ Atölye   │ Atölye   │ Atölye   │ Atölye   │ Atölye   │
│ adı      │ adı      │ adı      │ adı      │ adı      │
│ ⏱ 🧑 📋  │ ⏱ 🧑 📋  │ ⏱ 🧑 📋  │ ⏱ 🧑 📋  │ ⏱ 🧑 📋  │
├──────────┼──────────┼──────────┼──────────┼──────────┤
│ 700      │ 500      │ 500      │ 300      │▓▓ FOTO ▓▓│
└──────────┴──────────┴──────────┴──────────┴──────────┘
```

Kurallar:

- Kutular **uç uca**, aralarında boşluk yok. Ayırma işini 1px saç teli çizgi
  yapar. (Boşluk eklersen hizalı satır oranı bozulur.)
- Ton dağılımı ızgara boyunca akar; rastgele değil, kademeli.
- Her kutuda: atölye adı (sans, 600), altında **mikro etiket satırı** —
  ikon + tek kelime (`Yüz Yüze / Online`, `60 Dakika`, `25-100 Kişi`,
  `Seminer / Deneyim`). Bu satır kutuya bilgi yoğunluğu katıyor ve
  "sadece başlık" hissini kırıyor.
- **Fotoğraf ızgaranın bir hücresi.** Kutuların biri onun yerine geçer, aynı
  boyutta, duotone boyalı. Fotoğraf kahraman değil, sistemin vatandaşı.
- Üzerine gelince kutu bir kademe koyulaşır ve mikro etiketler belirir.

---

## 6 · TASARIM DAĞARCIĞI — sorun başına fikir

Bu bölüm ölçü listesi değil, **fikir listesi**. Her madde bir sorunla
başlıyor, sonra o sorunu çözen tasarım fikrini anlatıyor, en sonda
mekaniği veriyor. Ölçüyü fikirden önce okuma.

**Kaynak uyarısı:** müşterinin sunum destesi bir referans **değil**.
Deste basılı bir iş; oradaki çözümler sayfa çözümleri. Biz web yapıyoruz
ve web'in basılıda karşılığı olmayan araçları var: durum, zaman, imleç,
kaydırma konumu, değişken yazı ekseni, canlı kırpma. Fikirler oradan
gelecek. Ölçüt basit — **bir fikir slayda da konabiliyorsa yeterince
iyi değildir.**

---

### P1 · Yedi kategoriyi tek ekranda, fotoğraflı ve kırpmasız göstermek

**Fikir: yaşayan mozaik.**
Yedi kare bir kompozisyon kuruyor: hepsi aynı anda görünüyor, hiçbiri
kırpılmıyor, aralarında boşluk yok. Ama ölü bir ızgara değil — imleç bir
kareye yaklaştıkça o kare **komşularından yer alarak** genişliyor,
komşular sıkışıyor. Elini çektiğinde kompozisyon yerine oturuyor.
Kullanıcı hiçbir şey kaybetmiyor; sadece baktığı şey büyüyor.

Bu, basılıda imkânsız: kâğıtta kompozisyon dondurulmuş, burada nefes alıyor.

*Mekanik:* hizalı satır matematiği (`aspect-ratio: Σoran`, kare başına
`flex: oran 1 0`) + imleç yakınlığına göre `flex-grow` değişimi.
Genişleme %25'i geçmesin, komşular okunur kalsın. 250ms, `ease-out`.
Klavyede aynı davranış odakla tetiklenir.

*Risk:* aşırıya kaçarsa oyuncak gibi durur. Tek kare büyür, zincir olmaz.

---

### P2 · Beş eğitimi tek ekranda göstermek, detayı da vermek

**Fikir: yerinde açılan katman.**
Beş eğitim beş kart hâlinde yan yana duruyor. Bir kartı açtığında kart
**bulunduğu yerde** derinleşiyor: komşuları itmiyor, sayfa uzamıyor,
diğerleri hafifçe geri çekiliyor ve odaktaki öne geliyor. Kapattığında
her şey yerine dönüyor.

Kritik fark: klasik akordeon sayfayı uzatır ve alttakileri ekrandan atar.
Bu, uzatmıyor — derinlik ekseninde açılıyor, dikey eksende değil.

*Mekanik:* ızgara hücresi `grid-template-rows: 0fr → 1fr` ile açılır
(`max-height` tahmini kullanma, uzun metinde kırpar). Açılan kart
`z-index` alır ve hafif gölge kazanır; kapalılar `opacity: .72`,
`scale(.98)`. Tek seferde bir kart açık. `Esc` kapatır.

*Risk:* açılan kart ekrandan taşarsa fikir çöker. Açık yükseklik
tasarlanacak, içeriğe bırakılmayacak: iki paragraf sığar, üçüncüsü
"devamı" bağlantısına gider.

---

### P3 · On iki atölyeyi tek ekranda göstermek

**Fikir: çeşit tablası.**
Bir tohum kataloğunun ya da bir bitki koleksiyonunun tablası gibi:
küçük, eşit, sık dizilmiş hücreler. Her hücrede atölyenin adı ve iki
mikro etiket. Yoğunluk burada bir kusur değil, karakter — bakan kişi
"çok şey var" diye düşünmeli, "çok yazı var" diye değil.

Hücreler tek renk değil: bölümün renk merdiveni tabla boyunca akıyor,
sol üstte koyu, sağ altta açık. Renk sırayı ve bütünlüğü aynı anda
anlatıyor.

**Ayırt edici hamle:** imleç bir hücrenin üzerine geldiğinde hücre
kendi rengini komşularına **yayıyor** — yakın hücreler onun tonuna
bir kademe kayıyor. Tabla canlı bir organizma gibi tepki veriyor.
Basılıda karşılığı yok.

*Mekanik:* `grid-template-columns: repeat(auto-fill, minmax(150px, 1fr))`,
`gap: 1px` ve zemin rengi çizgi görevi görür. Renk yayılımı imleç
konumundan uzaklığa göre `--yakinlik` değişkeniyle hesaplanır.

*Risk:* 12 hücre × 3 satır metin = duvar. Hücrede yalnız ad + iki etiket
olacak; açıklama tıklamayla gelir (P2'deki katman).

---

### P4 · Yedi kişilik ekibi tek ekranda göstermek

**Fikir: herbaryum levhası.**
Bu markanın işi bitki. Ekip sayfası da bir **kurutulmuş bitki koleksiyonu
levhası** gibi kurulacak: her kişi bir örnek kartı. Küçük portre, altında
adı, altında görevi — bir herbaryum etiketinin düzeninde. Kartın kenarında
ince bir çizim: o kişiye atanmış bir yaprak, tohum ya da dal silueti.

Portrenin kalitesi önemsiz hâle geliyor çünkü portre kahraman değil,
**örnek**. Müşterinin sözü zaten buydu: "vesikalık gibi görsel bile olur."

Kişiye tıklandığında levha **çevriliyor** ve arkasında özgeçmiş çıkıyor —
tıpkı bir örnek kartının arkasındaki not gibi. Izgara yerinde kalıyor.

Bu fikir konuya ait. Genel bir "ekip ızgarası" değil, bu markanın işinden
türemiş bir metafor. Ayırt edici olan da bu.

*Mekanik:* 3D çevirme (`transform-style: preserve-3d`, `rotateY`), 420ms.
`prefers-reduced-motion`'da çevirme yerine çapraz geçiş. Klavyeyle
gezilebilir, `Esc` kapatır, odak geri döner.

*Risk:* 3D çevirme ucuz durabilir. Kurtaran şey detay: kâğıt dokusu,
ince çizim, gerçek herbaryum etiketi tipografisi (küçük, harf aralıklı,
tek sütun). Detay yoksa fikri kullanma.

---

### P5 · Yoğun metni tek ekranda okunur kılmak

**Fikir: metnin içinden geçen bitki.**
Metin bir dikdörtgen bloğu doldurmuyor; **organik bir siluetin etrafından
akıyor.** Bir yaprak, bir dal ya da bir kök çizimi sütunun içine giriyor
ve satırlar onun kenarına uyarak kırılıyor.

Bu, web'de neredeyse hiç kullanılmayan gerçek bir CSS özelliği
(`shape-outside`) ve tam olarak bu markaya ait: doğa metnin etrafında
süs değil, metnin biçimini belirleyen şey.

Buna ton merdiveni eşlik ediyor: ilk paragraf koyu ve güçlü, sonrakiler
sırayla açılıyor. Punto sabit, doygunluk düşüyor. Göz nereden başlayacağını
biliyor, metin bir duvar olmaktan çıkıyor.

*Mekanik:* `shape-outside: url(yaprak.svg)` + `float`. Yedek olarak
`shape-outside: ellipse()`. Telefonda kapanır, metin tek sütuna iner.
Ölçü `62ch`'i geçmez.

*Risk:* silueti karmaşık yaparsan satır sonları çirkinleşir. Sade,
geniş, tek parça siluet kullan.

---

### P6 · Dört elementi anlatmak

**Fikir: dört mevsimlik tek ekran.**
Dört element ekranı dörde bölüyor ve **dördü de aynı anda duruyor.**
Sıra yok, kaydırma yok. Her dilim kendi renginde, kendi fotoğrafında,
kendi adında.

Bir dilime yaklaştığında o dilim genişliyor ve içindeki içerik açılıyor;
diğerleri daralıyor ama **yok olmuyor** — adları hep okunur kalıyor.
Kullanıcı dördünün de orada olduğunu hiç unutmuyor.

*Mekanik:* `flex` konteyner, dilim `flex: 1`, aktif `flex: 2.4`, geçiş
600ms `cubic-bezier(.2,.8,.2,1)`. Daralan dilimde başlık dikey yazıya
döner (`writing-mode`), okunurluğunu kaybetmez. Telefonda dört dilim
alt alta, her biri açılır kart.

*Risk:* bu desen hazır bileşen olarak çok dolaşıyor ve jenerik durabilir.
Ayırt edici hâle getiren şey: dilimler arasındaki sınırın düz çizgi
olmaması. Sınır **organik bir kenar** olacak — yaprak damarı gibi hafif
eğrilen bir SVG maskesi. Düz çizgi kullanırsan bu fikri kullanma.

---

### P7 · Anasayfayı üç ekranda anlatmak

**Fikir: büyüyen çizgi.**
Sayfa boyunca ince bir **bitki gövdesi** çiziliyor; kaydırdıkça büyüyor,
dallanıyor ve her dal bir bölüme bağlanıyor. Üç ekran boyunca tek bir
canlı hat.

Bu, sitenin imzası. Basılıda gövde donuk bir illüstrasyon; burada
kullanıcının kaydırmasıyla **büyüyen** bir şey. "Doğadan gelişim"
kavramının kendisi görselleşiyor: sayfa ilerledikçe bitki gelişiyor.

*Mekanik:* tek bir SVG `path`, `stroke-dasharray` + `stroke-dashoffset`
scroll-driven animation ile sürülür (`animation-timeline: view()`).
JavaScript gerekmez. `prefers-reduced-motion`'da gövde tam çizili durur.

*Risk:* gövde içeriğin okunmasına karışmamalı. İnce, soluk, kenarda.
Kahraman o değil, iplik o.

---

### P8 · "Cıvıl cıvıl doğa" hissini gerçekten vermek

Renk paleti tek başına bunu vermiyor. Üç davranış veriyor:

**1 · Yazı canlı.**
`Fraunces`in `WONK` ve `SOFT` eksenleri sabit değil. Başlık ekrana
girerken `WONK 0 → 1` ve `SOFT 0 → 60` arasında yerleşiyor: harfler
hafifçe kıpırdayıp organik hâllerine oturuyor. Bir saniye sürmez,
fark edilmez ama hissedilir. Değişken yazı ekseni animasyonu web'e özgü
ve neredeyse hiç kullanılmıyor.

**2 · Renk gerçek fotoğraftan geliyor.**
Bölümün vurgu tonu, o bölümün fotoğrafından örneklenmiş olabilir —
teraryumun yeşili, kuru çiçeğin turuncusu. Sayfa fotoğrafla aynı
nefesi alıyor. (Derleme anında baskın renk çıkarılır, CSS değişkenine
yazılır. Çalışma anında hesaplama yok.)

**3 · Küçük yaşam belirtileri.**
Kenarlarda birkaç yaprak silueti çok yavaş salınıyor — 20 saniyelik
döngü, 2-3 derecelik dönüş. Bakınca fark edilmiyor, ama sayfa ölü
durmuyor. `prefers-reduced-motion`'da durur.

**Yapma:** parçacık efekti, düşen yapraklar, imleç takip eden ışık.
Bunlar canlılık değil, gürültü.

---

### P9 · Gezinmeyi bir öğe hâline getirmek

**Fikir: menü bir sayfa değil, bir kesit.**
Açılan menü ekranı kaplayan bir afiş olmayacak (müşteri zaten
"başlıklar çok büyük" dedi). Bunun yerine menü **üstten inen ince bir
kesit** olacak: maddeler tek satırda, her maddenin yanında o bölümün
renginden küçük bir işaret. Menü açıkken sayfa görünmeye devam ediyor.

*Risk:* sıradan durabilir. Ayırt edici olan: maddenin üzerine gelince
o bölümün rengi menünün zemininde bir sızıntı gibi beliriyor. Küçük
ama sitenin renk sistemini menüde de hissettiriyor.

---

### DAĞARCIĞIN KULLANIMI

- Her fikri her sayfada kullanma. Bir sayfada **en fazla iki** güçlü fikir
  olsun; gerisi sakin dursun. Chanel kuralı: evden çıkmadan aynaya bak ve
  bir aksesuarı çıkar.
- Bir fikri kullanamıyorsan (risk maddesindeki koşulu sağlayamıyorsan)
  **kullanma.** Yarım uygulanmış iyi fikir, iyi uygulanmış sıradan
  fikirden kötüdür.
- Yeni fikir ekleyebilirsin. Ölçüt: slayda konabiliyorsa yeterince iyi
  değil.

### REFERANS SİTE İNCELEMESİ — neyi al, neyi alma

Müşteri bir referans verdi: `naya-studio-dubai.webflow.io` (Cube Studio
şablonu). Playwright ile sökülüp incelendi. Sonuç ikiye ayrılıyor ve
ayrımı bilmeden kullanmak tasarımı bozar.

**Ölçülen teknik yığın:** GSAP + ScrollTrigger, Lenis (yumuşak kaydırma),
Webflow, jQuery. WebGL yok — bütün etki CSS `transform` ve kaydırmaya
bağlı zamanlama ile kuruluyor. Yani tekniğin hiçbiri erişilemez değil.

**ÖLÇÜLEN KRİTİK SAYI: sayfa 20.8 ekran.**

Bu, bizim bütçemizin yedi katı. Ve tesadüf değil — o sitenin bütün
mekaniği **yavaş açığa çıkarma** üzerine kurulu. Kart destesi aynı anda
bir kart gösteriyor, gerisi altta saklı; her kart için bir ekran kaydırma
harcanıyor. Ceylan hanımın istediği tam tersi: hepsi aynı anda, üç ekranda.

**Bu yüzden desteyi olduğu gibi alamayız. Ama tekniği alabiliriz.**

| Referanstaki | Olduğu gibi alınır mı | Bizde nasıl kullanılır |
|---|---|---|
| Kaydırınca yanlardan gelen kartlar | ✅ evet | **Giriş animasyonu olarak.** Kartlar sağdan/soldan gelip yerine oturur ve KALIR. Kaydırma ilerledikçe geri gitmez. Bir kez gelir, hepsi görünür durur. |
| Üst üste yığılmış dönen kart destesi | ❌ hayır | Deste aynı anda bir kart gösteriyor — "hepsi bir arada" kuralının ihlali. **Yerine: destenin açılması.** Kartlar önce yığın hâlinde gelir, sonra tek harekette **yelpaze gibi açılıp** ızgaraya oturur. Deste metaforu kalır, saklama gider. |
| Yumuşak kaydırma (Lenis) | ⚠️ dikkatli | Hissi iyi ama kaydırmayı ele geçiriyor ve erişilebilirlikte sorun çıkarabiliyor. Kullanılacaksa çok hafif ayarlanacak ve `prefers-reduced-motion`'da tamamen kapanacak. |
| Sticky + kaydırmaya bağlı sahne | ⚠️ sayfada bir kez | Ekran bütçesini en hızlı yiyen şey bu: bir sahne için 3-4 ekran kaydırma harcanıyor. **Yalnız anasayfa açılışında, tek yerde.** |
| Dev ince display tipografi | ✅ evet | Bizde de display iri ve ince olacak. Ama onlarınki koyu lacivert üzerine beyaz; bizimki cıvıl cıvıl yeşil. Renk hariç aynı cesaret. |
| Karanlık sinematik palet, ses aç/kapa, imleç efekti | ❌ hayır | O bir stüdyo vitrini; bizimki bilgi taşıyan kurumsal site. Ses ve karanlık atmosfer bizim işimizi zorlaştırır. |

**Çıkarılacak asıl ders:** o sitenin etkileyici olmasının sebebi kaydırma
efektleri değil, **her ekranın tek bir şeye adanmış olması ve o şeyin
kusursuz yerleştirilmiş olması.** Biz aynı özeni üç ekrana sığdıracağız —
zor olan da bu.

---

### ÖDÜLLÜ SİTELER HAKKINDA — araştırma notu

Awwwards ve benzeri koleksiyonlar tarandı. Sonuç şaşırtıcı ve işe yarar:
**"ödüllü" olan bize uymuyor**, çünkü kanon iki uçta toplanmış ve ikisi de
bizim sorunumuzu çözmüyor.

**Uç 1 — deneysel portfolyo.** Kazananların çoğu kişisel portfolyo ya da
ajans vitrini: giriş ekranı, ses açma daveti, WebGL sahnesi, imleç efekti.
Bakması etkileyici, bilgi taşımıyor. Bizim kullanıcımız bir İK yöneticisi
ve %175 yakınlaştırmayla bilgi arıyor. Bu uçtan alınacak tek şey cesaret,
tekniği değil.

**Uç 2 — kurumsal rapor.** Ödül adayı sürdürülebilirlik raporları temiz ama
sıradan: üstte ikincil menü çubuğu, altında üç beyaz kart, kartlarda başlık
ve iki cümle. Güvenli, unutulur. Reddedilen tasarımımızın daha düzenli hâli.

**Boşluk ikisinin arasında ve hedefimiz orası:** yoğun bilgi taşıyan ama
sıradan olmayan. Seyrek olmasının sebebi zor olması. Bir işin bu boşlukta
durduğunu şuradan anlarsın: ekranda çok şey var ama göz nereye bakacağını
biliyor, ve düzen o içeriğe özgü — başka bir siteye kopyalanamaz.

**Yani kopyalanacak bir site arama.** Yukarıdaki dokuz sorunu çöz; çözümler
bu markanın işinden (botanik, büyüme, koleksiyon, mevsim) türesin.
Ayırt edici olan teknik değil, metaforun konuya ait olması.

### ÖNCE ARAŞTIR

Kod yazmadan önce şu teknikleri gerçek örnekleriyle incele ve nasıl
kurulduklarını öğren:

`shape-outside` ile organik metin akışı · scroll-driven animations
(`animation-timeline: view()` ve `scroll()`) · değişken yazı ekseni
animasyonu · `View Transitions API` ile sayfa geçişi · hizalı satır
(justified) galeri matematiği · bento ızgara hiyerarşisi ·
CSS `@property` ile animasyonlanabilir özel değerler ·
`color-mix()` ve `oklch()` ile ton merdiveni üretimi

Bunların hepsi bugünün tarayıcısında çalışıyor ve hiçbiri kütüphane
istemiyor. Öğrenmeden kullanma; yarım bilinen teknik yarım tasarım üretir.

---

## 6b · SAYFA ENVANTERİ — hangi arketip nerede

Site 31 sayfa. Arketipleri bu haritaya göre kullan; her sayfa için yeni
düzen icat etme.

| # | Sayfa grubu | Adet | Arketipler |
|---|---|---|---|
| 1 | Anasayfa | 1 | A → D → E → C → F |
| 2 | Element / hareket sayfası | 1 | A → B → kutu ızgarası (× 4 element) → F |
| 3 | Liste-index (eğitimler, etkinlikler) | 2 | G → D → B → F |
| 4 | Kurumsal anlatı (hakkımızda, kurumsal, sürdürülebilirlik, sosyal sorumluluk) | 4 | G → C → E → D → F |
| 5 | **Etkinlik kategori detayı** | **7** | G → **H** → D → F |
| 6 | **Eğitim detayı** | **5** | G → **H** → E → F |
| 7 | **Kişi sayfaları** | **7** | **I** (ızgara + panel; ayrı sayfa olmayabilir) |
| 8 | Proje / vaka | 1 | G → **J** → F |
| 9 | İletişim | 1 | **K** |
| 10 | İK | 1 | **L** |
| 11 | Uzun metin (KVKK, çerez) | 2 | **M** |
| 12 | 404 | 1 | **N** |

Kalabalık kümeler 5, 6 ve 7 — yani **19 sayfa üç arketipten üretiliyor.**
Tasarım eforunu oraya ver; anasayfa güzel olup kategori sayfaları çirkin
kalırsa site çirkindir.

---

## 6c · HER SAYFADA OLAN — mobilya

Sayfa değil ama her sayfada var ve müşterinin üç maddesi tam burada.

**Menü.** Müşterinin sözü: "açılan ana menüde başlıklar çok büyük."
Açılır menü bir afiş değil, bir gezinme aracı. Maddeler gövde metninden
bir kademe iri olsun, display puntoda değil. Menü açıkken hangi bölümde
olduğun renkle belli olsun — aktif maddenin altında elementinin renginde
ince bir çizgi.

**Footer.** Müşterinin talimatı net:
- "Bir tık yakındayız" bloğu **kalkacak**
- Düğmeler **kalkacak**
- İletişim formu **kalkacak** (formun yeri iletişim sayfası)
- Kalacaklar: **iletişim bilgileri, yol tarifi, takip (sosyal), İnsan Kaynakları**

Yani footer bir kapanış afişi değil, bir künye. Sade, tek satırlık bir
bilgi bandı gibi kur.

**Yönelim — "sayfalarda kayboldum" maddesi.**
Bu maddenin asıl çözümü ekran bütçesi: 3 ekranlık bir sayfada kaybolmak
zor. Uzun sayfa olmayınca yönelim sorununun yarısı kendiliğinden gidiyor.
Kalan yarısı iki küçük araçla kapanır:

1. **Sayfa başı bağlamı.** Her iç sayfanın en üstünde hangi kümeye ait
   olduğunu söyleyen bir eyebrow satırı — `KURUMSAL HİZMETLER /
   ETKİNLİK ATÖLYELERİ` gibi. Breadcrumb'ın sessiz hâli.
2. **Bölüm rengi.** Sayfa hangi elemente aitse vurgu rengi odur ve sayfa
   boyunca sabit kalır. Renk "hangi bölümdeyim" sorusunu metinden önce
   cevaplar. Kaydırdıkça renk değiştiren bir sayfa istemiyoruz — renk
   sayfanın kimliği, kaydırmanın efekti değil.

Sağ kenarda bölüm göstergesi, ilerleme çubuğu gibi araçlara **gerek yok**;
onlar uzun sayfaların yamasıdır ve bizde uzun sayfa olmayacak.

**Sayfa geçişi.** İç sayfalar arasında geçerken View Transitions API ile
element rengi ve başlık taşınsın. Kullanıcı sayfa değiştirdiğini değil,
aynı sistemin içinde ilerlediğini hissetmeli.

---

## 7 · RESPONSIVE — burada ödün yok

Bu sitenin izleyicisi tek bir ekran değil. Hepsinde profesyonel görünecek.

| Kademe | Genişlik | Kutu ızgarası | Notlar |
|---|---|---|---|
| Telefon | 360–479 | 1 sütun | Kapak yüksekliği `100svh`, `100vh` değil |
| Büyük telefon | 480–767 | 2 sütun | |
| Tablet | 768–1023 | 3 sütun | Yatay tablette 4'e çık |
| **Küçük dizüstü** | **1024–1279** | **4 sütun** | **En kritik kademe, aşağıya bak** |
| Dizüstü | 1280–1679 | 5 sütun | |
| Masaüstü | 1680–2559 | 5-6 sütun | İçerik 1680'de duruyor, zemin tam kanıyor |
| 2K+ | 2560+ | 6 sütun | Tipografi büyümüyor, boşluk büyüyor |

**Kritik kademe hakkında.** Müşterinin ekranı 1920×1200 ve tarayıcısı **%175
yakınlaştırma** kullanıyor. Bu, CSS piksel cinsinden **1097×686** demek;
tarayıcı çubukları düşünce kullanılabilir alan **1097×600**. Yani "masaüstü"
sandığın kullanıcı aslında küçük dizüstü genişliğinde. Tasarımı 1440'a göre
kurup küçültme — 1097×600'de baştan dene, sonra yukarı doğru aç.

Test edilecek genişlikler: **360 · 480 · 768 · 1024 · 1097 · 1280 · 1440 ·
1920 · 2560**. Hiçbirinde yatay kaydırma çubuğu çıkmayacak.

**Izgara tipi ayrımı — sık yapılan hata.** İki tür ızgara var:
*satır* tipi (ilk sütun `auto` veya küçük sabit: işaretçi/küçük resim + metin)
ve *sütun* tipi (iki üç dolu içerik sütunu). Telefonda **yalnız sütun tipi**
tek sütuna iner. Satır tipini indirirsen küçük resim devleşir ve etiket
çıplak metne düşer.

---

## 8 · HAREKET

Hareket dekorasyon değil, yönelim aracı. Müşterinin şikâyeti "sayfalarda
kayboldum" — hareket nerede olduğunu söylemeli.

- **Bölüm rengi geçişi.** Bir elementten diğerine kayarken sayfanın vurgu
  rengi yumuşakça değişiyor. `--e-*` değişkenleri `@property` ile tanımlanır
  ve geçiş yapabilir hâle gelir. Sitenin imza hareketi bu olsun.
- **Kutu ızgarası kademeli beliriyor.** `IntersectionObserver`, karo başına
  40ms gecikme. Yüzde eşiği KULLANMA (`threshold: 0.12` gibi) — ekrandan uzun
  bölümlerde hiç tetiklenmez. `threshold: 0` + `rootMargin` kullan.
- **Duotone açılışı.** Kapak fotoğrafı görünür olunca renk katmanı
  `opacity 0 → .82`, 900ms.
- **İri başlık satır satır giriyor**, 60ms arayla, `translateY(0.4em)` +
  `opacity`.
- **Kutu üzerine gelince** bir kademe koyulaşıyor, mikro etiketler beliriyor,
  fotoğraf hücresi `scale(1.04)`.
- `prefers-reduced-motion: reduce` her şeyi kapatır. Bu bir kontrol kutusu
  değil, gerçekten test et.

Kaydırma kaçırma (scroll hijacking) **yok**. Kullanıcı kaydırmayı kontrol eder.

---

## 9 · TEKNİK

- **Next.js (App Router) + TypeScript.** Statik dışa aktarım (`output: 'export'`)
  ile başla; sunucu gerektiren bir şey yok.
- **Tailwind kullanma.** Tasarım sistemi CSS değişkenleri + el yazımı CSS
  olacak. Sebep: bu sistemin özü renk merdivenleri ve `--e-*` devri; utility
  sınıflarıyla anlatmak hem uzun hem okunmaz oluyor.
- **Bağımlılık az.** Animasyon için kütüphane şart değil: `IntersectionObserver`,
  CSS `@property`, scroll-driven animations ve View Transitions API modern
  tarayıcıda yeter.
- **Fontlar:** Newsreader + Jost. `next/font` ile yerel servis et, CDN'e bağlama.
- **Görseller:** WebP + JPG yedek, `srcset` ile 800w ve 1600w. Her `<img>`
  `width`/`height` taşıyacak (düzen kayması yok).
- Erişilebilirlik taban çizgisi: klavyeyle gezilebilir, görünür odak halkası,
  `prefers-reduced-motion`, 24×24'ten küçük dokunma hedefi yok, tüm metin
  WCAG AA.

---

## 10 · GÖRSELLER

Gerçek fotoğraf arşivi sende yok. Yer tutucu kullan ama **gerçek oranlarla**:
arşiv 0.75 (dikey), 1.0 (kare), 1.33, 1.5 ve 1.78 (yatay) oranlarını
karışık içeriyor. Yer tutucuları da bu oranlarda üret ki hizalı satır
matematiğinin gerçekten çalıştığını görebilelim.

Konular: atölye masası ve eller, teraryum kavanozları, kuru çiçek, orman,
grup fotoğrafları, çocuk atölyeleri, kurumsal etkinlik salonları.

---

## 11 · YAPMA — bunların hepsi bizzat yaşandı

- **Sayfayı uzatmak.** Sığmayan içeriği aşağı akıtmak en büyük hata.
  Küçült, kısalt, açılır karta koy — ama uzatma. Dört ekranı geçen sayfa
  reddedilir.
- **Her bölüme dev başlık koymak.** Display punto sayfa başına bir kez.
  Beş bölüm beş dev başlık demek beş ekran demek.
- **Bir kategoriye bir ekran vermek.** Beş kategori beş ekran değil, bir
  ekran. Bu, reddedilen tasarımın birinci hatasıydı.
- **Word düzeni.** Sağda görsel, ortada yazı, altta görsel yığını. Reddedilen
  tasarım tam olarak buydu.
- **Sabit çerçeveye fotoğraf sokmak.** Geniş bant (2.94:1) ile normal oranlı
  fotoğraf (1.4:1) uzlaşmaz: fotoğrafın %52'si gider. Ölçüldü.
- **Her kategoriye bir ekran vermek.** Beş kategori beş ekran değil, bir ekran.
- **Koyu ağır palet.** Doğa capcanlı; site de öyle olacak.
- **Aynı anda tek fotoğraf gösterip kalanını hover'a saklamak.** Müşteri
  "hepsini bir arada görebilir" dedi; gizlemek bu maddeyi ihlal eder.
- **Turuncuyu metin rengi yapmak.** Krem üzerinde 2.84:1.
- **Sabit yükseklik + `overflow: hidden` kabı.** Bir kere 7 kategoriden beşini
  görünmez yaptı.
- **Yüzde eşikli `IntersectionObserver`.** Uzun bölümlerde hiç tetiklenmez.

---

## 12 · TESLİM

1. **Tasarım sistemi sayfası** (`/sistem`): renk merdivenleri, tipografi
   ölçeği, ton merdiveni örneği, kutu ızgarası, duotone örneği, hareket
   örnekleri — hepsi tek sayfada görülebilir.
2. **Altı örnek sayfa.** Üç tane değil altı — çünkü sitenin 31 sayfasının
   19'u aşağıdaki 5, 6 ve 7 numaralı gruplardan geliyor. Anasayfa güzel
   olup kategori sayfası çirkin kalırsa site çirkindir.
   - Anasayfa (A → D → E → C → F)
   - Element sayfası (A → B → kutu ızgarası, dört element)
   - **Etkinlik kategori detayı (G → H → D)** — en kalabalık küme, 7 sayfa
   - **Eğitim detayı (G → H → E)** — 5 sayfa
   - **Ekip (I)** — küçük portre ızgarası + açılır panel
   - İletişim (K)
3. **Mobilya ayrıca teslim edilecek:** menü (kapalı + açık), footer,
   bölüm göstergesi, sayfa geçişi.
4. Her sayfa **9 genişlikte** ekran görüntüsüyle birlikte teslim edilecek:
   360 · 480 · 768 · 1024 · 1097 · 1280 · 1440 · 1920 · 2560.
5. **Ekran bütçesi raporu.** Her sayfa için, her genişlikte:
   toplam sayfa yüksekliği ÷ ekran yüksekliği. Hiçbiri **3.0'ı geçmeyecek**.
   Geçen sayfa teslim edilmiş sayılmaz.
6. **"Hepsi bir arada" kanıtı.** Çoklu öğe taşıyan her bölüm için: kaç öğe
   var, kaçı ilk bakışta görünüyor. İkisi eşit olacak.
7. Kısa bir `TASARIM.md`: hangi kararı neden verdin.

Önce sistemi kur, sonra sayfaları ondan üret. Sayfadan sisteme gitme.

**Sıra önerisi:** sistem sayfası → etkinlik kategori detayı → ekip →
anasayfa. En zor ve en kalabalık olanı önce çöz; anasayfa zaten sistem
oturunca kolay. Ters sırada gidersen anasayfa için kurduğun düzen 19
sayfada tutmaz ve baştan başlarsın.

## PROMPT BURADA BİTİYOR

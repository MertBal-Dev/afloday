# Palet ve tasarım kararlarının gerekçesi

> Bu metinler `site/assets/css/afloday.css` içinde yorum olarak duruyordu.
> 7 Ağustos 2026'da buraya taşındı: CSS'te kural kalsın, gerekçe burada dursun.
> Kararların kendisi değişmedi.

---

## TİPOGRAFİ ÖLÇEĞİ — 5 Ağustos geri bildirimi

```
TİPOGRAFİ ÖLÇEĞİ — 5 Ağustos geri bildirimi
   ──────────────────────────────────────────────────────────────────────────
   Ceylan hanım iki ayrı şey söyledi, ikisi de aynı sorunun yüzü:

     "İlk bakışta çok büyük büyük geldi, sayfalarda boşluklar da çok."
     "Sayfa içlerinde görseller küçülüp yazılar büyüyebilir, en doğrusu
      orantılı olmaları olur aslında."
     "Açılan ana menüde başlıklar çok büyük."

   Ölçülen hâl (masaüstü 1440px):
     sayfa başlığı 120px · bölüm başlığı 52px · gövde 14-15px
     oran 120:15 = 8:1   editoryal sitelerde 3:1 – 4:1

   Başlık küçülüyor, gövde büyüyor, ikisi birbirine yaklaşıyor.
   Bu blok dosyanın sonunda: kaynak sırası gereği yukarıdaki tanımları
   eziyor, böylece orijinal ölçek kayıt olarak duruyor.
```

## KALAN KÜÇÜK OKUMA METİNLERİ — 5 Ağustos geri bildirimi

```
KALAN KÜÇÜK OKUMA METİNLERİ — 5 Ağustos geri bildirimi
   ──────────────────────────────────────────────────────────────────────────
   Ölçek düzeltmesinden sonra 20 sayfa tekrar taranınca 16px altında kalan
   gerçek okuma metinleri çıktı. Bunlar etiket değil, paragraf:

     10px  program künyesi (dd)      8 paragraf · doga-temelli-egitimlerimiz
     15px  program anlatısı (p)     20 paragraf · doga-temelli-egitimlerimiz
     15px  pencere anlatısı (p)     10 paragraf · gelecegi-tasarla
     14px  pencere program listesi   5 madde
     14px  konsept listesi           4 madde

   Etiket boyutları (eyebrow, dt, meta) olduğu gibi kalıyor — onlar zaten
   okunmak için değil, işaretlemek için orada.
```

## YENİ MARKA PALETİ — 5 Ağustos geri bildirimi

```
YENİ MARKA PALETİ — 5 Ağustos geri bildirimi
   ──────────────────────────────────────────────────────────────────────────
   "Metin başlıklarında eski logo rengi var, yeni renk turuncu, yeşil.
    Ağırlıkta yeşil kullanabiliriz."

   Kaynak: yeni logonun Pantone ekranları (docs/marka/Pant1-3.png)
     #F05625 turuncu (lale, amblem çemberi)
     #428840 yeşil   (yapraklar)
     #958A54 haki    (harfler, dış halka)

   ── RENKLERİN NEREYE KONACAĞI ÖLÇÜLEREK BELİRLENDİ ────────────────────
   Sayfa zemini #E9E9E0 üzerinde saf değerler:

     turuncu  2.84:1   metin olarak kullanılamaz (24px+ başlık için bile
                       3:1 gerekiyor, o eşiği de geçmiyor)
     yeşil    3.56:1   yalnız 24px ve üstü başlıklarda
     haki     2.85:1   metin olarak kullanılamaz

   Koyu bant #131A15 üzerinde:

     turuncu  5.11:1 ✓   haki 5.09:1 ✓   yeşil 4.07:1 ✗

   Bölüşüm buradan çıkıyor, keyfî değil:

     AÇIK ZEMİN → yeşil   (ağırlık burada, sitenin çoğu açık zemin)
     KOYU BANT  → turuncu (tek yerde parlıyor, orada okunuyor)
     ETİKETLER  → koyulaştırılmış haki, küçük punto 4.5:1 istiyor

   Eski karmen #A82B45 tamamen kalkıyor.
```

## KOYU BANTTA TURUNCU EYLEM DÜĞMESİ

```
KOYU BANTTA TURUNCU EYLEM DÜĞMESİ
   ──────────────────────────────────────────────────────────────────────────
   Ceylan hanım: "yeni renk turuncu, yeşil. Ağırlıkta yeşil kullanabiliriz."

   Ağırlık yeşilde kalıyor — açık zeminin tamamı yeşil, sitenin çoğu açık
   zemin. Turuncu yalnız koyu kapanış bandındaki ana düğmede duruyor, yani
   her sayfada bir kez. Paletin ikinci rengi böylece var ama baskın değil.

   Ölçü: beyaz yazı turuncu üstünde 3.46:1 ile sınıfta kalıyor, koyu yazı
   5.11:1 veriyor. O yüzden yazı koyu.

   Alt bilgideki kural .ftr a.btn-primary (0,2,1) özgüllüğünde tanımlı,
   burada da aynı özgüllük kullanılmazsa rengi ezilmiyor.
```

## VİZYON + MİSYON İKİLİSİ — 5 Ağustos geri bildirimi

```
VİZYON + MİSYON İKİLİSİ — 5 Ağustos geri bildirimi
   "Hakkımızda sayfası çok büyük yazılar, vizyon, misyon alt alta aynı
    sayfada word düzeni gibi, sevmedim öyle."
   İkisi de tek paragraf ama her biri tam bölüm kaplıyordu. Yan yana
   geldiler ve metin fotoğrafın üzerine taşındı.
```

## PALET A — TURUNCU EYLEM, YEŞİL VURGU

```
PALET A — TURUNCU EYLEM, YEŞİL VURGU
   ──────────────────────────────────────────────────────────────────────────
   İlk deneme (açık zemin yeşil, koyu bant turuncu) sayfada kötü duruyordu.
   Sebebi ölçülebilir bir hataydı, zevk meselesi değil:

     1 · Krem zemin #E9E9E0, haki etiket #6E6540 ve yeşil #428840 üçü de
         sıcak sarı-yeşil bölgesinde. Aralarında karşıtlık yok, hepsi
         aynı çamura düşüyordu. Eski karmen kırmızıydı ve kremi kırıyordu;
         onu alınca sayfayı ayakta tutan tek karşıtlık gitti.

     2 · Buton yeşili #2F6A2E kontrast için koyulaştırılmıştı. Canlı yaprak
         yeşilini koyulaştırınca rengin kanı çekiliyor, kurumsal-devlet
         yeşiline dönüyor.

     3 · En büyüğü: logo turuncu, sayfa yeşildi. Üstte turuncu amblem,
         altında yeşil düğme — göz ikisini bağlayamıyordu, logo başka bir
         markadan gelmiş gibi duruyordu.

   Çözüm rolleri değiştirmek oldu:

     TURUNCU  eylem     düğmeler. Logoyla aynı renk, sayfanın odağı.
     YEŞİL    vurgu     italik başlıklar, kart çizgileri, oklar, bağlantı.
     NÖTR GRİ etiket    göz kırpma satırları. Haki kremin üstünde kirliydi.

   "Ağırlıkta yeşil kullanabiliriz" kuralı korunuyor: yeşil hâlâ her
   vurguda; turuncu sayfa başına üç dört düğmede. Önceki hâlde yeşil bütün
   işi yapıyor, turuncu hiç görünmüyordu — o iki renk değil, tek renkti.

   Kontrast: turuncu üstünde koyu yazı 5.11:1 · yeşil italik 5.34:1 ·
   gri etiket 5.20:1 · koyu bantta açık yeşil 8.0:1
```

## TURUNCU YALNIZ ZEMİNDE

```
TURUNCU YALNIZ ZEMİNDE
   ──────────────────────────────────────────────────────────────────────────
   --carmine artık turuncu #F05625. Düğme zemini olarak koyu yazıyla
   5.11:1 veriyor, sorun yok. Ama bu değişken sitede METİN rengi olarak da
   kullanılıyordu: etiketler, sloganlar, bağlantı hover'ları. Turuncu krem
   zeminin üzerinde 2.84:1 — küçük metin için 4.5, büyük metin için 3.0
   isteniyor, ikisini de geçmiyor.

   Ölçümde altı yerde yakalandı; ama hover durumları taramada tetiklenmiyor,
   o yüzden değişkeni metin/çerçeve olarak kullanan bütün seçiciler burada
   yeşile çevriliyor. Koyu bölümdekiler dışarıda — orada turuncu okunuyor.

   Kural: TURUNCU zemin olur, metin olmaz. Metin yeşildir.
```

## EYLEM RENGİ: KOYU MÜREKKEP — turuncu doğru boyutuna iniyor

```
EYLEM RENGİ: KOYU MÜREKKEP — turuncu doğru boyutuna iniyor
   ──────────────────────────────────────────────────────────────────────────
   Turuncu #F05625 düğme zemini olarak kullanılınca sayfada bağırıyordu.
   Sorun rengin tonunda değil, kapladığı alanda: logo turuncuyu 40 piksellik
   bir çemberde kullanıyor, biz onu 170×54 piksellik düz bloklara yaydık.
   Aynı doygunluk elli kat büyüyünce ucuzluyor.

   Çözüm rengi değiştirmek değil, alanı küçültmek. Turuncu şurada kalıyor:

     · logo               (zaten orada, markanın kendi ölçüsü)
     · panel oku hover    34px yuvarlak
     · odak halkası       klavye gezinmesi

   Düğmeler koyu mürekkebe geçiyor. Fotoğraflar ve yeşil vurgu rengi
   taşıyor; düğme yalnız eylemi işaret ediyor, renk yarışına girmiyor.
   "Ağırlıkta yeşil" bozulmuyor — yeşil bütün italik vurgularda,
   kart çizgilerinde ve bağlantılarda duruyor.

   Kontrast: krem yazı #F4F3EC koyu mürekkep #131A15 üzerinde 15.8:1.
   Koyu bantta düğme ters çevriliyor: krem zemin, koyu yazı.
```

## ALT BİLGİ SIKIŞTIRMASI — "sayfalarda boşluklar da çok"

```
ALT BİLGİ SIKIŞTIRMASI — "sayfalarda boşluklar da çok"
   ──────────────────────────────────────────────────────────────────────────
   Alt bilgi ölçüldüğünde 31 sayfanın hepsinde 1071 piksel tutuyordu, yani
   masaüstünde 1.2 ekran. Yedi ekranlık bir sayfada payı %15.

   Yükseklik içerikten değil dolgudan geliyordu:
     çağrı bandı  144px üst + 144px alt = 288px
     sütun bloğu   86px üst +  86px alt = 172px
   İkisi birlikte 460px, yani içerikten çok boşluk.

   İçeriğe dokunulmuyor — telefonlar, adres, bağlantılar aynen duruyor.
```

## PENCERE GİRİŞİ — anlatı başlığın altına, görselin yanına

```
PENCERE GİRİŞİ — anlatı başlığın altına, görselin yanına
   ──────────────────────────────────────────────────────────────────────────
   Başlık bloğu 150px, yanındaki görsel 330px idi; sol sütunun altında
   180 piksellik boşluk kalıyor, anlatı görselin altından yeniden
   başlıyordu. "Sayfalarda boşluklar da çok" ve "metin, görsel, yazı yazı
   gidiyor daha dinamik olabilir" — anlatı yukarı alındı.
```

## ODAK HALKASI — gerçek WCAG hatası düzeltmesi

```
ODAK HALKASI — gerçek WCAG hatası düzeltmesi
   ──────────────────────────────────────────────────────────────────────────
   Odak halkası `--carmine` (turuncu #F05625) kullanıyordu. Krem zemin
   #E9E9E0 üzerinde 2.84:1 veriyor; WCAG 1.4.11 (arayüz bileşeni) ve
   2.4.11 (odak göstergesi) 3:1 istiyor. Sınıfta kalıyordu.

   Metin kontrast denetimleri bunu yakalamıyor — odak halkası bir metin
   rengi değil, `outline-color`. O yüzden "1020 ihlal giderildi" turunda
   da görünmemişti.

   #C6401A tek değerle iki zeminde de geçen tek ton:
     krem #E9E9E0 üzerinde 4.14:1 ✓
     koyu #131A15 üzerinde 3.50:1 ✓
   (#A83A16 kremde 5.24 veriyor ama koyuda 2.77 ile kalıyor.)
```

## ETİKET RENGİ HAKİYE DÖNÜYOR

```
ETİKET RENGİ HAKİYE DÖNÜYOR
   ──────────────────────────────────────────────────────────────────────────
   Palet A'da etiketleri nötr griye (#5C6158) çekmiştim. Yan yana bakınca
   gri jenerik duruyor: büyük harf gri eyebrow her kurumsal şablonda var.
   Haki #6B6340 logonun HARF rengi, yani markanın kendi tonu, ve krem
   zeminde 4.94:1 ile küçük puntoda da geçiyor.

   İlk denemede haki kirli görünmüştü; o zaman yanında doygun turuncu
   düğmeler vardı ve üçü birden aynı sıcak bölgede çakışıyordu. Düğmeler
   koyu mürekkebe geçince haki yerine oturdu.
```

## KÂĞIT TONU — zemin kâğıda yaklaşıyor

```
KÂĞIT TONU — zemin kâğıda yaklaşıyor
   ──────────────────────────────────────────────────────────────────────────
   Eski zemin #E9E9E0'de kırmızı ve yeşil kanal tam eşitti (233/233/224),
   tonu 106.6°. Bu, kâğıt değil beton okuyor. Referans olarak bakılan
   premium botanik/wellbeing sitelerinin hepsinde kademeli R>G>B rampası
   var ve ton 76-92 arasında kümeleniyor.

   #EBE7DB aynı açıklıkta kalıyor (bağıl parlaklık 0.8098 → 0.7993) ama
   tonu 91.6'ya çekiyor. Bütün kontrast çiftleri yeniden hesaplandı,
   hiçbiri eşiğin altına düşmüyor:
     gövde 14.06:1 · soluk 5.14:1 · etiket 4.88:1 · yeşil 5.27:1 · odak 4.09:1
```

## TEK BAŞINA DURAN GİRİŞ PARAGRAFI

```
TEK BAŞINA DURAN GİRİŞ PARAGRAFI
   ──────────────────────────────────────────────────────────────────────────
   .wrap-narrow 1100 piksel; içindeki .lede ise 44ch, yani ~500 piksel.
   Paragraf sola yaslı kalıyor ve sağında 600 pikselden fazla ölü alan
   oluşuyordu — "sayfalarda boşluklar da çok" şikâyetinin görünür örneği.

   Ölçü biraz açılıyor ve blok ortalanıyor: satır uzunluğu okunur
   aralıkta (58ch) kalırken boşluk iki yana simetrik dağılıyor.
```

## GÖRSEL ÇERÇEVELERİ — kırpma kaybı ölçülüp düşürüldü

```
GÖRSEL ÇERÇEVELERİ — kırpma kaybı ölçülüp düşürüldü
   ──────────────────────────────────────────────────────────────────────────
   6 çözünürlük × 31 sayfa taranarak her görselin doğal oranı ile
   çerçevesinin oranı karşılaştırıldı. `object-fit: cover` farkı kesiyor;
   kesilen oran ölçüldü. Fotoğraflarımızın çoğu 3:2 (1.5) ve 4:3 (1.33).

   BULUNAN EN AĞIR ÜÇ KAYIP:
     kat-kapak   %89   4K'da 3840×560, yani 6.9:1 mektup kutusu
     pserit      %68   telefonda 195×400 dar panel
     mz-foto     %56   ızgara satırı görseli dikey esnetiyordu
```

## PANEL ŞERİDİ — tek arka plan, üstünde etiket panelleri

```
PANEL ŞERİDİ — tek arka plan, üstünde etiket panelleri
   ──────────────────────────────────────────────────────────────────────────
   Önceki hâlde her panelin kendi fotoğrafı vardı. Ölçüm: 195×400 piksellik
   dar panelde 3:2 fotoğrafın %68'i kesiliyordu. Dar dikey çerçeveye geniş
   fotoğraf sığmaz; bu ayar değil geometri sorunu.

   Referans (naregitim) fotoğrafı panelin İÇİNE değil ARKASINA koyuyor:
   tam genişlikte tek görsel, panellerin altından boydan boya geçiyor.
   Geniş çerçeveye geniş fotoğraf giriyor, kırpma %68'den ~%10'a iniyor.
```

## ŞERİT ORANI — bant sonsuz genişlemesin

```
ŞERİT ORANI — bant sonsuz genişlemesin
   ──────────────────────────────────────────────────────────────────────────
   Şerit tam genişlikte, yüksekliği ise sabit tavanlıydı. Genişlik büyüdükçe
   oran bozuluyor ve arkadaki fotoğraf üstten kesiliyordu:

     1440 × 620  = 2.3:1   fotoğrafın %35'i gider
     3840 × 620  = 6.2:1   fotoğrafın %91'i gider   ← ölçülen

   İki müdahale: yükseklik genişlikle birlikte bir miktar büyüyor ve çok
   geniş ekranlarda bant kenardan kenara gitmeyi bırakıp ölçüsünü koruyor.
   Sonuç her ekranda ~3:1 civarı, yani kayıp %50 bandında sabit kalıyor —
   arka plan fotoğrafı için kabul edilebilir, çünkü orada fotoğraf içerik
   değil atmosfer; okunan şey üstündeki etiketler.
```

## ODAK NOKTALARI — kırpma kaçınılmazsa konu kurtarılır

```
ODAK NOKTALARI — kırpma kaçınılmazsa konu kurtarılır
   ──────────────────────────────────────────────────────────────────────────
   Kaynak fotoğraflar karışık yönlü: bir kısmı 1600×1067 yatay, bir kısmı
   1200×1600 dikey. Kare bir karoya dikey fotoğraf, geniş bir banda yatay
   fotoğraf koyunca kırpma kaçınılmaz — bu ayar değil geometri.

   Kırpmayı sıfırlamak yerine NEREDEN kesileceği belirleniyor. Atölye
   karelerinde konu (eller, masa, yüzler) karenin üst-orta bandında
   toplanıyor; merkez kırpma alt kenardaki zemini koruyup yüzleri kesiyordu.
```

## KAPAK GENİŞLİĞİ SABİT — 360px'te yatay taşmanın sebebi

```
KAPAK GENİŞLİĞİ SABİT — 360px'te yatay taşmanın sebebi
   ──────────────────────────────────────────────────────────────────────────
   .kat-kapak hem `aspect-ratio: 4/3` hem `min-height: 280px` taşıyor ve
   `width` belirsiz. Tarayıcı genişliği yükseklikten türetiyor:
   280 × 4/3 = 373.33px. 360 piksellik ekranda 13 piksel taşıyordu —
   12 sayfada, yalnız en dar ekranda.

   Genişlik açıkça verilince oran yükseklikten hesaplanıyor, tersi değil.
```

## 320 PİKSEL REFLOW — WCAG 1.4.10

```
320 PİKSEL REFLOW — WCAG 1.4.10
   ──────────────────────────────────────────────────────────────────────────
   1.4.10 Reflow, içeriğin 320 CSS pikselde iki eksenli kaydırma
   gerektirmeden okunabilmesini istiyor. 320 aynı zamanda 1280 pikselde
   %400 yakınlaştırmanın karşılığı, yani görme güçlüğü olan kullanıcının
   gerçekten kullandığı genişlik.

   İki kaynak ölçüldü:
     · .deneyim-vitrin sütun alt sınırı 320px sabitti; 320 piksellik
       ekranda kenar boşluğu düşünce içerik alanı 280px kalıyor ve
       sütun taşıyordu. `min()` ile sütun ekranı geçemiyor.
     · Uzun Türkçe kelimeler ("sürdürülebilirlik", "değerlendirme")
       dar kolonda kırılamıyordu.
```

## MOZAİK — editoryal ölçeğe geçiş

```
MOZAİK — editoryal ölçeğe geçiş
   ──────────────────────────────────────────────────────────────────────────
   İki düzeltme bir arada.

   1 · GRİ BANT HATASI
   `.mz-foto` bir <button>. Izgara hücresi olarak `align-self: start`
   veriliyordu ama düğmeler bu hizalamayı blok eksende uygulamıyor:
   ölçümde düğme 420×524, içindeki görsel 418×418 çıktı — altta 107
   piksellik zemin rengi görünüyordu. Oran doğrudan düğmeye veriliyor,
   görsel de onu dolduruyor.

   2 · ÖLÇEK
   Referans olarak verilen allisonhoodflowerschool.com'da görseller
   600 piksel ve üstü; bizim üç sütunlu mozaikte hücre 420 pikselde
   kalıyordu ve sayfa "küçük küçük" duruyordu.

   İki sütuna inince hücre ~620 piksele çıkıyor, yani referansın ölçüsü.
   Sayfa uzamasın diye fotoğraf oranı 1:1 yerine 3:2: hücre genişler ama
   yükseklik artmaz. 19 hücrelik bir kategoride üç sütun 7 satır × 524px
   = 3668px tutuyordu; iki sütun 10 satır × 413px = 4130px. Görsel iki
   katına çıkarken sayfa yalnız %12 uzuyor.
```

## ÇERÇEVE FOTOĞRAFA UYUYOR — mozaik son hâli

```
ÇERÇEVE FOTOĞRAFA UYUYOR — mozaik son hâli
   ──────────────────────────────────────────────────────────────────────────
   Havuzun 114 karesinin 48'i dikey, 54'ü yatay, 12'si kareye yakın.
   Hepsini tek bir orana zorlamak dikey karelerin yarısını siliyordu:
   teraryum tutan iki kişinin ELİNDEKİ teraryumlar kesiliyordu.

   Oran artık her fotoğrafa satır içi `aspect-ratio` olarak veriliyor
   (`gorsel-olculeri.mjs`). Buradaki kural yalnız o değeri serbest
   bırakıyor; sabit bir oran DAYATMIYOR.

   Satırlar farklı yükseklikte oluyor — istenen bu. Tek tip ızgara yerine
   editoryal bir ritim çıkıyor ve hiçbir kare kırpılmıyor.
```

## HİZALANMIŞ FOTO BANDI — sıfır kırpma + düz satırlar

```
HİZALANMIŞ FOTO BANDI — sıfır kırpma + düz satırlar
   ──────────────────────────────────────────────────────────────────────────
   Bir bandaki karelerin hepsi aynı yükseklikte; genişlikleri kendi
   oranlarına göre değişiyor. Dikey kare dar, yatay kare geniş oluyor,
   bant üstten ve alttan düz kesiliyor.

   Yükseklik CSS'te yazılmıyor: bandın `aspect-ratio` değeri satır içinde
   oranların toplamı olarak veriliyor (h × Σoran = toplam genişlik), her
   kare de `flex-grow` olarak kendi oranını alıyor. Yükseklik böylece
   kendiliğinden doğru çıkıyor ve hiçbir kare kırpılmıyor.
```

## SIRAYLA BİR YAZI BİR FOTOĞRAF — mozaiğin son hâli

```
SIRAYLA BİR YAZI BİR FOTOĞRAF — mozaiğin son hâli
   ──────────────────────────────────────────────────────────────────────────
   Bant deseni masaüstünde çalışıyordu ama telefonda tek sütuna inince
   "üç fotoğraf, iki yazı" diye topaklanıyordu. Akış artık birebir
   dönüşümlü: iki sütunda her satır [yazı][fotoğraf], tek sütunda da
   aynı ritim iniyor.

   Fotoğraflar üç standart çerçeveden birine oturuyor (3:4 · 1:1 · 3:2),
   oran satır içinde veriliyor. Sayfada yalnız üç farklı yükseklik
   olduğu için göz düzeni yakalıyor, kırpma da yüzde onun altında kalıyor.
```

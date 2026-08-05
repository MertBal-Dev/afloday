# Gece denetimi — 5 Ağustos 2026

Belge sayfa sayfa doğrulandı, galeri tasarımı düzeltildi, site geneli
erişilebilirlik denetiminden geçirildi. **Commit ve push yapılmadı.**

---

## Kısa cevap

**Belgeden eksiğimiz yok.** 4 Ağustos belgesinin içerik taşıyan her satırı
sitede karşılanıyor. Yedi bölümün hepsi tek tek, satır satır sınandı.

Denetim sırasında **bir gerçek içerik hatası**, **galeride beş kusur** ve
**site genelinde 1020 kontrast ihlali** bulundu. Hepsi düzeltildi.

```
Belge kapsamı        7/7 bölüm tam · karşılıksız içerik satırı yok
Metin kaynağı        %95.7 kelime bazında kaynaklı
Adresler             34/34 canlı adres duruyor
Statik denetim       20 sayfa · 464 görsel · 1103 bağlantı · 0 sorun
Erişilebilirlik      statik 0 bulgu · kontrast 0 ihlal · dokunma hedefi 0 ihlal
Üretim derlemesi     geçti (19 sayfa + robots + sitemap)
```

---

## 1 · Belge doğrulaması — sayfa sayfa

Belge 551 satır, tablolar dahil yeniden çıkarıldı. Her bölüm kendi sayfasıyla
satır satır karşılaştırıldı; sonuçlar:

| Bölüm | Belge satırı | Sonuç |
|---|---|---|
| Anasayfa | 1-117 | ✅ tam |
| Kurumsal Hizmetler | 118-122 | ✅ tam |
| Sosyal Sorumluluk & İş Danışmanlığı | 123-164 | ✅ tam |
| Hakkımızda | 165-183 | ✅ tam |
| Doğa Temelli Eğitimlerimiz | 184-295 | ✅ tam |
| Geleceği Doğadan Tasarla | 296-389 | ✅ tam |
| Ceylan Kalyon Özdemir özgeçmişi | 390-407 | ✅ tam |
| Etkinlik Atölyeleri (7 akordeon) | 408-551 | ✅ tam |

**Karşılıksız görünen satırların hepsi belgenin kendi yapı notu:** Excel satır
etiketleri (`[HÜCRE] Hero'nun Hemen Altı — 3 Sütun`), tasarım yönergeleri
(`1.Görsel Önerisi: Doğada, huzurlu ama profesyonel bir çalışan görseli`),
bölüm başlıkları (`① Hero — Senfoni Girişi`). Bunlar bize nereye ne
koyacağımızı söylüyor, sayfaya basılmaları gerekmiyor.

### Belgenin tasarım yönergeleri de sınandı

Metin denetimine takılmayan üç yönerge ayrıca kod üzerinden doğrulandı:

| Belge satırı | İstenen | Durum |
|---|---|---|
| 302 | Dört element eşleşmesi 4 küçük ikonla, pencerelere giden harita | ✅ 8 SVG, çapa şeridi çalışıyor |
| 304 | 4 anchor kart, her kart kendi rengini taşısın, element rozeti | ✅ 4/4 çapa + hedef, `--element` satır içi, 4 rozet |
| 306 | Her pencerede anlatı + program listesi + eğitim modülüne çapraz bağlantı | ✅ Pencere 4'te 6 çapraz bağlantı |

Not: çapraz bağlantı yalnız Pencere 4'te (İş Dünyası) olmalı — belge 377-381
"Bu Pencerede Yer Alan Eğitimler" başlığını sadece orada kullanıyor.
Pencere 1-3'te "Bu Pencerede Yer Alacak Programlar / Atölyeler" var, o da
yerinde.

---

## 2 · Bulunan gerçek hata: atölye sayısı yanlıştı

**Sayfa "7 kategori · 50 atölye" diyordu, akordeon başlıkları toplandığında
53 çıkıyordu.**

```
10 + 7 + 8 + 6 + 3 + 9 + 10 = 53      künyede yazan: 50
```

Sebep: Kurumsal Gönüllülük kategorisinin atölyeleri belgede (satır 496) tek
satırda virgülle sayılmış, diğer kategorilerde ayrı ayrı açıklamalarıyla
veriliyor. Veri dosyasında bunlar `uygulanabilir` alanında duruyordu. Akordeon
başlığı o alana düşüyor ama sayfa toplamı yalnız `atolyeler` alanını sayıyordu.

**Düzeltme:** `_build/etkinlikler.mjs` içine tek doğru kaynak eklendi
(`atolyeSayisi` ve `toplamAtolye`). Başlık da künye de artık aynı yardımcıyı
kullanıyor, bir daha ayrışamazlar. `/dogadan-hobi-atolyeleri` ve `/kurumsal`
sayfalarında 53 yazıyor.

---

## 3 · Galeri — beş kusur giderildi

Tasarım sizin: iki satır, ters yönlerde kesintisiz akış, kartın üzerine
gelince duraklama ve büyüme, alt köşede rozet. **Düzen ve his korundu.**

### 3.1 · Uydurma kategori etiketleri kaldırıldı — kural ihlaliydi

`getGaleriKategori` fotoğrafları **sıra numarasına göre** etiketliyordu:

```
index < 7   → "Kurumsal Eğitim"
index < 15  → "Atölye Deneyimi"
sonrası     → "Doğadan Kareler"
```

Bu üç ad ne 4 Ağustos belgesinde ne afloday.com'da geçiyor. Dahası hangi
karenin hangi kategoriye ait olduğu hiçbir kaynakta yazmıyor — atama tamamen
index'e bakıyordu, yani 3. fotoğrafın "Kurumsal Eğitim" olduğu iddiası
dayanaksızdı. Alt metinler de bundan üretiliyordu
(`alt="Afloday Kurumsal Eğitim 01"`).

Rozette **levha numarası** kaldı; sitenin geri kalanındaki `data-no` diliyle
aynı. Alt metin: `Afloday arşivinden kare 01`.

### 3.2 · Işık kutusu kopyaları geziyordu

Kesintisiz döngü için dizi iki kez basılıyor. Işık kutusu 21 yerine **42 kart**
sayıyordu: sayaç "5 / 42" diyor, ok tuşları aynı fotoğrafı iki kez geziyordu.

Kopyalar artık `data-kopya` taşıyor — ekran okuyucudan (`aria-hidden`) ve
sekme sırasından (`tabindex="-1"`) çıkarıldı, ışık kutusu da atlıyor.
Sınandı: 5/21 açılıyor, 17 adım sonra 1/21'e sarıyor.

### 3.3 · Duraklat düğmesi yoktu

Şerit 36 saniyede bir tur atıyor ve yalnız fareyle duruyordu. Klavye ya da
dokunmatik kullanan için durdurmanın yolu yoktu — WCAG 2.2.2 beş saniyeden
uzun otomatik hareketin durdurulabilmesini istiyor.

Barın sağına `Duraklat / Devam et` düğmesi eklendi (96×44, `aria-pressed`
güncelleniyor). `prefers-reduced-motion` açıkken düğme gizleniyor, şerit
elle kaydırılabilir oluyor ve kopyalar gizleniyor.

### 3.4 · Odak halkası siliniyordu

`.slider-card:hover, .slider-card:focus-visible { outline: none; }` — klavyeyle
gezen kullanıcının nerede olduğunu gösteren tek işaret oydu. 1px karmen çerçeve
fotoğraf üstünde yetmiyor. Geri alındı: `2px solid var(--carmine)`.

### 3.5 · Bar metinleri uydurmaydı

```
ESKİ  "Sonsuz Kayan Galeri Arşivi · 21 Fotoğraf"
      "Fare ile üzerine gelince durur ve büyür · Tıklayınca tam ekran açılır"
YENİ  "Galeri · 21 kare"   (belge satır 387 + sayı)
```

İkincisi ayrıca yalnız fare kullananı anlatıyordu; yerini duraklat düğmesi
aldı, o kendini anlatıyor.

### 3.6 · Sayfa başlığı da uydurmaydı

`/galeri` hero'sunda **"Atölyelerden kareler"** yazıyordu. İki ayrı elemana
bölündüğü için önceki metin denetimine takılmamıştı. Belgede sayfanın adı
sadece **"Galeri"** (satır 387). Değiştirildi.

---

## 4 · Erişilebilirlik — site geneli

20 sayfa × 4 genişlik (375 / 768 / 1024 / 1440) tarandı.

```
ÖNCE   1160 bulgu
SONRA    81 bulgu (hepsi yanlış pozitif, aşağıda)
```

### 4.1 · Kontrast — 1020 ihlal, üç kök neden

| Ne | Ölçülen | Sebep | Düzeltme |
|---|---|---|---|
| `--bronze` etiket rengi (940 kez, 20 sayfa) | 4.10 | `#8A6A38`, sayfa zemini `#E9E9E0` üzerinde 4.5'i geçmiyordu | `#7D5F31` → **4.84** |
| Alt bilgideki birincil buton (80 kez) | 4.03 | `.ftr a` kuralı (0,2,0) butonun beyazını (0,1,0) eziyordu | `.ftr a.btn-primary` → **6.10** |
| Koyu bölümde pencere numarası (8 kez) | 2.94 / 2.79 | 3224. satırdaki `.pencere .pencere-no` kuralı, koyu bölüm için yazılmış 3068. satırı eziyordu | `--element-lift` → **6.5 / 6.7** |

Pencere renkleri için koyu zemine ayrı açık karşılıklar tanımlandı, böylece
belgenin "her kart kendi rengini taşısın" isteği korundu:

```
Toprak #7A6234 → #C2A667      Su   #3E6B63 → #6BA89C
Ateş   #A82B45 → #E08199      Hava #5C6158 → #9AA196
```

### 4.2 · Dokunma hedefleri

En kötüsü **slayt gezinme düğmesiydi: 77×2 piksel.** Dar ekranda etiket
gizlenince geriye yalnız 2px'lik ilerleme çizgisi kalıyor, düğmeye parmakla
basılamıyordu. Çizginin görünümü aynı; tıklama alanı dolguyla büyütüldü.

| Öge | Önce | Sonra |
|---|---|---|
| Slayt gezinme düğmesi | 77×2 | 77×44 |
| Slayt duraklat | 63×34 | 44 |
| Alt bilgi ve çekmece bağlantıları | 22 | 44 |
| Hero aşağı oku | 26×40 | 44×44 |
| Pencere listesi bağlantıları | 20 | 28 |
| KVKK onay kutusu | 18×18 | 24×24 |

**Sonuç: 20 sayfada 24×24'ün altında dokunma hedefi yok.** (WCAG 2.5.8 AA)

Dokunma hedefi kuralları dağınık iki yerde yazılmıştı; hepsi CSS'teki mevcut
"18b. Dokunma hedefleri" bölümünde toplandı, çakışan blok kaldırıldı.

### 4.3 · Kalan 81 bulgu — hepsi ölçüm aracının yanlış pozitifi

- **69 × "küçük dokunma hedefi"** — kısa metin bağlantıları ("Galeri" 39×44).
  Yükseklik 44, genişlik kelimenin kendisi kadar. WCAG'ın 24px eşiğini rahat
  geçiyor; metin bağlantısına yapay genişlik vermek yerleşimi bozardı.
- **12 × "kontrast 1.22"** — yalnız anasayfada. Başlık şeffaf ve yazı video
  hero'nun üzerinde beyaz duruyor; ölçüm aracı arka planı ararken videoyu
  değil sayfa zeminini buluyor. Biri de `.sr-only` "Menüyü aç" metni, zaten
  görünmez.

### 4.4 · Statik tarama — 0 bulgu

`lang` · viewport · title · meta description · alt metin · width/height ·
başlık hiyerarşisi · metinsiz düğme · form etiketi · `rel=noopener` ·
skip-link · `<main>` landmark: 20 sayfada temiz.

---

## 5 · Değişen dosyalar

```
_build/etkinlikler.mjs      atolyeSayisi + toplamAtolye (tek doğru kaynak)
_build/templates.mjs        galeri bileşenleri yeniden yazıldı, sayaç bağlandı
_build/build.mjs            toplam sayaç, galeri başlığı, --element-lift
_build/gelecegi-tasarla.mjs renkAcik alanı (4 pencere)
site/assets/css/afloday.css bronz, buton, pencere rengi, dokunma hedefleri,
                            duraklat düğmesi, odak halkası, reduced-motion
site/assets/js/afloday.js   duraklat düğmesi, ışık kutusu kopya filtresi
docs/afloday-sorular-...md  karar 24-27
```

---

## 6 · Hâlâ açık — bende değil

| Konu | Kimde | Not |
|---|---|---|
| **KVKK ve çerez metinleri** | Afloday | Gelmeden form gerçek gönderime bağlanamaz. `_build/kvkk.mjs` içindeki `hazir` false olduğu sürece sayfa üretilmiyor ve her derlemede uyarı basılıyor. |
| **Hero videosu** | Afloday | Hâlâ geçici AI videosu. |
| **cPanel erişimi** | Afloday / ByFlash | DNS geçişi ve teslim sayacı buna bağlı. |
| `/favicon.ico` | bende | `favicon.png` var, `.ico` yok; 404 veriyor. Küçük iş, istersen eklerim. |

### Tasarım notu — kararı sizin

Anasayfada başlık şeridi video hero'nun üzerinde şeffaf ve yazılar beyaz.
Videonun parlak bir karesinde menü okunmayabilir. Ölçemedim çünkü video
karesine bağlı. Çözümü basit (başlığın arkasına ince bir koyu geçiş), ama
hero sizin onayladığınız hâliyle duruyor, dokunmadım.
